import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiClient from '../../../shared/lib/api/apiClient'
import { useAuth } from '../../auth/context/AuthContext'
import {
  ADD_CART_ENDPOINT,
  ORDER_DETAILS_ENDPOINT,
  ORDER_LIST_ENDPOINT,
  extractData,
  formatCurrency,
  formatDateTime,
  formatStatusLabel,
  getOrderStatusTone,
} from '../lib/orderUtils'

function SummaryRow({ icon, label, value, emphasize = false }) {
  return (
    <div className="grid grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-4 text-sm md:text-[16px]">
      <span className="text-[#111827]">{icon}</span>
      <span className="font-medium text-[#243044]">{label}</span>
      <span className={`text-right font-bold ${emphasize ? 'text-[#0f8b86]' : 'text-[#14213d]'}`}>{value}</span>
    </div>
  )
}

function EmptyOrdersState() {
  return (
    <div className="rounded-[2rem] border border-[#d8e1ee] bg-white px-8 py-16 text-center shadow-[0_18px_40px_rgba(29,42,58,0.06)]">
      <p className="text-sm font-black uppercase tracking-[0.24em] text-[#0f8b86]">Orders</p>
      <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#14213d]">Your order history will appear here.</h1>
      <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-8 text-[#5f6f84]">
        Start shopping and complete a checkout to see your order timeline, item list, and payment status in one place.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-[#0f8b86] px-7 py-4 text-sm font-extrabold text-white shadow-[0_14px_28px_rgba(15,139,134,0.18)] transition hover:-translate-y-0.5"
      >
        Continue Shopping
      </Link>
    </div>
  )
}

function LoginRequiredState() {
  return (
    <div className="rounded-[2rem] border border-[#d8e1ee] bg-white px-8 py-16 text-center shadow-[0_18px_40px_rgba(29,42,58,0.06)]">
      <p className="text-sm font-black uppercase tracking-[0.24em] text-[#0f8b86]">Sign in required</p>
      <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#14213d]">Log in to view your orders.</h1>
      <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-8 text-[#5f6f84]">
        We need your account session to load order history, delivery progress, and past item details.
      </p>
      <Link
        to="/login"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-[#0f8b86] px-7 py-4 text-sm font-extrabold text-white shadow-[0_14px_28px_rgba(15,139,134,0.18)] transition hover:-translate-y-0.5"
      >
        Go to Login
      </Link>
    </div>
  )
}

function OrdersPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [state, setState] = useState({
    isLoading: true,
    error: '',
    orders: [],
    orderingId: null,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      setState({
        isLoading: false,
        error: '',
        orders: [],
        orderingId: null,
      })
      return
    }

    let isMounted = true

    async function loadOrders() {
      try {
        const response = await apiClient.get(ORDER_LIST_ENDPOINT)
        const orders = extractData(response.data)

        if (!isMounted) {
          return
        }

        setState({
          isLoading: false,
          error: '',
          orders: Array.isArray(orders) ? orders : [],
          orderingId: null,
        })
      } catch {
        if (!isMounted) {
          return
        }

        setState({
          isLoading: false,
          error: 'Your orders could not be loaded right now.',
          orders: [],
          orderingId: null,
        })
      }
    }

    loadOrders()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated])

  async function handleOrderAgain(orderId) {
    setState((current) => ({
      ...current,
      orderingId: orderId,
      error: '',
    }))

    try {
      const detailsResponse = await apiClient.get(`${ORDER_DETAILS_ENDPOINT}/${orderId}`)
      const order = extractData(detailsResponse.data)
      const items = Array.isArray(order?.items) ? order.items : []

      if (!items.length) {
        throw new Error('No items found in this order.')
      }

      await apiClient.post(ADD_CART_ENDPOINT, items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })))

      window.location.href = '/cart'
    } catch {
      setState((current) => ({
        ...current,
        orderingId: null,
        error: 'The order items could not be added to cart right now.',
      }))
    }
  }

  if (!isAuthenticated) {
    return <LoginRequiredState />
  }

  if (state.isLoading) {
    return (
      <div className="rounded-[2rem] border border-[#d8e1ee] bg-white px-8 py-14 shadow-[0_18px_40px_rgba(29,42,58,0.06)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7b8798]">Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[#d8e1ee] bg-[linear-gradient(180deg,_#fff7c5,_#fffefa)] p-8 shadow-[0_18px_40px_rgba(29,42,58,0.06)]">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[#0f8b86]">My orders</p>
        <h1 className="mt-4 text-5xl font-black tracking-[-0.05em] text-[#14213d]">Track every order from one clean dashboard.</h1>
        <p className="mt-4 max-w-3xl text-[16px] leading-8 text-[#5f6f84]">
          Review your recent purchases, jump into full order details, and quickly reorder favorite items whenever you need them again.
        </p>
      </section>

      {state.error ? (
        <div className="rounded-[1.4rem] border border-[#f3c5c5] bg-[#fff6f6] px-5 py-4 text-sm font-medium text-[#b42318]">
          {state.error}
        </div>
      ) : null}

      {state.orders.length === 0 ? (
        <EmptyOrdersState />
      ) : (
        <div className="space-y-6">
          {state.orders.map((order) => (
            <article
              key={order.id}
              className="overflow-hidden rounded-[2rem] border border-[#d8e1ee] bg-white shadow-[0_18px_40px_rgba(29,42,58,0.06)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#edf1f7] px-6 py-6">
                <h2 className="text-[28px] font-black tracking-[-0.04em] text-[#14213d]">
                  Order ID : <span className="text-[#274463]">{order.order_number}</span>
                </h2>
                <span className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${getOrderStatusTone(order.status)}`}>
                  {formatStatusLabel(order.status)}
                </span>
              </div>

              <div className="grid gap-4 px-6 py-8">
                <SummaryRow
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                      <rect x="4" y="5" width="16" height="15" rx="2" />
                      <path strokeLinecap="round" d="M8 3v4M16 3v4M4 10h16" />
                    </svg>
                  }
                  label="Order Date:"
                  value={formatDateTime(order.order_date)}
                />
                <SummaryRow
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 5h10M6 9h12M7 13h10M7 17h6" />
                      <rect x="4" y="3" width="16" height="18" rx="2" />
                    </svg>
                  }
                  label="Order Items"
                  value={`${order.item_count} Product${Number(order.item_count) === 1 ? '' : 's'}`}
                />
                <SummaryRow
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v8H3zM14 10h3l4 4v1h-7zM7 19a1 1 0 1 0 0 .01M18 19a1 1 0 1 0 0 .01" />
                    </svg>
                  }
                  label="Delivery Method"
                  value={order.delivery_method}
                />
                <SummaryRow
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M7 7.5a3.5 3.5 0 0 1 3.5-3.5H14a3 3 0 1 1 0 6h-4a3 3 0 1 0 0 6h6.5A3.5 3.5 0 0 0 20 12.5" />
                    </svg>
                  }
                  label="Amount Payable"
                  value={`${formatCurrency(order.amount_payable)} (${formatStatusLabel(order.payment_status)})`}
                  emphasize={order.payment_status === 'paid'}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#edf1f7] px-6 py-5">
                <button
                  type="button"
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="inline-flex min-w-36 items-center justify-center rounded-full border border-[#d7dfea] bg-white px-6 py-3 text-sm font-bold text-[#14213d] transition hover:border-[#0f8b86] hover:text-[#0f8b86]"
                >
                  View Details
                </button>

                <button
                  type="button"
                  onClick={() => handleOrderAgain(order.id)}
                  disabled={state.orderingId === order.id}
                  className="inline-flex min-w-40 items-center justify-center rounded-full bg-[#0f8b86] px-6 py-3 text-sm font-extrabold text-white shadow-[0_14px_28px_rgba(15,139,134,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {state.orderingId === order.id ? 'Adding...' : 'Order Again'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage
