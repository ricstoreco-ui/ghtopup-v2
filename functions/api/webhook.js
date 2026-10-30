export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const body = await request.json();
    
    // ==========================================
    // BAGIAN 1: NANGKEP PESAN DARI TELEGRAM (Callback / Balasan Admin)
    // ==========================================
    if (body.callback_query || (body.message && !body.table)) {
      const botToken = env.TELEGRAM_BOT_TOKEN;
      const supabaseUrl = env.SUPABASE_URL;
      const supabaseKey = env.SUPABASE_SERVICE_KEY;

      // A. Kalau Admin klik tombol "Sukses/Gagal" di pesan order
      if (body.callback_query) {
        const data = body.callback_query.data; // format: "status|invoice"
        const [status, invoice] = data.split('|');
        
        await fetch(`${supabaseUrl}/rest/v1/orders?invoice=eq.${invoice}`, {
          method: 'PATCH',
          headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: status })
        });

        // Jawab callback biar loading di Telegram ilang
        await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callback_query_id: body.callback_query.id, text: `Status diubah ke ${status}` })
        });
      }

      // B. Kalau Admin ngetik pesan biasa di Telegram (buat bales Live Chat)
      if (body.message && body.message.text) {
        const text = body.message.text;
        // Cek format: /balas SESS-XXXX pesan
        if (text.startsWith('/balas ')) {
          const parts = text.split(' ');
          const sessionId = parts[1];
          const replyMsg = parts.slice(2).join(' ');

          // Simpan balasan ke database biar muncul di web
          await fetch(`${supabaseUrl}/rest/v1/chats`, {
            method: 'POST',
            headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId, sender: 'admin', message: replyMsg })
          });
        }
      }
      return new Response('OK', { status: 200 });
    }

    // ==========================================
    // BAGIAN 2: NANGKEP NOTIFIKASI DARI SUPABASE (Order Baru / Chat Baru)
    // ==========================================
    if (body.table === 'chats' && body.type === 'INSERT') {
      // Kalau ada chat baru dari web, kirim ke Telegram lu
      const chat = body.record;
      const msg = `💬 *CHAT BARU DARI BUYER*\n\nPesan: ${chat.message}\n\n_Balas dengan:_ \n/balas ${chat.session_id} [pesan lu]`;
      
      await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: msg, parse_mode: 'Markdown' })
      });
    }

    if (body.table === 'orders' && body.type === 'INSERT') {
      // Notif orderan baru (bisa lu kembangkan nanti)
      // ... (logika notif order dari webhook lama lu) ...
    }

    return new Response('OK', { status: 200 });
  } catch (err) {
    return new Response('Error: ' + err.message, { status: 500 });
  }
}
