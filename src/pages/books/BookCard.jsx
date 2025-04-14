import React, { useEffect, useRef } from 'react';
import { getImgUrl } from '../../utils/getImgUrl';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { FaRegStar, FaStar } from 'react-icons/fa';

import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';

import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../hooks/useFavorites';
import Swal from 'sweetalert2';

function BookCard({ book, isFavorited: propIsFavorited, toggleFavorite: propToggleFavorite }) {
    const dispatch = useDispatch();
    const wrapperRef = useRef();
    const lightRef = useRef();
    const iconRef = useRef();

    const { currentUser } = useAuth();
    const { isFavorited: localIsFavorited, toggleFavorite: localToggleFavorite } = useFavorites(currentUser);

    const isFavorited = propIsFavorited || localIsFavorited;
    const toggleFavorite = propToggleFavorite || localToggleFavorite;
    

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const light = lightRef.current;
        const icon = iconRef.current;

        let mouseX = 0;
        let mouseY = 0;
        let torchX = 0;
        let torchY = 0;
        let hovering = false;

        const animate = () => {
            torchX += (mouseX - torchX) * 0.15;
            torchY += (mouseY - torchY) * 0.15;

            light.style.setProperty('--torch-x', `${torchX}px`);
            light.style.setProperty('--torch-y', `${torchY}px`);

            icon.style.left = `${torchX}px`;
            icon.style.top = `${torchY}px`;

            if (hovering) requestAnimationFrame(animate);
        };

        const handleMouseMove = (e) => {
            const rect = wrapper.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };

        const handleEnter = () => {
            hovering = true;
            light.style.opacity = '1';
            icon.style.opacity = '1';
            animate();
        };

        const handleLeave = () => {
            hovering = false;
            light.style.opacity = '0';
            icon.style.opacity = '0';
        };

        wrapper.addEventListener('mousemove', handleMouseMove);
        wrapper.addEventListener('mouseenter', handleEnter);
        wrapper.addEventListener('mouseleave', handleLeave);

        return () => {
            wrapper.removeEventListener('mousemove', handleMouseMove);
            wrapper.removeEventListener('mouseenter', handleEnter);
            wrapper.removeEventListener('mouseleave', handleLeave);
        };
    }, []);

    const handleAddToCart = () => {
        dispatch(addToCart(book));
    };
    const handleToggleFavorite = async () => {
        if (!currentUser) {
            Swal.fire('Please log in to favorite books.');
            return;
        }

        try {
            await toggleFavorite(book);
        } catch (err) {
            Swal.fire('Failed to favorite book.');
            console.error(err);
        }
    };
    return (
        <div className="relative bg-white p-5  shadow-md hover:shadow-xl flex flex-col justify-between gap-4 h-full min-h-[450px] transform transition-transform duration-300 hover:scale-[1.02] group">

            {/* Favorite Star Button */}
            <button
                onClick={handleToggleFavorite}
                className={`absolute top-3 right-3 text-2xl z-20 transition-colors ${isFavorited(book._id) ? 'text-yellow-400' : 'text-gray-300 group-hover:text-yellow-400'
                    }`}
                title={isFavorited(book._id) ? 'Unfavorite' : 'Add to favorites'}
            >
                {isFavorited(book._id) ? <FaStar /> : <FaRegStar />}
            </button>

            {/* Book Cover */}
            <div className="flex justify-center">
                <Link to={`/books/${book._id}`}>
                    <img
                        src={getImgUrl(book?.coverImage)}
                        alt={book?.title}
                        className="w-40 h-60 object-cover rounded-lg shadow-sm"
                    />
                </Link>
            </div>

            {/* Book Info */}
            <div className="flex flex-col justify-between flex-grow">
                <Link to={`/books/${book._id}`} className="text-lg font-semibold text-gray-800 hover:underline mt-2 line-clamp-1">
                    {book?.title}
                </Link>

                <p className="text-sm text-gray-600 mt-1 line-clamp-3 min-h-[3.5rem] leading-relaxed">
                    {book?.description}
                </p>

                <div className="mt-2">
                    <p className="text-lg font-bold text-gray-900">
                        ${book?.newPrice}
                        <span className="text-gray-500 line-through text-sm ml-2">${book?.oldPrice}</span>
                    </p>
                </div>

                {/* Torch Button Wrapper */}
                <div className="relative mt-4 torch-button-wrapper" ref={wrapperRef}>
                    <button
                        onClick={handleAddToCart}
                        className="w-full py-2 flex items-center justify-center gap-2 font-semibold rounded-lg bg-yellow-400 hover:bg-black hover:text-white text-black transition-colors duration-300"
                    >
                        <FiShoppingCart className="text-lg" />
                        Add to Cart
                    </button>

                    {/* Torch Effect */}
                    <div className="torchlight absolute inset-0 pointer-events-none" ref={lightRef}></div>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/900/900791.png"
                        alt="torch"
                        className="torch-icon pointer-events-none absolute w-6 h-6 transition-opacity duration-300"
                        ref={iconRef}
                    />
                </div>
            </div>
        </div>
    );
}

export default BookCard;
