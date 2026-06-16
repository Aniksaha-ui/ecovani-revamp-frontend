import CategoryHighlights from '../components/CategoryHighlights'
import HeroSection from '../components/HeroSection'
import NewsletterSection from '../components/NewsletterSection'
import ProductShowcaseSection from '../components/ProductShowcaseSection'
import PromoSection from '../components/PromoSection'
import { productCollections } from '../data/homeData'

function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryHighlights />
      {productCollections.map((collection) => (
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
