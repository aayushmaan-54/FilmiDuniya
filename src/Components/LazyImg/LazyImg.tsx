import { useState } from "react";
import "./LazyImg.css";

interface LazyImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  className: string;
}

const LazyImg = ({ src, alt, placeholderSrc, className, ...props }: LazyImgProps) => {

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative w-full h-full">
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse">
          {placeholderSrc && (
            <img
              src={placeholderSrc}
              alt={alt}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setImageLoaded(true)}
        {...props}
        loading="lazy"
      />
    </div>
  );
}

export default LazyImg;