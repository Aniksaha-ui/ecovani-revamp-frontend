import { Link } from 'react-router-dom'

function PromoSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-10">
      <div className="relative grid gap-6 overflow-hidden rounded-[2.2rem] border border-[#d4e1ef] bg-[linear-gradient(135deg,_#2a3e57,_#44698c_55%,_#68a9ad_140%)] p-8 text-white shadow-[0_28px_90px_rgba(37,74,116,0.2)] lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="absolute -left-8 top-10 h-32 w-32 rounded-full bg-white/8 blur-3xl" />
        <div className="absolute right-12 top-0 h-40 w-40 rounded-full bg-[var(--color-gold)]/18 blur-3xl" />
        <div className="relative space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-100">
            Limited offer
          </p>
          <h2 className="max-w-2xl text-3xl font-semibold md:text-4xl">
            Save up to 30% on creator essentials and everyday carry favorites.
          </h2>
          <p className="max-w-2xl text-base leading-7 text-slate-100/85">
            Build a strong storefront moment with promotional inventory, featured
            categories, and reusable sections that can be swapped into future
            campaigns.
          </p>
        </div>
        <Link
          to="/login"
          className="relative inline-flex items-center justify-center rounded-full bg-white/18 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] ring-1 ring-white/20 backdrop-blur transition hover:-translate-y-0.5"
        >
          Sign in to shop
        </Link>
      </div>
    </section>
  )
}

export default PromoSection
