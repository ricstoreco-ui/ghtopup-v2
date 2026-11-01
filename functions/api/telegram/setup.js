// Daftar webhook otomatis: token bot dan WEBHOOK_SECRET dibaca langsung dari Cloudflare, jadi pasti cocok.
// Buka di browser: https://ghtopup-v2.pages.dev/api/telegram/setup (bot admin)
// Untuk bot CS nanti: https://ghtopup-v2.pages.dev/api/telegram/setup?bot=cs
// Hasilnya tidak menampilkan token maupun secret.
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const cs = url.searchParams.get('bot') === 'cs';
  const token = cs ? env.TELEGRAM_CS_BOT_TOKEN : env.TELEGRAM_BOT_TOKEN;
  const secret = env.WEBHOOK_SECRET;
  const hook = url.origin + (cs ? '/api/telegram/cs' : '/api/telegram/admin');
  const out = t => new Response(t, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
  if (!token) return out('GAGAL: token bot ' + (cs ? 'CS' : 'admin') + ' belum diisi di Cloudflare.');
  if (!secret) return out('GAGAL: WEBHOOK_SECRET belum diisi di Cloudflare.');
  try {
    const call = async (method, body) => (await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {})
    })).json();
    const set = await call('setWebhook', { url: hook, secret_token: secret, allowed_updates: ['message', 'callback_query'] });
    const info = await call('getWebhookInfo');
    const r = info.result || {};
    return out([
      'Bot: ' + (cs ? 'CS' : 'admin'),
      'Daftar webhook: ' + (set.ok ? 'OK' : 'GAGAL - ' + (set.description || 'tidak diketahui')),
      'Alamat terdaftar: ' + (r.url || '-'),
      'Antrian pending: ' + (r.pending_update_count ?? '-'),
      'Error terakhir: ' + (r.last_error_message || 'tidak ada'),
      '',
      set.ok ? 'Sekarang kirim /menu ke bot.' : 'Kalau GAGAL, simpan ulang WEBHOOK_SECRET di Cloudflare (huruf/angka saja, tanpa spasi), redeploy, lalu buka halaman ini lagi.'
    ].join('\n'));
  } catch (e) {
    return out('GAGAL: ' + String(e.message || e).split(token).join('***'));
  }
}
