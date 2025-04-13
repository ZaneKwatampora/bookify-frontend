import { useState, useEffect } from "react";

export const useFavorites = (user) => {
  const [favorites, setFavorites] = useState([]);

  const storageKey = `bookify-favorites-${user?.uid}`;

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(storageKey);
      setFavorites(stored ? JSON.parse(stored) : []);
    }
  }, [user]);

  const isFavorited = (bookId) => favorites.some((b) => b._id === bookId);

  const toggleFavorite = (book) => {
    if (!user) return;

    let updated;
    if (isFavorited(book._id)) {
      updated = favorites.filter((b) => b._id !== book._id);
    } else {
      updated = [...favorites, book];
    }
    setFavorites(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  return { favorites, isFavorited, toggleFavorite };
};