import React from "react";
import { getOptimizedFullImage } from "../utils/imageOptimizer";

const ImageModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl font-bold z-60 bg-gray-600 rounded-full p-1 hover:bg-gray-700"
        >
          ✕
        </button>
        <img
          src={getOptimizedFullImage(imageUrl) || imageUrl}
          alt="Full View"
          className="max-w-full max-h-screen"
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
};

export default ImageModal;
