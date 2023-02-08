import React from "react";
import "./LiveMap.css";
import photo from "../../Assets/admin.jpg";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import useHttp from "../../Hooks/use-http";
import DriverBooking from "./DriverBooking";
import Loading from "../../Loading/Loading";

let prev_driverEmail = "";
let flightPlanCoordinates = [];
let emailFlag = true;
let driverFlag = true;
let trip_interval = "";
let pathInterval = "";
let myFlag = 1;
let map;
let flightPath1;
let flightPath2;
let marker;
const LiveMap = (props) => {
  const [bookedDriver, setBookedDriver] = useState(false);
  const [onTripDriverEmail, setOnTripDriverEmail] = useState(false);
  const searchInputRef = useRef();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyAq88vEj-mQ9idalgeP1IuvulowkkFA-Nk&callback=myInitMap&libraries=places&v=weekly";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  if (prev_driverEmail && prev_driverEmail !== onTripDriverEmail && myFlag) {
    console.log("here", trip_interval);
    clearIntervalApiCall();
    clearIntervalFligthPath();
    // intervalApiCall();
    setTimeout(() => {
      flightPathInterval();
    });
    myFlag = 0;
  } else myFlag = 1;

  useEffect(() => {
    prev_driverEmail = "";
  }, []);

  const authenticateUser = (data) => {
    console.log(data, driverFlag);
    // debugger;
    if (data.Livetripdetails) {
      if (!driverFlag) {
        flightPlanCoordinates.push({
          lat: data.Livetripdetails[0].Latitude,
          lng: data.Livetripdetails[0].Longitude,
        });
      } else {
        flightPlanCoordinates = [];
        for (let i = 0; i < data.Livetripdetails.length; i++) {
          flightPlanCoordinates.push({
            lat: data.Livetripdetails[i].Latitude,
            lng: data.Livetripdetails[i].Longitude,
          });
        }
        driverFlag = false;
      }
      marker.icon.rotation =
        data.Livetripdetails[data.Livetripdetails.length - 1].Bearing;
    } else flightPlanCoordinates = [];
    // setIsLoadingRoute(false);
  };

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    if (onTripDriverEmail) intervalApiCall();
  }, [onTripDriverEmail, sendRequest]);

  function intervalApiCall() {
    flightPlanCoordinates = [];
    prev_driverEmail === onTripDriverEmail
      ? (driverFlag = false)
      : (driverFlag = true);
    prev_driverEmail = onTripDriverEmail;

    sendRequest(
      {
        url: "/api/v1/LiveTrip/GetLiveTripDetails",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          emailID: sessionStorage.getItem("user"),
          driverEmailID: onTripDriverEmail,
          corporateID: sessionStorage.getItem("corpId"),
          Isall: 1,
        },
      },
      authenticateUser
    );

    trip_interval = setInterval(() => {
      sendRequest(
        {
          url: "/api/v1/LiveTrip/GetLiveTripDetails",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            emailID: sessionStorage.getItem("user"),
            driverEmailID: onTripDriverEmail,
            corporateID: sessionStorage.getItem("corpId"),
            Isall: 0,
          },
        },
        authenticateUser
      );
    }, 5000);
    sessionStorage.setItem("interval", trip_interval);
  }

  function clearIntervalApiCall() {
    clearInterval(trip_interval);
    emailFlag = true;
  }

  function clearIntervalFligthPath() {
    marker?.setMap(null);
    clearInterval(pathInterval);
    flightPath1?.setMap(null);
    flightPath2?.setMap(null);
  }

  function flightPathInterval() {
    if (!onTripDriverEmail) {
      flightPlanCoordinates = [];
    }
    marker = new window.google.maps.Marker({
      position: flightPlanCoordinates[flightPlanCoordinates.length - 1],
      map,
      icon: {
        path: "M42.3 110.94c2.22 24.11 2.48 51.07 1.93 79.75-13.76.05-24.14 1.44-32.95 6.69-4.96 2.96-8.38 6.28-10.42 12.15-1.37 4.3-.36 7.41 2.31 8.48 4.52 1.83 22.63-.27 28.42-1.54 2.47-.54 4.53-1.28 5.44-2.33.55-.63 1-1.4 1.35-2.31 1.49-3.93.23-8.44 3.22-12.08.73-.88 1.55-1.37 2.47-1.61-1.46 62.21-6.21 131.9-2.88 197.88 0 43.41 1 71.27 43.48 97.95 41.46 26.04 117.93 25.22 155.25-8.41 32.44-29.23 30.38-50.72 30.38-89.54 5.44-70.36 1.21-134.54-.79-197.69.69.28 1.32.73 1.89 1.42 2.99 3.64 1.73 8.15 3.22 12.08.35.91.8 1.68 1.35 2.31.91 1.05 2.97 1.79 5.44 2.33 5.79 1.27 23.9 3.37 28.42 1.54 2.67-1.07 3.68-4.18 2.31-8.48-2.04-5.87-5.46-9.19-10.42-12.15-8.7-5.18-18.93-6.6-32.44-6.69-.75-25.99-1.02-51.83-.01-77.89C275.52-48.32 29.74-25.45 42.3 110.94zm69.63-90.88C83.52 30.68 62.75 48.67 54.36 77.59c21.05-15.81 47.13-39.73 57.57-57.53zm89.14-4.18c28.41 10.62 49.19 28.61 57.57 57.53-21.05-15.81-47.13-39.73-57.57-57.53zM71.29 388.22l8.44-24.14c53.79 8.36 109.74 7.72 154.36-.15l7.61 22.8c-60.18 28.95-107.37 32.1-170.41 1.49zm185.26-34.13c5.86-34.1 4.8-86.58-1.99-120.61-12.64 47.63-9.76 74.51 1.99 120.61zM70.18 238.83l-10.34-47.2c45.37-57.48 148.38-53.51 193.32 0l-12.93 47.2c-57.58-14.37-114.19-13.21-170.05 0zM56.45 354.09c-5.86-34.1-4.8-86.58 1.99-120.61 12.63 47.63 9.76 74.51-1.99 120.61z",
        scale: 0.07,
        strokeColor: "black",
        fillColor: "rgba(245, 174, 48, 255)",
        fillOpacity: 1,
        strokeWeight: 1,
        rotation: 0,
      },
      optimized: false,
    });

    pathInterval = setInterval(() => {
      if (document.getElementsByClassName("gm-fullscreen-control")[0])
        document.getElementsByClassName(
          "gm-fullscreen-control"
        )[0].style.marginTop = "45px";
      flightPath1 = new window.google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: "black",
        strokeOpacity: 1.0,
        strokeWeight: 7,
      });
      flightPath2 = new window.google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: "rgba(34, 137, 203, 255)",
        strokeOpacity: 1.0,
        strokeWeight: 5,
      });

      flightPath1.setMap(map);
      flightPath2.setMap(map);
      marker.setPosition(
        flightPlanCoordinates[flightPlanCoordinates.length - 1]
      );

      if (
        prev_driverEmail &&
        emailFlag &&
        flightPlanCoordinates[flightPlanCoordinates.length - 1]?.lat
      ) {
        map.setCenter({
          lat: flightPlanCoordinates[flightPlanCoordinates.length - 1]?.lat,
          lng: flightPlanCoordinates[flightPlanCoordinates.length - 1]?.lng,
        });
        map.setZoom(17);
        emailFlag = false;
      } else if (
        !flightPlanCoordinates[flightPlanCoordinates.length - 1]?.lat
      ) {
        map.setZoom(11);
        map.setCenter({ lat: 23.0358311, lng: 72.5579656 });
      }
    }, 2000);
  }

  function myInitMap() {
    map = new window.google.maps.Map(document.getElementById("live-map"), {
      center: { lat: 23.0225, lng: 72.5714 },
      zoom: 11,
      disableDefaultUI: true,
      fullscreenControl: true,
      zoomControl: true,
    });
    flightPathInterval();
  }

  window.myInitMap = myInitMap;

  const driverSearchHandler = (e) => {
    props.setDriverData(
      props.driver_data.filter(
        (data) =>
          data.driverName
            ?.toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          data.carNumber?.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const filterButtonClickHandler = (e) => {
    console.log(e.target.innerText);
    searchInputRef.current.value = "";
    if (e.target.innerText.toLowerCase() === "all")
      props.setDriverData(props.driver_data);
    else if (e.target.innerText.toLowerCase() === "on trip")
      props.setDriverData(
        props.driver_data.filter(
          (data) => data.status === e.target.innerText.toLowerCase()
        )
      );
    else if (e.target.innerText.toLowerCase() === "online")
      props.setDriverData(
        props.driver_data.filter(
          (data) => data.status === e.target.innerText.toLowerCase()
        )
      );
  };

  const onTripDriverClickHandler = (driverEmail, status) => {
    if (status === "on trip") {
      document
        .getElementById(prev_driverEmail)
        ?.classList.remove("currentDriver");
      document.getElementById(driverEmail).classList.add("currentDriver");
      prev_driverEmail = driverEmail;
      setOnTripDriverEmail(driverEmail);
      // setIsLoadingRoute(true);
    }
  };

  const bookButtonClickHandler = (
    driverImage,
    driverEmail,
    carNumber,
    carType
  ) => {
    // alert(e.target.parentElement.id);
    console.log(driverEmail, carNumber, carType);
    setBookedDriver([
      {
        driverImage,
        driverEmail,
        carNumber,
        carType,
      },
    ]);
  };

  return (
    <React.Fragment>
      {bookedDriver && <div className="backdrop"></div>}
      <div className="main-container" id="privatedriver">
        <div className="driverlist">
          <h4>Driver List</h4>
          <div className="filter-buttons" onClick={filterButtonClickHandler}>
            <button>All</button>
            <button>Online</button>
            <button>On Trip</button>
          </div>
          <input
            type="text"
            className="search"
            onChange={driverSearchHandler}
            ref={searchInputRef}
          />
          <div className="driverDetails">
            <br />
            {props.isLoading && <Loading driver="true" />}
            {props.driverData.length < 1 && !props.isLoading && (
              <div style={{ textAlign: "center" }}>No Drivers Available</div>
            )}
            {props.driverData.map((ele, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  id={ele.driverEmail}
                  className={ele.status === "on trip" ? "driverContainer" : ""}
                  onClick={() =>
                    onTripDriverClickHandler(ele.driverEmail, ele.status)
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      <img className="driverPhoto" src={ele.driverImage} />
                      <p
                        className={
                          ele?.status === "online"
                            ? "online"
                            : ele.status === "on trip"
                            ? "ontrip"
                            : ""
                        }
                      ></p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span className="drivername">{ele.driverName}</span>
                      <span className="carnumber">{ele.carNumber}</span>
                    </div>
                  </div>
                  {(ele.status === "online" || ele.status === "on trip") && (
                    <button
                      className={
                        ele.status === "online" ? "bookButton" : "onTripButtton"
                      }
                      onClick={
                        ele.status === "online"
                          ? () =>
                              bookButtonClickHandler(
                                ele.driverImage,
                                ele.driverName,
                                ele.carNumber,
                                ele.vehicleType
                              )
                          : ""
                      }
                    >
                      {ele.status === "online" ? "Book" : "On Trip"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="livetrip" id="live-map"></div>
      </div>
      {bookedDriver && (
        <DriverBooking
          bookedDriver={bookedDriver}
          setBookedDriver={setBookedDriver}
        />
      )}
    </React.Fragment>
  );
};

export default LiveMap;
