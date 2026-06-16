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

function ProductCard({ product }) {
  const productImage = resolveProductImage(product.imagePath || product.image)

  return (
    <article className="group relative overflow-hidden rounded-[1.9rem] border border-white/70 bg-white/88 shadow-[0_18px_44px_rgba(29,42,58,0.07)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_rgba(61,120,197,0.13)]">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[var(--color-gold)]/20 blur-2xl transition duration-300 group-hover:scale-125" />
      <div className={`h-56 bg-gradient-to-br ${product.accent} p-5`}>
        <div className="relative flex h-full items-end overflow-hidden rounded-[1.35rem] border border-white/45 bg-white/32 p-4 backdrop-blur-sm">
          {productImage ? (
            <img
              src={productImage}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-white/72 via-white/18 to-transparent" />
          <div className="relative z-10 space-y-2">
            <span className="inline-flex rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-heading)]/75">
              {product.category}
            </span>
            <h3 className="relative text-2xl font-semibold text-[var(--color-heading)]">
              {product.name}
            </h3>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between text-sm text-[var(--color-copy-soft)]">
          <span>Customer rating</span>
          <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 font-medium text-[var(--color-heading)]">
            {product.rating}/5
          </span>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold text-[var(--color-heading)]">
              {product.price}
            </p>
            <p className="text-sm text-[var(--color-copy-soft)] line-through">
              {product.originalPrice}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-[var(--color-accent)] bg-[linear-gradient(135deg,_var(--color-accent),_var(--color-berry))] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(61,120,197,0.2)] transition hover:-translate-y-0.5"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
