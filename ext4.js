/* ext4.js - tahap 4 (jalan setelah ext3.js): status game, hapus pesanan, metode pembayaran, intro logo, efek tema & event */
(()=>{
if(window.__ghx4)return;window.__ghx4=1;
const LOGO='/icon-512.png?v=3',LOGO_S='/icon-192.png?v=3',R=Math.random,TP=Math.PI*2;
const css=document.createElement('style');
css.textContent=`
.stp{display:inline-flex;align-items:center;gap:5px;font:600 11px Sora,sans-serif;border-radius:20px;padding:2px 9px;margin-top:6px;border:1px solid currentColor}
.stp:before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}
.stp.on{color:var(--ok)}.stp.on:before{animation:bk4 1.6s infinite}.stp.su{color:var(--warn)}.stp.of{color:var(--bad)}
@keyframes bk4{50%{opacity:.25}}
.gc.cl .sm{display:none}.gc.cl{opacity:.75}.gc.cl img{filter:grayscale(1)}
.pick.lk{opacity:.5;pointer-events:none}
.pm{display:flex;gap:12px;align-items:center}.pml,.pmf{width:46px;height:46px;border-radius:12px;flex:none}
.pml{object-fit:contain;background:#fff;padding:5px}.pmf{display:grid;place-items:center;background:var(--pan2);border:1px solid var(--line);font:700 18px 'Chakra Petch',sans-serif}
.pmx{opacity:.62}
#intro{display:none!important}
#gi{position:fixed;inset:0;z-index:70;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;overflow:hidden}
#gi .p1,#gi .p2{position:absolute;left:0;right:0;height:50.3%;background:var(--bg);transition:transform .75s cubic-bezier(.7,0,.2,1)}
#gi .p1{top:0}#gi .p2{bottom:0}
#gi .ct{position:relative;display:flex;flex-direction:column;align-items:center;transition:opacity .45s,transform .7s}
#gi.x .p1{transform:translateY(-101%)}#gi.x .p2{transform:translateY(101%)}#gi.x .ct{opacity:0;transform:scale(1.3)}
.gc4{position:relative;width:150px;height:150px}
.gc4 .orb{position:absolute;inset:-80px;border-radius:50%;background:radial-gradient(circle,var(--a) 0,transparent 62%);opacity:0;transform:scale(.3);animation:orb4 1.5s 1.25s ease-out forwards}
@keyframes orb4{30%{opacity:.55;transform:scale(1)}100%{opacity:.16;transform:scale(1.15)}}
.gc4 .rg{position:absolute;inset:-28px;width:calc(100% + 56px);height:calc(100% + 56px);fill:none;overflow:visible}
.rg1 circle{stroke:var(--a);stroke-width:2;stroke-linecap:round;stroke-dasharray:592;stroke-dashoffset:592;animation:dr4 1.2s .1s cubic-bezier(.6,0,.2,1) forwards;filter:drop-shadow(0 0 5px var(--a))}
.rg1{animation:sp4 9s 1.3s linear infinite}
.gc4 .rg2{inset:-46px;width:calc(100% + 92px);height:calc(100% + 92px);animation:sp4 16s linear infinite reverse}
.rg2 circle{stroke:var(--a2);stroke-width:1.6;stroke-dasharray:2 11;stroke-linecap:round;opacity:0;animation:fi4 .7s .6s forwards}
@keyframes dr4{to{stroke-dashoffset:0}}@keyframes fi4{to{opacity:.85}}@keyframes sp4{to{transform:rotate(360deg)}}
.lgx{position:absolute;inset:0;filter:drop-shadow(0 8px 26px color-mix(in srgb,var(--a) 55%,transparent))}
.lgx i{position:absolute;width:calc(50% + .6px);height:calc(50% + .6px);left:calc(var(--x)*50%);top:calc(var(--y)*50%);background:url(/icon-512.png?v=3) calc(var(--x)*100%) calc(var(--y)*100%)/200% 200% no-repeat;opacity:0;filter:blur(8px);transform:translate(calc((var(--x)*2 - 1)*150px),calc((var(--y)*2 - 1)*150px)) scale(.3) rotate(calc((var(--x)*2 - 1)*(var(--y)*2 - 1)*55deg));animation:as4 .85s .65s cubic-bezier(.2,.9,.3,1.15) forwards}
@keyframes as4{to{opacity:1;filter:none;transform:none}}
.lgm{display:none;position:absolute;inset:0;place-items:center;font:700 54px 'Chakra Petch',sans-serif;color:var(--a);border:2px solid var(--a);border-radius:30px;animation:fi4b .6s .8s both}
.nolg .lgm{display:grid}.nolg .lgx i{display:none}
.shn{position:absolute;inset:0;overflow:hidden;border-radius:24px;pointer-events:none}
.shn:after{content:"";position:absolute;top:-20%;bottom:-20%;width:40%;left:-60%;background:linear-gradient(100deg,transparent,#fffb,transparent);transform:skewX(-18deg);animation:sh4 .9s 1.55s ease-in-out forwards}
@keyframes sh4{to{left:130%}}
.wv{position:absolute;inset:0;border-radius:30px;border:2px solid var(--a);opacity:0;animation:wv4 1s 1.35s ease-out forwards}.wv.b{animation-delay:1.5s;border-color:var(--a2)}
@keyframes wv4{from{opacity:.9;transform:scale(1)}to{opacity:0;transform:scale(2.5)}}
.spk{position:absolute;left:50%;top:50%;width:5px;height:5px;margin:-2.5px;border-radius:50%;background:var(--a);box-shadow:0 0 8px var(--a);opacity:0;animation:spk4 .95s 1.35s ease-out forwards}
@keyframes spk4{from{opacity:1;transform:translate(0,0) scale(1)}to{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.2)}}
.ttl{display:flex;margin-top:52px;font:700 34px 'Chakra Petch',sans-serif;letter-spacing:.14em}
.ttl b{display:inline-block;opacity:0;transform:translateY(34px) scale(.6);filter:blur(10px);animation:tl4 .7s calc(1.5s + var(--i)*.06s) cubic-bezier(.2,.9,.3,1.3) forwards,tg4 1.1s calc(2.2s + var(--i)*.05s) ease-in-out}
@keyframes tl4{to{opacity:1;transform:none;filter:none}}@keyframes tg4{50%{color:var(--a);text-shadow:0 0 18px var(--a)}}
.ln4{height:2px;width:0;margin-top:10px;background:linear-gradient(90deg,transparent,var(--a),transparent);animation:ln4 .8s 1.95s cubic-bezier(.2,.9,.3,1) forwards}
@keyframes ln4{to{width:min(260px,70vw)}}
.tg{margin-top:12px;color:var(--mut);font-size:13px;letter-spacing:.06em;opacity:0;animation:fi4b .7s 2.1s forwards}
.pb{width:min(190px,56vw);height:3px;border-radius:3px;background:var(--line);margin-top:26px;overflow:hidden;opacity:0;animation:fi4b .4s .3s forwards}
.pb i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--a2),var(--a));box-shadow:0 0 10px var(--a)}
.pc{margin-top:8px;font:600 11px 'Chakra Petch',sans-serif;color:var(--mut);letter-spacing:.2em;opacity:0;animation:fi4b .4s .3s forwards}
@keyframes fi4b{to{opacity:1}}
#evd{position:fixed;top:0;left:0;right:0;height:16px;z-index:6;pointer-events:none;display:flex;justify-content:space-around;align-items:flex-start}
#evd i{font-style:normal;font-size:11px;color:var(--a);animation:tw4 2s calc(var(--i)*.17s) ease-in-out infinite}
#evd.natal i{width:7px;height:9px;border-radius:50%;background:var(--c);box-shadow:0 0 8px var(--c);margin-top:2px;animation-duration:1.4s}
#evd.musimpanas i{width:5px;height:5px;border-radius:50%;background:var(--a);margin-top:2px}
@keyframes tw4{50%{opacity:.25;transform:scale(.8)}}
body,.card{transition:background-color .6s,border-color .6s,box-shadow .3s,transform .25s}
[data-t=neon] .hero{box-shadow:0 0 44px -14px var(--a),inset 0 0 44px -32px var(--a)}
[data-t=neon] .card.hv:hover{box-shadow:0 0 26px -4px var(--a)}
[data-t=cyber]:after,html[data-t=cyber] body:after{content:"";position:fixed;inset:0;z-index:2;pointer-events:none;background:repeating-linear-gradient(0deg,#0000 0 2px,#ffffff07 2px 3px)}
[data-t=cyber] h2,[data-t=cyber] .logo{text-shadow:0 0 12px color-mix(in srgb,var(--a) 60%,transparent)}
[data-t=ocean] .hero{background:linear-gradient(135deg,#0b2a4a,var(--bg) 70%)}
[data-t=gold] .hero{background:linear-gradient(110deg,var(--pan2) 30%,#3a2f0d 50%,var(--pan2) 70%) 0 0/250% 100%;animation:gs4 7s linear infinite}
@keyframes gs4{to{background-position:-250% 0}}
[data-t=event][data-e=ramadan] .hero{background:linear-gradient(135deg,#0c2a22,var(--bg) 70%)}
[data-t=event][data-e=natal] .hero{background:linear-gradient(135deg,#2a0d12,#0b2314 80%)}
[data-t=event][data-e=tahunbaru] .hero{background:linear-gradient(135deg,#1c1038,var(--bg) 75%)}
[data-t=event][data-e=musimpanas] .hero{background:linear-gradient(135deg,#0d3a55,#3a2a0d 90%)}
`;
document.head.append(css);

/* ---------- logo baru (lewati cache lama) ---------- */
document.querySelectorAll('.top .lg').forEach(i=>i.src=LOGO_S);
document.querySelectorAll('link[rel=icon],link[rel=apple-touch-icon]').forEach(l=>l.href=LOGO_S);

/* ---------- label status game ---------- */
const GST={online:['Online','on'],setup:['Lagi setup','su'],offline:['Offline','of']};
const gpill=s=>{const v=GST[s]||GST.offline;return `<span class="stp ${v[1]}">${v[0]}</span>`};
const fix4=()=>document.querySelectorAll('.gc').forEach(c=>{if(c.dataset.st)return;const o=c.getAttribute('onclick')||'',s=/disetup/.test(o)?'setup':/offline/.test(o)?'offline':'online';c.dataset.st=s;c.insertAdjacentHTML('beforeend',gpill(s))});
let ft4;new MutationObserver(()=>{clearTimeout(ft4);ft4=setTimeout(fix4,40)}).observe($('#app'),{childList:true,subtree:true});fix4();

const g4=game;
game=async id=>{await g4(id);
 try{const {data:g}=await sb.from('games').select('status').eq('id',id).maybeSingle();if(!g)return;
  const h=document.querySelector('#app h2'),buy=$('#buy');if(h&&!h.querySelector('.stp'))h.insertAdjacentHTML('beforeend',' '+gpill(g.status));if(!buy)return;
  if(g.status!=='online'){h.insertAdjacentHTML('afterend',`<div class="card warn" style="margin-bottom:12px">${g.status==='setup'?'Game ini sedang disetup, belum bisa dipesan.':'Game ini sedang offline, belum bisa dipesan.'}</div>`);
   buy.disabled=true;buy.textContent=g.status==='setup'?'Game lagi setup':'Game offline';document.querySelectorAll('.pick').forEach(p=>p.classList.add('lk'))}
  else buy.addEventListener('click',async e=>{if(buy.dataset.ok){delete buy.dataset.ok;return}e.stopImmediatePropagation();
   const {data:c}=await sb.from('games').select('status').eq('id',id).maybeSingle();
   if(c&&c.status==='online'){buy.dataset.ok=1;buy.click()}else{toast('Game ini baru saja ditutup, coba lagi nanti');game(id)}},true)}catch(e){}};

/* ---------- admin: hapus pesanan ---------- */
async function delOrder(id,p){if(!confirm('Hapus pesanan ini permanen? Bukti transfer ikut dihapus. Kalau statusnya sukses, omzet ikut berkurang.'))return;
 const {data,error}=await sb.from('orders').delete().eq('id',id).select('id');if(error)return toast(error.message);if(!data||!data.length)return toast('Gagal hapus: izin belum ada, jalankan SQL 28 dulu');
 if(p)sb.storage.from('bukti-transfer').remove([p]).catch(()=>{});toast('Pesanan dihapus');admTab('orders')}
function ordX(){document.querySelectorAll('#ab table tr').forEach(tr=>{const s=tr.querySelector('[onclick*="setSt("]');if(!s||tr.querySelector('.dx4'))return;
 const id=(s.getAttribute('onclick').match(/setSt\('([^']+)'/)||[])[1],pv=tr.querySelector('[onclick*="vProof("]'),pp=pv?(pv.getAttribute('onclick').match(/vProof\('([^']+)'/)||[])[1]:'';
 const b=document.createElement('button');b.className='btn g bad dx4';b.textContent='Hapus';b.onclick=()=>delOrder(id,pp);s.parentElement.append(' ',b)})}

/* ---------- metode pembayaran: status, logo, ubah rekening ---------- */
const ST4={online:['Online','on'],gangguan:['Lagi gangguan','of'],update:['Sedang diperbarui','su']};
const stp=s=>{const v=ST4[s]||ST4.online;return `<span class="stp ${v[1]}">${v[0]}</span>`};
window.gl4=el=>{const b=el.dataset.b;el.dataset.b='';if(b){el.src=b;return}el.replaceWith(Object.assign(document.createElement('b'),{className:'pmf',textContent:el.dataset.n||'?'}))};
const lgi=m=>{const a=su(m.logo_url),b=su(m.logo_url2),f=a||b,n=esc((m.name||'?').slice(0,1).toUpperCase());return f?`<img class="pml" src="${esc(f)}" data-b="${a&&b?esc(b):''}" data-n="${n}" alt="" onerror="gl4(this)">`:`<b class="pmf">${n}</b>`};
const onl=m=>(m.status||'online')==='online';

const p4=pay;
pay=async o=>{await p4(o);
 try{const {data}=await sb.from('gh_payment_methods').select('*').eq('is_active',true).order('sort_order').order('id');
  let L=data||[];if(!L.length&&S.qris_url)L=[{name:'QRIS',image_url:S.qris_url}];L=[...L].sort((a,b)=>onl(b)-onl(a));
  const card=m=>onl(m)?`<div class="card" style="margin:10px 0;text-align:left"><div class="pm">${lgi(m)}<div><b>${esc(m.name)}</b><br>${stp('online')}</div></div>${su(m.image_url)?`<div style="text-align:center"><img src="${esc(su(m.image_url))}" alt="" style="max-width:220px;width:100%;border-radius:10px;background:#fff;margin-top:10px"></div>`:''}${m.account_number?`<p style="margin-top:8px">${esc(m.account_number)} <button class="btn g" data-c="${esc(m.account_number)}" onclick="navigator.clipboard.writeText(this.dataset.c);toast('Disalin')">Salin</button></p>`:''}${m.account_name?`<p class="sm mut">a.n. ${esc(m.account_name)}</p>`:''}${m.note?`<p class="sm mut">${esc(m.note)}</p>`:''}</div>`
   :`<div class="card pmx" style="margin:10px 0;text-align:left"><div class="pm">${lgi(m)}<div><b>${esc(m.name)}</b><br>${stp(m.status)}</div></div><p class="sm mut" style="margin-top:6px">${m.status==='update'?'Sedang diperbarui, belum bisa dipakai.':'Lagi gangguan, belum bisa dipakai. Pilih metode lain ya.'}</p></div>`;
  const box=L.map(card).join('')||'<p class="mut">Metode pembayaran belum diatur admin.</p>',warn=L.length&&!L.some(onl)?'<div class="card warn" style="margin:10px 0">Semua metode lagi tidak bisa dipakai. Hubungi admin lewat WhatsApp.</div>':'';
  app.innerHTML=`<div class="wrap"><h2 style="margin-top:0">Pembayaran</h2><div class="card" style="text-align:center"><p>Invoice <b>${esc(o.invoice)}</b></p><p>Total <b>${rp(o.total)}</b></p>${warn}${box}
 <div class="card" style="margin:10px 0"><p class="sm mut">Upload bukti pembayaran (JPG/PNG/WebP, maks 5 MB)</p><input type="file" id="pf" accept="image/jpeg,image/png,image/webp" class="in"><button class="btn" id="pu" onclick="upProof('${esc(o.invoice)}')">Kirim bukti</button></div>
 <a class="btn n" href="https://wa.me/${wa62(S.wa_admin)}?text=${encodeURIComponent('Halo admin, saya sudah bayar invoice '+o.invoice)}">Konfirmasi ke admin via WhatsApp</a>
 <p class="sm mut" style="margin-top:10px">Pembayaran diverifikasi manual oleh admin. Simpan nomor invoice untuk cek status.</p></div></div>`}catch(e){}};

async function payAdm(){const b=$('#ab');if(!b)return;
 const {data,error}=await sb.from('gh_payment_methods').select('*').order('sort_order').order('id');
 if(error)return b.innerHTML='<div class="card bad">'+esc(error.message)+'<br>Jalankan dulu SQL 29.</div>';
 const L=data||[];let lg2='';
 b.innerHTML=`<div class="card"><h3 id="yt4">Tambah metode pembayaran</h3><input type="hidden" id="yi4"><input class="in" id="yn4" placeholder="Nama, mis. DANA / BCA">
 <div class="row"><select class="in" id="yy4"><option value="bank">Bank</option><option value="ewallet">E-wallet</option><option value="qris">QRIS</option></select><select class="in" id="ys4"><option value="online">Online</option><option value="gangguan">Lagi gangguan</option><option value="update">Sedang diperbarui</option></select></div>
 <input class="in" id="ya4" placeholder="Nama pemilik rekening"><input class="in" id="yb4" placeholder="Nomor rekening / e-wallet"><input class="in" id="yq4" placeholder="Link gambar QRIS (opsional)">
 <input class="in" id="yl4" placeholder="Link logo (https://...)"><label class="sm mut">Upload logo (dipakai kalau link logo tidak bisa dibuka)</label><input class="in" type="file" id="yf4" accept="image/png,image/jpeg,image/webp"><div id="yp4" class="sm mut" style="margin-bottom:8px"></div>
 <input class="in" id="yc4" placeholder="Catatan (opsional)"><input class="in" id="yo4" inputmode="numeric" placeholder="Urutan (angka kecil tampil dulu)"><button class="btn" id="yv4">Simpan</button> <button class="btn g" id="yx4">Batal</button></div><br>
 <div class="card ov"><table>${L.map(r=>`<tr><td>${lgi(r)}</td><td><b>${esc(r.name)}</b><br><span class="sm mut">${esc(r.account_number||'belum ada rekening')}</span></td><td><select class="in" style="margin:0" data-st="${r.id}">${Object.entries(ST4).map(([k,v])=>`<option value="${k}" ${k===(r.status||'online')?'selected':''}>${v[0]}</option>`).join('')}</select></td><td><button class="btn g" data-a="e" data-id="${r.id}">Edit</button> <button class="btn g" data-a="t" data-id="${r.id}">${r.is_active?'Tampil':'Disembunyikan'}</button> <button class="btn g bad" data-a="d" data-id="${r.id}">Hapus</button></td></tr>`).join('')||'<tr><td class="mut">Belum ada metode</td></tr>'}</table></div>`;
 $('#yx4').onclick=()=>admTab('pay');
 $('#yf4').onchange=async e=>{const f=e.target.files[0];if(!f)return;const ext={'image/png':'png','image/jpeg':'jpg','image/webp':'webp'}[f.type];if(!ext||f.size>2097152){e.target.value='';return toast('Logo harus PNG/JPG/WebP, maks 2 MB')}
  $('#yp4').textContent='Mengupload...';const path='pm-'+Date.now()+'.'+ext,u=await sb.storage.from('logo-pembayaran').upload(path,f,{contentType:f.type});
  if(u.error){$('#yp4').textContent='';return toast('Upload gagal: '+u.error.message+' (jalankan SQL 29)')}
  lg2=sb.storage.from('logo-pembayaran').getPublicUrl(path).data.publicUrl;$('#yp4').textContent='Logo terupload, klik Simpan.'};
 $('#yv4').onclick=async()=>{const row={name:$('#yn4').value.trim(),type:$('#yy4').value,status:$('#ys4').value,account_name:$('#ya4').value.trim()||null,account_number:$('#yb4').value.trim()||null,image_url:$('#yq4').value.trim()||null,logo_url:$('#yl4').value.trim()||null,logo_url2:lg2||null,note:$('#yc4').value.trim()||null,sort_order:+$('#yo4').value||L.length+1};
  if(!row.name)return toast('Isi nama metode');if(row.image_url&&!su(row.image_url))return toast('Link QRIS harus diawali https://');if(row.logo_url&&!su(row.logo_url))return toast('Link logo harus diawali https://');
  const id=$('#yi4').value,{error}=await(id?sb.from('gh_payment_methods').update(row).eq('id',id):sb.from('gh_payment_methods').insert(row));toast(error?error.message:'Disimpan');if(!error)admTab('pay')};
 b.onchange=async e=>{const s=e.target.closest('[data-st]');if(!s)return;const {error}=await sb.from('gh_payment_methods').update({status:s.value}).eq('id',s.dataset.st);toast(error?error.message:'Status diubah')};
 b.onclick=async e=>{const x=e.target.closest('[data-a]');if(!x)return;const id=x.dataset.id,r=L.find(v=>String(v.id)===id);
  if(x.dataset.a==='e'){$('#yt4').textContent='Edit metode pembayaran';$('#yi4').value=r.id;$('#yn4').value=r.name||'';$('#yy4').value=r.type||'bank';$('#ys4').value=r.status||'online';$('#ya4').value=r.account_name||'';$('#yb4').value=r.account_number||'';$('#yq4').value=r.image_url||'';$('#yl4').value=r.logo_url||'';$('#yc4').value=r.note||'';$('#yo4').value=r.sort_order??'';lg2=r.logo_url2||'';$('#yp4').textContent=lg2?'Ada logo upload tersimpan.':'';scrollTo(0,0)}
  else if(x.dataset.a==='t'){const {error}=await sb.from('gh_payment_methods').update({is_active:!r.is_active}).eq('id',id);toast(error?error.message:'Diubah');admTab('pay')}
  else if(confirm('Hapus metode ini?')){const {data,error}=await sb.from('gh_payment_methods').delete().eq('id',id).select('id');toast(error?error.message:data&&data.length?'Dihapus':'Tidak terhapus');admTab('pay')}}}

const a4=admTab;
admTab=async t=>{await a4(t);if(t==='orders')ordX();if(t==='pay')await payAdm()};

/* ---------- intro logo (animasi lengkap) ---------- */
function intro4(){if(sessionStorage.getItem('gh_i4')||matchMedia('(prefers-reduced-motion:reduce)').matches)return;sessionStorage.setItem('gh_i4',1);
 const o=document.createElement('div');o.id='gi';
 const sp=Array.from({length:16},(_,i)=>{const a=i/16*TP+R()*.3,d=80+R()*70;return `<i class="spk" style="--dx:${Math.cos(a)*d|0}px;--dy:${Math.sin(a)*d|0}px;animation-delay:${1.35+R()*.12}s"></i>`}).join('');
 o.innerHTML=`<i class="p1"></i><i class="p2"></i><div class="ct"><div class="gc4"><div class="orb"></div><svg class="rg rg1" viewBox="0 0 200 200"><circle cx="100" cy="100" r="94"/></svg><svg class="rg rg2" viewBox="0 0 200 200"><circle cx="100" cy="100" r="96"/></svg><div class="wv"></div><div class="wv b"></div>
 <div class="lgx"><i style="--x:0;--y:0"></i><i style="--x:1;--y:0"></i><i style="--x:0;--y:1"></i><i style="--x:1;--y:1"></i><b class="lgm">GH</b><u class="shn"></u></div>${sp}</div>
 <div class="ttl">${[...'GH TOP-UP'].map((c,i)=>`<b style="--i:${i}">${c===' '?'&nbsp;':c}</b>`).join('')}</div><div class="ln4"></div><div class="tg">Top up game cepat, rapi, terpercaya</div><div class="pb"><i id="gpb"></i></div><div class="pc" id="gpc">0%</div></div>`;
 document.body.append(o);
 const im=new Image();im.onerror=()=>o.querySelector('.gc4').classList.add('nolg');im.src=LOGO;
 const t0=performance.now(),tk=setInterval(()=>{const p=Math.min(1,Math.max(0,(performance.now()-t0-300)/2600)),e=1-Math.pow(1-p,2.2),v=Math.round(e*100);$('#gpb').style.width=v+'%';$('#gpc').textContent=v+'%'},40);
 const out=()=>{clearInterval(tk);o.classList.add('x');setTimeout(()=>o.remove(),950)};o.onclick=out;setTimeout(out,3100)}
intro4();

/* ---------- efek latar tema & event ---------- */
const fx0=fxInit;removeEventListener('resize',fx0);
fxInit=()=>{cancelAnimationFrame(raf);
 const c=$('#fx'),x=c.getContext('2d'),W=c.width=innerWidth,H=c.height=innerHeight,th=S.theme||'chrome',K=th==='event'?(S.event_preset||'ramadan'):th,cs=getComputedStyle(document.documentElement);
 const A=cs.getPropertyValue('--a').trim()||'#5cf2ff',B=cs.getPropertyValue('--a2').trim()||'#9aa3b2';
 const k=matchMedia('(prefers-reduced-motion:reduce)').matches?0:({LOW:0,MEDIUM:1,MAX:2})[Q];if(!k)return;
 const star=(px,py,r)=>{x.beginPath();x.moveTo(px,py-r);x.quadraticCurveTo(px,py,px+r,py);x.quadraticCurveTo(px,py,px,py+r);x.quadraticCurveTo(px,py,px-r,py);x.quadraticCurveTo(px,py,px,py-r);x.fill()};
 const wrap=p=>{if(p.y<-30){p.y=H+30;p.x=R()*W}};
 const bub={n:28,i:()=>({x:R()*W,y:R()*H,r:R()*7+2,v:R()*.6+.2,p:R()*TP}),d:p=>{p.y-=p.v;p.p+=.03;p.x+=Math.sin(p.p)*.5;wrap(p);x.globalAlpha=.4;x.strokeStyle=A;x.lineWidth=1;x.beginPath();x.arc(p.x,p.y,p.r,0,TP);x.stroke();x.globalAlpha=.5;x.fillStyle='#fff';x.beginPath();x.arc(p.x-p.r*.3,p.y-p.r*.3,p.r*.2,0,TP);x.fill()}};
 const F=[];let nf=0;
 const KD={
  chrome:{n:34,i:()=>({x:R()*W,y:R()*H,r:R()*1.6+.5,v:R()*.35+.1,p:R()*TP}),d:p=>{p.y-=p.v;p.p+=.02;p.x+=Math.sin(p.p)*.25;wrap(p);x.globalAlpha=.2+.35*Math.abs(Math.sin(p.p));x.fillStyle=A;x.beginPath();x.arc(p.x,p.y,p.r,0,TP);x.fill()}},
  neon:{n:30,pre:()=>{x.globalCompositeOperation='lighter'},i:j=>({x:R()*W,y:R()*H,r:R()*22+8,v:R()*.3+.08,p:R()*TP,c:j%2?A:B}),d:p=>{p.y-=p.v;p.p+=.01;p.x+=Math.sin(p.p)*.4;wrap(p);const g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);g.addColorStop(0,p.c);g.addColorStop(1,'transparent');x.globalAlpha=.22;x.fillStyle=g;x.beginPath();x.arc(p.x,p.y,p.r,0,TP);x.fill()}},
  cyber:{n:Math.round(W/28*(k>1?1:.6)),i:j=>({x:j*28+8,y:R()*H,v:R()*2+1.2,s:R()*99|0}),d:p=>{p.y+=p.v;if(p.y>H+130){p.y=-20;p.s=R()*99|0}x.font='14px monospace';const ch='01ｱｲｳｴｵ<>/{}';for(let j=0;j<8;j++){x.globalAlpha=(1-j/8)*.5;x.fillStyle=j?A:'#fff';x.fillText(ch[(p.s+j+(p.y/16|0))%ch.length],p.x,p.y-j*16)}}},
  ocean:bub,
  gold:{n:40,i:j=>({x:R()*W,y:R()*H,r:R()*3+1.5,p:R()*TP,v:R()*.15+.03,c:j%3?A:B}),d:p=>{p.p+=.04;p.y+=p.v;if(p.y>H+5)p.y=-5;x.globalAlpha=Math.max(0,Math.sin(p.p))*.9;x.fillStyle=p.c;star(p.x,p.y,p.r*(1+.3*Math.sin(p.p)))}},
  ramadan:{n:44,i:j=>j<Math.ceil(5*k)?{l:1,x:R()*W,y:R()*H,v:.25+R()*.2,p:R()*TP,s:22+R()*10}:{x:R()*W,y:R()*H*.85,r:R()*2+.8,p:R()*TP},
   pre:()=>{const cx=W-70,cy=110,r=34,g=x.createRadialGradient(cx,cy,r*.5,cx,cy,r*3.4);g.addColorStop(0,A+'66');g.addColorStop(1,A+'00');x.fillStyle=g;x.fillRect(cx-r*4,cy-r*4,r*8,r*8);
    x.save();x.beginPath();x.arc(cx,cy,r,0,TP);x.clip();x.fillStyle=A;x.globalAlpha=.95;x.beginPath();x.rect(0,0,W,H);x.arc(cx+r*.5,cy-r*.1,r*.8,0,TP);x.fill('evenodd');x.restore()},
   d:p=>{if(p.l){p.y-=p.v;p.p+=.012;p.x+=Math.sin(p.p)*.35;wrap(p);x.globalAlpha=.85;x.font=p.s+'px serif';x.fillText('🏮',p.x,p.y)}else{p.p+=.05;x.globalAlpha=.3+.7*Math.abs(Math.sin(p.p));x.fillStyle=B;star(p.x,p.y,p.r*2.2)}}},
  natal:{n:80,i:()=>{const r=R()*2.6+.8;return {x:R()*W,y:R()*H,r,v:r*.28+.25,p:R()*TP}},d:p=>{p.y+=p.v;p.p+=.015;p.x+=Math.sin(p.p)*.5;if(p.y>H+5){p.y=-5;p.x=R()*W}x.globalAlpha=.55+p.r*.1;x.fillStyle='#fff';x.beginPath();x.arc(p.x,p.y,p.r,0,TP);x.fill()}},
  tahunbaru:{n:34,i:()=>({x:R()*W,y:R()*H,w:R()*6+4,h:R()*3+2,v:R()*.9+.5,p:R()*TP,a:R()*TP,c:[A,B,'#fff','#ff6b9d'][R()*4|0]}),
   pre:t=>{if(t-nf>1100/k){nf=t;const cx=W*(.15+R()*.7),cy=H*(.12+R()*.4),c=[A,B,'#fff','#ff6b9d'][R()*4|0];for(let j=0;j<40;j++){const a=j/40*TP,s=R()*3+1.2;F.push({x:cx,y:cy,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1,c})}}
    for(let j=F.length-1;j>=0;j--){const s=F[j];s.vx*=.985;s.vy=s.vy*.985+.035;s.x+=s.vx;s.y+=s.vy;s.l-=.014;if(s.l<=0){F.splice(j,1);continue}x.globalAlpha=s.l;x.fillStyle=s.c;x.beginPath();x.arc(s.x,s.y,1.7,0,TP);x.fill()}},
   d:p=>{p.y+=p.v;p.p+=.03;p.x+=Math.sin(p.p)*.7;p.a+=.05;if(p.y>H+10){p.y=-10;p.x=R()*W}x.save();x.translate(p.x,p.y);x.rotate(p.a);x.globalAlpha=.8;x.fillStyle=p.c;x.fillRect(-p.w/2,-p.h/2,p.w,p.h);x.restore()}},
  musimpanas:{n:30,i:bub.i,d:p=>{p.y-=p.v;p.p+=.03;p.x+=Math.sin(p.p)*.5;wrap(p);x.globalAlpha=.35;x.fillStyle=B;x.beginPath();x.arc(p.x,p.y,p.r*.5,0,TP);x.fill()},
   pre:t=>{const cx=W-60,cy=90,r=26,g=x.createRadialGradient(cx,cy,r*.4,cx,cy,r*4);g.addColorStop(0,A+'88');g.addColorStop(1,A+'00');x.fillStyle=g;x.fillRect(cx-r*5,cy-r*5,r*10,r*10);
    x.save();x.translate(cx,cy);x.rotate(t/7000);x.strokeStyle=A;x.lineWidth=3;x.lineCap='round';x.globalAlpha=.4;for(let j=0;j<12;j++){x.rotate(TP/12);x.beginPath();x.moveTo(r*1.4,0);x.lineTo(r*2.1,0);x.stroke()}x.restore();
    x.globalAlpha=1;x.fillStyle=A;x.beginPath();x.arc(cx,cy,r,0,TP);x.fill()}}
 };
 const D=KD[K]||KD.chrome,P=Array.from({length:Math.round(D.n*(K==='cyber'?1:k)),},(_,j)=>D.i(j));
 const frame=t=>{x.globalCompositeOperation='source-over';x.clearRect(0,0,W,H);x.globalAlpha=1;if(D.pre)D.pre(t);P.forEach(D.d);x.globalAlpha=1;x.globalCompositeOperation='source-over';raf=requestAnimationFrame(frame)};
 raf=requestAnimationFrame(frame)};
let rt4;addEventListener('resize',()=>{clearTimeout(rt4);rt4=setTimeout(fxInit,200)});

/* ---------- hiasan tepi atas khusus event ---------- */
const EVI={ramadan:i=>`<i style="--i:${i}">${i%2?'✦':'☪'}</i>`,natal:i=>`<i style="--i:${i};--c:${['#ff4d5e','#4ade80','#ffd76a','#4da3ff'][i%4]}"></i>`,tahunbaru:i=>`<i style="--i:${i}">✦</i>`,musimpanas:i=>`<i style="--i:${i}"></i>`};
function evd(){let e=$('#evd');if(!e){e=document.createElement('div');e.id='evd';document.body.append(e)}
 const ev=S.theme==='event'?S.event_preset:'';e.className=ev||'';e.innerHTML=EVI[ev]?Array.from({length:22},(_,i)=>EVI[ev](i)).join(''):''}
const at4=applyTheme;applyTheme=()=>{at4();evd()};
applyTheme();
})();
