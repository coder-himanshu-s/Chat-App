import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

function Layout() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="pt-16 min-h-[calc(100vh-4rem)]">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
