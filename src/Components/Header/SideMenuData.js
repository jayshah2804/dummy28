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
  const [expandedMenu, setExpandedMenu] = useState();
  const history = useHistory();

  const redirectToPageHandler = (url, index) => {
    if (url) {
      history.push(url);
      props.sideMenuClose(true);
    } else {
      if (expandedMenu === index) {
        setExpandedMenu("");
        return;
      }
      setExpandedMenu(index);
    }
  }

  return (
    <React.Fragment>
      {props.menu.map((menu, index) => {
        return (
          <React.Fragment>
            <div className={classes.menu} style={{ display: "flex", marginTop: "18px", alignItems: "center" }} >
              {props.iconFlag && <MdOutlineDashboard className={classes.frontIcons} />}
              <div className={classes.mainMenuContainer} onClick={() => redirectToPageHandler(menu.url, index)} >
                <div className={classes.mainMenu}>
                  {menu.main}
                </div>
                {menu.sub && (
                  <div className={classes.dropIcons}>
                    {(index === expandedMenu) ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                  </div>
                )}
              </div>
            </div>
            {
              (menu.sub && (index === expandedMenu)) && (
                <div style={{ marginLeft: "30px" }} >
                  <SideMenuData menu={menu.sub} sideMenuClose={props.sideMenuClose} />
                </div>
              )
            }
          </React.Fragment>
        );
      })}
    </React.Fragment>
  )
};

export default SideMenuData;
