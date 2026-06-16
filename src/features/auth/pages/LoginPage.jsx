import { Link } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--color-page)] px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[2.4rem] border border-white/70 bg-white/80 shadow-[0_24px_80px_rgba(29,42,58,0.08)] backdrop-blur lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative flex flex-col justify-between overflow-hidden bg-[linear-gradient(180deg,_rgba(61,120,197,0.12),_rgba(255,255,255,0.92)),linear-gradient(135deg,_#f2f7fc,_#ffffff)] p-8 lg:p-10">
          <div className="absolute -left-6 top-10 h-32 w-32 rounded-full bg-[var(--color-gold)]/24 blur-3xl" />
          <div className="absolute bottom-6 right-0 h-40 w-40 rounded-full bg-[var(--color-berry)]/14 blur-3xl" />
          <div className="space-y-5">
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/82 px-4 py-2 text-sm font-medium text-[var(--color-heading)] shadow-[0_10px_24px_rgba(37,22,15,0.05)]"
            >
              Back to shop
            </Link>
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--color-accent)]">
                Customer access
              </p>
              <h2 className="max-w-md text-4xl font-semibold tracking-tight text-[var(--color-heading)]">
                One login for orders, wishlists, and faster checkout.
              </h2>
              <p className="max-w-lg text-base leading-7 text-[var(--color-copy-soft)]">
                This page is feature-based too, so auth flows can grow here later
                with registration, password reset, and verification screens.
              </p>
            </div>
          </div>

          <div className="relative grid gap-4 pt-10 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[
              'Track your recent orders',
              'Save favorites for later',
              'Manage shipping details',
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-white/80 bg-white/70 p-5 text-sm font-medium text-[var(--color-heading)] shadow-[0_12px_30px_rgba(37,22,15,0.05)] backdrop-blur"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center p-8 lg:p-10">
          <div className="mx-auto w-full max-w-md rounded-[1.9rem] border border-white/80 bg-[linear-gradient(180deg,_#ffffff,_#f0f6fb)] p-6 shadow-[0_20px_56px_rgba(29,42,58,0.08)] md:p-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
