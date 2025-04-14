import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const BookDetails = () => {
  const { id } = useParams(); 
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch book details");
        }
        const data = await response.json();
        setBook(data.volumeInfo);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/" className="text-blue-600 hover:underline">&larr; Back to Home</Link>
      
      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
        {book.imageLinks?.thumbnail && (
          <img
            src={book.imageLinks.thumbnail}
            alt={book.title}
            className="w-48 mx-auto rounded-md mb-4"
          />
        )}
        <h1 className="text-2xl font-bold text-center">{book.title}</h1>
        <p className="text-gray-700 text-center">by {book.authors?.join(", ") || "Unknown Author"}</p>

        <div className="mt-4">
          <p className="text-gray-600 text-justify">{book.description || "No description available."}</p>
        </div>

        {book.previewLink && (
          <div className="mt-6 text-center">
            <a
              href={book.previewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray- transition"
            >
              Read Preview
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
