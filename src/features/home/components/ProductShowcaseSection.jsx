import ProductGrid from '../../../shared/components/ProductGrid'
import SectionHeader from '../../../shared/components/SectionHeader'

function ProductShowcaseSection({ sectionId, eyebrow, title, description, products }) {
  const isTrendingSection =
    String(sectionId || '').includes('trend') || String(title || '').toLowerCase().includes('trend')

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-10">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actionLabel="Browse all"
      />
      <ProductGrid
        products={products}
        variant={isTrendingSection ? 'trending' : 'default'}
        sectionLabel={title}
      />
    </section>
  )
}

export default ProductShowcaseSection
