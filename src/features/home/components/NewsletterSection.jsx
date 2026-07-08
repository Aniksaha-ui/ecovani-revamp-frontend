import InputField from '../../../shared/components/InputField'

function NewsletterSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-12">
      <div className="relative grid gap-6 overflow-hidden rounded-[1.9rem] border border-[var(--color-border)] bg-white p-8 shadow-[0_20px_46px_rgba(24,35,30,0.06)] backdrop-blur lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="relative space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--color-copy-soft)]">
            Newsletter
          </p>
          <h2 className="text-3xl font-bold text-[var(--color-heading)]">
            Get product updates, offers, and launch announcements.
          </h2>
          <p className="max-w-xl text-base leading-7 text-[var(--color-copy-soft)]">
            Keep this module reusable for future campaigns while presenting it in a
            more polished, trustworthy format.
          </p>
        </div>
        <form className="relative grid gap-4 rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-page)] p-5">
          <InputField
            label="Email address"
            type="email"
            placeholder="you@example.com"
          />
          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-heading)] px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(24,35,30,0.14)] transition hover:bg-[var(--color-accent-strong)]"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  )
}

export default NewsletterSection
