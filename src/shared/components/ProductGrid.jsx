import ProductCard from './ProductCard'

function ProductGrid({ products, variant = 'default', sectionLabel = '' }) {
  return (
    <div
      className={
        variant === 'trending'
          ? 'grid gap-5 md:grid-cols-2'
          : 'grid gap-5 md:grid-cols-2 xl:grid-cols-4'
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
