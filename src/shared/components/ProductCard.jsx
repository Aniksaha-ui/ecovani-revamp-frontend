import { useState } from 'react'
import { Link } from 'react-router-dom'
import RevealOnScroll from './RevealOnScroll'
import { useCart } from '../../features/cart/context/CartContext'

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

function StarRating() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3].map((star) => (
        <svg key={star} className="h-4 w-4 fill-[#ffb400] text-[#ffb400]" viewBox="0 0 20 20">
          <path d="m10 1.7 2.3 4.7 5.2.8-3.8 3.7.9 5.1-4.6-2.4-4.6 2.4.9-5.1-3.8-3.7 5.2-.8L10 1.7Z" />
        </svg>
      ))}
      <svg className="h-4 w-4 fill-[#c7ced8] text-[#c7ced8]" viewBox="0 0 20 20">
        <path d="m10 1.7 2.3 4.7 5.2.8-3.8 3.7.9 5.1-4.6-2.4-4.6 2.4.9-5.1-3.8-3.7 5.2-.8L10 1.7Z" />
      </svg>
    </div>
  )
}

function ProductCard({ product, variant = 'default' }) {
  const { addItem, getItemQuantity } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const productImage = resolveProductImage(product.imagePath || product.image)
  const isTrending = variant === 'trending'
  const discountBadge = product.discountLabel || ''
  const quantityInCart = getItemQuantity(product.id)

  async function handleAddToCart() {
    if (isAdding) {
      return
    }

    try {
      setIsAdding(true)
      await addItem(product)
    } finally {
      setIsAdding(false)
    }
  }

  if (isTrending) {
    return (
      <RevealOnScroll
        as="article"
        className="group relative flex flex-col items-center gap-4 rounded-[1.4rem] border border-[#d7e6df] bg-white p-4 shadow-[0_14px_32px_rgba(27,55,45,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(27,55,45,0.09)] sm:flex-row"
        direction="zoom"
      >
        <Link to={`/products/${product.id}`} className="relative block h-36 w-full shrink-0 overflow-hidden rounded-[1rem] bg-[#eef7f3] sm:w-36">
          {discountBadge ? (
            <div className="absolute right-2 top-2 z-10">
              <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-[#ff7e88] px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                {discountBadge}
              </span>
            </div>
          ) : null}
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
            onClick={handleAddToCart}
            disabled={isAdding}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_18px_rgba(45,106,86,0.18)] transition-all duration-300 hover:bg-[var(--color-accent-strong)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <CartIcon className="h-4.5 w-4.5" />
            {isAdding ? 'Adding...' : quantityInCart ? `Add More (${quantityInCart})` : 'Add to Cart'}
          </button>
        </div>
      </RevealOnScroll>
    )
  }

  if (variant === 'compact' || variant === 'default') {
    return (
      <RevealOnScroll
        as="article"
        className="group flex flex-col overflow-hidden rounded-[18px] border border-[#d8e2ef] bg-white p-[14px] shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(17,24,39,0.07)]"
        direction="zoom"
      >
        <Link to={`/products/${product.id}`} className="relative block overflow-hidden rounded-[14px] bg-[#fdeef6] px-[18px] py-[16px]">
          {discountBadge ? (
            <div className="absolute left-0 top-[10px] z-10 bg-[#d90429] px-[10px] py-[4px] text-[10px] font-extrabold uppercase leading-none tracking-[0.02em] text-white">
              {discountBadge}
            </div>
          ) : null}

          {productImage ? (
            <img
              src={productImage}
              alt={product.name}
              className="h-[228px] w-full object-contain transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="h-[228px] w-full bg-slate-100" />
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col pt-[16px]">
          <Link to={`/products/${product.id}`} className="transition-colors hover:text-[var(--color-heading)]">
            <h3 className="line-clamp-2 min-h-[60px] text-[16px] font-bold leading-[1.5] tracking-[-0.02em] text-[#2b3340]">
              {product.name}
            </h3>
          </Link>

          <div className="mt-[6px] flex items-center gap-[6px] text-[14px] text-[#627089]">
            <StarRating />
            <span>({product.reviewCount || 189})</span>
          </div>

          <div className="mt-[14px] flex flex-wrap items-baseline gap-x-[10px] gap-y-1">
            <span className="text-[18px] font-extrabold tracking-[-0.02em] text-[#1d2433]">{product.price}</span>
            {product.originalPrice && (
              <span className="text-[14px] font-medium text-[#a2aec0] line-through">
                {product.originalPrice}
              </span>
            )}
            {discountBadge ? (
              <span className="text-[14px] font-medium uppercase tracking-[0.01em] text-[#f0123f]">
                {discountBadge}
              </span>
            ) : null}
          </div>

          <div className="mt-auto flex items-center gap-3 pt-[14px]">
            <button
              type="button"
              aria-label={`Save ${product.name}`}
              onClick={(e) => e.preventDefault()}
              className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#d8dee9] bg-white text-[#5d6b82] transition hover:border-[#0f8b86] hover:text-[#0f8b86]"
            >
              <HeartIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex h-[40px] flex-1 items-center justify-center gap-2 rounded-full bg-[#138d87] px-4 text-[14px] font-bold text-white transition hover:bg-[#0b7672] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CartIcon className="h-4 w-4" />
              {isAdding ? 'Adding...' : quantityInCart ? `Add More (${quantityInCart})` : 'Add to Cart'}
            </button>
          </div>
        </div>
      </RevealOnScroll>
    )
  }
}

export default ProductCard
