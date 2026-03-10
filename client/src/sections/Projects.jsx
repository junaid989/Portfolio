import { useStore } from '../store/globalState'
import { motion } from 'framer-motion'

export default function Projects() {
  const { projects } = useStore()
  const list = projects || []

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      {list.length === 0 ? (
        <p className="text-white/60 text-sm">No projects yet.</p>
      ) : (
        list.map((proj, i) => (
          <motion.div
            key={proj.id || i}
            className="rounded-xl border border-glassBorder bg-glass p-4 hover:border-neon-cyan/40 transition-colors"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            whileHover={{ x: 4 }}
          >
            {proj.imageUrl && (
              <img
                src={proj.imageUrl}
                alt=""
                className="w-full h-32 object-cover rounded-lg mb-3 border border-white/10"
              />
            )}
            <h4 className="text-neon-cyan font-semibold mb-1">{proj.title}</h4>
            <p className="text-sm text-white/70 mb-2">{proj.description}</p>
            {proj.tech && (
              <p className="text-xs text-white/50 mb-3">
                {Array.isArray(proj.tech) ? proj.tech.join(' · ') : proj.tech}
              </p>
            )}
            <div className="flex gap-2">
              {proj.githubUrl && (
                <a
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/10 border border-glassBorder text-xs hover:bg-neon-cyan/20 hover:border-neon-cyan/50"
                >
                  GitHub
                </a>
              )}
              {proj.liveUrl && (
                <a
                  href={proj.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan text-xs hover:bg-neon-cyan/30"
                >
                  Live Demo
                </a>
              )}
            </div>
          </motion.div>
        ))
      )}
    </motion.div>
  )
}
