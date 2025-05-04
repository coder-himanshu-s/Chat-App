import React from "react";
import Sidebar from "./Sidebar";
import Message from "./MessContainer";

const Home = () => {
  return (
    <div className="flex items-center justify-center w-screen h-[calc(100vh-4rem)]">
      {/* 4rem is 64px – height of the fixed navbar */}
      <div className="flex w-full max-w-5xl h-full rounded-lg overflow-hidden shadow-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
        
        {/* Sidebar: fixed width */}
        <div className="w-1/3 h-full border-r border-gray-300 dark:border-gray-700">
          <Sidebar />
        </div>

        {/* Message: scrollable */}
        <div className="w-2/3 h-full overflow-y-auto">
          <Message />
        </div>
        
      </div>
    </div>
  );
};

export default Home;
