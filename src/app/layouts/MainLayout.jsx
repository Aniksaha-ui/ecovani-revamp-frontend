import { Outlet } from 'react-router-dom'
import Footer from '../../shared/components/Footer'
import SiteHeader from '../../shared/components/SiteHeader'

function MainLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden text-[var(--color-copy)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.66),_transparent_68%)]" />
      <div className="pointer-events-none absolute left-[-8rem] top-32 h-72 w-72 rounded-full bg-[var(--color-gold)]/14 blur-3xl" />
      <div className="pointer-events-none absolute right-[-6rem] top-[30rem] h-80 w-80 rounded-full bg-[var(--color-berry)]/12 blur-3xl" />
      <SiteHeader />
      <main className="relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
