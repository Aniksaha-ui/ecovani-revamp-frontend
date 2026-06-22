import { Outlet } from 'react-router-dom'
import Footer from '../../shared/components/Footer'
import SiteHeader from '../../shared/components/SiteHeader'
import Sidebar from '../../shared/components/Sidebar'

function MainLayout() {
  return (
    <div className="relative min-h-screen bg-[#fafcff] text-slate-800 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Ambient glowing background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-400/20 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-teal-400/20 blur-[120px]" />
        {/* Fine noise overlay for premium texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="pt-6 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto w-full">
          <SiteHeader />
        </div>
        <div className="flex flex-1 mx-auto w-full max-w-[1440px] pt-8 px-4 sm:px-6 lg:px-8 gap-8">
          <Sidebar />
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
