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
  return (
    <div className="p-4 h-screen flex items-center">
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
