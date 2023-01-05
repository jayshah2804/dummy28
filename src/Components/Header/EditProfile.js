import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { BsFillPencilFill } from "react-icons/bs";
import useHttp from "../../Hooks/use-http";
import "./EditProfile.css";
import Message from '../../Modal/Message';


let erros = {
  file: "",
  confirm: "",
  new: "",
  old: ""
}
const EditProfile = ({ adminPhoto, setIsEditProfileClicked, adminName, adminOrg, setIsResponse }) => {
  const [isAdminPhotoChanged, setIsAdminPhotoChanged] = useState(adminPhoto);
  const oldPasswordInputRef = useRef();
  const newPasswordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const [isError, setIsError] = useState(erros);
  const [isCall, setIsCall] = useState(false);

  const authenticateUser = (data) => {
    console.log(data, "data");
    // if (data.Message.toLowerCase() === "success") {
    document.getElementById("admin-close").click();
    setIsCall(false);
    setIsResponse(data.Message ? data.Message.toLowerCase() : data);
    // }
  };

  const { sendRequest } = useHttp();

  useEffect(() => {
    console.log({
      emailID: sessionStorage.getItem("user"),
      newPassword: oldPasswordInputRef.current.value ? newPasswordInputRef.current.value : "",
      confirmPassword: oldPasswordInputRef.current.value ? confirmPasswordInputRef.current.value : "",
      oldPassword: oldPasswordInputRef.current.value ? oldPasswordInputRef.current.value : "",
      adminImage: isAdminPhotoChanged ? isAdminPhotoChanged : ""
    });
    if (isCall)
      sendRequest({
        url: "/api/v1/Header/ChangePassword",
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          emailID: sessionStorage.getItem("user"),
          newPassword: oldPasswordInputRef.current.value ? newPasswordInputRef.current.value : "",
          confirmPassword: oldPasswordInputRef.current.value ? confirmPasswordInputRef.current.value : "",
          oldPassword: oldPasswordInputRef.current.value ? oldPasswordInputRef.current.value : "",
          adminImage: isAdminPhotoChanged ? isAdminPhotoChanged : ""
        }
      }, authenticateUser);
  }, [isCall, sendRequest])

  const adminPhotoChangeHandler = (e) => {
    if (e.target.files[0].size > 500000) {
      setIsError(prev => ({ ...prev, file: "File size must be less than 5 mb" }));
    }
    else if (!(e.target.files[0].name.includes("jpg") || e.target.files[0].name.includes("jpeg") || e.target.files[0].name.includes("png"))) {
      setIsError(prev => ({ ...prev, file: "File format must be of jpg, png or jpeg" }));
    } else {
      setIsError(prev => ({ ...prev, file: "" }));
      getBase64(e.target.files[0]).then((data) => setIsAdminPhotoChanged(data));
    }
  }
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  const adminInfoUpdateHandler = () => {
    if (newPasswordInputRef.current.value) {
      if (newPasswordInputRef.current.value !== confirmPasswordInputRef.current.value && newPasswordInputRef.current.value)
        setIsError(prev => ({ ...prev, new: "New password does not match" }));
      // console.log(newPasswordInputRef.current.value);
      else if (newPasswordInputRef.current.value.length < 8)
        setIsError(prev => ({ ...prev, new: "password length must be of minimum 8" }));
      else setIsCall(true);
    } else setIsCall(true);
  }
  return (
    <React.Fragment>
      <div className="edit-profile-container"></div>
      <div className="edit-profile">
        <header>
          <span>Edit Profile</span>
          <span onClick={() => {
            setIsEditProfileClicked(false);
            document.body.style.overflow = "auto";
          }}
            id="admin-close"
          >X</span>
        </header>
        <main>
          <div className="admin-info">
            <div style={{ position: "relative" }}>
              <img src={isAdminPhotoChanged} alt="admin img" />
              <BsFillPencilFill title="Click to change profile photo" className="edit-icon" onClick={() => document.getElementById("admin_photo_change").click()} />
            </div>
            <input type="file" id="admin_photo_change" style={{ display: "none" }} onChange={adminPhotoChangeHandler} />
            <p>{adminName}</p>
            {sessionStorage.getItem("userType") !== "AccountManager" &&
              <p>{adminOrg}</p>
            }
            {isError && <p>{isError.file}</p>}
          </div>
          <h4>Change Passoword</h4>
          <div className="change-password">
            <input
              type="password"
              placeholder="Old Passowrd"
              ref={oldPasswordInputRef}
            />
            {/* {console.log(isError)} */}
            <div style={{ position: "relative" }}>
              <input
                type="password"
                placeholder="New Passowrd"
                ref={newPasswordInputRef}
              />
              {isError && <p style={{ position: "absolute" }} >{isError.new}</p>}
            </div>
            <input
              type="password"
              placeholder="Confirm Passowrd"
              ref={confirmPasswordInputRef}
            />
          </div>
          <footer>
            <button onClick={adminInfoUpdateHandler}>Save</button>
          </footer>
        </main>
      </div>
    </React.Fragment>
  );
};

export default EditProfile;