import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages, updateMessageStatus, markMessagesAsSeen } from "../redux/messageSlice";

const useGetRealTimeMessage = () => {
  const { socket } = useSelector((store) => store.socket);
  const { messages } = useSelector((store) => store.message);
  const { selectedUser, authUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const messagesRef = useRef(messages);

  // Keep messagesRef updated
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!socket || !selectedUser || !authUser) return;

    const handleNewMessage = (newMessage) => {
      const isRelevant =
        (newMessage.senderId === selectedUser?._id && newMessage.receiverId === authUser?._id) ||
        (newMessage.receiverId === selectedUser?._id && newMessage.senderId === authUser?._id);

      if (isRelevant) {
        // Check if message already exists to prevent duplicates
        const messageExists = messagesRef.current?.some(
          (msg) => msg._id === newMessage._id
        );
        
        if (!messageExists) {
          dispatch(setMessages([...(messagesRef.current || []), newMessage]));
        }
      }
    };

    const handleStatusUpdate = (data) => {
      dispatch(updateMessageStatus(data));
    };

    const handleMessagesSeen = (data) => {
      // data.receiverId is the person who saw the messages (the other user)
      // We should update messages we (authUser) sent to that person (receiverId)
      // So we update if the receiverId matches selectedUser (the person we're chatting with)
      if (data.receiverId === selectedUser?._id) {
        dispatch(markMessagesAsSeen(data));
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageStatusUpdate", handleStatusUpdate);
    socket.on("messagesSeen", handleMessagesSeen);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageStatusUpdate", handleStatusUpdate);
      socket.off("messagesSeen", handleMessagesSeen);
    };
  }, [socket, selectedUser, authUser, dispatch]);
};

export default useGetRealTimeMessage;
