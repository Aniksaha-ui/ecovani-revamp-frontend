import apiClient from '../../../shared/lib/api/apiClient'

const IMAGE_BASE_URL = (import.meta.env.VITE_IMAGE_URL || '')
  .replaceAll('"', '')
  .replace(/\s+/g, '')

const PRODUCTS_ENDPOINT = import.meta.env.VITE_HOME_PRODUCTS_ENDPOINT || 'users/products'
const CATEGORY_PRODUCTS_ENDPOINT =
  import.meta.env.VITE_CATEGORY_PRODUCTS_ENDPOINT || 'users/category/products'

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

function buildDiscountLabel(discountType, discountValue) {
  const normalizedDiscountType = String(discountType || '').trim().toLowerCase()
  const numericDiscountValue = Number(discountValue)

  if (Number.isNaN(numericDiscountValue) || numericDiscountValue <= 0) {
    return ''
  }

  if (normalizedDiscountType === 'percentage') {
    return `${numericDiscountValue}% OFF`
  }

  if (normalizedDiscountType === 'flat' || normalizedDiscountType === 'amount') {
    return `${formatPrice(numericDiscountValue)} OFF`
  }

  return ''
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

function extractArray(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data
  }

  if (Array.isArray(payload?.products)) {
    return payload.products
  }

  if (Array.isArray(payload?.result)) {
    return payload.result
  }

  return []
}

function normalizeProductSummary(item, index = 0) {
  const name = readValue(item, ['name', 'title', 'product_name'], `Product ${index + 1}`)
  const basePrice = Number(readValue(item, ['price', 'sale_price', 'discount_price'], 0))
  const oldPrice = Number(readValue(item, ['old_price', 'regular_price'], 0))
  const discountType = readValue(item, ['discount_type'], '')
  const discountValue = Number(readValue(item, ['discount_value'], 0))
  const stockValue = readValue(item, ['stock_quantity', 'quantity', 'stock'], '')
  const derivedOriginalPrice = (() => {
    if (oldPrice > basePrice) {
      return oldPrice
    }

    if (discountType === 'percentage' && discountValue > 0 && basePrice > 0) {
      return basePrice / (1 - discountValue / 100)
    }

    if ((discountType === 'flat' || discountType === 'amount') && discountValue > 0 && basePrice > 0) {
      return basePrice + discountValue
    }

    return 0
  })()

  return {
    id: readValue(item, ['id', 'product_id', 'slug'], `product-${index + 1}`),
    name,
    category: readValue(item, ['category_name', 'category.name'], 'General'),
    subcategory: readValue(item, ['subcategory_name', 'subcategory.name'], ''),
    description: readValue(item, ['description', 'short_description', 'details'], ''),
    price: formatPrice(basePrice),
    rawPrice: basePrice,
    originalPrice: derivedOriginalPrice > basePrice ? formatPrice(derivedOriginalPrice) : '',
    discountType,
    discountValue,
    discountLabel: buildDiscountLabel(discountType, discountValue),
    stockQuantity: stockValue === '' ? null : Number(stockValue),
    image: buildImageUrl(
      readValue(
        item,
        [
          'primary_image',
          'image',
          'image_url',
          'thumbnail',
          'thumbnail_image',
          'photo',
          'featured_image',
          'feature_image',
          'product_image',
        ],
        '',
      ),
    ),
  }
}

function normalizeProductDetails(payload) {
  const source = payload?.data || payload
  const normalizedProduct = normalizeProductSummary(source)
  const resolvedSku = readValue(
    source,
    ['product_sku', 'sku', 'code'],
    `ECO-${String(readValue(source, ['product_id', 'id'], '0')).padStart(4, '0')}`,
  )

  return {
    ...normalizedProduct,
    id: readValue(source, ['product_id', 'id'], normalizedProduct.id),
    name: readValue(source, ['product_name', 'product_name', 'name'], normalizedProduct.name),
    description: readValue(
      source,
      ['description', 'short_description'],
      'No description available yet.',
    ),
    sku: resolvedSku,
    product_sku: resolvedSku,
  }
}

export async function fetchProductDetails(productId) {
  const response = await apiClient.get(`${PRODUCTS_ENDPOINT}/${productId}`)
  return normalizeProductDetails(response.data)
}

export async function fetchCategoryProducts(categoryId) {
  const response = await apiClient.get(`${CATEGORY_PRODUCTS_ENDPOINT}/${categoryId}`)
  const products = extractArray(response.data)

  return products.map((product, index) => normalizeProductSummary(product, index))
}
