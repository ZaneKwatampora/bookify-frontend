import React from 'react';
import { useDeleteBookMutation, useFetchAllBooksQuery } from '../../../redux/features/books/booksApi';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ManageBooks = () => {
  const navigate = useNavigate();
  const { data: books, refetch } = useFetchAllBooksQuery();
  const [deleteBook] = useDeleteBookMutation();

  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id).unwrap();
      Swal.fire({
        icon: "success",
        text: 'Book deleted successfully!',
      });
      refetch();
    } catch (error) {
      console.error('Failed to delete book:', error?.data || error?.message || error);
      alert(error?.data?.message || 'Failed to delete book. Please try again.');
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">Manage Books</h2>
          <button
            onClick={() => navigate('/dashboard/add-new-book')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
          >
            + Add Book
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {books?.map((book, index) => (
                <tr key={book._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{book.title}</td>
                  <td className="px-6 py-4">{book.category}</td>
                  <td className="px-6 py-4">${book.newPrice}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link
                      to={`/dashboard/edit-book/${book._id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteBook(book._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {books?.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">No books found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ManageBooks;
