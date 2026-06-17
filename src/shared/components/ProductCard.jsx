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

function getProductMood(product) {
  if (product.description) {
    return product.description
  }

  const category = String(product.category || '').toLowerCase()
  const name = String(product.name || '').toLowerCase()

  if (category.includes('audio') || name.includes('headphone') || name.includes('speaker')) {
    return 'Made for easy listening, soft detail, and everyday comfort.'
  }

  if (category.includes('workspace') || category.includes('desk') || name.includes('lamp')) {
    return 'A calm desk essential that keeps your setup clean and inviting.'
  }

  if (category.includes('travel') || category.includes('case') || category.includes('pouch')) {
    return 'Light, practical, and easy to carry wherever the day goes.'
  }

  if (category.includes('charging') || category.includes('tech') || category.includes('network')) {
    return 'A tidy little upgrade that keeps daily routines feeling smoother.'
  }

  return 'A cozy everyday pick with a polished look and feel.'
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
  const productMood = getProductMood(product)
  const accent = product.accent || 'from-sky-300 via-cyan-200 to-blue-50'
  const metaLabel = buildMetaLabel(product)
  const badgeLabel = sectionLabel || 'New Arrival'
  const isTrending = variant === 'trending'
  const discountBadge =
    product.discountType === 'percentage' && Number(product.discountValue) > 0
      ? `-${Number(product.discountValue)}%`
      : ''

  if (isTrending) {
    return (
      <article className="group rounded-[18px] border border-[#eef2f6] bg-white p-4 shadow-[0_6px_18px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(15,23,42,0.12)]">
        <div className="flex items-stretch gap-4">
          <div className={`relative w-[46%] min-w-[145px] overflow-hidden rounded-[14px] border-4 border-white bg-gradient-to-br ${accent} p-3 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]`}>
            <div className="absolute right-3 top-3">
              {discountBadge ? (
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#ff6557] text-center text-[10px] font-bold leading-[1.05] text-white shadow-[0_8px_16px_rgba(255,101,87,0.28)]">
                  {Number(product.discountValue)}%
                  <br />
                  OFF
                </span>
              ) : (
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6] text-[#9aa4b2] shadow-[0_4px_10px_rgba(29,42,58,0.06)]">
                  <HeartIcon className="h-4.5 w-4.5" />
                </span>
              )}
            </div>
            {productImage ? (
              <img
                src={productImage}
                alt={product.name}
                className="h-[138px] w-full rounded-[10px] object-contain bg-[#fbfdff] p-2 transition duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="h-[138px] w-full rounded-[10px] bg-[#fbfdff]" />
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
            <div>
              <h3 className="truncate text-[17px] leading-[1.2] font-semibold text-[#111827]">
                {product.name}
              </h3>
              <p className="mt-1 text-[12px] text-[#8b97a7]">
                {product.category} / {product.subcategory || product.category}
              </p>
              <p className="mt-3 text-[13px] leading-5 text-[#374151]">
                {productMood}
              </p>
              <p className="mt-3 text-[17px] font-bold tracking-tight text-[#1483e8]">
                {product.price}
              </p>
            </div>

            <button
              type="button"
              className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-[#1483e8] px-4 text-[13px] font-medium text-white shadow-[0_10px_18px_rgba(20,131,232,0.24)] transition hover:-translate-y-0.5"
            >
              <CartIcon className="h-4.5 w-4.5" />
              Add to Cart
            </button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group overflow-hidden rounded-[20px] border border-[#e8ecf2] bg-[#f8f9fb] p-3 shadow-[0_8px_20px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(15,23,42,0.12)]">
      <div className={`relative overflow-hidden rounded-[16px] bg-gradient-to-br ${accent} p-3`}>
        <div className="absolute left-3 top-3 z-20">
          <span className="inline-flex h-7 items-center rounded-[4px] bg-[#3b82f6] px-3 text-[12px] font-bold text-white shadow-[0_8px_14px_rgba(59,130,246,0.22)]">
            {badgeLabel}
          </span>
        </div>
        <div className="absolute right-3 top-3 z-20">
          <button
            type="button"
            aria-label={`Save ${product.name}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#94a3b8] shadow-[0_6px_14px_rgba(15,23,42,0.08)] transition hover:text-[var(--color-accent)]"
          >
            <HeartIcon className="h-4.5 w-4.5" />
          </button>
        </div>

        {discountBadge ? (
          <div className="absolute bottom-[-2px] left-3 z-20">
            <span className="inline-flex h-7 items-center rounded-[4px] bg-[linear-gradient(135deg,#ff815c,#ff5d5d)] px-2.5 text-[12px] font-bold text-white shadow-[0_8px_14px_rgba(255,99,92,0.26)]">
              {discountBadge}
            </span>
          </div>
        ) : null}

        <div className="relative overflow-hidden rounded-[12px] bg-white/20">
          {productImage ? (
            <img
              src={productImage}
              alt={product.name}
              className="h-[272px] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="h-[272px] w-full bg-white/60" />
          )}
        </div>
      </div>

      <div className="space-y-4 px-2 pb-2 pt-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.03em] text-[#75839a]">
            {metaLabel}
          </p>
          {product.stockQuantity > 0 ? (
            <span className="inline-flex rounded-full bg-[#ecf9ef] px-3 py-1 text-[12px] font-medium text-[#14a44d]">
              In Stock
            </span>
          ) : null}
        </div>

        <div className="space-y-2">
          <h3 className="text-[18px] leading-[1.25] font-bold text-[#0f172a]">
            {product.name}
          </h3>
          <p className="text-[14px] leading-6 text-[#64748b]">
            {productMood}
          </p>
        </div>

        <div className="flex items-end gap-2">
          <p className="text-[18px] font-bold tracking-tight text-[#0f172a] sm:text-[20px]">
            {product.price}
          </p>
          {product.originalPrice ? (
            <p className="pb-[2px] text-[14px] text-[#94a3b8] line-through">
              {product.originalPrice}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          className="inline-flex h-[46px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#172033] px-4 text-[15px] font-semibold text-white transition hover:bg-[#0f1728]"
        >
          <CartIcon className="h-5 w-5" />
          Add to Cart
        </button>
      </div>
    </article>
  )
}

export default ProductCard
