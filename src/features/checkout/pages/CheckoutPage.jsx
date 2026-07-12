import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../../../shared/lib/api/apiClient'
import { useAuth } from '../../auth/context/AuthContext'
import { useCart } from '../../cart/context/CartContext'

const MY_CART_ENDPOINT = import.meta.env.VITE_MY_CART_ENDPOINT || 'users/mycart'
const APPLY_COUPON_ENDPOINT = import.meta.env.VITE_APPLY_COUPON_ENDPOINT || 'users/applycoupon'
const ORDER_ENDPOINT = import.meta.env.VITE_ORDER_ENDPOINT || 'users/order'
const IMAGE_BASE_URL = (import.meta.env.VITE_IMAGE_URL || '')
  .replaceAll('"', '')
  .replace(/\s+/g, '')

const deliverySlots = [
  '08:00 AM - 11:00 AM',
  '11:00 AM - 02:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
]

const shipmentOptions = [
  { id: 'flat', label: 'Flat Rate Shipment', amount: 80 },
  { id: 'free', label: 'Free Shipment', amount: 0 },
]

const addressTypes = ['Home Address', 'Office Address', 'Others']

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

  const normalizedBase = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL : `${IMAGE_BASE_URL}/`
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

function normalizeCartItem(item, index) {
  const rawPrice = Number(item?.price || 0)

  return {
    id: item?.id || `checkout-item-${index + 1}`,
    productId: item?.product_id || '',
    name: item?.name || `Product ${index + 1}`,
    quantity: Number(item?.quantity || 0),
    rawPrice,
    price: formatCurrency(rawPrice),
    image: buildImageUrl(item?.image || item?.image_url || item?.primary_image || ''),
  }
}

function FieldShell({ label, error = '', children }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--color-heading)]">
      <span className="text-[13px]">{label}</span>
      {children}
      {error ? <span className="text-[12px] font-medium text-[#b91c1c]">{error}</span> : null}
    </label>
  )
}

function inputClass(hasError) {
  return `min-h-14 rounded-full border bg-white px-5 text-sm text-[var(--color-heading)] outline-none transition placeholder:text-[#8ca0ba] focus:ring-4 ${
    hasError
      ? 'border-[#dc2626] focus:border-[#dc2626] focus:ring-[#dc2626]/10'
      : 'border-[#d9e2ef] focus:border-[#0f8b86] focus:ring-[#0f8b86]/10'
  }`
}

