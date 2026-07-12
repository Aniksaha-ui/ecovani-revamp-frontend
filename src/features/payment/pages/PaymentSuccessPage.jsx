import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import PaymentStatusView from '../components/PaymentStatusView'

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()

  const transactionId = useMemo(
    () => searchParams.get('tran_id') || searchParams.get('transaction_id') || '',
    [searchParams],
  )

  return (
    <PaymentStatusView
      tone="success"
      eyebrow="Payment completed"
      title="Your payment was successful and your order is confirmed."
      description="Everything went through successfully. We have received your payment, cleared your cart on the server, and started preparing your order for the next step."
      transactionId={transactionId}
      primaryAction={{ label: 'View My Orders', to: '/orders' }}
      secondaryAction={{ label: 'Continue Shopping', to: '/' }}
    />
  )
}

export default PaymentSuccessPage
