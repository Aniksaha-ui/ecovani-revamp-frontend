import { Link } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

function LoginPage() {
  return (
    <div className="min-h-screen px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[2.1rem] border border-[#d9dfeb] bg-white shadow-[0_28px_68px_rgba(24,35,30,0.08)] lg:grid-cols-[1.02fr_0.98fr]">
        <div className="relative flex flex-col justify-between overflow-hidden bg-[#ffe96a] p-8 text-[#111827] lg:p-10">
          <div className="absolute left-[-4rem] top-[-4rem] h-40 w-40 rounded-full bg-white/35 blur-3xl" />
          <div className="absolute bottom-[-5rem] right-[-2rem] h-56 w-56 rounded-full bg-[#0f8b86]/20 blur-3xl" />

          <div className="relative space-y-6">
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white/65 px-4 py-2 text-sm font-bold text-[#111827] shadow-[0_10px_20px_rgba(17,24,39,0.08)] backdrop-blur"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
              </svg>
              Back to shop
            </Link>
            <div className="space-y-4">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-[#0f8b86]">
                Customer access
              </p>
              <h2 className="max-w-lg text-5xl font-black leading-[1.02] tracking-[-0.05em]">
                Sign in with the same clean, fast shopping experience.
              </h2>
              <p className="max-w-xl text-[17px] leading-8 text-[#243044]/82">
                Your account area now follows the storefront look: bright, friendly,
                and focused on fast checkout, saved favorites, and order tracking.
              </p>
            </div>
          </div>

          <div className="relative mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[
              'Track your recent orders',
              'Save favorites for later',
              'Manage shipping details',
            ].map((item, index) => (
              <div
                key={item}
                className={`rounded-[1.5rem] border border-black/8 p-5 text-sm font-bold shadow-[0_16px_28px_rgba(17,24,39,0.08)] ${
                  index === 0
                    ? 'bg-white'
                    : index === 1
                      ? 'bg-[#0f8b86] text-white'
                      : 'bg-[#111827] text-white'
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center bg-[linear-gradient(180deg,_#f7faf8,_#eef4f1)] p-8 lg:p-10">
          <div className="absolute inset-x-10 top-10 h-28 rounded-full bg-[#dfece5] blur-3xl" />
          <div className="relative mx-auto w-full max-w-md rounded-[1.9rem] border border-[var(--color-border)] bg-white/92 p-6 shadow-[0_24px_52px_rgba(24,35,30,0.08)] backdrop-blur md:p-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
