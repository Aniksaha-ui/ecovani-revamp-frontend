import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import PaymentStatusView from '../components/PaymentStatusView'

function PaymentFailedPage() {
  const [searchParams] = useSearchParams()

  const transactionId = useMemo(
    () => searchParams.get('tran_id') || searchParams.get('transaction_id') || '',
    [searchParams],
  )

  return (
    <PaymentStatusView
      tone="failed"
      eyebrow="Payment failed"
      title="The payment could not be completed this time."
      description="No worries, your shopping flow is still intact. You can return to checkout, verify the payment details, and try again without losing the items you selected."
      transactionId={transactionId}
      primaryAction={{ label: 'Try Checkout Again', to: '/checkout' }}
      secondaryAction={{ label: 'Back to Home', to: '/' }}
    />
  )
}

export default PaymentFailedPage
