import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUsers, setLoadingUsers } from "../redux/userSlice";
import store from "../redux/store.js";

const useGetOtherUsers = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((store) => store.user);
  const { socket } = useSelector((store) => store.socket);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  
  useEffect(() => {
    if (!authUser) {
      dispatch(setOtherUsers([]));
      return;
    }

    const fetchUsers = async () => {
      dispatch(setLoadingUsers(true));
      try {
        const res = await axios.get(`${API_URL}/api/v1/user/other`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        });
        dispatch(setOtherUsers(res.data.data || []));
      } catch (error) {
        console.error("Error fetching users:", error);
        dispatch(setOtherUsers([]));
      } finally {
        dispatch(setLoadingUsers(false));
      }
    };
    fetchUsers();
  }, [authUser, dispatch]);

  // Listen for new user registrations
  useEffect(() => {
    if (!socket || !authUser) return;

    const handleNewUser = (newUser) => {
      // Don't add the current user to the list
      if (newUser._id === authUser._id) return;
      
      // Get current state directly from store
      const state = store.getState();
      const currentUsers = state.user.otherUsers || [];
      const usersArray = Array.isArray(currentUsers) ? currentUsers : [];
      const userExists = usersArray.some(user => user._id === newUser._id);
      
      if (!userExists) {
        dispatch(setOtherUsers([...usersArray, newUser]));
      }
    };

    socket.on("newUser", handleNewUser);

    return () => {
      socket.off("newUser", handleNewUser);
    };
  }, [socket, authUser, dispatch]);
};

export default useGetOtherUsers;
