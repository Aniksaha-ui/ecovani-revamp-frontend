import CategoryHighlights from '../components/CategoryHighlights'
import HeroSection from '../components/HeroSection'
import NewsletterSection from '../components/NewsletterSection'
import ProductShowcaseSection from '../components/ProductShowcaseSection'
import PromoSection from '../components/PromoSection'
import useHomePageData from '../hooks/useHomePageData'

function HomePage() {
  const { isLoading, error, data } = useHomePageData()

  return (
    <>
      <HeroSection slides={data.slides} trustPoints={data.trustPoints} />
      {(data.usingFallback || error) && (
        <section className="mx-auto max-w-7xl px-4 py-2 md:px-6">
          <div className="rounded-[1.4rem] border border-[var(--color-border)] bg-white/72 px-4 py-3 text-sm text-[var(--color-copy-soft)] shadow-[0_10px_24px_rgba(29,42,58,0.04)]">
            {error
              ? `${error} Showing fallback storefront content until the API is ready.`
              : 'API endpoints are configured, but the current storefront route set is unavailable. Showing fallback content for now.'}
          </div>
        </section>
      )}
      {isLoading && (
        <section className="mx-auto max-w-7xl px-4 py-2 md:px-6">
          <div className="rounded-[1.4rem] border border-[var(--color-border)] bg-white/72 px-4 py-3 text-sm text-[var(--color-copy-soft)] shadow-[0_10px_24px_rgba(29,42,58,0.04)]">
            Loading homepage data from the ecommerce API...
          </div>
        </section>
      )}
      <CategoryHighlights categories={data.categories} />
      {data.collections.map((collection) => (
        <ProductShowcaseSection
          key={collection.id}
          eyebrow={collection.eyebrow}
          title={collection.title}
          description={collection.description}
          products={collection.products}
        />
      ))}
      <PromoSection />
      <NewsletterSection />
    </>
  )
}

export default HomePage
