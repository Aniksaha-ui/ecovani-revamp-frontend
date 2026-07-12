import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../features/auth/context/AuthContext'
import { useCart } from '../../features/cart/context/CartContext'

const navItems = [
  'Home',
  'About Us',
  'Shop',
  'Sellers',
  'Mega Menu',
  'Blog',
  'Pages',
  'Contact',
]

function ChevronIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 7.5 5 5 5-5" />
    </svg>
  )
}

function SiteHeader() {
  const { isAuthenticated, user, logout } = useAuth()
  const { itemCount } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="w-full border-y border-[#d9dfeb] bg-white">
      <div className="h-[6px] bg-[#0f8b86]" />

      {/* Main Top Bar */}
      <div className="border-b border-[#d9dfeb]">
        <div className="mx-auto flex w-[92%] lg:w-[85%] xl:w-[80%] max-w-[1720px] items-center justify-between gap-4 py-4 lg:py-5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-[#0f8b86]">
            <div className="flex h-[42px] w-[42px] lg:h-[58px] lg:w-[58px] items-center justify-center rounded-full bg-[#0f8b86] text-[24px] lg:text-[34px] font-black text-white shrink-0">
              S
            </div>
            <span className="text-[32px] sm:text-[38px] lg:text-[58px] xl:text-[62px] font-black tracking-[-0.05em] text-[#0f8b86] leading-none">
              Ecovani
            </span>
          </Link>

          {/* Search Bar (Desktop only) */}
          <div className="hidden lg:flex flex-1 items-center justify-center max-w-[805px] mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for the Items"
                className="h-[58px] w-full rounded-full border border-[#d5dbe7] bg-white pl-8 pr-16 text-[16px] font-medium text-[#6f7d97] outline-none transition focus:border-[#0f8b86]"
              />
              <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center text-[#8d9ab1]">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7" />
                  <path strokeLinecap="round" d="m20 20-3.5-3.5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Actions (Desktop only) */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <div className="flex items-center gap-3">
              <Link
                to={isAuthenticated ? '/orders' : '/login'}
                className="group flex items-center gap-4 rounded-full border border-[#d9dfeb] bg-[#f7f8fb] px-3 py-2 shadow-[0_10px_22px_rgba(17,24,39,0.05)] transition hover:-translate-y-0.5 hover:border-[#0f8b86]"
              >
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#ffc107] text-[#111827]">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <circle cx="12" cy="8" r="3.2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 18a5.5 5.5 0 0 1 11 0" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <div className="leading-tight">
                    <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-[#5b6475]">
                      {isAuthenticated ? 'My orders' : 'Account'}
                    </p>
                    <p className="text-[22px] font-black tracking-[-0.04em] text-[#111827]">
                      {isAuthenticated ? user?.name || 'Orders' : 'Log in'}
                    </p>
                  </div>
                  <ChevronIcon className="mt-3 h-5 w-5 text-[#111827] transition group-hover:text-[#0f8b86]" />
                </div>
              </Link>

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex h-[52px] items-center justify-center rounded-full bg-[#111827] px-5 text-[14px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#0f8b86] cursor-pointer"
                >
                  Log out
                </button>
              ) : null}
            </div>

            <Link
              to="/cart"
              className="group flex items-center gap-4 rounded-full border border-[#d9dfeb] bg-[#f7f8fb] px-3 py-2 shadow-[0_10px_22px_rgba(17,24,39,0.05)] transition hover:-translate-y-0.5 hover:border-[#0f8b86]"
            >
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#ffc107] text-[#111827]">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l1.5 8.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.7L20 7H7.1" />
                  <circle cx="10" cy="19" r="1.6" />
                  <circle cx="17.5" cy="19" r="1.6" />
                </svg>
              </div>
              <div className="leading-tight">
                <p className="text-[15px] font-medium text-[#5b6475]">Cart</p>
                <p className="text-[32px] font-semibold tracking-[-0.04em] text-[#111827]">{itemCount}- Items</p>
              </div>
            </Link>
          </div>

          {/* Mobile Actions (Tablet/Mobile only) */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Cart Icon with badge */}
            <Link
              to="/cart"
              className="relative flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#f7f8fb] border border-[#d9dfeb] hover:border-[#0f8b86] transition"
              aria-label="View cart"
            >
              <svg className="h-5 w-5 text-[#111827]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l1.5 8.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.7L20 7H7.1" />
                <circle cx="10" cy="19" r="1.6" />
                <circle cx="17.5" cy="19" r="1.6" />
              </svg>
              {itemCount > 0 ? (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#ffc107] text-[11px] font-extrabold text-[#111827] shadow-[0_2px_6px_rgba(255,193,7,0.3)]">
                  {itemCount}
                </span>
              ) : null}
            </Link>

            {/* Account Icon */}
            <Link
              to={isAuthenticated ? '/orders' : '/login'}
              className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#f7f8fb] border border-[#d9dfeb] hover:border-[#0f8b86] transition"
              aria-label="Account"
            >
              <svg className="h-5 w-5 text-[#111827]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <circle cx="12" cy="8" r="3.2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 18a5.5 5.5 0 0 1 11 0" />
              </svg>
            </Link>

            {/* Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#f7f8fb] border border-[#d9dfeb] hover:bg-[#eef2f7] hover:border-[#0f8b86] transition cursor-pointer"
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5 text-[#111827]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (Below top bar) */}
      <div className="block lg:hidden border-b border-[#d9dfeb] bg-[#f8fafc] px-4 py-3">
        <div className="relative w-full max-w-[600px] mx-auto">
          <input
            type="text"
            placeholder="Search for the Items"
            className="h-[46px] w-full rounded-full border border-[#d5dbe7] bg-white pl-6 pr-12 text-[14px] font-medium text-[#6f7d97] outline-none transition focus:border-[#0f8b86]"
          />
          <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-[#8d9ab1]">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="m20 20-3.5-3.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Desktop Sub-navigation (Categories, Links, Support) */}
      <div className="hidden lg:block">
        <div className="mx-auto flex w-[92%] lg:w-[85%] xl:w-[80%] max-w-[1720px] items-center justify-between gap-6 px-4 py-[14px]">
          <button className="inline-flex h-[48px] min-w-[264px] items-center justify-center gap-3 rounded-[8px] bg-[#0f8b86] px-6 text-[16px] font-bold text-white shadow-[0_8px_20px_rgba(15,139,134,0.2)] transition hover:bg-[#0b7672] cursor-pointer">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="4" width="6" height="6" rx="1.2" />
              <rect x="14" y="4" width="6" height="6" rx="1.2" />
              <rect x="4" y="14" width="6" height="6" rx="1.2" />
              <rect x="14" y="14" width="6" height="6" rx="1.2" />
            </svg>
            Explore All Categories
            <ChevronIcon className="h-5 w-5" />
          </button>

          <nav className="flex flex-1 items-center justify-center gap-8 xl:gap-12">
            {navItems.map((item, index) => (
              <Link
                key={item}
                to="/"
                className={`flex items-center gap-2 text-[16px] font-bold transition hover:text-[#0f8b86] ${
                  index === 0 ? 'text-[#0f8b86]' : 'text-[#111827]'
                }`}
              >
                {item}
                {['Home', 'Shop', 'Sellers', 'Mega Menu', 'Blog', 'Pages'].includes(item) ? (
                  <ChevronIcon className="h-4 w-4 opacity-75" />
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="flex min-w-[210px] items-center justify-end gap-4">
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#f5f7fb] text-[#111827]">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 13a7.5 7.5 0 1 1 15 0v4A1.5 1.5 0 0 1 18 18.5h-2V13h3.5M8 18.5H6A1.5 1.5 0 0 1 4.5 17v-4H8v5.5Z" />
              </svg>
            </div>
            <div className="leading-tight text-right">
              <p className="text-[14px] font-medium text-[#5b6475]">24/7 Support</p>
              <p className="text-[16px] font-semibold text-[#111827]">888-777-999</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Slide-out navigation menu) */}
      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Dark overlay backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer container panel */}
          <div className="fixed bottom-0 top-0 left-0 z-50 w-[290px] max-w-[85vw] bg-white p-6 shadow-2xl transition-transform duration-300 ease-out flex flex-col h-full overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#eef2f7] pb-4 mb-5">
              <span className="text-[22px] font-black text-[#0f8b86] tracking-tight">Menu</span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#f3f4f6] text-[#4b5563] hover:bg-[#e5e7eb] transition cursor-pointer"
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Categories segment */}
            <div className="mb-6">
              <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#8d9ab1] mb-3">Categories</p>
              <button className="flex w-full items-center justify-between rounded-xl bg-[#0f8b86]/10 px-4 py-3 text.left text-[15px] font-bold text-[#0f8b86] hover:bg-[#0f8b86]/15 transition cursor-pointer">
                <span>Explore All Categories</span>
                <ChevronIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Main navigation items segment */}
            <nav className="flex flex-col gap-1.5 mb-6">
              <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#8d9ab1] mb-2">Navigation</p>
              {navItems.map((item, index) => (
                <Link
                  key={item}
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-[16px] font-bold transition hover:bg-[#f8fafc] hover:text-[#0f8b86] ${
                    index === 0 ? 'text-[#0f8b86] bg-[#0f8b86]/5' : 'text-[#111827]'
                  }`}
                >
                  <span>{item}</span>
                  {['Home', 'Shop', 'Sellers', 'Mega Menu', 'Blog', 'Pages'].includes(item) && (
                    <ChevronIcon className="h-4 w-4 text-[#8d9ab1]" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Support and contact details segment */}
            <div className="mt-auto border-t border-[#eef2f7] pt-5">
              <div className="flex items-center gap-3">
                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#f5f7fb] text-[#111827]">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 13a7.5 7.5 0 1 1 15 0v4A1.5 1.5 0 0 1 18 18.5h-2V13h3.5M8 18.5H6A1.5 1.5 0 0 1 4.5 17v-4H8v5.5Z" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <p className="text-[12px] font-medium text-[#5b6475]">24/7 Customer Support</p>
                  <p className="text-[15px] font-bold text-[#111827]">888-777-999</p>
                </div>
              </div>

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="mt-5 w-full inline-flex h-[46px] items-center justify-center rounded-full bg-[#111827] text-[14px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#0f8b86] cursor-pointer"
                >
                  Log out
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-5 w-full inline-flex h-[46px] items-center justify-center rounded-full bg-[#0f8b86] text-[14px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_8px_16px_rgba(15,139,134,0.18)] transition hover:bg-[#0b7672]"
                >
                  Log in / Sign up
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default SiteHeader
