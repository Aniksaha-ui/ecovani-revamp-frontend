function ProductCard({ product }) {
  return (
    <article className="group relative overflow-hidden rounded-[1.9rem] border border-white/70 bg-white/88 shadow-[0_18px_44px_rgba(37,22,15,0.07)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_rgba(201,79,30,0.13)]">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[var(--color-gold)]/20 blur-2xl transition duration-300 group-hover:scale-125" />
      <div className={`h-56 bg-gradient-to-br ${product.accent} p-5`}>
        <div className="flex h-full items-end rounded-[1.35rem] border border-white/45 bg-white/32 p-4 backdrop-blur-sm">
          <div className="space-y-2">
            <span className="inline-flex rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-heading)]/75">
              {product.category}
            </span>
            <h3 className="text-2xl font-semibold text-[var(--color-heading)]">
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
            className="inline-flex items-center justify-center rounded-full border border-[var(--color-accent)] bg-[linear-gradient(135deg,_var(--color-accent),_var(--color-berry))] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(206,93,124,0.2)] transition hover:-translate-y-0.5"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
