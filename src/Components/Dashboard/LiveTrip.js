import React, { useEffect, useState } from "react";
import classes from "./LiveTrip.module.css";
import icon from "../../Assets/live_car.png";
import studentDummyImage from "../../Assets/new_student_marker.png";
import useHttp from "../../Hooks/use-http";

let valLat = 23.0350155;
let valLng = 72.5672725;

let flightPlanCoordinates = [];
let markers = [];
let prev_driverEmail = "";
let driverFlag = true;

const LiveTrip = (props) => {
  const [isRender, setIsRender] = useState("first");

  if (prev_driverEmail !== props.driverEmail) {
    driverFlag = false;
    prev_driverEmail = props.driverEmail;
  } else driverFlag = true;

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyAq88vEj-mQ9idalgeP1IuvulowkkFA-Nk&callback=myInitMap&libraries=places&v=weekly";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const authenticateUser = (data) => {
    console.log(data);
    if (driverFlag) {
      flightPlanCoordinates.push({
        lat: data.lat,
        lng: data.lng,
      });
    } else {
      flightPlanCoordinates = data.coordinates;
    }
    setIsRender((prev) => !prev);
  };

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    if (props.driverEmail)
      setInterval(() => {
        sendRequest(
          {
            url: "/api/v1/LiveTrip/GetLiveTripDetails",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: {
              emailID: sessionStorage.getItem("user"),
              driverEmailID: props.driverEmail,
              corporateID: sessionStorage.getItem("corpId"),
              Isall: driverFlag == true ? 0 : 1,
            },
          },
          authenticateUser
        );
      }, 10000);
  }, [props.driverEmail, sendRequest]);

  function myInitMap() {
    const map = new window.google.maps.Map(
      document.getElementById("map-modal"),
      {
        zoom: 11,
        center: { lat: 23.0358311, lng: 72.5579656 },
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        fullscreenControl: true,
        zoomControl: true,
      }
    );
    const marker = new window.google.maps.Marker({
      position: flightPlanCoordinates[flightPlanCoordinates.length - 1],
      map,
      icon,
      optimized: false,
    });
    const flightPath = new window.google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: "#397273",
      strokeOpacity: 1.0,
      strokeWeight: 5,
    });
    flightPath.setMap(map);
    marker.setPosition(flightPlanCoordinates[flightPlanCoordinates.length - 1]);

    // setInterval(() => {
    //     // map.setCenter({ lat: flightPlanCoordinates[flightPlanCoordinates.length - 1].lat, lng: flightPlanCoordinates[flightPlanCoordinates.length - 1].lng }, 13);
    //     flightPlanCoordinates.push({
    //         lat: valLat,
    //         lng: valLng
    //     })
    //     valLat = valLat + 0.0001115;
    //     valLng = valLng + 0.0000115;
    //     setIsRender(prev => !prev);

    //     const flightPath = new window.google.maps.Polyline({
    //         path: flightPlanCoordinates,
    //         geodesic: true,
    //         strokeColor: "rgba(34, 137, 203, 255)",
    //         strokeOpacity: 1.0,
    //         strokeWeight: 5,
    //     });

    //     flightPath.setMap(map);
    //     marker.setPosition(flightPlanCoordinates[flightPlanCoordinates.length - 1]);
    // }, 4000);
  }

  window.myInitMap = myInitMap;

  return (
    <React.Fragment>
      <div id="map-modal" className={classes.map}></div>
      <div className={classes.mapText}>Live Trip Tracker</div>
    </React.Fragment>
  );
};

export default React.memo(LiveTrip);
