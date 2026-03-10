import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/globalState'
import { api } from '../lib/api'

const ADMIN_ACCESS = 'ADmin_access='

const COMMANDS = {
  help: {
    desc: 'list commands',
    run: () => [
      'help         — list commands',
      'clear        — clear terminal',
      'whoami       — display developer info',
      'psd chnge admin — change admin code',
      'exit         — close terminal',
    ],
  },
  clear: {
    desc: 'clear terminal',
    run: () => [],
  },
  whoami: {
    desc: 'display developer info',
    run: async (_, { profile }) => {
      if (!profile) return ['(profile not loaded)']
      return [
        `user: ${profile.name || 'developer'}`,
        `title: ${profile.title || '—'}`,
        `location: ${profile.location || '—'}`,
      ]
    },
  },
  'psd chnge admin': {
    desc: 'change admin code',
    run: async (args, { isAdmin, setAdminCode }) => {
      if (!isAdmin) return ['access denied']
      const code = args.trim()
      if (!code) return ['usage: psd chnge admin <new_code>']
      try {
        await api.adminChangeCode(code)
        setAdminCode(code)
        return ['admin code updated']
      } catch (e) {
        return ['error: ' + e.message]
      }
    },
  },
  exit: {
    desc: 'close terminal',
    run: (_, { setTerminalOpen }) => {
      setTerminalOpen(false)
      return []
    },
  },
}

function parseInput(input) {
  const trimmed = input.trim()
  if (trimmed.startsWith(ADMIN_ACCESS)) {
    const code = trimmed.slice(ADMIN_ACCESS.length).trim()
    return { type: 'auth', code }
  }
  const lower = trimmed.toLowerCase()
  if (lower === 'help') return { type: 'cmd', cmd: 'help', args: '' }
  if (lower === 'clear') return { type: 'cmd', cmd: 'clear', args: '' }
  if (lower === 'whoami') return { type: 'cmd', cmd: 'whoami', args: '' }
  if (lower === 'exit') return { type: 'cmd', cmd: 'exit', args: '' }
  if (lower.startsWith('psd chnge admin')) {
    return { type: 'cmd', cmd: 'psd chnge admin', args: trimmed.slice('psd chnge admin'.length) }
  }
  return { type: 'cmd', cmd: null, args: trimmed }
}

export default function Terminal() {
  const [lines, setLines] = useState([
    { type: 'system', text: 'DEV_LAB terminal v1.0' },
    { type: 'system', text: 'Type "help" for commands.' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const inputRef = useRef(null)
  const bottomRef = useRef(null)
  const navigate = useNavigate()
  const {
    setTerminalOpen,
    setAdmin,
    setAdminToken,
    profile,
    isAdmin,
    setAdminCode,
  } = useStore()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const runCommand = async (cmd, args) => {
    const def = COMMANDS[cmd]
    if (!def) {
      setLines((l) => [...l, { type: 'error', text: `unknown command: ${cmd || 'empty'}` }])
      return
    }
    const ctx = {
      profile,
      isAdmin,
      setAdminCode,
      setAdminToken,
      setTerminalOpen,
    }
    const result = typeof def.run === 'function' ? await def.run(args, ctx) : []
    if (cmd === 'clear') {
      setLines([])
      return
    }
    if (cmd === 'exit') return
    setLines((l) => [
      ...l,
      ...result.map((t) => ({ type: 'out', text: t })),
    ])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const raw = input.trim()
    setInput('')
    if (!raw) return
    setLines((l) => [...l, { type: 'in', text: `> ${raw}` }])
    setTyping(true)
    await new Promise((r) => setTimeout(r, 100))
    const parsed = parseInput(raw)
    if (parsed.type === 'auth') {
      try {
        const { token } = await api.adminLogin(parsed.code)
        setAdmin(true)
        if (token) setAdminToken(token)
        setAdminCode(parsed.code)
        setLines((l) => [
          ...l,
          { type: 'system', text: 'Admin access granted. Redirecting...' },
        ])
        setTimeout(() => {
          setTerminalOpen(false)
          navigate('/Admin')
        }, 800)
      } catch (err) {
        setLines((l) => [...l, { type: 'error', text: 'access denied' }])
      }
      setTyping(false)
      return
    }
    await runCommand(parsed.cmd, parsed.args)
    setTyping(false)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-2xl h-[420px] rounded-lg border-2 border-neon-green/50 bg-black shadow-2xl shadow-neon-green/20 flex flex-col overflow-hidden"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b border-neon-green/30 bg-[#0a0e17]">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 font-mono text-neon-green text-sm">terminal</span>
        </div>
        <div className="flex-1 font-mono text-sm text-neon-green overflow-y-auto p-4 space-y-1 panel-scroll">
          <AnimatePresence initial={false}>
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={
                  line.type === 'error'
                    ? 'text-red-400'
                    : line.type === 'system'
                    ? 'text-neon-cyan/90'
                    : line.type === 'in'
                    ? 'text-neon-green'
                    : 'text-white/90'
                }
              >
                {line.text}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-2 border-t border-neon-green/30 bg-[#0a0e17]">
          <span className="text-neon-green">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-neon-green outline-none font-mono terminal-cursor"
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      </motion.div>
    </motion.div>
  )
}
