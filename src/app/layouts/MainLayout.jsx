import { Outlet } from 'react-router-dom'
import Footer from '../../shared/components/Footer'
import SiteHeader from '../../shared/components/SiteHeader'

function MainLayout() {
  return (
    <div className="relative flex min-h-screen flex-col text-[var(--color-heading)] selection:bg-[var(--color-accent)]/20">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[10%] top-0 h-[24rem] w-[24rem] rounded-full bg-[#dfeae4] blur-[120px]" />
        <div className="absolute bottom-[-12%] right-[-6%] h-[22rem] w-[22rem] rounded-full bg-[#d4e1da] blur-[120px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="w-full">
          <SiteHeader />
        </div>
        <div className="mx-auto flex w-[92%] lg:w-[85%] xl:w-[80%] max-w-[1720px] flex-1 px-4 pt-6">
          <main className="flex-1 pb-16">
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default MainLayout
