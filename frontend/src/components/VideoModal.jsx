import React from "react";

const VideoModal = ({ isOpen, onClose, videoUrl }) => {
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

        {/* Video */}
        <video
          src={videoUrl}
          controls
          className="max-w-full max-h-screen"
          autoPlay
        />

        {/* Optional Download Button */}
        <a
          href={videoUrl}
          download
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-indigo-600 text-white rounded-full"
        >
          Download Video
        </a>
      </div>
    </div>
  );
};

export default VideoModal;
