import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store/globalState'
import { api } from '../lib/api'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const {
    profile,
    skills,
    projects,
    timeline,
    setProfile,
    setSkills,
    setProjects,
    setTimeline,
    setAdmin,
  } = useStore()

  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Form state
  const [formProfile, setFormProfile] = useState(profile || {})
  const [formSkills, setFormSkills] = useState(skills || [])
  const [formProjects, setFormProjects] = useState(projects || [])
  const [formTimeline, setFormTimeline] = useState(timeline || [])

  useEffect(() => {
    setFormProfile(profile || {})
    setFormSkills(skills || [])
    setFormProjects(projects || [])
    setFormTimeline(timeline || [])
  }, [profile, skills, projects, timeline])

  const saveProfile = async () => {
    setSaving(true)
    setMessage('')
    try {
      await api.adminProfile(formProfile)
      setProfile(formProfile)
      setMessage('Profile saved.')
    } catch (e) {
      setMessage('Error: ' + e.message)
    }
    setSaving(false)
  }

  const saveSkills = async () => {
    setSaving(true)
    setMessage('')
    try {
      await api.adminSkills(formSkills)
      setSkills(formSkills)
      setMessage('Skills saved.')
    } catch (e) {
      setMessage('Error: ' + e.message)
    }
    setSaving(false)
  }

  const saveTimeline = async () => {
    setSaving(true)
    setMessage('')
    try {
      await api.adminTimeline(formTimeline)
      setTimeline(formTimeline)
      setMessage('Timeline saved.')
    } catch (e) {
      setMessage('Error: ' + e.message)
    }
    setSaving(false)
  }

  const addProject = () => {
    setFormProjects((p) => [
      ...p,
      {
        id: 'new-' + Date.now(),
        title: '',
        description: '',
        tech: [],
        githubUrl: '',
        liveUrl: '',
        imageUrl: '',
      },
    ])
  }

  const updateProject = (id, field, value) => {
    setFormProjects((p) =>
      p.map((x) => (x.id === id ? { ...x, [field]: value } : x))
    )
  }

  const deleteProject = (id) => {
    setFormProjects((p) => p.filter((x) => x.id !== id))
  }

  const saveProject = async (proj) => {
    setSaving(true)
    setMessage('')
    try {
      if (proj.id.startsWith('new-')) {
        const created = await api.adminProjectCreate(proj)
        setFormProjects((p) => p.map((x) => (x.id === proj.id ? { ...created } : x)))
        setProjects(await api.getProjects())
      } else {
        await api.adminProjectUpdate(proj.id, proj)
        setProjects(await api.getProjects())
      }
      setMessage('Project saved.')
    } catch (e) {
      setMessage('Error: ' + e.message)
    }
    setSaving(false)
  }

  const deleteProjectApi = async (id) => {
    if (id.startsWith('new-')) {
      deleteProject(id)
      return
    }
    setSaving(true)
    try {
      await api.adminProjectDelete(id)
      setFormProjects((p) => p.filter((x) => x.id !== id))
      setProjects(await api.getProjects())
      setMessage('Project deleted.')
    } catch (e) {
      setMessage('Error: ' + e.message)
    }
    setSaving(false)
  }

  const addTimelineNode = () => {
    setFormTimeline((t) => [
      ...t,
      { id: 't-' + Date.now(), title: '', date: '', description: '' },
    ])
  }

  const updateTimelineNode = (id, field, value) => {
    setFormTimeline((t) =>
      t.map((x) => (x.id === id ? { ...x, [field]: value } : x))
    )
  }

  const logout = () => {
    setAdmin(false)
    navigate('/')
  }

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'timeline', label: 'Timeline' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-neon-cyan">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            Logout
          </button>
        </div>
        <div className="flex gap-2 mb-6 border-b border-glassBorder pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg font-mono text-sm ${
                activeTab === tab.id
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                  : 'bg-glass border border-transparent hover:border-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 text-neon-cyan text-sm"
          >
            {message}
          </motion.p>
        )}

        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <Input label="Name" value={formProfile.name} onChange={(v) => setFormProfile((p) => ({ ...p, name: v }))} />
            <Input label="Title" value={formProfile.title} onChange={(v) => setFormProfile((p) => ({ ...p, title: v }))} />
            <Input label="Location" value={formProfile.location} onChange={(v) => setFormProfile((p) => ({ ...p, location: v }))} />
            <TextArea label="Bio" value={formProfile.bio} onChange={(v) => setFormProfile((p) => ({ ...p, bio: v }))} />
            <Input label="Interests (comma)" value={Array.isArray(formProfile.interests) ? formProfile.interests.join(', ') : formProfile.interests} onChange={(v) => setFormProfile((p) => ({ ...p, interests: v }))} />
            <Input label="Avatar URL" value={formProfile.avatarUrl} onChange={(v) => setFormProfile((p) => ({ ...p, avatarUrl: v }))} />
            <Input label="Email" value={formProfile.email} onChange={(v) => setFormProfile((p) => ({ ...p, email: v }))} />
            <Input label="GitHub URL" value={formProfile.githubUrl} onChange={(v) => setFormProfile((p) => ({ ...p, githubUrl: v }))} />
            <Input label="LinkedIn URL" value={formProfile.linkedInUrl} onChange={(v) => setFormProfile((p) => ({ ...p, linkedInUrl: v }))} />
            <Input label="Resume URL" value={formProfile.resumeUrl} onChange={(v) => setFormProfile((p) => ({ ...p, resumeUrl: v }))} />
            <button onClick={saveProfile} disabled={saving} className="btn-primary">Save Profile</button>
          </motion.div>
        )}

        {activeTab === 'skills' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <p className="text-white/60 text-sm">Edit skills as JSON array: {"{ id, name, category, level }"}. Categories: Programming, Web Development, Game Development, Tools.</p>
            <textarea
              className="w-full h-48 rounded-lg bg-black/50 border border-glassBorder p-3 font-mono text-sm"
              value={JSON.stringify(formSkills, null, 2)}
              onChange={(e) => {
                try {
                  setFormSkills(JSON.parse(e.target.value || '[]'))
                } catch (_) {}
              }}
            />
            <button onClick={saveSkills} disabled={saving} className="btn-primary">Save Skills</button>
          </motion.div>
        )}

        {activeTab === 'projects' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <button onClick={addProject} className="btn-primary">+ Add Project</button>
            {formProjects.map((proj) => (
              <div key={proj.id} className="rounded-xl border border-glassBorder bg-glass p-4 space-y-3">
                <Input label="Title" value={proj.title} onChange={(v) => updateProject(proj.id, 'title', v)} />
                <TextArea label="Description" value={proj.description} onChange={(v) => updateProject(proj.id, 'description', v)} />
                <Input label="Tech (comma)" value={Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech} onChange={(v) => updateProject(proj.id, 'tech', v ? v.split(',').map((t) => t.trim()) : [])} />
                <Input label="Image URL" value={proj.imageUrl} onChange={(v) => updateProject(proj.id, 'imageUrl', v)} />
                <Input label="GitHub URL" value={proj.githubUrl} onChange={(v) => updateProject(proj.id, 'githubUrl', v)} />
                <Input label="Live URL" value={proj.liveUrl} onChange={(v) => updateProject(proj.id, 'liveUrl', v)} />
                <div className="flex gap-2">
                  <button onClick={() => saveProject(proj)} disabled={saving} className="btn-primary">Save</button>
                  <button onClick={() => deleteProjectApi(proj.id)} className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400">Delete</button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <button onClick={addTimelineNode} className="btn-primary">+ Add Milestone</button>
            {formTimeline.map((node) => (
              <div key={node.id} className="rounded-xl border border-glassBorder bg-glass p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input label="Title" value={node.title} onChange={(v) => updateTimelineNode(node.id, 'title', v)} />
                <Input label="Date" value={node.date} onChange={(v) => updateTimelineNode(node.id, 'date', v)} />
                <Input label="Description" value={node.description} onChange={(v) => updateTimelineNode(node.id, 'description', v)} />
              </div>
            ))}
            <button onClick={saveTimeline} disabled={saving} className="btn-primary">Save Timeline</button>
          </motion.div>
        )}
      </div>

      <style>{`
        .btn-primary {
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          background: rgba(0, 255, 249, 0.2);
          border: 1px solid rgba(0, 255, 249, 0.5);
          color: #00fff9;
          font-family: inherit;
        }
        .btn-primary:hover:not(:disabled) { background: rgba(0, 255, 249, 0.3); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  )
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-neon-cyan/80 mb-1">{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-black/50 border border-glassBorder px-3 py-2 text-white outline-none focus:border-neon-cyan/50"
      />
    </div>
  )
}

function TextArea({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-neon-cyan/80 mb-1">{label}</label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-black/50 border border-glassBorder px-3 py-2 text-white outline-none focus:border-neon-cyan/50 min-h-[80px]"
      />
    </div>
  )
}
