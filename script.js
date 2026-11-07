const $=s=>document.querySelector(s);const toast=msg=>{const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2600)};
const nav=$('#nav');$('#menuBtn').addEventListener('click',()=>{nav.classList.toggle('open');$('#menuBtn').setAttribute('aria-expanded',String(nav.classList.contains('open')))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
// v52: iPhone/touch browsers scroll without scroll-triggered reveal observers.
// Avoid repeated layout/compositing work as large sections and gallery tiles enter view.
const isTouchScroll = window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches;
if (!isTouchScroll && 'IntersectionObserver' in window) {
  const ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');ob.unobserve(e.target)}}),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>ob.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
}
const eventDate=new Date('2027-01-02T17:20:00+09:00');function updateCountdown(){const delta=eventDate-new Date();const el=$('#countdown');if(delta<=0){el.textContent='소중한 날을 함께해 주셔서 감사합니다.';return}const days=Math.floor(delta/86400000);const hours=Math.floor(delta%86400000/3600000);el.textContent=`우리의 결혼식까지 D-${days} · ${hours}시간 남았어요`;}updateCountdown();setInterval(updateCountdown,60000);
$('#calendarBtn').addEventListener('click',()=>{const content=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wedding Invitation//KO','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:byungwoon-juhyun-20270102@wedding.local','DTSTAMP:20261012T000000Z','DTSTART:20270102T082000Z','DTEND:20270102T092000Z','SUMMARY:병운과 주현의 결혼식','LOCATION:더바실리움 8층\\, 경기도 성남시 분당구 양현로 322','DESCRIPTION:병운과 주현의 결혼식에 초대합니다.','END:VEVENT','END:VCALENDAR'].join('\r\n');const url=URL.createObjectURL(new Blob([content],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='병운-주현-결혼식.ics';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);toast('캘린더 일정 파일을 저장했어요')});
async function copy(text, successMessage='계좌번호를 복사했어요', fallbackMessage='자동 복사가 제한되어 있습니다. 계좌번호를 길게 눌러 복사해 주세요.'){
 let ok=false;
 try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);ok=true}}catch(e){}
 if(!ok){
   const area=document.createElement('textarea');area.value=text;area.setAttribute('readonly','');
   area.style.cssText='position:fixed;top:0;left:-9999px;opacity:0;';document.body.appendChild(area);area.select();
   try{ok=document.execCommand('copy')}catch(e){}
   area.remove();
 }
 toast(ok?successMessage:fallbackMessage);
}$('#copyAddress').addEventListener('click',()=>copy('경기도 성남시 분당구 양현로 322 8층 더바실리움','주소를 복사했어요','자동 복사가 제한되어 있습니다. 주소를 길게 눌러 복사해 주세요.'));
// 제공된 신랑측/신부측 계좌 정보
const weddingAccounts={
 groom:[
  {role:'신랑',name:'황병운',bank:'신한은행',number:'110-421-645241'},
  {role:'아버지',name:'황영대',bank:'농협',number:'201153-56-004261'},
  {role:'어머니',name:'임혜영',bank:'신한은행',number:'110-120-228227'}
 ],
 bride:[
  {role:'신부',name:'염주현',bank:'카카오뱅크',number:'3333-05-8662001'},
  {role:'아버지',name:'염윤종',bank:'IBK기업은행',number:'257-041892-02-014'},
  {role:'어머니',name:'안광숙',bank:'농협',number:'186-02-083651'}
 ]
};
function renderGiftAccounts(side){
 const panel=$('#giftPanel');
 panel.replaceChildren();
 weddingAccounts[side].forEach((account)=>{
  const row=document.createElement('div');row.className='account-row';
  const info=document.createElement('div');info.className='account-info';
  const role=document.createElement('span');role.className='account-role';role.textContent=account.role;
  const name=document.createElement('strong');name.className='account-name';name.textContent=account.name;
  const details=document.createElement('span');details.className='account-details';details.textContent=`${account.bank} · ${account.number}`;
  info.append(role,name,details);
  const button=document.createElement('button');button.type='button';button.className='account-copy';
  button.setAttribute('aria-label',`${account.name} ${account.bank} 계좌번호 복사`);
  button.title='계좌번호 복사';
  button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="8" y="8" width="11" height="12" rx="2"></rect><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"></path></svg><span>복사</span>';
  button.addEventListener('click',()=>copy(account.number));
  row.append(info,button);panel.appendChild(row);
 });
 document.querySelectorAll('.gift-tabs [data-side]').forEach(btn=>{
  const active=btn.dataset.side===side;
  btn.classList.toggle('active',active);btn.setAttribute('aria-selected',String(active));
 });
 panel.setAttribute('aria-labelledby','tab-'+side);
}
document.querySelectorAll('.gift-tabs [data-side]').forEach(btn=>btn.addEventListener('click',()=>renderGiftAccounts(btn.dataset.side)));
renderGiftAccounts('groom');
$('#shareBtn').addEventListener('click',async()=>{if(location.protocol==='file:')return toast('배포 후 공유 링크가 활성화됩니다');const data={title:'병운 & 주현 결혼식에 초대합니다',text:'2027년 1월 2일 오후 5시 20분 · 더바실리움',url:location.href};if(navigator.share){try{await navigator.share(data)}catch(e){if(e.name!=='AbortError')toast('공유할 수 없습니다')}}else copy(location.href)});

// v25: swipeable gallery viewer; fit whole photograph without internal zoom.
(() => {
  const viewer=document.getElementById('photoViewer');
  const full=document.getElementById('photoViewerImg');
  const close=document.getElementById('photoViewerClose');
  const prev=document.getElementById('photoViewerPrev');
  const next=document.getElementById('photoViewerNext');
  const count=document.getElementById('photoViewerCount');
  const items=[...document.querySelectorAll('#gallery .gallery-item')];
  let active=0,previousFocus=null,startX=0,startY=0,tracking=false;
  const update=()=>{
    const img=items[active]?.querySelector('img');
    if(!img)return;
    full.src=img.currentSrc||img.src;
    full.alt=img.alt;
    count.textContent=`${active+1} / ${items.length}`;
    prev.disabled=active===0;
    next.disabled=active===items.length-1;
    prev.style.opacity=active===0?'0.25':'1';
    next.style.opacity=active===items.length-1?'0.25':'1';
  };
  function openPhoto(index){
    previousFocus=document.activeElement;active=index;update();
    viewer.hidden=false;document.body.classList.add('photo-viewer-open');close.focus();
  }
  function closePhoto(){
    viewer.hidden=true;full.removeAttribute('src');
    document.body.classList.remove('photo-viewer-open');previousFocus?.focus?.();
  }
  function go(dir){const target=active+dir;if(target<0||target>=items.length)return;active=target;update();}
  items.forEach((item,index)=>{
    item.setAttribute('role','button');item.setAttribute('tabindex','0');
    item.setAttribute('aria-label',`${index+1}번째 웨딩 사진 보기`);
    item.addEventListener('click',()=>openPhoto(index));
    item.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPhoto(index);}});
  });
  prev.addEventListener('click',()=>go(-1));next.addEventListener('click',()=>go(1));
  close.addEventListener('click',closePhoto);
  viewer.addEventListener('click',e=>{if(e.target===viewer)closePhoto();});
  document.addEventListener('keydown',e=>{
    if(viewer.hidden)return;
    if(e.key==='Escape')closePhoto();
    else if(e.key==='ArrowRight'){e.preventDefault();go(1);}
    else if(e.key==='ArrowLeft'){e.preventDefault();go(-1);}
    else if(e.key==='Tab'){e.preventDefault();close.focus();}
  });
  viewer.addEventListener('touchstart',e=>{
    if(e.touches.length!==1){tracking=false;return;}
    startX=e.touches[0].clientX;startY=e.touches[0].clientY;tracking=true;
  },{passive:true});
  viewer.addEventListener('touchend',e=>{
    if(!tracking||e.changedTouches.length!==1)return;tracking=false;
    const dx=e.changedTouches[0].clientX-startX;
    const dy=e.changedTouches[0].clientY-startY;
    if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.25)go(dx<0?1:-1);
  },{passive:true});
  viewer.addEventListener('touchmove',e=>{if(e.touches.length>1)e.preventDefault();},{passive:false});
  viewer.addEventListener('gesturestart',e=>e.preventDefault(),{passive:false});
  viewer.addEventListener('gesturechange',e=>e.preventDefault(),{passive:false});
  viewer.addEventListener('wheel',e=>{if(e.ctrlKey)e.preventDefault();},{passive:false});
})();


