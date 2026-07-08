import { Link } from 'react-router-dom'

function PromoSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-10">
      <div className="relative grid gap-6 overflow-hidden rounded-[1.9rem] border border-[var(--color-border)] bg-[linear-gradient(135deg,_#e8efeb,_#f4f7f5_55%,_#e3ebe6)] p-8 text-[var(--color-heading)] shadow-[0_20px_46px_rgba(24,35,30,0.06)] lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="relative space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--color-copy-soft)]">
            Seasonal promotion
          </p>
          <h2 className="max-w-2xl text-3xl font-bold md:text-4xl">
            Save up to 30% on selected essentials and customer favorites.
          </h2>
          <p className="max-w-2xl text-base leading-7 text-[var(--color-copy)]">
            Highlight promotional inventory with a cleaner, more trustworthy presentation
            that supports campaigns without overpowering the rest of the storefront.
          </p>
        </div>
        <Link
          to="/login"
          className="relative inline-flex items-center justify-center rounded-full bg-[var(--color-heading)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(24,35,30,0.14)] transition hover:bg-[var(--color-accent-strong)]"
        >
          Shop the offer
        </Link>
      </div>
    </section>
  )
}

export default PromoSection
