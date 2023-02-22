import React, { useEffect, useState } from "react";
import ChatBotImage from "../../Assets/chatBot.jpg";
import "./ChatBot.css";
import { AiOutlineSend } from "react-icons/ai";

let answers = {
  start: "Hey, What can I do for you?",
  greet: "Hey",
  route:
    "https://www.youtube.com/watch?v=eM8Mjuq4MwQ&list=RDeM8Mjuq4MwQ&start_radio=1",
};

const ChatBot = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatBotText, setChatBotText] = useState([]);

  useEffect(() => {
    if (isChatbotOpen && chatBotText.length < 1) {
      setTimeout(() => {
        let a = structuredClone(chatBotText);
        a.push(answers.start);
        setChatBotText(a);
      }, 1000);
    }
  }, [isChatbotOpen]);

  const chatInputEnteredClick = () => {
    let a = structuredClone(chatBotText);
    let enteredValue = document.getElementById("chatInput").value;
    a.push(enteredValue);
    document.getElementById("chatInput").value = "";

    let keys = Object.keys(answers);
    for (let i = 0; i < keys.length; i++) {
      if (enteredValue.includes(keys[i])) {
        a.push(answers[keys[i]]);
      }
    }
    setChatBotText(a);
  };

  return (
    <div className="chatbot-container">
      {isChatbotOpen && (
        <div className="main-body">
          <div className="chat">
            {chatBotText.length > 0 && chatBotText.map((ele) => <li>{ele}</li>)}
          </div>
          <div className="chat-footer">
            <input type="text" id="chatInput" />
            <AiOutlineSend
              className="sendIcon"
              onClick={chatInputEnteredClick}
            />
          </div>
        </div>
      )}
      <img
        src={ChatBotImage}
        onClick={() => setIsChatbotOpen((prev) => !prev)}
      />
    </div>
  );
};

export default ChatBot;
