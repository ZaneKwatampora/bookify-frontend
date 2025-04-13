import React, { useState, useEffect } from "react";

const placeholderImage =
  "https://www.claws.in/wp-content/uploads/2021/04/book-cover-placeholder.png";

const BookCover = ({ fetchBookCover, isbn, onImageLoaded }) => {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (!isbn) return;

    const loadImage = async () => {
      try {
        const imgSrc = await fetchBookCover(isbn);
        if (imgSrc) {
          setImageSrc(imgSrc);
          onImageLoaded(true); // Notify parent that image is available
        } else {
          setImageSrc(placeholderImage); // Use fallback image if no image found
          onImageLoaded(false); // Notify parent that image is missing
        }
      } catch (error) {
        console.error("Error loading image:", error);
        setImageSrc(placeholderImage); // Use fallback image in case of error
        onImageLoaded(false);
      }
    };

    loadImage();
  }, [isbn, fetchBookCover, onImageLoaded]);

  // Handle case when image is not loaded yet or fails
  return (
    <img
      src={imageSrc || placeholderImage} // Show fallback if no imageSrc is found
      alt="Book Cover"
      className="book-cover"
      onError={(e) => {
        e.target.src = placeholderImage; // Ensure fallback is shown in case of error
      }}
    />
  );
};

export default BookCover;
