import "./App.css";
import Header from "./Components/Header/Header";
import Dashboard from "./Components/Dashboard/Main";
import Login from "./Components/Home/Login";
import React, { useCallback, useEffect, useState } from "react";
import SideMenu from "./Components/Header/SideMenu";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import Trips from "./Components/Trips/Trips";
import Support from "./Components/Support/Support";
import Routes from "./Components/Routes/Route";
import Stops from "./Components/Routes/Stops";
import Departments from "./Components/Departments/Departments";
import AddDepartment from "./Components/Departments/AddDepartment";
import Staff from "./Components/Staff/Staff";
import Admins from "./Components/Admins/Admins";

let flag = false;
let prevURL = "";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const history = useHistory();

  if (isSideMenuOpen && window.screen.width >= 768) {
    if (document.getElementById("myContainer")) {
      document.getElementById("myContainer").style.overflowX = "scroll";
      document.getElementById("myContainer").style.width = "75%";
      // document.getElementById("myContainer").style.width = "calc(100vw-420px)";
      flag = true;
    }
    if (document.getElementById("trip-table")) {
      document.getElementById("trip-table").style.width = "78%";
      document.getElementById("my-table").style.width = "100%";
    }
    if (document.getElementById("stopsInfo-map")) {
      document.getElementById("stopsInfo-map").style.width = "52%";
    }
    if (document.getElementById("main-stop")) {
      document.getElementById("main-stop").style.width = "75%";
    }
    if (document.getElementById("add-department")) {
      document.getElementById("add-department").style.width = "78%";
    }
    if (document.getElementById("support")) {
      // document.getElementById("support").style.width = "calc(100vw - 320px )";
      document.getElementById("support").style.width = "77%";
    }
  } else if (isSideMenuOpen && window.screen.width < 768) {
    // document.body.style.overflow = "hidden";
  }

  if (!isSideMenuOpen && window.screen.width >= 768) {
    if (document.getElementById("myContainer")) {
      if (flag)
        document.getElementById("myContainer").style.overflowX = "visible";
      document.getElementById("myContainer").style.width = "100%";
    }
    if (document.getElementById("trip-table")) {
      document.getElementById("trip-table").style.width = "100%";
      document.getElementById("my-table").style.width = "100%";
    }
    if (document.getElementById("stopsInfo-map")) {
      document.getElementById("stopsInfo-map").style.width = "73%";
    }
    if (document.getElementById("add-department")) {
      document.getElementById("add-department").style.width = "100%";
    }
    if (document.getElementById("main-stop")) {
      document.getElementById("main-stop").style.width = "100%";
    }
    if (document.getElementById("support")) {
      // document.getElementById("support").style.width = "calc(100vw - 20px )";
      document.getElementById("support").style.width = "100%";
    }
  }

  const loginHandler = useCallback((loggedValue) => {
    history.push("/dashboard");
    setIsLoggedIn(loggedValue);
  }, []);

  const sideMenuHoverHandler = () => {
    setIsSideMenuOpen(true);
  };

  const sideMenuLeaveHandler = () => {
    setIsSideMenuOpen(false);
  };
  return (
    <div>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/login" />
        </Route>
        <Route path="/login">
          <Login login={loginHandler} />
        </Route>
        <Route path="/">{!isLoggedIn && <Login login={loginHandler} />}</Route>
      </Switch>
      {isLoggedIn && (
        <React.Fragment>
          <Header sideMenuOpen={sideMenuHoverHandler} />
          <div className="myContainer">
            <SideMenu
              sideMenuClose={sideMenuLeaveHandler}
              property={isSideMenuOpen}
            />
            <Route path="/trips">
              <Trips />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/departments" exact>
              <Departments />
            </Route>
            <Route path="/departments/add-new" exact>
              <AddDepartment />
            </Route>
            <Route path="/staff">
              <Staff />
            </Route>
            <Route path="/admins">
              <Admins />
            </Route>
            <Route path="/support">
              <Support />
            </Route>
            <Route path="/routes" exact>
              <Routes />
            </Route>
            <Route path="/routes/:routeId">
              <Stops />
            </Route>
          </div>
        </React.Fragment>
      )}
      {/* <Route path="/dashboard">
        {isLoggedIn ? (
          <React.Fragment>
            <Header sideMenuOpen={sideMenuHoverHandler} />
            <div className="myContainer"> */}
      {/* {isSideMenuOpen && <SideMenu sideMenuClose={sideMenuLeaveHandler} />} */}
      {/* <SideMenu
                sideMenuClose={sideMenuLeaveHandler}
                property={isSideMenuOpen}
              />
              <Dashboard />
            </div>
          </React.Fragment>
        ) : (
          <Redirect to="/login" />
        )}
      </Route> */}
    </div>
  );
}

export default App;