// v38: progressive enhancement. Motion does not affect gallery, links or form functionality.
(() => {
 const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if (reduceMotion || isTouchScroll || !('IntersectionObserver' in window)) return;
 const groups = [
  ['#invitation .section-no', '#invitation .inv-photo', '#invitation .inv-copy', '#invitation .hairline', '#invitation .couple-names', '#invitation .family'],
  ['#wedding .section-no', '#wedding .date-art', '#wedding .date-intro', '#wedding .calendar-row', '#wedding .calendar-grid', '#wedding .count-wrap', '#wedding .calendar-save'],
  ['#location .section-no', '#location .location-photo', '#location .location-accent', '#location .location-info', '#location .map-guide-card', '#location .transport-buttons', '#location .parking'],
  ['#gallery .section-no', '#gallery .gallery-editorial-head', ...Array.from(document.querySelectorAll('#gallery .gallery-item'),(_,i)=>`#gallery .gallery-item:nth-child(${i+1})`)],
  ['#gift .section-no', '#gift .gift-inner h2', '#gift .gift-copy', '#gift .subtle-divider', '#gift .gift-tabs', '#gift .gift-panel', '#gift .gift-footnote'],
  ['.closing .closing-line', '.closing .closing-copy', '.closing .closing-content>span']
 ];
 const nodes=[];
 groups.forEach(group=>group.forEach((selector,i)=>{
   const el=document.querySelector(selector);
   if(!el)return;
   el.classList.add('motion-item');
   el.style.setProperty('--motion-delay', `${Math.min(i,5)*65}ms`);
   nodes.push(el);
 }));
 const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
     if(!entry.isIntersecting)return;
     entry.target.classList.add('motion-in');
     observer.unobserve(entry.target);
   });
 },{rootMargin:'0px 0px -35px 0px',threshold:.08});
 document.documentElement.classList.add('motion-ready');
 nodes.forEach(el=>observer.observe(el));
 // Display already visible content immediately if user navigated to a hash/position.
 requestAnimationFrame(()=>nodes.forEach(el=>{
   const r=el.getBoundingClientRect();
   if(r.bottom>0 && r.top<window.innerHeight*.82)el.classList.add('motion-in');
 }));
})();


