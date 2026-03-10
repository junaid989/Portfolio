import { useStore } from '../store/globalState'
import { motion } from 'framer-motion'

export default function About() {
  const { profile } = useStore()
  const p = profile || {}
  const interests = Array.isArray(p.interests) ? p.interests : (p.interests || '').split(',').filter(Boolean)

  return (
    <motion.div
      className="space-y-6 text-white/90"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {p.avatarUrl && (
          <img
            src={p.avatarUrl}
            alt="Avatar"
            className="w-24 h-24 rounded-xl object-cover border border-neon-cyan/30 shadow-lg"
          />
        )}
        <div className="flex-1">
          <h3 className="text-neon-cyan font-semibold text-xl mb-2">{p.name || 'Developer'}</h3>
          <p className="text-sm text-white/60">{p.title || 'Full‑stack developer'}</p>
          {p.location && (
            <p className="text-sm text-white/50 mt-1 flex items-center gap-1">
              <span className="text-neon-cyan">📍</span> {p.location}
            </p>
          )}
        </div>
      </div>
      {p.bio && (
        <p className="text-sm leading-relaxed border-l-2 border-neon-cyan/50 pl-4">
          {p.bio}
        </p>
      )}
      {interests.length > 0 && (
        <div>
          <h4 className="text-neon-cyan/90 text-sm font-mono mb-2">Interests</h4>
          <div className="flex flex-wrap gap-2">
            {interests.map((item, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-white/10 border border-glassBorder text-xs"
              >
                {item.trim()}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
