import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
// const bcrypt = require('bcrypt');

const saltRounds = 10;
let jay = 0;
let isValid = false;
const ConfirmPassword = (props) => {
  const newPassRef = useRef();
  const confirmPassRef = useRef();
  const [isCall, setIsCall] = useState();
  const [isResponse, setIsResponse] = useState();
  const [isError, setIsError] = useState();

  useEffect(() => {
    function myFunc() {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        emailID: props.email,
        otpNumber: "",
        isOtpVerified: "1",
        newPassword: newPassRef.current.value,
        confirmPassword: confirmPassRef.current.value
      })

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch("/api/v1/Authentication/SetNewPassword", requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result).Message === "Success" ? setIsResponse("success") : setIsResponse("fail"))
        .catch(error => setIsResponse("fail"));
    }
    if (jay > 1)
      myFunc();
    jay++;
  }, [isCall]);

  const passwordChangedHandler = (e) => {
    e.preventDefault();
    if (newPassRef.current.value !== confirmPassRef.current.value || !newPassRef.current.value) {
      isValid = false;
      setIsError("Password does not match");
    }
    else if (newPassRef.current.value.length < 8) {
      isValid = false;
      setIsError("Password must be of length 8");
    }
    else isValid = true;
    if (isValid)
      setIsCall(prev => !prev);
  }

  if (isResponse === "success") {
    props.forgotPassword(false);
  }

  return (
    <div id="form">
      {isResponse === "fail" && <p style={{color: "red"}}>Some error occured, please try again later!</p>}
      {isError && <p style={{color: "red"}}>{isError}</p>}
      <input type="password" placeholder="Enter New Password" ref={newPassRef} id="input" />
      <input type="password" placeholder="Confirm New Password" ref={confirmPassRef} id="input" />
      <input
        type="submit"
        value="Go to Login Page"
        id="loginButton"
        onClick={passwordChangedHandler}
      />
    </div>
  );
};

export default ConfirmPassword;

//git push origin HEAD:refs/heads/<origin>