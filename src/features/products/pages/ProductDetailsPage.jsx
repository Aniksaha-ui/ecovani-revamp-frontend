import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProductDetails } from '../api/productApi'
import { useCart } from '../../cart/context/CartContext'

function CartIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.7L21 7H7.2" />
      <circle cx="10" cy="19" r="1.6" />
      <circle cx="18" cy="19" r="1.6" />
    </svg>
  )
}

function HeartIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20.2s-6.7-4.4-9-8.2C1.4 9.2 2.1 5.8 5.4 4.6c2-.7 4.2 0 5.6 1.7 1.4-1.7 3.6-2.4 5.6-1.7 3.3 1.2 4 4.6 2.4 7.4-2.3 3.8-9 8.2-9 8.2Z"
      />
    </svg>
  )
}

function CompareIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14 20 4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 4h6v6" />
    </svg>
  )
}

function StarRating({ value = 4.8 }) {
  const filledStars = Math.round(value)

  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 24 24"
          className={`h-5 w-5 ${index < filledStars ? 'fill-[#ffc629] text-[#ffc629]' : 'fill-[#d7dfeb] text-[#d7dfeb]'}`}
        >
          <path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3L12 17.2 6.4 20.2l1.1-6.3L2.9 9.4l6.3-.9L12 2.8Z" />
        </svg>
      ))}
    </div>
  )
}

function DetailSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="h-[36rem] animate-pulse rounded-[2rem] bg-white/75" />
        <div className="space-y-4">
          <div className="h-4 w-44 animate-pulse rounded-full bg-white/75" />
          <div className="h-14 w-4/5 animate-pulse rounded-2xl bg-white/75" />
          <div className="h-24 animate-pulse rounded-[1.5rem] bg-white/75" />
          <div className="h-56 animate-pulse rounded-[1.5rem] bg-white/75" />
        </div>
      </div>
    </section>
  )
}

