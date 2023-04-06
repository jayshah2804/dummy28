import React, { useState } from "react";
import { CgMenuMotion } from "react-icons/cg";

import classes from "./Header.module.css";
import adminAlternative from "../../Assets/adminAlternative.png";
import littleLogo from "../../Assets/Little_logo.jpg";
import loadingGif from "../../Assets/loading-gif.gif";
import { useHistory } from "react-router-dom";
import ChangePassword from "../Dashboard/ChangePassword";
import { GrClose } from "react-icons/gr";
import useHttp from "../../Hooks/use-http";
import { useEffect } from "react";
import EditProfile from "./EditProfile";
import Message from "../../Modal/Message";
import Notification from "./Notification";


let headerFlag = 0;
const Nav = (props) => {
  const history = useHistory();
  const [adminData, setAdminData] = useState([]);
  const [isAdminPhotoClicked, setIsAdminPhotoClicked] = useState(false);
  const [isEditProfileClicked, setIsEditProfileClicked] = useState(false);
  const [isResponse, setIsResponse] = useState(false);

  const authenticateUser = (data) => {
    console.log(data.AdminImage);
    setAdminData(data.AdminImage[0]);
  };

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    // if (headerFlag > 0) {
    sendRequest({
      url: "/api/v1/AdminRole/GetAdminInformation",
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        emailID: sessionStorage.getItem("user"),
        departmentID: "",
        corporateID: sessionStorage.getItem("corpId")
      }
    }, authenticateUser);
    // }
    headerFlag++;
  }, [sendRequest]);

  const sideMenuClickHandler = () => {
    props.sideMenuOpen();
  };

  const adminPhotoClickHandler = () => {
    setIsAdminPhotoClicked((prev) => !prev);
  };

  const editProfileClickHandler = () => {
    setIsEditProfileClicked(true);
    setIsAdminPhotoClicked(false);
  }
  setTimeout(() => {
    document.getElementById("a").addEventListener("click", () => {
      document.body.style.overflow = "hidden";
    })
  })

  return (
    <React.Fragment>
      <div className={classes.container}>
        <div className={classes.sub}>
          <CgMenuMotion className={classes.menuIcon}
            onMouseEnter={sideMenuClickHandler}
          />
          <img src={littleLogo} alt="" className={classes.littleLogo} style={{cursor: "pointer"}} onClick={() => history.push("/dashboard")} />
        </div>
        <div className={classes.orgDetails}>
          {sessionStorage.getItem("userType") !== "AccountManager" &&
            <React.Fragment>
              {
                isLoading ?
                  <div style={{ height: "80px" }
                  } >
                    <img style={{ marginTop: "25px", height: "25px" }} src={loadingGif} alt="" className={classes.logo} />
                  </div> :
                  <img src={adminData.CorporateImage} alt="" className={classes.logo} />
              }
            </React.Fragment>
          }
          <Notification setIsAdminPhotoClicked={setIsAdminPhotoClicked} isAdminPhotoClicked={isAdminPhotoClicked} />
          <img
            src={adminData.AdminImage ? adminData.AdminImage : adminAlternative}
            alt=""
            className={classes.adminPhoto}
            onClick={adminPhotoClickHandler}
          />
          {isAdminPhotoClicked && (
            <React.Fragment>
              <div className={classes.backdrop} onClick={() => setIsAdminPhotoClicked(false)} ></div>
              <div className={classes.adminPanel}>
                <div className={classes.header}>
                  <p className={classes.adminName}>
                    {adminData?.AdminName}
                  </p>
                  <p className={classes.adminOrg}>
                    {sessionStorage.getItem("userType") !== "AccountManager" ?
                      `Admin of ${adminData?.Corporate}` : "Account Manager"
                    }
                  </p>
                </div>
                <p className={classes.changePassword} onClick={editProfileClickHandler} id="a" >Edit Profile</p>
                <hr />
                <p className={classes.logout}
                  onClick={() => {
                    // history.push("/login");
                    sessionStorage.setItem("login", "false");
                    sessionStorage.removeItem("splashFlag");
                    // props.setIsLoggedIn(false);
                    window.location.reload();
                  }}
                >
                  Logout
                </p>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
      {
        isEditProfileClicked &&
        <EditProfile setIsResponse={setIsResponse} setIsEditProfileClicked={setIsEditProfileClicked} adminName={adminData.AdminName} adminOrg={adminData.Corporate} adminPhoto={adminData.AdminImage} />
      }
      {isResponse && <Message type={isResponse} message="Admin details has been updated successfully" />}
    </React.Fragment >
  );
};

export default Nav;
