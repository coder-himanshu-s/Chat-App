import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";
const useGetOtherUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/user/other", {
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
