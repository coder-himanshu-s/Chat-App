import axios from "axios";
import React, { useState } from "react";
import { BiSend } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const SendInput = () => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.user);
  const receiverId = selectedUser?._id;
  const { messages } = useSelector((store) => store.message);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/message/send/${receiverId}`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      );

      dispatch(setMessages([...messages, res?.data?.data]));
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="flex items-center px-4 py-3 bg-white dark:bg-gray-800 rounded-b-lg" onSubmit={onSubmitHandler}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Send a message..."
        className="w-full px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500"
      />
      <button type="submit" className="ml-3 text-xl text-indigo-600 dark:text-indigo-400">
        <BiSend />
      </button>
    </form>
  );
};

export default SendInput;
