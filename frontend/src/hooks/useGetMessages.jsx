import axios from "axios";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const useGetMessages = () => {
  const { selectedUser } = useSelector((store) => store.user);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser?._id) {
        console.log("No user selected yet, not fetching messages");
        return; // 🛑 Stop if no user selected
      }
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/message/getm/${selectedUser?._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            withCredentials: true,
          }
        );
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, [selectedUser]);
};

export default useGetMessages;
