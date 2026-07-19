import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loginRequest } from '../api/authApi'
import {
  clearStoredAuthSession,
  readStoredAuthSession,
  writeStoredAuthSession,
} from '../lib/authStorage'
import { AUTH_UNAUTHENTICATED_EVENT } from '../../../shared/lib/api/apiClient'

const AuthContext = createContext(null)

function buildErrorMessage(error) {
  const apiMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data?.errors?.email?.[0] ||
    error?.response?.data?.errors?.password?.[0]

  if (apiMessage) {
    return apiMessage
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Unable to sign in right now. Please try again.'
}

function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStoredAuthSession())

  useEffect(() => {
    function handleUnauthenticated() {
      setSession(null)
      clearStoredAuthSession()

      if (window.location.pathname !== '/login') {
        window.location.replace('/login')
      }
    }

    window.addEventListener(AUTH_UNAUTHENTICATED_EVENT, handleUnauthenticated)

    return () => {
      window.removeEventListener(AUTH_UNAUTHENTICATED_EVENT, handleUnauthenticated)
    }
  }, [])

  const value = useMemo(() => ({
    isAuthenticated: Boolean(session?.token),
    user: session?.user || null,
    token: session?.token || '',
    async login(credentials) {
      try {
        const nextSession = await loginRequest(credentials)
        setSession(nextSession)
        writeStoredAuthSession(nextSession)
        return nextSession
      } catch (error) {
        throw new Error(buildErrorMessage(error))
      }
    },
    logout() {
      setSession(null)
      clearStoredAuthSession()
    },
  }), [session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export { AuthProvider, useAuth }
