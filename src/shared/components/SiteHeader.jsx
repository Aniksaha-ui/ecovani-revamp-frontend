import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/electronics', label: 'Electronics' },
  { to: '/accessories', label: 'Accessories' },
  { to: '/trending', label: 'Trending' },
]

function SiteHeader() {
  return (
    <header className="sticky top-6 z-40 w-full rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white shadow-lg shadow-indigo-500/30 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            E
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
            Ecovani
          </span>
        </Link>

        <div className="hidden flex-1 max-w-lg mx-8 md:block">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              className="block w-full rounded-full border border-slate-200/60 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 hover:bg-slate-50 shadow-inner" 
              placeholder="Search products, brands and categories..." 
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="hidden lg:flex items-center gap-1 mr-2 p-1 rounded-full bg-slate-50/80 border border-slate-100">
            {navItems.map((item, index) => (
              <NavLink
                key={`${item.label}-${index}`}
                to={item.to}
                className={({ isActive }) => `relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${isActive ? 'text-indigo-700 bg-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          
          <button className="relative flex items-center justify-center w-10 h-10 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
              2
            </span>
          </button>
          
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:scale-105 hover:shadow-xl hover:shadow-slate-900/30 active:scale-95"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
