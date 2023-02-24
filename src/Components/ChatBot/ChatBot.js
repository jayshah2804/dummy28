import React, { useEffect, useState } from "react";
import ChatBotImage from "../../Assets/chatBotNew.png";
import customerSupportImage from "../../Assets/customer_support.jpg";
import cancelImage from "../../Assets/crossIcon.png";
import "./ChatBot.css";
import { AiOutlineSend } from "react-icons/ai";

let answers = {
  start: "Hey, What can I do for you?",
  greet: "Hey",
  route:
    "https://www.youtube.com/watch?v=eM8Mjuq4MwQ&list=RDeM8Mjuq4MwQ&start_radio=1",
  default: " I am really sorry. I don't know how to do this",
};

const ChatBot = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatBotText, setChatBotText] = useState([]);
  const [isPopupTextCanceled, setIsPopupTextCanceled] = useState(true);

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
    answers.greet = ", " + sessionStorage.getItem("adminName");
    let a = structuredClone(chatBotText);
    let enteredValue = document.getElementById("chatInput").value;
    a.push(enteredValue);
    document.getElementById("chatInput").value = "";

    let keys = Object.keys(answers);
    for (let i = 0; i < keys.length; i++) {
      if (enteredValue.toLowerCase().includes(keys[i])) {
        a.push(answers[keys[i]]);
        break;
      } else if (/hi|hello|hey/.test(enteredValue.toLowerCase())) {
        a.push(answers.greet);
        break;
      }
      if (i === keys.length - 1) {
        a.push(answers.default);
      }
    }
    setTimeout(() => {
      document
        .getElementById("chat")
        .scrollTo(0, document.getElementById("chat").scrollHeight);
    });
    setChatBotText(a);
  };

  return (
    <div className="chatbot-container">
      {isChatbotOpen && (
        <div className="main-body">
          <div className="chat-header">
            <div>
              <img src={customerSupportImage} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: "14px" }}>LittleBot</p>
              <p
                style={{
                  fontSize: "10px",
                  color: "#ffffffd9",
                  marginTop: "-3px",
                }}
              >
                Online
              </p>
            </div>
          </div>
          <div className="chat" id="chat">
            {chatBotText.length > 0 &&
              chatBotText.map((ele, i) =>
                ele.includes("https") ? (
                  <p className={i % 2 === 0 ? "leftChat" : "rightChat"}>
                    <a href={ele} target="_blank">
                      Click here to learn
                    </a>
                  </p>
                ) : (
                  <p className={i % 2 === 0 ? "leftChat" : "rightChat"}>
                    {ele}
                  </p>
                )
              )}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              id="chatInput"
              placeholder="Type your message"
              onKeyDown={(e) =>
                e.key === "Enter" ? chatInputEnteredClick() : ""
              }
            />
            <AiOutlineSend
              className="sendIcon"
              onClick={chatInputEnteredClick}
            />
          </div>
        </div>
      )}
      {/* {isPopupTextCanceled && (
        <p className="popup-text">
          <span>
            Hey {sessionStorage.getItem("adminName")}, click here if you have
            questions{" "}
          </span>
          <span
            style={{ marginLeft: "20px", cursor: "pointer" }}
            onClick={() => setIsPopupTextCanceled(false)}
          >
            X
          </span>
        </p>
      )} */}
      <img
        src={ !isChatbotOpen ? ChatBotImage : cancelImage}
        onClick={() => setIsChatbotOpen((prev) => !prev)}
      />
    </div>
  );
};

export default ChatBot;
