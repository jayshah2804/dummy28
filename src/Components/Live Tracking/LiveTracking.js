import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useHistory } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import CryptoJS from "crypto-js";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import useHttp from "../../Hooks/use-http";
import DriverBooking from "./PrivateDriverBooking";
import Loading from "../../Loading/Loading";
import Message from "../../Modal/Message";
import "./LiveTracking.css";
import startPoint from "../../Assets/dropIcon.png";
import endPoint from "../../Assets/pickIcon.png";
import photo from "../../Assets/admin.jpg";

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
let startPointMarker;
let endPointMarker;
var numDeltas = 100;
var delay = 20; //milliseconds
var i = 0;
var deltaLat;
var deltaLng;

let drawLineFlag = false;
let journeyStart = 0;
let onTripDriverName = "";
let riderDetails = "";
let onlineDriversMarker = [];
const LiveTracking = (props) => {
  const [bookedDriver, setBookedDriver] = useState(false);
  const [onTripDriverEmail, setOnTripDriverEmail] = useState(null);
  const [tripRequestStatus, setTripRequestStatus] = useState(false);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [isTripEnded, setIsTripEnded] = useState(false);
  const [driverFilterType, setDriverFilterType] = useState("All");
  const [filteredDriverData, setFilteredDriverData] = useState([]);
  const [servicesTabbarValue, setServicesTabbarValue] = useState(0);
  const searchInputRef = useRef();
  const history = useHistory();

  useEffect(() => {
    if (props.driverData.length > 0 && !props.isLoading) {
      setFilteredDriverData(props.driverData);
    }
  }, [props.driverData, props.isLoading]);

  function transition() {
    i = 0;
    deltaLat =
      (flightPlanCoordinates[flightPlanCoordinates.length - 1].lat -
        flightPlanCoordinates[flightPlanCoordinates.length - 2].lat) /
      numDeltas;
    deltaLng =
      (flightPlanCoordinates[flightPlanCoordinates.length - 1].lng -
        flightPlanCoordinates[flightPlanCoordinates.length - 2].lng) /
      numDeltas;
    moveMarker();
  }

  function moveMarker() {
    flightPlanCoordinates[flightPlanCoordinates.length - 2].lat += deltaLat;
    flightPlanCoordinates[flightPlanCoordinates.length - 2].lng += deltaLng;
    var latlng = new window.google.maps.LatLng(
      flightPlanCoordinates[flightPlanCoordinates.length - 2].lat,
      flightPlanCoordinates[flightPlanCoordinates.length - 2].lng
    );
    // marker.setTitle("Latitude:" + position[0] + " | Longitude:" + position[1]);
    marker.setPosition(latlng);
    if (i != numDeltas) {
      i++;
      setTimeout(moveMarker, delay);
    }
  }

  useEffect(() => {
    prev_driverEmail = "";
    riderDetails = "";
    // document.getElementsByClassName("filter-buttons")[0].children[0].style.boxShadow = "0 10px 10px rgba(33, 33, 33, .3)"
    // document.getElementsByClassName("filter-buttons")[0].children[0].style.transform = "scale(1.05)"
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDHdkmGjsfNqasFs6m9CooShFZsqWHcdUs&callback=myInitMap&libraries=places&v=weekly";
    script.async = true;
    document.body.appendChild(script);
  }, [onTripDriverEmail, driverFilterType]);

  if ((prev_driverEmail && prev_driverEmail !== onTripDriverEmail && myFlag) || (prev_driverEmail == null && onTripDriverEmail == null)) {
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
    if (!onTripDriverEmail) {
      if (data) {
        let driverDetails = JSON.parse(data);
        for (let i = 0; i < onlineDriversMarker.length; i++) {
          onlineDriversMarker[i]?.setMap(null);
        }
        onlineDriversMarker = [];
        const infoWindow = new window.google.maps.InfoWindow();
        // debugger;
        for (let i = 0; i < driverDetails.length; i++) {
          if (driverDetails[i].Latitude > 0 && (driverFilterType === "Online" ? !(driverDetails[i].TripID) : (driverFilterType === "On Trip" ? driverDetails[i].TripID : 1))) {
            onlineDriversMarker[i] = new window.google.maps.Marker({
              position: { lat: driverDetails[i].Latitude, lng: driverDetails[i].Longitude },
              map,
              icon: {
                url: "https://littleimages.blob.core.windows.net/corporate/INDIA/8DB35DE7-8572-4BB8-BF7C-7D06603A92C9",
                scaledSize: new window.google.maps.Size(34, 34),
                anchor: new window.google.maps.Point(17, 17),
              },
              myTitle: `${driverDetails[i].FullName}`,
            });
            onlineDriversMarker[i].addListener("click", () => {
              infoWindow.close();
              infoWindow.setContent(onlineDriversMarker[i].myTitle);
              infoWindow.open(onlineDriversMarker[i].getMap(), onlineDriversMarker[i]);
            });
          }
        }
        const markerUrl =
          "https://littleimages.blob.core.windows.net/corporate/INDIA/8DB35DE7-8572-4BB8-BF7C-7D06603A92C9";
        setTimeout(() => {
          for (let i = 0; i < onlineDriversMarker.length; i++) {
            let markerSrc = document.querySelectorAll(`[src = "${markerUrl}"]`);
            if (onlineDriversMarker[i] && markerSrc[i])
              markerSrc[i].style.transform = `rotate(${driverDetails[i].Bearing}deg)`;
          }
        }, 2000);
      }
    } else {
      if (data.Livetripdetails) {
        console.log(onTripDriverEmail, data.Livetripdetails[0].EmailID);
        if (!driverFlag) {
          if (
            flightPlanCoordinates[flightPlanCoordinates.length - 1]?.lat !==
            data.Livetripdetails[0]?.Latitude &&
            flightPlanCoordinates[flightPlanCoordinates.length - 1]?.lng !==
            data.Livetripdetails[0]?.Longitude
          )
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
        journeyStart = 1;

        // setTimeout(() => {
        const markerUrl =
          "https://littleimages.blob.core.windows.net/corporate/INDIA/8DB35DE7-8572-4BB8-BF7C-7D06603A92C9";
        // console.log(document.querySelector(`[src = "${markerUrl}"]`));
        // setTimeout(() => {
        let markerSrc = document.querySelector(`[src = "${markerUrl}"]`);
        if (marker && markerSrc)
          markerSrc.style.transform = `rotate(${data.Livetripdetails[data.Livetripdetails.length - 1].Bearing
            }deg)`;
        // }, 1000);
        // });

        setIsTripEnded(false);
      } else {
        if (data?.LivetripStatus?.toLowerCase() === "ended") {
          setIsTripEnded(true);
          flightPlanCoordinates = [];
        } else setIsTripEnded(false);
        // if (journeyStart) setIsTripEnded(true);
        // journeyStart = 0;
        // flightPlanCoordinates = [];
      }

      if (!(data?.LivetripStatus?.toLowerCase() === "ended" || data?.LivetripStatus?.toLowerCase() === "arrived")) {
        if (startPointMarker) startPointMarker.setMap(null);
        if (endPointMarker) endPointMarker.setMap(null);
        startPointMarker = new window.google.maps.Marker({
          position: data.Livetrip[0]?.ActualPickupName
            ? {
              lat: +data?.Livetrip[0]?.ActualPickupAddress.split(",")[0],
              lng: +data?.Livetrip[0]?.ActualPickupAddress.split(",")[1],
            }
            : {
              lat: data?.Livetrip[0]?.PickupLatitude,
              lng: data?.Livetrip[0]?.PickupLongitude,
            },
          map,
          icon: startPoint,
          myTitle: `${data.Livetrip[0].ActualPickupName
            ? data.Livetrip[0].ActualPickupName
            : data?.Livetrip[0]?.PickupAddress?.split(",")[0]
            }`,
        });
        endPointMarker = new window.google.maps.Marker({
          position: {
            lat: data?.Livetrip[0]?.DropoffLatitude,
            lng: data?.Livetrip[0]?.DropoffLongitude,
          },
          map,
          icon: endPoint,
          myTitle: `${data?.Livetrip[0]?.DropoffAddress?.split(",")[0]}`,
        });
        // endPointMarker.setAnimation(window.google.maps.Animation.BOUNCE)
        var bounds = new window.google.maps.LatLngBounds();
        bounds.extend(
          new window.google.maps.LatLng(
            data.Livetrip[0]?.PickupLatitude,
            data.Livetrip[0]?.PickupLongitude
          )
        );
        bounds.extend(
          new window.google.maps.LatLng(
            data.Livetrip[0]?.DropoffLatitude,
            data.Livetrip[0]?.DropoffLongitude
          )
        );
        const infoWindow = new window.google.maps.InfoWindow();
        startPointMarker.addListener("mouseover", () => {
          infoWindow.close();
          infoWindow.setContent(startPointMarker.myTitle);
          infoWindow.open(startPointMarker.getMap(), startPointMarker);
        });
        endPointMarker.addListener("mouseover", () => {
          infoWindow.close();
          infoWindow.setContent(endPointMarker.myTitle);
          infoWindow.open(endPointMarker.getMap(), endPointMarker);
        });
        riderDetails = {
          name: data.Livetrip[0].riderName,
          mNumber: data.Livetrip[0].riderMobileNumber,
        };
      }
    }
    setIsLoadingRoute(false);
  };

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    if (onTripDriverEmail) intervalApiCall();
  }, [onTripDriverEmail]);

  useEffect(() => {
    if (!onTripDriverEmail) {
      setIsLoadingRoute(true);
      var secretkey = "f080786e3a348458a621e2fa4c267ad8";
      var key = CryptoJS.enc.Utf8.parse(secretkey);
      var iv = CryptoJS.enc.Utf8.parse("84jfkfndl3ybdfkf");

      let data = `FORMID|JSONDATA|JSONDATA|{"FORMID":"GETDRIVERLOCATIONS_PD","VehicleTypes":{"CorporateID":"${sessionStorage.getItem("adminDepartmentID")}"},"Country":"INDIA","City":"AHMEDABAD","userId": "${sessionStorage.getItem("user")}"}`;
      var cipherText = CryptoJS.AES.encrypt(
        data,
        key,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      ).toString();
      // console.log(encodeURIComponent(cipherText));
      sendRequest(
        {
          url: "/api/v1/DriverList/DriveronlineLocations",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            cipherText: encodeURIComponent(cipherText)
          },
        },
        authenticateUser
      );
    }
    // }, [onTripDriverEmail, driverFilterType]);
  }, [onTripDriverEmail, driverFilterType]);

  function intervalApiCall() {
    flightPlanCoordinates = [];
    if (prev_driverEmail == null)
      driverFlag = true;
    else {
      prev_driverEmail && prev_driverEmail === onTripDriverEmail
        ? (driverFlag = false)
        : (driverFlag = true);
      prev_driverEmail = onTripDriverEmail;
    }

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
    riderDetails = "";
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
    if (onTripDriverEmail == null) {
      flightPath2 = new window.google.maps.Polyline({
        path: flightPlanCoordinates,
      });
    }
    else {
      marker = new window.google.maps.Marker({
        position: flightPlanCoordinates[flightPlanCoordinates.length - 1],
        map,
        icon: {
          url: "https://littleimages.blob.core.windows.net/corporate/INDIA/8DB35DE7-8572-4BB8-BF7C-7D06603A92C9",
          scaledSize: new window.google.maps.Size(34, 34),
          anchor: new window.google.maps.Point(17, 17),
        },
        optimized: false,
      });

      pathInterval = setInterval(() => {
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
          marker.setPosition(
            flightPlanCoordinates[flightPlanCoordinates.length - 1]
          );
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
          (prev_driverEmail || prev_driverEmail == null) &&
          (emailFlag) &&
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
          // map.setZoom(11);
          // map.setCenter({ lat: 23.0358311, lng: 72.5579656 });
        }
        drawLineFlag = false;
        // }
      }, 2000);
    }
  }

  function myInitMap() {
    map = new window.google.maps.Map(document.getElementById("live-map"), {
      center: { lat: 23.0225, lng: 72.5714 },
      zoom: 12,
      disableDefaultUI: true,
      fullscreenControl: true,
      zoomControl: true,
    });
    flightPathInterval();
  }

  window.myInitMap = myInitMap;

  const driverSearchHandler = (e) => {
    setFilteredDriverData(
      props.driverData.filter(
        (data) =>
          data.driverName
            ?.toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          data.carNumber?.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const onTripDriverClickHandler = (driverEmail, isOnTrip, driverName) => {
    if (isOnTrip == "1") {
      // document.getElementById(prev_driverId)?.classList.remove("currentDriver");
      // document.getElementById(driverEmail).classList.add("currentDriver");
      prev_driverId = driverEmail;
      onTripDriverName = driverName;
      riderDetails = "";
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
    carColor,
    activeShiftCororateName,
    activeShiftCorporateId
  ) => {
    setBookedDriver([
      {
        driverImage,
        driverName,
        carNumber,
        carType,
        driverEmail,
        carModel,
        carColor,
        activeShiftCororateName,
        activeShiftCorporateId
      },
    ]);
  };

  return (
    <React.Fragment>
      {bookedDriver && <div className="backdrop"></div>}
      <div
        className="main-container"
        id="privatedriver"
        style={props.toggle ? { padding: "15px 0px" } : {}}
      >
        <div className="driverlist">
          <div className="header">
            {/* <h4>Driver List</h4> */}
            <p style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "300" }}>Driver List</p>
            <div className="driver-filter">
              <Tabs variant='fullWidth' sx={{ button: { padding: "0", fontSize: "12px" }, div: { minHeight: "35px" }, span: { bottom: "5px" } }} style={{ cursor: "pointer" }} centered value={servicesTabbarValue} onChange={(e, newValue) => {
                if (newValue == "0")
                  // setFilteredDriverData(props.driverData.filter(data => data.driverName.toLowerCase().includes(searchInputRef?.current?.value?.toLowerCase())));
                  setFilteredDriverData(props.driverData);
                else if (newValue == "2")
                  setFilteredDriverData(props.driverData.filter((data) => data.isOnTrip == "1"));
                else if (newValue == "1")
                  setFilteredDriverData(props.driverData.filter((data) => data.isOnline == "1" && data.isOnTrip == "0"));
                setDriverFilterType(newValue == "0" ? "All" : (newValue == "1" ? "Online" : "On Trip"));
                setOnTripDriverEmail("");
                setServicesTabbarValue(newValue);
              }} aria-label="basic tabs example">
                <Tab label="All" style={{ fontWeight: "bold" }} sx={{ button: { minHeight: "35px" } }} />
                <Tab label="Online" style={{ fontWeight: "bold" }} sx={{ button: { minHeight: "35px" } }} />
                <Tab label="On Trip" style={{ fontWeight: "bold" }} sx={{ button: { minHeight: "35px" } }} />
              </Tabs>
              {/* <TextField id="outlined-basic" size="small" inputRef={searchInputRef} label="Search Driver" variant="standard" onChange={driverSearchHandler} /> */}
              {/* <FormControl size="small" className="driverType" >
                <Select
                  labelId="demo-simple-select-label"
                  variant="standard"
                  id="demo-simple-select"
                  value={driverFilterType}
                  label="Type"
                  onChange={(e) => {
                    if (e.target.value === "All")
                      setFilteredDriverData(props.driverData.filter(data => data.driverName.toLowerCase().includes(searchInputRef.current.value?.toLowerCase())));
                    else if (e.target.value === "On Trip")
                      setFilteredDriverData(filteredDriverData.filter((data) => data.isOnTrip == "1"));
                    else if (e.target.value === "Online")
                      setFilteredDriverData(filteredDriverData.filter((data) => data.isOnline == "1" && data.isOnTrip == "0"));
                    setDriverFilterType(e.target.value);
                    setOnTripDriverEmail("");
                  }}
                >
                  <MenuItem value={"All"}>All</MenuItem>
                  <MenuItem value={"Online"}>Online</MenuItem>
                  <MenuItem value={"On Trip"}>On Trip</MenuItem>
                </Select>
              </FormControl > */}
            </div>
          </div>
          <div className="driverDetails">
            {props.isLoading && <CircularProgress sx={{ position: "absolute", top: "40%", left: "45%", transform: "translate(-50%,-50%)" }} />}
            {filteredDriverData.length < 1 && !props.isLoading && (
              <div style={{ textAlign: "center", marginTop: "20px" }}>No Drivers Available</div>
            )}
            {filteredDriverData.map((ele) => {
              return (
                <div
                  id={ele.driverEmail}
                  key={ele.driverEmail}
                  className={`driverSingleData ${ele.isOnTrip == "1" ? "driverContainer" : ""} ${onTripDriverEmail === ele.driverEmail ? "currentDriver" : ""}`}
                  onClick={() =>
                    onTripDriverClickHandler(
                      ele.driverEmail,
                      ele.isOnTrip,
                      ele.driverName
                    )
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ position: "relative", alignSelf: "center" }}>
                      <img className="driverPhoto" src={ele.driverImage} />
                      <p
                        className={
                          ele?.isOnTrip == "1"
                            ? "ontrip" : (ele.isOnline == "1" ? "online" : "offline")
                          // : "offline"
                        }
                      ></p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span className="drivername">{ele.driverName}</span>
                      <span className="carnumber">{ele.carNumber.replaceAll("-", "")}</span>
                      {(ele.isOnTrip == "1" || (ele.isOnline == "1" && ele.isShiftStarted == "1")) &&
                        <span style={{ fontSize: "10px", fontFamily: "Poppins", textTransform: "capitalize", color: "gray" }}>{ele.isOnTrip == "0" ? "private" : ele.tripType}</span>
                      }
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        {/* {(ele.isOnTrip == "1" || (ele.isOnline == "1" && ele.isShiftStarted == "1")) &&
                          <span className={ele.isOnTrip == "0" ? `tripType private` : `tripType ${ele.tripType?.toLowerCase()}`} >{ele.isOnTrip == "0" ? "private" : ele.tripType}</span>
                        } */}
                      </div>
                    </div>
                  </div>
                  {
                    (ele.isOnTrip == "1" || (ele.isOnline == "1" && ele.isShiftStarted == "1")) && (
                      <button
                        className={
                          ele.isOnTrip == "1" ? "onTripButtton" : "bookButton"
                        }
                        onClick={
                          ele.isOnline == "1"
                            ? () =>
                              bookButtonClickHandler(
                                ele.driverImage,
                                ele.driverName,
                                ele.carNumber,
                                ele.vehicleType,
                                ele.driverEmail,
                                ele.carModel,
                                ele.carColor,
                                ele.activeShiftCororateName,
                                ele.activeShiftCorporateId
                              )
                            : ""
                        }
                      >
                        {ele.isOnTrip == "1" ? "On Trip" : "Book"}
                      </button>
                    )
                  }
                </div>
              );
            })}
          </div>
        </div>
        <div className="privateDriverMap-container">
          <div className="mapText">
            <span style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: "300" }} >Live Trip Tracker</span>
          </div>
          <div className="livetrip" id="live-map"></div>
          {riderDetails && (
            <div className="riderInfoContainer">
              <div
                style={{ display: "flex", gap: "15px", alignItems: "center" }}
              >
                <FaRegUserCircle />
                <span>{riderDetails.name}</span>
              </div>
              <div
                style={{ display: "flex", gap: "15px", alignItems: "center" }}
              >
                <FiPhoneCall />
                <span>{"+" + riderDetails.mNumber}</span>
              </div>
            </div>
          )}
          {isLoadingRoute && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                left: "0",
                width: "100%",
                height: "calc(100% - 40px)",
                backgroundColor: "white",
                opacity: "0.5",
              }}
            ></div>
          )}
          {isLoadingRoute && <Loading driver="true" />}
        </div>
      </div>
      {
        bookedDriver && (
          <DriverBooking
            bookedDriver={bookedDriver}
            setBookedDriver={setBookedDriver}
            riderData={props.riderData}
            tripRequestStatusFunc={(status) => {
              setTripRequestStatus(status);
              setBookedDriver(false);
            }}
          />
        )
      }
      {
        isTripEnded && (
          <Message
            type="success"
            message={onTripDriverName + "'s Trip has been ended"}
          />
        )
      }
    </React.Fragment >
  );
};

export default LiveTracking;
