import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import apiClient from '../../../shared/lib/api/apiClient'
import { useAuth } from '../../auth/context/AuthContext'
import {
  ADD_CART_ENDPOINT,
  ORDER_DETAILS_ENDPOINT,
  buildImageUrl,
  extractData,
  formatCurrency,
  formatDateTime,
  formatStatusLabel,
  getOrderStatusTone,
} from '../lib/orderUtils'

function TimelineStep({ step, isLast }) {
  const completed = step.state === 'completed'
  const current = step.state === 'current'

  return (
    <div className="grid grid-cols-[88px_28px_minmax(0,1fr)] gap-4">
      <div className="pt-1 text-right text-sm font-medium text-[#6d7c92]">
        {step.date ? formatDateTime(step.date) : '---'}
      </div>
      <div className="relative flex justify-center">
        <span
          className={`relative z-10 mt-1 flex h-7 w-7 items-center justify-center rounded-full border ${
            completed || current
              ? 'border-[#0f8b86] bg-[#72d8bc] text-[#14213d]'
              : 'border-[#d8e1ee] bg-white text-transparent'
          }`}
        >
          {(completed || current) ? '✓' : '.'}
        </span>
        {!isLast ? (
          <span className={`absolute top-8 h-[calc(100%-1rem)] w-px ${completed ? 'bg-[#0f8b86]' : 'bg-[#d8e1ee]'}`} />
        ) : null}
      </div>
      <div className="pb-10">
        <h3 className="text-[30px] font-black tracking-[-0.04em] text-[#14213d]">{step.title}</h3>
        <p className="mt-2 max-w-4xl text-[16px] leading-8 text-[#5f6f84]">{step.description}</p>
      </div>
    </div>
  )
}

