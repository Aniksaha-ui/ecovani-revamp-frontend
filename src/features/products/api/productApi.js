import apiClient from '../../../shared/lib/api/apiClient'

const IMAGE_BASE_URL = (import.meta.env.VITE_IMAGE_URL || '')
  .replaceAll('"', '')
  .replace(/\s+/g, '')

const PRODUCTS_ENDPOINT = import.meta.env.VITE_HOME_PRODUCTS_ENDPOINT || 'users/products'

function readValue(source, keys, fallback = '') {
  for (const key of keys) {
    const value = key.split('.').reduce((acc, part) => acc?.[part], source)

    if (value !== undefined && value !== null && value !== '') {
      return value
    }
  }

  return fallback
}

function formatPrice(value) {
  const numeric = Number(value)

  if (Number.isNaN(numeric) || numeric <= 0) {
    return 'BDT 0'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numeric)
}

function buildImageUrl(path) {
  if (!path) {
    return ''
  }

  if (/^https?:\/\//i.test(path) || String(path).startsWith('/default-')) {
    return path
  }

  if (!IMAGE_BASE_URL) {
    return `/${String(path).replace(/^\/+/, '')}`
  }

  const normalizedBase = IMAGE_BASE_URL.endsWith('/')
    ? IMAGE_BASE_URL
    : `${IMAGE_BASE_URL}/`

  return `${normalizedBase}${String(path).replace(/^\/+/, '')}`
}

function normalizeProductDetails(payload) {
  const source = payload?.data || payload
  const numericPrice = Number(readValue(source, ['price'], 0))
  const discountType = readValue(source, ['discount_type'], '')
  const discountValue = Number(readValue(source, ['discount_value'], 0))
  const originalPrice =
    discountType === 'percentage' && discountValue > 0 && numericPrice > 0
      ? numericPrice / (1 - discountValue / 100)
      : discountType === 'amount' && discountValue > 0 && numericPrice > 0
        ? numericPrice + discountValue
        : 0

  return {
    id: readValue(source, ['product_id', 'id'], ''),
    name: readValue(source, ['product_name', 'productsroduct_name', 'name'], 'Product'),
    category: readValue(source, ['category_name', 'category.name'], 'General'),
    subcategory: readValue(source, ['subcategory_name', 'subcategory.name'], ''),
    description: readValue(source, ['description', 'short_description'], 'No description available yet.'),
    price: formatPrice(numericPrice),
    rawPrice: numericPrice,
    originalPrice: originalPrice > numericPrice ? formatPrice(originalPrice) : '',
    discountType,
    discountValue,
    stockQuantity: Number(readValue(source, ['stock_quantity', 'quantity', 'stock'], 0)),
    image: buildImageUrl(readValue(source, ['primary_image', 'image', 'thumbnail_image'], '')),
    sku: `ECO-${String(readValue(source, ['product_id', 'id'], '0')).padStart(4, '0')}`,
  }
}

export async function fetchProductDetails(productId) {
  const response = await apiClient.get(`${PRODUCTS_ENDPOINT}/${productId}`)
  return normalizeProductDetails(response.data)
}
