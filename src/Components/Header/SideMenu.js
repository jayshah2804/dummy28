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

const MENU = [
  {
    main: "Dashboard",
    url: "/dashboard",
  },
  {
    main: "Departments",
    url: "/departments"
  },
  {
    main: "Staffs",
    url: "/staffs"
  },
  {
    main: "Shuttle",
    sub: [
      {
        main: "Live Map",
        url: "/dashboard"
      },
      {
        main: "Routes",
        url: "/routes"
      },
      {
        main: "Bookings",
        url: "/shuttle/bookings"
      },
      {
        main: "Trips",
        url: "/shuttle/trips"
      },
      {
        main: "Drivers",
        url: "/shuttle/drivers"
      }
    ]
  },
  {
    main: "Private Driver",
    sub: [
      {
        main: "Live Map",
        url: "/privatedrive/livemap"
      },
      {
        main: "Shifts",
        url: "/privatedrive/shifts"
      },
      {
        main: "Trips",
        url: "/privatedrive/trips"
      },
      {
        main: "Drivers",
        url: "/privatedrive/drivers"
      }
    ]
  },
  {
    main: "Schedule Booking",
    sub: [
      {
        main: "Bookings",
        url: "/schedule-booking/bookings"
      },
      {
        main: "Trips",
        url: "/schedule-booking/trips"
      }
    ]
  },
  {
    main: "Documents",
    url: "/documents"
  },
  {
    main: "Query & Support",
    url: "/support"
  }
]

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
      sideMenu.push({
        main: "Shuttle",
        sub: ["Live Map", "Routes", "Bookings", "Trips"],
      });
      sideMenu.push({
        main: "Private Driver",
        sub: ["Live Map", "Shifts", "Trips"],
      });
      sessionStorage.getItem("userType") === "AccountManager" && sideMenu[sideMenu.length - 1].sub.push("Edit Drivers");
      sideMenu.push(
        {
          main: "Schedule Booking",
          sub: ["Bookings", "Trips"]
        },
        {
          main: "Departments",
        },
        {
          main: "All Staff",
        },
        {
          main: "Query & Support",
        }
      );
      {
        sessionStorage.getItem("userType") !== "AccountManager" &&
          sideMenu.splice(sideMenu.length - 1, 0, {
            main: "Documents",
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
        {/* <SideMenuData
          myActiveMenu={currentActiveMenuHandler}
          sideMenuClose={props.sideMenuClose}
          menu={MENU}
        /> */}

        {MENU.map((menu, index) => {
          return (
            <SideMenuData
              key={index}
              menu={menu}
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
