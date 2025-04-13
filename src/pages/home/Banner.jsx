import React, { useEffect, useRef } from 'react';
import bannerImg from "../../assets/banner2.png";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Banner() {
  const navigate = useNavigate();

  const wrapperRef = useRef();
  const lightRef = useRef();
  const iconRef = useRef();

  const handleReadNow = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/books/random')
      const randomBook = res.data;
      navigate(`/books/${randomBook._id}`);
    } catch (err) {
      console.error('Error fetching random book:', err);
    }
  };

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

  return (
    <div className='flex flex-col md:flex-row py-16 justify-between items-center gap-10'>
      <div className='md:w-1/2 w-full flex items-center md:justify-reverse'>
        <img src={bannerImg} alt="banner" />
      </div>

      <div className='md:w-1/2 w-full'>
        <h1 className='md:text-5xl text-2xl font-medium mb-7'>Welcome to Bookify</h1>
        <p className='mb-10'>
          Bookify is a book reading website that allows you to get a taste of what a book is <span className='font-bold'>Before</span> you buy it,
          Leave comments on how much you enjoyed the book, and save the book to favourites.
        </p>

        <div className="torch-button-wrapper" ref={wrapperRef}>
          <button
            onClick={handleReadNow}
            className="torch-button bg-black text-white px-12 py-2 rounded-md text-base font-sans font-bold transition-all duration-200 cursor-pointer"
          >
            Read Now
          </button>
          <div className="torchlight" ref={lightRef}></div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/900/900791.png"
            className="torch-icon"
            ref={iconRef}
            alt="torch"
          />
        </div>
      </div>
    </div>
  );
}

export default Banner;