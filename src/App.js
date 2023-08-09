import React, { useCallback, useEffect, useState } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";

import "./App.css";
import Header from "./Components/Header/Header";
import Dashboard from "./Components/Dashboard/Main";
import Login from "./Components/Home/Login";
import SideMenu from "./Components/Header/SideMenu";
import Trips from "./Components/Trips/Trips";
import Support from "./Components/Support/Support";
import Routes from "./Components/Routes/Route";
import Stops from "./Components/Routes/Stops";
import Departments from "./Components/Departments/Departments";
import AddDepartment from "./Components/Departments/AddDepartment";
import Staff from "./Components/Staff/Staff";
import Admins from "./Components/Admins/Admins";
import NewRegistration from "./Components/AddNewCorp/NewRegistration";
import DocumentsUpload from "./Components/Documents Upload/DocumentsUpload";
import DriverList from "./Components/Drivers/DriverList";
import PrivateTrips from "./Components/PrivateDriver/PrivateTrips";
import DriverData from "./Components/PrivateDriver/DriverData";
import ChatBot from "./Components/ChatBot/ChatBot";
import ShiftCreation from "./Components/PrivateDriver/Create Shift/ShiftCreation";
import Shifts from "./Components/PrivateDriver/Shifts/Shifts";
import Booking from "./Components/ScheduleBooking/New Booking/NewBooking";
import PreviousBookings from "./Components/ScheduleBooking/Previous Bookings/PreviousBookings";
import ScheduleTrips from "./Components/ScheduleBooking/Trips/ScheduleTrips";
import BookingDetails from "./Components/ScheduleBooking/BookingDetails";
import EditDriver from "./Components/PrivateDriver/Drivers/EditDriver";
import ShuttleDrivers from "./Components/Shuttle/Drivers/EditDriver";
import Bookings from "./Components/Shuttle/Route Booking/Bookings";
import NewBooking from "./Components/Shuttle/Route Booking/NewBooking";

let flag = true;
let prevURL = "";
let initial = 0;
let prev = 0;
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    let status = sessionStorage.getItem("login");
    if (status === null) setIsLoggedIn(false);
    else status === "false" ? setIsLoggedIn(false) : setIsLoggedIn(true);
  }, []);

  if (window.screen.width >= 768) {
    if (isSideMenuOpen) {
      document.getElementsByClassName("paths")[0].style.width = "80%";
    } else {
      if (document.getElementsByClassName("paths")[0])
        document.getElementsByClassName("paths")[0].style.width = "100%";
    }
  }

  const loginHandler = useCallback((loggedValue) => {
    sessionStorage.setItem("login", true);
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
          <Header
            sideMenuOpen={sideMenuHoverHandler}
            setIsLoggedIn={setIsLoggedIn}
          />
          <div className="myContainer">
            <SideMenu
              sideMenuClose={sideMenuLeaveHandler}
              property={isSideMenuOpen}
            />
            <div className="paths">
              <Route path="/shuttle/trips">
                <Trips />
              </Route>
              <Route path="/dashboard">
                <Dashboard setIsLoggedIn={setIsLoggedIn} />
              </Route>
              <Route path="/new-registration">
                <NewRegistration />
              </Route>
              <Route path="/privatedrive/trips">
                <PrivateTrips />
              </Route>
              <Route path="/departments" exact>
                <Departments />
              </Route>
              <Route path="/departments/add-new" exact>
                <AddDepartment />
              </Route>
              <Route path="/privatedrive/livemap">
                <DriverData />
              </Route>
              <Route path="/privatedrive/drivers">
                <EditDriver />
              </Route>
              <Route path="/shuttle/drivers">
                <ShuttleDrivers />
              </Route>
              <Route path="/privatedrive/shift-creation">
                <ShiftCreation />
              </Route>
              <Route path="/privatedrive/shifts">
                <Shifts />
              </Route>
              <Route path="/edit">
                <AddDepartment />
              </Route>
              <Route path="/staffs">
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
              <Route path="/documents">
                <DocumentsUpload />
              </Route>
              <Route path="/drivers">
                <DriverList />
              </Route>
              <Route path="/schedule-booking/new booking">
                <Booking />
              </Route>
              <Route path="/schedule-booking/trips">
                <ScheduleTrips />
              </Route>
              <Route path="/schedule-booking/bookings" exact>
                <PreviousBookings />
              </Route>
              <Route path="/schedule-booking/previous bookings/details" exact >
                <BookingDetails />
              </Route>
              <Route path="/shuttle/bookings">
                <Bookings />
              </Route>
              <Route path="/shuttle/new-booking">
                <NewBooking />
              </Route>
            </div>
          </div>
          {/* <ChatBot /> */}
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
