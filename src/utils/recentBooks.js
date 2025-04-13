const RECENTLY_VIEWED_KEY = "recentlyViewedBooks";

export const getRecentlyViewedBooks = () => {
  return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
};

export const addToRecentlyViewed = (bookId) => {
  const books = getRecentlyViewedBooks();
  const updated = [bookId, ...books.filter((id) => id !== bookId)].slice(0, 10); // keep last 10
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
};