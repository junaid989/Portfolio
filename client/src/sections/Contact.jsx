import { useStore } from '../store/globalState'
import { motion } from 'framer-motion'

export default function Contact() {
  const { profile } = useStore()
  const p = profile || {}
  const links = [
    { label: 'Email', href: p.email ? `mailto:${p.email}` : null, value: p.email },
    { label: 'GitHub', href: p.githubUrl || null, value: p.githubUrl },
    { label: 'LinkedIn', href: p.linkedInUrl || null, value: p.linkedInUrl },
  ].filter((l) => l.href || l.value)

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className="grid gap-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href || '#'}
            target={link.href?.startsWith('http') ? '_blank' : undefined}
            rel={link.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="flex items-center justify-between p-3 rounded-lg bg-glass border border-glassBorder hover:border-neon-cyan/50 transition-colors"
          >
            <span className="text-white/80">{link.label}</span>
            <span className="text-neon-cyan text-sm truncate max-w-[60%]">
              {link.value}
            </span>
          </a>
        ))}
      </div>
      {p.resumeUrl && (
        <a
          href={p.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/30 transition-colors"
        >
          Download Resume
        </a>
      )}
    </motion.div>
  )
}
