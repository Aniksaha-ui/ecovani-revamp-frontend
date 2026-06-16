import apiClient from '../../../shared/lib/api/apiClient'
import {
  fallbackCategories,
  fallbackHeroSlides,
  fallbackProductCollections,
  trustPoints,
} from '../constants/fallbackHomeData'

const IMAGE_BASE_URL = (import.meta.env.VITE_IMAGE_URL || '')
  .replaceAll('"', '')
  .replace(/\s+/g, '')

const HOME_ENDPOINTS = {
  categories: import.meta.env.VITE_HOME_CATEGORIES_ENDPOINT || 'users/categories',
  products: import.meta.env.VITE_HOME_PRODUCTS_ENDPOINT || 'users/products',
}

const HOME_COLLECTION_SEARCHES = [
  {
    id: 'electronics',
    search: 'Electronics',
    eyebrow: 'Electronics',
    title: 'Smart upgrades for home and work',
    description:
      'Performance-first picks built to streamline your desk, studio, and commute.',
    fallback: fallbackProductCollections[0],
  },
  {
    id: 'accessories',
    search: 'Accessories',
    eyebrow: 'Accessories',
    title: 'Finishing touches that travel well',
    description:
      'Compact, premium add-ons that make your devices easier to carry and enjoy.',
    fallback: fallbackProductCollections[1],
  },
  {
    id: 'trending',
    search: 'Trending',
    eyebrow: 'Trending Products',
    title: 'What shoppers are picking today',
    description:
      'Fresh favorites from across the catalog, updated for a fast-moving storefront.',
    fallback: fallbackProductCollections[2],
  },
]

const cardAccents = [
  'from-sky-300 via-cyan-200 to-blue-50',
  'from-teal-300 via-cyan-200 to-sky-50',
  'from-slate-200 via-sky-100 to-cyan-50',
  'from-indigo-200 via-sky-100 to-blue-50',
]

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

  if (Array.isArray(payload?.result)) {
    return payload.result
  }

  if (Array.isArray(payload?.results)) {
    return payload.results
  }

  if (Array.isArray(payload?.products)) {
    return payload.products
  }

  if (Array.isArray(payload?.categories)) {
    return payload.categories
  }

  if (Array.isArray(payload?.sliders)) {
    return payload.sliders
  }

  return []
}

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
    return ''
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numeric)
}

