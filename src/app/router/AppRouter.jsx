import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import LoginPage from '../../features/auth/pages/LoginPage'
import HomePage from '../../features/home/pages/HomePage'
import ProductDetailsPage from '../../features/products/pages/ProductDetailsPage'
import CategoryProductsPage from '../../features/products/pages/CategoryProductsPage'
import CartPage from '../../features/cart/pages/CartPage'

function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/categories/:categoryId/products" element={<CategoryProductsPage />} />
        <Route path="/products/:productId" element={<ProductDetailsPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter
