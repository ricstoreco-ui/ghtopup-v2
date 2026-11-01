/* ext2.js - tahap 2: ikon produk, S&K/Privasi/Refund, dashboard admin, tab Halaman (jalan setelah ext.js) */
(()=>{
if(window.__ghx2)return;window.__ghx2=1;

/* ---------- ikon produk di halaman game ---------- */
const g1=game;
game=async id=>{await g1(id);try{const {data}=await sb.from('products').select('id,icon_url').eq('game_id',id).not('icon_url','is',null);
 (data||[]).forEach(r=>{const el=document.querySelector(`.pick[data-id="${r.id}"]`);if(el&&su(r.icon_url))el.insertAdjacentHTML('afterbegin',`<img src="${esc(su(r.icon_url))}" alt="" loading="lazy" style="width:36px;height:36px;object-fit:contain;float:right;margin-left:8px">`)})}catch(e){}};

/* ---------- halaman legal (teks bisa diubah admin di tab Halaman) ---------- */
const LG={tos:'Syarat & Ketentuan',privacy:'Kebijakan Privasi',refund:'Kebijakan Refund'};
const DEF={
tos:`1. Pesanan diproses manual oleh admin setelah bukti pembayaran diverifikasi.
2. Pembeli wajib memastikan User ID dan Server ID benar. Kesalahan input bukan tanggung jawab toko.
3. Pesanan yang tidak dibayar dalam batas waktu akan kedaluwarsa.
4. Harga dapat berubah sewaktu-waktu tanpa pemberitahuan.`,
privacy:`Data yang kami simpan: User ID game, nomor WhatsApp, dan bukti pembayaran.
Data dipakai hanya untuk memproses pesanan dan menghubungi pembeli, tidak dijual ke pihak lain.
Bukti pembayaran dihapus berkala oleh admin.`,
refund:`Pesanan yang sudah berstatus sukses tidak dapat dibatalkan.
Jika pesanan gagal diproses oleh toko, dana dikembalikan atau pesanan diproses ulang.
Hubungi admin dengan menyebut nomor invoice paling lambat 24 jam setelah pembayaran.`};
const r1=route;removeEventListener('hashchange',r1);
route=async()=>{const p=location.hash.slice(1).split('/')[0];
 if(LG[p]&&location.pathname.replace(/\/+$/,'')!=='/admin'){scrollTo(0,0);document.querySelectorAll('.top nav a').forEach(a=>a.classList.remove('on'));
  app.innerHTML=`<div class="wrap"><h2 style="margin-top:0">${LG[p]}</h2><div class="card" style="white-space:pre-wrap">${esc(S['legal_'+p]||DEF[p])}</div></div>`}
 else await r1()};
addEventListener('hashchange',route);
if(LG[location.hash.slice(1)])route();
document.body.insertAdjacentHTML('beforeend','<div class="sm mut" style="position:relative;z-index:1;text-align:center;padding:18px 10px"><a href="#tos">Syarat & Ketentuan</a> · <a href="#privacy">Privasi</a> · <a href="#refund">Refund</a></div>');

/* ---------- admin: Dashboard & Halaman ---------- */
const TABS=[['dash','Dashboard'],['orders','Pesanan'],['games','Game'],['products','Produk'],['banners','Banner'],['pay','Pembayaran'],['faq','FAQ'],['tut','Tutorial'],['legal','Halaman'],['store','Toko & Tema']];
const nav=t=>`<div class="tabs">${TABS.map(x=>`<button class="btn ${x[0]===t?'':'g'}" onclick="admTab('${x[0]}')">${x[1]}</button>`).join('')}<button class="btn g" onclick="sb.auth.signOut().then(()=>route())">Keluar</button></div>`;
const a1=admTab;
admTab=async t=>{
 if(t!=='dash'&&t!=='legal'){await a1(t);const tb=document.querySelector('.tabs');if(tb)tb.outerHTML=nav(t);return}
 app.innerHTML=`<div class="wrap">${nav(t)}<div id="ab">Memuat...</div></div>`;const b=$('#ab');
 if(t==='legal'){b.innerHTML=`<div class="card">${Object.entries(LG).map(([k,l])=>`<label>${l}</label><textarea class="in" rows="6" data-k="legal_${k}">${esc(S['legal_'+k]||DEF[k])}</textarea>`).join('')}<button class="btn" onclick="saveStore()">Simpan halaman</button></div>`;return}
 const {data,error}=await sb.from('orders').select('status,total,created_at,game_name').order('created_at',{ascending:false}).limit(5000);
 if(error)return b.innerHTML='<div class="card bad">'+esc(error.message)+'</div>';
 const o=data||[],W=n=>new Date(new Date(n).getTime()+7*36e5).toISOString().slice(0,10),td=W(Date.now()),ok=o.filter(r=>r.status==='success'),sum=a=>a.reduce((s,r)=>s+(r.total||0),0);
 const days=[...Array(7)].map((_,i)=>W(Date.now()-(6-i)*864e5)),v=days.map(d=>sum(ok.filter(r=>W(r.created_at)===d))),mx=Math.max(...v,1);
 const cnt=s=>o.filter(r=>r.status===s).length,top={};ok.forEach(r=>top[r.game_name]=(top[r.game_name]||0)+1);
 const C=(l,x,c)=>`<div class="card"><div class="sm mut">${l}</div><div style="font:700 20px 'Chakra Petch'" class="${c||''}">${x}</div></div>`;
 b.innerHTML=`<div class="grid">${C('Omzet hari ini',rp(sum(ok.filter(r=>W(r.created_at)===td))),'ok')}${C('Omzet bulan ini',rp(sum(ok.filter(r=>W(r.created_at).slice(0,7)===td.slice(0,7)))))}${C('Total omzet',rp(sum(ok)))}${C('Perlu dicek',cnt('pending')+cnt('waiting_review'),'warn')}</div>
 <br><div class="card"><h3>Omzet 7 hari</h3><div style="display:flex;align-items:flex-end;gap:6px;height:130px;margin-top:10px">${v.map((x,i)=>`<div style="flex:1;text-align:center"><div title="${rp(x)}" style="height:${Math.max(3,x/mx*100)}px;background:linear-gradient(var(--a),var(--a2));border-radius:6px 6px 0 0"></div><div class="sm mut">${days[i].slice(8)}</div></div>`).join('')}</div></div>
 <br><div class="card"><h3>Status pesanan</h3><p>Sukses ${ok.length} | Menunggu ${cnt('pending')+cnt('waiting_review')} | Gagal ${cnt('failed')+cnt('expired')}</p></div>
 <br><div class="card"><h3>Game terlaris</h3>${Object.entries(top).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,n])=>`<p>${esc(k)} <b>${n}</b> pesanan</p>`).join('')||'<p class="mut">Belum ada pesanan sukses.</p>'}</div>`};
})();
