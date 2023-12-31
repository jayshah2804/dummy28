import React, { useEffect, useState } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

import "./StopInfo.css";
import useHttp from "../../../Hooks/use-http";

import startPoint from "../../../Assets/Pin_icon_green50.png";
import studentDummyImage from "../../../Assets/new_student_marker.png";
import connectionPoint from "../../../Assets/start_location.png";
import threedots from "../../../Assets/route_3dots.png";
import endPoint from "../../../Assets/place_outline.png";
import loadingGif from "../../../Assets/loading-gif.gif";
import tickMark from "../../../Assets/Tickmark.png";
import Message from "../../../Modal/Message";

let stop_number = 0;
let myStopNumberInfo = {};
let studentCount = 0;
let shuttleSeatingCapacity = 4;
let myRecord = [];
let previewRouteFlag = false;
let prev_id;
let myFlag = true;
let indexToBeMove;
let indexToBeShift;
let ridersData = [];

let STOP_DETAILS = [];
let flightPlanCoordinates = [];

let flag = true;
let type = "";
let editedStopDetails = "";
let editaedFlightPanCoordinates = "";
let editedFilteredData = "";
let editedwayPoints = "";
let waypts = [];
let approximate_distance = "";
// let dst = [{ lat: 23.0338, lng: 72.546584 }];
let dst = [];
const polyline1 = {
  strokeColor: "#00b0ff",
  strokeOpacity: 10.0,
  strokeWeight: 4,
};
const polyline2 = {
  strokeColor: "black",
  strokeOpacity: 10.0,
  strokeWeight: 5,
};

let staffUIds = new Set();
let markers = [];

