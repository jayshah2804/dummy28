import React, { useEffect, useState } from "react";
import classes from "./LiveTrip.module.css";
import icon from "../../Assets/live_car.png";
import studentDummyImage from "../../Assets/new_student_marker.png";
import useHttp from "../../Hooks/use-http";
import { useHistory } from "react-router-dom";
import Loading from "../../Loading/Loading";
// import startPoint from "../../Assets/Pin_icon_green50.png"
import Message from "../../Modal/Message";
import startPoint from "../../Assets/dropIcon.png";
import endPoint from "../../Assets/pickIcon.png";

let valLat = 23.0350155;
let valLng = 72.5672725;

let mySvg = {
  path: "M -53.582954,-415.35856 C -67.309015,-415.84417 -79.137232,-411.40275 -86.431515,-395.45159 L -112.76807,-329.50717 C -131.95714,-324.21675 -140.31066,-310.27864 -140.75323,-298.84302 L -140.75323,-212.49705 L -115.44706,-212.49705 L -115.44706,-183.44029 C -116.67339,-155.74786 -71.290042,-154.67757 -70.275134,-183.7288 L -69.739335,-212.24976 L 94.421043,-212.24976 L 94.956841,-183.7288 C 95.971739,-154.67759 141.39631,-155.74786 140.16998,-183.44029 L 140.16998,-212.49705 L 165.43493,-212.49705 L 165.43493,-298.84302 C 164.99236,-310.27864 156.63886,-324.21677 137.44977,-329.50717 L 111.11322,-395.45159 C 103.81894,-411.40272 91.990714,-415.84414 78.264661,-415.35856 L -53.582954,-415.35856 z M -50.57424,-392.48409 C -49.426163,-392.49037 -48.215854,-392.45144 -46.988512,-392.40166 L 72.082372,-392.03072 C 82.980293,-392.28497 87.602258,-392.03039 92.236634,-381.7269 L 111.19565,-330.61998 L -86.30787,-330.86727 L -67.554927,-380.61409 C -64.630656,-390.57231 -58.610776,-392.44013 -50.57424,-392.48409 z M -92.036791,-305.02531 C -80.233147,-305.02529 -70.646071,-295.47944 -70.646071,-283.6758 C -70.646071,-271.87217 -80.233147,-262.28508 -92.036791,-262.28508 C -103.84043,-262.28508 -113.42751,-271.87216 -113.42751,-283.6758 C -113.42751,-295.47946 -103.84043,-305.02531 -92.036791,-305.02531 z M 117.91374,-305.02531 C 129.71738,-305.02533 139.26324,-295.47944 139.26324,-283.6758 C 139.26324,-271.87216 129.71738,-262.28508 117.91374,-262.28508 C 106.1101,-262.28507 96.523021,-271.87216 96.523021,-283.6758 C 96.523021,-295.47944 106.1101,-305.02531 117.91374,-305.02531 z M 103.2216,-333.14394 L 103.2216,-333.14394 z M 103.2216,-333.14394 C 103.11577,-333.93673 102.96963,-334.55679 102.80176,-335.21316 C 101.69663,-339.53416 100.2179,-342.16153 97.043938,-345.3793 C 93.958208,-348.50762 90.488134,-350.42644 86.42796,-351.28706 C 82.4419,-352.13197 45.472822,-352.13422 41.474993,-351.28706 C 33.885682,-349.67886 27.380491,-343.34759 25.371094,-335.633 C 25.286417,-335.3079 25.200722,-334.40363 25.131185,-333.2339 L 103.2216,-333.14394 z M 64.176391,-389.01277 C 58.091423,-389.00227 52.013792,-385.83757 48.882186,-379.47638 C 47.628229,-376.92924 47.532697,-376.52293 47.532697,-372.24912 C 47.532697,-368.02543 47.619523,-367.53023 48.822209,-364.99187 C 50.995125,-360.40581 54.081354,-357.67937 59.048334,-355.90531 C 60.598733,-355.35157 62.040853,-355.17797 64.86613,-355.27555 C 68.233081,-355.39187 68.925861,-355.58211 71.703539,-356.95492 C 75.281118,-358.72306 77.90719,-361.35074 79.680517,-364.96188 C 80.736152,-367.11156 80.820083,-367.68829 80.820085,-372.0392 C 80.820081,-376.56329 80.765213,-376.87662 79.470596,-379.50637 C 76.3443,-385.85678 70.261355,-389.02327 64.176391,-389.01277 z",
  fillColor: "black",
  fillOpacity: 1,
  /* anchor: new google.maps.Point(-69,90), */
  strokeWeight: 0,
  scale: 0.1,
  rotation: 0,
};

