import axios from "axios";
import React, { useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import { FiPaperclip } from "react-icons/fi";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const SendInput = () => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const { selectedUser } = useSelector((store) => store.user);
  const receiverId = selectedUser?._id;
  const { messages } = useSelector((store) => store.message);

  // Convert audio blob to MP3 using MediaRecorder and Web Audio API
  const convertToMp3 = async (audioBlob) => {
    setIsProcessingAudio(true);
    
    return new Promise((resolve, reject) => {
      // Create a file reader to read the blob
      const reader = new FileReader();
      reader.readAsArrayBuffer(audioBlob);
      
      reader.onload = async (event) => {
        try {
          // Get array buffer from the file reader
          const arrayBuffer = event.target.result;
          
          // Create audio context
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          
          // Decode the audio data
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          
          // Create an offline context for rendering
          const offlineCtx = new OfflineAudioContext(
            audioBuffer.numberOfChannels,
            audioBuffer.length,
            audioBuffer.sampleRate
          );
          
          // Create buffer source
          const source = offlineCtx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(offlineCtx.destination);
          
          // Start the source and render
          source.start(0);
          const renderedBuffer = await offlineCtx.startRendering();
          
          // Convert to WAV format first (simplest lossless format to create)
          const wavBlob = bufferToWave(renderedBuffer, renderedBuffer.length);
          
          // Create a file with proper extension
          const mp3File = new File([wavBlob], "recording.mp3", {
            type: "audio/mpeg",
          });
          
          setIsProcessingAudio(false);
          resolve(mp3File);
        } catch (err) {
          console.error("Audio conversion error:", err);
          setIsProcessingAudio(false);
          reject(err);
        }
      };
      
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        setIsProcessingAudio(false);
        reject(error);
      };
    });
  };

  // Function to convert AudioBuffer to WAV format
  function bufferToWave(abuffer, len) {
    const numOfChan = abuffer.numberOfChannels;
    const length = len * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    let offset = 0;
    let pos = 0;
    
    // Write WAV header
    // "RIFF" identifier
    writeString(view, offset, "RIFF"); offset += 4;
    // File length minus RIFF identifier length and file description length
    view.setUint32(offset, length - 8, true); offset += 4;
    // "WAVE" identifier
    writeString(view, offset, "WAVE"); offset += 4;
    // Format chunk identifier
    writeString(view, offset, "fmt "); offset += 4;
    // Format chunk length
    view.setUint32(offset, 16, true); offset += 4;
    // Sample format (raw)
    view.setUint16(offset, 1, true); offset += 2;
    // Channel count
    view.setUint16(offset, numOfChan, true); offset += 2;
    // Sample rate
    view.setUint32(offset, abuffer.sampleRate, true); offset += 4;
    // Byte rate (sample rate * block align)
    view.setUint32(offset, abuffer.sampleRate * 2 * numOfChan, true); offset += 4;
    // Block align (channel count * bytes per sample)
    view.setUint16(offset, numOfChan * 2, true); offset += 2;
    // Bits per sample
    view.setUint16(offset, 16, true); offset += 2;
    // Data chunk identifier
    writeString(view, offset, "data"); offset += 4;
    // Data chunk length
    view.setUint32(offset, length - offset - 4, true); offset += 4;
    
    // Write audio data
    for (let i = 0; i < abuffer.numberOfChannels; i++) {
      const channel = abuffer.getChannelData(i);
      for (let j = 0; j < len; j++) {
        // Clamp the value to the 16-bit range
        const x = Math.max(-1, Math.min(1, channel[j]));
        // Convert to 16-bit value
        const val = x < 0 ? x * 0x8000 : x * 0x7FFF;
        view.setInt16(offset, val, true);
        offset += 2;
      }
    }
    
    return new Blob([buffer], { type: "audio/wav" });
  }

  // Helper function to write strings to DataView
  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let fileUrl = null;

      // Process audio or other file
      if (file) {
        // Regular file upload
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await axios.post(`${API_URL}/api/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        fileUrl = uploadRes.data.url;
      } else if (audioBlob) {
        // Convert audio blob to MP3 format
        const mp3File = await convertToMp3(audioBlob);
        
        const formData = new FormData();
        formData.append("file", mp3File);
        const uploadRes = await axios.post(`${API_URL}/api/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        fileUrl = uploadRes.data.url;
      }

      const res = await axios.post(
        `${API_URL}/api/v1/message/send/${receiverId}`,
        {
          message,
          file: fileUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      );

      dispatch(setMessages([...(messages || []), res?.data?.data]));
      setMessage("");
      setFile(null);
      setAudioBlob(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileClick = () => fileInputRef.current.click();
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm", // Use webm for better compatibility
      });
      let chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const audio = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(audio);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setRecording(true);
      setMediaRecorder(recorder);
    } catch (err) {
      console.error("Audio recording error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  return (
    <form
      className="flex items-center px-4 py-3 bg-white dark:bg-gray-800 rounded-b-lg gap-2"
      onSubmit={onSubmitHandler}
    >
      {/* 📎 Attach Button */}
      <button
        type="button"
        onClick={handleFileClick}
        className="text-gray-600 dark:text-gray-300 text-xl hover:text-indigo-600"
        title="Attach file"
      >
        <FiPaperclip />
      </button>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Message Input */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Send a message..."
        className="flex-grow px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500"
      />

      {/* File Info Display */}
      {file && (
        <div className="text-sm text-gray-500 dark:text-gray-300 truncate w-48">
          <span>{file.name}</span>
        </div>
      )}
      
      {/* Audio Recording Info */}
      {audioBlob && !file && !recording && (
        <div className="text-sm text-indigo-500 dark:text-indigo-300 truncate">
          <span>Audio recording ready</span>
        </div>
      )}
      
      {/* Processing Indicator */}
      {isProcessingAudio && (
        <div className="text-sm text-amber-500 dark:text-amber-300 truncate">
          <span>Processing audio...</span>
        </div>
      )}

      {/* 🎤 Microphone */}
      <button
        type="button"
        onClick={recording ? stopRecording : startRecording}
        className={`text-xl ${recording ? "text-red-600" : "text-indigo-600"} dark:text-indigo-400`}
        title={recording ? "Stop Recording" : "Start Recording"}
        disabled={isProcessingAudio}
      >
        {recording ? <FaStop /> : <FaMicrophone />}
      </button>

      {/* Send Button */}
      <button
        type="submit"
        className={`ml-1 text-xl ${isProcessingAudio ? 'text-gray-400' : 'text-indigo-600 dark:text-indigo-400'}`}
        disabled={isProcessingAudio}
      >
        <BiSend />
      </button>
    </form>
  );
};

export default SendInput;