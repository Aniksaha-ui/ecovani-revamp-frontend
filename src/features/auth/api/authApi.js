import apiClient from '../../../shared/lib/api/apiClient'

const LOGIN_ENDPOINT = import.meta.env.VITE_LOGIN_ENDPOINT || 'login'

function readValue(source, keys, fallback = '') {
  for (const key of keys) {
    const value = key.split('.').reduce((acc, part) => acc?.[part], source)

    if (value !== undefined && value !== null && value !== '') {
      return value
    }
  }

  return fallback
}

function normalizeUser(payload, email) {
  const source = payload?.data?.user || payload?.user || payload?.data?.data?.user || payload?.data?.data || payload?.data || payload
  const fallbackName = email ? email.split('@')[0].replace(/[^a-z0-9]+/gi, ' ').trim() : 'Customer'

  return {
    id: readValue(source, ['id', 'user_id'], ''),
    name: readValue(source, ['name', 'full_name', 'username'], fallbackName || 'Customer'),
    email: readValue(source, ['email'], email),
  }
}

function normalizeLoginResponse(payload, email) {
  const token = readValue(
    payload,
    [
      'token',
      'access_token',
      'data.token',
      'data.access_token',
      'data.data.token',
      'data.data.access_token',
      'authorisation.token',
      'authorization.token',
    ],
    '',
  )

  if (!token) {
    throw new Error('Login succeeded but no access token was returned.')
  }

  return {
    token,
    user: normalizeUser(payload, email),
  }
}

async function loginRequest({ email, password, remember }) {
  const response = await apiClient.post(
    LOGIN_ENDPOINT,
    {
      email,
      password,
      remember,
    },
    {
      skipAuth: true,
    },
  )

  return normalizeLoginResponse(response.data, email)
}

export { loginRequest }
