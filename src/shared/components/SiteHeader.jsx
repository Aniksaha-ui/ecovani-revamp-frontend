import { Link } from 'react-router-dom'

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
  return (
    <header className="w-full overflow-hidden border-y border-[#d9dfeb] bg-white">
      <div className="h-[6px] bg-[#0f8b86]" />

      <div className="border-b border-[#d9dfeb]">
        <div className="mx-auto flex w-[80%] max-w-[1720px] items-center gap-6 px-0 py-5">
          <Link to="/" className="flex min-w-[260px] items-center">
            <div className="flex items-center gap-3 text-[#0f8b86]">
              <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#0f8b86] text-[34px] font-black text-white">
                S
              </div>
              <div className="leading-none">
                <div className="text-[62px] font-black tracking-[-0.05em] text-[#0f8b86]">
                  Ecovani
                </div>
              </div>
            </div>
          </Link>

          <div className="flex flex-1 items-center justify-center">
            <div className="relative w-full max-w-[805px]">
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

          <div className="ml-auto flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#ffc107] text-[#111827]">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <circle cx="12" cy="8" r="3.2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 18a5.5 5.5 0 0 1 11 0" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <div className="leading-tight">
                  <p className="text-[15px] font-medium text-[#5b6475]">Account</p>
                  <p className="text-[32px] font-semibold tracking-[-0.04em] text-[#111827]">log in</p>
                </div>
                <ChevronIcon className="mt-4 h-5 w-5 text-[#111827]" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#ffc107] text-[#111827]">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l1.5 8.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.7L20 7H7.1" />
                  <circle cx="10" cy="19" r="1.6" />
                  <circle cx="17.5" cy="19" r="1.6" />
                </svg>
              </div>
              <div className="leading-tight">
                <p className="text-[15px] font-medium text-[#5b6475]">Cart</p>
                <p className="text-[32px] font-semibold tracking-[-0.04em] text-[#111827]">0- Items</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mx-auto flex w-[80%] max-w-[1720px] items-center justify-between gap-6 px-0 py-[14px]">
          <button className="inline-flex h-[48px] min-w-[264px] items-center justify-center gap-3 rounded-[8px] bg-[#0f8b86] px-6 text-[16px] font-bold text-white shadow-[0_8px_20px_rgba(15,139,134,0.2)]">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="4" width="6" height="6" rx="1.2" />
              <rect x="14" y="4" width="6" height="6" rx="1.2" />
              <rect x="4" y="14" width="6" height="6" rx="1.2" />
              <rect x="14" y="14" width="6" height="6" rx="1.2" />
            </svg>
            Explore All Categories
            <ChevronIcon className="h-5 w-5" />
          </button>

          <nav className="flex flex-1 items-center justify-center gap-12">
            {navItems.map((item, index) => (
              <Link
                key={item}
                to="/"
                className={`flex items-center gap-2 text-[16px] font-bold ${
                  index === 0 ? 'text-[#0f8b86]' : 'text-[#111827]'
                }`}
              >
                {item}
                {['Home', 'Shop', 'Sellers', 'Mega Menu', 'Blog', 'Pages'].includes(item) ? (
                  <ChevronIcon className="h-4 w-4" />
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
            <div className="leading-tight">
              <p className="text-[14px] font-medium text-[#5b6475]">24/7 Support</p>
              <p className="text-[16px] font-semibold text-[#111827]">888-777-999</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
