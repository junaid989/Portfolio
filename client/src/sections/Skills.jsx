import { useStore } from '../store/globalState'
import { motion } from 'framer-motion'

const CATEGORIES = ['Programming', 'Web Development', 'Game Development', 'Tools']

export default function Skills() {
  const { skills } = useStore()
  const byCategory = {}
  ;(skills || []).forEach((s) => {
    const c = s.category || 'Programming'
    if (!byCategory[c]) byCategory[c] = []
    byCategory[c].push(s)
  })
  const order = [...CATEGORIES]
  Object.keys(byCategory).forEach((cat) => {
    if (!order.includes(cat)) order.push(cat)
  })

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      {order.map((cat) => {
        const list = byCategory[cat] || []
        if (list.length === 0) return null
        return (
          <div key={cat}>
            <h4 className="text-neon-cyan/90 text-sm font-mono mb-3">{cat}</h4>
            <div className="flex flex-wrap gap-2">
              {list.map((skill, i) => (
                <motion.div
                  key={skill.id || i}
                  className="px-4 py-2 rounded-lg bg-glass border border-glassBorder hover:border-neon-cyan/50 hover:shadow-lg hover:shadow-neon-cyan/10 transition-all cursor-default"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <span className="text-sm text-white/90">{skill.name}</span>
                  {skill.level && (
                    <span className="ml-2 text-xs text-white/50">({skill.level})</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )
      })}
    </motion.div>
  )
}
