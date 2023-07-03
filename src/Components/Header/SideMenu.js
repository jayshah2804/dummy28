import React, { useEffect, useState } from "react";
import classes from "./SideMenu.module.css";
import SideMenuData from "./SideMenuData";
import { GrClose } from "react-icons/gr";
import useHttp from "../../Hooks/use-http";

let sideMenuFlag = 0;
let flag = false;
let prev_corp = "";
let obj = {
  dashboard: "<AiOutlineBarChart />"
}
const SideMenu = (props) => {
  const [sideMenuData, setSideMenuData] = useState([]);
  const { sendRequest } = useHttp();

  const authenticateUser = (data) => {
    sessionStorage.setItem("type", data?.MenuList[0].CorporateType);
    sessionStorage.setItem("document", data?.MenuList[0].IsDocument);
    sessionStorage.setItem("cpName", data?.MenuList[0].CorporateName);
    let sideMenu = [];
    if (data.MenuList) {
      sessionStorage.setItem("corpId", data.MenuList[0].CorporateID);
      sideMenu.push({
        main: "Dashboard",
      });
      if (data.MenuList[0].DepartMentName) {
        for (let i = 0; i < data.MenuList.length; i++) {
          if (prev_corp !== data.MenuList[i].CorporateName)
            sideMenu.push({
              main: data.MenuList[i].CorporateName,
              corpId: data.MenuList[i].CorporateID,
              sub: ["Departments", "Admins", "Trips"],
            });
          prev_corp = data.MenuList[i].CorporateName;
          if (data.MenuList[i].DepartMentName) {
            sideMenu.push({
              main: data.MenuList[i].DepartMentName,
              deptId: data.MenuList[i].DepartmentID,
              sub: ["Staff Members"],
            });
          }
        }
      } else {
        for (let i = 0; i < data.MenuList.length; i++) {
          sideMenu.push({
            main: data.MenuList[i].CorporateName,
            corpId: data.MenuList[i].CorporateID,
            sub: ["Departments", "Admins", "Trips"],
          });
        }
      }
      sideMenu.push({
        main: "Private Driver",
        sub: ["Shifts", "Create-Shift", "Trips", "Live Map"],
      });
      sideMenu.push(
        {
          main: "Schedule Booking",
          sub: ["New booking", "Previous bookings", "Trips"]
        },
        {
          main: "Departments",
        },
        {
          main: "All Staff",
        },
        {
          main: "Routes",
        },
        {
          main: "Query & Support",
        }
      );
      {
        sessionStorage.getItem("userType") !== "AccountManager" &&
          sideMenu.splice(sideMenu.length - 1, 0, {
            main: "Documents Upload",
          });
      }
    }
    prev_corp = "";
    setSideMenuData(sideMenu);
  };
  useEffect(() => {
    // if (sideMenuFlag > 0) {
    sendRequest(
      {
        url: "/api/v1/Menu/GetMenuList",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          emailID: sessionStorage.getItem("user"),
        },
      },
      authenticateUser
    );
    // }
    sideMenuFlag++;
  }, []);

  const currentActiveMenuHandler = (data) => {
    console.log(data);
  };

  // if (props.property) {
  //   document.getElementById("mySidemenu").style.width = "300px";
  //   flag = true;
  // } else {
  //   if (flag) document.getElementById("mySidemenu").style.width = "0px";
  // }

  if (props.property) {
    if (window.screen.width < 450)
      document.getElementById("mySidemenu").style.width = "100%";
    else document.getElementById("mySidemenu").style.width = "22%";
    window.addEventListener("popstate", function (event) {
      // alert(document.getElementById("mySidemenu").style.width);
      if (window.screen.width < 450) {
        if (document.getElementById("mySidemenu").style.width == "100%")
          document.getElementById("mySidemenu").style.minWidth = "100%";
      } else {
        if (document.getElementById("mySidemenu").style.width == "22%")
          document.getElementById("mySidemenu").style.minWidth = "22%";
      }
      // The URL changed...
      this.window.removeEventListener("popstate");
    });
    flag = true;
  } else {
    if (flag) {
      if (document.getElementById("mySidemenu")) {
        document.getElementById("mySidemenu").style.minWidth = null;
        document.getElementById("mySidemenu").style.width = "0px";
      }
    }
  }

  return (
    <div className={classes.menuContainer} id="mySidemenu">
      <div
        className={classes.subMenu}
        onMouseLeave={() => props.sideMenuClose()}
      >
        <div
          className={classes.closeIcon}
          onClick={() => props.sideMenuClose()}
        >
          <GrClose />
        </div>
        {!sideMenuData[0] && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            No Data Available
          </div>
        )}
        {sideMenuData.map(({ main, corpId, sub, deptId }, index) => {
          return (
            <SideMenuData
              key={index}
              main={main}
              sub={sub}
              deptId={deptId}
              corpId={corpId}
              myActiveMenu={currentActiveMenuHandler}
              sideMenuClose={props.sideMenuClose}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SideMenu;
