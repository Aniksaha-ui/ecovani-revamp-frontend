import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductGrid from '../../../shared/components/ProductGrid'
import { fetchSearchProducts } from '../api/productApi'

function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = (searchParams.get('q') || '').trim()
  const [state, setState] = useState({
    isLoading: true,
    error: '',
    products: [],
  })

  useEffect(() => {
    let isMounted = true

    async function loadResults() {
      setState({
        isLoading: true,
        error: '',
        products: [],
      })

      try {
        const products = await fetchSearchProducts(query)

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
          error: 'Search results could not be loaded right now.',
          products: [],
        })
      }
    }

    loadResults()

    return () => {
      isMounted = false
    }
  }, [query])

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
        <span className="font-medium">Search</span>
      </div>

      <div className="rounded-[2rem] border border-[var(--color-border)] bg-white/85 p-6 shadow-[0_18px_40px_rgba(29,42,58,0.08)] md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-copy-soft)]">
          Global search
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--color-heading)]">
          {query ? `Results for "${query}"` : 'Search the storefront'}
        </h1>
        <p className="mt-2 text-[15px] leading-7 text-[var(--color-copy-soft)]">
          {state.isLoading
            ? 'Finding matching products...'
            : `${state.products.length} product${state.products.length === 1 ? '' : 's'} found.`}
        </p>

        {state.error ? (
          <div className="mt-6 rounded-[1.3rem] border border-[#f3c5c5] bg-[#fff6f6] px-4 py-3 text-sm font-medium text-[#b42318]">
            {state.error}
          </div>
        ) : null}

        {!state.error && !state.isLoading && !query ? (
          <div className="mt-8 rounded-[1.5rem] bg-[var(--color-panel)] px-6 py-10 text-center">
            <h2 className="text-2xl font-bold text-[var(--color-heading)]">Enter a search term</h2>
            <p className="mt-3 text-[15px] leading-7 text-[var(--color-copy-soft)]">
              Use the search bar in the header to find products by name, category, or description.
            </p>
          </div>
        ) : null}

        {!state.error && !state.isLoading && query && state.products.length === 0 ? (
          <div className="mt-8 rounded-[1.5rem] bg-[var(--color-panel)] px-6 py-10 text-center">
            <h2 className="text-2xl font-bold text-[var(--color-heading)]">No matching products found</h2>
            <p className="mt-3 text-[15px] leading-7 text-[var(--color-copy-soft)]">
              Try a different product name, category, or keyword.
            </p>
          </div>
        ) : null}

        {!state.error && state.products.length > 0 ? (
          <div className="mt-8">
            <ProductGrid products={state.products} sectionLabel={query || 'Search'} />
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default SearchResultsPage
