import React from "react";
import "./LiveMap.css";
import photo from "../../Assets/admin.jpg";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import useHttp from "../../Hooks/use-http";
import DriverBooking from "./DriverBooking";
import Loading from "../../Loading/Loading";
import Message from "../../Modal/Message";

var svg = '<svg height="35" width="35" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 411.02 361.23">' +
  '<path d="M23.36,342.13a3.3,3.3,0,0,1-2.78-1.64l-.25-.46-.27-.44a3.37,3.37,0,0,1,.14-2.91L202,21.48a4.79,4.79,0,0,1,3.54-2.38A4.08,4.08,0,0,1,208.65,21l182,315a4,4,0,0,1,.31,3.54l-.27.43-.23.44a3.34,3.34,0,0,1-2.8,1.66Z" style="fill:#fff"/>' +
  '<path d="M344.78,313.39l-139.26-241L66.27,313.39ZM23.36,342.13a3.3,3.3,0,0,1-2.78-1.64l-.25-.46-.27-.44a3.37,3.37,0,0,1,.14-2.91L202,21.48a4.79,4.79,0,0,1,3.54-2.38A4.08,4.08,0,0,1,208.65,21l182,315a4,4,0,0,1,.31,3.54l-.27.43-.23.44a3.34,3.34,0,0,1-2.8,1.66Z" style="fill:#666"/>' +
  '<path d="M166,216.36l-8.44-6.14a13.08,13.08,0,0,1-.93,1.4c-2.22,2.57-5.25,2.94-7.68,1a5.56,5.56,0,0,1-.83-8.05c4.06-5.19,8.19-10.32,12.3-15.47,1.94-2.44,4-4.82,5.81-7.35a8.52,8.52,0,0,1,7.33-3.64c10.22,0,20.44-.12,30.65,0,8.81.13,16,7.72,16,16.56q0,26.06,0,52.1a3.1,3.1,0,0,0,1.4,2.9c9.21,6.61,18.35,13.29,27.51,20,.23.17.47.3.81.52l3.31-4.8c1.51-2.18,2.91-2.44,5-.91L275,276.62c.3.23.62.43,1.06.72a42.66,42.66,0,0,0,3.43-4.58,5.07,5.07,0,0,0,.27-3.08c-.55-3.42,1-5.16,3.85-7.05,5.31-3.49,10.72-5.25,17.08-4.62a10.23,10.23,0,0,1,5.77,2c4,3.13,8.17,6,12.25,9.06a5,5,0,0,1,1.36,1.42q12.24,21.15,24.42,42.32a4.9,4.9,0,0,1,.26.61h-112a67.9,67.9,0,0,0,5-7.07c2.05-3.81,4.93-5.45,9.17-4.6,2.86.57,4.68-.63,6.06-3.1a53.06,53.06,0,0,1,3.49-4.89l-8-5.6c-1.69-1.18-3.4-2.34-5.07-3.56s-2-2.82-.73-4.59,2.36-3.23,3.61-4.93L218,254.15c-.41.19-.85.41-1.3.59-3.74,1.53-7.59-.79-7.56-4.83a4.58,4.58,0,0,0-2.41-4.27c-4.57-3.1-9-6.37-13.52-9.58a3.9,3.9,0,0,0-1.51-.7c1.26,1.94,2.5,3.9,3.78,5.83,4.41,6.71,8.81,13.43,13.28,20.11a11.32,11.32,0,0,1,2,6.45c0,12.23,0,24.46,0,36.69,0,4.35-2.36,7.64-5.92,8.55a8.11,8.11,0,0,1-9.77-7,22.43,22.43,0,0,1-.16-2.84c0-10,0-20,0-30a5.57,5.57,0,0,0-.83-2.77c-5-7.83-10.16-15.62-15.25-23.42-.27-.41-.57-.81-1-1.48-.05.75-.1,1.21-.1,1.67,0,7.43,0,14.85,0,22.28a11.47,11.47,0,0,1-1.59,6.05q-9.69,16.51-19.34,33.07a8.16,8.16,0,0,1-8.2,4.43,7.56,7.56,0,0,1-6.58-5.22c-1-2.6-.39-5,1-7.35q8.12-14,16.14-28a6.15,6.15,0,0,0,.79-3c.06-13.13.11-26.25,0-39.37a15.88,15.88,0,0,1,3.33-9.93C164.07,218.93,165,217.69,166,216.36Zm43-5c-5,6.36-9.62,12.33-14.33,18.35L209,240Zm-47.43-5.92,8.25,6L185.2,191.9a2.85,2.85,0,0,0-.6-.25c-3.79-.12-7.58-.26-11.37-.31a1.78,1.78,0,0,0-1.18.73C168.59,196.45,165.17,200.86,161.57,205.47Z"/>' +
  '<path d="M205.43,161.57a15.86,15.86,0,0,1,15.81-15.9c8.52,0,15.72,7.43,15.69,16.12A16.11,16.11,0,0,1,221,177.51,15.83,15.83,0,0,1,205.43,161.57Z"/></svg>';

let prev_driverEmail = "";
let flightPlanCoordinates = [];
let emailFlag = true;
let driverFlag = true;
let trip_interval = "";
let pathInterval = "";
let myFlag = 1;
let map;
let prev_driverId = "";
let flightPath1;
let flightPath2;
let marker;

