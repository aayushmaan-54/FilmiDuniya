import {
  useState,
  useEffect,
  useRef
} from 'react';

import {
  LeftArrow,
  RightArrow
} from '../../assets/SvgIcons';

import placeholderCast from "../../assets/images/placeholderPeople.webp";

import { CastType } from '../../Types/types';

import "./CarouselImg.css";

import { Link } from 'react-router-dom';

interface CarouselProps {
  cast: CastType[];
}


const Carousel = ({ cast }: CarouselProps) => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const itemsPerView = 3;
  const totalItems = cast.length;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerView) % totalItems);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - itemsPerView + totalItems) % totalItems);
  };

  useEffect(() => {
    if (carouselRef.current) {
      const scrollPosition = (currentIndex * carouselRef.current.offsetWidth) / itemsPerView;
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const difference = touchStartX.current - touchEndX.current;
    if (difference > 50) {
      nextSlide();
    } else if (difference < -50) {
      prevSlide();
    }
  };


  const renderCastMembers = () => {
    return [...cast, ...cast.slice(0, itemsPerView)].map((actor, index) => (
      <Link to={`/Actor/${actor?.id}`} key={index} className="flex-shrink-0 w-[200px] flex flex-col items-center mx-6 carousel-container">
        <div className="relative size-[200px] carousel-img">
          <img
            src={actor?.profile_path ? `https://image.tmdb.org/t/p/w200/${actor?.profile_path}` : placeholderCast}
            alt={actor?.name}
            className=" size-full object-cover rounded-full"
            loading='lazy'
          />
        </div>
        <div className="mt-2 text-center">
          <p className="font-semibold cast-details">{actor?.name}</p>
          <p className="text-sm text-gray-600 cast-details overflow-y-hidden">{actor?.character}</p>
        </div>
      </Link>
    ));
  };


  return (
    <section className='w-screen flex items-center justify-center'>
      <div className='w-[80vw]'>
        <div className="relative w-full overflow-hidden overflow-y-hidden">
          <div
            ref={carouselRef}
            className="flex overflow-x-hidden overflow-y-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {renderCastMembers()}
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-[100px] arrow-btn transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-colors"
          >
            <LeftArrow />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-[100px] arrow-btn transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-colors"
          >
            <RightArrow />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Carousel;