let flightPlanCoordinates = [];
let markers = [];
let prev_driverEmail = "";
let emailFlag = true;
let driverFlag = true;
let trip_interval = "";
let pathInterval = "";
let myFlag = 1;
let prev_driverId = "";
let map;
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

let journeyStart = 0;
let onTripDriverName = "";

const LiveTrip = (props) => {
  const [isRender, setIsRender] = useState("first");
  const [isDriverEmail, setIsDriverEmail] = useState();
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [isTripEnded, setIsTripEnded] = useState(false);
  const history = useHistory();

  // if(props.isLoading){
  //     marker?.setMap(null);
  //     flightPath?.setMap(null);
  // }

  // console.log(isRender);

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

  if (prev_driverEmail && prev_driverEmail !== isDriverEmail && myFlag) {
    console.log("here", trip_interval);
    clearIntervalApiCall();
    clearIntervalFligthPath();
    // intervalApiCall();
    setTimeout(() => {
      flightPathInterval();
    });
    // setIsRender(prev => !prev);d
    myFlag = 0;
  } else myFlag = 1;

  useEffect(() => {
    prev_driverEmail = "";
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDHdkmGjsfNqasFs6m9CooShFZsqWHcdUs&callback=myInitMap&libraries=places&v=weekly";
    script.async = true;
    document.body.appendChild(script);
  }, [isDriverEmail]);

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
        driverFlag = false;
      }
      // marker.icon.rotation =
      //   data.Livetripdetails[data.Livetripdetails.length - 1].Bearing;
      // let icon = marker.getIcon();
      // // console.log(icon);
      // icon.rotation = data.Livetripdetails[data.Livetripdetails.length - 1].Bearing;
      // marker.setIcon(icon);
      const markerUrl =
        "https://littleimages.blob.core.windows.net/corporate/INDIA/8DB35DE7-8572-4BB8-BF7C-7D06603A92C9";
      // console.log(document.querySelector(`[src = "${markerUrl}"]`));
      let markerSrc = document.querySelector(`[src = "${markerUrl}"]`);
      if (marker && markerSrc)
        markerSrc.style.transform = `rotate(${data.Livetripdetails[data.Livetripdetails.length - 1].Bearing
          }deg)`;
      journeyStart = 1;
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
    if (!(data?.LivetripStatus?.toLowerCase() === "ended") && data?.Livetrip) {
      if (startPointMarker) startPointMarker.setMap(null);
      if (endPointMarker) endPointMarker.setMap(null);
      startPointMarker = new window.google.maps.Marker({
        position: { lat: data?.Livetrip[0]?.PickupLatitude, lng: data?.Livetrip[0]?.PickupLongitude },
        map,
        icon: startPoint,
        myTitle: `<h3>${data?.Livetrip[0]?.PickupAddress?.split(",")[0]}</h3>`
      });
      endPointMarker = new window.google.maps.Marker({
        position: { lat: data?.Livetrip[0]?.DropoffLatitude, lng: data?.Livetrip[0]?.DropoffLongitude },
        map,
        icon: endPoint,
        myTitle: `<h3>${data?.Livetrip[0]?.DropoffAddress?.split(",")[0]}</h3>`,
      });
      // endPointMarker.setAnimation(window.google.maps.Animation.BOUNCE)
      var bounds = new window.google.maps.LatLngBounds();
      bounds.extend(new window.google.maps.LatLng(data.Livetrip[0]?.PickupLatitude, data.Livetrip[0]?.PickupLongitude));
      bounds.extend(new window.google.maps.LatLng(data.Livetrip[0]?.DropoffLatitude, data.Livetrip[0]?.DropoffLongitude));
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
    }

    setIsLoadingRoute(false);
    // setIsRender((prev) => !prev);
  };

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    // if (isDriverEmail) {
    //     // debugger;
    //     prev_driverEmail === isDriverEmail ? driverFlag = false : driverFlag = true;
    //     prev_driverEmail = isDriverEmail;
    //     // clearInterval(trip_interval);
    //     // clearInterval(pathInterval);
    // }
    // if (props.driverEmail) {
    //     console.log("here");
    //     if (prev_driverEmail !== props.driverEmail) {
    //         driverFlag = false;
    //         prev_driverEmail = props.driverEmail;
    //     } else driverFlag = true;
    // }
    if (isDriverEmail) intervalApiCall();
  }, [isDriverEmail, sendRequest]);

  function intervalApiCall() {
    // debugger;
    // console.log("inertvalcall", isDriverEmail);
    flightPlanCoordinates = [];
    prev_driverEmail === isDriverEmail
      ? (driverFlag = false)
      : (driverFlag = true);
    prev_driverEmail = isDriverEmail;

    // if(!isDriverEmail) {
    //     driverFlag = true;
    // }

    sendRequest(
      {
        url: "/api/v1/LiveTrip/GetLiveTripDetails",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          emailID: sessionStorage.getItem("user"),
          driverEmailID: isDriverEmail,
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
            driverEmailID: isDriverEmail,
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
    // debugger;
    if (!isDriverEmail) {
      flightPlanCoordinates = [];
    }
    marker = new window.google.maps.Marker({
      position: flightPlanCoordinates[flightPlanCoordinates.length - 1],
      map,
      icon: {
        url: "https://littleimages.blob.core.windows.net/corporate/INDIA/8DB35DE7-8572-4BB8-BF7C-7D06603A92C9",
        // path: "M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805",
        // path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        // url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg),
        // url: "https://d1a3f4spazzrp4.cloudfront.net/car-types/map70px/map-uberx.png",
        // fillColor: "rgba(34, 137, 203, 255)", //rgba(245, 174, 48, 255)
        // fillColor: "rgba(245, 174, 48, 255)", //rgba(245, 174, 48, 255)
        // strokeColor: "black",
        scaledSize: new window.google.maps.Size(35, 35),
        anchor: new window.google.maps.Point(17, 17)
        // icon: {
        // path: "M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805",
        // // path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        // // url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg),
        // // url: "https://d1a3f4spazzrp4.cloudfront.net/car-types/map70px/map-uberx.png",
        // fillColor: "rgba(245, 174, 48, 255)",
        // strokeColor: "black",
        // fillOpacity: 1, //0.9
        // strokeWeight: 0.5, // 0.75
        // rotation: 0,
        // scale: 0.6, // 6
        // // fillOpacity: 0.9,
        // // strokeWeight: 0.75,
        // // rotation: 0,
        // // scale: 6,
        // anchor: new window.google.maps.Point(25, 0),
      },
      optimized: false
      // icon: {
      //   path: "M42.3 110.94c2.22 24.11 2.48 51.07 1.93 79.75-13.76.05-24.14 1.44-32.95 6.69-4.96 2.96-8.38 6.28-10.42 12.15-1.37 4.3-.36 7.41 2.31 8.48 4.52 1.83 22.63-.27 28.42-1.54 2.47-.54 4.53-1.28 5.44-2.33.55-.63 1-1.4 1.35-2.31 1.49-3.93.23-8.44 3.22-12.08.73-.88 1.55-1.37 2.47-1.61-1.46 62.21-6.21 131.9-2.88 197.88 0 43.41 1 71.27 43.48 97.95 41.46 26.04 117.93 25.22 155.25-8.41 32.44-29.23 30.38-50.72 30.38-89.54 5.44-70.36 1.21-134.54-.79-197.69.69.28 1.32.73 1.89 1.42 2.99 3.64 1.73 8.15 3.22 12.08.35.91.8 1.68 1.35 2.31.91 1.05 2.97 1.79 5.44 2.33 5.79 1.27 23.9 3.37 28.42 1.54 2.67-1.07 3.68-4.18 2.31-8.48-2.04-5.87-5.46-9.19-10.42-12.15-8.7-5.18-18.93-6.6-32.44-6.69-.75-25.99-1.02-51.83-.01-77.89C275.52-48.32 29.74-25.45 42.3 110.94zm69.63-90.88C83.52 30.68 62.75 48.67 54.36 77.59c21.05-15.81 47.13-39.73 57.57-57.53zm89.14-4.18c28.41 10.62 49.19 28.61 57.57 57.53-21.05-15.81-47.13-39.73-57.57-57.53zM71.29 388.22l8.44-24.14c53.79 8.36 109.74 7.72 154.36-.15l7.61 22.8c-60.18 28.95-107.37 32.1-170.41 1.49zm185.26-34.13c5.86-34.1 4.8-86.58-1.99-120.61-12.64 47.63-9.76 74.51 1.99 120.61zM70.18 238.83l-10.34-47.2c45.37-57.48 148.38-53.51 193.32 0l-12.93 47.2c-57.58-14.37-114.19-13.21-170.05 0zM56.45 354.09c-5.86-34.1-4.8-86.58 1.99-120.61 12.63 47.63 9.76 74.51-1.99 120.61z",
      //   scale: 0.07,
      //   strokeColor: "black",
      //   fillColor: "rgba(245, 174, 48, 255)",
      //   fillOpacity: 1,
      //   strokeWeight: 1,
      //   rotation: 0,
      // },
    });

    pathInterval = setInterval(() => {
      if (document.getElementsByClassName("gm-fullscreen-control")[0])
        document.getElementsByClassName(
          "gm-fullscreen-control"
        )[0].style.marginTop = "45px";

      // flightPath1 = new window.google.maps.Polyline({
      //   path: flightPlanCoordinates,
      //   geodesic: true,
      //   strokeColor: "black",
      //   strokeOpacity: 1.0,
      //   strokeWeight: 6,
      // });
      flightPath2 = new window.google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: "#00b0ff",
        strokeOpacity: 1.0,
        strokeWeight: 3,
      });
      // debugger;
      // if (prev_driverEmail && prev_driverEmail !== props.driverEmail)
      // console.log(flightPlanCoordinates, "flightPlanCoordinates");
      // if (flightPlanCoordinates.toString() === "")
      //     flightPath.setPath([]);
      // flightPath1.setMap(map);
      if (flightPlanCoordinates.length > 1) {
        // setTimeout(() => {
        // flightPath1.setMap(map);
        flightPath2.setMap(map);
        marker.setPosition(flightPlanCoordinates[flightPlanCoordinates.length - 1])
        // }, 3000);
        // transition();
      } else if (flightPlanCoordinates.length > 0) {
        // flightPath1.setMap(map);
        flightPath2.setMap(map);
        marker.setPosition(
          flightPlanCoordinates[flightPlanCoordinates.length - 1]
        );
      }
      // flightPath2.setMap(map);
      // marker.setPosition(
      //   flightPlanCoordinates[flightPlanCoordinates.length - 1]
      // );
      // if (flightPlanCoordinates[flightPlanCoordinates.length - 1]?.lat)
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
    }, 2000);
  }

  function myInitMap() {
    map = new window.google.maps.Map(document.getElementById("map-modal"), {
      zoom: 11,
      center: { lat: 23.0358311, lng: 72.5579656 },
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      fullscreenControl: true,
      zoomControl: true,
    });
    // console.log(flightPlanCoordinates);
    flightPathInterval();
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

  const activeDriverClickHandler = (driverId, live, driverName) => {
    console.log(driverId);
    if (live == "1") {
      document.getElementById(prev_driverId)?.classList.remove("currentDriver");
      document.getElementById(driverId).classList.add("currentDriver");
      prev_driverId = driverId;
      onTripDriverName = driverName;
      setIsDriverEmail(driverId);
      setIsLoadingRoute(true);
    }
  };

  return (
    <div className={classes.footer}>
      <div className={classes.driverList}>
        <div className={classes.driverListHeader}>
          <p>Driver List</p>
          <p
            className={classes.viewMoreDriverList}
            onClick={() => history.push("/drivers")}
          >
            View All
          </p>
        </div>
        {props.isLoading && <Loading driver="true" />}
        {window.screen.width >= 768 ? (
          <React.Fragment>
            {!props.driverList && !isLoading && (
              <div className={classes.driverError}>No drivers found</div>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {!props.driverList && !isLoading && (
              <div className={classes.driverErrorMobile}>No drivers found</div>
            )}
          </React.Fragment>
        )}
        {props.driverList?.map((ele, index) => {
          return (
            <div
              key={index}
              id={ele.DriverEmailID}
              onClick={() =>
                activeDriverClickHandler(ele.DriverEmailID, ele.LiveStatus, ele.DriverName)
              }
              className={ele.LiveStatus == "1" ? classes.driverContainer : ""}
            >
              <div className={classes.driverDetails}>
                <div className={classes.driverInfo}>
                  <img
                    src={ele.DriverImage}
                    alt=""
                    className={classes.driverPhoto}
                  />
                  <div>
                    <p className={classes.driverName}>{ele.DriverName}</p>
                    <p className={classes.carNumber}>{ele.CarNumber}</p>
                  </div>
                </div>
                <div>
                  {ele.LiveStatus == "1" ? (
                    <p className={classes.activeDriver}></p>
                  ) : (
                    <p className={classes.inActiveDriver}></p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* debugger; */}
      <div className={classes.mapContainer}>
        <div id="map-modal" className={classes.map}></div>
        <div className={classes.mapText}>Live Trip Tracker</div>
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
      {isTripEnded &&
        < Message type="success" message={onTripDriverName + "'s Trip has been ended"} />
      }
    </div>
  );
};

export default React.memo(LiveTrip);
