import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import useHttp from "../../../Hooks/use-http";
import "./ViewRoute.css";

import startPoint from "../../../Assets/Pin_icon_green50.png";
import studentDummyImage from "../../../Assets/new_student_marker.png";

let flag = 0;
let waypts = [];
let routeInfo = "";
const polyline1 = {
  strokeColor: "#00b0ff",
  strokeOpacity: 10.0,
  strokeWeight: 4,
};
const ViewRoute = (props) => {
  const [routeDetails, setRouteDetails] = useState(false);
  const authenticateUser = (data) => {
    routeInfo = data.Route[0];
    let routeDetails = data.RouteDetails;
    let arr = [];
    for (let i = 0; i < routeDetails.length; i++) {
      if (arr.includes(routeDetails[i].StopName)) {
        let index = arr.indexOf(routeDetails[i].StopName);
        // routeInfo[index].name.push(routeInfo[i].name.toString());
        // routeInfo[index].mNumber.push(routeInfo[i].mNumber.toString());
        routeDetails.splice(i, 1);
        i--;
      }
      // console.log(filteredData);
      // console.log(filteredData[i],i);
      else arr.push(routeDetails[i].StopName);
    }
    setRouteDetails(routeDetails);
  };

  const { isLoading, sendRequest } = useHttp();

    useEffect(() => {
        const script = document.createElement("script");
        script.src =
            "https://maps.googleapis.com/maps/api/js?key=AIzaSyDHdkmGjsfNqasFs6m9CooShFZsqWHcdUs&callback=myInitMap&libraries=places&v=weekly";
        script.async = true;
        document.body.appendChild(script);
    }, [routeDetails]);

  useEffect(() => {
    // if (flag > 0)
    sendRequest(
      {
        url: "/api/v1/Route/GetRouteDetails",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          emailID: sessionStorage.getItem("user"),
          routeID: props.routeId,
        },
      },
      authenticateUser
    );
    // flag++;
  }, [sendRequest]);

  function myInitMap() {
    let map = new window.google.maps.Map(
      document.getElementById("map-viewModal"),
      {
        zoom: 11,
        center: { lat: 23.0358311, lng: 72.5579656 },
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        fullscreenControl: true,
        zoomControl: true,
      }
    );
    let directionsService = new window.google.maps.DirectionsService();

    let directionsRenderer1 = new window.google.maps.DirectionsRenderer({
      polylineOptions: polyline1,
      suppressMarkers: true,
    });

    directionsRenderer1.setMap(map);
    // let directionsRenderer2 = new window.google.maps.DirectionsRenderer({
    //   polylineOptions: polyline2,
    //   suppressMarkers: true,
    // });

    // directionsRenderer2.setMap(map);
    waypts = [];
    for (
      let i = routeInfo.RouteType?.toLowerCase() === "dropping" ? 1 : 0;
      i <
      (routeInfo.RouteType?.toLowerCase() === "dropping"
        ? routeDetails?.length - 1
        : routeDetails?.length - 2);
      i++
    ) {
      // for (let i = 1; i < routeDetails?.length - 1; i++) { //  drop
      // for (let i = 0; i < routeDetails?.length - 2; i++) {   //pickup
      waypts.push({
        location: {
          lat: routeDetails[i].StopLatitude,
          lng: routeDetails[i].StopLongitude,
        },
        stopover: true,
      });
    }

    const request = {
      origin: {
        lat: routeDetails[
          routeInfo.RouteType.toLowerCase() === "dropping"
            ? 0
            : routeDetails.length - 1
        ].StopLatitude,
        lng: routeDetails[
          routeInfo.RouteType.toLowerCase() === "dropping"
            ? 0
            : routeDetails.length - 1
        ].StopLongitude,
      },
      destination: {
        lat: routeDetails[
          routeInfo.RouteType.toLowerCase() === "dropping"
            ? routeDetails.length - 1
            : routeDetails.length - 2
        ].StopLatitude,
        lng: routeDetails[
          routeInfo.RouteType.toLowerCase() === "dropping"
            ? routeDetails.length - 1
            : routeDetails.length - 2
        ].StopLongitude,
      }, //LD
      waypoints: waypts,
      travelMode: window.google.maps.TravelMode.DRIVING,
    };

    // const infoWindow = new window.google.maps.InfoWindow();
    // console.log(waypts);
    // debugger;
    directionsService.route(request, function (response, status) {
      console.log("after");
      if (status == window.google.maps.DirectionsStatus.OK) {
        // directionsRenderer2.setDirections(response); // Add route to the map
        directionsRenderer1.setDirections(response); // Add route to the map
        // console.log(response.routes[0].start_location);
      }
    });

    const infoWindow = new window.google.maps.InfoWindow();
    let icon;
    let myTitle;

    // console.log(filteredData);
    routeDetails.forEach((position, i) => {
      if (
        (routeInfo.RouteType.toLowerCase() === "dropping" &&
          position.StopNumber === 0) ||
        (routeInfo.RouteType.toLowerCase() === "picking" &&
          position.StopNumber === routeDetails.length - 1)
      ) {
        icon = startPoint;
        myTitle = `<div><h3>${position.StopName.split(",")[0]}</h3></div>`;
      } else {
        icon = studentDummyImage;
        myTitle = `<div id="infowindow-container" ><h3>${
          position.StopName.split(",")[0]
        }`;
      }

      let marker = new window.google.maps.Marker({
        position: { lat: position.StopLatitude, lng: position.StopLongitude },
        map,
        myTitle,
        icon,
        optimized: false,
      });

      marker.addListener("mouseover", () => {
        // infoWindow.close();
        infoWindow.setContent(marker.myTitle);
        infoWindow.open(marker.getMap(), marker);
      });
    });
  }
  window.myInitMap = myInitMap;

  return (
    <div className="viewRouteContainer">
      <header>
        <span>{props.routeName}</span>
        <span
          style={{ cursor: "pointer" }}
          onClick={() => props.setIsViewRouteClicked(false)}
        >
          X
        </span>
      </header>
      <div id="map-viewModal"></div>
    </div>
  );
};

export default ViewRoute;