function CheckoutPage() {
  const { isAuthenticated, user } = useAuth()
  const { items: fallbackItems } = useCart()
  const [cartState, setCartState] = useState({
    isLoading: true,
    error: '',
    items: [],
  })
  const [couponCode, setCouponCode] = useState('')
  const [couponState, setCouponState] = useState({
    isApplying: false,
    error: '',
    success: '',
    couponAmount: 0,
    grandTotal: 0,
  })
  const [formState, setFormState] = useState({
    firstName: user?.name?.split(' ')?.[0] || '',
    lastName: user?.name?.split(' ')?.slice(1).join(' ') || '',
    phone: user?.phone || '',
    email: user?.email || '',
    country: user?.country || 'Bangladesh',
    city: user?.city || '',
    state: user?.state || '',
    zip: user?.postcode || '',
    address: user?.address1 || '',
    apartment: user?.address2 || '',
    deliveryTime: deliverySlots[0],
    shipmentType: shipmentOptions[0].id,
    addressType: addressTypes[0],
    paymentMethod: 'ssl',
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadCart() {
      try {
        const response = await apiClient.get(MY_CART_ENDPOINT)
        const items = extractArray(response.data).map(normalizeCartItem)

        if (!isMounted) {
          return
        }

        setCartState({
          isLoading: false,
          error: '',
          items,
        })
      } catch {
        if (!isMounted) {
          return
        }

        setCartState({
          isLoading: false,
          error: 'The live cart could not be loaded. Showing local cart details instead.',
          items: fallbackItems.map((item, index) => ({
            id: item.cartItemId || item.id || `fallback-item-${index + 1}`,
            productId: item.productId || item.id || '',
            name: item.name,
            quantity: Number(item.quantity || 0),
            rawPrice: Number(item.rawPrice || 0),
            price: item.price || formatCurrency(item.rawPrice),
            image: buildImageUrl(item.image || item.image_url || ''),
          })),
        })
      }
    }

    loadCart()

    return () => {
      isMounted = false
    }
  }, [fallbackItems])

  const items = cartState.items

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + Number(item.rawPrice || 0) * Number(item.quantity || 0), 0),
    [items],
  )

  if (cartState.isLoading) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 flex min-h-[60vh] items-center justify-center">
        <div className="w-full rounded-[2rem] border border-[#d8e1ee] bg-white p-10 text-center shadow-[0_16px_40px_rgba(29,42,58,0.06)]">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-[#0f8b86]/10 text-[#0f8b86]">
            <svg className="h-10 w-10 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#1d2433]">Loading checkout details...</h1>
        </div>
      </section>
    )
  }

  if (!items.length) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 flex min-h-[60vh] items-center justify-center">
        <div className="w-full rounded-[2rem] border border-[#d8e1ee] bg-white p-10 text-center shadow-[0_16px_40px_rgba(29,42,58,0.06)]">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-[#0f8b86]/10 text-[#0f8b86]">
            <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f8b86]">
            Checkout
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#1d2433]">
            Your checkout is empty
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#67768c]">
            There are no items ready for checkout. Please add products to your cart before proceeding.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-[#0f8b86] px-8 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_24px_rgba(15,139,134,0.18)] transition hover:bg-[#0b7672]"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    )
  }
  const selectedShipment = shipmentOptions.find((option) => option.id === formState.shipmentType) || shipmentOptions[0]
  const shipmentAmount = selectedShipment.amount
  const vatAmount = 0
  const discountAmount = Number(couponState.couponAmount || 0)
  const totalAmount = Math.max(0, subtotal + shipmentAmount + vatAmount - discountAmount)

  function handleInputChange(event) {
    const { name, value } = event.target
    setFormState((current) => ({
      ...current,
      [name]: value,
    }))
    setFormErrors((current) => ({
      ...current,
      [name]: '',
    }))
    setSaveMessage('')
  }

  function validateForm() {
    const nextErrors = {}

    if (!formState.firstName.trim()) nextErrors.firstName = 'First name is required.'
    if (!formState.lastName.trim()) nextErrors.lastName = 'Last name is required.'
    if (!formState.phone.trim()) nextErrors.phone = 'Phone number is required.'
    if (!formState.country.trim()) nextErrors.country = 'Country is required.'
    if (!formState.city.trim()) nextErrors.city = 'City is required.'
    if (!formState.state.trim()) nextErrors.state = 'State is required.'
    if (!formState.zip.trim()) nextErrors.zip = 'Zip code is required.'
    if (!formState.address.trim()) nextErrors.address = 'Shipping address is required.'

    setFormErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleApplyCoupon() {
    if (!couponCode.trim()) {
      setCouponState((current) => ({
        ...current,
        error: 'Enter a coupon code first.',
        success: '',
      }))
      return
    }

    setCouponState((current) => ({
      ...current,
      isApplying: true,
      error: '',
      success: '',
    }))

    try {
      const response = await apiClient.get(`${APPLY_COUPON_ENDPOINT}/${encodeURIComponent(couponCode.trim())}`)
      const data = response.data?.data || {}
      const couponAmount = Number(data.couponAmount || 0)
      const grandTotal = Number(data.grandTotal || subtotal)

      setCouponState({
        isApplying: false,
        error: couponAmount > 0 ? '' : response.data?.message || 'Coupon could not be applied.',
        success: couponAmount > 0 ? response.data?.message || 'Coupon applied successfully.' : '',
        couponAmount,
        grandTotal,
      })
    } catch {
      setCouponState((current) => ({
        ...current,
        isApplying: false,
        error: 'Coupon could not be applied right now.',
        success: '',
      }))
    }
  }

  async function handlePlaceOrder(event) {
    event.preventDefault()

    if (!validateForm() || !items.length) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await apiClient.post(ORDER_ENDPOINT, {
        payment_method: formState.paymentMethod,
        totalAmount: couponState.couponAmount > 0 ? couponState.grandTotal + shipmentAmount : totalAmount,
        products: items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          price: item.rawPrice,
        })),
        userInformation: {
          name: `${formState.firstName} ${formState.lastName}`.trim(),
          address: formState.address,
          apartment: formState.apartment,
          city: formState.city,
          state: formState.state,
          zip: formState.zip,
          phone: formState.phone,
          country: formState.country,
          deliveryTime: formState.deliveryTime,
          shipmentType: formState.shipmentType,
          addressType: formState.addressType,
          email: formState.email,
        },
      })

      if (response.data?.status === 'success' && response.data?.url) {
        window.location.href = response.data.url
        return
      }

      setFormErrors((current) => ({
        ...current,
        submit: response.data?.message || 'Checkout could not be started.',
      }))
    } catch {
      setFormErrors((current) => ({
        ...current,
        submit: 'Checkout could not be started right now.',
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleSaveDetails() {
    if (!validateForm()) {
      return
    }

    setSaveMessage('Shipping details saved for this checkout session.')
  }

  function handleResetForm() {
    setFormState((current) => ({
      ...current,
      firstName: '',
      lastName: '',
      phone: '',
      email: user?.email || '',
      country: 'Bangladesh',
      city: '',
      state: '',
      zip: '',
      address: '',
      apartment: '',
      deliveryTime: deliverySlots[0],
      shipmentType: shipmentOptions[0].id,
      addressType: addressTypes[0],
    }))
    setFormErrors({})
    setSaveMessage('')
  }

  return (
    <section className="mx-auto max-w-full px-1 py-8 md:px-6 lg:py-10">
      <div className="mb-10 flex flex-wrap items-center gap-3 text-sm text-[#93a0b5]">
        <Link to="/" className="inline-flex items-center gap-2 font-medium text-[#14213d] transition hover:text-[#0f8b86]">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5.5v-6h-5V21H4a1 1 0 0 1-1-1v-9.5Z" />
          </svg>
          Home
        </Link>
        <span>•</span>
        <span className="font-medium">Checkout</span>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid gap-6 xl:grid-cols-[1.28fr_0.62fr]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-[2rem] border border-[#d8e1ee] bg-white shadow-[0_16px_40px_rgba(29,42,58,0.06)]">
            <div className="border-b border-[#edf1f7] bg-[linear-gradient(180deg,_#f7f9fc,_#f2f5f9)] px-4 sm:px-6 py-4 sm:py-5">
              <h2 className="text-xl sm:text-[1.9rem] font-black tracking-[-0.04em] text-[#1d2433]">
                {isAuthenticated ? 'Account information' : 'Already have an account ?'}
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              {isAuthenticated ? (
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f8b86]">Signed in</p>
                    <h3 className="mt-2 text-2xl font-black text-[#1d2433]">{user?.name || 'Customer account'}</h3>
                    <p className="mt-1 text-[15px] text-[#67768c]">{user?.email}</p>
                  </div>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-full bg-[#0f8b86] px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_24px_rgba(15,139,134,0.18)] transition hover:bg-[#0b7672]"
                  >
                    Manage account
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                  <input className={inputClass(false)} placeholder="User Name" disabled />
                  <input className={inputClass(false)} placeholder="Password" type="password" disabled />
                  <Link
                    to="/login"
                    className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#0f8b86] px-10 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_24px_rgba(15,139,134,0.18)] transition hover:bg-[#0b7672]"
                  >
                    Login
                  </Link>
                </div>
              )}

              {!isAuthenticated ? (
                <p className="mt-6 text-[15px] font-semibold text-[#3a475b]">
                  Don&apos;t have an account?{' '}
                  <Link to="/login" className="text-[#0f8b86] hover:text-[#0b7672]">
                    Create Account
                  </Link>
                </p>
              ) : null}
            </div>
          </section>

          <section className="overflow-hidden rounded-[2rem] border border-[#d8e1ee] bg-white shadow-[0_16px_40px_rgba(29,42,58,0.06)]">
            <div className="border-b border-[#edf1f7] bg-[linear-gradient(180deg,_#f7f9fc,_#f2f5f9)] px-4 sm:px-6 py-4 sm:py-5">
              <h2 className="text-xl sm:text-[1.9rem] font-black tracking-[-0.04em] text-[#1d2433]">Shipping Address</h2>
            </div>

            <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <FieldShell label="First Name" error={formErrors.firstName}>
                  <input
                    className={inputClass(Boolean(formErrors.firstName))}
                    name="firstName"
                    value={formState.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                  />
                </FieldShell>
                <FieldShell label="Last Name" error={formErrors.lastName}>
                  <input
                    className={inputClass(Boolean(formErrors.lastName))}
                    name="lastName"
                    value={formState.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                  />
                </FieldShell>
                <FieldShell label="Phone Number" error={formErrors.phone}>
                  <input
                    className={inputClass(Boolean(formErrors.phone))}
                    name="phone"
                    value={formState.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                  />
                </FieldShell>
                <FieldShell label="Email Address (Optional)">
                  <input
                    className={inputClass(false)}
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                  />
                </FieldShell>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-[1.1fr_1.1fr_1fr_1fr]">
                <FieldShell label="Country / Region" error={formErrors.country}>
                  <select
                    className={inputClass(Boolean(formErrors.country))}
                    name="country"
                    value={formState.country}
                    onChange={handleInputChange}
                  >
                    <option>Bangladesh</option>
                    <option>India</option>
                    <option>Pakistan</option>
                  </select>
                </FieldShell>
                <FieldShell label="City" error={formErrors.city}>
                  <input className={inputClass(Boolean(formErrors.city))} name="city" value={formState.city} onChange={handleInputChange} placeholder="City" />
                </FieldShell>
                <FieldShell label="State" error={formErrors.state}>
                  <input className={inputClass(Boolean(formErrors.state))} name="state" value={formState.state} onChange={handleInputChange} placeholder="State" />
                </FieldShell>
                <FieldShell label="Zip Code" error={formErrors.zip}>
                  <input className={inputClass(Boolean(formErrors.zip))} name="zip" value={formState.zip} onChange={handleInputChange} placeholder="Zip Code" />
                </FieldShell>
              </div>

              <FieldShell label="Street Address" error={formErrors.address}>
                <textarea
                  className={`min-h-36 rounded-[1.7rem] border bg-white px-5 py-4 text-sm text-[var(--color-heading)] outline-none transition placeholder:text-[#8ca0ba] focus:ring-4 ${
                    formErrors.address
                      ? 'border-[#dc2626] focus:border-[#dc2626] focus:ring-[#dc2626]/10'
                      : 'border-[#d9e2ef] focus:border-[#0f8b86] focus:ring-[#0f8b86]/10'
                  }`}
                  name="address"
                  value={formState.address}
                  onChange={handleInputChange}
                  placeholder="House no, road, area"
                />
              </FieldShell>

              <FieldShell label="Apartments, suit, unit, etc (Optional)">
                <textarea
                  className="min-h-32 rounded-[1.7rem] border border-[#d9e2ef] bg-white px-5 py-4 text-sm text-[var(--color-heading)] outline-none transition placeholder:text-[#8ca0ba] focus:border-[#0f8b86] focus:ring-4 focus:ring-[#0f8b86]/10"
                  name="apartment"
                  value={formState.apartment}
                  onChange={handleInputChange}
                  placeholder="Apartments, suit, unit, etc (Optional)"
                />
              </FieldShell>

              <div className="space-y-4 border-t border-[#edf1f7] pt-8">
                <h3 className="text-[1.2rem] font-black text-[#42506a]">Delivery Time</h3>
                <div className="flex flex-wrap gap-3">
                  {deliverySlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFormState((current) => ({ ...current, deliveryTime: slot }))}
                      className={`rounded-full border px-4 py-3 text-sm font-semibold transition ${
                        formState.deliveryTime === slot
                          ? 'border-[#0f8b86] bg-[#0f8b86] text-white shadow-[0_10px_20px_rgba(15,139,134,0.14)]'
                          : 'border-[#d9e2ef] bg-white text-[#42506a] hover:border-[#0f8b86]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t border-[#edf1f7] pt-8">
                <h3 className="text-[1.2rem] font-black text-[#42506a]">Shipment Type</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  {shipmentOptions.map((option) => (
                    <label key={option.id} className="flex items-center gap-3 text-[15px] font-semibold text-[#1d2433]">
                      <input
                        type="radio"
                        name="shipmentType"
                        value={option.id}
                        checked={formState.shipmentType === option.id}
                        onChange={handleInputChange}
                        className="h-5 w-5 border-[#d6e0ee] text-[#0f8b86] focus:ring-[#0f8b86]"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t border-[#edf1f7] pt-8">
                <h3 className="text-[1.2rem] font-black text-[#42506a]">Address Type</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  {addressTypes.map((type) => (
                    <label key={type} className="flex items-center gap-3 text-[15px] font-semibold text-[#1d2433]">
                      <input
                        type="radio"
                        name="addressType"
                        value={type}
                        checked={formState.addressType === type}
                        onChange={handleInputChange}
                        className="h-5 w-5 border-[#d6e0ee] text-[#0f8b86] focus:ring-[#0f8b86]"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 border-t border-[#edf1f7] pt-6">
                {saveMessage ? <p className="text-sm font-semibold text-[#0f8b86] sm:mr-auto text-center sm:text-left">{saveMessage}</p> : null}
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="inline-flex w-full sm:w-auto min-w-32 items-center justify-center rounded-full border border-[#d9e2ef] px-6 py-3 text-sm font-bold text-[#37445a] transition hover:border-[#0f8b86] hover:text-[#0f8b86]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveDetails}
                  className="inline-flex w-full sm:w-auto min-w-32 items-center justify-center rounded-full bg-[#0f8b86] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_24px_rgba(15,139,134,0.18)] transition hover:bg-[#0b7672]"
                >
                  Save
                </button>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[2rem] border border-[#d8e1ee] bg-white shadow-[0_16px_40px_rgba(29,42,58,0.06)]">
            <div className="border-b border-[#edf1f7] bg-[linear-gradient(180deg,_#f7f9fc,_#f2f5f9)] px-4 sm:px-6 py-4 sm:py-5">
              <h2 className="text-xl sm:text-[1.9rem] font-black tracking-[-0.04em] text-[#1d2433]">Payment</h2>
            </div>
            <div className="p-4 sm:p-6">
              <label className="block rounded-[1.7rem] border border-[#0f8b86] bg-[#f7fbfb] p-4 sm:p-5 shadow-[0_10px_24px_rgba(15,139,134,0.06)]">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ssl"
                    checked={formState.paymentMethod === 'ssl'}
                    onChange={handleInputChange}
                    className="h-5 w-5 border-[#d6e0ee] text-[#0f8b86] focus:ring-[#0f8b86]"
                  />
                  <span className="text-lg font-black text-[#1d2433]">SSLCommerz Secure Payment</span>
                </div>
                <p className="mt-4 max-w-4xl text-[15px] leading-8 text-[#42506a]">
                  Complete your order through the secure SSLCommerz payment gateway. You&apos;ll be redirected after checkout to finish the payment.
                </p>
              </label>

              {formErrors.submit ? (
                <div className="mt-5 rounded-[1.3rem] border border-[#f3c5c5] bg-[#fff6f6] px-4 py-3 text-sm font-medium text-[#b42318]">
                  {formErrors.submit}
                </div>
              ) : null}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[2rem] border border-[#d8e1ee] bg-white p-4 sm:p-6 shadow-[0_16px_40px_rgba(29,42,58,0.06)]">
            <h2 className="text-xl sm:text-3xl font-black tracking-[-0.04em] text-[#1d2433]">Cart Items</h2>
            {cartState.error ? (
              <div className="mt-4 rounded-[1.2rem] border border-[#f7d8a6] bg-[#fff8e8] px-4 py-3 text-sm font-medium text-[#9a6700]">
                {cartState.error}
              </div>
            ) : null}

            <div className="mt-6 overflow-hidden rounded-[1.7rem] border border-[#dbe3ee]">
              {cartState.isLoading ? (
                <div className="p-6 text-sm font-medium text-[#67768c]">Loading cart items...</div>
              ) : (
                items.map((item, index) => (
                  <article
                    key={`${item.id}-${index}`}
                    className={`flex items-center gap-4 bg-white px-4 py-4 ${index !== items.length - 1 ? 'border-b border-[#edf1f7]' : ''}`}
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[1.2rem] bg-[#f5f7fb]">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-contain p-2" />
                      ) : (
                        <div className="h-full w-full bg-[#e9edf3]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-1 text-[1.15rem] font-black text-[#1d2433]">{item.name}</h3>
                      <p className="mt-1 text-[15px] text-[#67768c]">{item.quantity} x {formatCurrency(item.rawPrice)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-[#0f8b86]">{formatCurrency(item.rawPrice * item.quantity)}</p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-[#d8e1ee] bg-white p-4 sm:p-6 shadow-[0_16px_40px_rgba(29,42,58,0.06)]">
            <h2 className="text-xl sm:text-3xl font-black tracking-[-0.04em] text-[#1d2433]">Apply Coupon</h2>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="Enter coupon code"
                className="min-h-14 flex-1 rounded-full border border-[#d9e2ef] bg-white px-5 text-sm text-[var(--color-heading)] outline-none transition placeholder:text-[#8ca0ba] focus:border-[#0f8b86] focus:ring-4 focus:ring-[#0f8b86]/10"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={couponState.isApplying}
                className="inline-flex min-w-32 items-center justify-center rounded-full bg-[#0f8b86] px-6 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_24px_rgba(15,139,134,0.18)] transition hover:bg-[#0b7672] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {couponState.isApplying ? 'Applying...' : 'Apply'}
              </button>
            </div>
            {couponState.error ? <p className="mt-3 text-sm font-medium text-[#b42318]">{couponState.error}</p> : null}
            {couponState.success ? <p className="mt-3 text-sm font-medium text-[#0f8b86]">{couponState.success}</p> : null}
          </section>

          <section className="rounded-[2rem] border border-[#d8e1ee] bg-[linear-gradient(180deg,_#f8fafc,_#f4f7fb)] p-4 sm:p-6 shadow-[0_16px_40px_rgba(29,42,58,0.06)]">
            <h2 className="text-xl sm:text-3xl font-black tracking-[-0.04em] text-[#1d2433]">Order Summary</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-[17px] text-[#4d5c72]">
                <span>Sub-Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[17px] text-[#4d5c72]">
                <span>VAT</span>
                <span>{formatCurrency(vatAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-[17px] text-[#4d5c72]">
                <span>Discount</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-[17px] text-[#4d5c72]">
                <span>Shipment</span>
                <span>{formatCurrency(shipmentAmount)}</span>
              </div>
              <div className="border-t border-[#dbe3ee] pt-4 text-xl font-black text-[#1d2433]">
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cartState.isLoading || !items.length}
              className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#0f8b86] px-5 text-sm font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_16px_28px_rgba(15,139,134,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0b7672] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Redirecting...' : 'Place Order'}
            </button>
          </section>
        </aside>
      </form>
    </section>
  )
}

export default CheckoutPage
