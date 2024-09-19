import React from "react";
import ChatWindow from "./components/ChatWindow";
import './index.css'; // Or App.css depending on where you put the Tailwind import
import './custom.css'; // Or App.css depending on where you put the Tailwind import


// This will be your main entry point when embedding the widget
const Widget = () => {
  return (
    <div className="w-screen h-screen bg-[#ff790020] relative">
      {/* ChatWindow positioned above everything else with fixed position */}
      <ChatWindow />
    </div>
  );
};

export default Widget;
