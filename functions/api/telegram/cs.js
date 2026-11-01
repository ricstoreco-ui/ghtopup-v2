// Webhook bot CS (TELEGRAM_CS_BOT_TOKEN): admin membalas buyer. Tanpa hak administrasi toko.
import { db, tg } from '../../_lib.js';

// Buka https://ghtopup-v2.pages.dev/api/telegram/cs di browser: kalau muncul teks ini, function sudah ter-deploy.
export const onRequestGet = () => new Response('cs bot aktif');

export async function onRequestPost({ request, env }) {
  if (!env.WEBHOOK_SECRET || request.headers.get('x-telegram-bot-api-secret-token') !== env.WEBHOOK_SECRET) return new Response('forbidden', { status: 403 });
  const A = String(env.TELEGRAM_CHAT_ID || '').trim(), T = env.TELEGRAM_CS_BOT_TOKEN, m = (await request.json().catch(() => ({}))).message;
  if (!m?.from) return new Response('ok');

  // Pengirim/chat bukan admin: balas dengan ID-nya supaya TELEGRAM_CHAT_ID bisa dicocokkan.
  if (!A || String(m.from.id) !== A || String(m.chat?.id) !== A) {
    try {
      await tg(T, 'sendMessage', { chat_id: m.chat?.id || m.from.id, text: 'Akses ditolak. ID Telegram kamu: ' + m.from.id + (String(m.chat?.id) !== String(m.from.id) ? '\nID chat ini: ' + m.chat?.id : '') + (A ? '' : '\n(TELEGRAM_CHAT_ID belum diisi di Cloudflare)') });
    } catch (e) { console.error('cs bot tolak', e.message); }
    return new Response('ok');
  }
  if (!m.text) return new Response('ok');

  const note = text => tg(T, 'sendMessage', { chat_id: A, text });
  try {
    let text = m.text.trim();
    if (text === '/start') { await note('Bot CS aktif. Balas (Reply) pesan buyer, atau /balas SESSION_ID pesan. Ketik /selesai untuk menutup sesi.'); return new Response('ok'); }
    const UUID = /^[0-9a-f-]{36}$/i; let sid = null;
    const bl = /^\/balas\s+(\S+)\s+([\s\S]+)/.exec(text);
    if (bl) { if (!UUID.test(bl[1])) { await note('Format: /balas SESSION_ID pesan'); return new Response('ok'); } sid = bl[1]; text = bl[2]; }
    else if (m.reply_to_message) sid = (await db(env, `gh_chat_map?select=session_id&tg_message_id=eq.${m.reply_to_message.message_id}`))?.[0]?.session_id;
    if (!sid) sid = (await db(env, 'gh_chat_sessions?select=id&mode=eq.human&order=last_at.desc&limit=1'))?.[0]?.id;
    if (!sid) { await note('Tidak ada sesi chat aktif. Balas (Reply) pesan buyer.'); return new Response('ok'); }
    const now = new Date().toISOString();
    if (text === '/selesai') {
      await db(env, `gh_chat_sessions?id=eq.${sid}`, { method: 'PATCH', body: { mode: 'bot', last_at: now }, prefer: 'return=minimal' });
      await db(env, 'gh_chat_messages', { method: 'POST', body: { session_id: sid, sender: 'bot', body: 'Sesi dengan admin sudah selesai. Kamu kembali ke bot, tanya lagi kapan saja ya.' }, prefer: 'return=minimal' });
      await note('✅ Sesi ditutup.');
    } else {
      const r = await db(env, 'gh_chat_messages', { method: 'POST', body: { session_id: sid, sender: 'admin', body: text.slice(0, 1000) } });
      await db(env, `gh_chat_sessions?id=eq.${sid}`, { method: 'PATCH', body: { mode: 'human', last_at: now }, prefer: 'return=minimal' });
      await note(r?.[0] ? '✅ Terkirim ke web.' : '❌ Gagal menyimpan balasan.');
    }
  } catch (e) {
    console.error('cs bot', e.message);
    try { await note('⚠️ Error: ' + String(e.message || e).slice(0, 200)); } catch (_) { /* abaikan */ }
  }
  return new Response('ok');
}
