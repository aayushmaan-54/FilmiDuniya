import "./StarRating.css";

const Star = ({ fill }: { fill: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="star-rating"
  >
    <defs>
      <linearGradient id={`star-fill-${fill}`}>
        <stop offset={`${fill}%`} stopColor="#FFD700" />
        <stop offset={`${fill}%`} stopColor="#E0E0E0" />
      </linearGradient>
    </defs>
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill={`url(#star-fill-${fill})`}
    />
  </svg>
);


const StarRating = ({ rating }: { rating: number }) => {
  const clampedRating = Math.max(0, Math.min(10, rating));
  const ratingOutOf5 = clampedRating / 2;

  return (
    <div className="flex">
      {[0, 1, 2, 3, 4].map((index) => {
        const fillPercentage = Math.max(0, Math.min(100, (ratingOutOf5 - index) * 100));
        return <Star key={index} fill={fillPercentage} />;
      })}
    </div>
  );
};

export default StarRating;