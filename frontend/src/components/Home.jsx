import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Message from "./MessContainer";
import { FiMenu, FiX } from "react-icons/fi";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex items-center justify-center w-full h-[calc(100vh-4rem)] px-1 sm:px-2 md:px-4">
      <div className="flex w-full max-w-7xl h-full rounded-lg overflow-hidden shadow-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 relative">
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-[4.5rem] left-2 z-50 p-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar: responsive width */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:relative z-40 md:z-auto w-64 sm:w-72 md:w-1/3 lg:w-1/4 h-full border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out`}
        >
          <Sidebar onUserSelect={() => setSidebarOpen(false)} />
        </div>
        
        {/* Message: scrollable */}
        <div className="w-full md:w-2/3 lg:w-3/4 h-full">
          <Message />
        </div>
        
      </div>
    </div>
  );
};

export default Home;
