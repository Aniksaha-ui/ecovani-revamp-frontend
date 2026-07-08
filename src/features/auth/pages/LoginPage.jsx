import { Link } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--color-page)] px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[2.1rem] border border-[var(--color-border)] bg-white shadow-[0_24px_60px_rgba(24,35,30,0.08)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative flex flex-col justify-between overflow-hidden bg-[linear-gradient(160deg,_#1f2d27,_#294239_60%,_#35564b)] p-8 text-white lg:p-10">
          <div className="space-y-5">
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white"
            >
              Back to shop
            </Link>
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/72">
                Customer access
              </p>
              <h2 className="max-w-md text-4xl font-bold tracking-tight">
                One secure account for orders, wishlists, and faster checkout.
              </h2>
              <p className="max-w-lg text-base leading-7 text-white/82">
                Keep account access simple and dependable while leaving room for future
                registration, password recovery, and profile management features.
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
                className="rounded-[1.5rem] border border-white/14 bg-white/8 p-5 text-sm font-medium text-white"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center p-8 lg:p-10">
          <div className="mx-auto w-full max-w-md rounded-[1.7rem] border border-[var(--color-border)] bg-white p-6 shadow-[0_20px_48px_rgba(24,35,30,0.06)] md:p-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
