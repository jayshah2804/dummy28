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

  const menuList = (data) => {
    let menu = data?.MainMenuList.reduce((acc, cur, index) => {
      acc[index] = {
        main: cur.Description
      }
      let arr = [];
      for (let i = 0; i < data.MenuList.length; i++) {
        if (cur.MainModuleID === data.MenuList[i].MainModuleID)
          arr.push({
            main: data.MenuList[i].ModuleName,
            url: data.MenuList[i].MenuURL
          })
      }
      if (arr.length === 1) acc[index].url = arr[0].url;
      else acc[index].sub = arr;
      arr = [];
      return acc;
    }, []);
    setSideMenuData(menu);
  }

  useEffect(() => {
    // if (sideMenuFlag > 0) {
    sendRequest(
      {
        url: "/api/v1/Menu/GetUserMenuList",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          emailID: sessionStorage.getItem("user"),
          corporateID: sessionStorage.getItem("roleId") === "1" ? "" : sessionStorage.getItem("corpId")
        },
      },
      menuList
    );
  }, []);

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
        <SideMenuData menu={sideMenuData} iconFlag={true} sideMenuClose={props.sideMenuClose} />
      </div>
    </div>
  );
};

export default SideMenu;
