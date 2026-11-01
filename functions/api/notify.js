// POST /api/notify {invoice, kind:'proof'}: kirim notifikasi ke bot admin HANYA saat pembeli sudah kirim bukti transfer.
// kind:'order' (pesanan baru dibuat, belum bayar) sengaja diabaikan supaya Telegram tidak kebanjiran notif dari pembeli yang batal.
import { db, tg, esc, json, signProof } from '../_lib.js';
export async function onRequestPost({ request, env }) {
  const { invoice, kind } = await request.json().catch(() => ({}));
  if (!/^GH-[0-9A-F]{8}$/.test(invoice || '') || !['order', 'proof'].includes(kind)) return json({ error: 'bad' }, 400);
  if (kind !== 'proof') return json({ ok: true, skipped: true });
  const o = (await db(env, `orders?invoice=eq.${invoice}&select=*`))?.[0];
  if (!o || o.status !== 'waiting_review') return json({ ok: false });
  const ins = await db(env, 'settings?on_conflict=key', { method: 'POST', body: { key: `private_n_${kind}_${invoice}`, value: '1' }, prefer: 'resolution=ignore-duplicates,return=representation' });
  if (!ins?.length) return json({ ok: true, dup: true });
  const cap = `🧾 <b>BUKTI TRANSFER MASUK</b>\nInvoice: <code>${invoice}</code>\n${esc(o.game_name)} - ${esc(o.product_name)}\nUser ID: ${esc(o.game_user_id)}${o.server_id ? ' (' + esc(o.server_id) + ')' : ''}\nWA: ${esc(o.wa)}\nTotal: Rp ${Number(o.total).toLocaleString('id-ID')}\nMetode: ${esc(o.payment_method || '-')}`;
  const kb = { inline_keyboard: [[{ text: '✅ Sukses', callback_data: 'ok_' + invoice }, { text: '❌ Gagal', callback_data: 'no_' + invoice }]] };
  const url = o.proof_url ? await signProof(env, o.proof_url) : null;
  if (url) await tg(env.TELEGRAM_BOT_TOKEN, 'sendPhoto', { chat_id: env.TELEGRAM_CHAT_ID, photo: url, caption: cap, parse_mode: 'HTML', reply_markup: kb });
  else await tg(env.TELEGRAM_BOT_TOKEN, 'sendMessage', { chat_id: env.TELEGRAM_CHAT_ID, text: cap, parse_mode: 'HTML', reply_markup: kb });
  return json({ ok: true });
}
