import React, { useRef, useState } from 'react';
import Email_img from "../../Assets/support_img.png";
import classes from "./Support.module.css";
import emailjs from 'emailjs-com';

const error = {
    firstNameError: "",
    lastNameError: "",
    subjectError: "",
    messageError: ""
}

let valid = true;
const Support = () => {
    const [isError, setIsError] = useState(error);
    const [emailResponse, setEmailResponse] = useState();
    const firstNameInputRef = useRef();
    const lastNameInputRef = useRef();
    const subjectInputRef = useRef();
    const messageInputRef = useRef();
    const formRef = useRef();

    const firstNameChangeHandler = () => {
        if (firstNameInputRef.current.value) {
            valid = true;
            setIsError(prev => ({ ...prev, firstNameError: "" }));
        }
    }
    const lastNameChangeHandler = () => {
        if (lastNameInputRef.current.value) {
            valid = true;
            setIsError(prev => ({ ...prev, lastNameError: "" }));
        }
    }
    const subjectChangeHandler = () => {
        if (subjectInputRef.current.value) {
            valid = true;
            setIsError(prev => ({ ...prev, subjectError: "" }));
        }
    }
    const messageChangeHandler = () => {
        if (messageInputRef.current.value) {
            valid = true;
            setIsError(prev => ({ ...prev, messageError: "" }));
        }
    }

    const querySubmitHandler = (e) => {
        e.preventDefault()
        if (!(/^[a-zA-Z ]{1,15}$/.test(firstNameInputRef.current.value))) {
            valid = false;
            setIsError(prev => ({ ...prev, firstNameError: "Please Enter Valid First name" }));
        }
        if (!(/^[a-zA-Z ]{1,15}$/.test(lastNameInputRef.current.value))) {
            valid = false;
            setIsError(prev => ({ ...prev, lastNameError: "Please Enter Valid Last name" }));
        }
        if (!(/^[a-zA-Z0-9:. ]{1,40}$/.test(subjectInputRef.current.value))) {
            valid = false;
            setIsError(prev => ({ ...prev, subjectError: "Please Enter Valid Subject" }));
        }
        if (!(/^[a-zA-Z0-9/:. ]{1,300}$/.test(messageInputRef.current.value))) {
            valid = false;
            setIsError(prev => ({ ...prev, messageError: "Please Enter Valid Message" }));
        }
        if (valid) {
            setIsError(error);
            emailjs.sendForm('service_x9bezza', 'template_3q3kddr', formRef.current, '3A3-M7uZF0uJGRWub')
                .then((result) => {
                    formRef.current.reset();
                    setEmailResponse({message:"Your response has been successfully recorded.",success: "true"});
                }, (error) => {
                    formRef.current.reset();
                    setEmailResponse({message:"Error occured. Please try again after some time.", success: "false"});
                });
            // window.location.href = `https://mail.google.com/mail/?view=cm&fs=1&to=someone@example.com&su=${subjectInputRef.current.value}&body=Hello I am ${firstNameInputRef.current.value} ${lastNameInputRef.current.value} from xxx Organization.${messageInputRef.current.value}`;
        }
    }
    if (emailResponse) {
        let timeOut = setTimeout(() => {
            setEmailResponse("");
            clearTimeout(timeOut);
        }, 5000);
    }
    return (
        <div className={classes.support} id="support">
            <div className={classes.mainHeader}>SUPPORT EMAIL</div>
            <div className={classes.supportContainer} id="support-container" >
                <img src={Email_img} alt='' id="support-img" className={classes.emailImage} />
                <form ref={formRef} >
                    <header>Contact us</header>
                    <p>Have any questions? We'd love to hear from you</p>
                    <input type="text" style={{ display: "none" }} name="orgName" defaultValue="Eximious" />
                    <input type="text" placeholder='First Name' name='firstName' ref={firstNameInputRef} onChange={firstNameChangeHandler} autoComplete="off" />
                    {isError.firstNameError && <span className={classes.error}>{isError.firstNameError}</span>}
                    <input type="text" placeholder='Last Name' name='lastName' ref={lastNameInputRef} onChange={lastNameChangeHandler} autoComplete="off" />
                    {isError.lastNameError && <span className={classes.error}>{isError.lastNameError}</span>}
                    <input type="text" placeholder='Subject' name='subject' ref={subjectInputRef} onChange={subjectChangeHandler} autoComplete="off" />
                    {isError.subjectError && <span className={classes.error}>{isError.subjectError}</span>}
                    <textarea placeholder='Message' name='message' ref={messageInputRef} onChange={messageChangeHandler} autoComplete="off" />
                    {isError.messageError && <span className={classes.error}>{isError.messageError}</span>}
                    {emailResponse?.message && <p id={emailResponse.success} >{emailResponse.message}</p>}
                    <button type="submit" onClick={querySubmitHandler}>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Support