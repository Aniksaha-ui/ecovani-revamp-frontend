import { Link } from 'react-router-dom'
import RevealOnScroll from './RevealOnScroll'

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
  const isTrending = variant === 'trending'
  const discountBadge =
    product.discountType === 'percentage' && Number(product.discountValue) > 0
      ? `-${Number(product.discountValue)}%`
      : '10% OFF'

  if (isTrending) {
    return (
      <RevealOnScroll
        as="article"
        className="group relative flex flex-col items-center gap-4 rounded-[1.4rem] border border-[#d7e6df] bg-white p-4 shadow-[0_14px_32px_rgba(27,55,45,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(27,55,45,0.09)] sm:flex-row"
        direction="zoom"
      >
        <Link to={`/products/${product.id}`} className="relative block h-36 w-full shrink-0 overflow-hidden rounded-[1rem] bg-[#eef7f3] sm:w-36">
          <div className="absolute right-2 top-2 z-10">
            <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-[#ff7e88] px-2 py-1 text-[10px] font-bold text-white shadow-sm">
              {discountBadge}
            </span>
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
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ff7e88]">
              Trend item
            </p>
            <Link to={`/products/${product.id}`} className="transition-colors hover:text-[var(--color-heading)]">
              <h3 className="line-clamp-2 text-lg font-bold leading-tight text-[var(--color-heading)]">
                {product.name}
              </h3>
            </Link>
            <div className="mt-2 flex items-center gap-2 text-sm text-[var(--color-copy-soft)]">
              <span>{metaLabel}</span>
              <span>•</span>
              <span>{product.rating || '4.8'} rating</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-[var(--color-heading)]">{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm font-medium text-[var(--color-copy-soft)] line-through">{product.originalPrice}</span>
              )}
            </div>
          </div>

          <button
            type="button"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_18px_rgba(45,106,86,0.18)] transition-all duration-300 hover:bg-[var(--color-accent-strong)] sm:w-auto"
          >
            <CartIcon className="h-4.5 w-4.5" />
            Add to cart
          </button>
        </div>
      </RevealOnScroll>
    )
  }

  return (
    <RevealOnScroll
      as="article"
      className="group flex flex-col overflow-hidden rounded-[1.25rem] border border-[#d9e7e0] bg-white shadow-[0_12px_28px_rgba(27,55,45,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(27,55,45,0.08)]"
      direction="zoom"
    >
      <Link to={`/products/${product.id}`} className="relative block aspect-[0.92] overflow-hidden bg-[#f3faf7] p-4 transition-all">
        <div className="absolute left-3 top-3 z-10">
          <span className="inline-flex items-center rounded-full bg-[#a7f292] px-2.5 py-1 text-[10px] font-bold text-[var(--color-heading)] shadow-sm">
            Sale
          </span>
        </div>
        <div className="absolute right-3 top-3 z-10">
          <button
            type="button"
            aria-label={`Save ${product.name}`}
            onClick={(e) => e.preventDefault()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--color-copy-soft)] shadow-sm transition-all duration-300 hover:scale-105 hover:text-[var(--color-heading)] active:scale-95"
          >
            <HeartIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 z-10">
          <span className="inline-flex items-center rounded-full bg-[#ff7e88] px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
            {discountBadge}
          </span>
        </div>

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

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="truncate text-[10px] font-extrabold uppercase tracking-widest text-[#ff7e88]">
            {sectionLabel || 'Products'}
          </p>
          {product.stockQuantity > 0 && (
            <span className="shrink-0 rounded-full bg-[#eef7f3] px-2 py-1 text-[10px] font-bold text-[var(--color-accent-strong)]">
              New
            </span>
          )}
        </div>

        <Link to={`/products/${product.id}`} className="mb-3 transition-colors hover:text-[var(--color-heading)]">
          <h3 className="line-clamp-2 text-[13px] font-bold leading-6 text-[var(--color-heading)]">
            {product.name}
          </h3>
        </Link>

        <div className="mb-4 flex items-center gap-2 text-[11px] text-[var(--color-copy-soft)]">
          <span>{metaLabel}</span>
          <span>•</span>
          <span>{product.rating || '4.8'} stars</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold tracking-tight text-[var(--color-heading)]">{product.price}</span>
              {product.originalPrice && (
                <span className="text-xs font-semibold text-[var(--color-copy-soft)] line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            className="flex h-9 w-24 shrink-0 items-center justify-center gap-1 rounded-full bg-[var(--color-accent)] px-3 text-xs font-bold text-white shadow-[0_10px_18px_rgba(45,106,86,0.18)] transition-all duration-300 hover:bg-[var(--color-accent-strong)] active:scale-95"
          >
            <CartIcon className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>
    </RevealOnScroll>
  )
}

export default ProductCard
