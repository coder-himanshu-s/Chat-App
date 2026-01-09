import React, { useEffect, useRef } from "react";
import Message from "./Message";
import useGetMessages from "../hooks/useGetMessages";
import { useSelector } from "react-redux";
import useGetRealTimeMessage from "../hooks/useGetRealTimeMessage";
import axios from "axios";

const Messages = () => {
  useGetMessages();
  useGetRealTimeMessage();

  const { messages, isLoading } = useSelector((store) => store.message);
  const { selectedUser, authUser } = useSelector((store) => store.user);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const hasMarkedAsSeen = useRef(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && messages && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Mark messages as seen when viewing them
  useEffect(() => {
    if (!selectedUser || !authUser || !messages || messages.length === 0) {
      hasMarkedAsSeen.current = false;
      return;
    }

    // Check if there are unread messages from selectedUser
    const unreadMessages = messages.filter(
      msg => msg.senderId === selectedUser._id && 
              msg.receiverId === authUser._id && 
              msg.status !== "seen"
    );

    if (unreadMessages.length > 0 && !hasMarkedAsSeen.current) {
      hasMarkedAsSeen.current = true;
      const markAsSeen = async () => {
        try {
          const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
          await axios.put(
            `${API_URL}/api/v1/message/seen/${selectedUser._id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
              withCredentials: true,
            }
          );
        } catch (error) {
          console.error("Error marking messages as seen:", error);
        }
      };
      
      // Small delay to ensure user is actually viewing
      const timer = setTimeout(markAsSeen, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedUser, authUser, messages]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-md text-indigo-600"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Loading messages...</p>
        </div>
      </div>
    );
  }

  // Show empty state only after loading is complete
  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center px-4">Select a user to start chatting</p>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center px-4">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  // Helper to format date as 'Today', 'Yesterday', or readable date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  let lastDate = null;

  return (
    <div ref={messagesContainerRef} className="px-2 sm:px-4 flex-1 overflow-y-auto space-y-2 py-2">
      {messages.map((message, index) => {
        const messageDate = formatDate(message.createdAt);
        const showDateSeparator = messageDate !== lastDate;
        if (showDateSeparator) {
          lastDate = messageDate;
        }

        return (
          <div key={message._id || index}>
            {showDateSeparator && (
              <div className="flex justify-center my-3">
                <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-100 px-3 py-1 rounded-full text-xs sm:text-sm shadow">
                  {messageDate}
                </span>
              </div>
            )}
            <Message message={message} />
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
