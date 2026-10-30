const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 200, body: 'ok' };

  const payload = JSON.parse(event.body);
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  // ==========================================
  // 1. LOGIKA TOMBOL TELEGRAM (CALLBACK)
  // ==========================================
  if (payload.callback_query) {
    const cq = payload.callback_query;
    const [action, invoice] = cq.data.split(':');
    const statusMap = { processing: 'processing', success: 'success', failed: 'failed' };
    const newStatus = statusMap[action];
    let replyText;

    if (!newStatus) {
      replyText = '⚠️ Aksi tidak dikenal';
    } else {
      const { error } = await sb.from('orders').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('invoice', invoice);
      replyText = error ? `⚠️ Gagal update database: ${error.message}` : `✅ Invoice ${invoice} berhasil diubah jadi *${newStatus.toUpperCase()}*`;
    }

    await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: cq.id, text: replyText, parse_mode: 'Markdown' })
    });

    await fetch(`https://api.telegram.org/bot${token}/editMessageReplyMarkup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: cq.message.chat.id, message_id: cq.message.message_id, reply_markup: { inline_keyboard: [] } })
    });

    return { statusCode: 200, body: 'ok' };
  }

  // ==========================================
  // 2. LOGIKA NOTIFIKASI DARI SUPABASE
  // ==========================================
  if (payload.type === 'INSERT' || (payload.type === 'UPDATE' && payload.record.status === 'waiting_review' && payload.record.proof_url)) {
    const order = payload.record;
    const tgUrl = (method) => `https://api.telegram.org/bot${token}/${method}`;
    let text, method, body;

    if (payload.type === 'INSERT') {
      text = ['🆕 *PESANAN BARU*', `📋 \`${order.invoice}\``, `🎮 ${order.game_name}`, `💎 ${order.product_name}`, `🆔 \`${order.user_game_id}\`${order.server ? ` (srv ${order.server})` : ''}`, `📱 WA: ${order.wa}`, `💰 *Rp ${Number(order.total_amount).toLocaleString('id-ID')}*`].join('\n');
      method = 'sendMessage';
      body = { chat_id: chatId, text, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔄 Proses', callback_data: `processing:${order.invoice}` }, { text: '✅ Sukses', callback_data: `success:${order.invoice}` }, { text: '❌ Gagal', callback_data: `failed:${order.invoice}` }]] } };
    } else {
      text = ['📸 *BUKTI BAYAR MASUK*', `📋 \`${order.invoice}\``, `🎮 ${order.game_name} — ${order.product_name}`, `💰 Rp ${Number(order.total_amount).toLocaleString('id-ID')}`, `🔗 [Lihat bukti](${order.proof_url})`].join('\n');
      method = 'sendPhoto';
      body = { chat_id: chatId, photo: order.proof_url, caption: text, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔄 Proses', callback_data: `processing:${order.invoice}` }, { text: '✅ Sukses', callback_data: `success:${order.invoice}` }, { text: '❌ Gagal', callback_data: `failed:${order.invoice}` }]] } };
    }

    await fetch(tgUrl(method), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  }

  return { statusCode: 200, body: 'ok' };
};
