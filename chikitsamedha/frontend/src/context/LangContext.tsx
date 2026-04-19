import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { LangKey } from '../i18n'

type LangCtx = { lang: LangKey; setLang: (l:LangKey)=>void }
const C = createContext<LangCtx>({ lang: 'en', setLang: ()=>{} })
export function LangProvider({children}:{children:ReactNode}){
  const [lang, setLangState] = useState<LangKey>('en')
  useEffect(()=>{ const v = localStorage.getItem('cm_lang') as LangKey|null; if(v) setLangState(v) },[])
  useEffect(()=>{ try{ document.documentElement.lang = lang }catch{} }, [lang])
  const setLang = (l:LangKey)=>{ setLangState(l); localStorage.setItem('cm_lang', l) }
  return <C.Provider value={{lang,setLang}}>{children}</C.Provider>
}
export const useLang = ()=> useContext(C)
