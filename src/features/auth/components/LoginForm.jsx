import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InputField from '../../../shared/components/InputField'
import { useAuth } from '../context/AuthContext'

function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    remember: true,
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setFormValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrors((current) => ({
      ...current,
      [name]: '',
    }))
    setFormError('')
  }

  function validateForm() {
    const nextErrors = {}

    if (!formValues.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!formValues.password.trim()) {
      nextErrors.password = 'Password is required.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setFormError('')

    try {
      await login(formValues)
      navigate('/', { replace: true })
    } catch (error) {
      setFormError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <span className="inline-flex items-center rounded-full bg-[var(--color-accent-soft)] px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-accent-strong)]">
          Welcome back
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.04em] text-[var(--color-heading)]">
          Sign in to your account
        </h1>
        <p className="text-[15px] leading-7 text-[var(--color-copy-soft)]">
          Access orders, saved products, and checkout faster on your next visit.
        </p>
      </div>

      <div className="grid gap-4">
        <InputField
          label="Email address"
          type="email"
          placeholder="shopper@example.com"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          autoComplete="email"
          error={errors.email}
          disabled={isSubmitting}
        />
        <InputField
          label="Password"
          type="password"
          placeholder="Enter your password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
          autoComplete="current-password"
          error={errors.password}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-[var(--color-copy-soft)]">
          <input
            name="remember"
            type="checkbox"
            checked={formValues.remember}
            onChange={handleChange}
            disabled={isSubmitting}
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

      {formError ? (
        <div className="rounded-[1.3rem] border border-[#f3c5c5] bg-[#fff6f6] px-4 py-3 text-sm font-medium text-[#b42318]">
          {formError}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#0f8b86] px-5 text-sm font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_16px_28px_rgba(15,139,134,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0b7672] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span>{isSubmitting ? 'Signing in...' : 'Sign In Securely'}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0f8b86]">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M9 7h8v8" />
          </svg>
        </span>
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
