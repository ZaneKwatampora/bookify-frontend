import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true); // Trigger animation when component mounts
  }, []);

  useEffect(() => {
    document.body.classList.add('no-layout');
  
    return () => {
      document.body.classList.remove('no-layout');
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-100 transition-opacity duration-1000 ${
        fadeIn ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-red-600 animate-bounce">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mt-2">Page Not Found</h2>
        <p className="text-lg mt-2 text-gray-600">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="mt-4">
          <Link
            to="/"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-600 transition duration-300"
          >
            Go Back Home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default NotFound;
