import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/', label: 'Electronics' },
  { to: '/', label: 'Accessories' },
  { to: '/', label: 'Trending' },
]

function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/50 bg-white/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,_var(--color-heading),_var(--color-accent))] text-sm font-semibold text-white shadow-[0_12px_30px_rgba(201,79,30,0.3)]">
            E
          </span>
          <div>
            <p className="text-lg font-semibold text-[var(--color-heading)]">
              Ecovani
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-copy-soft)]">
              Ecommerce
            </p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 rounded-full border border-white/70 bg-white/70 px-2 py-1 shadow-[0_12px_30px_rgba(37,22,15,0.06)]">
          {navItems.map((item, index) => (
            <NavLink
              key={`${item.label}-${index}`}
              to={item.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-[var(--color-copy-soft)] transition hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-heading)]"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden rounded-full border border-[var(--color-heading)] bg-[var(--color-heading)] px-4 py-2 text-sm font-medium text-white shadow-[0_10px_24px_rgba(37,22,15,0.12)] md:inline-flex"
          >
            Cart (2)
          </button>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,_var(--color-accent),_var(--color-berry))] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(206,93,124,0.28)] transition hover:-translate-y-0.5"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
