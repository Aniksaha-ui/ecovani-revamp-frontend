import axios from 'axios'
import { getStoredAuthToken } from '../../../features/auth/lib/authStorage'

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
  },
})

apiClient.interceptors.request.use((config) => {
  if (config.skipAuth) {
    if (config.headers?.Authorization) {
      delete config.headers.Authorization
    }

    return config
  }

  const authToken = getStoredAuthToken() || apiToken

  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization
  }

  return config
})

export default apiClient
