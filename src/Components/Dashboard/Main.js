import React, { useState, useEffect } from "react";
import classes from "./Main.module.css";
import Chart from "react-apexcharts";
import photo from "../../Assets/admin.jpg";
import startPoint from "../../Assets/Pin_icon_green50.png";
import studentDummyImage from "../../Assets/new_student_marker.png";
import { useHistory } from "react-router-dom";
import useHttp from "../../Hooks/use-http";
import Loading from "../../Loading/Loading";
import little from "../../Assets/little.gif";
import LiveTrip from "./LiveTrip";
// import studentDummyImage from "../../Assets/new_student_marker.png";

const DUMMY_DATA = [
  {
    driverName: "Dharmik Gurav",
    carNumber: "GJ 01 AA 2343",
    status: "Inactive",
  },
  {
    driverName: "Mahesh Gohil",
    carNumber: "GJ 01 AA 2343",
    status: "active",
  },
  {
    driverName: "Vivek Zala",
    carNumber: "GJ 01 AA 2343",
    status: "active",
  },
  {
    driverName: "Gautam Solanki",
    carNumber: "GJ 01 AA 2343",
    status: "Inactive",
  },
  {
    driverName: "Ketan Patel",
    carNumber: "GJ 01 AA 2343",
    status: "Inactive",
  },
  {
    driverName: "Gautam Solanki",
    carNumber: "GJ 01 AA 2343",
    status: "Inactive",
  },
];

let divFlag = 0;
let driverList = [];

const Main = () => {
  // const [options, setOptions] = useState(initial);
  const [isRender, setIsRender] = useState();
  const [listData, setListData] = useState({});
  const [isApiError, setIsApiError] = useState();
  const history = useHistory();

  setTimeout(() => {
    document.getElementById("splash").style.display = "none";
    sessionStorage.setItem("splashFlag", "1");
  }, 2000);

  const authenticateUser = (data) => {
    console.log(data);
    if (data === "Request failed!") {
      setIsApiError("No data available");
    } else {
      driverList = data.Driverlist;
      sessionStorage.setItem("driverList", JSON.stringify(driverList));
      let myData = {
        riders: data.Rider,
        routes: data.Route,
        trips: data.Trip,
        activeTrips: data.ActiveTrip,
      };
      // console.log(myData);
      setListData(myData);
    }
    // setFilteredData(department_data)
  };

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    // debugger;
    if (sessionStorage.getItem("interval")) {
      clearInterval(sessionStorage.getItem("interval"));
      sessionStorage.removeItem("interval");
    }
  }, []);

  useEffect(() => {
    // alert("jay");
    // if (divFlag % 2 === 0)
    sendRequest(
      {
        url: "/api/v1/Dashboard/GetDashboard",
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
    divFlag++;
  }, [sendRequest]);


  return (
    <React.Fragment>
      <div className={classes.container} id="myContainer">
        <header>
          <div>
            <p className={classes.adminName}>
              {"Welcome " + sessionStorage.getItem("adminName")}
            </p>
            <p className={classes.adminText}>
              You can check all data of your Organization in Dashboard!
            </p>
          </div>
          {sessionStorage.getItem("userType") === "AccountManager" && (
            <button
              onClick={() => history.push("/new-registration")}
              className={classes.newCorpButton}
            >
              Add New Corporate
            </button>
          )}
        </header>
        <div className={classes.cards}>
          <div
            className={classes.text}
            title="Monthly Trip details"
            onClick={() => history.push("/trips")}
          >
            <p>Trips</p>
            {isApiError && (
              <span style={{ fontWeight: "normal", fontSize: "14px" }}>
                {isApiError}
              </span>
            )}
            {!isApiError && (
              <span>
                {isLoading ? <Loading /> : <span>{listData.trips}</span>}
              </span>
            )}
          </div>
          <div
            className={classes.text}
            title="Click to see Monthly Usage details"
            onClick={() => history.push("/staff")}
          >
            <p>Riders</p>
            {isApiError && (
              <span style={{ fontWeight: "normal", fontSize: "14px" }}>
                {isApiError}
              </span>
            )}
            {!isApiError && (
              <span>
                {isLoading ? <Loading /> : <span>{listData.riders}</span>}
              </span>
            )}
          </div>
          <div
            className={classes.text}
            title="Click to see Routes details"
            onClick={() => history.push("/routes")}
          >
            <p>Routes</p>
            {isApiError && (
              <span style={{ fontWeight: "normal", fontSize: "14px" }}>
                {isApiError}
              </span>
            )}
            {!isApiError && (
              <span>
                {isLoading ? <Loading /> : <span>{listData.routes}</span>}
              </span>
            )}
          </div>
          <div
            className={classes.text}
            title="Click to see Active Trips details"
          >
            <p>Active Trips</p>
            {isApiError && (
              <span style={{ fontWeight: "normal", fontSize: "14px" }}>
                {isApiError}
              </span>
            )}
            {!isApiError && (
              <span>
                {isLoading ? <Loading /> : <span>{listData.activeTrips}</span>}
              </span>
            )}
          </div>
        </div>
        {/* <div className={classes.tripChart}>
        <Chart options={options.options} series={options.series} type="line" height={270} className={classes.chart} />
      </div> */}
        <LiveTrip driverList={isLoading ? [] : driverList} isLoading={isLoading} />
      </div>
      {!sessionStorage.getItem("splashFlag") && (
        <div
          id="splash"
          style={{
            position: "absolute",
            backgroundColor: "white",
            top: "0",
            left: "0",
            height: "100vh",
            width: "100vw",
          }}
        >
          <img
            src={little}
            style={{
              width: "150px",
              height: "150px",
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default React.memo(Main);

// function distance(lat1,
//   lat2, lon1, lon2) {

//   // The math module contains a function
//   // named toRadians which converts from
//   // degrees to radians.
//   lon1 = lon1 * Math.PI / 180;
//   lon2 = lon2 * Math.PI / 180;
//   lat1 = lat1 * Math.PI / 180;
//   lat2 = lat2 * Math.PI / 180;

//   // Haversine formula
//   let dlon = lon2 - lon1;
//   let dlat = lat2 - lat1;
//   let a = Math.pow(Math.sin(dlat / 2), 2)
//     + Math.cos(lat1) * Math.cos(lat2)
//     * Math.pow(Math.sin(dlon / 2), 2);

//   let c = 2 * Math.asin(Math.sqrt(a));

//   // Radius of earth in kilometers. Use 3956
//   // for miles
//   let r = 6371;

//   // calculate the result
//   return (c * r * 1000);
// }
