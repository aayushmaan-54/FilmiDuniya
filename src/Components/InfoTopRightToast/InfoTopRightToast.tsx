/* eslint-disable react-hooks/exhaustive-deps */
import {
  useState,
  useEffect
} from 'react';

import {
  Close,
  Info
} from '../../Global/exports';

import "./InfoTopRightToast.css";

type InfoTopRightToastType = {
  message: string,
  duration: number,
  onClose?: () => void
}


const InfoTopRightToast = ({ message, duration = 5000, onClose }: InfoTopRightToastType) => {

  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      handleClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-[300px]">
      <div
        className={`bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg relative transition-all duration-300 ease-in-out transform
          ${isLeaving ? 'animate-slideOut' : 'animate-slideIn'}`}
      >
        <div className="font-medium pt-3 pb-1 pr-6 flex items-center gap-2">
          <Info className="w-5 h-5" />
          <span>{message}</span>
        </div>
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-white hover:text-white/80 focus:outline-none"
        >
          <Close className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default InfoTopRightToast;