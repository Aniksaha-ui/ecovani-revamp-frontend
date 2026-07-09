import { Link } from 'react-router-dom'

function PaymentStatusView({
  tone = 'success',
  eyebrow,
  title,
  description,
  transactionId = '',
  primaryAction,
  secondaryAction,
}) {
  const isSuccess = tone === 'success'

  return (
    <section className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm font-medium text-[#708198]">
          <Link to="/" className="text-[#14213d] transition hover:text-[#0f8b86]">
            Home
          </Link>
          <span>•</span>
          <Link to="/checkout" className="transition hover:text-[#0f8b86]">
            Checkout
          </Link>
          <span>•</span>
          <span className="text-[#0f8b86]">{isSuccess ? 'Payment Success' : 'Payment Failed'}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#d9dfeb] bg-white shadow-[0_24px_56px_rgba(24,35,30,0.08)]">
            <div className={`absolute inset-x-0 top-0 h-2 ${isSuccess ? 'bg-[#0f8b86]' : 'bg-[#ef4444]'}`} />
            <div className="absolute left-[-5rem] top-[-4rem] h-40 w-40 rounded-full bg-[#ffe96a]/70 blur-3xl" />
            <div
              className={`absolute bottom-[-6rem] right-[-3rem] h-52 w-52 rounded-full blur-3xl ${
                isSuccess ? 'bg-[#0f8b86]/12' : 'bg-[#ef4444]/12'
              }`}
            />

            <div className="relative p-8 md:p-10">
              <div
                className={`mb-6 flex h-20 w-20 items-center justify-center rounded-[1.75rem] shadow-[0_18px_34px_rgba(17,24,39,0.1)] ${
                  isSuccess ? 'bg-[#0f8b86] text-white' : 'bg-[#111827] text-white'
                }`}
              >
                {isSuccess ? (
                  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                )}
              </div>

              <p className={`text-sm font-black uppercase tracking-[0.26em] ${isSuccess ? 'text-[#0f8b86]' : 'text-[#ef4444]'}`}>
                {eyebrow}
              </p>
              <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight tracking-[-0.05em] text-[#14213d] md:text-5xl">
                {title}
              </h1>
              <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[#516072]">
                {description}
              </p>

              {transactionId ? (
                <div className="mt-8 inline-flex rounded-[1.3rem] border border-[#d9dfeb] bg-[#f7faf8] px-5 py-4 text-sm font-semibold text-[#243044]">
                  Transaction ID: <span className="ml-2 font-black text-[#14213d]">{transactionId}</span>
                </div>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to={primaryAction.to}
                  className={`inline-flex items-center justify-center rounded-full px-7 py-4 text-sm font-extrabold text-white shadow-[0_16px_28px_rgba(17,24,39,0.12)] transition hover:-translate-y-0.5 ${
                    isSuccess ? 'bg-[#0f8b86]' : 'bg-[#14213d]'
                  }`}
                >
                  {primaryAction.label}
                </Link>
                <Link
                  to={secondaryAction.to}
                  className="inline-flex items-center justify-center rounded-full border border-[#d9dfeb] bg-white px-7 py-4 text-sm font-bold text-[#14213d] transition hover:-translate-y-0.5 hover:border-[#0f8b86] hover:text-[#0f8b86]"
                >
                  {secondaryAction.label}
                </Link>
              </div>
            </div>
          </div>

          <aside className="overflow-hidden rounded-[2rem] border border-[#d9dfeb] bg-[linear-gradient(180deg,_#ffe96a,_#fff7c1)] shadow-[0_24px_56px_rgba(24,35,30,0.08)]">
            <div className="border-b border-black/8 px-8 py-6">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0f8b86]">
                Next step
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#111827]">
                {isSuccess ? 'Your order is moving forward.' : 'Your cart is still safe.'}
              </h2>
            </div>

            <div className="space-y-4 px-8 py-8">
              {(isSuccess
                ? [
                    'Your payment was accepted and the order is now in processing.',
                    'You can continue shopping or check your cart for fresh items anytime.',
                    'Keep the transaction number for quick support if you need help later.',
                  ]
                : [
                    'The payment did not complete, so no confirmation was created yet.',
                    'Review your checkout details and try the payment again from the checkout page.',
                    'If the issue continues, use the transaction reference when contacting support.',
                  ]).map((item) => (
                <div
                  key={item}
                  className="rounded-[1.4rem] border border-black/8 bg-white/85 p-5 text-sm font-semibold leading-7 text-[#243044] shadow-[0_12px_24px_rgba(17,24,39,0.06)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default PaymentStatusView
