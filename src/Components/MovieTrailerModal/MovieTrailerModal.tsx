import { Close } from "../../assets/SvgIcons";
import "./MovieTrailerModal.css";

interface MovieTrailerModalType {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

const MovieTrailerModal = ({ isOpen, onClose, videoId }: MovieTrailerModalType) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute -top-8 right-0 text-white hover:text-gray-300 transition-colors"
          aria-label="Close"
        >
          <Close className="w-6 h-6" />
        </button>
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default MovieTrailerModal;