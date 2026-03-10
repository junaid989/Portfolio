import { useStore } from '../store/globalState'
import { AnimatePresence, motion } from 'framer-motion'
import About from '../sections/About'
import Skills from '../sections/Skills'
import Projects from '../sections/Projects'
import Timeline from '../sections/Timeline'
import Contact from '../sections/Contact'

const sectionMap = {
  about: { title: 'About', Component: About },
  skills: { title: 'Skills', Component: Skills },
  projects: { title: 'Projects', Component: Projects },
  timeline: { title: 'Learning Timeline', Component: Timeline },
  contact: { title: 'Contact', Component: Contact },
}

export default function UI() {
  const { openSection, closeSection } = useStore()
  const current = openSection ? sectionMap[openSection] : null

  return (
    <>
      <div className="fixed top-4 left-4 z-10 font-mono text-neon-cyan text-sm tracking-wider opacity-80">
        DEV_LAB // PORTFOLIO
      </div>
      <div className="fixed top-4 right-4 z-10 text-xs text-white/50 font-mono">
        Ctrl+Shift+T — terminal
      </div>

      <AnimatePresence mode="wait">
        {current ? (
          <motion.div
            key={openSection}
            className="fixed inset-0 z-20 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeSection}
              aria-hidden
            />
            <motion.div
              className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl border border-glassBorder bg-glass backdrop-blur-md shadow-2xl panel-scroll overflow-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-glassBorder bg-black/30 backdrop-blur">
                <h2 className="text-lg font-semibold text-neon-cyan tracking-wider">
                  {current.title}
                </h2>
                <button
                  onClick={closeSection}
                  className="w-8 h-8 rounded-lg border border-glassBorder bg-glass hover:bg-white/10 text-white flex items-center justify-center font-mono"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <current.Component />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
