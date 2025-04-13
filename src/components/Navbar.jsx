import React, { useState } from 'react';
import { FaBookOpen, FaSearch, FaStar } from 'react-icons/fa';
import { HiOutlineHeart, HiOutlineShoppingCart, HiOutlineUser, HiMenu } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import avatarImg from "../assets/avatar.png";
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: "Orders", href: "/orders" },
  { name: "Cart Page", href: "/cart" },
  { name: "Check Out", href: "/checkout" },
  { name: "Favourites", href: "/favourites" },
  { name: "Dashboard", href: "/dashboard" },
];

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cartItems = useSelector(state => state.cart.cartItems);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery) {
      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`);
        const data = await response.json();
        const books = data.items || [];
        navigate('/search-results', { state: { books, query: searchQuery } });
        setSearchQuery('');
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }
  };

  return (
    <header className='max-w-screen-2xl mx-auto px-4 py-6'>
      <nav className='flex justify-between items-center relative'>

        {/* Left side - Logo + Search */}
        <div className='flex items-center gap-4 sm:gap-16'>
          <Link to='/' className='flex items-center gap-2'>
            <h1 className='font-serif text-2xl font-semibold'>Bookify</h1>
            <FaBookOpen className='w-6 h-6 text-orange-600' />
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className='hidden sm:flex items-center space-x-2'>
            <input
              type='text'
              placeholder='Search for books...'
              className='p-2 border border-gray-300 rounded w-60'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type='submit' className='bg-orange-600 p-3 text-white rounded'>
              <FaSearch />
            </button>
          </form>
        </div>

        {/* Right side - Icons */}
        <div className='flex items-center gap-3 sm:gap-4'>
          {/* Heart icon */}
          <Link to="/favourites" className='hidden sm:block'>
            <FaStar className='w-6 h-6 text-yellow-400' />
          </Link>

          {/* Cart icon */}
          <Link to="/cart" className='bg-orange-600 p-1 sm:px-6 py-2 flex items-center rounded-sm'>
            <HiOutlineShoppingCart className='w-5 h-5 text-white' />
            <span className='text-sm font-semibold text-white ml-1'>
              {cartItems.length > 0 ? cartItems.length : 0}
            </span>
          </Link>

          {/* User avatar / login */}
          {currentUser ? (
            <div className='relative'>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className='relative'>
                <img src={avatarImg} alt="Avatar" className='w-8 h-8 rounded-full ring-2' />
              </button>
              {isDropdownOpen && (
                <div className='absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40'>
                  <ul className='py-2'>
                    {navigation.map((item) => (
                      <li key={item.name} onClick={() => setIsDropdownOpen(false)}>
                        <Link to={item.href} className='block px-4 py-2 text-sm hover:bg-gray-100'>
                          {item.name}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button onClick={handleLogOut} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <HiOutlineUser className='w-6 h-6 text-gray-700' />
            </Link>
          )}

          {/* Mobile toggle */}
          <button className='sm:hidden' onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <HiMenu className='w-6 h-6 text-gray-700' />
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className='mt-4 sm:hidden space-y-4'>
          <form onSubmit={handleSearch} className='flex items-center space-x-2'>
            <input
              type='text'
              placeholder='Search books...'
              className='flex-grow p-2 border border-gray-300 rounded'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type='submit' className='bg-orange-600 p-2 text-white rounded'>
              <FaSearch />
            </button>
          </form>

          <ul className='bg-white rounded-md shadow divide-y'>
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className='block px-4 py-2 text-sm hover:bg-gray-100'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            {currentUser && (
              <li>
                <button
                  onClick={handleLogOut}
                  className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Navbar;
