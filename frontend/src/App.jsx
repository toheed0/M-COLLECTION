import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserLayout from './components/layout/UserLayout'
import Home from './pages/Home'
import { Toaster } from 'sonner'
import { Login } from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CollectionPage from './pages/CollectionPage'
import ProductDetails from './components/product/ProductDetails'
import Checkout from './components/cart/Checkout'
import OrderConfirmationPage from './pages/OrderComfirmationPage'
import OrderDetailPage from './pages/OrderDetailPage'
import MyOrder from './pages/MyOrder'
import AdminLayout from './components/admin/AdminLayout'
import AdminHomePage from './pages/AdminHomePage'
import UserManagement from './components/admin/UserManagement'
import ProductManagement from './components/admin/ProductManagement'
import EditProducts from './components/admin/EditProducts'
import OrderManagement from './components/admin/OrderManagement'
import { Provider } from 'react-redux'
import store from './Redux/Store'
import ProtectedRoute from './components/common/ProtectedRoute'
import ProductForm from './components/admin/ProductForm'

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position='top-right' />
        <Routes>
          <Route path='/' element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='profile' element={<Profile />} />
            <Route path='collection/:collection' element={<CollectionPage />} />
            <Route path='product/:id' element={<ProductDetails />} />
            <Route path='checkout' element={<Checkout />} />
            <Route path='order-confirmation/:checkoutId' element={<OrderConfirmationPage />} />
            <Route path='order/:id' element={<OrderDetailPage />} />
            <Route path='my-orders' element={<MyOrder />} />
          </Route>

          {/* Admin Routes */}
          <Route path='/admin' element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminHomePage />} />
            <Route path='users' element={<UserManagement />} />
            <Route path='products' element={<ProductManagement />} />
            <Route path='products/new' element={<ProductForm />} />
            <Route path='products/:id/edit' element={<EditProducts />} />
            <Route path='orders' element={<OrderManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
