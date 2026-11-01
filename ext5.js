/* ext5.js - tahap 5 (jalan setelah ext4.js): intro GH + diamond, tema Ramadan / Natal & Tahun Baru / Imlek / Musim Panas baru, blokir game setup */
(()=>{
if(window.__ghx5)return;window.__ghx5=1;
const R=Math.random,TP=Math.PI*2,rnd=(a,b)=>a+R()*(b-a),pick=a=>a[R()*a.length|0];
/* logo intro: dicoba berurutan. Kalau sudah upload ke repo, taruh '/logo.png' paling depan */
const LOGOS=['https://i.postimg.cc/3Ndy8D7J/1000367499-removebg-preview.png','/icon-512.png?v=3'];

const css=document.createElement('style');
css.textContent=`
[data-t=event][data-e=natalbaru]{--a:#ff4d5e;--a2:#ffd76a;--bg:#0a0709}
[data-t=event][data-e=imlek]{--a:#ff3b3b;--a2:#ffd166;--bg:#120405}
[data-t=event][data-e=natalbaru] .hero{background:linear-gradient(135deg,#2a0d12,#0b2314 80%)}
[data-t=event][data-e=imlek] .hero{background:linear-gradient(135deg,#3a0a0a,#120405 75%)}
#evd.imlek i{width:8px;height:11px;border-radius:50% 50% 45% 45%;background:#ff3b3b;box-shadow:0 0 9px #ffb703;margin-top:2px;animation:tw4 1.8s calc(var(--i)*.15s) ease-in-out infinite}
.blk5{text-align:center;padding:36px 18px}.blk5 .e{font-size:50px}.blk5 .n{font:700 20px 'Chakra Petch',sans-serif;margin:6px 0}
/* intro: GH + diamond */
.gx5{position:relative;width:190px;height:190px}
.or5{position:absolute;inset:-70px;border-radius:50%;background:radial-gradient(circle,var(--a) 0,transparent 62%);opacity:0;transform:scale(.3);animation:or5 1.6s 1.9s ease-out forwards}
@keyframes or5{35%{opacity:.5;transform:scale(1)}100%{opacity:.14;transform:scale(1.12)}}
.dmw5,.ltw5,.lgw5{position:absolute;inset:0}
.dmw5{transition:opacity .7s}.ltw5{transition:opacity .6s}
.dm5{width:100%;height:100%;overflow:visible;fill:none;animation:dsp5 1.3s .05s cubic-bezier(.2,.9,.3,1.1) both}
@keyframes dsp5{from{opacity:0;transform:rotate(-70deg) scale(.5)}}
.dm5 path{stroke:url(#gd5);stroke-width:2.4;stroke-linejoin:round;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;filter:drop-shadow(0 0 6px var(--a));animation:dd5 1.1s .2s cubic-bezier(.6,0,.2,1) forwards}
.dm5 path.n{stroke-width:1.4;animation-duration:.9s;animation-delay:.9s}
@keyframes dd5{to{stroke-dashoffset:0}}
.dm5 circle{fill:#fff;opacity:0;transform-box:fill-box;transform-origin:center;filter:drop-shadow(0 0 6px var(--a));animation:tp5 .6s var(--d) forwards}
@keyframes tp5{0%{opacity:0;transform:scale(0)}60%{opacity:1;transform:scale(2.2)}100%{opacity:1;transform:scale(1)}}
.lt5{position:absolute;left:50%;top:50%;font:700 64px 'Chakra Petch',sans-serif;color:#fff;text-shadow:0 0 20px var(--a),0 0 40px var(--a);animation:lt5 .85s var(--d) cubic-bezier(.2,.9,.3,1.1) both}
@keyframes lt5{from{opacity:0;filter:blur(12px);transform:translate(calc(-50% + var(--sx)),-50%) scale(1.6)}to{opacity:1;filter:blur(0);transform:translate(calc(-50% + var(--dx)),-50%) scale(1)}}
.lgw5{opacity:0}
.lgon .lgw5{animation:lgi5 .9s cubic-bezier(.2,.9,.3,1.2) both}
@keyframes lgi5{from{opacity:0;transform:scale(.72) rotate(-8deg);filter:blur(8px)}to{opacity:1;transform:none;filter:none}}
.lgon .ltw5,.lgon .dmw5{opacity:0}
.lg5{width:100%;height:100%;object-fit:contain;display:block;filter:drop-shadow(0 6px 22px color-mix(in srgb,var(--a) 55%,transparent))}
.sn5{position:absolute;inset:0;pointer-events:none;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.95) 50%,transparent 60%) -150% 0/250% 100% no-repeat;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center}
.lgon .sn5{animation:snm5 1s .85s ease-in-out forwards}
@keyframes snm5{to{background-position:250% 0}}
.ttl5{display:flex;margin-top:46px;font:700 34px 'Chakra Petch',sans-serif;letter-spacing:.14em}
.ttl5 b{display:inline-block;opacity:0;transform:translateY(34px) scale(.6);filter:blur(10px);animation:tl4 .7s calc(2.45s + var(--i)*.06s) cubic-bezier(.2,.9,.3,1.3) forwards,tg4 1.1s calc(3.1s + var(--i)*.05s) ease-in-out}
.ln5{height:2px;width:0;margin-top:10px;background:linear-gradient(90deg,transparent,var(--a),transparent);animation:ln4 .8s 3s cubic-bezier(.2,.9,.3,1) forwards}
.tg5{margin-top:12px;color:var(--mut);font-size:13px;letter-spacing:.06em;opacity:0;animation:fi4b .7s 3.1s forwards}
`;
document.head.append(css);

/* ---------- INTRO: tulisan GH masuk, bentuk diamond tergambar, lalu berubah jadi logo ---------- */
function intro5(){
 if(sessionStorage.getItem('gh_i5')||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 try{sessionStorage.setItem('gh_i5',1)}catch(e){}
 const old=document.getElementById('gi');if(old)old.remove();
 const o=document.createElement('div');o.id='gi';
 const spk=Array.from({length:18},(_,i)=>{const a=i/18*TP+R()*.3,d=90+R()*80;return `<i class="spk" style="--dx:${Math.cos(a)*d|0}px;--dy:${Math.sin(a)*d|0}px;animation-delay:${2+R()*.15}s"></i>`}).join('');
 o.innerHTML=`<i class="p1"></i><i class="p2"></i><div class="ct"><div class="gx5">
 <div class="or5"></div>
 <div class="dmw5"><svg class="dm5" viewBox="0 0 200 200"><defs><linearGradient id="gd5" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--a)"/><stop offset="1" style="stop-color:var(--a2)"/></linearGradient></defs>
  <path class="o" d="M100 6L194 100L100 194L6 100Z" pathLength="1"/><path class="n" d="M100 36L164 100L100 164L36 100Z" pathLength="1"/>
  <circle cx="100" cy="6" r="3.5" style="--d:.95s"/><circle cx="194" cy="100" r="3.5" style="--d:1.05s"/><circle cx="100" cy="194" r="3.5" style="--d:1.15s"/><circle cx="6" cy="100" r="3.5" style="--d:1.25s"/></svg></div>
 <div class="ltw5"><b class="lt5" style="--sx:-170px;--dx:-27px;--d:.55s">G</b><b class="lt5" style="--sx:170px;--dx:27px;--d:.7s">H</b></div>
 <div class="lgw5"><img class="lg5" alt=""><i class="sn5"></i></div>${spk}</div>
 <div class="ttl5">${[...'GH TOP-UP'].map((c,i)=>`<b style="--i:${i}">${c===' '?'&nbsp;':c}</b>`).join('')}</div><div class="ln5"></div><div class="tg5">Top up game cepat, rapi, terpercaya</div><div class="pb"><i id="gpb"></i></div><div class="pc" id="gpc">0%</div></div>`;
 document.body.append(o);
 const t0=performance.now(),gx=o.querySelector('.gx5'),img=o.querySelector('.lg5'),sn=o.querySelector('.sn5');
 const load=(src,cors)=>new Promise(r=>{const i=new Image(),to=setTimeout(()=>r(null),3500);if(cors)i.crossOrigin='anonymous';i.onload=()=>{clearTimeout(to);r(i)};i.onerror=()=>{clearTimeout(to);r(null)};i.src=src});
 (async()=>{let src=null,cors=false;
  for(const u of LOGOS){if(await load(u,true)){src=u;cors=true;break}if(await load(u,false)){src=u;break}}
  if(!src||!o.isConnected)return;
  if(cors)img.crossOrigin='anonymous';img.src=src;
  if(cors){const m='url("'+src+'")';sn.style.webkitMaskImage=m;sn.style.maskImage=m}else sn.remove();
  setTimeout(()=>{if(o.isConnected)gx.classList.add('lgon')},Math.max(0,2000-(performance.now()-t0)))})();
 const tk=setInterval(()=>{const p=Math.min(1,Math.max(0,(performance.now()-t0-300)/3500)),v=Math.round((1-Math.pow(1-p,2.2))*100),b=$('#gpb'),c=$('#gpc');if(b)b.style.width=v+'%';if(c)c.textContent=v+'%'},40);
 const out=()=>{clearInterval(tk);o.classList.add('x');setTimeout(()=>o.remove(),950)};o.onclick=out;setTimeout(out,4300)}
intro5();

/* ---------- EFEK TEMA EVENT ---------- */
const SC=['ramadan','natalbaru','imlek','musimpanas'];
const norm=e=>({natal:'natalbaru',tahunbaru:'natalbaru'})[e]||e;
const evKey=()=>S.theme==='event'?norm(S.event_preset||'ramadan'):null;
const fx4=fxInit;
fxInit=()=>{const K=evKey();if(!SC.includes(K))return fx4();
 cancelAnimationFrame(raf);
 const c=$('#fx'),x=c.getContext('2d'),W=c.width=innerWidth,H=c.height=innerHeight;
 const k=matchMedia('(prefers-reduced-motion:reduce)').matches?0:({LOW:0,MEDIUM:1,MAX:2})[Q];if(!k)return;
 const cs=getComputedStyle(document.documentElement),A=cs.getPropertyValue('--a').trim()||'#ffd76a',B=cs.getPropertyValue('--a2').trim()||'#ffffff',mob=W<600,u=mob?.8:1;
 const star=(px,py,r)=>{x.beginPath();x.moveTo(px,py-r);x.quadraticCurveTo(px,py,px+r,py);x.quadraticCurveTo(px,py,px,py+r);x.quadraticCurveTo(px,py,px-r,py);x.quadraticCurveTo(px,py,px,py-r);x.fill()};

 /* kembang api megah (dipakai Ramadan, Natal & Tahun Baru, Imlek) */
 const cols=({ramadan:['#3ddc97','#f2c14e','#ffffff','#7df9c4','#ffe9a8'],natalbaru:['#ff4d5e','#4ade80','#ffd76a','#ffffff','#ff6b9d','#7dd3fc'],imlek:['#ff3b3b','#ffd166','#ffffff','#ff8c42','#ffb703']})[K]||[A,B,'#ffffff'];
 const rk=[],sp=[],cap=k>1?1100:520,hasFw=K!=='musimpanas';let nl=0;
 const burst=(bx,by,col,ty)=>{const n=Math.round(({ring:60,willow:64,double:56,peony:86})[ty]*(k>1?1.25:.8)),sc=(k>1?1.15:.9)*(mob?.8:1);
  for(let i=0;i<n&&sp.length<cap;i++){const a=i/n*TP,w=ty==='willow';let s=ty==='ring'?4.4:w?rnd(1.6,4.2):rnd(1.2,5.2);if(ty==='double'&&i%2)s*=.55;
   sp.push({x:bx,y:by,vx:Math.cos(a)*s*sc,vy:Math.sin(a)*s*sc,l:1,d:w?rnd(.004,.008):rnd(.011,.02),g:w?.035:.045,c:i%7?col:pick(cols),w:w?1.3:1.8})}
  sp.push({f:1,x:bx,y:by,l:1,c:col})};
 const fire=t=>{if(!hasFw||t<nl)return;nl=t+rnd(900,1700)/k;const n=k>1&&R()<.25?3:1;
  for(let i=0;i<n;i++)rk.push({x:rnd(W*.1,W*.9),y:H+8,ty:rnd(H*.1,H*.46),s:rnd(8,11)*(mob?.9:1),vx:rnd(-.5,.5),c:pick(cols),ty2:pick(['peony','peony','ring','willow','double']),tr:[],dl:i*10})};
 const fwDraw=()=>{x.globalCompositeOperation='lighter';x.lineCap='round';
  for(let i=rk.length-1;i>=0;i--){const r=rk[i];if(r.dl>0){r.dl--;continue}
   r.tr.push(r.x,r.y);if(r.tr.length>20)r.tr.splice(0,2);r.y-=r.s;r.x+=r.vx;r.s*=.985;
   if(r.y<=r.ty||r.s<2.5){burst(r.x,r.y,r.c,r.ty2);rk.splice(i,1);continue}
   x.globalAlpha=.85;x.strokeStyle='#fff';x.lineWidth=2;x.beginPath();x.moveTo(r.tr[0],r.tr[1]);for(let j=2;j<r.tr.length;j+=2)x.lineTo(r.tr[j],r.tr[j+1]);x.lineTo(r.x,r.y);x.stroke()}
  for(let i=sp.length-1;i>=0;i--){const p=sp[i];
   if(p.f){x.globalAlpha=p.l*.55;const g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,80);g.addColorStop(0,'#fff');g.addColorStop(.3,p.c);g.addColorStop(1,'transparent');x.fillStyle=g;x.beginPath();x.arc(p.x,p.y,80,0,TP);x.fill();p.l-=.09;if(p.l<=0)sp.splice(i,1);continue}
   const px=p.x,py=p.y;p.vx*=.985;p.vy=p.vy*.985+p.g;p.x+=p.vx;p.y+=p.vy;p.l-=p.d;if(p.l<=0){sp.splice(i,1);continue}
   x.globalAlpha=p.l*(p.l<.35&&R()<.3?.3:1);x.strokeStyle=p.c;x.lineWidth=p.w;x.beginPath();x.moveTo(px,py);x.lineTo(p.x,p.y);x.stroke()}
  x.globalCompositeOperation='source-over';x.globalAlpha=1};

 const SCN={};

 /* RAMADAN: bulan sabit, bintang, ketupat bergantung, kembang api */
 SCN.ramadan=(()=>{
  const stars=Array.from({length:26},()=>({x:R()*W,y:R()*H*.8,r:rnd(1,2.4),p:R()*TP}));
  const ks=(mob?[.12,.34,.56]:[.08,.22,.36,.5,.64]).map(f=>({x:W*f,len:rnd(90,190),s:rnd(15,22)*u,p:R()*TP,a:rnd(.1,.17),sp:rnd(.0007,.0012)}));
  const kt=s=>{x.beginPath();x.moveTo(0,-s);x.lineTo(s,0);x.lineTo(0,s);x.lineTo(-s,0);x.closePath()};
  return t=>{
   const cx=W-62,cy=130,r=30*u,g=x.createRadialGradient(cx,cy,r*.5,cx,cy,r*3.4);g.addColorStop(0,A+'66');g.addColorStop(1,A+'00');x.fillStyle=g;x.fillRect(cx-r*4,cy-r*4,r*8,r*8);
   x.save();x.beginPath();x.arc(cx,cy,r,0,TP);x.clip();x.fillStyle=A;x.globalAlpha=.95;x.beginPath();x.rect(cx-r*2,cy-r*2,r*4,r*4);x.arc(cx+r*.5,cy-r*.1,r*.8,0,TP);x.fill('evenodd');x.restore();
   x.fillStyle=B;stars.forEach(p=>{p.p+=.05;x.globalAlpha=.3+.7*Math.abs(Math.sin(p.p));star(p.x,p.y,p.r*2.2)});
   ks.forEach(o=>{const s=o.s;x.save();x.translate(o.x,0);x.rotate(Math.sin(t*o.sp+o.p)*o.a);
    x.globalAlpha=.7;x.strokeStyle='#d9c27a';x.lineWidth=1.4;x.beginPath();x.moveTo(0,0);x.lineTo(0,o.len);x.stroke();
    x.translate(0,o.len+s);x.globalAlpha=.92;
    x.save();kt(s);x.clip();x.fillStyle='#22a862';x.fillRect(-s,-s,2*s,2*s);x.strokeStyle='#9af0c0';x.lineWidth=1.3;x.beginPath();
    for(let j=-2;j<=2;j++){const q=j*s/3;x.moveTo(-2*s,q+2*s);x.lineTo(2*s,q-2*s);x.moveTo(-2*s,-q-2*s);x.lineTo(2*s,-q+2*s)}x.stroke();x.restore();
    kt(s);x.strokeStyle='#e8ffe2';x.lineWidth=1.6;x.stroke();
    x.strokeStyle='#f2c14e';x.lineWidth=1.8;x.beginPath();for(const d of[-4,0,4]){x.moveTo(d*.5,s);x.lineTo(d+Math.sin(t/400+d)*2,s+16*u)}x.stroke();
    x.restore()});
   x.globalAlpha=1}})();

 /* NATAL & TAHUN BARU: salju, pohon natal, Santa terbang, kembang api */
 SCN.natalbaru=(()=>{
  const fl=Array.from({length:Math.round(60*k)},()=>{const r=rnd(.8,3);return{x:R()*W,y:R()*H,r,v:r*.28+.25,p:R()*TP}});
  const TC=['#ff4d5e','#ffd76a','#4da3ff','#ffffff'];
  const trees=[mob?44:90,W-(mob?44:90)].map((tx,i)=>{const h=(mob?118:150)*(i?1:.92),by=H-6,g=x.createLinearGradient(0,by-h,0,by);g.addColorStop(0,'#4ade80');g.addColorStop(1,'#14532d');
   const l=Array.from({length:15},()=>{const j=R()*3|0,ay=by-h+j*.24*h,f=rnd(.2,.95),hw=h*.5*(.34+.16*j);return{x:tx+rnd(-1,1)*hw*f*.85,y:ay+f*.4*h,c:pick(TC),p:R()*TP}});
   return{tx,h,by,g,l}});
  const sz=34*u,sa={on:false,next:performance.now()+2500,x:0,y:0,dir:1,v:1},tl=[];
  const drawTree=(o,t)=>{const {tx,h,by}=o;x.globalAlpha=.95;
   x.fillStyle='#5b3a1a';x.fillRect(tx-h*.05,by-h*.12,h*.1,h*.12);x.fillStyle=o.g;
   for(let j=0;j<3;j++){const ay=by-h+j*.24*h,hw=h*.5*(.34+.16*j);x.beginPath();x.moveTo(tx,ay);x.lineTo(tx+hw,ay+.4*h);x.lineTo(tx-hw,ay+.4*h);x.closePath();x.fill()}
   x.fillStyle='#e11d48';x.fillRect(tx-h*.32,by-h*.1,h*.15,h*.1);x.fillStyle='#ffd76a';x.fillRect(tx-h*.32+h*.065,by-h*.1,h*.02,h*.1);
   x.fillStyle='#2563eb';x.fillRect(tx+h*.2,by-h*.08,h*.12,h*.08);x.fillStyle='#ffd76a';x.fillRect(tx+h*.2+h*.05,by-h*.08,h*.02,h*.08);
   o.l.forEach(q=>{x.globalAlpha=.35+.65*Math.abs(Math.sin(t/380+q.p));x.fillStyle=q.c;x.beginPath();x.arc(q.x,q.y,2.6,0,TP);x.fill();x.globalAlpha*=.3;x.beginPath();x.arc(q.x,q.y,6,0,TP);x.fill()});
   x.globalAlpha=.7+.3*Math.sin(t/300);x.fillStyle='#ffd76a';star(tx,by-h-4,9*u);x.globalAlpha=1};
  return t=>{
   x.fillStyle='#fff';fl.forEach(p=>{p.y+=p.v;p.p+=.015;p.x+=Math.sin(p.p)*.5;if(p.y>H+5){p.y=-5;p.x=R()*W}x.globalAlpha=.55+p.r*.1;x.beginPath();x.arc(p.x,p.y,p.r,0,TP);x.fill()});
   trees.forEach(o=>drawTree(o,t));
   if(!sa.on){if(t>sa.next){sa.on=true;sa.dir=R()<.5?1:-1;sa.x=sa.dir>0?-260:W+260;sa.y=rnd(H*.16,H*.36);sa.v=rnd(1.4,2)*(mob?.8:1)}}
   else{sa.x+=sa.dir*sa.v;const yy=sa.y+Math.sin(t/500)*14;
    if(R()<.6)tl.push({x:sa.x-sa.dir*sz*.5,y:yy+sz*.4,l:1,vx:-sa.dir*rnd(.2,.7),vy:rnd(.1,.5)});
    x.save();x.translate(sa.x,yy);x.scale(sa.dir>0?-1:1,1);x.globalAlpha=.95;x.textBaseline='middle';x.font=sz+'px serif';
    x.fillText('🦌',-sz*2.7,0);x.fillText('🦌',-sz*1.7,3);x.fillText('🛷',0,8);x.font=(sz*.8)+'px serif';x.fillText('🎅',sz*.05,-sz*.25);x.restore();
    if((sa.dir>0&&sa.x>W+300)||(sa.dir<0&&sa.x<-300)){sa.on=false;sa.next=t+rnd(4000,9000)}}
   x.fillStyle='#ffd76a';for(let i=tl.length-1;i>=0;i--){const p=tl[i];p.l-=.012;if(p.l<=0){tl.splice(i,1);continue}p.x+=p.vx;p.y+=p.vy;x.globalAlpha=p.l;star(p.x,p.y,3.2*p.l+1)}
   x.globalAlpha=1}})();

 /* IMLEK: barongsai, angpao jatuh, petasan gantung terbakar berderetan, kembang api */
 SCN.imlek=(()=>{
  const ap=Array.from({length:Math.round(9*k)},()=>({x:R()*W,y:rnd(-H,H),v:rnd(.5,1.2),p:R()*TP,s:rnd(.8,1.15)}));
  const N=Math.max(8,Math.min(13,(H*.34/28)|0)),TH=24*u,GP=4*u,IDLE=2600,STEP=150,PAUSE=1500;
  const fcs=[.04,.96].map((f,i)=>({x:W*f,ts:performance.now()+i*900,ex:[],i}));
  const spark=(px,py)=>{for(let j=0;j<12&&sp.length<cap;j++)sp.push({x:px,y:py,vx:rnd(-3.2,3.2),vy:rnd(-3.5,1.5),l:1,d:rnd(.03,.05),g:.12,c:pick(['#ffd166','#ff8c42','#ffffff','#ff3b3b']),w:1.6})};
  const cracker=(o,t)=>{const e=t-o.ts;if(e>IDLE+N*STEP+PAUSE){o.ts=t;o.ex=[];return}
   x.save();x.translate(o.x,0);x.rotate(Math.sin(t/900+o.i)*.025);
   x.globalAlpha=.8;x.strokeStyle='#ffd166';x.lineWidth=1.4;x.beginPath();x.moveTo(0,0);x.lineTo(0,N*(TH+GP)+10);x.stroke();
   for(let i=0;i<N;i++){const be=IDLE+(N-1-i)*STEP,ty=8+i*(TH+GP),ox=(i%2?1:-1)*7*u,cy=ty+TH/2;
    if(e<be){x.globalAlpha=Math.min(1,e/400)*.95;x.fillStyle='#d90429';x.fillRect(ox-5.5*u,ty,11*u,TH);x.fillStyle='#ffd166';x.fillRect(ox-5.5*u,ty,11*u,3);x.fillRect(ox-5.5*u,ty+TH-3,11*u,3);
     if(e>=be-STEP){x.globalAlpha=.9;x.fillStyle='#ff8c42';x.beginPath();x.arc(ox,ty,4+Math.sin(t/40)*1.5,0,TP);x.fill()}}
    else if(e<be+180){const f=1-(e-be)/180,g=x.createRadialGradient(ox,cy,0,ox,cy,30*f+10);g.addColorStop(0,'#fff6c2');g.addColorStop(.4,'#ffb703');g.addColorStop(1,'rgba(255,59,59,0)');x.globalAlpha=f;x.fillStyle=g;x.beginPath();x.arc(ox,cy,30*f+10,0,TP);x.fill()}
    if(e>=be&&!o.ex[i]){o.ex[i]=1;spark(o.x+ox,cy)}}
   x.restore()};
  const lion=(cx,cy,s,t,ph)=>{
   const open=(Math.sin(t/300+ph)+1)/2,bn=-Math.abs(Math.sin(t/300+ph))*s*.35,bot=(H-cy)/s+1.5;
   x.save();x.translate(cx,cy+bn);x.rotate(Math.sin(t/600+ph)*.09);x.scale(s,s);x.globalAlpha=.95;
   x.fillStyle='#b0021f';x.beginPath();x.moveTo(-.9,.3);x.lineTo(-1.15,bot);x.lineTo(1.15,bot);x.lineTo(.9,.3);x.closePath();x.fill();
   x.strokeStyle='#ffd166';x.lineWidth=.07;for(const j of[-.55,0,.55]){x.beginPath();x.moveTo(j*.8,.4);x.lineTo(j*1.1,bot);x.stroke()}
   x.fillStyle='#ffd166';for(let i=0;i<16;i++){const a=i/16*TP;x.beginPath();x.arc(Math.cos(a)*1.05,Math.sin(a)*1.0,.24,0,TP);x.fill()}
   x.fillStyle='#e11d2a';x.beginPath();x.arc(0,0,1,0,TP);x.fill();
   x.fillStyle='#ff4d5e';x.globalAlpha=.5;x.beginPath();x.arc(-.25,-.45,.45,0,TP);x.fill();x.globalAlpha=.95;
   x.fillStyle='#ffd166';x.beginPath();x.moveTo(-.14,-.85);x.lineTo(0,-1.5);x.lineTo(.14,-.85);x.closePath();x.fill();
   x.fillStyle='#fff';x.beginPath();x.arc(0,-1.5,.2,0,TP);x.fill();
   for(const sx of[-1,1]){x.fillStyle='#fff';x.beginPath();x.arc(sx*.42,-.25,.27,0,TP);x.fill();x.fillStyle='#111';x.beginPath();x.arc(sx*.42+Math.sin(t/500)*.07,-.25,.13,0,TP);x.fill();
    x.strokeStyle='#ffd166';x.lineWidth=.08;x.beginPath();x.arc(sx*.42,-.25,.3,Math.PI*1.05,Math.PI*1.95);x.stroke()}
   x.fillStyle='#ffd166';x.beginPath();x.arc(0,.1,.13,0,TP);x.fill();
   const my=.52,mh=.1+.3*open;x.fillStyle='#4a0410';x.beginPath();x.ellipse(0,my,.56,mh,0,0,TP);x.fill();
   x.fillStyle='#fff';for(let i=-3;i<=3;i++){const tx=i*.14,ty=my-mh*.85;x.beginPath();x.moveTo(tx-.05,ty);x.lineTo(tx+.05,ty);x.lineTo(tx,ty+.12);x.closePath();x.fill()}
   x.restore()};
  return t=>{
   lion(W*.13,H-150*u,38*u,t,0);lion(W*.87,H-150*u,38*u,t,1.6);
   ap.forEach(p=>{p.y+=p.v;p.p+=.025;p.x+=Math.sin(p.p)*.6;if(p.y>H+40){p.y=-40;p.x=R()*W}
    x.save();x.translate(p.x,p.y);x.rotate(Math.sin(p.p)*.35);x.scale(p.s*u,p.s*u);x.globalAlpha=.9;
    x.fillStyle='#d90429';x.fillRect(-11,-16,22,32);x.fillStyle='#b0021f';x.beginPath();x.moveTo(-11,-16);x.lineTo(0,-3);x.lineTo(11,-16);x.closePath();x.fill();
    x.strokeStyle='#ffd166';x.lineWidth=1.2;x.strokeRect(-9.5,-14.5,19,29);x.fillStyle='#ffd166';x.beginPath();x.arc(0,5,5.5,0,TP);x.fill();
    x.fillStyle='#b0021f';x.font='bold 8px serif';x.textAlign='center';x.textBaseline='middle';x.fillText('福',0,5.4);x.restore()});
   fcs.forEach(o=>cracker(o,t));x.globalAlpha=1}})();

 /* MUSIM PANAS: matahari, burung-burung terbang */
 SCN.musimpanas=(()=>{
  const G=Array.from({length:3+k*2},(_,i)=>({x:rnd(-80,W),y:rnd(H*.14,H*.52),v:rnd(.7,1.5),s:rnd(8,13)*u,ph:R()*TP,fr:rnd(110,160),b:i%3===0?[[0,0],[-26,-14],[-26,14],[-52,-28],[-52,28]]:[[0,0]]}));
  return t=>{
   const cx=W-60,cy=118,r=26*u,g=x.createRadialGradient(cx,cy,r*.4,cx,cy,r*4);g.addColorStop(0,A+'88');g.addColorStop(1,A+'00');x.fillStyle=g;x.fillRect(cx-r*5,cy-r*5,r*10,r*10);
   x.save();x.translate(cx,cy);x.rotate(t/7000);x.strokeStyle=A;x.lineWidth=3;x.lineCap='round';x.globalAlpha=.4;for(let j=0;j<12;j++){x.rotate(TP/12);x.beginPath();x.moveTo(r*1.4,0);x.lineTo(r*2.1,0);x.stroke()}x.restore();
   x.globalAlpha=1;x.fillStyle=A;x.beginPath();x.arc(cx,cy,r,0,TP);x.fill();
   x.strokeStyle='#fff';x.lineWidth=2;x.lineCap='round';x.lineJoin='round';
   G.forEach(o=>{o.x+=o.v;if(o.x-70*u>W){o.x=-90*u;o.y=rnd(H*.14,H*.52)}
    o.b.forEach(([dx,dy],j)=>{const bx=o.x+dx*u,by=o.y+dy*u+Math.sin(t/700+o.ph+j)*6,w=o.s,ty=-Math.sin(t/o.fr+j*.6+o.ph)*w*.55;
     x.globalAlpha=.88;x.beginPath();x.moveTo(bx-w,by+ty);x.quadraticCurveTo(bx-w*.45,by-w*.5+ty*.3,bx,by);x.quadraticCurveTo(bx+w*.45,by-w*.5+ty*.3,bx+w,by+ty);x.stroke()})});
   x.globalAlpha=1}})();

 const sc=SCN[K];
 const frame=t=>{x.globalCompositeOperation='source-over';x.globalAlpha=1;x.textAlign='start';x.textBaseline='alphabetic';x.clearRect(0,0,W,H);
  sc(t);x.globalAlpha=1;if(hasFw){fire(t);fwDraw()}
  x.globalCompositeOperation='source-over';x.globalAlpha=1;raf=requestAnimationFrame(frame)};
 raf=requestAnimationFrame(frame)};

/* ---------- hiasan tepi atas: Natal & Tahun Baru, Imlek ---------- */
const EV5={natalbaru:i=>`<i style="--i:${i};--c:${['#ff4d5e','#4ade80','#ffd76a','#4da3ff'][i%4]}"></i>`,imlek:i=>`<i style="--i:${i}"></i>`};
const at5=applyTheme;
applyTheme=()=>{at5();const K=evKey();if(EV5[K]){const e=$('#evd');if(e){e.className=K==='natalbaru'?'natal':K;e.innerHTML=Array.from({length:22},(_,i)=>EV5[K](i)).join('')}}};

/* ---------- admin: pilihan varian tema event ---------- */
const EVO=[['ramadan','Ramadan'],['natalbaru','Natal & Tahun Baru'],['imlek','Imlek'],['musimpanas','Musim Panas']];
const a5=admTab;
admTab=async t=>{await a5(t);if(t==='orders')ordBulk();if(t==='store'){const s=document.querySelector('select[data-k="event_preset"]');if(s){const v=norm(S.event_preset||'ramadan');s.innerHTML=EVO.map(([k,l])=>`<option value="${k}" ${k===v?'selected':''}>${l}</option>`).join('')}}};


/* ---------- admin pesanan: filter status + hapus massal ---------- */
const ST6=[['all','Semua status'],['pending','Pending'],['waiting_review','Menunggu cek'],['success','Sukses'],['failed','Gagal'],['expired','Kedaluwarsa']];
function ordBulk(){const b=$('#ab');if(!b||b.querySelector('#bk6'))return;
 const d=document.createElement('div');d.className='card';d.id='bk6';d.style.marginBottom='12px';
 d.innerHTML=`<h3>Filter dan hapus massal</h3><div class="row"><select class="in" id="bf6" style="margin:0">${ST6.map(([k,l])=>`<option value="${k}">${l}</option>`).join('')}</select><button class="btn g bad" id="bd6" style="flex:0 0 auto">Hapus semua yang terfilter</button></div><p class="sm mut" id="bi6" style="margin-top:8px"></p>`;
 b.prepend(d);
 const sel=$('#bf6'),info=$('#bi6');
 const count=async()=>{let q=sb.from('orders').select('id',{count:'exact',head:true});if(sel.value!=='all')q=q.eq('status',sel.value);const {count:n}=await q;return n||0};
 const apply=async()=>{document.querySelectorAll('#ab table tr').forEach(tr=>{if(!tr.querySelector('[onclick*="setSt("]'))return;const s=(tr.children[5]?tr.children[5].textContent:'').trim();tr.style.display=sel.value==='all'||s.startsWith(sel.value)?'':'none'});
  const n=await count();info.textContent='Di database: '+n+' pesanan'+(sel.value==='all'?'':' berstatus '+sel.value)+'. Tabel hanya menampilkan 50 terbaru, tapi hapus massal berlaku untuk semuanya.'};
 sel.onchange=apply;apply();
 $('#bd6').onclick=async()=>{const v=sel.value,n=await count();if(!n)return toast('Tidak ada pesanan untuk dihapus');const lbl=ST6.find(x=>x[0]===v)[1];
  if(v==='all'){if(prompt('Ini menghapus SEMUA '+n+' pesanan, termasuk yang sukses (omzet jadi 0). Ketik HAPUS untuk lanjut:')!=='HAPUS')return toast('Dibatalkan')}
  else if(!confirm('Hapus permanen '+n+' pesanan berstatus "'+lbl+'"? Bukti transfer ikut dihapus.'+(v==='success'?' Omzet ikut berkurang.':'')))return;
  $('#bd6').disabled=true;let del=0;
  try{for(;;){let q=sb.from('orders').select('id,proof_url').limit(200);if(v!=='all')q=q.eq('status',v);const {data,error}=await q;if(error)throw error;if(!data||!data.length)break;
    const {data:d2,error:e2}=await sb.from('orders').delete().in('id',data.map(r=>r.id)).select('id');if(e2)throw e2;if(!d2||!d2.length)throw new Error('izin hapus belum ada, jalankan SQL 28');del+=d2.length;
    const ps=data.map(r=>r.proof_url).filter(Boolean);if(ps.length)await sb.storage.from('bukti-transfer').remove(ps).catch(()=>{})}
   toast(del+' pesanan dihapus')}catch(e){toast('Gagal: '+(e.message||e)+(del?' ('+del+' sudah terhapus)':''))}
  admTab('orders')}}

/* ---------- game setup / offline: tidak bisa dibuka dan tidak bisa checkout ---------- */
const gstop=g=>g.status!=='online'||(S.store_status==='setup'&&S.setup_game&&S.setup_game===g.name);
const blocked=g=>`<div class="wrap"><div class="card blk5"><div class="e">${g.status==='offline'?'⛔':'🛠️'}</div><div class="n">${esc(g.name)}</div><p class="mut">${g.status==='offline'?'Game ini sedang offline dan belum bisa dipesan.':'Game ini sedang disetup dan belum bisa dipesan. Coba lagi nanti ya kak.'}</p><br><a class="btn" href="#">Kembali ke beranda</a></div></div>`;
const g5=game;
game=async id=>{
 let gs=null;try{gs=(await sb.from('games').select('name,status').eq('id',id).maybeSingle()).data}catch(e){}
 if(gs&&gstop(gs)){app.innerHTML=blocked(gs);return}
 await g5(id);
 const buy=$('#buy');if(!buy||buy.disabled)return;const orig=buy.onclick;if(!orig)return;
 const nb=buy.cloneNode(true);buy.replaceWith(nb);
 nb.onclick=async()=>{if(nb.dataset.b)return;nb.dataset.b=1;
  try{const c=(await sb.from('games').select('name,status').eq('id',id).maybeSingle()).data;
   if(c&&gstop(c)){toast('Game ini sedang setup/offline, belum bisa dipesan.');app.innerHTML=blocked(c);return}
   await orig.call(nb)}
  catch(e){toast('Gagal membuat pesanan: '+(e.message||e));nb.disabled=false}
  finally{setTimeout(()=>{delete nb.dataset.b},1500)}}};

/* kartu game di beranda: game yang dipilih di "Game yang disetup" ikut terkunci */
const mark5=()=>{if(S.store_status!=='setup'||!S.setup_game)return;
 document.querySelectorAll('.gc').forEach(c=>{if(c.dataset.m5)return;const n=((c.querySelector('b')||{}).textContent||'').trim();if(n!==S.setup_game)return;
  c.dataset.m5=1;c.dataset.st='setup';c.classList.add('cl');c.setAttribute('onclick',"toast('Game ini sedang disetup, coba lagi nanti ya kak.')");
  const p=c.querySelector('.stp');if(p){p.className='stp su';p.textContent='Lagi setup'}c.parentElement.append(c)})};
let mt5;new MutationObserver(()=>{clearTimeout(mt5);mt5=setTimeout(mark5,80)}).observe($('#app'),{childList:true,subtree:true});mark5();

applyTheme();
})();
