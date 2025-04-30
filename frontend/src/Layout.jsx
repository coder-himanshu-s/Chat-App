import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

function Layout() {
  return (
    <div className="pt-16 min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar className="fixed top-0 left-0 right-0 z-50" />
      <Outlet />
    </div>
  );
}

export default Layout;
