import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";
const useGetOtherUsers = () => {
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get( `${API_URL}/api/v1/user/other`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        });
        console.log("from getOtherusers",res);
        dispatch(setOtherUsers(res.data.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);
};

export default useGetOtherUsers;
