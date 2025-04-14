import React, { useState, useEffect } from "react";
import { FiShoppingCart, FiExternalLink, FiStar } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useFetchBookByIdQuery } from "../../redux/features/books/booksApi";
import { useAuth } from "../../context/AuthContext";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const SingleBook = () => {
  const { currentUser } = useAuth()
  const { id } = useParams();
  const { data: book, isLoading, isError } = useFetchBookByIdQuery(id);
  const dispatch = useDispatch();
  const [googlePreview, setGooglePreview] = useState(null);

  // Review State
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (book?.title) {
      const fetchGooglePreview = async () => {
        try {
          const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(book.title)}`
          );
          const data = await response.json();
          if (data.items?.length > 0) {
            setGooglePreview(data.items[0].volumeInfo.previewLink);
          }
        } catch (error) {
          console.error("Error fetching Google Books preview:", error);
        }
      };
      fetchGooglePreview();
    }

    if (id) {
      fetchReviews();
    }
  }, [book, id]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${id}`);
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const newReview = {
        bookId: id,
        username: currentUser?.email,
        comment,
        rating,
      };

      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      if (res.ok) {
        setComment("");
        setRating(5);
        fetchReviews();
      }
    } catch (error) {
      console.error("Failed to submit review", error);
    }
  };

  if (isLoading)
    return <div className="flex items-center justify-center min-h-screen text-xl font-semibold text-gray-600">Loading book details...</div>;

  if (isError)
    return <div className="flex items-center justify-center min-h-screen text-red-500 font-semibold">Error loading book info.</div>;

  return (
    <div>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">{book.title}</h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 flex justify-center">
            <img
              src={getImgUrl(book.coverImage)}
              alt={book.title}
              className="w-64 h-96 object-contain rounded-md shadow-md"
            />
          </div>

          <div className="w-full md:w-2/3 space-y-4">
            <p className="text-gray-700 capitalize">
              <strong className="text-gray-900">Category:</strong> {book?.category}
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong className="text-gray-900">Description:</strong> {book.description}
            </p>

            <div className="flex items-center gap-4 mt-4">
              <p className="text-xl font-bold text-gray-900">
                ${book.newPrice}
                <span className="text-gray-500 line-through text-lg ml-2">${book.oldPrice}</span>
              </p>
              <button
                onClick={() => dispatch(addToCart(book))}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-lg transition shadow-md"
              >
                <FiShoppingCart />
                <span>Add to Cart</span>
              </button>
            </div>

            {googlePreview ? (
              <a
                href={googlePreview}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
              >
                <FiExternalLink />
                Preview on Google Books
              </a>
            ) : (
              <p className="text-gray-500 italic">No Google Books preview available.</p>
            )}
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>

          <form onSubmit={handleReviewSubmit} className="space-y-4 mb-8">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows="3"
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <div className="flex items-center gap-2">
              <label className="font-medium">Rating:</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <button
                type="submit"
                className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Submit Review
              </button>
            </div>
          </form>

          {reviews.length === 0 ? (
            <p className="text-gray-500 italic">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="border p-4 rounded-lg shadow-sm">
                  <p className="font-semibold">{rev.username}</p>
                  <span className="flex ml-2">
                    {[...Array(5)].map((_, i) =>
                      i < rev.rating ? (
                        <AiFillStar key={i} className="text-yellow-500" />
                      ) : (
                        <AiOutlineStar key={i} className="text-yellow-500" />
                      )
                    )}
                  </span>
                  <p className="text-gray-700 mt-1">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
