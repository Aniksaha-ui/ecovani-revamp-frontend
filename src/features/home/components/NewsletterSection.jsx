import InputField from '../../../shared/components/InputField'

function NewsletterSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-12">
      <div className="relative grid gap-6 overflow-hidden rounded-[2.2rem] border border-white/65 bg-white/82 p-8 shadow-[0_20px_60px_rgba(37,22,15,0.06)] backdrop-blur lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="absolute -right-4 top-0 h-28 w-28 rounded-full bg-[var(--color-gold)]/20 blur-3xl" />
        <div className="relative space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--color-accent)]">
            Stay updated
          </p>
          <h2 className="text-3xl font-semibold text-[var(--color-heading)]">
            Get product drops, deal alerts, and launch updates.
          </h2>
          <p className="max-w-xl text-base leading-7 text-[var(--color-copy-soft)]">
            The module is structured as a reusable email capture block, so you can
            plug it into marketing pages later without rewriting the form.
          </p>
        </div>
        <form className="relative grid gap-4 rounded-[1.7rem] border border-white/80 bg-[linear-gradient(180deg,_#fff7ee,_#fff1e2)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <InputField
            label="Email address"
            type="email"
            placeholder="you@example.com"
          />
          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,_var(--color-accent),_var(--color-berry))] px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(206,93,124,0.24)] transition hover:-translate-y-0.5"
          >
            Join newsletter
          </button>
        </form>
      </div>
    </section>
  )
}

export default NewsletterSection
