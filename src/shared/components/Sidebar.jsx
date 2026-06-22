import { Link, useLocation } from 'react-router-dom'

const categories = [
  { name: 'All Categories', path: '/' },
  { name: 'Electronics', path: '/category/electronics' },
  { name: 'Fashion', path: '/category/fashion' },
  { name: 'Home & Living', path: '/category/home-living' },
  { name: 'Beauty', path: '/category/beauty' },
  { name: 'Sports', path: '/category/sports' },
]

function Sidebar() {
  const location = useLocation()

  return (
    <aside className="sticky top-28 hidden h-[calc(100vh-8rem)] w-64 flex-shrink-0 flex-col overflow-y-auto lg:flex">
      <div className="flex flex-col rounded-3xl bg-white/60 backdrop-blur-xl border border-white/80 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="mb-4 px-2">
          <h2 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400">Categories</h2>
        </div>
        <nav className="flex-1 space-y-1.5">
          {categories.map((category) => {
            const isActive = location.pathname === category.path
            return (
              <Link
                key={category.name}
                to={category.path}
                className={`flex items-center rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20 translate-x-1'
                    : 'text-slate-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm hover:translate-x-1'
                }`}
              >
                {category.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="mt-8 mb-4 px-2">
          <h2 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400">Price Range</h2>
        </div>
        <div className="space-y-4 px-2">
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Min" className="w-full rounded-xl border-none bg-white/80 px-3 py-2 text-sm shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow" />
            <span className="text-slate-400 font-medium">-</span>
            <input type="number" placeholder="Max" className="w-full rounded-xl border-none bg-white/80 px-3 py-2 text-sm shadow-inner outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow" />
          </div>
          <button className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-indigo-600 hover:shadow-indigo-500/30">
            Apply Filter
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
