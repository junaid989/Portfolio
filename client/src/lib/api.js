import { useStore } from '../store/globalState'

const API_BASE = '/api'

function getAuthHeader() {
  const token = useStore.getState().adminToken
  return token ? { Authorization: 'Bearer ' + token } : {}
}

async function request(path, options = {}) {
  const isAdmin = path.startsWith('/admin')
  const headers = {
    'Content-Type': 'application/json',
    ...(isAdmin ? getAuthHeader() : {}),
    ...options.headers,
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText))
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export const api = {
  getProfile: () => request('/profile'),
  getSkills: () => request('/skills'),
  getProjects: () => request('/projects'),
  getTimeline: () => request('/timeline'),
  adminLogin: (code) => request('/admin/login', { method: 'POST', body: JSON.stringify({ code }) }),
  adminProfile: (data) => request('/admin/profile', { method: 'PUT', body: JSON.stringify(data) }),
  adminSkills: (data) => request('/admin/skills', { method: 'PUT', body: JSON.stringify(data) }),
  adminProjects: () => request('/admin/projects'),
  adminProjectCreate: (data) => request('/admin/projects', { method: 'POST', body: JSON.stringify(data) }),
  adminProjectUpdate: (id, data) => request(`/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  adminProjectDelete: (id) => request(`/admin/projects/${id}`, { method: 'DELETE' }),
  adminTimeline: (data) => request('/admin/timeline', { method: 'PUT', body: JSON.stringify(data) }),
  adminChangeCode: (code) => request('/admin/code', { method: 'POST', body: JSON.stringify({ code }) }),
}

export default api
