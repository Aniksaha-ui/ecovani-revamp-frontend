import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { fetchCategoryProducts } from '../api/productApi'
import ProductGrid from '../../../shared/components/ProductGrid'

function CategoryProductsPage() {
  const { categoryId } = useParams()
  const location = useLocation()
  const [state, setState] = useState({
    isLoading: true,
    error: '',
    products: [],
  })

  const categoryTitle = location.state?.categoryTitle || state.products[0]?.category || 'Category'

  useEffect(() => {
    let isMounted = true

    async function loadCategoryProducts() {
      try {
        const products = await fetchCategoryProducts(categoryId)

        if (!isMounted) {
          return
        }

        setState({
          isLoading: false,
          error: '',
          products,
        })
      } catch {
        if (!isMounted) {
          return
        }

        setState({
          isLoading: false,
          error: 'We could not load products for this category right now.',
          products: [],
        })
      }
    }

    setState({
      isLoading: true,
      error: '',
      products: [],
    })
    loadCategoryProducts()

    return () => {
      isMounted = false
    }
  }, [categoryId])

  if (state.isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:py-14">
        <div className="rounded-[2rem] border border-[var(--color-border)] bg-white/85 px-6 py-10 shadow-[0_18px_40px_rgba(29,42,58,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-copy-soft)]">
            Loading category
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[var(--color-heading)]">
            Fetching products for {categoryTitle}
          </h1>
        </div>
      </section>
    )
  }

  if (state.error) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-14 md:px-6">
        <div className="rounded-[2rem] border border-[var(--color-border)] bg-white/85 p-8 text-center shadow-[0_18px_40px_rgba(29,42,58,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-copy-soft)]">
            Category unavailable
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[var(--color-heading)]">{state.error}</h1>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,_var(--color-accent),_var(--color-berry))] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(61,120,197,0.25)] transition hover:-translate-y-0.5"
          >
            Back to storefront
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-10">
      <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-[#8391a7]">
        <Link to="/" className="inline-flex items-center gap-2 font-medium text-[#14213d] transition hover:text-[var(--color-accent)]">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5.5v-6h-5V21H4a1 1 0 0 1-1-1v-9.5Z" />
          </svg>
          Home
        </Link>
        <span>•</span>
        <span className="font-medium">{categoryTitle}</span>
      </div>

      <div className="rounded-[2rem] border border-[var(--color-border)] bg-white/85 p-6 shadow-[0_18px_40px_rgba(29,42,58,0.08)] md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-copy-soft)]">
          Category products
        </p>
        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-heading)]">{categoryTitle}</h1>
            <p className="mt-2 text-[15px] leading-7 text-[var(--color-copy-soft)]">
              {state.products.length} related product{state.products.length === 1 ? '' : 's'} found.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold text-[var(--color-heading)] transition hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Continue shopping
          </Link>
        </div>

        {state.products.length ? (
          <div className="mt-8">
            <ProductGrid products={state.products} sectionLabel={categoryTitle} />
          </div>
        ) : (
          <div className="mt-8 rounded-[1.5rem] bg-[var(--color-panel)] px-6 py-10 text-center">
            <h2 className="text-2xl font-bold text-[var(--color-heading)]">No products found</h2>
            <p className="mt-3 text-[15px] leading-7 text-[var(--color-copy-soft)]">
              This category does not have any products available yet.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default CategoryProductsPage
