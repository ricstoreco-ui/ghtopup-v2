/* ext3.js - tahap 3 (jalan setelah ext.js dan ext2.js) */
(()=>{
if(window.__ghx3)return;window.__ghx3=1;
const adm=location.pathname.replace(/\/+$/,'')==='/admin';
const css=document.createElement('style');
css.textContent=`
body{padding-bottom:96px}.cbt,.q{bottom:76px!important}.cp{bottom:122px!important}
.top .logo{display:flex;align-items:center;gap:9px}
.lg{width:32px;height:32px;border-radius:10px;filter:drop-shadow(0 0 8px var(--a));animation:lgf 3.6s ease-in-out infinite}
@keyframes lgf{50%{transform:translateY(-2px) rotate(-5deg) scale(1.07)}}
.ilg{position:relative;width:104px;height:104px}.ilg img{width:100%;height:100%;border-radius:26px;animation:ilp 1s cubic-bezier(.2,.9,.3,1.4) both}
.ilg:before,.ilg:after{content:"";position:absolute;inset:-6px;border-radius:32px;border:2px solid var(--a);opacity:0;animation:rg 1.7s ease-out infinite}.ilg:after{animation-delay:.6s}
@keyframes ilp{from{opacity:0;transform:scale(.4) rotate(-24deg)}}@keyframes rg{from{opacity:.8;transform:scale(.9)}to{opacity:0;transform:scale(1.55)}}
.bnav{position:fixed;left:50%;bottom:12px;transform:translateX(-50%);z-index:9;display:flex;gap:2px;padding:6px;border-radius:24px;background:color-mix(in srgb,var(--pan) 82%,transparent);backdrop-filter:blur(14px);border:1px solid var(--line);box-shadow:0 12px 30px -10px #000}
.bnav button{background:none;border:0;color:var(--mut);display:flex;flex-direction:column;align-items:center;gap:1px;padding:5px 14px;border-radius:18px;font-size:11px;cursor:pointer;transition:.2s}
.bnav button span{font-size:18px}.bnav button:active{transform:scale(.9)}.bnav button:hover{background:var(--pan2);color:var(--chr)}
.bn2{position:relative;overflow:hidden;border-radius:20px;margin:14px 0;border:1px solid color-mix(in srgb,var(--a) 30%,var(--line));box-shadow:0 18px 40px -22px var(--a)}
.bt{display:flex;transition:transform .75s cubic-bezier(.65,0,.25,1)}.bt a{flex:0 0 100%;display:block}.bt img{width:100%;aspect-ratio:16/7;object-fit:cover;display:block}
.bd2{position:absolute;left:0;right:0;bottom:8px;display:flex;justify-content:center;gap:6px}.bd2 i{width:7px;height:7px;border-radius:7px;background:#fff6;cursor:pointer;transition:.35s}.bd2 i.on{width:22px;background:var(--a)}
.mn2{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:14px 0}
.mn2 a{text-align:center;padding:12px 4px;font-size:12px;position:relative}.mn2 a span{display:block;font-size:26px;margin-bottom:3px}.mn2 a b{font-family:'Chakra Petch',sans-serif}
.mn2 a em{position:absolute;top:4px;right:4px;font-size:9px;font-style:normal;background:var(--warn);color:#000;border-radius:8px;padding:0 5px}
@media(min-width:800px){.mn2{grid-template-columns:repeat(8,1fr)}}
.sk img{height:150px;width:auto;border-radius:10px;margin-right:6px;flex:none}.sg{display:flex;overflow-x:auto;margin-bottom:8px}
.g2{display:grid;gap:12px;grid-template-columns:1fr}@media(min-width:700px){.g2{grid-template-columns:1fr 1fr}}
`;
document.head.append(css);

/* ---------- logo di header + intro ---------- */
const lg=document.querySelector('.top .logo');if(lg)lg.innerHTML='<img class="lg" src="/icon-192.png" alt=""><span>GH TOP-UP</span>';
const it=$('#intro');if(it)it.insertAdjacentHTML('afterbegin','<div class="ilg"><img src="/icon-512.png" alt=""></div>');

/* ---------- navigasi bawah: kembali, beranda, riwayat, profil ---------- */
const HS=[location.hash];let sk=0;
addEventListener('hashchange',()=>{if(sk){sk=0;return}HS.push(location.hash);if(HS.length>30)HS.shift()});
if(!adm){const n=document.createElement('div');n.className='bnav';n.innerHTML='<button data-n="back"><span>←</span>Kembali</button><button data-n="home"><span>🏠</span>Beranda</button><button data-n="history"><span>🧾</span>Riwayat</button><button data-n="profile"><span>👤</span>Profil</button>';document.body.append(n);
 n.onclick=e=>{const b=e.target.closest('[data-n]');if(!b)return;const k=b.dataset.n;
  if(k==='back'){if(HS.length>1){HS.pop();const to=HS[HS.length-1];if(to!==location.hash)sk=1;location.hash=to}else location.hash=''}
  else location.hash=k==='home'?'':k}}

/* ---------- klik: salin invoice, tombol game, fitur segera ---------- */
document.addEventListener('click',e=>{
 const c=e.target.closest('[data-copy]');if(c){navigator.clipboard.writeText(c.dataset.copy).then(()=>toast('Invoice disalin: '+c.dataset.copy),()=>toast('Gagal menyalin, salin manual ya'));return}
 const g=e.target.closest('[data-go]');if(g){e.preventDefault();const x=document.querySelector('.gc');if(x)x.scrollIntoView({behavior:'smooth',block:'center'})}
 const s=e.target.closest('[data-soon]');if(s){e.preventDefault();toast('Segera hadir, masih disiapkan.')}});

/* ---------- banner geser otomatis 3 detik ---------- */
async function loadBan(){const {data}=await sb.from('gh_banners').select('*').eq('is_active',true).order('sort_order').order('id');const L=(data||[]).filter(b=>su(b.image_url)),el=$('#bn2');if(!el)return;if(!L.length)return el.remove();
 el.innerHTML=`<div class="bt">${L.map(b=>{const u=b.link_url||'',h=u&&/^(#|\/|https?:\/\/)/.test(u)?` href="${esc(u)}"`+(/^https?:/.test(u)?' target="_blank" rel="noopener"':''):'';return `<a${h}><img src="${esc(su(b.image_url))}" alt="${esc(b.title)}"></a>`}).join('')}</div>${L.length>1?`<div class="bd2">${L.map((_,i)=>`<i data-i="${i}"></i>`).join('')}</div>`:''}`;
 let i=0,x0=0;const t=el.querySelector('.bt'),ds=[...el.querySelectorAll('.bd2 i')],go=n=>{i=(n+L.length)%L.length;t.style.transform=`translateX(-${i*100}%)`;ds.forEach((d,k)=>d.classList.toggle('on',k===i))};go(0);
 clearInterval(window.bT);clearInterval(window.bT2);
 if(L.length>1)window.bT2=setInterval(()=>{if(!document.body.contains(el))return clearInterval(window.bT2);if(!el.dataset.t)go(i+1)},3000);
 ds.forEach(d=>d.onclick=()=>go(+d.dataset.i));
 el.ontouchstart=e=>{x0=e.touches[0].clientX;el.dataset.t=1};el.ontouchend=e=>{const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)go(i+(dx<0?1:-1));setTimeout(()=>delete el.dataset.t,2500)}}

/* ---------- perapih halaman setiap render ---------- */
const MENU='<div class="mn2">'+[['','Game','🎮','data-go'],['#history','Riwayat','🧾'],['#profile','Profil','👤'],['#stock','Stok Akun','🛒'],['#faq','FAQ','❓'],['#tutorial','Tutorial','📖'],['#','Spin','🎡','data-soon','Soon'],['#','Tukar Poin','🎁','data-soon','Soon']].map(m=>`<a class="card hv" href="${m[0]||'#'}" ${m[3]||''}><span>${m[2]}</span><b>${m[1]}</b>${m[4]?`<em>${m[4]}</em>`:''}</a>`).join('')+'</div>';
const fix=()=>{
 document.querySelectorAll('.pick').forEach(el=>{const m=el.querySelectorAll(':scope>img');for(let i=1;i<m.length;i++)m[i].remove()});
 document.querySelectorAll('.gc.cl .sm').forEach(s=>{if(!s.dataset.cs){s.dataset.cs=1;s.innerHTML='<span class="bd warn">COMING SOON</span>'}});
 const gr=(document.querySelector('.gc')||{}).parentElement;if(gr){const k=[...gr.children],s=k.slice().sort((a,b)=>a.classList.contains('cl')-b.classList.contains('cl'));if(s.some((x,i)=>x!==k[i]))s.forEach(x=>gr.append(x))}
 document.querySelectorAll('#app b').forEach(b=>{const v=b.textContent.trim();if(/^GH-[0-9A-Za-z]+$/.test(v)&&!b.dataset.cp){b.dataset.cp=1;b.insertAdjacentHTML('afterend',` <button class="btn g" data-copy="${esc(v)}" style="padding:2px 12px;font-size:12px">Salin</button>`+($('#pu')?'<div class="sm warn" style="margin-top:4px">Salin invoice ini untuk cek status di menu Riwayat.</div>':''))}});
 const hero=document.querySelector('.hero');
 if(hero&&!document.querySelector('.mn2')){let a=hero;const bn=document.querySelector('.ban');if(bn){bn.outerHTML='<div class="bn2" id="bn2"></div>';a=$('#bn2');loadBan()}a.insertAdjacentHTML('afterend',MENU)}};
let ft;new MutationObserver(()=>{clearTimeout(ft);ft=setTimeout(fix,30)}).observe($('#app'),{childList:true,subtree:true});fix();

/* ---------- Stok Akun, FAQ, Tutorial (pembeli) ---------- */
const KIND={jual:'Jual',lelang:'Lelang',stok_admin:'Stok Admin',stok_buyer:'Stok Buyer'};
const wnum=d=>wa62((d&&d.wa)||S.wa_stok||S.wa_admin);
async function stock(){const {data,error}=await sb.from('gh_stock').select('*').eq('is_active',true).order('sort_order').order('id',{ascending:false});
 if(error)return app.innerHTML='<div class="wrap"><div class="card bad">'+esc(error.message)+'</div></div>';
 const card=d=>{const im=(d.images||'').split('\n').map(x=>su(x.trim())).filter(Boolean),lel=d.kind==='lelang';
  return `<div class="card sk" data-k="${esc(d.kind)}">${im.length?`<div class="sg">${im.map(u=>`<a href="${esc(u)}" target="_blank" rel="noopener"><img src="${esc(u)}" alt="" loading="lazy"></a>`).join('')}</div>`:''}<b>${esc(d.title)}</b> <span class="bd">${esc(KIND[d.kind]||d.kind)}</span> <span class="bd ${d.status==='tersedia'?'ok':d.status==='terjual'?'bad':'warn'}">${esc(d.status)}</span>
  <div style="font:700 18px 'Chakra Petch';margin:6px 0">${d.price?rp(d.price):'Nego'}</div><p class="mut sm" style="white-space:pre-wrap;margin-bottom:10px">${esc(d.description||'')}</p>
  ${d.status==='terjual'?'<button class="btn" disabled>Terjual</button>':`<a class="btn n" target="_blank" rel="noopener" href="https://wa.me/${wnum(d)}?text=${encodeURIComponent('Halo admin, saya mau '+(lel?'ikut lelang':'beli')+' akun: '+d.title+' ('+(d.price?rp(d.price):'nego')+')')}">${lel?'Ikut lelang':'Beli'} via WhatsApp</a>`}</div>`};
 app.innerHTML=`<div class="wrap"><h2 style="margin-top:0">Stok Akun</h2><div class="tabs" id="sf">${[['all','Semua'],...Object.entries(KIND)].map(([k,l],i)=>`<button class="btn ${i?'g':''}" data-f="${k}">${l}</button>`).join('')}</div><div class="g2">${(data||[]).map(card).join('')||'<div class="card mut">Belum ada stok akun. Cek lagi nanti atau tanya admin.</div>'}</div></div>`;
 $('#sf').onclick=e=>{const b=e.target.closest('[data-f]');if(!b)return;document.querySelectorAll('#sf .btn').forEach(x=>x.classList.toggle('g',x!==b));document.querySelectorAll('.sk').forEach(c=>c.parentElement.style.display='');document.querySelectorAll('.sk').forEach(c=>c.style.display=b.dataset.f==='all'||c.dataset.k===b.dataset.f?'':'none')}}
const lk=(u,l)=>{if(!u)return'';let h=u;if(u==='wa')h='https://wa.me/'+wa62(S.wa_admin);else if(!/^(#|\/|https?:\/\/)/.test(u))return'';return `<a class="btn n" style="margin-top:10px" href="${esc(h)}"${/^https?:/.test(h)?' target="_blank" rel="noopener"':''}>${esc(l||'Buka')}</a>`};
const acc=d=>(d||[]).map(x=>`<details class="card ac"><summary>${esc(x.question||x.title)}</summary><p class="mut">${esc(x.answer||x.body)}</p>${lk(x.link_url,x.link_label)}</details>`).join('')||'<div class="card mut">Belum ada isi.</div>';
const PG={stock,
 faq:async()=>{const {data}=await sb.from('gh_faq').select('*').eq('is_active',true).order('sort_order').order('id');app.innerHTML=`<div class="wrap"><h2 style="margin-top:0">FAQ</h2>${acc(data)}</div>`},
 tutorial:async()=>{const {data}=await sb.from('gh_tutorial').select('*').eq('is_active',true).order('sort_order').order('id');app.innerHTML=`<div class="wrap"><h2 style="margin-top:0">Tutorial</h2>${acc(data)}</div>`}};
const r2=route;removeEventListener('hashchange',r2);
route=async()=>{const p=location.hash.slice(1).split('/')[0];if(adm||!PG[p])return r2();scrollTo(0,0);app.innerHTML='<div class="wrap mut">Memuat...</div>';
 try{await PG[p]()}catch(e){app.innerHTML='<div class="wrap"><div class="card bad">'+esc(e.message)+'</div></div>'}};
addEventListener('hashchange',route);if(PG[location.hash.slice(1)])route();

/* ---------- admin: urutan banner & stok akun ---------- */
const T3=[['dash','Dashboard'],['orders','Pesanan'],['games','Game'],['products','Produk'],['banners','Banner'],['stock','Stok Akun'],['pay','Pembayaran'],['faq','FAQ'],['tut','Tutorial'],['legal','Halaman'],['store','Toko & Tema']];
const nav=t=>`<div class="tabs">${T3.map(x=>`<button class="btn ${x[0]===t?'':'g'}" onclick="admTab('${x[0]}')">${x[1]}</button>`).join('')}<button class="btn g" onclick="sb.auth.signOut().then(()=>route())">Keluar</button></div>`;
const reorder=ids=>Promise.all(ids.map((id,i)=>sb.from('gh_banners').update({sort_order:i+1}).eq('id',id)));
async function banAdm(b){const {data,error}=await sb.from('gh_banners').select('*').order('sort_order').order('id');if(error)throw error;const L=data||[];
 b.innerHTML=`<div class="card"><h3>Tambah banner</h3><input class="in" id="bt" placeholder="Nama banner"><input class="in" id="bi" placeholder="Link gambar (https://...)"><input class="in" id="bl" placeholder="Link tujuan (opsional: #stock, #faq, atau https://...)"><input class="in" id="bo" inputmode="numeric" placeholder="Taruh di urutan ke berapa (kosong = paling akhir)"><button class="btn" id="bs">Simpan banner</button></div><br>
 <div class="card ov"><table>${L.map((r,i)=>`<tr><td><b>${i+1}</b></td><td><img src="${esc(su(r.image_url))}" alt="" style="width:96px;height:42px;object-fit:cover;border-radius:6px"></td><td>${esc(r.title||'')}</td><td><button class="btn g" data-m="u" data-i="${i}">▲</button> <button class="btn g" data-m="d" data-i="${i}">▼</button> <button class="btn g" data-m="t" data-i="${i}">${r.is_active?'Aktif':'Nonaktif'}</button> <button class="btn g bad" data-m="x" data-i="${i}">Hapus</button></td></tr>`).join('')||'<tr><td class="mut">Belum ada banner</td></tr>'}</table></div>`;
 $('#bs').onclick=async()=>{const u=$('#bi').value.trim();if(!su(u))return toast('Link gambar harus diawali https://');
  const {data:n,error:e}=await sb.from('gh_banners').insert({title:$('#bt').value.trim()||null,image_url:u,link_url:$('#bl').value.trim()||null,sort_order:9999,is_active:true}).select().single();if(e)return toast(e.message);
  const ids=L.map(x=>x.id),pos=Math.min(Math.max((+$('#bo').value||ids.length+1)-1,0),ids.length);ids.splice(pos,0,n.id);await reorder(ids);toast('Banner disimpan di urutan '+(pos+1));admTab('banners')};
 b.onclick=async e=>{const x=e.target.closest('[data-m]');if(!x)return;const i=+x.dataset.i,m=x.dataset.m,ids=L.map(r=>r.id);
  if(m==='u'||m==='d'){const j=m==='u'?i-1:i+1;if(j<0||j>=ids.length)return;[ids[i],ids[j]]=[ids[j],ids[i]];await reorder(ids)}
  else if(m==='t'){const {error}=await sb.from('gh_banners').update({is_active:!L[i].is_active}).eq('id',ids[i]);if(error)return toast(error.message)}
  else if(confirm('Hapus banner ini?')){const {data,error}=await sb.from('gh_banners').delete().eq('id',ids[i]).select();if(error)return toast(error.message);if(!data||!data.length)return toast('Tidak terhapus, jalankan SQL 24 dulu');ids.splice(i,1);await reorder(ids)}
  admTab('banners')}}
const opt=(a,v)=>a.map(([k,l])=>`<option value="${k}" ${k===v?'selected':''}>${l}</option>`).join('');
async function stkAdm(b){const {data,error}=await sb.from('gh_stock').select('*').order('sort_order').order('id',{ascending:false});if(error)throw new Error(error.message+' (jalankan SQL 27 dulu)');const L=data||[];
 b.innerHTML=`<div class="card"><h3>Nomor WhatsApp stok akun</h3><input class="in" data-k="wa_stok" inputmode="tel" placeholder="08xxxxxxxxxx (kosong = pakai WA admin utama)" value="${esc(S.wa_stok||'')}"><button class="btn" onclick="saveStore()">Simpan nomor</button></div><br>
 <div class="card"><h3 id="st">Tambah stok akun</h3><input type="hidden" id="si"><input class="in" id="sn" placeholder="Judul, mis. Akun ML Mythic 120 skin"><div class="row"><select class="in" id="sj">${opt(Object.entries(KIND))}</select><select class="in" id="ss">${opt([['tersedia','Tersedia'],['booking','Booking'],['terjual','Terjual']])}</select></div><div class="row"><input class="in" id="sp" inputmode="numeric" placeholder="Harga (angka, 0 = nego)"><input class="in" id="so" inputmode="numeric" placeholder="Urutan"></div><input class="in" id="sw" inputmode="tel" placeholder="WA khusus item ini (opsional)"><textarea class="in" id="sg" rows="3" placeholder="Link gambar akun, satu link per baris"></textarea><textarea class="in" id="sd" rows="4" placeholder="Deskripsi akun"></textarea><button class="btn" id="sv">Simpan</button> <button class="btn g" id="sc">Batal</button></div><br>
 <div class="card ov"><table>${L.map(r=>`<tr><td>${esc(r.title).slice(0,40)}</td><td>${esc(KIND[r.kind]||r.kind)}</td><td>${esc(r.status)}</td><td>${rp(r.price)}</td><td><button class="btn g" data-m="t" data-id="${r.id}">${r.is_active?'Aktif':'Nonaktif'}</button> <button class="btn g" data-m="e" data-id="${r.id}">Edit</button> <button class="btn g bad" data-m="x" data-id="${r.id}">Hapus</button></td></tr>`).join('')||'<tr><td class="mut">Belum ada stok</td></tr>'}</table></div>`;
 $('#sc').onclick=()=>admTab('stock');
 $('#sv').onclick=async()=>{const row={title:$('#sn').value.trim(),kind:$('#sj').value,status:$('#ss').value,price:+$('#sp').value||0,sort_order:+$('#so').value||0,wa:$('#sw').value.trim()||null,images:$('#sg').value.trim()||null,description:$('#sd').value.trim()||null};if(!row.title)return toast('Isi judul');const id=$('#si').value;const {error}=await(id?sb.from('gh_stock').update(row).eq('id',id):sb.from('gh_stock').insert(row));toast(error?error.message:'Disimpan');if(!error)admTab('stock')};
 b.onclick=async e=>{const x=e.target.closest('[data-m]');if(!x)return;const id=x.dataset.id,r=L.find(v=>String(v.id)===id);
  if(x.dataset.m==='e'){$('#st').textContent='Edit stok akun';$('#si').value=r.id;$('#sn').value=r.title;$('#sj').value=r.kind;$('#ss').value=r.status;$('#sp').value=r.price;$('#so').value=r.sort_order;$('#sw').value=r.wa||'';$('#sg').value=r.images||'';$('#sd').value=r.description||'';scrollTo(0,0)}
  else if(x.dataset.m==='t'){const {error}=await sb.from('gh_stock').update({is_active:!r.is_active}).eq('id',id);toast(error?error.message:'Diubah');admTab('stock')}
  else if(confirm('Hapus stok ini?')){const {data,error}=await sb.from('gh_stock').delete().eq('id',id).select();toast(error?error.message:data&&data.length?'Dihapus':'Tidak terhapus');admTab('stock')}}}
const a3=admTab;
admTab=async t=>{if(t!=='banners'&&t!=='stock'){await a3(t);const tb=document.querySelector('.tabs');if(tb)tb.outerHTML=nav(t);return}
 app.innerHTML=`<div class="wrap">${nav(t)}<div id="ab">Memuat...</div></div>`;const b=$('#ab');
 try{await(t==='banners'?banAdm:stkAdm)(b)}catch(e){b.innerHTML='<div class="card bad">'+esc(e.message)+'</div>'}};
})();
