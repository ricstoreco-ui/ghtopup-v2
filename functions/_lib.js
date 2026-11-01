// Helper bersama untuk Cloudflare Pages Functions. Secret hanya dibaca dari env, tidak pernah ke frontend.
export const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });
export const esc = s => String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
export const db = (env, path, o = {}) => fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, {
  method: o.method || 'GET',
  headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: o.prefer || 'return=representation' },
  body: o.body ? JSON.stringify(o.body) : undefined
}).then(r => r.json().catch(() => null));
export const tg = (token, method, body) => fetch(`https://api.telegram.org/bot${token}/${method}`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
}).then(r => r.json()).catch(() => ({}));
export const setting = (env, key, value) => db(env, 'settings?on_conflict=key', { method: 'POST', body: { key, value: String(value) }, prefer: 'resolution=merge-duplicates' });
export const signProof = async (env, path) => {
  const r = await fetch(`${env.SUPABASE_URL}/storage/v1/object/sign/bukti-transfer/${path}`, { method: 'POST',
    headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ expiresIn: 600 }) });
  const j = await r.json().catch(() => ({}));
  return j.signedURL ? `${env.SUPABASE_URL}/storage/v1${j.signedURL}` : null;
};
export async function cleanupFailed(env, actor) {
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/gh_cleanup`, { method: 'POST',
    headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_actor: actor }) });
  return r.ok ? await r.json() : -1;
}
export async function cleanupProofs(env, actor) {
  const old = new Date(Date.now() - 3 * 864e5).toISOString();
  const rows = await db(env, `orders?select=invoice,proof_url&proof_url=not.is.null&created_at=lt.${old}&limit=500`) || [];
  if (!rows.length) return 0;
  const r = await fetch(`${env.SUPABASE_URL}/storage/v1/object/bukti-transfer`, { method: 'DELETE',
    headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefixes: rows.map(x => x.proof_url) }) });
  if (!r.ok) return -1;
  for (const x of rows) await db(env, `orders?invoice=eq.${x.invoice}`, { method: 'PATCH', body: { proof_url: null } });
  await db(env, 'activity_logs', { method: 'POST', body: { actor, action: 'cleanup_proofs', detail: rows.length + ' bukti dihapus' } });
  return rows.length;
}

