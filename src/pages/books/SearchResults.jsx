import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SearchResults = () => {
    const location = useLocation();
    const { books, query } = location.state || {}; // Getting the books and query passed from the Navbar


    // Function to truncate description to 6 sentences
    const truncateDescription = (description, sentenceLimit) => {
        if (!description) return '';
        
        const sentences = description.split('.').filter(sentence => sentence.trim() !== '');
        if (sentences.length <= sentenceLimit) return description;
        
        return sentences.slice(0, sentenceLimit).join('.') + '.';
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {books && books.length > 0 ? (
                    books.map((book) => (
                        <div key={book.id} className="bg-white p-4 rounded-lg shadow-md">
                            <img 
                                src={book.volumeInfo.imageLinks?.thumbnail} 
                                alt={book.volumeInfo.title} 
                                className="w-full h-48 object-cover rounded-md mb-4" 
                            />
                            <h2 className="text-xl font-semibold">{book.volumeInfo.title}</h2>
                            <p className="text-sm text-gray-600 mb-2">{book.volumeInfo.authors?.join(', ')}</p>
                            <p className="text-sm text-gray-800 mb-4">
                                {truncateDescription(book.volumeInfo.description, 6)}
                            </p>
                            <a 
                                href={book.volumeInfo.infoLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 hover:underline"
                            >
                                More Info
                            </a>
                        </div>
                    ))
                ) : (
                    <p>No books found</p>
                )}
            </div>
        </div>
    );
}

export default SearchResults;
