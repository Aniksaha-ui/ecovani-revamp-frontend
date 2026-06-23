import { Link } from 'react-router-dom'

const imageBaseUrl = (import.meta.env.VITE_IMAGE_URL || '')
  .replaceAll('"', '')
  .replace(/\s+/g, '')

function resolveProductImage(image) {
  if (!image) {
    return ''
  }

  if (/^https?:\/\//i.test(image) || String(image).startsWith('/default-')) {
    return image
  }

  if (!imageBaseUrl) {
    return `/${String(image).replace(/^\/+/, '')}`
  }

  const normalizedBase = imageBaseUrl.endsWith('/')
    ? imageBaseUrl
    : `${imageBaseUrl}/`

  return `${normalizedBase}${String(image).replace(/^\/+/, '')}`
}


function CartIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.7L21 7H7.2" />
      <circle cx="10" cy="19" r="1.6" />
      <circle cx="18" cy="19" r="1.6" />
    </svg>
  )
}

function HeartIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20.2s-6.7-4.4-9-8.2C1.4 9.2 2.1 5.8 5.4 4.6c2-.7 4.2 0 5.6 1.7 1.4-1.7 3.6-2.4 5.6-1.7 3.3 1.2 4 4.6 2.4 7.4-2.3 3.8-9 8.2-9 8.2Z"
      />
    </svg>
  )
}

function buildMetaLabel(product) {
  if (product.subcategory) {
    return `${product.category} • ${product.subcategory}`
  }

  return product.category
}

function ProductCard({ product, variant = 'default', sectionLabel = '' }) {
  const productImage = resolveProductImage(product.imagePath || product.image)
  const metaLabel = buildMetaLabel(product)
  const badgeLabel = sectionLabel || 'New Arrival'
  const isTrending = variant === 'trending'
  const discountBadge =
    product.discountType === 'percentage' && Number(product.discountValue) > 0
      ? `-${Number(product.discountValue)}%`
      : ''

  if (isTrending) {
    return (
      <article className="group relative flex flex-col sm:flex-row items-center gap-5 rounded-3xl bg-white/70 backdrop-blur-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1">
        <Link to={`/products/${product.id}`} className="relative h-36 w-full sm:w-36 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 block group-hover:shadow-md transition-all">
          <div className="absolute right-2 top-2 z-10">
            {discountBadge ? (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-rose-400 to-red-500 text-[10px] font-bold text-white shadow-md shadow-red-500/20">
                {discountBadge}
              </span>
            ) : (
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-slate-400 shadow-sm transition-colors hover:text-red-500 hover:bg-white" onClick={(e) => e.preventDefault()}>
                <HeartIcon className="h-4 w-4" />
              </button>
            )}
          </div>
          {productImage ? (
            <img
              src={productImage}
              alt={product.name}
              className="h-full w-full object-contain p-3 mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full bg-slate-100" />
          )}
        </Link>

        <div className="flex flex-1 flex-col justify-between py-2 pr-2">
          <div>
            <Link to={`/products/${product.id}`} className="hover:underline hover:text-indigo-600 transition-colors">
              <h3 className="line-clamp-2 text-lg font-bold text-slate-800 leading-tight">
                {product.name}
              </h3>
            </Link>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-indigo-600">{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm font-medium text-slate-400 line-through">{product.originalPrice}</span>
              )}
            </div>
          </div>

          <button
            type="button"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all duration-300 hover:bg-indigo-600 hover:shadow-indigo-500/30 sm:w-auto"
          >
            <CartIcon className="h-4.5 w-4.5" />
            Add to Cart
          </button>
        </div>
      </article>
    )
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1">
      <Link to={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100/80 to-slate-50/50 p-4 block group-hover:shadow-md transition-all">
        <div className="absolute left-3 top-3 z-10">
          <span className="inline-flex items-center rounded-xl bg-white/90 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm border border-white">
            {badgeLabel}
          </span>
        </div>
        <div className="absolute right-3 top-3 z-10">
          <button
            type="button"
            aria-label={`Save ${product.name}`}
            onClick={(e) => e.preventDefault()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-slate-400 shadow-sm border border-white transition-all duration-300 hover:text-red-500 hover:bg-white hover:scale-105 active:scale-95"
          >
            <HeartIcon className="h-5 w-5" />
          </button>
        </div>

        {discountBadge && (
          <div className="absolute bottom-4 left-4 z-10">
            <span className="inline-flex items-center rounded-xl bg-gradient-to-r from-rose-400 to-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-500/30">
              {discountBadge}
            </span>
          </div>
        )}

        {productImage ? (
          <img
            src={productImage}
            alt={product.name}
            className="h-full w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-slate-100" />
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="truncate text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">
            {metaLabel}
          </p>
          {product.stockQuantity > 0 && (
            <span className="shrink-0 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              IN STOCK
            </span>
          )}
        </div>

        <Link to={`/products/${product.id}`} className="hover:underline hover:text-indigo-600 transition-colors mb-5">
          <h3 className="line-clamp-2 text-lg font-bold leading-snug text-slate-800">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm font-semibold text-slate-400 line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20 transition-all duration-300 hover:scale-105 hover:bg-indigo-600 hover:shadow-indigo-500/30 active:scale-95"
          >
            <CartIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
