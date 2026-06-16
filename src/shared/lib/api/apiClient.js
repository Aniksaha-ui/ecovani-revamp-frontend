import axios from 'axios'

const baseURL = (import.meta.env.VITE_BASE_URL || '')
  .replaceAll('"', '')
  .replace(/\s+/g, '')
const apiToken = (import.meta.env.VITE_API_TOKEN || '')
  .replaceAll('"', '')
  .trim()

const apiClient = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}),
  },
})

export default apiClient