function OrderDetailsPage() {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const { isAuthenticated } = useAuth()
  const [state, setState] = useState({
    isLoading: true,
    error: '',
    order: null,
    isOrderingAgain: false,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      setState({
        isLoading: false,
        error: '',
        order: null,
        isOrderingAgain: false,
      })
      return
    }

    let isMounted = true

    async function loadOrder() {
      try {
        const response = await apiClient.get(`${ORDER_DETAILS_ENDPOINT}/${orderId}`)
        const order = extractData(response.data)

        if (!isMounted) {
          return
        }

        setState({
          isLoading: false,
          error: '',
          order,
          isOrderingAgain: false,
        })
      } catch {
        if (!isMounted) {
          return
        }

        setState({
          isLoading: false,
          error: 'The order details could not be loaded right now.',
          order: null,
          isOrderingAgain: false,
        })
      }
    }

    loadOrder()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, orderId])

  async function handleOrderAgain() {
    if (!state.order?.items?.length) {
      return
    }

    setState((current) => ({
      ...current,
      isOrderingAgain: true,
      error: '',
    }))

    try {
      await apiClient.post(ADD_CART_ENDPOINT, state.order.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })))
      window.location.href = '/cart'
    } catch {
      setState((current) => ({
        ...current,
        isOrderingAgain: false,
        error: 'The order items could not be added to cart right now.',
      }))
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-[2rem] border border-[#d8e1ee] bg-white px-8 py-16 text-center shadow-[0_18px_40px_rgba(29,42,58,0.06)]">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[#0f8b86]">Sign in required</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#14213d]">Please log in to view order details.</h1>
        <Link
          to="/login"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[#0f8b86] px-7 py-4 text-sm font-extrabold text-white shadow-[0_14px_28px_rgba(15,139,134,0.18)] transition hover:-translate-y-0.5"
        >
          Go to Login
        </Link>
      </div>
    )
  }

  if (state.isLoading) {
    return (
      <div className="rounded-[2rem] border border-[#d8e1ee] bg-white px-8 py-14 shadow-[0_18px_40px_rgba(29,42,58,0.06)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7b8798]">Loading order details...</p>
      </div>
    )
  }

  if (!state.order) {
    return (
      <div className="rounded-[2rem] border border-[#d8e1ee] bg-white px-8 py-16 text-center shadow-[0_18px_40px_rgba(29,42,58,0.06)]">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[#0f8b86]">Order details</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#14213d]">We couldn&apos;t find that order.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-8 text-[#5f6f84]">{state.error || 'Try going back to your order list.'}</p>
        <Link
          to="/orders"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[#0f8b86] px-7 py-4 text-sm font-extrabold text-white shadow-[0_14px_28px_rgba(15,139,134,0.18)] transition hover:-translate-y-0.5"
        >
          Back to Orders
        </Link>
      </div>
    )
  }

  const { order } = state

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-5">
        <button
          type="button"
          onClick={() => navigate('/orders')}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#d8e1ee] bg-white text-[#14213d] shadow-[0_10px_24px_rgba(29,42,58,0.06)] transition hover:border-[#0f8b86] hover:text-[#0f8b86]"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-5xl font-black tracking-[-0.05em] text-[#14213d]">
            Order ID : <span className="text-[#274463]">{order.order_number}</span>
          </h1>
          <span className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${getOrderStatusTone(order.status)}`}>
            {formatStatusLabel(order.status)}
          </span>
        </div>
      </div>

      {state.error ? (
        <div className="rounded-[1.4rem] border border-[#f3c5c5] bg-[#fff6f6] px-5 py-4 text-sm font-medium text-[#b42318]">
          {state.error}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-[2rem] border border-[#d8e1ee] bg-white shadow-[0_18px_40px_rgba(29,42,58,0.06)]">
        <div className="border-b border-[#edf1f7] bg-[linear-gradient(180deg,_#f7f9fc,_#f2f5f9)] px-6 py-5">
          <h2 className="text-[32px] font-black tracking-[-0.04em] text-[#14213d]">Timeline</h2>
        </div>
        <div className="px-6 py-8">
          {order.timeline.map((step, index) => (
            <TimelineStep key={step.key} step={step} isLast={index === order.timeline.length - 1} />
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-[#d8e1ee] bg-white shadow-[0_18px_40px_rgba(29,42,58,0.06)]">
        <div className="border-b border-[#edf1f7] bg-[linear-gradient(180deg,_#f7f9fc,_#f2f5f9)] px-6 py-5">
          <h2 className="text-[32px] font-black tracking-[-0.04em] text-[#14213d]">Shipment Address</h2>
        </div>
        <div className="space-y-5 px-6 py-7 text-[16px] text-[#14213d]">
          <p className="flex items-center gap-4">
            <span className="text-[#111827]">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="4" y="3" width="16" height="18" rx="3" />
                <circle cx="12" cy="9" r="2.5" />
                <path strokeLinecap="round" d="M7.5 18a4.5 4.5 0 0 1 9 0" />
              </svg>
            </span>
            {order.shipping_address.name || 'Not available'}
          </p>
          <p className="flex items-center gap-4">
            <span className="text-[#111827]">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 4.5h2.3l1.2 4-1.6 1.6a15.1 15.1 0 0 0 5.5 5.5l1.6-1.6 4 1.2v2.3a2 2 0 0 1-2.2 2A15.8 15.8 0 0 1 4.5 6.7a2 2 0 0 1 2-2.2Z" />
              </svg>
            </span>
            {order.shipping_address.phone || 'Not available'}
          </p>
          <p className="flex items-center gap-4">
            <span className="text-[#111827]">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" />
              </svg>
            </span>
            {order.shipping_address.email || 'Not available'}
          </p>
          <p className="flex items-center gap-4">
            <span className="text-[#111827]">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z" />
                <circle cx="12" cy="11" r="2" />
              </svg>
            </span>
            {order.shipping_address.address || 'Not available'}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-[#d8e1ee] bg-white shadow-[0_18px_40px_rgba(29,42,58,0.06)]">
        <div className="border-b border-[#edf1f7] bg-[linear-gradient(180deg,_#f7f9fc,_#f2f5f9)] px-6 py-5">
          <h2 className="text-[32px] font-black tracking-[-0.04em] text-[#14213d]">Order Items</h2>
        </div>

        <div className="px-6 py-5">
          {order.items.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className={`grid gap-5 py-6 md:grid-cols-[120px_minmax(0,1fr)_auto] ${index !== order.items.length - 1 ? 'border-b border-[#edf1f7]' : ''}`}
            >
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[1.2rem] bg-[#f6f8fb]">
                {item.image_url ? (
                  <img
                    src={buildImageUrl(item.image_url)}
                    alt={item.name}
                    className="h-full w-full object-contain p-3"
                  />
                ) : (
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#90a0b6]">No Image</div>
                )}
              </div>

              <div className="min-w-0">
                <h3 className="text-[28px] font-black tracking-[-0.04em] text-[#14213d]">{item.name}</h3>
                <p className="mt-2 text-[16px] text-[#5f6f84]">{item.category}</p>
                {item.description ? (
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-[#5f6f84]">{item.description}</p>
                ) : null}
              </div>

              <div className="flex min-w-[170px] flex-col items-end justify-between gap-4">
                <div className="text-right">
                  {item.compare_price ? (
                    <div className="text-[16px] font-semibold text-[#9aa7ba] line-through">
                      {formatCurrency(item.compare_price)}
                    </div>
                  ) : null}
                  <div className="text-[30px] font-black tracking-[-0.04em] text-[#14213d]">
                    {formatCurrency(item.price)}
                  </div>
                </div>
                <div className="text-[16px] font-medium text-[#243044]">
                  Quantity : <span className="font-black text-[#14213d]">{item.quantity}</span>
                </div>
                <span className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${getOrderStatusTone(item.status)}`}>
                  {formatStatusLabel(item.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#d8e1ee] bg-[linear-gradient(180deg,_#f8fafc,_#f4f7fb)] p-6 shadow-[0_18px_40px_rgba(29,42,58,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#0f8b86]">Order Summary</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#14213d]">
              {order.item_count} item{Number(order.item_count) === 1 ? '' : 's'} • {formatCurrency(order.amount_payable)}
            </h2>
            <p className="mt-2 text-[16px] leading-7 text-[#5f6f84]">
              Payment status: <span className="font-bold text-[#14213d]">{formatStatusLabel(order.payment_status)}</span>
            </p>
            <p className="text-[16px] leading-7 text-[#5f6f84]">
              Delivery method: <span className="font-bold text-[#14213d]">{order.delivery_method}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleOrderAgain}
            disabled={state.isOrderingAgain}
            className="inline-flex min-w-44 items-center justify-center rounded-full bg-[#0f8b86] px-7 py-4 text-sm font-extrabold text-white shadow-[0_14px_28px_rgba(15,139,134,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state.isOrderingAgain ? 'Adding...' : 'Order Again'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default OrderDetailsPage
