const AUTH_STORAGE_KEY = 'ecovani-auth-session'

function readStoredAuthSession() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) || 'null')
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

function writeStoredAuthSession(session) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

function clearStoredAuthSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

function getStoredAuthToken() {
  return readStoredAuthSession()?.token || ''
}

export {
  AUTH_STORAGE_KEY,
  readStoredAuthSession,
  writeStoredAuthSession,
  clearStoredAuthSession,
  getStoredAuthToken,
}
