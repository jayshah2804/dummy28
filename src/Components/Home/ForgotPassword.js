import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { MdArrowBack } from "react-icons/md";

import ConfirmPassword from "./ConfirmPassword";
import classes from "./ForgotPassword.module.css";
import OtpVerification from "./OtpVerification";

let buttonValue = "Send OTP";
let jay = 0;
let apiMsg = "";
let flag = false;
let OTP = "";
const ForgotPassword = (props) => {
  const [isSendOtpClicked, setIsSendOtpClicked] = useState(false);
  const [isVerifyClicked, setIsVerifyClicked] = useState();
  const [isCall, setIsCall] = useState();
  const [isResponse, setIsResponse] = useState();
  const [isError, setIsError] = useState();
  const emailInputRef = useRef();
  const otpInputRef = useRef();

  useEffect(() => {
    function myFunc() {
      // console.log("loading...");
      // buttonValue = "Loading..."
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        emailID: emailInputRef.current.value,
        eventID: "1"
      })

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch('/api/v1/Authentication/AuthenticateOTP', requestOptions)
        .then(response => response.text())
        .then(result => {
          OTP = JSON.parse(result).OTP;
          JSON.parse(result).Message === "Success" ? setIsResponse("success") : setIsResponse("fail")
        })
        .catch(error => console.log('error', error));
      // console.log("loading completed");
    }
    if (jay > 1)
      myFunc();
    jay++;
  }, [isCall]);

  if (!flag) {
    if (isResponse === "success") {
      setTimeout(() => {
        buttonValue = "Verify";
        // alert("1");
        setIsSendOtpClicked(true);
      })
      flag = true;
    }
  }

  const sendOtpClickHandler = (e) => {
    e.preventDefault();
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      emailInputRef?.current?.value
    )) {
      if (buttonValue === "Verify") {
        alert(OTP);
        if (otpInputRef.current.value == OTP) {
          setIsVerifyClicked(true);
          buttonValue = "Go to Login Page";
          setIsError("");
        } else setIsError("Wrong OTP");
      } else {
        setIsCall(prev => !prev);
        flag = false;
        // buttonValue = "Verify";
        // setIsSendOtpClicked(true);
        setIsError("");
      }
    } else {
      setIsError("Please Enter Valid Email");
    }
  };
  const backClickHandler = () => {
    if (buttonValue === "Send OTP") {
      props.forgotPassword(false);
    } else if (buttonValue === "Verify") {
      setIsVerifyClicked(false);
      setIsSendOtpClicked(false);
      buttonValue = "Send OTP";
    } else if (buttonValue === "Go to Login Page") {
      buttonValue = "Send OTP";
      setIsSendOtpClicked(false);
      setIsVerifyClicked(false);
    }
  };
  return (
    <div>
      {/* <MdArrowBack
        className={classes.backArrow}
        onClick={backClickHandler}
      /> */}
      {isResponse === "fail" && <p style={{ color: "red" }}>Email does not Exist</p>}
      {isError && <p style={{ color: "red" }}>{isError}</p>}
      {!isVerifyClicked && (
        <div id="form">
          <input
            type="text"
            placeholder="Enter Your Registered Email"
            id="input"
            ref={emailInputRef}
          />
          {console.log(isSendOtpClicked)}
          {isSendOtpClicked && (
            <input type="number" placeholder="Enter OTP" id="input" ref={otpInputRef} />
            // <OtpVerification />
          )}
          <input
            type="submit"
            value={buttonValue}
            id="loginButton"
            onClick={sendOtpClickHandler}
          />
        </div>
      )}
      {isVerifyClicked && (
        <ConfirmPassword email={emailInputRef.current.value} forgotPassword={props.forgotPassword} />
      )}
    </div>
  );
};

export default ForgotPassword;