var numDeltas = 100;
var delay = 20; //milliseconds
var i = 0;
var deltaLat;
var deltaLng;


const LiveMap = (props) => {
  const [bookedDriver, setBookedDriver] = useState(false);
  const [onTripDriverEmail, setOnTripDriverEmail] = useState();
  const [tripRequestStatus, setTripRequestStatus] = useState(false);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const searchInputRef = useRef();

  function transition() {
    i = 0;
    deltaLat = (flightPlanCoordinates[flightPlanCoordinates.length - 1].lat - flightPlanCoordinates[flightPlanCoordinates.length - 2].lat) / numDeltas;
    deltaLng = (flightPlanCoordinates[flightPlanCoordinates.length - 1].lng - flightPlanCoordinates[flightPlanCoordinates.length - 2].lng) / numDeltas;
    moveMarker();
  }

  function moveMarker() {
    flightPlanCoordinates[flightPlanCoordinates.length - 2].lat += deltaLat;
    flightPlanCoordinates[flightPlanCoordinates.length - 2].lng += deltaLng;
    var latlng = new window.google.maps.LatLng(flightPlanCoordinates[flightPlanCoordinates.length - 2].lat, flightPlanCoordinates[flightPlanCoordinates.length - 2].lng);
    // marker.setTitle("Latitude:" + position[0] + " | Longitude:" + position[1]);
    marker.setPosition(latlng);
    if (i != numDeltas) {
      i++;
      setTimeout(moveMarker, delay);
    }
  }

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
      // debugger;
      let icon = marker.getIcon();
      icon.rotation = data.Livetripdetails[data.Livetripdetails.length - 1].Bearing;
      marker.setIcon(icon);
    } else flightPlanCoordinates = [];
    setIsLoadingRoute(false);
  };

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    if (onTripDriverEmail) intervalApiCall();
  }, [onTripDriverEmail, sendRequest]);

  function intervalApiCall() {
    flightPlanCoordinates = [];
    console.log("prev_driverEmail", prev_driverEmail, onTripDriverEmail);
    prev_driverEmail && prev_driverEmail === onTripDriverEmail
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
          corporateID: "",
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
        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        // url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg),
        fillColor: "rgba(245, 174, 48, 255)",
        fillOpacity: 0.9,
        strokeWeight: 0.75,
        rotation: 0,
        scale: 6,
        // anchor: new window.google.maps.Point(0, 20),
      },
      optimized: false,
    });

    pathInterval = setInterval(() => {
      if (document.getElementsByClassName("gm-fullscreen-control")[0])
        document.getElementsByClassName(
          "gm-fullscreen-control"
        )[0].style.marginTop = "45px";


      flightPath2 = new window.google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: "#909090",
        strokeOpacity: 1.0,
        strokeWeight: 4,
      });

      if (flightPlanCoordinates.length > 1) {
        setTimeout(() => {
          flightPath2.setMap(map);
        }, 3000);
        transition();
      } else if (flightPlanCoordinates.length > 0) {
        flightPath2.setMap(map);
        marker.setPosition(
          flightPlanCoordinates[flightPlanCoordinates.length - 1]
        );
      }

      if (
        prev_driverEmail &&
        emailFlag &&
        flightPlanCoordinates[flightPlanCoordinates.length - 1]?.lat
      ) {
        map.setCenter({
          lat: flightPlanCoordinates[flightPlanCoordinates.length - 1]?.lat,
          lng: flightPlanCoordinates[flightPlanCoordinates.length - 1]?.lng,
        });
        map.setZoom(15);
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
        .getElementById(prev_driverId)
        ?.classList.remove("currentDriver");
      document.getElementById(driverEmail).classList.add("currentDriver");
      prev_driverId = driverEmail;
      setOnTripDriverEmail(driverEmail);
      setIsLoadingRoute(true);
    }
  };

  const bookButtonClickHandler = (
    driverImage,
    driverName,
    carNumber,
    carType,
    driverEmail
  ) => {
    // alert(e.target.parentElement.id);
    // console.log(driverEmail, carNumber, carType);
    setBookedDriver([
      {
        driverImage,
        driverName,
        carNumber,
        carType,
        driverEmail
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
                              ele.vehicleType,
                              ele.driverEmail
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
        <div className="privateDriverMap-container">
          <div className="livetrip" id="live-map"></div>
          <div className="mapText">Live Trip Tracker</div>
          {isLoadingRoute && (
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "white",
                opacity: "0.5",
              }}
            ></div>
          )}
          {isLoadingRoute && <Loading driver="true" />}
        </div>
      </div>
      {bookedDriver && (
        <DriverBooking
          bookedDriver={bookedDriver}
          setBookedDriver={setBookedDriver}
          riderData={props.riderData}
          tripRequestStatusFunc={(status) => {
            setTripRequestStatus(status);
            setBookedDriver(false);
          }}
        />
      )}
      {tripRequestStatus &&
        <Message type={tripRequestStatus === "accepted" ? "success" : "fail"} message="Driver has accepted your request" driveErrorMessage="Driver has not accepted your request" />
      }
    </React.Fragment>
  );
};

export default LiveMap;
