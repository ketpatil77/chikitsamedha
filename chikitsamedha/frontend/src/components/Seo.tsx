import { useEffect } from 'react'
import { t } from '../i18n'
import { useLang } from '../context/LangContext'

type Props = { titleKey: any; descKey?: any }

export default function Seo({ titleKey, descKey }: Props){
  const { lang } = useLang()
  useEffect(()=>{
    const title = typeof titleKey === 'string' ? t(titleKey as any, lang) : String(titleKey)
    const desc = descKey? (typeof descKey === 'string' ? t(descKey as any, lang) : String(descKey)) : ''
    document.title = title
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
    if(!meta){
      meta = document.createElement('meta')
      meta.setAttribute('name','description')
      document.head.appendChild(meta)
    }
    if(meta) meta.setAttribute('content', desc)
  },[lang, titleKey, descKey])
  return null
}

