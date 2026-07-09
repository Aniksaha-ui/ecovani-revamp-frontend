import { Link } from 'react-router-dom'

function CategoryHighlights({ categories }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:py-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--color-copy-soft)]">
            Popular categories
          </p>
          <h2 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">
            Explore by category
          </h2>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            to={`/categories/${category.id}/products`}
            state={{ categoryTitle: category.title }}
            className="group rounded-[1.5rem] border border-[var(--color-border)] bg-white p-6 shadow-[0_16px_36px_rgba(24,35,30,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(24,35,30,0.08)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-panel)] text-lg font-bold text-[var(--color-accent-strong)]">
              {index + 1}
            </div>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-copy-soft)]">
              {category.itemCount} items
            </p>
            <h2 className="mt-3 text-2xl font-bold text-[var(--color-heading)]">
              {category.title}
            </h2>
            <p className="mt-3 text-base leading-7 text-[var(--color-copy-soft)]">
              {category.description}
            </p>
            <p className="mt-5 text-sm font-semibold text-[var(--color-heading)] transition group-hover:translate-x-1">
              View category →
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CategoryHighlights
