const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  if (event.headers['x-webhook-secret'] !== process.env.WEBHOOK_SECRET) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  const payload = JSON.parse(event.body);
  const order = payload.record;
  const type = payload.type;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const tgUrl = (method) => `https://api.telegram.org/bot${token}/${method}`;

  // ---- ORDER BARU ----
  if (type === 'INSERT') {
    const text = [
      '🆕 *PESANAN BARU*',
      `📋 \`${order.invoice}\``,
      `🎮 ${order.game_name}`,
      `💎 ${order.product_name}`,
      `🆔 \`${order.user_game_id}\`${order.server ? ` (srv ${order.server})` : ''}`,
      `📱 WA: ${order.wa}`,
      `💰 *Rp ${Number(order.total_amount).toLocaleString('id-ID')}*`
    ].join('\n');

    await fetch(tgUrl('sendMessage'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '🔄 Proses', callback_data: `processing:${order.invoice}` },
            { text: '✅ Sukses', callback_data: `success:${order.invoice}` },
            { text: '❌ Gagal',  callback_data: `failed:${order.invoice}` }
          ]]
        }
      })
    });
  }

  // ---- BUKTI DIUPLOAD ----
  if (type === 'UPDATE' && order.status === 'waiting_review' && order.proof_url) {
    const text = [
      '📸 *BUKTI BAYAR MASUK*',
      `📋 \`${order.invoice}\``,
      `🎮 ${order.game_name} — ${order.product_name}`,
      `💰 Rp ${Number(order.total_amount).toLocaleString('id-ID')}`,
      `🔗 [Lihat bukti](${order.proof_url})`
    ].join('\n');

    await fetch(tgUrl('sendPhoto'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        photo: order.proof_url,
        caption: text,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '🔄 Proses', callback_data: `processing:${order.invoice}` },
            { text: '✅ Sukses', callback_data: `success:${order.invoice}` },
            { text: '❌ Gagal',  callback_data: `failed:${order.invoice}` }
          ]]
        }
      })
    });
  }

  return { statusCode: 200, body: 'ok' };
};
