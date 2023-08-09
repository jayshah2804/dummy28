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


const SideMenuData = (props) => {
  const [subMenuIsAvtive, setSubMenuIsActive] = useState(false);
  const history = useHistory();

  const redirectToPageHandler = (url) => {
    if (url) {
      history.push(url);
      props.sideMenuClose(true);
      setSubMenuIsActive(false);
    } else {
      // props.sideMenuClose(false);
      setSubMenuIsActive(prev => !prev);
    }
  }

  return (
    <React.Fragment>
      <div className={classes.menu} style={{ display: "flex", marginTop: "18px", alignItems: "center" }} >
        <MdOutlineDashboard className={classes.frontIcons} />
        <div className={classes.mainMenuContainer} >
          <div className={classes.mainMenu} onClick={() => redirectToPageHandler(props.menu.url)}>
            {props.menu.main}
          </div>
          {props.menu.sub && (
            <div className={classes.dropIcons}>
              {subMenuIsAvtive ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </div>
          )}
        </div>
      </div>
      {
        subMenuIsAvtive && (
          <div>
            {props.menu.sub &&
              props.menu.sub.map((ele) => (
                <p className={classes.subMenu} onClick={() => redirectToPageHandler(ele.url)} style={{ cursor: "pointer" }}>
                  {ele.main}
                </p>
              ))}
          </div>
        )
      }
    </React.Fragment>
  )
};

export default SideMenuData;
