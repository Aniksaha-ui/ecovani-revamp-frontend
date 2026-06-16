function SectionHeader({ eyebrow, title, description, actionLabel }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--color-accent)]">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-heading)] md:text-4xl">
          {title}
        </h2>
        <p className="text-base leading-7 text-[var(--color-copy-soft)]">
          {description}
        </p>
      </div>
      {actionLabel ? (
        <button
          type="button"
          className="inline-flex w-fit items-center justify-center rounded-full border border-[var(--color-accent)] bg-[linear-gradient(135deg,_var(--color-accent),_var(--color-berry))] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(206,93,124,0.22)] transition hover:-translate-y-0.5"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

export default SectionHeader
