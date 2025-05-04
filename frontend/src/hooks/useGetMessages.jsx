import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const useGetMessages = () => {
  const { selectedUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";


  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser?._id) {
        console.log("No user selected yet, not fetching messages");
        return; // 🛑 Stop if no user selected
      }
      try {
        const res = await axios.get(
          `${API_URL}/api/v1/message/getm/${selectedUser?._id}` ,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            withCredentials: true,
          }
        );
        // console.log(res);
        console.log(res?.data?.data?.messages);
        dispatch(setMessages(res?.data?.data?.messages || []))
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, [selectedUser]);
};

export default useGetMessages;
