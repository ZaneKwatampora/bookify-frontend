import React from 'react';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';
import BookCard from '../books/BookCard';
import Loading from '../../components/Loading';


const AllBook = () => {
  const { data: books = [], isLoading, isError } = useFetchAllBooksQuery();

  if (isLoading) return <Loading/> ;
  if (isError) return <p className="text-center mt-10 text-red-500">Failed to load books.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">All Books</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default AllBook;
