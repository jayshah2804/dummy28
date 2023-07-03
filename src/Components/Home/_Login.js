import React, { useEffect, useRef, useState } from 'react';
import classes from './Login.module.css';
import axios from "axios";

import littleImage from "../../Assets/Little_logo_login.png";

let buttonValue = "Login";
let isRedirected = false;
let DATA_ERROR = {
    emailError: "",
    passwordError: ""
}
let fromIsValid = false;
let MyFlag = 0;
let formError = "";
let requestPara = "";
let myEmail = "";
let myPassword = "";

const Login = ({ login }) => {
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const emailOtpRef = useRef();
    const changePasswordOne = useRef();
    const changePasswordTwo = useRef();
    const [isForgotPasswordClicked, setIsForgotPasswordClicked] = useState(false);
    const [isSendOtpClicked, setIsSendOtp] = useState(false);
    const [isVerfyClicked, setIsVerifyClicked] = useState(false);
    const [error, setError] = useState(DATA_ERROR);
    const [isValidForApi, setIsValidForApi] = useState(false);
    let [userLoginStatus, setUserLoginStatus] = useState(false);

    if (buttonValue === "Login" && !isRedirected) {
        if (userLoginStatus === "Success") {
            login(true);
        } else formError = userLoginStatus;
    }
    if (buttonValue === "Send OTP") {
        if (userLoginStatus === "Success") {
            buttonValue = "Verify";
            emailOtpRef.current.value = '';
            emailOtpRef.current.placeholder = "Enter OTP";
            userLoginStatus = "";
            setIsSendOtp(true);
        } else formError = userLoginStatus;
    }

    if (buttonValue === "Go to Login Page") {
        document.getElementById("email-otp").style.display = "none";
        if(userLoginStatus === "Password updated"){
            window.location.reload();
        }
    }

    useEffect(() => {
        if (MyFlag > 1) {
            async function apiCall() {
                let data = JSON.stringify({
                    email: myEmail,
                    password: myPassword
                });
                var config = {
                    mode: 'no-cors',
                    method: "post",
                    url: `/corp-users/${requestPara}`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: data,
                };

                axios(config)
                    .then(function (response) {
                        if (response.status === 200 && response.data === "Error")
                            setUserLoginStatus(response.data);
                        else
                            setUserLoginStatus(response.data);
                    })
                    .catch(function (error) {
                        setUserLoginStatus(error);
                    });
            }
            apiCall();
        }
        MyFlag += 1;
    }, [isValidForApi]);

    const loginHandler = (event) => {
        event.preventDefault();
        if (buttonValue === "Send OTP") { // eslint-disable-next-line
            if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailOtpRef.current.value))) {
                if (fromIsValid) {
                    myEmail = emailOtpRef.current.value;
                    setIsValidForApi((prev) => !prev);
                }
                // buttonValue = "Verify";
                // setIsSendOtp(true);
            } else {
                fromIsValid = false;
                setError(prev => ({ ...prev, emailError: "Email is Invalid" }));
            }
        }
        else if (buttonValue === "Verify") {
            buttonValue = "Go to Login Page";
            setIsVerifyClicked(true);
        }
        else if (buttonValue === "Go to Login Page") {
            // console.log((changePasswordOne.current.value !== changePasswordTwo.current.value) || !changePasswordOne.current.value);
            if ((changePasswordOne.current.value !== changePasswordTwo.current.value) || !changePasswordOne.current.value) {
                fromIsValid = false;
                setError(prev => ({ ...prev, emailError: "Password doesn't match" }));
            }
            else if (changePasswordTwo.current.value.length < 8) {
                fromIsValid = false;
                setError(prev => ({ ...prev, emailError: "Password length must be of length 8" }))
            } else {
                myPassword = changePasswordTwo.current.value;
                requestPara = "update-password";
                // buttonValue = "Login";
                setError(prev => ({...prev, emailError: ""}));
                setIsValidForApi((prev) => !prev);
            }
            // isRedirected = true;
            // setIsForgotPasswordClicked(false);
            // setIsSendOtp(false);
            // setIsVerifyClicked(false);
        }
        else if (buttonValue === "Login") {
            myEmail = emailInputRef.current.value;
            myPassword = passwordInputRef.current.value;
            if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailInputRef.current.value)))  // eslint-disable-line
                setError(prev => ({ ...prev, emailError: "Email is Invalid" }));
            if (passwordInputRef.current.value.length < 8)
                setError(prev => ({ ...prev, passwordError: "Password must be of 8 characters" }));
            if (emailInputRef.current.value && passwordInputRef.current.value) {
                if (fromIsValid) {
                    setIsValidForApi((prev) => !prev);
                }
            }
        }
    }

    const emailChangeHandler = () => {
        let dummy = "";
        setUserLoginStatus("");
        if (emailInputRef?.current?.value) dummy = emailInputRef.current.value;
        else dummy = emailOtpRef.current.value;

        if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(dummy))) {   // eslint-disable-line
            fromIsValid = true;
            setError(prev => ({ ...prev, emailError: "" }));
        } else fromIsValid = false;
    }

    const passwordChangeHandler = () => {
        if (passwordInputRef.current.value.length >= 8) {
            fromIsValid = true;
            setError(prev => ({ ...prev, passwordError: "" }));
        } else fromIsValid = false;
    }

    const forgotPasswordHandler = () => {
        requestPara = "email";
        buttonValue = "Send OTP";
        setUserLoginStatus("");
        setIsForgotPasswordClicked(true);
    }
    return (
        <div className={classes.loginContainer}>
            <img src={littleImage} alt='' className={classes.logo} />
            <div className={classes.text}>Access Your Corporate Account</div>
            {formError && <p style={{ color: "red" }}>{formError}</p>}
            <form className={classes.form} onSubmit={loginHandler} >
                {!isForgotPasswordClicked &&
                    <React.Fragment>
                        <input type="text" placeholder='Email' className={classes.input} ref={emailInputRef} onChange={emailChangeHandler} />
                        {error && <p className={classes.errorMessage}>{error.emailError}</p>}
                        <input type="password" placeholder='Password' className={classes.input} ref={passwordInputRef} onChange={passwordChangeHandler} />
                        {error && <p className={classes.errorMessage}>{error.passwordError}</p>}
                        <div className={classes.forgotPassword} onClick={forgotPasswordHandler} >Forgot password?</div>
                    </React.Fragment>
                }
                {isForgotPasswordClicked &&
                    <React.Fragment>
                        {!isSendOtpClicked &&
                            <div>
                                <input type="text" id="email-otp" placeholder='Enter Your Registered Email' ref={emailOtpRef} className={classes.input} onChange={emailChangeHandler} />
                                {error && <p className={classes.errorMessage}>{error.emailError}</p>}
                            </div>
                        }
                        {isSendOtpClicked && !isVerfyClicked &&
                            <input type="number" placeholder='Enter OTP' className={classes.input} />
                        }
                        {isVerfyClicked &&
                            <React.Fragment>
                                <input type="password" placeholder='Enter Password' ref={changePasswordOne} className={classes.input} />
                                <input type="password" placeholder='Confirm Password' ref={changePasswordTwo} className={classes.input} />
                            </React.Fragment>
                        }
                    </React.Fragment>
                }
                <input type="submit" value={buttonValue} className={classes.loginButton} />
            </form>
        </div>
    )
}

export default React.memo(Login);