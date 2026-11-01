// POST /api/notify {invoice, kind:'order'|'proof'}: kirim notifikasi pesanan ke bot admin. Data selalu dibaca dari database.
import { db, tg, esc, json, signProof } from '../_lib.js';
export async function onRequestPost({ request, env }) {
  const { invoice, kind } = await request.json().catch(() => ({}));
  if (!/^GH-[0-9A-F]{8}$/.test(invoice || '') || !['order', 'proof'].includes(kind)) return json({ error: 'bad' }, 400);
  const o = (await db(env, `orders?invoice=eq.${invoice}&select=*`))?.[0];
  if (!o || o.status !== (kind === 'proof' ? 'waiting_review' : 'pending')) return json({ ok: false });
  const ins = await db(env, 'settings?on_conflict=key', { method: 'POST', body: { key: `private_n_${kind}_${invoice}`, value: '1' }, prefer: 'resolution=ignore-duplicates,return=representation' });
  if (!ins?.length) return json({ ok: true, dup: true });
  const cap = `${kind === 'proof' ? '🧾 <b>BUKTI TRANSFER MASUK</b>' : '🆕 <b>ORDER BARU</b>'}\nInvoice: <code>${invoice}</code>\n${esc(o.game_name)} - ${esc(o.product_name)}\nUser ID: ${esc(o.game_user_id)}${o.server_id ? ' (' + esc(o.server_id) + ')' : ''}\nWA: ${esc(o.wa)}\nTotal: Rp ${Number(o.total).toLocaleString('id-ID')}\nMetode: ${esc(o.payment_method || '-')}`;
  const kb = { inline_keyboard: [[{ text: '✅ Sukses', callback_data: 'ok_' + invoice }, { text: '❌ Gagal', callback_data: 'no_' + invoice }]] };
  const url = kind === 'proof' && o.proof_url ? await signProof(env, o.proof_url) : null;
  if (url) await tg(env.TELEGRAM_BOT_TOKEN, 'sendPhoto', { chat_id: env.TELEGRAM_CHAT_ID, photo: url, caption: cap, parse_mode: 'HTML', reply_markup: kb });
  else await tg(env.TELEGRAM_BOT_TOKEN, 'sendMessage', { chat_id: env.TELEGRAM_CHAT_ID, text: cap, parse_mode: 'HTML', reply_markup: kb });
  return json({ ok: true });
}

