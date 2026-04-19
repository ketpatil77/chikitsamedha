import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

type ClinicalCtx = { clinical: boolean; toggle: () => void }
const C = createContext<ClinicalCtx>({ clinical: false, toggle: () => { } })

export function ClinicalProvider({ children }: { children: ReactNode }) {
    const [clinical, setClinical] = useState(() => localStorage.getItem('cm_clinical') === '1')

    useEffect(() => {
        document.documentElement.setAttribute('data-mode', clinical ? 'clinical' : 'default')
        localStorage.setItem('cm_clinical', clinical ? '1' : '0')
    }, [clinical])

    return (
        <C.Provider value={{ clinical, toggle: () => setClinical(v => !v) }}>
            {children}
        </C.Provider>
    )
}

export const useClinical = () => useContext(C)
