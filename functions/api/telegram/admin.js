// Webhook bot ADMIN (TELEGRAM_BOT_TOKEN): menu, omzet, invoice, status toko, tombol Sukses/Gagal, perintah darurat.
import { db, tg, esc, setting, cleanupFailed, cleanupProofs } from '../../_lib.js';
const kb = r => ({ inline_keyboard: r });
const MENU = kb([[{ text: '📊 Laporan & Omzet', callback_data: 'menu_omzet' }, { text: '🎫 Cek Invoice', callback_data: 'menu_invoice' }], [{ text: '⚙️ Atur Web', callback_data: 'menu_web' }, { text: '🔒 Status Toko', callback_data: 'menu_toko' }]]);
const TOKO = kb([[{ text: '🟢 Online', callback_data: 'st_online' }, { text: '🚧 Maintenance', callback_data: 'st_maintenance' }], [{ text: '🔴 Closed', callback_data: 'st_closed' }, { text: '🛠️ Setup Game', callback_data: 'st_setup' }]]);
const dur = t => { const m = /(\d+)\s*(mnt|menit|jam|hari)/i.exec(t); return m ? +m[1] * ({ mnt: 6e4, menit: 6e4, jam: 36e5, hari: 864e5 }[m[2].toLowerCase()]) : 0; };
const rp = n => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
const THEMES = ['chrome', 'neon', 'cyber', 'ocean', 'gold'];

