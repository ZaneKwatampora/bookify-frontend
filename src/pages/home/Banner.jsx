import React, { useEffect, useRef } from 'react';
import bannerImg from "../../assets/banner2.png";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Banner.css';

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

  const bgRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 30;
      const y = (e.clientY / innerHeight - 0.5) * 30;
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      {/* <div className="parallax-background" ref={bgRef}></div> */}
      <div className="md:w-1/2 w-full flex items-center justify-center md:justify-end relative z-10 mb-8 md:mb-0">
        {/* Blurred background behind the image */}
        <div className="absolute inset-0 z-[-1] scale-110 blur-md opacity-50">
          <img src={bannerImg} alt="banner blurred" className="w-full h-full object-cover" />
        </div>

        {/* Foreground image */}
        <img src={bannerImg} alt="banner" className="max-w-full h-auto relative z-10" />
      </div>

      <div className="relative z-10 md:w-1/2 w-full bg-black/50 p-8 rounded-lg backdrop-blur-sm">
        <h1 className="md:text-5xl text-2xl font-medium mb-7 text-white">Welcome to Bookify</h1>
        <p className="mb-10 text-white">
          Bookify is a book library website that allows you to get a taste of what a book is <span className="font-bold">Before</span> you buy it,
          Leave comments on how much you enjoyed the book, and save the book to favourites.
        </p>

        <div className="torch-button-wrapper" ref={wrapperRef}>
          <button
            onClick={handleReadNow}
            className="torch-button bg-yellow-400 text-black px-12 py-2 rounded-lg text-base font-sans font-bold transition-all duration-200 cursor-pointer hover:rounded-lg"
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