/* ext.js - tambahan GH TOP-UP: intro baru, UI, menu FAQ/Tutorial/Profil, router, tab admin FAQ/Tutorial */
(()=>{
if(window.__ghx)return;window.__ghx=1;
const css=document.createElement('style');
css.textContent=`
body:before{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(60% 40% at 12% 0,color-mix(in srgb,var(--a) 20%,transparent),transparent),radial-gradient(50% 40% at 100% 25%,color-mix(in srgb,var(--a2) 14%,transparent),transparent)}
.card{background:linear-gradient(160deg,color-mix(in srgb,var(--pan2) 72%,transparent),color-mix(in srgb,var(--pan) 88%,transparent));backdrop-filter:blur(8px);box-shadow:0 12px 32px -20px #000;border-radius:16px}
.hero{padding:44px 22px;border-radius:22px;border-color:color-mix(in srgb,var(--a) 35%,var(--line))}
.hero h1{background:linear-gradient(90deg,#fff,var(--a2));-webkit-background-clip:text;background-clip:text;color:transparent}
.btn{border-radius:12px}.btn.n,.hero .btn{background:linear-gradient(135deg,var(--a),var(--a2));box-shadow:0 8px 24px -10px var(--a)}
.gc img,.gc i{height:112px;border-radius:14px}.gc b{display:block;font-family:'Chakra Petch',sans-serif}
.top{padding:12px 14px}.top nav{gap:2px;overflow-x:auto;max-width:70vw}
.top nav a{padding:6px 11px;border-radius:20px;white-space:nowrap;transition:.2s}.top nav a.on{background:var(--pan2);color:var(--chr);box-shadow:inset 0 0 0 1px var(--a)}
h2{position:relative;padding-left:12px}h2:before{content:"";position:absolute;left:0;top:15%;height:70%;width:4px;border-radius:4px;background:linear-gradient(var(--a),var(--a2))}
.ac{margin-bottom:8px}.ac summary{cursor:pointer;font-weight:600;list-style:none}.ac summary:before{content:"+";color:var(--a);margin-right:8px}.ac[open] summary:before{content:"−"}
.ac p{margin-top:8px;white-space:pre-wrap}
#intro{flex-direction:column;gap:16px}#intro .il{font:700 42px 'Chakra Petch',sans-serif;letter-spacing:.06em;color:#fff;text-shadow:0 0 22px var(--a)}
#intro .il b{display:inline-block;animation:xl .7s calc(var(--i)*.07s) cubic-bezier(.2,.9,.3,1.3) both}
@keyframes xl{from{opacity:0;transform:translateY(26px) scale(.5);filter:blur(10px)}}
#intro .ib{display:block;width:150px;height:3px;border-radius:3px;background:var(--line);overflow:hidden;position:relative}
#intro .ib:after{content:"";position:absolute;inset:0;transform-origin:left;background:linear-gradient(90deg,var(--a),var(--a2));animation:xb 1.3s ease-in-out both}
@keyframes xb{from{transform:scaleX(0)}}
#intro small{color:var(--mut);letter-spacing:.2em;font-size:10px;text-transform:uppercase;animation:ri 1s .5s both}
`;
document.head.append(css);

const it=$('#intro');
if(it)it.innerHTML='<div class="il">'+[...'GH TOP-UP'].map((c,i)=>`<b style="--i:${i}">${c===' '?'&nbsp;':c}</b>`).join('')+'</div><i class="ib"></i><small>Menyiapkan toko</small>';

const nv=document.querySelector('.top nav');
if(nv)nv.innerHTML=[['','Beranda'],['history','Riwayat'],['faq','FAQ'],['tutorial','Tutorial'],['profile','Profil']].map(x=>`<a href="#${x[0]}" data-p="${x[0]||'home'}">${x[1]}</a>`).join('');
const mark=()=>document.querySelectorAll('.top nav a').forEach(a=>a.classList.toggle('on',a.dataset.p===(location.hash.slice(1).split('/')[0]||'home')));

/* ---------- profil (tersimpan di perangkat ini) ---------- */
const PK='gh_prof',gp=()=>{try{return JSON.parse(localStorage.getItem(PK))||{}}catch(e){return{}}},sp=o=>{try{localStorage.setItem(PK,JSON.stringify(o))}catch(e){}};
let cur=null;
const g0=game;game=async id=>{cur=id;await g0(id);const p=gp(),v=(p.ids||{})[id];const w=$('#wa'),u=$('#uid'),s=$('#sid');if(w&&p.wa)w.value=p.wa;if(u&&v){u.value=v.uid||'';s.value=v.sid||''}};
const p0=pay;pay=async o=>{const p=gp(),u=$('#uid');if(u){p.wa=$('#wa').value.trim();p.ids=p.ids||{};p.ids[cur]={uid:u.value.trim(),sid:($('#sid').value||'').trim(),n:($('#app h2')||{}).textContent||'Game'}}
 p.inv=[o.invoice,...(p.inv||[])].filter((v,i,a)=>a.indexOf(v)===i).slice(0,30);sp(p);return p0(o)};
async function profile(){const p=gp(),ids=Object.entries(p.ids||{});
 app.innerHTML=`<div class="wrap"><h2 style="margin-top:0">Profil</h2><div class="card"><label>Nama panggilan</label><input class="in" id="xn" value="${esc(p.n||'')}"><label>Nomor WhatsApp</label><input class="in" id="xw" inputmode="tel" placeholder="08xxxxxxxxxx" value="${esc(p.wa||'')}"><button class="btn" id="xs">Simpan profil</button><p class="sm mut" style="margin-top:8px">Data disimpan di perangkat ini saja dan dipakai untuk mengisi checkout otomatis.</p></div>
 <h2>ID game tersimpan</h2><div class="card ov"><table>${ids.map(([k,v])=>`<tr><td>${esc(v.n)}</td><td>${esc(v.uid)} ${esc(v.sid)}</td><td><button class="btn g" data-g="${esc(k)}">Hapus</button></td></tr>`).join('')||'<tr><td class="mut">Belum ada. Terisi otomatis setelah kamu membuat pesanan.</td></tr>'}</table></div>
 <h2>Pesanan saya</h2><div class="card ov" id="xl">Memuat...</div><br><button class="btn g bad" id="xr">Hapus semua data profil</button></div>`;
 $('#xs').onclick=()=>{const q=gp();q.n=$('#xn').value.trim();q.wa=$('#xw').value.trim();sp(q);toast('Profil disimpan')};
 $('#xr').onclick=()=>{if(confirm('Hapus semua data profil di perangkat ini?')){localStorage.removeItem(PK);profile()}};
 app.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{const q=gp();delete q.ids[b.dataset.g];sp(q);profile()});
 const rows=await Promise.all((p.inv||[]).map(async i=>{const {data}=await sb.rpc('track_order',{p_invoice:i});return Array.isArray(data)?data[0]:data}));
 $('#xl').innerHTML='<table>'+(rows.filter(Boolean).map(r=>`<tr><td><a href="#history">${esc(r.invoice)}</a></td><td>${esc(r.game_name)} - ${esc(r.product_name)}</td><td>${rp(r.total)}</td><td><span class="bd ${r.status==='success'?'ok':r.status==='failed'?'bad':'warn'}">${esc(r.status)}</span></td></tr>`).join('')||'<tr><td class="mut">Belum ada pesanan di perangkat ini.</td></tr>')+'</table>'}

/* ---------- FAQ & Tutorial (pembeli) ---------- */
const acc=(d,a,b)=>(d||[]).map(x=>`<details class="card ac"><summary>${esc(x[a])}</summary><p class="mut">${esc(x[b])}</p></details>`).join('')||'<div class="card mut">Belum ada isi, admin sedang menyiapkan.</div>';
async function faq(){const {data}=await sb.from('gh_faq').select('*').eq('is_active',true).order('sort_order').order('id');app.innerHTML=`<div class="wrap"><h2 style="margin-top:0">FAQ</h2>${acc(data,'question','answer')}<br><a class="btn n" href="https://wa.me/${wa62(S.wa_admin)}">Masih bingung? Chat admin</a></div>`}
async function tutorial(){const {data}=await sb.from('gh_tutorial').select('*').eq('is_active',true).order('sort_order').order('id');app.innerHTML=`<div class="wrap"><h2 style="margin-top:0">Tutorial</h2>${acc(data,'title','body')}</div>`}

/* ---------- router (semua halaman, tanpa tertimpa home) ---------- */
const R=async()=>{const h=location.pathname.replace(/\/+$/,'')==='/admin'?'admin':(location.hash.slice(1)||'home'),[p,a]=h.split('/');scrollTo(0,0);if(!sb)return;
 app.innerHTML='<div class="wrap mut">Memuat...</div>';
 const m={home,game:()=>game(a),history,admin,faq,tutorial,profile};
 try{await(m[p]||home)()}catch(e){app.innerHTML='<div class="wrap"><div class="card bad">Terjadi kesalahan: '+esc(e.message)+'</div></div>'}mark()};
removeEventListener('hashchange',route);route=R;addEventListener('hashchange',R);
if(location.hash||location.pathname.replace(/\/+$/,'')==='/admin')R();else mark();

/* ---------- admin: tab FAQ & Tutorial ---------- */
const TABS=[['orders','Pesanan'],['games','Game'],['products','Produk'],['banners','Banner'],['pay','Pembayaran'],['faq','FAQ'],['tut','Tutorial'],['store','Toko & Tema']];
const nav=t=>`<div class="tabs">${TABS.map(x=>`<button class="btn ${x[0]===t?'':'g'}" onclick="admTab('${x[0]}')">${x[1]}</button>`).join('')}<button class="btn g" onclick="sb.auth.signOut().then(()=>route())">Keluar</button></div>`;
const CR={faq:{t:'gh_faq',a:'question',b:'answer',la:'Pertanyaan',lb:'Jawaban'},tut:{t:'gh_tutorial',a:'title',b:'body',la:'Judul tutorial',lb:'Langkah-langkah (satu baris per langkah)'}};
const a0=admTab;
admTab=async t=>{
 if(!CR[t]){await a0(t);const tb=document.querySelector('.tabs');if(tb)tb.outerHTML=nav(t);return}
 const c=CR[t];app.innerHTML=`<div class="wrap">${nav(t)}<div id="ab">Memuat...</div></div>`;
 const {data,error}=await sb.from(c.t).select('*').order('sort_order').order('id');const D=data||[],b=$('#ab');
 if(error)return b.innerHTML='<div class="card bad">'+esc(error.message)+'<br>Jalankan dulu SQL 25_faq_tutorial.sql di Supabase.</div>';
 b.innerHTML=`<div class="card"><h3 id="xt">Tambah</h3><input type="hidden" id="xi"><input class="in" id="xa" placeholder="${c.la}"><textarea class="in" id="xb" rows="5" placeholder="${c.lb}"></textarea><input class="in" id="xo" inputmode="numeric" placeholder="Urutan (angka kecil tampil dulu)"><button class="btn" id="xs">Simpan</button> <button class="btn g" id="xc">Batal</button></div><br>
 <div class="card ov"><table>${D.map(r=>`<tr><td>${esc(r[c.a]).slice(0,60)}</td><td>${r.sort_order}</td><td><button class="btn g" data-a="t" data-id="${r.id}">${r.is_active?'Aktif':'Nonaktif'}</button> <button class="btn g" data-a="e" data-id="${r.id}">Edit</button> <button class="btn g bad" data-a="d" data-id="${r.id}">Hapus</button></td></tr>`).join('')||'<tr><td class="mut">Belum ada data</td></tr>'}</table></div>`;
 $('#xc').onclick=()=>admTab(t);
 $('#xs').onclick=async()=>{const row={[c.a]:$('#xa').value.trim(),[c.b]:$('#xb').value.trim(),sort_order:+$('#xo').value||0};if(!row[c.a]||!row[c.b])return toast('Isi semua kolom');const id=$('#xi').value;const {error}=await(id?sb.from(c.t).update(row).eq('id',id):sb.from(c.t).insert(row));toast(error?error.message:'Disimpan');if(!error)admTab(t)};
 b.onclick=async e=>{const x=e.target.closest('[data-a]');if(!x)return;const id=x.dataset.id,r=D.find(v=>String(v.id)===id);
  if(x.dataset.a==='e'){$('#xt').textContent='Edit';$('#xi').value=r.id;$('#xa').value=r[c.a];$('#xb').value=r[c.b];$('#xo').value=r.sort_order;scrollTo(0,0)}
  else if(x.dataset.a==='t'){const {error}=await sb.from(c.t).update({is_active:!r.is_active}).eq('id',id);toast(error?error.message:'Diubah');admTab(t)}
  else if(confirm('Hapus data ini?')){const {data,error}=await sb.from(c.t).delete().eq('id',id).select();toast(error?error.message:data&&data.length?'Dihapus':'Tidak terhapus, jalankan SQL 24 dulu');admTab(t)}}};
})();
