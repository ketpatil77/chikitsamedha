import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type Toast = { id: number; kind: 'success'|'warning'|'error'|'info'; text: string }
type Ctx = { toasts: Toast[]; push: (t: Omit<Toast,'id'>)=>void; remove: (id:number)=>void }
const C = createContext<Ctx>({ toasts: [], push: ()=>{}, remove: ()=>{} })

export function ToastProvider({children}:{children:ReactNode}){
  const [toasts, setToasts] = useState<Toast[]>([])
  const push: Ctx['push'] = (t)=>{
    const id = Date.now()+Math.random()
    setToasts(a=>[...a, {id, ...t}])
    setTimeout(()=> remove(id), 3000)
  }
  const remove = (id:number)=> setToasts(a=> a.filter(x=> x.id!==id))
  return <C.Provider value={{toasts, push, remove}}>{children}</C.Provider>
}
export const useToast = ()=> useContext(C)
