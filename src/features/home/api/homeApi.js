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
    image: buildImageUrl(
      readValue(item, ['image', 'image_url', 'icon', 'banner', 'thumbnail_image'], ''),
    ),
  }
}

function titleCaseWords(value) {
  return String(value)
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatSectionLabel(sectionName) {
  const normalized = String(sectionName || 'featured_products')
    .replace(/[_-]+/g, ' ')
    .trim()

  if (!normalized) {
    return 'Featured Products'
  }

  if (normalized.toLowerCase() === 'trand product') {
    return 'Trending Products'
  }

  return titleCaseWords(normalized)
}

function buildSectionDescription(sectionLabel, products) {
  const categories = [...new Set(products.map((product) => product.subcategory || product.category))]
    .filter(Boolean)
    .slice(0, 2)

  if (categories.length === 2) {
    return `Browse ${categories[0].toLowerCase()} and ${categories[1].toLowerCase()} picks from the ${sectionLabel.toLowerCase()} collection.`
  }

  if (categories.length === 1) {
    return `Browse curated ${categories[0].toLowerCase()} picks from the ${sectionLabel.toLowerCase()} collection.`
  }

  return `Browse curated picks from the ${sectionLabel.toLowerCase()} collection.`
}

function buildCollectionsFromSections(products) {
  const sectionMap = new Map()

  products.forEach((product) => {
    const sectionName = product.sectionName || 'featured_products'

    if (!sectionMap.has(sectionName)) {
      sectionMap.set(sectionName, [])
    }

    sectionMap.get(sectionName).push(product)
  })

  return [...sectionMap.entries()].map(([sectionName, items]) => {
    const sectionLabel = formatSectionLabel(sectionName)

    return {
      id: slugify(sectionName, `section-${sectionMap.size}`),
      eyebrow: sectionLabel,
      title: sectionLabel,
      description: buildSectionDescription(sectionLabel, items),
      products: items.slice(0, 8),
    }
  })
}

function normalizeProduct(item, index) {
  const name = readValue(item, ['name', 'title', 'product_name'], `Product ${index + 1}`)
  const basePrice = readValue(item, ['price', 'sale_price', 'discount_price'], 0)
  const oldPrice = readValue(item, ['old_price', 'regular_price'], 0)
  const discountType = readValue(item, ['discount_type'], '')
  const discountValue = Number(readValue(item, ['discount_value'], 0))
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
  const stockQuantity = Number(readValue(item, ['stock_quantity', 'quantity', 'stock'], 0))
  const normalizedPrice = Number(basePrice)
  const derivedOriginalPrice = (() => {
    const explicitOriginal = Number(oldPrice)

    if (explicitOriginal > normalizedPrice) {
      return explicitOriginal
    }

    if (discountType === 'percentage' && discountValue > 0 && normalizedPrice > 0) {
      return normalizedPrice / (1 - discountValue / 100)
    }

    if (discountType === 'amount' && discountValue > 0 && normalizedPrice > 0) {
      return normalizedPrice + discountValue
    }

    return 0
  })()

  return {
    id: readValue(item, ['id', 'product_id', 'slug'], slugify(name, `product-${index + 1}`)),
    name,
    category: readValue(
      item,
      ['category.name', 'category.title', 'category_name'],
      'General',
    ),
    subcategory: readValue(
      item,
      ['subcategory.name', 'subcategory.title', 'subcategory_name'],
      '',
    ),
    description: readValue(
      item,
      ['description', 'short_description', 'details'],
      '',
    ),
    sectionName: readValue(item, ['section_name', 'section', 'section_title'], ''),
    price: formatPrice(basePrice) || '$0',
    originalPrice: formatPrice(derivedOriginalPrice),
    discountType,
    discountValue,
    discountLabel: buildDiscountLabel(discountType, discountValue),
    stockQuantity,
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
  const sectionCollections = buildCollectionsFromSections(
    products.filter((product) => product.sectionName),
  )

  if (sectionCollections.length) {
    return sectionCollections
  }

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

function cycleItems(items, count, start = 0) {
  if (!items.length) {
    return []
  }

  return Array.from({ length: count }, (_, index) => items[(start + index) % items.length])
}

function buildHeroPanel(products) {
  const heroProduct = products[0] || fallbackProductCollections[0].products[0]
  const spotlightCards = cycleItems(products, 2, 1).map((product, index) => ({
    id: `spotlight-${product.id}-${index}`,
    eyebrow: index === 0 ? 'Daily Pick' : 'Click. Shop. Smile.',
    title: index === 0 ? 'Your Daily Store' : 'Soft Care Essentials',
    description: product.name,
    ctaLabel: 'Shop Now',
    image: product.image || '/default-hero-banner.svg',
    background: index === 0 ? '#fcebd7' : '#e7f8ef',
  }))

  return {
    eyebrow: 'New Exclusive Offer',
    title: 'Beauty That Elevates Your Everyday',
    description:
      'Discover premium makeup, skincare essentials, and wellness-first daily care designed for modern routines.',
    primaryCta: 'Shop Now',
    secondaryCta: 'View Details',
    image: heroProduct.image || '/default-hero-banner.svg',
    spotlightCards,
  }
}

function buildCategoryRail(products, categories) {
  const fallbackImages = cycleItems(products, 6, 0)

  if (categories.length) {
    return categories.slice(0, 6).map((category, index) => ({
      id: category.id,
      title: category.title,
      image: category.image || fallbackImages[index]?.image || '/default-hero-banner.svg',
    }))
  }

  return fallbackImages.map((product, index) => ({
    id: `category-rail-${product.id}-${index}`,
    title: product.category || 'Beauty Care',
    image: product.image || '/default-hero-banner.svg',
  }))
}

function buildHomepageSections(products, categories) {
  const fallbackProducts = fallbackProductCollections.flatMap((collection) => collection.products)
  const sourceProducts = products.length ? products : fallbackProducts

  return {
    hero: buildHeroPanel(sourceProducts),
    categoryRail: buildCategoryRail(sourceProducts, categories),
    flashDeal: {
      title: 'Flash Fashion Deal',
      tabs: ["Men's Fashion", "Women's Fashion", 'Kids Clothing', 'Accessories', 'Jewelry & Watches'],
      products: cycleItems(sourceProducts, 5, 0),
    },
    mostLoved: {
      title: 'Most Loved Products',
      products: cycleItems(sourceProducts, 5, 2),
    },
    featurePromos: cycleItems(sourceProducts, 4, 3),
    newLaunch: {
      title: 'Newly Lunch Products',
      products: cycleItems(sourceProducts, 5, 4),
    },
    allProducts: {
      title: 'Our Products',
      tabs: ['All Products', 'Moisturizers', 'Sunscreen', 'Foundations', 'Lipsticks & Lip Gloss'],
      products: cycleItems(sourceProducts, 10, 1),
    },
    limitedDeal: {
      title: 'Limited Time Deals',
      featured: cycleItems(sourceProducts, 1, 5)[0],
      topRate: cycleItems(sourceProducts, 3, 0),
      topItems: cycleItems(sourceProducts, 3, 4),
    },
    categoryFavorites: cycleItems(sourceProducts, 4, 3),
    beautyCare: {
      title: 'Beauty Care Products',
      products: cycleItems(sourceProducts, 5, 5),
    },
    latestBlog: cycleItems(sourceProducts, 4, 2),
    brands: ['MERCK', 'NORTON', 'Abbott', 'Davita', 'MERCK', 'Abbott', 'Davita', 'NORTON'],
    featureItems: [
      'Cruelty Free',
      'Premium Quality',
      'Secure Payment',
      'Gift Ready',
      '24/7 Support',
      'Fast Delivery',
    ],
  }
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
    ? categoriesData.slice(0, 6).map(normalizeCategory)
    : fallbackCategories

  const normalizedSlides = deriveSlidesFromProducts(normalizedProducts)
  const normalizedCollections = buildCollections(normalizedProducts)
  const homepage = buildHomepageSections(normalizedProducts, normalizedCategories)

  return {
    slides: normalizedSlides,
    categories: normalizedCategories,
    collections: normalizedCollections,
    homepage,
    trustPoints,
    usingFallback:
      !categoriesData.length && !productsData.length,
    sourceErrors: {
      categories: categoryResult.status === 'rejected',
      products: productResult.status === 'rejected',
    },
  }
}
