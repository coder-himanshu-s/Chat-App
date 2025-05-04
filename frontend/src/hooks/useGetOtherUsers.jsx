import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";
const useGetOtherUsers = () => {
  const dispatch = useDispatch();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get( `${API_URL}/api/v1/user/other`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        });
        // console.log(res);
        dispatch(setOtherUsers(res.data.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);
};

export default useGetOtherUsers;
