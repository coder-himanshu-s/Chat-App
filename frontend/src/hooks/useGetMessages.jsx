import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages, setLoading } from "../redux/messageSlice";

const useGetMessages = () => {
  const { selectedUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser?._id) {
        dispatch(setMessages([]));
        return;
      }
      
      dispatch(setLoading(true));
      try {
        const res = await axios.get(
          `${API_URL}/api/v1/message/getm/${selectedUser?._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            withCredentials: true,
          }
        );
        dispatch(setMessages(res?.data?.data?.messages || []));
      } catch (error) {
        console.error("Error fetching messages:", error);
        dispatch(setMessages([]));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchMessages();
  }, [selectedUser, dispatch]);
};

export default useGetMessages;
