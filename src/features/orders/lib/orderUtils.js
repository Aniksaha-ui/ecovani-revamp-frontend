export const ORDER_LIST_ENDPOINT = import.meta.env.VITE_ORDER_LIST_ENDPOINT || 'users/orders'
export const ORDER_DETAILS_ENDPOINT = import.meta.env.VITE_ORDER_DETAILS_ENDPOINT || 'users/orders'
export const ADD_CART_ENDPOINT = import.meta.env.VITE_ADD_CART_ENDPOINT || 'users/add/cart'
export const IMAGE_BASE_URL = (import.meta.env.VITE_IMAGE_URL || '')
  .replaceAll('"', '')
  .replace(/\s+/g, '')

export function extractData(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data
  }

  if (payload?.data && typeof payload.data === 'object') {
    return payload.data
  }

  return []
}

export function buildImageUrl(path) {
  if (!path) {
    return ''
  }

  if (/^https?:\/\//i.test(path) || String(path).startsWith('/default-')) {
    return path
  }

  if (!IMAGE_BASE_URL) {
    return `/${String(path).replace(/^\/+/, '')}`
  }

  const normalizedBase = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL : `${IMAGE_BASE_URL}/`
  return `${normalizedBase}${String(path).replace(/^\/+/, '')}`
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value || 0))
}

export function formatDateTime(value) {
  if (!value) {
    return 'Not available'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function formatStatusLabel(value) {
  const label = String(value || '')
    .replaceAll('_', ' ')
    .trim()

  if (!label) {
    return 'Pending'
  }

  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function getOrderStatusTone(status) {
  switch (status) {
    case 'delivered':
      return 'bg-[#e6f9ef] text-[#047857]'
    case 'processing':
      return 'bg-[#fff2d9] text-[#c27a00]'
    case 'shipped':
      return 'bg-[#e7f2ff] text-[#1d4ed8]'
    case 'cancelled':
      return 'bg-[#ffe7e8] text-[#e11d48]'
    default:
      return 'bg-[#eef2f7] text-[#516072]'
  }
}
