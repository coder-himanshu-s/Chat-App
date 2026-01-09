import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Sign";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import axios from "axios";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers, setAuthUser } from "./redux/userSlice";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />}></Route>
      <Route path="signup" element={<Signup />}></Route>
      <Route path="login" element={<Login />}></Route>
    </Route>
  )
);

function App() {
  const { authUser } = useSelector((store) => store.user);
  const { socket } = useSelector((store) => store.socket);
  const socketURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  // Restore auth state on app load if token exists but user not in state
  useEffect(() => {
    const restoreAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token && !authUser) {
        try {
          const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
          const res = await axios.get(`${API_URL}/api/v1/user/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          });
          if (res.data.success) {
            dispatch(setAuthUser(res.data.data));
          } else {
            localStorage.removeItem("accessToken");
          }
        } catch (error) {
          console.error("Auth restoration failed:", error);
          localStorage.removeItem("accessToken");
        }
      }
      setIsInitialized(true);
    };
    restoreAuth();
  }, [authUser, dispatch]);

  useEffect(() => {
    if (authUser) {
      const socketio = io(socketURL, {
        query: {
          userId: authUser._id,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling'],
      });
      
      dispatch(setSocket(socketio));

      socketio.on("connect", () => {
        console.log("Socket connected:", socketio.id);
      });

      socketio.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      socketio.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [authUser]);
  return (
    <div className="h-screen w-full overflow-hidden">
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
