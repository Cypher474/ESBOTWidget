import React from "react";
import ReactDOM from "react-dom";
import Widget from "./App.jsx"; // or wherever your Widget component is

// Function to embed the widget on any page
const renderWidget = (selector) => {
  const container = document.querySelector(selector);
  if (container) {
    ReactDOM.render(<Widget />, container);
  }
};

// Expose the renderWidget function globally
window.renderESChatWidget = renderWidget;