function buildImageUrl(path) {
  if (!path) {
    return ''
  }

  if (Array.isArray(path)) {
    return buildImageUrl(path[0])
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  if (String(path).startsWith('/default-')) {
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

function extractProductImage(item) {
  const directImage = readValue(
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
      'product_thumbnail',
      'banner',
      'icon',
    ],
    '',
  )

  if (directImage) {
    return buildImageUrl(directImage)
  }

  const nestedCandidates = [
    item?.images?.[0]?.image,
    item?.images?.[0]?.image_url,
    item?.images?.[0]?.path,
    item?.gallery?.[0]?.image,
    item?.gallery?.[0]?.image_url,
    item?.gallery?.[0]?.path,
    item?.product_images?.[0]?.image,
    item?.product_images?.[0]?.image_url,
    item?.product_images?.[0]?.path,
    item?.media?.[0]?.url,
    item?.media?.[0]?.path,
  ]

  const matchedNestedImage = nestedCandidates.find(Boolean)
  return buildImageUrl(matchedNestedImage)
}

function slugify(value, fallback) {
  const normalized = String(value || fallback || 'item')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalized || fallback || 'item'
}

function normalizeCategory(item, index) {
  const title = readValue(item, ['name', 'title', 'category_name'], `Category ${index + 1}`)
  const totalItems = Number(
    readValue(item, ['products_count', 'product_count', 'total_products', 'count'], 0),
  )

  return {
    id: readValue(item, ['id', 'slug'], slugify(title, `category-${index + 1}`)),
    title,
    description: readValue(
      item,
      ['description', 'details', 'short_description'],
      'Browse a curated selection built for the storefront home page.',
    ),
    itemCount: totalItems > 0 ? `${totalItems} items` : 'Featured collection',
  }
}

function normalizeCollection(config, products) {
  return {
    id: config.id,
    eyebrow: config.eyebrow,
    title: config.title,
    description: config.description,
    products: (products.length ? products : config.fallback.products).slice(0, 4),
  }
}

function normalizeProduct(item, index) {
  const name = readValue(item, ['name', 'title', 'product_name'], `Product ${index + 1}`)
  const basePrice = readValue(item, ['price', 'sale_price', 'discount_price'], 0)
  const oldPrice = readValue(item, ['old_price', 'regular_price', 'price'], 0)
  const imagePath = readValue(
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
      'product_thumbnail',
      'banner',
      'icon',
    ],
    '',
  )
  const image = extractProductImage(item)
  const rating = Number(readValue(item, ['rating', 'avg_rating', 'average_rating'], 4.7))

  return {
    id: readValue(item, ['id', 'product_id', 'slug'], slugify(name, `product-${index + 1}`)),
    name,
    category: readValue(
      item,
      ['category.name', 'category.title', 'category_name'],
      'General',
    ),
    price: formatPrice(basePrice) || '$0',
    originalPrice: formatPrice(oldPrice),
    rating: rating.toFixed(1),
    accent: cardAccents[index % cardAccents.length],
    imagePath,
    image,
    isTrending: Boolean(
      readValue(item, ['is_featured', 'featured', 'is_trending', 'trending'], false),
    ),
    createdAt: readValue(item, ['created_at', 'updated_at'], ''),
  }
}

function deriveSlidesFromProducts(products) {
  const featured = products.slice(0, 3)

  if (!featured.length) {
    return fallbackHeroSlides
  }

  return featured.map((product, index) => ({
    id: `slide-${product.id}`,
    badge: index === 0 ? 'Featured launch' : 'Store spotlight',
    eyebrow: product.category,
    title: `${product.name} for a cleaner, smarter shopping experience.`,
    description: `Explore ${product.category.toLowerCase()} picks with curated pricing, polished presentation, and fast checkout flow.`,
    ctaLabel: 'Shop collection',
    secondaryCtaLabel: 'Customer login',
    panelTitle: product.name,
    panelDescription: `Popular ${product.category.toLowerCase()} item selected for the homepage showcase.`,
    panelPrice: product.price,
    panelTag: index === 0 ? 'Best seller' : 'Trending',
    accent: product.accent,
    image: product.image || '/default-hero-banner.svg',
  }))
}

function buildCollections(products) {
  const electronics = products.filter((product) =>
    ['electronics', 'audio', 'home tech', 'workspace', 'charging', 'networking', 'wearables']
      .some((keyword) => product.category.toLowerCase().includes(keyword)),
  )

  const accessories = products.filter((product) =>
    ['accessories', 'travel', 'laptop case', 'phone gear', 'desk setup']
      .some((keyword) => product.category.toLowerCase().includes(keyword)),
  )

  const trending = products.filter((product) => product.isTrending)

  const pickCollection = (items, fallbackItems) =>
    (items.length ? items : fallbackItems).slice(0, 4)

  return [
    {
      id: 'electronics',
      eyebrow: 'Electronics',
      title: 'Smart upgrades for home and work',
      description:
        'Performance-first picks built to streamline your desk, studio, and commute.',
      products: pickCollection(electronics, fallbackProductCollections[0].products),
    },
    {
      id: 'accessories',
      eyebrow: 'Accessories',
      title: 'Finishing touches that travel well',
      description:
        'Compact, premium add-ons that make your devices easier to carry and enjoy.',
      products: pickCollection(accessories, fallbackProductCollections[1].products),
    },
    {
      id: 'trending',
      eyebrow: 'Trending Products',
      title: 'What shoppers are picking today',
      description:
        'Fresh favorites from across the catalog, updated for a fast-moving storefront.',
      products: pickCollection(trending, fallbackProductCollections[2].products),
    },
  ]
}

async function requestEndpoint(endpoint, config = {}) {
  if (!endpoint) {
    return []
  }

  const response = await apiClient.get(endpoint, config)
  return extractArray(response.data)
}

export async function fetchHomePageData() {
  const [categoryResult, productResult] = await Promise.allSettled([
    requestEndpoint(HOME_ENDPOINTS.categories),
    requestEndpoint(HOME_ENDPOINTS.products),
  ])

  const categoriesData = categoryResult.status === 'fulfilled' ? categoryResult.value : []
  const productsData = productResult.status === 'fulfilled' ? productResult.value : []

  const normalizedProducts = productsData.length
    ? productsData.map(normalizeProduct)
    : fallbackProductCollections.flatMap((collection) => collection.products)

  const normalizedCategories = categoriesData.length
    ? categoriesData.slice(0, 3).map(normalizeCategory)
    : fallbackCategories

  const searchedCollectionResults = await Promise.allSettled(
    HOME_COLLECTION_SEARCHES.map((collection) =>
      requestEndpoint(HOME_ENDPOINTS.products, {
        params: {
          search: collection.search,
        },
      }),
    ),
  )

  const collectionsFromSearchApi = searchedCollectionResults
    .map((result, index) => {
      if (result.status !== 'fulfilled') {
        return null
      }

      return normalizeCollection(
        HOME_COLLECTION_SEARCHES[index],
        result.value.map(normalizeProduct),
      )
    })
    .filter(Boolean)

  const normalizedSlides = deriveSlidesFromProducts(normalizedProducts)
  const normalizedCollections = collectionsFromSearchApi.length
    ? collectionsFromSearchApi
    : buildCollections(normalizedProducts)

  return {
    slides: normalizedSlides,
    categories: normalizedCategories,
    collections: normalizedCollections,
    trustPoints,
    usingFallback:
      !categoriesData.length && !productsData.length,
    sourceErrors: {
      categories: categoryResult.status === 'rejected',
      products: productResult.status === 'rejected',
      searchedCollections: searchedCollectionResults.some((result) => result.status === 'rejected'),
    },
  }
}