const StopInfo = (props) => {
  const [filteredData, setFilteredData] = useState([]);
  const [isRender, setIsRender] = useState();
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [isRouteCreated, setIsRouteCreated] = useState(false);

  if (+sessionStorage.getItem("routeValue") === 0) {
    waypts = [];
    dst = [];
    ridersData = [];
    STOP_DETAILS = [];
    flightPlanCoordinates = [];
    editedStopDetails = "";
    editaedFlightPanCoordinates = "";
    editedFilteredData = "";
    editedwayPoints = "";
    type = "";
    myFlag = true;
    flag = true;
    myRecord = [];
    stop_number = 0;
    myStopNumberInfo = {};
    staffUIds = new Set();
  }

  sessionStorage.setItem(
    "routeValue",
    +sessionStorage.getItem("routeValue") + 1
  );

  // useEffect(() => {
  const script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyDHdkmGjsfNqasFs6m9CooShFZsqWHcdUs&callback=myInitMap&libraries=places&v=weekly";
  script.async = true;
  document.body.appendChild(script);
  // }, []);

  useEffect(() => {
    if (flag && props.routeId) {
      // flightPlanCoordinates = [];
      // STOP_DETAILS = [];
      let details = JSON.parse(sessionStorage.getItem("routeDetails"));
      let i =
        sessionStorage.getItem("routeType").toLowerCase() === "pickup" ? 0 : 1;
      let detailsLength =
        sessionStorage.getItem("routeType").toLowerCase() === "pickup"
          ? details.length - 1
          : details.length;
      editedStopDetails = [];
      editaedFlightPanCoordinates = [];
      editedFilteredData = [];
      editedwayPoints = [];
      myStopNumberInfo = {};
      stop_number = 0;
      // debugger;
      let myArr = [];
      for (i; i < detailsLength; i++) {
        // for (let i = 0; i < details?.length - 1; i++) {
        editedStopDetails.push({
          stop: details[i].StopName,
          lat: details[i].StopLatitude,
          lng: details[i].StopLongitude,
          mNumber: [details[i].MobileNumber],
          riders: [details[i].OfficialName],
          uId: [details[i]?.OfficialId?.toString()],
          dptName: [details[i]?.dptName]
        });
        // debugger;
        staffUIds.add(details[i]?.OfficialId?.toString());
        // editaedFlightPanCoordinates.push({
        //   lat: details[i].StopLatitude,
        //   lng: details[i].StopLongitude
        // })
        if (!myArr.includes(details[i].StopLatitude + details[i].StopLongitude))
          editedwayPoints.push({
            location: {
              lat: details[i].StopLatitude,
              lng: details[i].StopLongitude,
            },
            stopover: true,
          });
        myArr.push(details[i].StopLatitude + details[i].StopLongitude);

        editedFilteredData.push({
          stop: details[i].StopName,
          name: [details[i].OfficialName],
          location: {
            lat: details[i].StopLatitude,
            lng: details[i].StopLongitude,
          },
          mNumber: [details[i].MobileNumber],
          status: true,
          uId: [details[i]?.OfficialId?.toString()],
          dptName: [details[i]?.dptName]
        });
        if (i !== 0) {
          myStopNumberInfo[details[i].MobileNumber] = stop_number + 1;
          stop_number++;
        }
      }
      // console.log(filteredData);
      // console.log(STOP_DETAILS);
      // console.log(flightPlanCoordinates);
      // setIsRender(prev => !prev);
    }
  }, []);

  const authenticateUser = (data) => {
    // debugger;
    if (type === "submit") {
      // console.log(data);
      if (data.Message && data.Message.toLowerCase() === "success")
        props.routeCreationStatus("Success");
      else {
        props.routeCreationStatus("Error");
      }
      props.setIsAddRouteClicked(false);
      setIsSubmitClicked(false);
    } else {
      // alert("here");
      // console.log(data.CorporateLatlong, "current co");
      let studentData = [];
      // debugger;
      //comment
      studentData.push({
        stop: data.CorporateLatlong[0].CorporateName,
        name: data.CorporateLatlong[0].CorporateName,
        location: {
          lat: +data.CorporateLatlong[0].Corporatelatlong.split(",")[0],
          lng: +data.CorporateLatlong[0].Corporatelatlong.split(",")[1],
        },
      });
      if (data.StaffList) {
        STOP_DETAILS = [];
        for (let i = 0; i < data.StaffList.length; i++) {
          studentData.push({
            stop:
              sessionStorage.getItem("routeType").toLowerCase() === "pickup"
                ? data.StaffList[i].PickupPoint
                : data.StaffList[i].DropPoint,
            name: [data.StaffList[i].StaffName],
            mNumber: [data.StaffList[i].MobileNumber],
            location: {
              lat:
                sessionStorage.getItem("routeType").toLowerCase() === "pickup"
                  ? +data.StaffList[i].PickupLL.split(",")[0]
                  : +data.StaffList[i].DropLL.split(",")[0],
              lng:
                sessionStorage.getItem("routeType").toLowerCase() === "pickup"
                  ? +data.StaffList[i].PickupLL.split(",")[1]
                  : +data.StaffList[i].DropLL.split(",")[1],
            },
            status: false,
            uId: [data.StaffList[i].StaffId.toString()],
            dptName: [data.StaffList[i].dptName]
          });
        }
      }
      debugger;
      STOP_DETAILS.push({
        stop: studentData[0].stop,
        lat: studentData[0].location.lat,
        lng: studentData[0].location.lng,
        mNumber: studentData[0].mNumber,
      });
      // flightPlanCoordinates.push(studentData[0].location);
      // console.log(STOP_DETAILS, "stop");
      if (props.routeId) {
        // waypts.push({ location: studentData[0].location, stopover: true });
        // debugger;
        STOP_DETAILS.push(editedStopDetails);
        STOP_DETAILS = STOP_DETAILS.flat();
        // flightPlanCoordinates.push(editaedFlightPanCoordinates);
        // flightPlanCoordinates = flightPlanCoordinates.flat();
        waypts.push(editedwayPoints);
        waypts = waypts.flat();
        studentData.splice(1, 0, editedFilteredData);
        studentData = studentData.flat();
        // **
        for (let i = 0; i < waypts.length; i++) {
          dst.push(structuredClone(waypts[i].location));
        }
        waypts.pop();
        // dst = [waypts.pop().location];
      }
      console.log("studentData", studentData);
      // console.log(STOP_DETAILS, waypts);
      // }
      // console.log(studentData, "studentData");
      // debugger;
      setFilteredData(studentData);
      // console.log(studentData, "data");
      ridersData = structuredClone(studentData);
    }
  };

  const { isLoading, sendRequest } = useHttp();
  if (isLoading && type.toLowerCase() === "submit") {
    document.getElementById("submit").innerText = "Creating...";
    document.getElementById("submit").style.cursor = "no-drop";
  }

  useEffect(() => {
    let time = JSON.parse(sessionStorage.timings);

    if (flag) {
      // console.log({
      //   emailID: sessionStorage.getItem("user"),
      //   corporateID: sessionStorage.getItem("corpId"),
      //   routeType: sessionStorage.getItem("routeType"),
      // });
      sendRequest(
        {
          url: "/api/v1/Corporate/StaffListByCorporate",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            emailID: sessionStorage.getItem("user"),
            corporateID: sessionStorage.getItem("corpId"),
            routeType:
              sessionStorage.getItem("routeType").toLowerCase() === "pickup"
                ? "Picking"
                : "dropping",
          },
        },
        authenticateUser
      );
      flag = false;
    }
    if (isSubmitClicked) {
      let shuttleTiming = [];
      let days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];
      for (let i = 0; i < 7; i++) {
        shuttleTiming.push({
          Weekday: i + 1,
          StartTime: `${new Date()
            .getFullYear()
            .toString()
            .concat(
              "-",
              new Date().getMonth() + 1,
              "-",
              new Date().getDate()
            )} ${time[days[i]]}`,
        });
      }
      let shuttleRoute = [];
      let staffList = Array.from(staffUIds).join(",");
      for (
        let i =
          sessionStorage.getItem("routeType").toLowerCase() === "pickup"
            ? 1
            : 0;
        i < STOP_DETAILS.length;
        i++
      ) {
        shuttleRoute.push({
          StopName: STOP_DETAILS[i].stop,
          StopNumber:
            sessionStorage.getItem("routeType").toLowerCase() === "pickup"
              ? i - 1
              : i,
          StopLatitude: STOP_DETAILS[i].lat,
          StopLongitude: STOP_DETAILS[i].lng,
        });
        // for (let j = 0; j < STOP_DETAILS[i].mNumber?.length; j++) {
        //   staffList.push({
        //     MobileNumber: STOP_DETAILS[i].mNumber[j],
        //   });
        // }
      }
      if (sessionStorage.getItem("routeType").toLowerCase() === "pickup")
        shuttleRoute.push({
          StopName: STOP_DETAILS[0].stop,
          StopNumber: shuttleRoute.length,
          StopLatitude: STOP_DETAILS[0].lat,
          StopLongitude: STOP_DETAILS[0].lng,
        });
      var obj = {};
      obj.ApiActionTypeID = 0;
      obj.ApiDynamicFields = "";
      obj.ApiOperatorID = "";
      obj.ApiRequestID = "";
      obj.ApiRoleID = "";
      obj.ApiUniqueID = "";
      obj.ApiOperatedOn = "";
      obj.EmailID = sessionStorage.getItem("user");
      obj.CorporateID = sessionStorage.getItem("corpId");
      obj.RouteID = props.routeId ? props.routeId : "";
      obj.RouteName = sessionStorage.getItem("routeName");
      obj.RouteType =
        sessionStorage.getItem("routeType").toLowerCase() === "pickup"
          ? "Picking"
          : "dropping";
      obj.ShuttleTypeID = sessionStorage.getItem("shuttleType");
      obj.ShuttleTiming = JSON.stringify(shuttleTiming);
      obj.ShuttleRoute = JSON.stringify(shuttleRoute);
      obj.StaffList = staffList;
      var dataInfo = obj;
      // console.log(dataInfo);

      sendRequest(
        {
          url: "/api/v1/Route/AddEditRoute",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: obj,
        },
        authenticateUser
      );
    }
  }, [sendRequest, isSubmitClicked]);

  const resetRouteClickHandler = () => {
    let response = window.confirm(
      "It will reset all the routes created. Want to reset?"
    );
    if (response) {
      previewRouteFlag = false;
      myStopNumberInfo = {};
      stop_number = 0;
      // studentCount = 0;
      dst = [];
      waypts = [];
      STOP_DETAILS = [
        {
          stop: structuredClone(ridersData)[0].stop,
          lat: structuredClone(ridersData)[0].location.lat,
          lng: structuredClone(ridersData)[0].location.lng,
          mNumber: structuredClone(ridersData)[0].mNumber,
        },
      ];
      // filteredData.map((data) => (data.status = false));
      myRecord = [];
      staffUIds = new Set();
      setIsRender((prev) => !prev);
    }
  };

  const previewClickHandler = () => {
    // debugger;
    if (waypts.length > 0) {
      previewRouteFlag = true;
      waypts.push({
        location: dst[dst.length - 1],
        stopover: true,
      });
      dst.push({
        lat: STOP_DETAILS[0].lat,
        lng: STOP_DETAILS[0].lng + 0.00001,
      });
      // flightPlanCoordinates.push(flightPlanCoordinates[0]);
    } else if (dst.length > 0) {
      previewRouteFlag = true;
      waypts.push({
        location: dst[dst.length - 1],
        stopover: true,
      });
      dst.push({
        lat: STOP_DETAILS[0].lat,
        lng: STOP_DETAILS[0].lng + 0.00001,
      });
    }
    // if (flightPlanCoordinates.length > 1) {
    //   previewRouteFlag = true;
    //   flightPlanCoordinates.push(flightPlanCoordinates[0]);
    // }
    setIsRender((prev) => !prev);
  };

  function myInitMap() {
    // console.log(filteredData);
    const map = new window.google.maps.Map(
      document.getElementById("stops-map"),
      {
        zoom: 11,
        center: {
          lat: filteredData[0]?.location.lat,
          lng: filteredData[0]?.location.lng,
        },
        // center: {
        //   lat: filteredData[Math.round(filteredData.length / 2) - 1]?.location
        //     .lat,
        //   lng: filteredData[Math.round(filteredData.length / 2) - 1]?.location
        //     .lng,
        // },
        disableDefaultUI: true,
        fullscreenControl: true,
        zoomControl: true,
      }
    );

    let directionsService = new window.google.maps.DirectionsService();
    // let directionsRenderer = new window.google.maps.DirectionsRenderer();
    let directionsRenderer1 = new window.google.maps.DirectionsRenderer({
      polylineOptions: polyline1,
      suppressMarkers: true,
    });

    directionsRenderer1.setMap(map);
    let directionsRenderer2 = new window.google.maps.DirectionsRenderer({
      polylineOptions: polyline2,
      suppressMarkers: true,
    });

    directionsRenderer2.setMap(map);

    const request = {
      origin: { lat: STOP_DETAILS[0].lat, lng: STOP_DETAILS[0].lng },
      destination: dst[dst.length - 1], //LD
      waypoints: waypts,
      travelMode: window.google.maps.TravelMode.DRIVING,
    };

    // const infoWindow = new window.google.maps.InfoWindow();
    // console.log(waypts);
    // debugger;
    let origins = [];
    for (let i = 0; i < STOP_DETAILS.length - 1; i++) {
      origins.push({
        lat: STOP_DETAILS[i].lat,
        lng: STOP_DETAILS[i].lng
      })
    }
    let destinations = [];
    for (let i = 1; i < STOP_DETAILS.length; i++) {
      destinations.push({
        lat: STOP_DETAILS[i].lat,
        lng: STOP_DETAILS[i].lng
      })
    }
    // debugger;
    let service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins,
      destinations,
      travelMode: window.google.maps.TravelMode.DRIVING,
      avoidHighways: false,
      avoidTolls: false,
      unitSystem: window.google.maps.UnitSystem.IMPERIAL
    },
      callback);

    function callback(response, status) {
      let totalDistance = 0;
      for (let i = 0; i < response?.rows?.length; i++) {
        if (response.rows[i].elements[0].distance.text.includes("mi"))
          totalDistance += +(response.rows[0].elements[i].distance.text.split(" ")[0]) * 1.60934;
        else totalDistance += +(response.rows[1].elements[i].distance.text.split(" ")[0]) * 1.60934;
      }
      approximate_distance = +totalDistance.toFixed(2);
      document.getElementById("approxKm").innerText = approximate_distance + " km";
      // console.log(approximate_distance);
    }
    // debugger;
    if (previewRouteFlag) {
      let service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix({
        origins: [{ lat: destinations[destinations.length - 1].lat, lng: destinations[destinations.length - 1].lng }],
        destinations: [{ lat: origins[0].lat, lng: origins[0].lng }],
        travelMode: window.google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false,
        unitSystem: window.google.maps.UnitSystem.IMPERIAL
      },
        previewCallback);
    }
    function previewCallback(response, status) {
      approximate_distance += +(+(response.rows[0].elements[0].distance.text.split(" ")[0]) * 1.60934).toFixed(2);
      document.getElementById("approxKm").innerText = approximate_distance.toFixed(2) + " km";
    }

    directionsService.route(request, function (response, status) {
      if (status == window.google.maps.DirectionsStatus.OK) {
        directionsRenderer2.setDirections(response); // Add route to the map
        directionsRenderer1.setDirections(response); // Add route to the map
        // console.log(response.routes[0].start_location);
      }
    });

    const infoWindow = new window.google.maps.InfoWindow();
    let icon;
    let myTitle;

    const selectAllRidersClickHandler = (e) => {
      for (let i = 0; i < filteredData[e.target.parentElement.id].uId.length; i++) {
        if (e.target.checked)
          document.getElementById(filteredData[e.target.parentElement.id].uId[i]).checked = true;
        else document.getElementById(filteredData[e.target.parentElement.id].uId[i]).checked = false;
      }
    }

    const saveAssignButtonClickHandler = (e, id) => {
      // debugger;
      let alreadyRouteCreateFlag = false;
      let isChecked = false;
      for (let i = 0; i < document.getElementById(id).children.length; i++) {
        if (staffUIds.has(document.getElementById(id).children[i].children[0].id)) alreadyRouteCreateFlag = true;
        if (document.getElementById(id).children[i].children[0].checked) {
          staffUIds.add(document.getElementById(id).children[i].children[0].id.toString());
          isChecked = true;
        }
        else {
          staffUIds.delete(document.getElementById(id).children[i].children[0].id.toString());
          if (!isChecked && i === document.getElementById(id).children.length - 1 && !alreadyRouteCreateFlag) {
            return;
          }
        };
      }

      if (staffUIds.size === 0) {
        let indexToBeSpliced = 0;
        for (let i = 0; i < STOP_DETAILS.length; i++) {
          if (STOP_DETAILS[i].stop.toLowerCase() === e.target.parentElement.children[0].innerText.toLowerCase()) {
            indexToBeSpliced = i;
            break;
          }
        }
        STOP_DETAILS.splice(indexToBeSpliced, 1);
        if (indexToBeSpliced > waypts.length) waypts.splice(indexToBeSpliced - 2, 1);
        else waypts.splice(indexToBeSpliced - 1, 1);
        dst.splice(indexToBeSpliced - 1, 1);
      }

      // console.log(e.target.parentElement.id);
      if (!alreadyRouteCreateFlag && isChecked) {
        if (previewRouteFlag) {
          dst.pop();
          waypts.pop();
          previewRouteFlag = false;
        }

        if (dst.length > 0)
          waypts.push({
            location: dst[dst.length - 1], //KP
            stopover: true,
          });

        dst.push({
          lat: filteredData[e.target.parentElement.id].location.lat,
          lng: filteredData[e.target.parentElement.id].location.lng,
        });
        filteredData[e.target.parentElement.id].status = true;

        prev_id = e.target.parentElement.id;

        myRecord.push(e.target.parentElement.id);
        STOP_DETAILS.push({
          stop: filteredData[e.target.parentElement.id].stop,
          riders: filteredData[e.target.parentElement.id].name,
          lat: filteredData[e.target.parentElement.id].location.lat,
          lng: filteredData[e.target.parentElement.id].location.lng,
          mNumber: filteredData[e.target.parentElement.id].mNumber,
          uId: filteredData[e.target.parentElement.id].uId
        });
        myStopNumberInfo[STOP_DETAILS[STOP_DETAILS.length - 1].mNumber[0]] =
          stop_number + 1;
        stop_number++;
        setTimeout(() => {
          document.getElementById("asdf").click();
        });
      } else if (!isChecked && alreadyRouteCreateFlag == true && staffUIds.size !== 0) {
        let targetIndex = 0;
        for (let i = 0; i < STOP_DETAILS.length; i++) {
          if (STOP_DETAILS[i].uId?.includes(document.getElementById(id).children[0].children[0].id)) {
            targetIndex = i;
            break;
          }
        }
        STOP_DETAILS.splice(targetIndex, 1);
        if (targetIndex > waypts.length) waypts.splice(targetIndex - 2, 1);
        else waypts.splice(targetIndex - 1, 1);
        dst.splice(targetIndex - 1, 1);
        // STOP_DETAILS = STOP_DETAILS.filter(data => !(data?.uId?.includes(document.getElementById(id).children[0].children[0].id)));
      }
      setIsRender((prev) => !prev);
    }

    const assignButtonClickHandler = (e) => {
      if (previewRouteFlag) {
        dst.pop();
        waypts.pop();
        previewRouteFlag = false;
      }
      // else {
      // previewRouteFlag = false;
      if (dst.length > 0)
        waypts.push({
          location: dst[dst.length - 1], //KP
          stopover: true,
        });
      // console.log(dst);
      dst.push({
        lat: filteredData[e.target.parentElement.id].location.lat,
        lng: filteredData[e.target.parentElement.id].location.lng,
      });
      filteredData[e.target.parentElement.id].status = true;
      // studentCount += filteredData[e.target.parentElement.id].name.length;
      // if (studentCount > shuttleSeatingCapacity) {
      //   studentCount -= filteredData[e.target.parentElement.id].name.length;
      //   alert("Shuttle seating capacity exceeded");
      // }
      // else {
      prev_id = e.target.parentElement.id;
      // filteredData[e.target.parentElement.id].status = true;

      myRecord.push(e.target.parentElement.id);
      // flightPlanCoordinates.push(
      //   {
      //     lat: filteredData[e.target.parentElement.id].location.lat,
      //     lng: filteredData[e.target.parentElement.id].location.lng
      //   });
      STOP_DETAILS.push({
        stop: filteredData[e.target.parentElement.id].stop,
        riders: filteredData[e.target.parentElement.id].name,
        lat: filteredData[e.target.parentElement.id].location.lat,
        lng: filteredData[e.target.parentElement.id].location.lng,
        mNumber: filteredData[e.target.parentElement.id].mNumber,
      });
      myStopNumberInfo[STOP_DETAILS[STOP_DETAILS.length - 1].mNumber[0]] =
        stop_number + 1;
      stop_number++;
      // for (let i = 1; i < filteredData.length; i++) {
      //   if (filteredData[i].mNumber[0] === STOP_DETAILS[STOP_DETAILS.length - 1].mNumber[0]) {
      //     filteredData[i].stopNumber = stop_number + 1;
      //     stop_number++;
      //     break;
      //   }
      // }
      // if(+e.target.parentElement.id === (RIDER_DATA.length - 1)){
      //   flightPlanCoordinates.push(RIDER_DATA[0].location);
      // }
      // console.log(STOP_DETAILS);
      // }
      setTimeout(() => {
        document.getElementById("asdf").click();
      });
      setIsRender((prev) => !prev);
      // }
    };
    debugger;
    filteredData.forEach((position, i) => {
      // console.log(filteredData[i]);
      if (i === 0) {
        icon = startPoint;
        myTitle = `<div><h3>${position.name.toString()}</h3></div>`;
        markers = [];
      } else {
        // console.log(position.stop.split(",")[0], position.status);
        icon = studentDummyImage;
        // if (position.status) {
        // myTitle = `<div id="infowindow-container" ><h3>${myStopNumberInfo[position.mNumber[0]]
        //   ? myStopNumberInfo[position.mNumber[0]] + ". "
        //   : ""
        //   }${position.stop.split(",")[0]
        //   }</h3></div>`;
        // }
        // else {
        // myTitle = `<div id=${i}>` + `<div id="infowindow-container" ><h3>${myStopNumberInfo[position?.mNumber[0]]
        //   ? myStopNumberInfo[position?.mNumber[0]] + ". "
        //   : ""
        // }${position.stop.split(",")[0]
        myTitle = `<div id=${i}>` + `<div id="infowindow-container" ><h4 id="infowindow-stopName">${position.stop
          // }</h3></h3></div><input type="checkbox" id="select-all-riders" />Select All<div id="riderCheckBoxList">`
          }</h4></div><hr /><div id="riderCheckBoxList">`
        for (let j = 0; j < position.name.length; j++) {
          myTitle += `<div id="riderCheckboxSubContainer" ><input id=${position.uId[j]} type="checkbox" /><label for=${position.uId[j]}>${position.name[j] + " (" + position.dptName[j] + ")"}</label></div>`
        }
        myTitle += `</div><button id="infoWindowAssignButton">Save</button></div >`;
        // }
      }

      const marker = new window.google.maps.Marker({
        position: position.location,
        map,
        myTitle,
        icon,
        optimized: false,
      });
      if (i !== 0) {
        for (let k = 0; k < position.name.length; k++) {
          markers.push(marker);
        }
      }

      marker.addListener("click", () => {
        infoWindow.setContent(marker.myTitle);
        infoWindow.open(marker.getMap(), marker);
        setTimeout(() => {
          for (let key of staffUIds) {
            if (document.getElementById(key))
              document.getElementById(key).checked = true;
          }
        })
        infoWindow.open(
          setTimeout(() => {
            // document.getElementById("infowindow-assign").addEventListener("click", assignButtonClickHandler);
            document.getElementById("infoWindowAssignButton").addEventListener("click", (e) => saveAssignButtonClickHandler(e, "riderCheckBoxList"));
            // document.getElementById("select-all-riders").addEventListener("click", (e) => selectAllRidersClickHandler(e))
          })
        );
      });
    });

    // var options = {
    //   maxZoom: 4,
    //   styles: [{
    //     url: 'https://littleimages.blob.core.windows.net/corporate/INDIA/8DB35DE7-8572-4BB8-BF7C-7D06603A92C9',
    //     width: 53,
    //     height: 53,
    //     textColor: '#fff',
    //   }]
    // };

    new MarkerClusterer({ markers, map });
  }

  window.myInitMap = myInitMap;

  const backClickHandler = () => {
    // flag = true;
    // myFlag = true;
    // type = "";
    // dst = [];
    // stop_number = 0;
    // myStopNumberInfo = {};
    // waypts = [];
    props.backWizard("StopInfo");
    props.setIsNextClicked(false);
  };

  const submitClickHandler = () => {
    if (staffUIds.size > 0) {
      props.nextWizard("Submit");
      type = "submit";
      setIsSubmitClicked(true);
    } else alert("Please add atleast one stop");
  };

  if (myFlag && filteredData.length > 0) {
    let arr = [];
    let latLngArr = [];
    for (let i = 0; i < filteredData.length; i++) {
      if (arr.includes(filteredData[i].stop) || latLngArr.includes(filteredData[i].location.lat.toFixed(5) + "" + filteredData[i].location.lng.toFixed(5))) {
        let index = arr.indexOf(filteredData[i].stop) === -1 ? latLngArr.indexOf(filteredData[i].location.lat.toFixed(5) + "" + filteredData[i].location.lng.toFixed(5)) : arr.indexOf(filteredData[i].stop);
        filteredData[index].name.push(filteredData[i].name.toString());
        filteredData[index].mNumber.push(filteredData[i].mNumber.toString());
        filteredData[index].uId.push(filteredData[i]?.uId?.toString());
        filteredData[index].dptName.push(filteredData[i]?.dptName?.toString());
        filteredData.splice(i, 1);
        i--;
      }
      // console.log(filteredData);
      // console.log(filteredData[i],i);
      else {
        arr.push(filteredData[i].stop);
        latLngArr.push(filteredData[i].location.lat.toFixed(5) + "" + filteredData[i].location.lng.toFixed(5));
      }
    }
    // STOP_DETAILS = [];
    arr = [];
    let editFLag = false;
    if (props.routeId) editFLag = true;
    for (let i = 0; i < STOP_DETAILS.length; i++) {
      if (arr.includes(STOP_DETAILS[i].stop)) {
        let index = arr.indexOf(STOP_DETAILS[i].stop);
        STOP_DETAILS[index].riders.push(STOP_DETAILS[i].riders.toString());
        STOP_DETAILS[index].mNumber.push(STOP_DETAILS[i].mNumber.toString());
        STOP_DETAILS[index].uId.push(STOP_DETAILS[i]?.uId?.toString());
        STOP_DETAILS[index].dptName.push(STOP_DETAILS[i]?.dptName.toString());
        STOP_DETAILS.splice(i, 1);
        flightPlanCoordinates.splice(i, 1);
        i--;
      }
      else
        arr.push(STOP_DETAILS[i].stop);
    }

    if (editFLag) {
      for (let i = 0; i < filteredData.length; i++) {
        for (let j = (sessionStorage.getItem("routeType").toLowerCase() === "pickup" ? 1 : 0); j < (sessionStorage.getItem("routeType").toLowerCase() === "pickup" ? STOP_DETAILS.length : STOP_DETAILS.length - 1); j++) {
          if (STOP_DETAILS[j].stop.includes(filteredData[i].stop)) {
            if (filteredData[i]?.name) STOP_DETAILS[j].riders = structuredClone(filteredData[i]?.name);
            if (filteredData[i]?.mNumber) STOP_DETAILS[j].mNumber = structuredClone(filteredData[i]?.mNumber);
            if (filteredData[i]?.uId) STOP_DETAILS[j].uId = structuredClone(filteredData[i]?.uId);
          }
        }
      }
    }

    setFilteredData(filteredData);
    myFlag = false;
  }

  const crossClickHandler = (e) => {
    let holdingIndex = 0;
    let presentIndex = 0;

    for (let i = 0; i < STOP_DETAILS.length; i++) {
      if (
        STOP_DETAILS[i].stop !== e.target.parentNode.children[0].innerText
      ) {
        STOP_DETAILS[holdingIndex] = STOP_DETAILS[i];
        holdingIndex++;
      } else {
        presentIndex = i;
        for (let j = 0; j < STOP_DETAILS[i]?.uId?.length; j++) {
          staffUIds.delete(STOP_DETAILS[i].uId[j].toString());
        }
      }
    }

    STOP_DETAILS.length = holdingIndex;
    if (presentIndex > waypts.length) waypts.splice(presentIndex - 2, 1);
    else waypts.splice(presentIndex - 1, 1);
    dst.splice(presentIndex - 1, 1);
    setIsRender((prev) => !prev);
  };

  const subCrossClickHandler = (e, uId) => {
    let targetIndex = 0;
    for (let i = 0; i < STOP_DETAILS.length; i++) {
      if (STOP_DETAILS[i]?.uId?.includes(uId)) {
        targetIndex = i;
        break;
      }
    }
    // debugger;
    if (e.target.parentElement.parentElement.children.length <= 1) {
      STOP_DETAILS.splice(targetIndex, 1);
      if (targetIndex > waypts.length) waypts.splice(targetIndex - 2, 1);
      else waypts.splice(targetIndex - 1, 1);
      dst.splice(targetIndex - 1, 1);
    }
    staffUIds.delete(uId);
    setIsRender((prev) => !prev);
  };

  function slist(target) {
    let items = target.getElementsByTagName("li");
    let current = null;

    for (let i = 1; i < items.length; i++) {
      items[i].ondragstart = (ev) => {
        current = items[i];
        items[i].classList.add("my");
      };
      items[i].ondragover = (evt) => {
        evt.preventDefault();
      };

      items[i].ondragend = () => {
        for (let it of items) {
          it.classList.remove("my");
        }
      };

      items[i].ondrop = (evt) => {
        evt.preventDefault();
        items[i].classList.remove("my");

        if (items[i] != current) {
          let currentpos = 0,
            droppedpos = 0;
          for (let it = 0; it < items.length; it++) {
            if (current == items[it]) {
              currentpos = it;
            }
            if (items[i] == items[it]) {
              droppedpos = it;
            }
          }
          // console.log(current, items[i]);
          STOP_DETAILS.map((data, index) => {
            if (data.stop === document.getElementById(current.id).innerText)
              indexToBeMove = index;
            if (data.stop === document.getElementById(items[i].id).innerText)
              indexToBeShift = index;
          });
          // console.log(STOP_DETAILS, flightPlanCoordinates);
          if (currentpos < droppedpos) {
            if (previewRouteFlag) {
              dst.pop();
              waypts.pop();
              previewRouteFlag = false;
            }
            let s = STOP_DETAILS.splice(+indexToBeShift, 1);
            // STOP_DETAILS.splice(+indexToBeShift, 0, STOP_DETAILS[+indexToBeMove]);
            STOP_DETAILS.splice(+indexToBeMove, 0, s[0]);
            let ss = STOP_DETAILS.splice(+indexToBeMove, 1);
            STOP_DETAILS.splice(+indexToBeShift, 0, ss[0]);
            // items[i].parentNode.insertBefore(current, items[i].nextSibling);
            STOP_DETAILS.splice(
              +indexToBeShift + 1,
              0,
              STOP_DETAILS[indexToBeMove]
            );
            STOP_DETAILS.splice(indexToBeMove, 1);
            if (
              indexToBeMove !== STOP_DETAILS.length - 1 &&
              indexToBeShift !== STOP_DETAILS.length - 1
            ) {
              waypts.splice(+indexToBeShift, 0, waypts[indexToBeMove - 1]);
              waypts.splice(indexToBeMove - 1, 1);
            } else {
              let a = dst.pop();
              let b = waypts.splice(+indexToBeMove - 1, 1);
              // debugger;
              waypts.splice(+indexToBeMove, 0, { location: a, stopover: true });
              // waypts.push({ location: a, stopover: true });
              dst.push(b[0].location);
            }
            // flightPlanCoordinates.splice(+indexToBeShift + 1, 0, flightPlanCoordinates[indexToBeMove]);
            // flightPlanCoordinates.splice(indexToBeMove, 1);
          } else {
            if (previewRouteFlag) {
              dst.pop();
              waypts.pop();
              previewRouteFlag = false;
            }
            let s = STOP_DETAILS.splice(+indexToBeMove, 1);
            // STOP_DETAILS.splice(+indexToBeShift, 0, STOP_DETAILS[+indexToBeMove]);
            STOP_DETAILS.splice(+indexToBeShift, 0, s[0]);
            let ss = STOP_DETAILS.splice(+indexToBeShift + 1, 1);
            STOP_DETAILS.splice(+indexToBeMove, 0, ss[0]);
            // STOP_DETAILS.splice(+indexToBeMove + 1, 1);
            // console.log(indexToBeMove, indexToBeShift, STOP_DETAILS.length);
            if (
              indexToBeMove !== STOP_DETAILS.length - 1 &&
              indexToBeShift !== STOP_DETAILS.length - 1
            ) {
              waypts.splice(indexToBeShift - 1, 0, waypts[indexToBeMove - 1]);
              waypts.splice(+indexToBeMove, 1);
            } else {
              let a = dst.pop();
              let b = waypts.splice(+indexToBeShift - 1, 1);
              waypts.splice(+indexToBeShift - 1, 0, {
                location: a,
                stopover: true,
              });
              // waypts.push({ location: a, stopover: true });
              // dst.splice(+indexToBeShift - 1, 0,)
              dst.push(b[0].location);
              // console.log(indexToBeMove, indexToBeShift, dst, waypts);
            }
            // flightPlanCoordinates.splice(indexToBeShift, 0, flightPlanCoordinates[indexToBeMove]);
            // flightPlanCoordinates.splice(+indexToBeMove + 1, 1);
          }
          stop_number = 0;
          myStopNumberInfo = {};
          for (let i = 1; i < STOP_DETAILS.length; i++) {
            myStopNumberInfo[STOP_DETAILS[i].mNumber[0]] = stop_number + 1;
            stop_number++;
          }
          // debugger;
        }
        setIsRender((prev) => !prev);
        // let newList = structuredClone(filteredData);
        // console.log(new);
        // setFilteredData(newList);
      };
    }
  }

  setTimeout(() => {
    for (
      let i = 0;
      i < document.getElementsByClassName("stopNames-container").length;
      i++
    ) {
      if (i !== 0) {
        document
          .getElementsByClassName("stopNames-container")
        [i].addEventListener("mouseover", () => {
          document
            .getElementsByClassName("cross")
          [i].classList.add("myClassName");
        });
        document
          .getElementsByClassName("stopNames-container")
        [i].addEventListener("mouseleave", () => {
          document
            .getElementsByClassName("cross")
          [i].classList.remove("myClassName");
        });
      }
    }
    for (
      let i = 0;
      i < document.getElementsByClassName("tempMyStudents").length;
      i++
    ) {
      document
        .getElementsByClassName("tempMyStudents")
      [i].addEventListener("mouseover", () => {
        document
          .getElementsByClassName("studentCross")
        [i].classList.add("myStudentClass");
      });
      document
        .getElementsByClassName("tempMyStudents")
      [i].addEventListener("mouseleave", () => {
        document
          .getElementsByClassName("studentCross")
        [i].classList.remove("myStudentClass");
      });
    }
    setTimeout(() => {
      document.getElementById("asdf").click();
    });
  });

  return (
    <div className="stop-main-container">
      <div className="stop-container">
        {/* {approximate_distance && */}
        <span style={{ marginLeft: "40px", fontSize: "12px" }}>Approximate Distance: <span id="approxKm"></span> </span>
        {/* } */}
        <ul id="sortlist" className="stop-subcontainer">
          {STOP_DETAILS.map((data, index) => {
            return (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div className="stopNames-container">
                  <div style={{ display: "flex", gap: "10px" }}>
                    {index !== STOP_DETAILS.length - 1 && (
                      <img src={connectionPoint} className="connectedPoint" />
                    )}
                    {index === STOP_DETAILS.length - 1 && (
                      <img
                        src={endPoint}
                        className="connectedPoint"
                        style={{ width: "15px" }}
                      />
                    )}
                    <li id={index + 10} className="stopNames" draggable>
                      <p>{data.stop}</p>
                    </li>
                  </div>
                  <p className="cross" onClick={crossClickHandler}>
                    X
                  </p>
                </div>
                <div className="student-info">
                  {index !== STOP_DETAILS.length - 1 && (
                    <img src={threedots} className="threedots" />
                  )}
                  {index === STOP_DETAILS.length - 1 && (
                    <img
                      src=""
                      className="threedots"
                      style={{ visibility: "hidden" }}
                    />
                  )}
                  <div className="studenNames-contaner">
                    {index !== 0 && data?.riders?.map((name, index) => (
                      <React.Fragment>
                        {staffUIds.has(data?.uId[index]) &&
                          <div
                            className="tempMyStudents"
                            style={{
                              marginRight: "5px",
                              borderRadius: "0px",
                              marginTop: "5px",
                              display: "inline-block",
                            }}
                          >
                            <p>{name}</p>
                            <span
                              className="studentCross"
                              onClick={(e) => subCrossClickHandler(e, data.uId[index].toString())}
                            >
                              X
                            </span>
                          </div>
                        }
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </ul>
        <button
          id="asdf"
          style={{ visibility: "hidden" }}
          onClick={() => slist(document.getElementById("sortlist"))}
        >
          click
        </button>
      </div>
      <div className="stopInfo-container">
        <div className="sub-header">
          <p>Select stops for the route</p>
          <span onClick={resetRouteClickHandler}>Reset route</span>
          {/* <span>Shuttle capacity: {shuttleSeatingCapacity}</span> */}
        </div>
        <div className="route-operation">
          {/* <span onClick={undoRouteClickHandler}>Undo route operation</span> */}
        </div>
        {isLoading && type !== "submit" ? (
          <img
            src={loadingGif}
            style={{
              position: "absolute",
              top: "50%",
              left: "60%",
              zIndex: "100",
            }}
          />
        ) : (
          <div id="stops-map"></div>
        )}
        <div className="footer" style={{ padding: 0, justifyContent: "flex-end" }}>
          {/* <button className="preview" onClick={previewClickHandler}>
            Preview Route
          </button> */}
          <div style={{ display: "flex", gap: "15px" }}>
            <button className="back" onClick={backClickHandler}>
              Back
            </button>
            <button id="submit" className="next" onClick={submitClickHandler}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StopInfo;
