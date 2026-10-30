export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const body = await request.json();
    
    // ==========================================
    // BAGIAN 1: NANGKEP PESAN DARI TELEGRAM (Admin Balas Chat)
    // ==========================================
    if (body.update_id) {
      const botToken = env.TELEGRAM_BOT_TOKEN;
      const chatIdAdmin = env.TELEGRAM_CHAT_ID;

      if (body.message && body.message.text) {
        const text = body.message.text;
        const fromId = body.message.from.id;
        
        // Cek apakah yang chat beneran Admin
        if (String(fromId) === String(chatIdAdmin)) {
          
          // Command /menu
          if (text === '/menu' || text === '/start') {
            const keyboard = {
              inline_keyboard: [
                [{ text: "📊 Laporan & Omzet", callback_data: "menu_omzet" }, { text: "🎫 Cek Invoice", callback_data: "menu_invoice" }],
                [{ text: "⚙️ Atur Web", callback_data: "menu_web" }, { text: "🔒 Status Toko", callback_data: "menu_toko" }]
              ]
            };
            await sendTelegram(botToken, chatIdAdmin, "🤖 *PUSAT KENDALI GH TOPUP*\nMau ngapain hari ini, Bos?", keyboard);
          }

          // Command /balas (Eskalasi CS dari Web ke Telegram)
          else if (text.startsWith('/balas ')) {
            const parts = text.split(' ');
            const sessionId = parts[1];
            const replyMsg = parts.slice(2).join(' ');
            
            // Simpan balasan Admin ke database (biar muncul di web buyer)
            await fetch(`${env.SUPABASE_URL}/rest/v1/chats`, {
              method: 'POST',
              headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ session_id: sessionId, sender: 'admin', message: replyMsg })
            });
            await sendTelegram(botToken, chatIdAdmin, `✅ Balasan terkirim ke sesi web: ${sessionId}`);
          }
        }
      }
      return new Response('OK', { status: 200 });
    }

    // ==========================================
    // BAGIAN 2: NANGKEP CHAT BARU DARI WEB (Supabase Webhook)
    // ==========================================
    if (body.table === 'chats' && body.type === 'INSERT') {
      const chat = body.record;
      
      // Jangan balas kalau yang masuk itu pesan dari admin atau bot sendiri
      if (chat.sender !== 'buyer') return new Response('OK', { status: 200 });

      // --- LOGIKA AUTO-REPLY BOT CS ---
      let autoReply = null;
      const msgLower = chat.message.toLowerCase();

      if (msgLower.includes('harga') || msgLower.includes('pricelist')) {
        autoReply = "Untuk cek harga terbaru, silakan lihat langsung di menu utama website kami ya kak. Harganya paling murah! 😉";
      } else if (msgLower.includes('invoice') || msgLower.includes('pesanan')) {
        autoReply = "Untuk cek status pesanan, silakan ketik invoice kamu (contoh: GH-123456) di menu Riwayat website ya kak.";
      } else if (msgLower.includes('bayar') || msgLower.includes('qris')) {
        autoReply = "Pembayaran utama kami menggunakan QRIS otomatis (GoPay, OVO, Dana, M-Banking). Prosesnya instan kurang dari 2 menit!";
      } else if (msgLower.includes('admin') || msgLower.includes('manusia')) {
        autoReply = "Mohon tunggu sebentar ya kak, pesan kamu sudah diteruskan ke Admin manusia kami. 👨‍💻";
      } else {
        autoReply = "Halo kak! Terima kasih sudah menghubungi GH TopUp. Jika butuh bantuan spesifik, Admin kami akan segera membalas pesan ini. Mohon tunggu ya! 🙏";
      }

      // 1. Simpan balasan Bot ke database (biar muncul di web pembeli)
      await fetch(`${env.SUPABASE_URL}/rest/v1/chats`, {
        method: 'POST',
        headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: chat.session_id, sender: 'bot', message: autoReply })
      });

      // 2. Kirim notif ke Bot Admin
      const notifMsg = `💬 *CHAT BARU DARI BUYER*\n\nPesan: ${chat.message}\n\n_Balas dengan:_ \n/balas ${chat.session_id} [pesan lu]`;
      await sendTelegram(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID, notifMsg);
    }

    return new Response('OK', { status: 200 });
  } catch (err) {
    return new Response('Error: ' + err.message, { status: 500 });
  }
}

// Fungsi Bantuan buat nembak API Telegram
async function sendTelegram(token, chatId, text, keyboard = null) {
  const payload = { chat_id: chatId, text: text, parse_mode: 'Markdown' };
  if (keyboard) payload.reply_markup = keyboard;
  
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}
