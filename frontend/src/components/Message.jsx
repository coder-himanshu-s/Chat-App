import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ImageModal from "./ImageModal";

const Message = ({ message }) => {
  const scroll = useRef();
  const { authUser, selectedUser } = useSelector((store) => store.user);
  const [showModal, setShowModal] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showFile, setShowFile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const formattedTime = new Date(message?.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isSentByAuthUser = authUser?._id === message?.senderId;
  const isImageFile = message?.file?.match(/\.(jpg|jpeg|png|webp)$/i);
  const isVideoFile = message?.file?.match(/\.(mp4|webm|ogg)$/i);
  const isAudioFile = message?.file?.match(/\.(mp3|wav|webm|m4a)$/i);
  const fileExtension = message?.file?.split(".").pop();
  const fileType = fileExtension ? fileExtension.toUpperCase() : "";

  const getFileTypeLabel = () => {
    if (isImageFile) return "Image";
    if (isVideoFile) return "Video";
    if (isAudioFile) return "Audio";
    if (fileType) return `${fileType} File`;
    return "File";
  };

  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div
      ref={scroll}
      className={`chat ${isSentByAuthUser ? "chat-end" : "chat-start"} px-2 py-1 md:px-4 md:py-2`}
    >
      <div className="chat-image avatar">
        <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
          <img
            alt="User avatar"
            className="object-cover w-full h-full"
            src={
              isSentByAuthUser
                ? authUser?.profilePhoto
                : selectedUser?.profilePhoto
            }
          />
        </div>
      </div>

      <div className="chat-header text-sm text-gray-700 dark:text-gray-300 font-medium">
        {isSentByAuthUser ? authUser?.fullName : selectedUser?.fullName}
        <time className="ml-2 text-xs opacity-60 dark:text-gray-400">
          {formattedTime}
        </time>
      </div>

      <div
        className={`chat-bubble break-words p-3 rounded-lg shadow max-w-xs md:max-w-md transition-all ${
          isSentByAuthUser
            ? "bg-blue-200 text-blue-900 dark:bg-blue-600 dark:text-white"
            : "bg-slate-100 text-gray-800 dark:bg-gray-700 dark:text-white"
        }`}
      >
        {message?.message && <p className="whitespace-pre-wrap">{message.message}</p>}

        {message?.file && (
          <div className="mt-3 space-y-3">
            {/* Image */}
            {isImageFile && (
              <>
                <img
                  src={message.file}
                  alt="sent"
                  onClick={() => setShowModal(true)}
                  className="w-40 h-auto rounded-md cursor-pointer hover:brightness-90 border border-gray-300 dark:border-gray-600"
                />
                <ImageModal
                  isOpen={showModal}
                  onClose={() => setShowModal(false)}
                  imageUrl={message.file}
                />
              </>
            )}

            {/* Video */}
            {isVideoFile && !isAudioFile && (
              <>
                {!showVideo ? (
                  <div
                    onClick={() => setShowVideo(true)}
                    className="w-40 h-24 bg-black flex items-center justify-center text-white text-sm font-semibold rounded-md cursor-pointer hover:bg-gray-900"
                  >
                    ▶️ Tap to Play
                  </div>
                ) : (
                  <video
                    src={message.file}
                    controls
                    className="w-64 rounded-md border border-gray-300 dark:border-gray-600"
                  />
                )}
              </>
            )}

            {/* Audio */}
            {isAudioFile && (
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleAudioPlayback}
                  className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  aria-label={isPlaying ? "Pause Audio" : "Play Audio"}
                >
                  {isPlaying ? (
                    <span className="text-lg">⏸️</span>
                  ) : (
                    <span className="text-lg">▶️</span>
                  )}
                </button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {getFileTypeLabel()} Message
                </span>
                <audio
                  ref={audioRef}
                  src={message.file}
                  onEnded={handleAudioEnded}
                  preload="auto"
                  className="hidden"
                />
              </div>
            )}

            {/* Other Files */}
            {!isImageFile && !isVideoFile && !isAudioFile && (
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  📎 {getFileTypeLabel()}
                </div>
                {!showFile ? (
                  <button
                    onClick={() => setShowFile(true)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Tap to View
                  </button>
                ) : (
                  <a
                    href={message.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Open File
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="chat-footer text-xs opacity-60 dark:text-gray-400">
        Delivered
      </div>
    </div>
  );
};

export default Message;