function splitDescription(text) {
  return String(text || '')
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function ProductDetailsPage() {
  const { productId } = useParams()
  const { addItem, getItemQuantity } = useCart()
  const [state, setState] = useState({
    isLoading: true,
    error: '',
    product: null,
  })
  const [buttonLabel, setButtonLabel] = useState('Add to Cart')
  const [quantity, setQuantity] = useState(1)
  const [activeColor, setActiveColor] = useState(0)
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    let isMounted = true

    async function loadProduct() {
      setButtonLabel('Add to Cart')
      setQuantity(1)
      setActiveColor(0)
      setActiveTab('details')

      try {
        const product = await fetchProductDetails(productId)

        if (!isMounted) {
          return
        }

        setState({
          isLoading: false,
          error: '',
          product,
        })
      } catch {
        if (!isMounted) {
          return
        }

        setState({
          isLoading: false,
          error: 'We could not load this product right now.',
          product: null,
        })
      }
    }

    loadProduct()

    return () => {
      isMounted = false
    }
  }, [productId])

  if (state.isLoading) {
    return <DetailSkeleton />
  }

  if (state.error || !state.product) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-14 md:px-6">
        <div className="rounded-[2rem] border border-[var(--color-border)] bg-white/85 p-8 text-center shadow-[0_18px_40px_rgba(29,42,58,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-copy-soft)]">
            Product unavailable
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[var(--color-heading)]">
            {state.error || 'This product could not be found.'}
          </h1>
          <p className="mt-3 text-[15px] leading-7 text-[var(--color-copy-soft)]">
            Try heading back to the storefront and opening another product card.
          </p>
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

  const { product } = state
  const quantityInCart = getItemQuantity(product.id)
  const stockCount = Number.isFinite(product.stockQuantity) ? Number(product.stockQuantity) : null
  const isInStock = stockCount === null || stockCount > 0
  const maxPurchasableQuantity = stockCount && stockCount > 0 ? stockCount : 99

  const colorOptions = [
    { name: 'Midnight', value: '#1f2937' },
    { name: 'Cloud', value: '#e5e7eb' },
    { name: 'Royal', value: '#27479d' },
  ]

  const detailParagraphs = splitDescription(product.description)
  const tabItems = [
    { id: 'details', label: 'Product Details' },
    { id: 'specs', label: 'Specifications' },
    { id: 'reviews', label: `Customer Reviews (${128})` },
  ]
  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']

  function handleAddToCart() {
    if (!isInStock || buttonLabel === 'Adding...') {
      return
    }

    setButtonLabel('Adding...')

    addItem(product, quantity)
      .then(() => {
        setButtonLabel('Added to Cart')
      })
      .catch(() => {
        setButtonLabel('Try Again')
      })
  }

  function changeQuantity(nextQuantity) {
    if (!isInStock) {
      return
    }

    setQuantity(Math.max(1, Math.min(maxPurchasableQuantity, nextQuantity)))
  }

  return (
    <section className="mx-auto max-w-[1380px] px-4 py-8 md:px-6 lg:py-10">
      <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-[#8391a7]">
        <Link to="/" className="inline-flex items-center gap-2 font-medium text-[#14213d] transition hover:text-[var(--color-accent)]">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5.5v-6h-5V21H4a1 1 0 0 1-1-1v-9.5Z" />
          </svg>
          Home
        </Link>
        <span>•</span>
        <span className="font-medium">Product Details</span>
      </div>

      <div className="grid gap-9 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-[#b99f92] p-8">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="mx-auto h-[20rem] sm:h-[30rem] md:h-[38rem] w-full max-w-[34rem] object-contain"
              />
            ) : (
              <div className="mx-auto h-[20rem] sm:h-[30rem] md:h-[38rem] w-full max-w-[34rem] rounded-[1.5rem] bg-[#cab3a8]" />
            )}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[#dbe2ec] bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.04)]">
          <div className="inline-flex bg-[#d90429] px-2 py-1 text-[12px] font-extrabold uppercase text-white">
            Sales
          </div>
          <p className="mt-6 text-[14px] font-bold uppercase text-[#3b82f6]">New Arrival</p>

          <div className="mt-5 flex items-start justify-between gap-4">
            <h1 className="max-w-[470px] text-[28px] font-extrabold leading-[1.28] tracking-[-0.04em] text-[#14213d]">
              {product.name}
            </h1>
            <button
              type="button"
              aria-label="Save item"
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-[#d8dee9] bg-white text-[#5d6b82] transition hover:border-[#0f8b86] hover:text-[#0f8b86]"
            >
              <HeartIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
            <div className="flex items-center gap-2">
              <StarRating value={4.8} />
              <span className="text-[18px] font-medium text-[#5f6f86]">(11.78k reviews)</span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <p className="text-[24px] font-extrabold tracking-[-0.04em] text-[#14213d]">{product.price}</p>
            {product.originalPrice ? (
              <p className="text-[20px] font-medium text-[#97a3b8] line-through">{product.originalPrice}</p>
            ) : null}
            {product.discountLabel ? (
              <span className="bg-[#ffc107] px-2 py-1 text-[12px] font-extrabold uppercase text-black">{product.discountLabel}</span>
            ) : null}
          </div>

          <div className="mt-7 border-t border-dashed border-[#d8dee9]" />

          <div className="mt-5">
            <div className="flex items-center gap-2 text-[18px]">
              <span className="font-semibold text-[#14213d]">Color:</span>
              <span className="text-[#4d5d56]">Green</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              {colorOptions.map((color, index) => (
                <button
                  key={color.name}
                  type="button"
                  aria-label={`Select ${color.name} color`}
                  onClick={() => setActiveColor(index)}
                  className={`flex h-[34px] w-[34px] items-center justify-center rounded-full border transition ${activeColor === index ? 'border-[#0f8b86] bg-[#f1f7f6]' : 'border-[#d8dee9] bg-white'}`}
                >
                  <span className="h-[18px] w-[18px] rounded-full" style={{ backgroundColor: color.value }} />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[18px]">
              <span className="font-semibold text-[#14213d]">Size:</span>
              <span className="text-[#4d5d56]">{sizeOptions[0]}</span>
            </div>
            <button className="text-[14px] font-medium text-[#627089]">Size Guide</button>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {sizeOptions.map((size, index) => (
              <button
                key={size}
                className={`min-w-[72px] rounded-full border px-5 py-3 text-[15px] font-bold ${
                  index === 0
                    ? 'border-[#0f8b86] bg-[#0f8b86] text-white'
                    : 'border-[#d8dee9] bg-white text-[#14213d]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="mt-7">
            <p className="text-[18px] font-semibold text-[#14213d]">Quantity:</p>
            <div className="mt-4 flex h-[48px] w-max items-center rounded-full border border-[#d8dee9] bg-white px-4">
              <button
                type="button"
                onClick={() => changeQuantity(quantity - 1)}
                className="flex h-8 w-8 items-center justify-center text-[26px] text-[#627089] hover:text-[#0f8b86] transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="min-w-[56px] text-center text-[20px] font-semibold text-[#14213d]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => changeQuantity(quantity + 1)}
                className="flex h-8 w-8 items-center justify-center text-[26px] text-[#627089] hover:text-[#0f8b86] transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              className="flex-1 inline-flex h-[48px] items-center justify-center rounded-full bg-[#ffc107] px-6 text-[18px] font-bold text-[#14213d] shadow-[0_12px_24px_rgba(255,193,7,0.22)] transition hover:bg-[#ffb300] active:scale-[0.98] cursor-pointer"
            >
              Buy Now
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="flex-1 inline-flex h-[48px] items-center justify-center gap-3 rounded-full bg-[#0f8b86] px-6 text-[18px] font-bold text-white shadow-[0_14px_28px_rgba(15,139,134,0.18)] transition hover:bg-[#0b7672] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55 whitespace-nowrap cursor-pointer"
            >
              <CartIcon className="h-5 w-5" />
              {buttonLabel}
            </button>
          </div>

          <div className="mt-5 border-t border-dashed border-[#d8dee9]" />

          <div className="mt-5 flex flex-wrap items-center gap-8 text-[16px] text-[#3b82f6]">
            <button type="button" className="inline-flex items-center gap-2">
              <CompareIcon className="h-4 w-4" />
              Compare
            </button>
          </div>

          <div className="mt-5 space-y-4 text-[16px] text-[#4d5d56]">
            <p>
              <span className="font-semibold text-[#14213d]">Free Shipping:</span>{' '}
              Estimated Delivery Time 5-7 Days
            </p>
            <p>
              <span className="font-semibold text-[#14213d]">SKU:</span>{' '}
              {quantityInCart > 0 ? `${product.product_sku} • ${quantityInCart} in cart` : product.product_sku}
            </p>
            <p>
              <span className="font-semibold text-[#14213d]">Categories:</span>{' '}
              {product.category}, {product.subcategory || 'Computers'}, Accessories
            </p>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <div className="flex flex-wrap items-center gap-8 border-b border-[var(--color-border)]">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 pb-4 text-[1.05rem] font-medium transition ${activeTab === tab.id ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-transparent text-[var(--color-copy-soft)]'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pt-9">
          {activeTab === 'details' ? (
            <div className="space-y-7 text-[var(--color-copy)]">
              <div>
                <h2 className="text-[2rem] font-bold text-[var(--color-heading)]">Elevate Your {product.category} Experience</h2>
                <div className="mt-5 space-y-4 text-[16px] leading-8">
                  {detailParagraphs.length ? (
                    detailParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
                  ) : (
                    <p>This product is designed to balance reliable performance, polished presentation, and everyday comfort.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-[1.65rem] font-bold text-[var(--color-heading)]">Key Features:</h3>
                <ul className="mt-4 space-y-3 text-[16px] leading-8">
                  <li><strong>Premium Build Quality:</strong> Made for daily use with a clean, durable finish.</li>
                  <li><strong>Comfort-Focused Design:</strong> Built to feel easy and natural during longer sessions.</li>
                  <li><strong>Reliable Performance:</strong> Tuned to deliver steady results for work, travel, and entertainment.</li>
                  <li><strong>Modern Presentation:</strong> A storefront-ready product with strong visual appeal and clear pricing.</li>
                  <li><strong>Customer-Friendly Support:</strong> Backed by easy returns, warranty coverage, and responsive help.</li>
                </ul>
              </div>
            </div>
          ) : null}

          {activeTab === 'specs' ? (
            <div className="grid gap-4 rounded-[1.5rem] border border-[var(--color-border)] bg-white p-6 shadow-[0_12px_32px_rgba(24,35,30,0.05)] sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-copy-soft)]">Category</p>
                <p className="mt-2 text-lg font-semibold text-[var(--color-heading)]">{product.category}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-copy-soft)]">Subcategory</p>
                <p className="mt-2 text-lg font-semibold text-[var(--color-heading)]">{product.subcategory || 'General'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-copy-soft)]">SKU</p>
                <p className="mt-2 text-lg font-semibold text-[var(--color-heading)]">{product.sku}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-copy-soft)]">Available Stock</p>
                <p className="mt-2 text-lg font-semibold text-[var(--color-heading)]">
                  {stockCount === null ? 'In stock' : `${stockCount} units`}
                </p>
              </div>
            </div>
          ) : null}

          {activeTab === 'reviews' ? (
            <div className="space-y-6 rounded-[1.5rem] border border-[var(--color-border)] bg-white p-6 shadow-[0_12px_32px_rgba(24,35,30,0.05)]">
              <div className="flex items-center gap-3">
                <StarRating value={4.8} />
                <p className="text-xl font-semibold text-[var(--color-heading)]">4.8 average from 128 customer reviews</p>
              </div>
              <p className="mt-4 text-[16px] leading-8 text-[var(--color-copy)]">
                Shoppers consistently praise the product quality, pricing clarity, and reliable overall experience on the storefront.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default ProductDetailsPage
