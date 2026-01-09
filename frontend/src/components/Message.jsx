import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ImageModal from "./ImageModal";
import { getOptimizedProfilePhoto, getOptimizedMessageImage, getOptimizedFullImage } from "../utils/imageOptimizer";

const Message = ({ message }) => {
  const scroll = useRef();
  const { authUser, selectedUser } = useSelector((store) => store.user);
  const [showModal, setShowModal] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showFile, setShowFile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
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
      className={`flex ${isSentByAuthUser ? "justify-end" : "justify-start"} px-2 py-1 sm:px-4 sm:py-2`}
    >
      <div className={`flex gap-2 max-w-[85%] sm:max-w-md ${isSentByAuthUser ? "flex-row-reverse" : "flex-row"}`}>
        <div className="flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-gray-200 dark:ring-gray-700 bg-gray-200 dark:bg-gray-700">
            {/* Removed loader spinner; avatar will appear once loaded */}
            <img
              alt="User avatar"
              className={`object-cover w-full h-full ${avatarLoaded ? 'block' : 'hidden'}`}
              src={(() => {
                const photo = isSentByAuthUser
                  ? authUser?.profilePhoto
                  : selectedUser?.profilePhoto;
                const name = isSentByAuthUser
                  ? authUser?.fullName
                  : selectedUser?.fullName;

                if (!photo) {
                  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=6366f1&color=fff&size=128`;
                }
                return getOptimizedProfilePhoto(photo, 80) || photo;
              })()}
              loading="lazy"
              decoding="async"
              onLoad={() => setAvatarLoaded(true)}
            />
          </div>
        </div>

        <div className={`flex flex-col ${isSentByAuthUser ? "items-end" : "items-start"}`}>
          {/* <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 px-1">
            {isSentByAuthUser ? authUser?.fullName : selectedUser?.fullName}
          </div> */}

          <div
            className={`break-words p-2 sm:p-3 rounded-lg shadow transition-all relative ${
              isSentByAuthUser
                ? "bg-indigo-500 text-white dark:bg-indigo-600 rounded-tr-none"
                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-tl-none"
            }`}
          >
            <div className="pr-12 sm:pr-14">
              {message?.message && <p className="whitespace-pre-wrap text-sm sm:text-base">{message.message}</p>}

              {message?.file && (
                <div className="mt-2 space-y-2">
                {/* Image */}
                {isImageFile && (
                  <>
                    <img
                      src={getOptimizedMessageImage(message.file, 400) || message.file}
                      alt="sent"
                      onClick={() => setShowModal(true)}
                      className="w-40 sm:w-48 h-auto rounded-md cursor-pointer hover:brightness-90 border border-gray-300 dark:border-gray-600"
                      loading="lazy"
                      decoding="async"
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
                        className="w-40 sm:w-48 h-24 sm:h-32 bg-black flex items-center justify-center text-white text-xs sm:text-sm font-semibold rounded-md cursor-pointer hover:bg-gray-900"
                      >
                        ▶️ Tap to Play
                      </div>
                    ) : (
                      <video
                        src={message.file}
                        controls
                        className="w-full max-w-xs sm:max-w-sm rounded-md border border-gray-300 dark:border-gray-600"
                      />
                    )}
                  </>
                )}

                {/* Audio */}
                {isAudioFile && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={toggleAudioPlayback}
                      className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      aria-label={isPlaying ? "Pause Audio" : "Play Audio"}
                    >
                      {isPlaying ? (
                        <span className="text-base sm:text-lg">⏸️</span>
                      ) : (
                        <span className="text-base sm:text-lg">▶️</span>
                      )}
                    </button>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">
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
                    <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">
                      📎 {getFileTypeLabel()}
                    </div>
                    {!showFile ? (
                      <button
                        onClick={() => setShowFile(true)}
                        className="px-3 py-1 text-xs sm:text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        Tap to View
                      </button>
                    ) : (
                      <a
                        href={message.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm underline text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Open File
                      </a>
                    )}
                  </div>
                )}
                </div>
              )}
            </div>
            
            {/* Message Status and Time - WhatsApp style at bottom right corner */}
            <div className="absolute bottom-1 right-1 flex items-center gap-0.5">
              <span className="text-[10px] opacity-75 whitespace-nowrap">
                {formattedTime}
              </span>
              {isSentByAuthUser && (
                <span className="flex items-center ml-0.5">
                  {message.status === "seen" ? (
                    // Double tick blue - Seen (WhatsApp style)
                    <span className="flex items-center" title="Seen">
                      <svg className="w-3 h-3 text-blue-200 dark:text-blue-300" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                      </svg>
                      <svg className="w-3 h-3 -ml-0.5 text-blue-200 dark:text-blue-300" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                      </svg>
                    </span>
                  ) : message.status === "delivered" ? (
                    // Double tick gray/white - Delivered (WhatsApp style)
                    <span className="flex items-center" title="Delivered">
                      <svg className="w-3 h-3 text-white/70 dark:text-white/60" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                      </svg>
                      <svg className="w-3 h-3 -ml-0.5 text-white/70 dark:text-white/60" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                      </svg>
                    </span>
                  ) : (
                    // Single tick - Sent (not delivered yet)
                    <span className="flex items-center" title="Sent">
                      <svg className="w-3 h-3 text-white/60 dark:text-white/50" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                      </svg>
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
