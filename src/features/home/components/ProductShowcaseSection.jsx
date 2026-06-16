import ProductGrid from '../../../shared/components/ProductGrid'
import SectionHeader from '../../../shared/components/SectionHeader'

function ProductShowcaseSection({ eyebrow, title, description, products }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-10">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actionLabel="Browse all"
      />
      <ProductGrid products={products} />
    </section>
  )
}

export default ProductShowcaseSection
