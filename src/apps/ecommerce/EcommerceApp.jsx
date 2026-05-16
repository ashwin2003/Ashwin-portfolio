import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { EcomNavbar } from './components/EcomNavbar'

const Home          = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const Products      = lazy(() => import('./pages/Products').then(m => ({ default: m.Products })))
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })))
const Cart          = lazy(() => import('./pages/Cart').then(m => ({ default: m.Cart })))
const Checkout      = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })))

function Loader() {
  return (
    <div className="flex justify-center py-32">
      <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
    </div>
  )
}

export function EcommerceApp() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pt-14">
      <EcomNavbar />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route index              element={<Home />} />
          <Route path="products"    element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart"        element={<Cart />} />
          <Route path="checkout"    element={<Checkout />} />
        </Routes>
      </Suspense>
    </div>
  )
}
