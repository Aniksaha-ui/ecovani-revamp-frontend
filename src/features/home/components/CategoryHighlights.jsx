import { categories } from '../data/homeData'

function CategoryHighlights() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:py-8">
      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <article
            key={category.id}
            className="rounded-[1.75rem] border border-[var(--color-border)] bg-white p-6 shadow-[0_10px_30px_rgba(14,18,28,0.04)]"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              {category.itemCount}
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-[var(--color-heading)]">
              {category.title}
            </h2>
            <p className="mt-3 text-base leading-7 text-[var(--color-copy-soft)]">
              {category.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CategoryHighlights
