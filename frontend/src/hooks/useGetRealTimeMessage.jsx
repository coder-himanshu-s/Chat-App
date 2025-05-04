import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const useGetRealTimeMessage = () => {
  const { socket } = useSelector((store) => store.socket);
  const { messages } = useSelector((store) => store.message);
  const { selectedUser, authUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      const isRelevant =
        (newMessage.senderId === selectedUser?._id && newMessage.receiverId === authUser?._id) ||
        (newMessage.receiverId === selectedUser?._id && newMessage.senderId === authUser?._id);

      if (isRelevant) {
        dispatch(setMessages([...(messages || []), newMessage]));
      }
    };

    socket?.on("newMessage", handleNewMessage);

    return () => {
      socket?.off("newMessage", handleNewMessage);
    };
  }, [messages, selectedUser, authUser, socket, dispatch]);
};

export default useGetRealTimeMessage;
