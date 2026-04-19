import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

type Theme = 'light' | 'dark'
type ThemeCtx = { theme: Theme; toggle: () => void }
const C = createContext<ThemeCtx>({ theme: 'dark', toggle: () => { } })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('cm_theme') as Theme | null
    return saved || 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.setAttribute('data-theme', theme)
    localStorage.setItem('cm_theme', theme)
  }, [theme])

  return (
    <C.Provider value={{ theme, toggle: () => setTheme(t => t === 'dark' ? 'light' : 'dark') }}>
      {children}
    </C.Provider>
  )
}

export const useTheme = () => useContext(C)
