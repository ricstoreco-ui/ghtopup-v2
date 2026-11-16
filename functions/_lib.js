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

// ==========================================
// FITUR BARU: DEAD-LINK CHECKER & BACKUP
// ==========================================

export async function checkUrl(url, timeoutMs = 8000) {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const r = await fetch(url, { method: 'GET', signal: ctrl.signal, redirect: 'follow' });
    clearTimeout(timer);
    try { await r.body?.cancel(); } catch (e) {}
    if (r.ok) return { status: 'ok', code: r.status };
    if (r.status === 404 || r.status === 410) return { status: 'dead', code: r.status };
    if (r.status === 401 || r.status === 403) return { status: 'forbidden', code: r.status };
    return { status: 'error', code: r.status };
  } catch (e) {
    if (e.name === 'AbortError') return { status: 'timeout', code: 0 };
    return { status: 'error', code: 0 };
  }
}

export async function collectUrls(env) {
  const urls = [];
  const push = (table, r, col, label) => {
    const u = r[col];
    if (u && typeof u === 'string' && /^https?:\/\//i.test(u)) {
      urls.push({ table_name: table, row_id: String(r.id ?? r.key), row_label: label(r), column_name: col, url: u });
    }
  };
  const [products, games, pms, gb, bn, st] = await Promise.all([
    db(env, 'products?select=id,name,icon_url,logo_url'),
    db(env, 'games?select=id,name,logo_url,pricelist_url'),
    db(env, 'gh_payment_methods?select=id,name,logo_url,image_url,logo_url2'),
    db(env, 'gh_banners?select=id,title,image_url'),
    db(env, 'banners?select=id,image_url'),
    db(env, 'settings?select=key,value&key=in.(logo_bca,logo_dana,qris_image_url,qris_url)'),
  ]);
  (products || []).forEach(r => { push('products', r, 'icon_url', x => x.name); push('products', r, 'logo_url', x => x.name); });
  (games || []).forEach(r => { push('games', r, 'logo_url', x => x.name); push('games', r, 'pricelist_url', x => x.name); });
  (pms || []).forEach(r => { push('gh_payment_methods', r, 'logo_url', x => x.name); push('gh_payment_methods', r, 'image_url', x => x.name); push('gh_payment_methods', r, 'logo_url2', x => x.name); });
  (gb || []).forEach(r => push('gh_banners', r, 'image_url', x => x.title || 'Banner'));
  (bn || []).forEach(r => push('banners', r, 'image_url', x => 'Banner ' + x.id));
  (st || []).forEach(r => push('settings', r, 'value', x => x.key));
  return urls;
}

export async function scanDeadLinks(env, actor = 'manual', force = false) {
  const urls = await collectUrls(env);
  let pending = urls;
  if (!force) {
    const cutoff = new Date(Date.now() - 6 * 3600000).toISOString();
    const recent = await db(env, `dead_links?last_checked_at=gt.${cutoff}&select=table_name,row_id,column_name`);
    const keys = new Set((recent || []).map(r => `${r.table_name}|${r.row_id}|${r.column_name}`));
    pending = urls.filter(u => !keys.has(`${u.table_name}|${u.row_id}|${u.column_name}`));
  }
  const LIMIT = 35; // Aman di bawah limit Cloudflare (50 subrequest)
  const toScan = pending.slice(0, LIMIT);
  const remaining = pending.length - toScan.length;
  const results = [];
  const started = Date.now();
  
  for (let i = 0; i < toScan.length; i += 10) {
    const batch = toScan.slice(i, i + 10);
    const rs = await Promise.all(batch.map(async u => ({ ...u, ...(await checkUrl(u.url)) })));
    results.push(...rs);
  }
  
  const enriched = [];
  for (const r of results) {
    try {
      const saved = await db(env, 'dead_links?on_conflict=table_name,row_id,column_name', {
        method: 'POST',
        body: { table_name: r.table_name, row_id: r.row_id, row_label: r.row_label, column_name: r.column_name, url: r.url, status: r.status, status_code: r.code, last_checked_at: new Date().toISOString() },
        prefer: 'resolution=merge-duplicates,return=representation'
      });
      enriched.push({ ...r, dl_id: saved?.[0]?.id });
    } catch (e) { enriched.push(r); }
  }
  
  const dead = enriched.filter(r => r.status !== 'ok');
  const ok = enriched.filter(r => r.status === 'ok');
  const counts = { ok: ok.length, dead: 0, forbidden: 0, timeout: 0, error: 0 };
  dead.forEach(d => { counts[d.status] = (counts[d.status] || 0) + 1; });
  
  await db(env, 'dead_link_scans', { method: 'POST', body: { triggered_by: actor, total_urls: toScan.length, ok_count: counts.ok, dead_count: counts.dead, forbidden_count: counts.forbidden, timeout_count: counts.timeout, other_count: counts.error, duration_ms: Date.now() - started, details: dead } });
  
  return { scanned: toScan.length, deadList: dead, okList: ok, counts, remaining, totalUrls: urls.length };
}

export async function backupProject(env) {
  const repo = env.GH_REPO || 'ricstoreco-ui/ghtopup-v2';
  let schemaText = '';
  try {
    const r = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/sys_dump_schema`, { method: 'POST', headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json' }, body: '{}' });
    schemaText = await r.text();
  } catch (e) { schemaText = '-- GAGAL DUMP SCHEMA: ' + e.message; }
  
  const settings = await db(env, 'settings?select=key,value&order=key') || [];
  let settingsText = '\n--- SITE SETTINGS ---\n';
  settings.forEach(s => { settingsText += `${s.key} = ${JSON.stringify(s.value)}\n`; });
  
  let ghFiles = '\n--- GITHUB FILES ---\n';
  try {
    const tree = await fetch(`https://api.github.com/repos/${repo}/git/trees/main?recursive=1`).then(r => r.json());
    const files = (tree.tree || []).filter(f => f.type === 'blob' && /\.(js|html|json|css|md|sql|yml|yaml|toml)$/.test(f.path) && f.size <= 500000);
    for (const f of files) {
      try {
        const c = await fetch(`https://raw.githubusercontent.com/${repo}/main/${f.path}`).then(r => r.text());
        ghFiles += `\n\n// FILE: ${f.path}\n// ==========================================\n${c}`;
      } catch (e) { ghFiles += `\n// GAGAL FETCH: ${f.path}\n`; }
    }
  } catch (e) { ghFiles += `\n// GAGAL FETCH GITHUB: ${e.message}\n`; }
  
  return schemaText + '\n\n' + settingsText + '\n\n' + ghFiles;
                                                                               }
