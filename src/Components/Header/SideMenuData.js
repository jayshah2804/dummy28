import React, { useEffect, useState } from "react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdOutlineDashboard,
} from "react-icons/md";
import { AiOutlineBarChart } from "react-icons/ai";
import { BiBriefcase } from "react-icons/bi";
import { useHistory } from "react-router-dom";

import classes from "./SideMenuData.module.css";


let dptName = "";
let idOfOrg = "";
const SideMenuData = ({ main, corpId, sub, deptId, myActiveMenu, sideMenuClose }) => {
  const [subMenuIsAvtive, setSubMenuIsActive] = useState(false);
  const history = useHistory();

  const mainMenuClickHandler = (e) => {
    idOfOrg = e.target.id;
    dptName = e.target.innerText;
    console.log(dptName);
    setSubMenuIsActive((prev) => !prev);
    if (e.target.innerText === "Dashboard") {
      sideMenuClose(false);
      history.push("/" + e.target.innerText.toLowerCase());
    }
    else if (e.target.innerText === "Query & Support") {
      sideMenuClose(false);
      history.push("/support");
    }
    else if (e.target.innerText === "Routes") {
      sideMenuClose(false);
      history.push("/routes");
    }
    else if (e.target.innerText === "Departments") {
      sideMenuClose(false);
      history.push(`/departments`);
    }
    else if (e.target.innerText === "All Staff") {
      sideMenuClose(false);
      history.push("/staff");
    }
    else if (e.target.innerText === "Documents Upload") {
      sideMenuClose(false);
      history.push("/documents-upload");
    }
  };

  const subMenuClickHandler = (e) => {
    setTimeout(() => {
      setSubMenuIsActive(false);
    })
    if (dptName !== "Private Driver") {
      if (e.target.innerText === "Trips") {
        sideMenuClose(false);
        history.push("/" + e.target.innerText.toLowerCase() + "?corpId=" + idOfOrg);
      }
    } else {
      if (e.target.innerText === "Trips") {
        sideMenuClose(false);
        history.push("/privatedrive/" + e.target.innerText.toLowerCase());
      }
      else if (e.target.innerText === "Live Map") {
        sideMenuClose(false);
        history.push("/privatedrive/" + e.target.innerText.toLowerCase().replaceAll(" ", ""));
      }
      else if (e.target.innerText === "Create-Shift") {
        sideMenuClose(false);
        history.push("/privatedrive/shift-creation");
      }
      else if (e.target.innerText === "Shifts") {
        sideMenuClose(false);
        history.push("/privatedrive/shifts");
      }
    }
    if (e.target.innerText === "Admins") {
      sideMenuClose(false);
      history.push("/" + e.target.innerText.toLowerCase() + "?corpId=" + idOfOrg);
    }
    else if (e.target.innerText === "Departments") {
      sideMenuClose(false);
      history.push(`/departments?corporateId=${idOfOrg}`);
    }
    else if (e.target.innerText === "Staff Members") {
      sideMenuClose(false);
      history.push(`/staff?departmentId=${e.target.id}`)
    }
  };

  return (
    <React.Fragment>
      <div className={classes.menu}>
        <MdOutlineDashboard className={classes.frontIcons} />
        {/* {main.toLowerCase() === "dashboard" && <AiOutlineBarChart className={classes.frontIcons} />}
        {main.toLowerCase().includes("corporate") && <BiBriefcase className={classes.frontIcons} />} */}
        {/* <NavLink to="#"
          className={classes.mainMenu}
          onClick={() => setSubMenuIsActive((prev) => !prev)}
        >
          {main}
        </NavLink> */}
        <div id={corpId} className={classes.mainMenu} onClick={mainMenuClickHandler}>
          {main}
        </div>
        {sub && (
          <div className={classes.dropIcons}>
            {subMenuIsAvtive ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </div>
        )}
      </div>
      {subMenuIsAvtive && (
        <div>
          {sub &&
            sub.map((ele) => (
              <p id={deptId} className={classes.subMenu} onClick={subMenuClickHandler} style={{ cursor: "pointer" }}>
                {ele}
              </p>
            ))}
        </div>
      )}
    </React.Fragment>
  );
};

export default SideMenuData;
