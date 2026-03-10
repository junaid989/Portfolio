import { useStore } from '../store/globalState'
import { motion, AnimatePresence } from 'framer-motion'
import About from '../sections/About'
import Skills from '../sections/Skills'
import Projects from '../sections/Projects'
import Timeline from '../sections/Timeline'
import Contact from '../sections/Contact'

const sections = [
  { id: 'about', label: 'About', Component: About },
  { id: 'skills', label: 'Skills', Component: Skills },
  { id: 'projects', label: 'Projects', Component: Projects },
  { id: 'timeline', label: 'Timeline', Component: Timeline },
  { id: 'contact', label: 'Contact', Component: Contact },
]

export default function MobileFallback() {
  const { openSection, setOpenSection, closeSection } = useStore()
  const current = sections.find((s) => s.id === openSection)

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white p-4 pb-24">
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-neon-cyan tracking-wider">DEV_LAB</h1>
        <p className="text-white/60 text-sm mt-1">Portfolio — mobile view</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {sections.map((s) => (
          <motion.button
            key={s.id}
            onClick={() => setOpenSection(s.id)}
            className="rounded-xl border border-glassBorder bg-glass p-4 text-left hover:border-neon-cyan/50 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-neon-cyan font-mono text-sm">{s.label}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-20 bg-black/80 backdrop-blur-sm p-4 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSection}
          >
            <motion.div
              className="max-w-lg mx-auto mt-8 rounded-2xl border border-glassBorder bg-glass p-6"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              exit={{ y: 20 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-neon-cyan font-mono">{current.label}</h2>
                <button
                  onClick={closeSection}
                  className="w-8 h-8 rounded-lg border border-glassBorder flex items-center justify-center"
                >
                  ×
                </button>
              </div>
              <current.Component />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
