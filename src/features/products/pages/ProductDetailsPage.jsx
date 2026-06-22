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

function TruckIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5h11v8H3zM14 10h3.3l2.7 2.8v2.7H14z" />
      <circle cx="7.5" cy="18" r="1.5" />
      <circle cx="17.5" cy="18" r="1.5" />
    </svg>
  )
}

function ShieldIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5 5.5 6v5.3c0 4.1 2.6 7.8 6.5 9.2 3.9-1.4 6.5-5.1 6.5-9.2V6L12 3.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.5 12 1.7 1.7 3.3-3.4" />
    </svg>
  )
}

function HeadsetIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 13a7.5 7.5 0 1 1 15 0v4a1.5 1.5 0 0 1-1.5 1.5H16V13h3.5M8 18.5H6A1.5 1.5 0 0 1 4.5 17v-4H8v5.5Z" />
    </svg>
  )
}

function ReturnIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 10.5 7 7m0 0 3.5 3.5M7 7v7.2a5.3 5.3 0 0 0 9 3.7l1-1" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.5 13.5 17 17m0 0-3.5-3.5M17 17V9.8a5.3 5.3 0 0 0-9-3.7l-1 1" />
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
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [activeColor, setActiveColor] = useState(0)
  const [activeTab, setActiveTab] = useState('details')
  const galleryImages = state.product?.image
    ? [state.product.image, state.product.image, state.product.image]
    : ['', '', '']

  useEffect(() => {
    let isMounted = true

    async function loadProduct() {
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

  useEffect(() => {
    setButtonLabel('Add to Cart')
    setQuantity(1)
    setActiveImageIndex(0)
    setActiveColor(0)
    setActiveTab('details')
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
  const stockCount = product.stockQuantity
  const isInStock = stockCount > 0
  const discountAmount = product.originalPrice && product.rawPrice > 0
    ? Math.max(0, Math.round(((Number(product.originalPrice.replace(/[^\d.]/g, '')) || product.rawPrice) - product.rawPrice) * 100) / 100)
    : 0

  const colorOptions = [
    { name: 'Midnight', value: '#1f2937' },
    { name: 'Cloud', value: '#e5e7eb' },
    { name: 'Royal', value: '#27479d' },
  ]

  const benefitCards = [
    {
      title: 'Free Shipping',
      subtitle: 'On orders over BDT 500',
      icon: TruckIcon,
    },
    {
      title: '1 Year Warranty',
      subtitle: 'Full coverage guaranteed',
      icon: ShieldIcon,
    },
    {
      title: '30 Days Return',
      subtitle: 'No questions asked',
      icon: ReturnIcon,
    },
    {
      title: '24/7 Support',
      subtitle: 'Dedicated help desk',
      icon: HeadsetIcon,
    },
  ]

  const detailParagraphs = splitDescription(product.description)
  const tabItems = [
    { id: 'details', label: 'Product Details' },
    { id: 'specs', label: 'Specifications' },
    { id: 'reviews', label: `Customer Reviews (${128})` },
  ]

  function handleAddToCart() {
    if (!isInStock) {
      return
    }

    for (let count = 0; count < quantity; count += 1) {
      addItem(product)
    }

    setButtonLabel('Added to Cart')
  }

  function changeQuantity(nextQuantity) {
    if (!isInStock) {
      return
    }

    setQuantity(Math.max(1, Math.min(stockCount, nextQuantity)))
  }

  return (
    <section className="mx-auto max-w-[1180px] px-4 py-8 md:px-6 lg:py-10">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[var(--color-copy-soft)]">
        <Link to="/" className="transition hover:text-[var(--color-heading)]">
          Home
        </Link>
        <span>/</span>
        <span>{product.category}</span>
        {product.subcategory ? (
          <>
            <span>/</span>
            <span>{product.subcategory}</span>
          </>
        ) : null}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_1fr]">
        <div className="grid gap-6 md:grid-cols-[80px_minmax(0,1fr)]">
          <div className="order-2 flex gap-4 md:order-1 md:flex-col">
            {galleryImages.map((image, index) => (
              <button
                key={`${image || 'empty'}-${index}`}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                className={`flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-[1.1rem] border bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)] transition ${activeImageIndex === index ? 'border-[#2f66e0] ring-2 ring-[#2f66e0]/20' : 'border-[#edf1f7] hover:border-[#cdd7ea]'}`}
              >
                {image ? (
                  <img src={image} alt={`${product.name} preview ${index + 1}`} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-[#f4f7fb]" />
                )}
              </button>
            ))}
          </div>

          <div className="order-1 rounded-[2rem] border border-[#e8edf5] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:order-2">
            <div className="flex justify-end">
              {product.discountType && product.discountValue > 0 ? (
                <span className="inline-flex h-14 w-14 flex-col items-center justify-center rounded-full bg-[#ff5d54] text-center text-[11px] font-bold leading-[1.05] text-white shadow-[0_10px_24px_rgba(255,93,84,0.25)]">
                  {product.discountType === 'percentage' ? `${product.discountValue}%` : 'Save'}
                  <span className="text-[9px] font-semibold uppercase tracking-[0.08em]">Off</span>
                </span>
              ) : null}
            </div>

            {galleryImages[activeImageIndex] ? (
              <img
                src={galleryImages[activeImageIndex]}
                alt={product.name}
                className="mx-auto mt-10 h-[22rem] w-full max-w-[26rem] object-contain"
              />
            ) : (
              <div className="mx-auto mt-10 h-[22rem] w-full max-w-[26rem] rounded-[1.5rem] bg-[#f5f7fb]" />
            )}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-[#dff7e7] px-3 py-1 font-medium text-[#178b47]">
              New Arrival
            </span>
            <span className="flex items-center gap-1 text-[var(--color-copy-soft)]">
              <ShieldIcon className="h-4 w-4 text-[#2f66e0]" />
              Top Rated
            </span>
          </div>

          <h1 className="mt-3 text-[2.7rem] leading-[1.05] font-bold tracking-tight text-[#182235]">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-3">
              <StarRating value={4.8} />
              <span className="text-lg font-medium text-[#2f66e0]">4.8 (128 reviews)</span>
            </div>
            <span className="text-[#d4dbe6]">|</span>
            <span className="text-lg font-medium text-[#19a857]">
              {isInStock ? `In Stock (${stockCount})` : 'Out of Stock'}
            </span>
          </div>

          <div className="mt-7 rounded-[1.35rem] border border-[#e7edf6] bg-white px-5 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex flex-wrap items-end gap-3">
              <p className="text-[2.2rem] leading-none font-bold tracking-tight text-[#2f66e0]">
                {product.price}
              </p>
              {product.originalPrice ? (
                <p className="pb-1 text-[1.15rem] font-medium text-[#97a1b1] line-through">
                  {product.originalPrice}
                </p>
              ) : null}
              {discountAmount > 0 ? (
                <p className="pb-1 text-sm font-semibold text-[#19a857]">
                  You save BDT {discountAmount.toFixed(2)}
                </p>
              ) : null}
            </div>
          </div>

          <p className="mt-7 text-[15px] leading-9 text-[#556275]">
            {product.description}
          </p>

          <div className="mt-8 border-t border-[#e7edf6] pt-7">
            <p className="text-base font-semibold text-[#202939]">Color</p>
            <div className="mt-4 flex items-center gap-3">
              {colorOptions.map((color, index) => (
                <button
                  key={color.name}
                  type="button"
                  aria-label={`Select ${color.name} color`}
                  onClick={() => setActiveColor(index)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${activeColor === index ? 'border-[#2f66e0]' : 'border-transparent'}`}
                >
                  <span className="h-9 w-9 rounded-full border border-black/5" style={{ backgroundColor: color.value }} />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <div className="flex h-14 items-center rounded-[1rem] border border-[#d8e1ef] bg-white px-2 shadow-[0_8px_22px_rgba(15,23,42,0.05)]">
              <button
                type="button"
                onClick={() => changeQuantity(quantity - 1)}
                className="flex h-10 w-10 items-center justify-center text-2xl text-[#66758a]"
              >
                -
              </button>
              <span className="min-w-12 text-center text-xl font-semibold text-[#182235]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => changeQuantity(quantity + 1)}
                className="flex h-10 w-10 items-center justify-center text-2xl text-[#66758a]"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="inline-flex h-14 flex-1 items-center justify-center gap-3 rounded-[1rem] bg-[#2f66e0] px-6 text-xl font-semibold text-white shadow-[0_14px_32px_rgba(47,102,224,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
            >
              <CartIcon className="h-6 w-6" />
              {buttonLabel}
            </button>

            <button
              type="button"
              aria-label="Save item"
              className="inline-flex h-14 w-14 items-center justify-center rounded-[1rem] border border-[#d8e1ef] bg-white text-[#7d8999] shadow-[0_8px_22px_rgba(15,23,42,0.05)] transition hover:text-[#2f66e0]"
            >
              <HeartIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-4 text-sm text-[var(--color-copy-soft)]">
            {quantityInCart > 0
              ? `${quantityInCart} item${quantityInCart > 1 ? 's' : ''} already in your cart.`
              : `SKU: ${product.sku}`}
          </div>

          <div className="mt-8 grid gap-4 border-t border-[#e7edf6] pt-7 sm:grid-cols-2">
            {benefitCards.map(({ title, subtitle, icon: Icon }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#eff5ff] text-[#2f66e0]">
                  <Icon />
                </div>
                <div>
                  <h2 className="text-[1.05rem] font-semibold text-[#1f2937]">{title}</h2>
                  <p className="mt-0.5 text-[15px] text-[#6d7887]">{subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-14">
        <div className="flex flex-wrap items-center gap-8 border-b border-[#dfe6f0]">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 pb-4 text-[1.05rem] font-medium transition ${activeTab === tab.id ? 'border-[#2f66e0] text-[#2f66e0]' : 'border-transparent text-[#6d7887]'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pt-9">
          {activeTab === 'details' ? (
            <div className="space-y-7 text-[#556275]">
              <div>
                <h2 className="text-[2rem] font-bold text-[#1f2937]">Elevate Your {product.category} Experience</h2>
                <div className="mt-5 space-y-4 text-[16px] leading-8">
                  {detailParagraphs.length ? (
                    detailParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
                  ) : (
                    <p>This product is designed to balance reliable performance, polished presentation, and everyday comfort.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-[1.65rem] font-bold text-[#1f2937]">Key Features:</h3>
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
            <div className="grid gap-4 rounded-[1.5rem] border border-[#e5ebf4] bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.05)] sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#8692a3]">Category</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2937]">{product.category}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#8692a3]">Subcategory</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2937]">{product.subcategory || 'General'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#8692a3]">SKU</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2937]">{product.sku}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#8692a3]">Available Stock</p>
                <p className="mt-2 text-lg font-semibold text-[#1f2937]">{stockCount} units</p>
              </div>
            </div>
          ) : null}

          {activeTab === 'reviews' ? (
            <div className="rounded-[1.5rem] border border-[#e5ebf4] bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-3">
                <StarRating value={4.8} />
                <p className="text-xl font-semibold text-[#1f2937]">4.8 average from 128 customer reviews</p>
              </div>
              <p className="mt-4 text-[16px] leading-8 text-[#556275]">
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
