import { useCallback } from "react"

const storageKey = "tailwindcss-color-mode"

export function useTailwindColorMode() {

  const getStoredColorMode = useCallback(() => {
    const _colorMode: string | null = localStorage.getItem(storageKey)
    return _colorMode
  }, [])

  const storeColorMode = useCallback((colorMode: 'dark' | 'light') => {
    localStorage.setItem(storageKey, colorMode)
  }, [])

  const toggle = useCallback((colorMode: 'dark' | 'light') => {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.remove('light')

    document.documentElement.classList.add(colorMode)

    storeColorMode(colorMode)
  }, [storeColorMode])

  return {
    getStoredColorMode, storeColorMode,
    toggle,
  }
}