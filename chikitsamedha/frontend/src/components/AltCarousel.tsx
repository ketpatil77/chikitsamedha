import { motion } from 'framer-motion'

type Alt = { replace: string; with: string; reason?: string }
export default function AltCarousel({items, onApply}:{items:Alt[]; onApply:(alt:Alt)=>void}){
  if(!items?.length) return null
  return (
    <motion.div className="flex gap-3 overflow-x-auto pb-2"
      initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.25}}>
      {items.map((a,idx)=>(
        <div key={idx} className="min-w-[240px] card p-3">
          <div className="text-sm">Replace <b>{a.replace}</b> → <b>{a.with}</b></div>
          <div className="text-xs opacity-70">{a.reason}</div>
          <button className="btn btn-primary mt-2" onClick={()=>onApply(a)}>Apply</button>
        </div>
      ))}
    </motion.div>
  )
}
