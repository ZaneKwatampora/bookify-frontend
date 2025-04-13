import React, { useState, useEffect, lazy, Suspense, useCallback } from "react";
import "../../styles/BestSeller.css";

const NYT_API_KEY = import.meta.env.VITE_NYT_API_KEY;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const genres = {
  Fiction: "hardcover-fiction",
  NonFiction: "hardcover-nonfiction",
  Comics: "graphic-books-and-manga",
};

const fallbackImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmNYw9e9Y7rhqAKRQ3Lv7pFw0JJWdXj13WJA&s"; // Default cover image

// Book cover cache to avoid redundant API requests
const coverCache = new Map();

const BestSellers = () => {
  const [genre, setGenre] = useState("Fiction");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch book cover
  const fetchBookCover = useCallback(async (title, author, retries = 3, delay = 1500) => {
    const key = `${title}-${author}`;
    if (coverCache.has(key)) return coverCache.get(key);
  
    const query = `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${GOOGLE_API_KEY}`;
  
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          if (response.status === 429) {
            console.warn(`Rate limit hit. Retrying in ${delay}ms...`);
            await new Promise((res) => setTimeout(res, delay));
            delay *= 2; // Exponential backoff
            continue;
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const cover = data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail || fallbackImage;
        console.log('Fetched cover image:', cover); // Log the image URL to check if it's valid
        coverCache.set(key, cover); // Cache the result
        return cover;
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
    return fallbackImage;
  }, []);
  

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        console.log(`📡 Fetching NYT Bestsellers for genre: ${genre}`);

        const response = await fetch(
          `https://api.nytimes.com/svc/books/v3/lists.json?list=${genres[genre]}&api-key=${NYT_API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`NYT API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.results || data.results.length === 0) {
          console.warn("⚠️ No results found in API response!", data);
          setBooks([]);
          setLoading(false);
          return;
        }

        const booksList = await Promise.all(
          data.results.map(async (book) => {
            const bookDetails = book.book_details?.[0] || {};
            const bookImage =
              book.book_image ||
              (await fetchBookCover(bookDetails.title, bookDetails.author));

            return {
              title: bookDetails.title || "Unknown Title",
              author: bookDetails.author || "Unknown Author",
              publisher: bookDetails.publisher || "Unknown Publisher",
              description: bookDetails.description || "No description available.",
              rank: book.rank || "Unranked",
              amazon_url: book.amazon_product_url || "#",
              book_image: bookImage,
              weeks_on_list: book.weeks_on_list || "New this week!",
            };
          })
        );

        setBooks(booksList);
      } catch (error) {
        console.error("❌ Error fetching bestsellers:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [genre, fetchBookCover]);

  // Carousel Navigation
  const nextSlide = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length);
  const prevSlide = () => setCurrentIndex((prevIndex) => (prevIndex === 0 ? books.length - 1 : prevIndex - 1));

  return (
    <div className="mt-20">
      <div className="best-sellers-container">
        <h1 className="best-sellers-title">
          <span className="font-serif text-3xl">New York Times</span> <br /> Best Sellers
        </h1>

        <div className="genre-selector">
          <select onChange={(e) => setGenre(e.target.value)} value={genre} className="genre-select">
            {Object.keys(genres).map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[300px] w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
            <p className="mt-4 text-gray-600 text-lg font-semibold">
              Loading bestsellers, please wait...
            </p>
          </div>
        ) : books.length > 0 ? (
          <div className="carousel-container">
            <button onClick={prevSlide} className="carousel-button prev">
              &lt;
            </button>

            <div className="carousel">
              <div
                className="carousel-inner"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {books.map((book, index) => (
                  <div key={index} className="carousel-item">
                    <div className="book-card">
                      <Suspense fallback={<div className="book-cover-loading">Loading image...</div>}>
                        <img src={book.book_image} alt={book.title} className="book-cover" />
                      </Suspense>

                      <div className="book-info">
                        <h2 className="book-title">
                          <a href={book.amazon_url} target="_blank" rel="noopener noreferrer">
                            {book.title}
                          </a>
                        </h2>
                        <h4 className="book-author">By {book.author}</h4>
                        <h4 className="book-publisher">Publisher: {book.publisher}</h4>
                        <p className="book-description">{book.description}</p>
                        <div className="book-stats">
                          <p>Weeks on list: {book.weeks_on_list}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={nextSlide} className="carousel-button next">
              &gt;
            </button>

            {/* Pagination Dots */}
            <div className="carousel-dots">
              {books.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`dot ${index === currentIndex ? "active" : ""}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-lg text-gray-500">No books found.</p>
        )}
      </div>
    </div>
  );
};

export default BestSellers;
