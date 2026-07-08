import { Link } from 'react-router-dom'
import InputField from '../../../shared/components/InputField'

function LoginForm() {
  return (
    <form className="space-y-5">
      <div className="space-y-1">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
          Welcome back
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-[var(--color-heading)]">
          Sign in to your account
        </h1>
        <p className="text-base leading-7 text-[var(--color-copy-soft)]">
          Access orders, saved products, and checkout faster on your next visit.
        </p>
      </div>

      <div className="grid gap-4">
        <InputField
          label="Email address"
          type="email"
          placeholder="shopper@example.com"
        />
        <InputField
          label="Password"
          type="password"
          placeholder="Enter your password"
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-[var(--color-copy-soft)]">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-[var(--color-border-strong)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
          />
          Remember me
        </label>
        <Link
          to="/"
          className="font-medium text-[var(--color-accent)] transition hover:text-[var(--color-accent-strong)]"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--color-heading)] px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(24,35,30,0.14)] transition hover:bg-[var(--color-accent-strong)]"
      >
        Sign in
      </button>

      <p className="text-sm text-[var(--color-copy-soft)]">
        New here?{' '}
        <Link
          to="/"
          className="font-semibold text-[var(--color-heading)] transition hover:text-[var(--color-accent)]"
        >
          Explore the storefront
        </Link>
      </p>
    </form>
  )
}

export default LoginForm
