import { BrowserRouter } from 'react-router-dom'
import AppRouter from './app/router/AppRouter'
import { CartProvider } from './features/cart/context/CartContext'
import { AuthProvider } from './features/auth/context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
