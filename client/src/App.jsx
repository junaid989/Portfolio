import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useStore } from './store/globalState'
import { api } from './lib/api'
import Experience from './components/Experience'
import AdminDashboard from './admin/AdminDashboard'

function App() {
  const { setProfile, setSkills, setProjects, setTimeline, isAdmin } = useStore()

  useEffect(() => {
    Promise.all([
      api.getProfile(),
      api.getSkills(),
      api.getProjects(),
      api.getTimeline(),
    ])
      .then(([profile, skills, projects, timeline]) => {
        setProfile(profile)
        setSkills(skills)
        setProjects(projects)
        setTimeline(timeline)
      })
      .catch(console.error)
  }, [setProfile, setSkills, setProjects, setTimeline])

  return (
    <Routes>
      <Route path="/" element={<Experience />} />
      <Route
        path="/Admin"
        element={
          isAdmin ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
