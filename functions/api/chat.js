// POST /api/chat  (buyer web). Notifikasi chat lewat bot CS (TELEGRAM_CS_BOT_TOKEN).
import { db, tg, esc, json } from '../_lib.js';
const UUID = /^[0-9a-f-]{36}$/i;
const bot = t => { t = t.toLowerCase();
  if (/(halo|hai|permisi|assalam)/.test(t)) return 'Halo kak! Mau tanya soal pembayaran, proses, atau cek pesanan? Kalau butuh admin, tekan Hubungi admin.';
  if (/(bayar|qris|transfer)/.test(t)) return 'Untuk informasi pembayaran, silakan lihat metode pembayaran yang tersedia saat checkout ya kak.';
  if (/(invoice|pesanan|status)/.test(t)) return 'Untuk cek status pesanan, silakan masukkan invoice kamu di menu Riwayat website ya kak.';
  if (/(harga|pricelist|promo)/.test(t)) return 'Untuk cek harga terbaru, silakan lihat langsung di menu utama website kami ya kak.';
  return 'Halo kak! Terima kasih sudah menghubungi GH TOP-UP. Tekan Hubungi admin jika butuh dibantu langsung.'; };
export async function onRequestPost({ request, env }) {
  const b = await request.json().catch(() => ({})), T = env.TELEGRAM_CS_BOT_TOKEN, A = env.TELEGRAM_CHAT_ID;
  const say = (sid, sender, body) => db(env, 'gh_chat_messages', { method: 'POST', body: { session_id: sid, sender, body }, prefer: 'return=minimal' });
  const note = async (sid, text, quiet) => { const r = await tg(T, 'sendMessage', { chat_id: A, text, parse_mode: 'HTML', disable_notification: quiet });
    if (r.result) await db(env, 'gh_chat_map', { method: 'POST', body: { tg_message_id: r.result.message_id, session_id: sid }, prefer: 'return=minimal' }); };
  let s = UUID.test(b.session || '') ? (await db(env, `gh_chat_sessions?id=eq.${b.session}&select=*`))?.[0] : null;
  if (b.action === 'start' && !s) { s = (await db(env, 'gh_chat_sessions', { method: 'POST', body: {} }))?.[0];
    if (s) await say(s.id, 'bot', 'Halo! Aku bot GH TOP-UP. Tanya soal pembayaran, proses, atau cek pesanan. Kalau butuh admin, tekan Hubungi admin.'); }
  if (!s?.id) return json({ error: 'Sesi tidak ditemukan' }, 404);
  const code = 'S-' + s.id.slice(0, 4).toUpperCase(); let mode = s.mode;
  const touch = x => db(env, `gh_chat_sessions?id=eq.${s.id}`, { method: 'PATCH', body: { last_at: new Date().toISOString(), ...x }, prefer: 'return=minimal' });
  if (b.action === 'send') {
    const t = String(b.text || '').trim().slice(0, 500); if (!t) return json({ error: 'Pesan kosong' }, 400);
    const recent = await db(env, `gh_chat_messages?select=id&session_id=eq.${s.id}&sender=eq.buyer&created_at=gt.${new Date(Date.now() - 6e4).toISOString()}`);
    if ((recent || []).length >= 10) return json({ error: 'Terlalu cepat, tunggu sebentar ya' }, 429);
    await say(s.id, 'buyer', t);
    await note(s.id, `💬 <b>${code}</b>${mode === 'human' ? '' : ' (bot)'}\n${esc(t)}`, mode !== 'human');
    if (mode === 'bot') await say(s.id, 'bot', bot(t));
    await touch({});
  }
  if (b.action === 'human' && mode !== 'human') { mode = 'human'; await touch({ mode });
    await say(s.id, 'bot', 'Mohon tunggu sebentar ya kak, pesan kamu sudah diteruskan ke Admin kami.');
    await note(s.id, `🔔 <b>${code}</b> minta dibalas admin.\nBalas (Reply) pesan ini, atau /balas ${s.id} pesan. Ketik /selesai untuk kembali ke bot.`, false); }
  const m = await db(env, `gh_chat_messages?select=id,sender,body&session_id=eq.${s.id}&id=gt.${+b.after || 0}&order=id.asc&limit=100`);
  return json({ session: s.id, mode, messages: m || [] });
}

