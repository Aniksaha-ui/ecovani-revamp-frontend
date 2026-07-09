import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import apiClient from '../../../shared/lib/api/apiClient'

const MY_CART_ENDPOINT = import.meta.env.VITE_MY_CART_ENDPOINT || 'users/mycart'
const UPDATE_CART_ENDPOINT = import.meta.env.VITE_UPDATE_CART_ENDPOINT || 'users/update/cart'
const REMOVE_CART_ENDPOINT = import.meta.env.VITE_REMOVE_CART_ENDPOINT || 'users/remove/cart'
const IMAGE_BASE_URL = (import.meta.env.VITE_IMAGE_URL || '')
  .replaceAll('"', '')
  .replace(/\s+/g, '')

function extractArray(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data
  }

  if (Array.isArray(payload?.result)) {
    return payload.result
  }

  return []
}

function normalizeCartItem(item, index) {
  const rawPrice = Number(item?.price || item?.product?.price || 0)

  return {
    id: item?.id || `cart-item-${index + 1}`,
    productId: item?.product_id || item?.product?.id || '',
    name: item?.name || item?.product?.name || `Product ${index + 1}`,
    price: formatCurrency(rawPrice),
    rawPrice,
    image: buildImageUrl(
      item?.image ||
      item?.image_url ||
      item?.primary_image ||
      item?.product?.image_url ||
      item?.product?.image ||
      item?.product?.primary_image ||
      '',
    ),
    category: item?.category || item?.product?.category_name || item?.product?.category?.name || 'Store item',
    quantity: Number(item?.quantity || 0),
    cartId: item?.cart_id || '',
  }
}

function buildImageUrl(path) {
  if (!path) {
    return ''
  }

  if (/^https?:\/\//i.test(path) || String(path).startsWith('/default-')) {
    return path
  }

  if (!IMAGE_BASE_URL) {
    return `/${String(path).replace(/^\/+/, '')}`
  }

  const normalizedBase = IMAGE_BASE_URL.endsWith('/')
    ? IMAGE_BASE_URL
    : `${IMAGE_BASE_URL}/`

  return `${normalizedBase}${String(path).replace(/^\/+/, '')}`
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value || 0))
}

