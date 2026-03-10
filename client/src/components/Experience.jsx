import { Suspense, useEffect, useCallback } from 'react'
import { useStore } from '../store/globalState'
import Scene from './Scene'
import UI from './UI'
import Terminal from './Terminal'
import MobileFallback from './MobileFallback'

const ADMIN_KEY = 'ADmin_access='

function useTerminalShortcut() {
  const { setTerminalOpen } = useStore()
  const handler = useCallback(
    (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        e.preventDefault()
        setTerminalOpen(true)
      }
    },
    [setTerminalOpen]
  )
  useEffect(() => {
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handler])
}

function useMobileDetection() {
  const { setMobileMode } = useStore()
  useEffect(() => {
    const check = () => setMobileMode(window.innerWidth < 768 || 'ontouchstart' in window)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [setMobileMode])
}

export default function Experience() {
  useTerminalShortcut()
  useMobileDetection()
  const { mobileMode, terminalOpen } = useStore()

  if (mobileMode) {
    return (
      <>
        <MobileFallback />
        {terminalOpen && <Terminal />}
      </>
    )
  }

  return (
    <>
      <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center bg-[#0a0e17] text-neon-cyan">Loading lab...</div>}>
        <Scene />
      </Suspense>
      <UI />
      {terminalOpen && <Terminal />}
    </>
  )
}

export { ADMIN_KEY }
