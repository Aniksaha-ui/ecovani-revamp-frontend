import { Link, useLocation } from 'react-router-dom'

const categories = [
  { name: 'All Categories', path: '/', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { name: 'Electronics', path: '/category/electronics', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { name: 'Fashion', path: '/category/fashion', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { name: 'Home & Living', path: '/category/home-living', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Beauty', path: '/category/beauty', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
  { name: 'Sports', path: '/category/sports', icon: 'M14.752 11.168l-3.197-2.132A4 4 0 002 9.11V19a2 2 0 002 2h14a2 2 0 002-2v-9.89a4 4 0 00-5.248-3.942z' },
]

function Sidebar() {
  const location = useLocation()

  return (
    <aside className="sticky top-28 hidden h-[calc(100vh-8rem)] w-[280px] flex-shrink-0 flex-col overflow-y-auto lg:flex">
      <div className="flex flex-col rounded-3xl bg-white/70 backdrop-blur-2xl border border-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden">
        {/* Decorative inner glow */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
        
        <div className="mb-5 px-1">
          <h2 className="text-[12px] font-extrabold uppercase tracking-[0.25em] text-slate-400/80">Discover</h2>
        </div>
        
        <nav className="flex-1 space-y-2 relative z-10">
          {categories.map((category) => {
            const isActive = location.pathname === category.path
            return (
              <Link
                key={category.name}
                to={category.path}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-600 hover:bg-white hover:text-indigo-600 hover:shadow-md hover:-translate-y-0.5 border border-transparent hover:border-white'
                }`}
              >
                <svg className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? "2" : "1.5"} d={category.icon} />
                </svg>
                {category.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="mt-10 mb-5 px-1 relative z-10">
          <h2 className="text-[12px] font-extrabold uppercase tracking-[0.25em] text-slate-400/80">Price Range</h2>
        </div>
        
        <div className="space-y-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">$</span>
              <input type="number" placeholder="Min" className="w-full rounded-xl border border-slate-200/50 bg-white/50 pl-7 pr-3 py-2.5 text-sm font-medium text-slate-700 shadow-inner outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/40 transition-all placeholder:font-normal" />
            </div>
            <span className="text-slate-300 font-bold">-</span>
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">$</span>
              <input type="number" placeholder="Max" className="w-full rounded-xl border border-slate-200/50 bg-white/50 pl-7 pr-3 py-2.5 text-sm font-medium text-slate-700 shadow-inner outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/40 transition-all placeholder:font-normal" />
            </div>
          </div>
          
          <button className="relative w-full overflow-hidden rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-xl shadow-slate-900/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/30 active:scale-[0.98] group">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Apply Filters</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
