import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../../styles/swiperOverride.css';
import BookCard from '../books/BookCard.jsx';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi.js';
import { Link } from 'react-router-dom';
import { FaArrowCircleRight } from 'react-icons/fa';

const Recommended = () => {

  const { data: books = [] } = useFetchAllBooksQuery();
  return (
    <div className="py-16 max-w-6xl mx-auto px-4">
      <div className="py-16 max-w-6xl mx-auto px-4">
        {/* Title & See All Link */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-900">
            Buy a book
          </h2>
          <Link
            to="/books"
            className="flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium"
          >
            See All<FaArrowCircleRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          navigation={true}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 4, spaceBetween: 40 },
          }}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {books.length > 0 && books.slice(0, 100).map((book, index) => (
            <SwiperSlide key={index} className="flex justify-center">
              <BookCard book={book} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Recommended;