function CartPage() {
  const { items: fallbackItems, itemCount: fallbackItemCount, subtotal: fallbackSubtotal, updateItemQuantity, removeItem, clearCart } = useCart()
  const [state, setState] = useState({
    isLoading: true,
    error: '',
    items: [],
    usingFallback: false,
    pendingItemId: null,
    isClearing: false,
  })

  useEffect(() => {
    let isMounted = true

    async function loadCart() {
      try {
        const response = await apiClient.get(MY_CART_ENDPOINT)
        const apiItems = extractArray(response.data).map(normalizeCartItem)

        if (!isMounted) {
          return
        }

        setState({
          isLoading: false,
          error: '',
          items: apiItems,
          usingFallback: false,
          pendingItemId: null,
          isClearing: false,
        })
      } catch {
        if (!isMounted) {
          return
        }

        setState({
          isLoading: false,
          error: 'The live cart could not be loaded, so local cart data is being shown.',
          items: fallbackItems,
          usingFallback: true,
          pendingItemId: null,
          isClearing: false,
        })
      }
    }

    loadCart()

    return () => {
      isMounted = false
    }
  }, [fallbackItems])

  const items = state.usingFallback ? fallbackItems : state.items
  const itemCount = state.usingFallback
    ? fallbackItemCount
    : items.reduce((total, item) => total + Number(item.quantity || 0), 0)
  const subtotal = state.usingFallback
    ? fallbackSubtotal
    : items.reduce((total, item) => total + Number(item.rawPrice || 0) * Number(item.quantity || 0), 0)

  async function refreshLiveCart() {
    const response = await apiClient.get(MY_CART_ENDPOINT)
    const apiItems = extractArray(response.data).map(normalizeCartItem)

    setState((current) => ({
      ...current,
      error: '',
      items: apiItems,
      usingFallback: false,
      pendingItemId: null,
      isClearing: false,
    }))
  }

  async function handleQuantityChange(itemId, nextQuantity) {
    if (state.usingFallback) {
      updateItemQuantity(itemId, nextQuantity)
      return
    }

    const quantity = Math.max(1, Number(nextQuantity || 1))

    setState((current) => ({
      ...current,
      pendingItemId: itemId,
    }))

    try {
      await apiClient.post(UPDATE_CART_ENDPOINT, {
        id: itemId,
        quantity,
      })
      await refreshLiveCart()
    } catch {
      setState((current) => ({
        ...current,
        pendingItemId: null,
        error: 'The cart quantity could not be updated right now.',
      }))
    }
  }

  async function handleRemove(itemId) {
    if (state.usingFallback) {
      removeItem(itemId)
      return
    }

    setState((current) => ({
      ...current,
      pendingItemId: itemId,
    }))

    try {
      await apiClient.delete(`${REMOVE_CART_ENDPOINT}/${itemId}`)
      await refreshLiveCart()
    } catch {
      setState((current) => ({
        ...current,
        pendingItemId: null,
        error: 'The cart item could not be removed right now.',
      }))
    }
  }

  async function handleClearCart() {
    if (state.usingFallback) {
      clearCart()
      return
    }

    setState((current) => ({
      ...current,
      isClearing: true,
    }))

    try {
      await Promise.all(items.map((item) => apiClient.delete(`${REMOVE_CART_ENDPOINT}/${item.id}`)))
      await refreshLiveCart()
    } catch {
      setState((current) => ({
        ...current,
        isClearing: false,
        error: 'The cart could not be cleared right now.',
      }))
    }
  }

  if (state.isLoading) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10 md:px-6 lg:py-14">
        <div className="rounded-[2rem] border border-[var(--color-border)] bg-white/90 p-10 shadow-[0_18px_40px_rgba(29,42,58,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-copy-soft)]">
            Your cart
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[var(--color-heading)]">
            Loading your cart items...
          </h1>
        </div>
      </section>
    )
  }

  if (!items.length) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10 md:px-6 lg:py-14">
        <div className="rounded-[2rem] border border-[var(--color-border)] bg-white/90 p-10 text-center shadow-[0_18px_40px_rgba(29,42,58,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-copy-soft)]">
            Your cart
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[var(--color-heading)]">
            Your cart is empty
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-[var(--color-copy-soft)]">
            Add products from the storefront to start building your order.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#0f8b86] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_28px_rgba(15,139,134,0.2)] transition hover:-translate-y-0.5 hover:bg-[#0b7672]"
          >
            Continue shopping
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
        <span className="font-medium">Cart</span>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[2rem] border border-[var(--color-border)] bg-white/92 p-5 shadow-[0_18px_40px_rgba(29,42,58,0.08)] md:p-6">
          {state.error ? (
            <div className="mb-5 rounded-[1.3rem] border border-[#f7d8a6] bg-[#fff8e8] px-4 py-3 text-sm font-medium text-[#9a6700]">
              {state.error}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 border-b border-[var(--color-border)] pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-copy-soft)]">
                Shopping cart
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[var(--color-heading)]">
                {itemCount} item{itemCount === 1 ? '' : 's'} ready for checkout
              </h1>
            </div>
            <button
              type="button"
              onClick={handleClearCart}
              disabled={state.isClearing}
              className="inline-flex items-center justify-center rounded-full border border-[#f0c3c3] px-5 py-3 text-sm font-bold text-[#b42318] transition hover:bg-[#fff5f5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {state.isClearing ? 'Clearing...' : 'Clear cart'}
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="grid gap-4 rounded-[1.6rem] border border-[#d9e7e0] bg-[#f8fbf9] p-4 shadow-[0_10px_22px_rgba(36,54,46,0.04)] md:grid-cols-[120px_minmax(0,1fr)_auto]"
              >
                <div className="overflow-hidden rounded-[1.2rem] bg-white">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-28 w-full object-contain p-3" />
                  ) : (
                    <div className="h-28 w-full bg-[#edf2ef]" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f8b86]">
                    {item.category || 'Store item'}
                  </p>
                  <h2 className="mt-2 line-clamp-2 text-xl font-extrabold text-[var(--color-heading)]">
                    {item.name}
                  </h2>
                  <p className="mt-3 text-lg font-bold text-[var(--color-heading)]">{item.price}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="flex h-11 items-center rounded-full border border-[#d8dee9] bg-white px-3">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.id, Number(item.quantity || 1) - 1)}
                        disabled={state.pendingItemId === item.id}
                        className="flex h-8 w-8 items-center justify-center text-2xl text-[#627089] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="min-w-[44px] text-center text-lg font-semibold text-[#14213d]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.id, Number(item.quantity || 1) + 1)}
                        disabled={state.pendingItemId === item.id}
                        className="flex h-8 w-8 items-center justify-center text-2xl text-[#627089] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      disabled={state.pendingItemId === item.id}
                      className="inline-flex items-center justify-center rounded-full border border-[#f0c3c3] px-4 py-2 text-sm font-bold text-[#b42318] transition hover:bg-[#fff5f5] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {state.pendingItemId === item.id ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-3 md:items-end">
                  <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">
                    In cart
                  </span>
                  <p className="text-right text-lg font-bold text-[var(--color-heading)]">
                    {formatCurrency((item.rawPrice || 0) * Number(item.quantity || 0))}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-[2rem] border border-[var(--color-border)] bg-white/92 p-6 shadow-[0_18px_40px_rgba(29,42,58,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-copy-soft)]">
            Order summary
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[var(--color-heading)]">
            Ready to checkout
          </h2>

          <div className="mt-6 space-y-4 border-y border-dashed border-[var(--color-border)] py-5">
            <div className="flex items-center justify-between text-[15px] text-[var(--color-copy-soft)]">
              <span>Items</span>
              <span>{itemCount}</span>
            </div>
            <div className="flex items-center justify-between text-[15px] text-[var(--color-copy-soft)]">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex items-center justify-between text-xl font-extrabold text-[var(--color-heading)]">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#0f8b86] px-5 text-sm font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_16px_28px_rgba(15,139,134,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0b7672]"
          >
            Proceed to checkout
          </Link>

          <Link
            to="/"
            className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold text-[var(--color-heading)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </section>
  )
}

export default CartPage
