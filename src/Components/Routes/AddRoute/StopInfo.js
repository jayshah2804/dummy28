import React, { useEffect, useState } from "react";
import "./StopInfo.css";

import startPoint from "../../../Assets/Pin_icon_green50.png";
import studentDummyImage from "../../../Assets/new_student_marker.png";
import connectionPoint from "../../../Assets/start_location.png";
import threedots from "../../../Assets/route_3dots.png";
import endPoint from "../../../Assets/place_outline.png";
import useHttp from "../../../Hooks/use-http";
import loadingGif from "../../../Assets/loading-gif.gif";
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
  }

  sessionStorage.setItem(
    "routeValue",
    +sessionStorage.getItem("routeValue") + 1
  );

  // useEffect(() => {
  const script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyAq88vEj-mQ9idalgeP1IuvulowkkFA-Nk&callback=myInitMap&libraries=places&v=weekly";
  script.async = true;
  document.body.appendChild(script);
  // }, []);

  useEffect(() => {
    if (flag && props.routeId) {
      // flightPlanCoordinates = [];
      // STOP_DETAILS = [];
      let details = JSON.parse(sessionStorage.getItem("routeDetails"));
      editedStopDetails = [];
      editaedFlightPanCoordinates = [];
      editedFilteredData = [];
      editedwayPoints = [];
      myStopNumberInfo = {};
      stop_number = 0;

      for (let i = 1; i < details?.length; i++) {
        editedStopDetails.push({
          stop: details[i].StopName,
          lat: details[i].StopLatitude,
          lng: details[i].StopLongitude,
          mNumber: [details[i].MobileNumber],
          riders: [details[i].OfficialName],
        });
        // editaedFlightPanCoordinates.push({
        //   lat: details[i].StopLatitude,
        //   lng: details[i].StopLongitude
        // })
        editedwayPoints.push({
          location: {
            lat: details[i].StopLatitude,
            lng: details[i].StopLongitude,
          },
          stopover: true,
        });

        editedFilteredData.push({
          stop: details[i].StopName,
          name: [details[i].OfficialName],
          location: {
            lat: details[i].StopLatitude,
            lng: details[i].StopLongitude,
          },
          mNumber: [details[i].MobileNumber],
          status: true,
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
    debugger;
    if (type === "submit") {
      console.log(data);
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
              sessionStorage.getItem("routeType").toLowerCase() === "picking"
                ? data.StaffList[i].PickupPoint
                : data.StaffList[i].DropPoint,
            name: [data.StaffList[i].StaffName],
            mNumber: [data.StaffList[i].MobileNumber],
            location: {
              lat:
                sessionStorage.getItem("routeType").toLowerCase() === "picking"
                  ? +data.StaffList[i].PickupLL.split(",")[0]
                  : +data.StaffList[i].DropLL.split(",")[0],
              lng:
                sessionStorage.getItem("routeType").toLowerCase() === "picking"
                  ? +data.StaffList[i].PickupLL.split(",")[1]
                  : +data.StaffList[i].DropLL.split(",")[1],
            },
            status: false,
          });
        }
      }
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
      console.log(STOP_DETAILS, waypts);
      // }
      // console.log(studentData, "studentData");
      setFilteredData(studentData);
      console.log(studentData, "data");
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
      console.log({
        emailID: sessionStorage.getItem("user"),
        corporateID: sessionStorage.getItem("corpId"),
        routeType: sessionStorage.getItem("routeType"),
      });
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
            routeType: sessionStorage.getItem("routeType"),
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
      let staffList = [];
      for (let i = 0; i < STOP_DETAILS.length; i++) {
        shuttleRoute.push({
          StopName: STOP_DETAILS[i].stop,
          StopNumber: i + 1,
          StopLatitude: STOP_DETAILS[i].lat,
          StopLongitude: STOP_DETAILS[i].lng,
        });
        for (let j = 0; j < STOP_DETAILS[i].mNumber?.length; j++) {
          staffList.push({
            MobileNumber: STOP_DETAILS[i].mNumber[j],
          });
        }
      }
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
      obj.RouteType = sessionStorage.getItem("routeType");
      obj.ShuttleTypeID = sessionStorage.getItem("shuttleType");
      obj.ShuttleTiming = JSON.stringify(shuttleTiming);
      obj.ShuttleRoute = JSON.stringify(shuttleRoute);
      obj.StaffList = JSON.stringify(staffList);
      var dataInfo = obj;
      console.log(dataInfo);

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

  const undoRouteClickHandler = () => {
    // if (previewRouteFlag) previewRouteFlag = !previewRouteFlag;
    console.log(waypts, dst);
    if (dst.length > 0) {
      stop_number--;
      dst.pop();
      waypts.pop();
      if (!previewRouteFlag) {
        STOP_DETAILS.pop();
        filteredData[myRecord[myRecord.length - 1]].status = false;
        myRecord.pop();
        previewRouteFlag = false;
      } else {
        previewRouteFlag = !previewRouteFlag;
      }
      // filteredData[myRecord].status = false;
      setIsRender((prev) => !prev);
    }
    console.log(waypts, dst);
    // if (flightPlanCoordinates.length > 1) {
    //   // studentCount -= filteredData[prev_id].name.length;
    //   flightPlanCoordinates.pop();
    //   setIsRender(prev => !prev);
    // }
  };

  const resetRouteClickHandler = () => {
    let response = window.confirm(
      "It will reset all the routes created. Want to reset?"
    );
    if (response) {
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
      filteredData.map((data) => (data.status = false));
      myRecord = [];
      setIsRender((prev) => !prev);
    }
  };

  const previewClickHandler = () => {
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
    }
    // if (flightPlanCoordinates.length > 1) {
    //   previewRouteFlag = true;
    //   flightPlanCoordinates.push(flightPlanCoordinates[0]);
    // }
    setIsRender((prev) => !prev);
  };

  function myInitMap() {
    const map = new window.google.maps.Map(
      document.getElementById("stops-map"),
      {
        zoom: 11,
        center: {
          lat: filteredData[Math.round(filteredData.length / 2) - 1]?.location
            .lat,
          lng: filteredData[Math.round(filteredData.length / 2) - 1]?.location
            .lng,
        },
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
    directionsService.route(request, function (response, status) {
      console.log("after");
      if (status == window.google.maps.DirectionsStatus.OK) {
        directionsRenderer2.setDirections(response); // Add route to the map
        directionsRenderer1.setDirections(response); // Add route to the map
        // console.log(response.routes[0].start_location);

        // var leg = response.routes[0];

        //   let marker = new window.google.maps.Marker({
        //     position: { lat: waypts[0].location.lat(), lng: waypts[0].location.lng() },
        //     map: map,
        //     icon: studentDummyImage,
        //     myTitle: "Jay"
        //   })
        //   marker.addListener("mouseover", () => {
        //     console.log(marker);
        //     infoWindow.close();
        //     infoWindow.setContent(marker.myTitle);
        //     infoWindow.open(marker.getMap(), marker);
        //   });
      }
    });

    const infoWindow = new window.google.maps.InfoWindow();
    let icon;
    let myTitle;

    // const flightPath1 = new window.google.maps.Polyline({
    //   path: flightPlanCoordinates,
    //   geodesic: true,
    //   strokeColor: "black",
    //   strokeOpacity: 1.0,
    //   strokeWeight: 7,
    // });

    // const flightPath = new window.google.maps.Polyline({
    //   path: flightPlanCoordinates,
    //   geodesic: true,
    //   strokeColor: "rgba(34, 137, 203, 255)",
    //   strokeOpacity: 1.0,
    //   strokeWeight: 5,
    // });

    // flightPath1.setMap(map);
    // flightPath.setMap(map);
    // console.log(flightPlanCoordinates);

    const assignButtonClickHandler = (e) => {
      if (previewRouteFlag) {
        dst.pop();
        // dst.push(waypts.pop().location);
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
      console.log(dst);
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

    // console.log(filteredData);
    filteredData.forEach((position, i) => {
      // console.log(filteredData[i]);
      if (i === 0) {
        icon = startPoint;
        myTitle = `<div><h3>${position.name.toString()}</h3></div>`;
      } else {
        // console.log(position.stop.split(",")[0], position.status);
        icon = studentDummyImage;
        if (position.status)
          // myTitle = `<div id="infowindow-container" ><h3>${position.name.toString()}</h3><p id="infowindow-success">Assigned</div>`;
          myTitle = `<div id="infowindow-container" ><h3>${myStopNumberInfo[position.mNumber[0]]
              ? myStopNumberInfo[position.mNumber[0]] + ". "
              : ""
            }${position.stop.split(",")[0]
            }</h3><p id="infowindow-success">Assigned</div>`;
        // myTitle = `<div id="infowindow-container" ><h3>${position.name.toString()}</h3><div id=${i}><span id='infowindow-assign'>Assign rider</span></div></div>`;
        else
          myTitle = `<div><div id="infowindow-container" ><h3>${position.stop.split(",")[0]
            }</h3><div id=${i}><span id='infowindow-assign'>Assign riders</span></div></div><div>${position.name.toString()}</div></div>`;
      }

      const marker = new window.google.maps.Marker({
        position: position.location,
        map,
        myTitle,
        icon,
        optimized: false,
      });

      marker.addListener("mouseover", () => {
        // infoWindow.close();
        infoWindow.setContent(marker.myTitle);
        infoWindow.open(marker.getMap(), marker);
        infoWindow.open(
          setTimeout(() => {
            document
              .getElementById("infowindow-assign")
              .addEventListener("click", assignButtonClickHandler);
          })
        );
      });
    });
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
    props.nextWizard("Submit");
    type = "submit";
    setIsSubmitClicked(true);
  };

  if (myFlag && filteredData.length > 0) {
    let arr = [];
    // debugger;
    for (let i = 0; i < filteredData.length; i++) {
      if (arr.includes(filteredData[i].stop)) {
        let index = arr.indexOf(filteredData[i].stop);
        filteredData[index].name.push(filteredData[i].name.toString());
        filteredData[index].mNumber.push(filteredData[i].mNumber.toString());
        filteredData.splice(i, 1);
      }
      // console.log(filteredData);
      // console.log(filteredData[i],i);
      arr.push(filteredData[i].stop);
    }
    // STOP_DETAILS = [];
    arr = [];
    for (let i = 0; i < STOP_DETAILS.length; i++) {
      if (arr.includes(STOP_DETAILS[i].stop)) {
        let index = arr.indexOf(STOP_DETAILS[i].stop);
        STOP_DETAILS[index].riders.push(STOP_DETAILS[i].riders.toString());
        STOP_DETAILS[index].mNumber.push(STOP_DETAILS[i].mNumber.toString());
        STOP_DETAILS.splice(i, 1);
        flightPlanCoordinates.splice(i, 1);
      }
      arr.push(STOP_DETAILS[i].stop);
    }

    setFilteredData(filteredData);
    myFlag = false;
  }

  const crossClickHandler = (e, targetIndex) => {
    if (targetIndex) {
      for (let i = 0; i < filteredData.length; i++) {
        if (filteredData[i].stop === STOP_DETAILS[targetIndex].stop)
          filteredData[i].status = false;
      }
      STOP_DETAILS.splice(targetIndex, 1);
      // flightPlanCoordinates.splice(targetIndex, 1);
    } else {
      let holdingIndex = 0;
      let presentIndex = 0;
      // console.log(STOP_DETAILS, waypts);
      for (let i = 0; i < STOP_DETAILS.length; i++) {
        if (
          STOP_DETAILS[i].stop !== e.target.parentNode.children[0].innerText
        ) {
          STOP_DETAILS[holdingIndex] = STOP_DETAILS[i];
          holdingIndex++;
        } else presentIndex = i;
      }

      for (let i = 0; i < filteredData.length; i++) {
        if (filteredData[i].stop === e.target.parentNode.children[0].innerText)
          filteredData[i].status = false;
      }
      STOP_DETAILS.length = holdingIndex;
      debugger;
      console.log(presentIndex, waypts, dst);
      if (presentIndex > waypts.length) waypts.splice(presentIndex - 2, 1);
      else waypts.splice(presentIndex - 1, 1);
      dst.splice(presentIndex - 1, 1);
    }
    // console.log(filteredData);
    stop_number = 0;
    myStopNumberInfo = {};
    for (let i = 1; i < STOP_DETAILS.length; i++) {
      myStopNumberInfo[STOP_DETAILS[i].mNumber[0]] = stop_number + 1;
      stop_number++;
    }
    setIsRender((prev) => !prev);
  };
  const subCrossClickHandler = (e) => {
    let targetIndex = 0;
    for (let i = 0; i < STOP_DETAILS.length; i++) {
      // console.log(STOP_DETAILS[i].riders);
      // console.log(e.target.parentNode.children[0].innerText);
      if (
        STOP_DETAILS[i].riders?.includes(
          e.target.parentNode.children[0].innerText
        )
      ) {
        targetIndex = i;
      }
    }

    let holdingIndex = 0;
    if (STOP_DETAILS[targetIndex].riders.length > 1) {
      for (let i = 0; i < STOP_DETAILS[targetIndex].riders.length; i++) {
        if (
          STOP_DETAILS[targetIndex].riders[i] !==
          e.target.parentNode.children[0].innerText
        ) {
          STOP_DETAILS[targetIndex].riders[holdingIndex] =
            STOP_DETAILS[targetIndex].riders[i];
          STOP_DETAILS[targetIndex].mNumber[holdingIndex] =
            STOP_DETAILS[targetIndex].mNumber[i];
          holdingIndex++;
        }
      }
      STOP_DETAILS = structuredClone(STOP_DETAILS);
      STOP_DETAILS[targetIndex].riders.length = holdingIndex;
      STOP_DETAILS[targetIndex].mNumber.length = holdingIndex;

      for (let i = 0; i < filteredData.length; i++) {
        if (filteredData[i].stop === e.target.parentNode.children[0].innerText)
          filteredData[i].status = false;
      }
      // console.log(STOP_DETAILS);
      // console.log(RIDER_DATA);
      setIsRender((prev) => !prev);
    } else {
      crossClickHandler(null, targetIndex);
    }
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
              // dst.push(waypts.pop().location);
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
              // dst.push(waypts.pop().location);
              waypts.pop();
              previewRouteFlag = false;
            }
            let s = STOP_DETAILS.splice(+indexToBeMove, 1);
            // STOP_DETAILS.splice(+indexToBeShift, 0, STOP_DETAILS[+indexToBeMove]);
            STOP_DETAILS.splice(+indexToBeShift, 0, s[0]);
            let ss = STOP_DETAILS.splice(+indexToBeShift + 1, 1);
            STOP_DETAILS.splice(+indexToBeMove, 0, ss[0]);
            // STOP_DETAILS.splice(+indexToBeMove + 1, 1);
            console.log(indexToBeMove, indexToBeShift, STOP_DETAILS.length);
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
              console.log(indexToBeMove, indexToBeShift, dst, waypts);
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
                    {data?.riders?.map((name, index) => (
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
                          onClick={subCrossClickHandler}
                        >
                          X
                        </span>
                      </div>
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
          {/* <span>Shuttle capacity: {shuttleSeatingCapacity}</span> */}
        </div>
        <div className="route-operation">
          {/* <span onClick={undoRouteClickHandler}>Undo route operation</span> */}
          <span onClick={resetRouteClickHandler}>Reset route</span>
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
        <div className="footer" style={{ padding: 0 }}>
          <button className="preview" onClick={previewClickHandler}>
            Preview Route
          </button>
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
