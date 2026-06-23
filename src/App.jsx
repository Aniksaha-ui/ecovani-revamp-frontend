import { BrowserRouter } from 'react-router-dom'
import AppRouter from './app/router/AppRouter'
import { CartProvider } from './features/cart/context/CartContext'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
