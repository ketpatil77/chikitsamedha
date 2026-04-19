import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

type MotionCtx = { reduced: boolean; toggle: () => void }

const C = createContext<MotionCtx>({ reduced: false, toggle: () => {} })

export function MotionProvider({ children }: { children: ReactNode }){
  const [reduced, setReduced] = useState(()=> localStorage.getItem('cm_motion') === '1')
  useEffect(()=>{
    document.body.classList.toggle('reduced-motion', reduced)
    localStorage.setItem('cm_motion', reduced ? '1' : '0')
  }, [reduced])
  return (
    <C.Provider value={{ reduced, toggle: () => setReduced(v=>!v) }}>
      {children}
    </C.Provider>
  )
}

export const useMotion = ()=> useContext(C)
