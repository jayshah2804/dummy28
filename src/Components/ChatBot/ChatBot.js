import React, { useState } from "react";
import ChatBotImage from "../../Assets/chatBot.jpg";
import "./ChatBot.css";

const ChatBot = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  return (
    <div className="chatbot-container">
      {isChatbotOpen && <div className="main-body"></div>}
      <img
        src={ChatBotImage}
        onClick={() => setIsChatbotOpen((prev) => !prev)}
      />
    </div>
  );
};

export default ChatBot;
