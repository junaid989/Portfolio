import { useStore } from '../store/globalState'
import { motion } from 'framer-motion'

export default function Timeline() {
  const { timeline } = useStore()
  const list = timeline || []

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      {list.length === 0 ? (
        <p className="text-white/60 text-sm">No milestones yet.</p>
      ) : (
        <div className="space-y-0">
          {list.map((node, i) => (
            <motion.div
              key={node.id || i}
              className="flex gap-4 py-3 group"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-neon-cyan group-hover:shadow-[0_0_12px_#00fff9] transition-shadow border-2 border-neon-cyan/80" />
                {i < list.length - 1 && (
                  <div className="w-0.5 flex-1 min-h-[24px] bg-gradient-to-b from-neon-cyan/60 to-transparent mt-1" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <h4 className="text-neon-cyan/90 font-semibold text-sm">{node.title}</h4>
                {node.date && (
                  <p className="text-xs text-white/50 mt-0.5">{node.date}</p>
                )}
                {node.description && (
                  <p className="text-sm text-white/70 mt-1">{node.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
