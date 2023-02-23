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
import connectionPoint from "../../Assets/start_location_green.png";
import { useHistory } from "react-router-dom";
import startPoint from "../../Assets/Pin_icon_green50.png"

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

let drawLineFlag = false;
let journeyStart = 0;
let onTripDriverName = "";


const LiveMap = (props) => {
  const [bookedDriver, setBookedDriver] = useState(false);
  const [onTripDriverEmail, setOnTripDriverEmail] = useState();
  const [tripRequestStatus, setTripRequestStatus] = useState(false);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [isTripEnded, setIsTripEnded] = useState(false);
  const searchInputRef = useRef();
  const history = useHistory()

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
    prev_driverEmail = "";
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyAq88vEj-mQ9idalgeP1IuvulowkkFA-Nk&callback=myInitMap&libraries=places&v=weekly";
    script.async = true;
    document.body.appendChild(script);
  }, [onTripDriverEmail]);

  if (prev_driverEmail && prev_driverEmail !== onTripDriverEmail && myFlag) {
    // console.log("here", trip_interval);
    clearIntervalApiCall();
    clearIntervalFligthPath();
    // intervalApiCall();
    setTimeout(() => {
      flightPathInterval();
    });
    myFlag = 0;
  } else myFlag = 1;

  const authenticateUser = (data) => {
    // console.log(data, driverFlag);
    // debugger;
    if (data.Livetripdetails) {
      if (!driverFlag) {
        if (flightPlanCoordinates[flightPlanCoordinates.length - 1].lat !== data.Livetripdetails[0].Latitude && flightPlanCoordinates[flightPlanCoordinates.length - 1].lng !== data.Livetripdetails[0].Longitude)
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
        drawLineFlag = true;
        driverFlag = false;
      }
      // debugger;
      let icon = marker.getIcon();
      // console.log(icon);
      icon.rotation = data.Livetripdetails[data.Livetripdetails.length - 1].Bearing;
      marker.setIcon(icon);
      journeyStart = 1;
      setIsTripEnded(false);
    } else {
      if (journeyStart) setIsTripEnded(true);
      journeyStart = 0;
      flightPlanCoordinates = [];
    }
    setIsLoadingRoute(false);
  };

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    if (onTripDriverEmail) intervalApiCall();
  }, [onTripDriverEmail]);
  // }, [onTripDriverEmail, sendRequest]);

  function intervalApiCall() {
    flightPlanCoordinates = [];
    // console.log("prev_driverEmail", prev_driverEmail, onTripDriverEmail);
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
    // flightPath1?.setMap(null);
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
        // url: "https://d1a3f4spazzrp4.cloudfront.net/car-types/map70px/map-uberx.png",
        fillColor: "rgba(245, 174, 48, 255)",
        fillOpacity: 0.9,
        strokeWeight: 0.75,
        rotation: 0,
        scale: 6,
        // anchor: new window.google.maps.Point(0, 0),
      },
      optimized: false,
    });

    pathInterval = setInterval(() => {
      let startPointMarker = new window.google.maps.Marker({
        position: flightPlanCoordinates[0],
        map,
        icon: startPoint
      });
      // flightPath1 = new window.google.maps.Polyline({
      //   path: flightPlanCoordinates,
      //   // geodesic: true,
      //   strokeColor: "black",
      //   strokeOpacity: 10.0,
      //   strokeWeight: 5,
      // });

      flightPath2 = new window.google.maps.Polyline({
        path: flightPlanCoordinates,
        // geodesic: true,
        strokeColor: "#00b0ff",
        strokeOpacity: 10.0,
        strokeWeight: 3,
      });
      // if (drawLineFlag) {
      // flightPath1?.setMap(null);
      if (document.getElementsByClassName("gm-fullscreen-control")[0])
        document.getElementsByClassName(
          "gm-fullscreen-control"
        )[0].style.marginTop = "45px";

      // flightPath1 = new window.google.maps.Polyline({
      //   path: flightPlanCoordinates,
      //   // geodesic: true,
      //   strokeColor: "black",
      //   strokeOpacity: 10.0,
      //   strokeWeight: 5,
      // });

      // flightPath2 = new window.google.maps.Polyline({
      //   path: flightPlanCoordinates,
      //   // geodesic: true,
      //   strokeColor: "#00b0ff",
      //   strokeOpacity: 10.0,
      //   strokeWeight: 4,
      // });

      if (flightPlanCoordinates.length > 1) {
        // setTimeout(() => {
        // flightPath1?.setMap(null);
        flightPath2?.setMap(null);
        // flightPath1.setMap(map);
        flightPath2.setMap(map);
        marker.setPosition(flightPlanCoordinates[flightPlanCoordinates.length - 1])
        // }, 3000);
        // transition();
      } else if (flightPlanCoordinates.length > 0) {
        // flightPath1?.setMap(null);
        flightPath2?.setMap(null);
        // flightPath1.setMap(map);
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
        map.setZoom(14);
        emailFlag = false;
      } else if (
        !flightPlanCoordinates[flightPlanCoordinates.length - 1]?.lat
      ) {
        map.setZoom(11);
        // map.setCenter({ lat: 23.0358311, lng: 72.5579656 });
      }
      drawLineFlag = false;
      // }
    }, 2000);
  }

  function myInitMap() {
    map = new window.google.maps.Map(document.getElementById("live-map"), {
      // mapId: "8e0a97af9386fef",
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

  const onTripDriverClickHandler = (driverEmail, status, driverName) => {
    if (status === "on trip") {
      document
        .getElementById(prev_driverId)
        ?.classList.remove("currentDriver");
      document.getElementById(driverEmail).classList.add("currentDriver");
      prev_driverId = driverEmail;
      onTripDriverName = driverName;
      setOnTripDriverEmail(driverEmail);
      setIsLoadingRoute(true);
    }
  };

  const bookButtonClickHandler = (
    driverImage,
    driverName,
    carNumber,
    carType,
    driverEmail,
    carModel,
    carColor
  ) => {
    // alert(e.target.parentElement.id);
    // console.log(driverEmail, carNumber, carType);
    setBookedDriver([
      {
        driverImage,
        driverName,
        carNumber,
        carType,
        driverEmail,
        carModel,
        carColor
      },
    ]);
  };

  return (
    <React.Fragment>
      {bookedDriver && <div className="backdrop"></div>}
      {/* <header style={{display: "flex", justifyContent: "space-between", margin: "10px 10px 0px 10px"}} >
        <div>
          <p className="adminName">
            {"Welcome " + sessionStorage.getItem("adminName")}
          </p>
          <p className="adminText">
            You can check all data of your Organization in Dashboard!
          </p>
        </div>
        <button onClick={() => history.push("/privatedrive/trips")} className="newCorpButton">View Trips</button>
      </header> */}
      <div className="main-container" id="privatedriver" style={props.toggle ? { padding: "15px 0px" } : {}} >
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
                    onTripDriverClickHandler(ele.driverEmail, ele.status, ele.driverName)
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
                              ele.driverEmail,
                              ele.carModel,
                              ele.carColor
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
          <div className="mapText" style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Live Trip Tracker</span>
            <button onClick={() => history.push("/privatedrive/trips")} className="newCorpButton">View Trips</button>
          </div>
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
      {isTripEnded &&
        < Message type="success" message={ onTripDriverName + "'s Trip has been ended"} />
      }
    </React.Fragment>
  );
};

export default LiveMap;
