const tags = [
 {id:'about',label:'个人信息',en:'ABOUT ME',color:'#ffb1d0',icon:'flower',length:125,angle:-70},
 {id:'education',label:'学历背景',en:'EDUCATION',color:'#ffe495',icon:'book',length:174,angle:-29},
 {id:'projects',label:'项目与实践',en:'PROJECTS',color:'#ffccad',icon:'folder',length:194,angle:0},
 {id:'skills',label:'技能与实证',en:'SKILLS',color:'#d6c2ff',icon:'star',length:143,angle:29},
 {id:'contact',label:'联系方式',en:'SAY HELLO',color:'#b1e7ff',icon:'envelope',length:185,angle:70},
];
const pages = tags.map(tag => tag.id);
const pendants = document.getElementById('pendants');
tags.forEach((tag,i)=>{
 const item=document.createElement('div'); item.className='pendant'; item.dataset.id=tag.id;
 item.style.setProperty('--length',`${tag.length}px`); item.style.setProperty('--delay',`${-i*1.7}s`);
 item.innerHTML=`<div class="pendant-swing"><svg class="pendant-line" viewBox="0 0 100 ${tag.length}" style="height:${tag.length}px" aria-hidden="true"><path d="M50 0q-3 38 0 70T50 ${tag.length}" stroke="#faf2de" fill="none" stroke-width="1"/><g stroke="#dfc7bb" stroke-width=".8"><circle cx="50" cy="${tag.length*.28}" r="3.4" fill="#f6f0da"/><circle cx="49" cy="${tag.length*.48}" r="2.4" fill="#e6c7ce"/></g>${i%2===0?`<use href="#bow" x="30" y="${tag.length*.60}" width="40" height="26"/>`:`<use href="#star" x="40" y="${tag.length*.56}" width="20" height="20"/>`}</svg><button class="tag-button" data-open="${tag.id}" aria-label="查看${tag.label}"><svg viewBox="0 0 100 154" aria-hidden="true"><path d="M9 6q39-5 80-1l3 143q-41 5-85 0Z" fill="${tag.color}" stroke="#a47498" stroke-width="1.1"/><path d="M15 11q32-4 68-1l3 132q-33 3-73 0Z" fill="none" stroke="#bb91af" stroke-width=".6" stroke-dasharray="2 3"/><circle cx="50" cy="12" r="2.6" fill="#f8f6ef" stroke="#b28baa" stroke-width=".8"/></svg><svg class="tag-icon" aria-hidden="true"><use href="#${tag.icon}"/></svg><span class="tag-label">${tag.label}<small>${tag.en}</small></span></button></div>`;
 pendants.append(item); tag.el=item;
});

// The scene moves on its own. Pointer movement does not affect its angle.
const bell=document.getElementById('bell');
const hero=document.querySelector('.hero');
const world=document.querySelector('.bell-world');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduced.matches;
const motion=document.getElementById('motion');
function fitScene(){
 const scale=Math.min(1.16,(hero.clientHeight-6)/680,(hero.clientWidth-18)/560);
 world.style.setProperty('--bell-scale',Math.max(.15,scale));
 const main=document.querySelector('main');
 const line=document.querySelector('.clothesline').getBoundingClientRect();
 const mainTop=main.getBoundingClientRect().top;
 const start=line.top-mainTop+line.height*.67;
 const end=hero.offsetTop+hero.clientHeight/2-340*scale+60*scale;
 main.style.setProperty('--tether-top',`${start}px`);
 main.style.setProperty('--tether-height',`${Math.max(0,end-start)}px`);
}
new ResizeObserver(fitScene).observe(hero);fitScene();
function updateMotion(){
 document.body.classList.toggle('paused',paused);
 motion.setAttribute('aria-pressed',String(paused));
 motion.textContent=paused?'播放动画':'暂停动画';
}
updateMotion();
// Leave space between the five labels while their strings sway.
tags.forEach(tag=>{
 const a=tag.angle*Math.PI/180,depth=Math.cos(a),scale=.86+(depth+1)*.07;
 tag.el.style.transform=`translate(${Math.sin(a)*184}px,${depth*24}px) scale(${scale*.88},${scale})`;
 tag.el.style.zIndex=String(Math.round((depth+1)*10)+5);
});
document.querySelectorAll('.surface-motif').forEach(motif=>{
 const a=Number(motif.dataset.longitude)*Math.PI/180,depth=Math.cos(a);
 motif.setAttribute('transform',`translate(${280+Math.sin(a)*137} ${motif.dataset.y}) scale(${Math.max(.08,depth)} 1)`);
 motif.style.opacity=depth>0?String(Math.min(1,depth*4)):'0';
});
motion.addEventListener('click',()=>{paused=!paused;updateMotion();});
reduced.addEventListener('change',e=>{paused=e.matches;updateMotion();});

const dialog=document.getElementById('detail');
const content=document.getElementById('detail-content');
let current='about',opener=null;
const sectionNav = dialog.querySelectorAll('.detail-nav [data-open]');
const pagePosition = document.getElementById('page-position');

function openPage(id, trigger) {
 const index = pages.indexOf(id);
 if (index < 0) return;

 if (trigger && !dialog.open) opener = trigger;
 current = id;
 dialog.dataset.section = id;
 for (const button of sectionNav) {
  if (button.dataset.open === id) button.setAttribute('aria-current', 'page');
  else button.removeAttribute('aria-current');
 }

 const template = document.getElementById(`${id}-page`);
 content.replaceChildren(template.content.cloneNode(true));
 pagePosition.textContent = `${String(index + 1).padStart(2, '0')} / ${String(pages.length).padStart(2, '0')}`;
 if (!dialog.open) dialog.showModal();
 dialog.scrollTop = 0;
 dialog.querySelector('.close').focus({preventScroll: true});
}

document.addEventListener('click', event => {
 const trigger = event.target.closest('[data-open]');
 if (trigger) openPage(trigger.dataset.open, trigger);
});

dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.style.overflow='';document.body.classList.remove('detail-open');if(opener?.isConnected)opener.focus();});
new MutationObserver(()=>{document.body.style.overflow=dialog.open?'hidden':'';document.body.classList.toggle('detail-open',dialog.open);}).observe(dialog,{attributes:true,attributeFilter:['open']});
document.getElementById('next-page').addEventListener('click',()=>openPage(pages[(pages.indexOf(current)+1)%pages.length]));
document.getElementById('home').addEventListener('click',()=>{if(dialog.open)dialog.close();window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});});
