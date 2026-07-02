import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './Components/Navbar'
import ProtectedRoute from './Components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ListingDetail from './pages/ListingDetail'
import CreateListing from './pages/CreateListing'
import MyListings from './pages/MyListings'
import Profile from './pages/Profile'
import SellerProfile from './pages/SellerProfile'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import MyOrders from './pages/MyOrders'
import NotFound from './pages/NotFound'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/sellers/:id" element={<SellerProfile />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/sell/new"
                element={
                  <ProtectedRoute>
                    <CreateListing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sell/:id/edit"
                element={
                  <ProtectedRoute>
                    <CreateListing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MyListings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:id/confirmation"
                element={
                  <ProtectedRoute>
                    <OrderConfirmation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
