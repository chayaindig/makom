import React,{lazy,Suspense,useEffect,useState} from 'react';
const DappledLight=lazy(()=>import('./DappledLight'));
export default function HeroLight(){
 const [enabled,setEnabled]=useState(false);
 const [paused,setPaused]=useState(false);
 useEffect(()=>{
  const media=matchMedia('(min-width: 751px) and (prefers-reduced-motion: no-preference)');
  const sync=()=>setEnabled(document.readyState==='complete'&&media.matches);
  window.addEventListener('load',sync);media.addEventListener('change',sync);sync();
  return()=>{window.removeEventListener('load',sync);media.removeEventListener('change',sync)};
 },[]);
 return <><div className="hero-light-layer" aria-hidden="true">{enabled&&<Suspense fallback={null}><DappledLight lightColor={"#000005"} shadowColor={"#424b71"} backgroundColor={"#bbcfff"} paused={paused}/></Suspense>}</div>{enabled&&<button className="light-toggle" aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?'הפעלת תנועת האור':'עצירת תנועת האור'}</button>}</>;
}
