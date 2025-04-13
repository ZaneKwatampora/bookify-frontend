import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Login from './components/Login'
import Register from './components/Register'
import CartPage from './pages/books/CartPage'
import CheckoutPage from './pages/books/CheckoutPage'
import SingleBook from './pages/books/SingleBook'
import { AuthProvider } from './context/AuthContext'
import PrivateRoutes from './routes/PrivateRoutes'
import Orders from './pages/books/Orders'
import AdminLogin from './components/AdminLogin'
import SearchResults from './pages/books/SearchResults'
import Favourite from './pages/books/Favourite'
import DashboardLayout from './layouts/DashboardLayout'
import Profile from './pages/dashboard/Profile'
import Setting from './pages/dashboard/Setting'
import Overview from './pages/dashboard/Overview'
import ProtectedAdminRoute from './routes/ProtectedAdminRoute'
import AddBook from './pages/dashboard/addBook/AddBook'
import Dashboard from './pages/dashboard/Dashboard'
import ManageBooks from './pages/dashboard/manageBooks/ManageBooks'
import UpdateBook from './pages/dashboard/EditBook/UpdateBook'
import AllBook from './pages/books/AllBook'



function App() {
  return (
    <div>
      <AuthProvider>
        <Router>
          <div className='mx-4 sm:mx-10 md:mx-20 lg:mx-32 xl:mx-40 my-0 sm:my-0 md:my-0 lg:my-0'>
            <Navbar />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route element={<PrivateRoutes />}>
                <Route path='/orders' element={<Orders />} />
              </Route>
              <Route path='/login' element={<Login />} />
              <Route path='/admin' element={<AdminLogin />} />
              <Route path='/register' element={<Register />} />
              <Route path='/cart' element={<CartPage />} />
              <Route element={<PrivateRoutes />}>
                <Route path='/checkout' element={<CheckoutPage />} />
              </Route>
              <Route path='/books/:id' element={<SingleBook />} />
              <Route path='/favourites' element={<Favourite />} />
              <Route path="/search-results" element={<SearchResults />} />
              <Route path="/books" element={<AllBook />} />
              <Route path="/dashboard" element={<ProtectedAdminRoute>  <DashboardLayout /></ProtectedAdminRoute>}>
                <Route path="dashboard-main" element={<Dashboard />} />
                <Route path="overview" element={<Overview />} />
                <Route path="profile" element={<Profile />} />
                <Route path="setting" element={<Setting />} />
                <Route path="add-new-book" element={<AddBook />} />
                <Route path="edit-book/:id" element={<UpdateBook />} />
                <Route path="manage-books" element={<ManageBooks />} />
              </Route>
              <Route path='*' element={<NotFound />} />
            </Routes>
          </div>
          <div>
            <Footer />
          </div>
        </Router>

      </AuthProvider>
    </div>
  )
}

export default App