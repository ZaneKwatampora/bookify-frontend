import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../hooks/useFavorites';
import BookCard from './BookCard';

function Favourite() {
  const { currentUser } = useAuth();
  const { favorites, isFavorited, toggleFavorite } = useFavorites(currentUser);

  if (!currentUser)
    return <p className="text-center mt-10">Please log in to view your favorites.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Favorites</h2>
      {favorites.length === 0 ? (
        <p>You haven't favorited any books yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              isFavorited={isFavorited}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favourite;
