import ProductCard from './ProductCard'

function ProductGrid({ products, variant = 'default', sectionLabel = '' }) {
  return (
    <div
      className={
        variant === 'trending'
          ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3'
          : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'
      }
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          variant={variant}
          sectionLabel={sectionLabel}
        />
      ))}
    </div>
  )
}

export default ProductGrid
