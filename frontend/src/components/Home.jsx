import React from "react";
import Sidebar from "./Sidebar";
import Message from "./MessContainer";

const Home = () => {
  return (
    <div className="flex rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop:filter backdrop-blur-lg bg-opacity-0">
      <Sidebar />
      <Message />
    </div>
  );
};

export default Home;
