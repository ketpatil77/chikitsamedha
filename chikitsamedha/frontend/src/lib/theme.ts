export const colors = {
  dark: {
    surface: '#0E1614',
    card: '#14201E',
    text: '#E8F3EF',
    accent: '#0EA47A',
  },
  light: {
    surface: '#FFFFFF',
    card: '#F7FAFA',
    text: '#0C0F14',
    accent: '#0EA47A',
  },
}

export const API_BASE = (import.meta as any).env?.VITE_API_BASE ?? 'http://127.0.0.1:8000';

export const themeDark = { bg: '#0C0F14', text: '#F6F8FB', card: 'rgba(255,255,255,0.06)', gradient: 'linear-gradient(120deg,#0EA47A 0%, #19B394 40%, #6BE9C2 100%)' }