export async function onRequestPost({ request, env }) {
  if (!env.WEBHOOK_SECRET || request.headers.get('x-telegram-bot-api-secret-token') !== env.WEBHOOK_SECRET) return new Response('forbidden', { status: 403 });
  const u = await request.json().catch(() => ({})), T = env.TELEGRAM_BOT_TOKEN, A = String(env.TELEGRAM_CHAT_ID);
  const say = (text, k) => tg(T, 'sendMessage', { chat_id: A, text, parse_mode: 'HTML', reply_markup: k });
  const state = async v => setting(env, 'private_tg_state', v);
  const fromId = String((u.callback_query || u.message)?.from?.id || '');
  if (fromId !== A) return new Response('ok');
  try {
    const cq = u.callback_query;
    if (cq) {
      await tg(T, 'answerCallbackQuery', { callback_query_id: cq.id });
      const d = cq.data || '';
      if (d === 'menu_omzet') {
        const rows = await db(env, 'orders?select=status,total,created_at&limit=5000') || [], today = new Date(Date.now() + 7 * 36e5).toISOString().slice(0, 10);
        const ok = rows.filter(r => r.status === 'success'), td = ok.filter(r => new Date(new Date(r.created_at).getTime() + 7 * 36e5).toISOString().slice(0, 10) === today);
        const c = s => rows.filter(r => r.status === s).length;
        await say(`📊 <b>LAPORAN</b>\nHari ini: ${rp(td.reduce((a, r) => a + r.total, 0))} (${td.length} transaksi)\nTotal omzet: ${rp(ok.reduce((a, r) => a + r.total, 0))}\nSukses ${ok.length} | Pending ${c('pending') + c('waiting_review')} | Gagal ${c('failed') + c('expired')}\n<i>Omzet hanya dari status sukses.</i>`, kb([[{ text: '🆕 Order Terakhir', callback_data: 'menu_last' }]]));
      } else if (d === 'menu_last') {
        const r = await db(env, 'orders?select=invoice,game_name,product_name,total,status&order=created_at.desc&limit=5') || [];
        await say(r.map(x => `<code>${x.invoice}</code> ${esc(x.game_name)} ${esc(x.product_name)} ${rp(x.total)} [${x.status}]`).join('\n') || 'Belum ada order.');
      } else if (d === 'menu_invoice') await say('Ketik: /cek GH-XXXXXXXX');
      else if (d === 'menu_web') await say('⚙️ Perintah: /tema chrome|neon|cyber|ocean|gold\n/maintenance 2jam\n/closed pesan\n/setup nama game\n/online\n/cleanup-failed\n/cleanup-proof\n/blokir 08xxxxxxxxxx', kb([[{ text: '🔒 Status Toko', callback_data: 'menu_toko' }]]));
      else if (d === 'menu_toko') await say('🔒 <b>Status Toko</b>', TOKO);
      else if (d === 'st_online') { await setting(env, 'store_status', 'online'); await say('🟢 Toko ONLINE.'); }
      else if (d === 'st_maintenance') { await state('maintenance'); await say('Ketik durasi maintenance, contoh: 2jam / 30mnt / 1hari', kb([[30, 60, 120, 360].map(x => ({ text: x >= 60 ? x / 60 + ' jam' : x + ' mnt', callback_data: 'mt_' + x }))])); }
      else if (d.startsWith('mt_')) { await setting(env, 'maintenance_ends_at', new Date(Date.now() + +d.slice(3) * 6e4).toISOString()); await setting(env, 'store_status', 'maintenance'); await state(''); await say('🚧 Maintenance aktif.'); }
      else if (d === 'st_closed') { await state('closed'); await say('Ketik pesan untuk pembeli, contoh: Admin sedang solat, kembali 15 menit lagi'); }
      else if (d === 'st_setup') { const g = await db(env, 'games?select=id,name&order=name.asc&limit=30') || []; await say('Pilih game yang disetup:', kb(g.map(x => [{ text: x.name, callback_data: 'sg_' + x.id }]))); }
      else if (d.startsWith('sg_')) { const g = (await db(env, `games?select=name&id=eq.${encodeURIComponent(d.slice(3))}`))?.[0]; if (g) { await setting(env, 'setup_game', g.name); await setting(env, 'store_status', 'setup'); await say('🛠️ Setup: ' + esc(g.name)); } }
      else if (/^(ok|no)_GH-[0-9A-F]{8}$/.test(d)) {
        const st = d.startsWith('ok') ? 'success' : 'failed', inv = d.slice(3);
        const r = await db(env, `orders?invoice=eq.${inv}`, { method: 'PATCH', body: { status: st, updated_at: new Date().toISOString() } });
        await say(r?.length ? `${st === 'success' ? '✅' : '❌'} <code>${inv}</code> diubah ke ${st}.` : '⚠️ Order tidak ditemukan.');
      }
      return new Response('ok');
    }
    const t = (u.message?.text || '').trim(); if (!t) return new Response('ok');
    const [cmd, ...rest] = t.split(/\s+/), arg = rest.join(' ');
    if (cmd === '/start' || cmd === '/menu') await say('🤖 <b>PUSAT KENDALI GH TOPUP</b>\nMau ngapain hari ini, Bos?', MENU);
    else if (cmd === '/cek') { const o = /^GH-[0-9A-Fa-f]{8}$/.test(arg) ? (await db(env, `orders?invoice=eq.${arg.toUpperCase()}`))?.[0] : null;
      await say(o ? `🎫 <code>${o.invoice}</code>\n${esc(o.game_name)} - ${esc(o.product_name)}\nUser ID: ${esc(o.game_user_id)} ${esc(o.server_id || '')}\nTotal: ${rp(o.total)}\nMetode: ${esc(o.payment_method || '-')}\nStatus: ${o.status}\nWaktu: ${o.created_at}` : 'Invoice tidak ditemukan. Format: /cek GH-XXXXXXXX', o ? kb([[{ text: '✅ Sukses', callback_data: 'ok_' + o.invoice }, { text: '❌ Gagal', callback_data: 'no_' + o.invoice }]]) : undefined); }
    else if (cmd === '/online') { await setting(env, 'store_status', 'online'); await say('🟢 Toko ONLINE.'); }
    else if (cmd === '/maintenance') { const ms = dur(arg); if (!ms) await say('Contoh: /maintenance 2jam'); else { await setting(env, 'maintenance_ends_at', new Date(Date.now() + ms).toISOString()); await setting(env, 'store_status', 'maintenance'); await say('🚧 Maintenance aktif.'); } }
    else if (cmd === '/closed') { if (!arg) await say('Contoh: /closed Admin solat, kembali 15 menit lagi'); else { await setting(env, 'closed_message', arg.slice(0, 200)); await setting(env, 'store_status', 'closed'); await say('🔴 Toko CLOSED.'); } }
    else if (cmd === '/setup') { const g = (await db(env, `games?select=name&name=ilike.${encodeURIComponent(arg)}`))?.[0]; if (!g) await say('Game tidak ditemukan. Pakai tombol Setup Game di menu.'); else { await setting(env, 'setup_game', g.name); await setting(env, 'store_status', 'setup'); await say('🛠️ Setup: ' + esc(g.name)); } }
    else if (cmd === '/tema') { if (!THEMES.includes(arg)) await say('Pilihan: ' + THEMES.join(', ')); else { await setting(env, 'theme', arg); await say('🎨 Tema: ' + arg); } }
    else if (cmd === '/blokir') { if (!/^08[0-9]{8,12}$/.test(arg)) await say('Contoh: /blokir 08123456789'); else { await db(env, 'gh_blacklist_wa?on_conflict=wa', { method: 'POST', body: { wa: arg }, prefer: 'resolution=ignore-duplicates' }); await say('🚫 Diblokir: ' + arg); } }
    else if (cmd === '/cleanup-failed') { const n = await cleanupFailed(env, 'telegram'); await say(n < 0 ? '❌ Gagal menjalankan cleanup.' : `🧹 ${n} pesanan gagal dihapus.`); }
    else if (cmd === '/cleanup-proof') { const n = await cleanupProofs(env, 'telegram'); await say(n < 0 ? '❌ Gagal menghapus bukti.' : `🧹 ${n} bukti transfer dihapus.`); }
    else if (!t.startsWith('/')) {
      const s = (await db(env, 'settings?select=value&key=eq.private_tg_state'))?.[0]?.value;
      if (s === 'maintenance') { const ms = dur(t); if (!ms) await say('Format salah, contoh: 2jam'); else { await setting(env, 'maintenance_ends_at', new Date(Date.now() + ms).toISOString()); await setting(env, 'store_status', 'maintenance'); await state(''); await say('🚧 Maintenance aktif.'); } }
      else if (s === 'closed') { await setting(env, 'closed_message', t.slice(0, 200)); await setting(env, 'store_status', 'closed'); await state(''); await say('🔴 Toko CLOSED.'); }
      else await say('Ketik /menu untuk membuka menu.');
    } else await say('Perintah tidak dikenal. Ketik /menu.');
  } catch (e) { console.error('admin bot', e.message); await say('⚠️ Terjadi error, coba lagi.'); }
  return new Response('ok');
}

