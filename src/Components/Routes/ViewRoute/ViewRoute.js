// import React from 'react'
// import { useState } from 'react';
// import { useEffect } from 'react';
// import useHttp from '../../../Hooks/use-http';
// import "./ViewRoute.css";

// let waypts = [];
// const ViewRoute = (props) => {
//     const [routeDetails, setRouteDetails] = useState(false);
//     const authenticateUser = (data) => {
//         console.log(data);
//         setRouteDetails(data.RouteDetails);
//     };

//     const { isLoading, sendRequest } = useHttp();

//     useEffect(() => {
//         const script = document.createElement("script");
//         script.src =
//             "https://maps.googleapis.com/maps/api/js?key=AIzaSyAq88vEj-mQ9idalgeP1IuvulowkkFA-Nk&callback=myInitMap&libraries=places&v=weekly";
//         script.async = true;
//         document.body.appendChild(script);
//     }, []);

//     useEffect(() => {
//         sendRequest({
//             url: "/api/v1/Route/GetRouteDetails",
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: {
//                 emailID: sessionStorage.getItem("user"),
//                 routeID: props.routeId,
//             }
//         }, authenticateUser);
//     }, [sendRequest]);

//     function myInitMap() {
//         let map = new window.google.maps.Map(document.getElementById("map-viewModal"), {
//             zoom: 11,
//             center: { lat: 23.0358311, lng: 72.5579656 },
//             mapTypeId: window.google.maps.MapTypeId.ROADMAP,
//             disableDefaultUI: true,
//             fullscreenControl: true,
//             zoomControl: true,
//         });
//         let directionsService = new window.google.maps.DirectionsService();

//         let directionsRenderer1 = new window.google.maps.DirectionsRenderer({
//             polylineOptions: polyline1,
//             suppressMarkers: true,
//         });

//         directionsRenderer1.setMap(map);
//         let directionsRenderer2 = new window.google.maps.DirectionsRenderer({
//             polylineOptions: polyline2,
//             suppressMarkers: true,
//         });

//         directionsRenderer2.setMap(map);

//         const request = {
//             origin: { lat: routeDetails[0].StopLatitude, lng: routeDetails[0].StopLongitude },
//             destination: { lat:routeDetails[routeDetails.length - 1].StopLatitude, lng: routeDetails[routeDetails.length - 1].StopLongitude }, //LD
//             waypoints: waypts,
//             travelMode: window.google.maps.TravelMode.DRIVING,
//         };

//         // const infoWindow = new window.google.maps.InfoWindow();
//         // console.log(waypts);
//         // debugger;
//         directionsService.route(request, function (response, status) {
//             console.log("after");
//             if (status == window.google.maps.DirectionsStatus.OK) {
//                 directionsRenderer2.setDirections(response); // Add route to the map
//                 directionsRenderer1.setDirections(response); // Add route to the map
//                 // console.log(response.routes[0].start_location);
//             }
//         });

//         const infoWindow = new window.google.maps.InfoWindow();
//         let icon;
//         let myTitle;

//         const assignButtonClickHandler = (e) => {
//             if (previewRouteFlag) {
//                 dst.pop();
//                 // dst.push(waypts.pop().location);
//                 waypts.pop();
//                 previewRouteFlag = false;
//             }
//             // else {
//             // previewRouteFlag = false;
//             if (dst.length > 0)
//                 waypts.push({
//                     location: dst[dst.length - 1], //KP
//                     stopover: true,
//                 });
//             console.log(dst);
//             dst.push({
//                 lat: filteredData[e.target.parentElement.id].location.lat,
//                 lng: filteredData[e.target.parentElement.id].location.lng,
//             });
//             filteredData[e.target.parentElement.id].status = true;
//             // studentCount += filteredData[e.target.parentElement.id].name.length;
//             // if (studentCount > shuttleSeatingCapacity) {
//             //   studentCount -= filteredData[e.target.parentElement.id].name.length;
//             //   alert("Shuttle seating capacity exceeded");
//             // }
//             // else {
//             prev_id = e.target.parentElement.id;
//             // filteredData[e.target.parentElement.id].status = true;

//             myRecord.push(e.target.parentElement.id);
//             // flightPlanCoordinates.push(
//             //   {
//             //     lat: filteredData[e.target.parentElement.id].location.lat,
//             //     lng: filteredData[e.target.parentElement.id].location.lng
//             //   });
//             STOP_DETAILS.push({
//                 stop: filteredData[e.target.parentElement.id].stop,
//                 riders: filteredData[e.target.parentElement.id].name,
//                 lat: filteredData[e.target.parentElement.id].location.lat,
//                 lng: filteredData[e.target.parentElement.id].location.lng,
//                 mNumber: filteredData[e.target.parentElement.id].mNumber,
//             });
//             myStopNumberInfo[STOP_DETAILS[STOP_DETAILS.length - 1].mNumber[0]] =
//                 stop_number + 1;
//             stop_number++;
            
//         };

//         // console.log(filteredData);
//         filteredData.forEach((position, i) => {
//             // console.log(filteredData[i]);
//             if (i === 0) {
//                 icon = startPoint;
//                 myTitle = `<div><h3>${position.name.toString()}</h3></div>`;
//             } else {
//                 // console.log(position.stop.split(",")[0], position.status);
//                 icon = studentDummyImage;
//                 if (position.status)
//                     // myTitle = `<div id="infowindow-container" ><h3>${position.name.toString()}</h3><p id="infowindow-success">Assigned</div>`;
//                     myTitle = `<div id="infowindow-container" ><h3>${myStopNumberInfo[position.mNumber[0]]
//                             ? myStopNumberInfo[position.mNumber[0]] + ". "
//                             : ""
//                         }${position.stop.split(",")[0]
//                         }</h3><p id="infowindow-success">Assigned</div>`;
//                 // myTitle = `<div id="infowindow-container" ><h3>${position.name.toString()}</h3><div id=${i}><span id='infowindow-assign'>Assign rider</span></div></div>`;
//                 else
//                     myTitle = `<div><div id="infowindow-container" ><h3>${position.stop.split(",")[0]
//                         }</h3><div id=${i}><span id='infowindow-assign'>Assign riders</span></div></div><div>${position.name.toString()}</div></div>`;
//             }

//             const marker = new window.google.maps.Marker({
//                 position: position.location,
//                 map,
//                 myTitle,
//                 icon,
//                 optimized: false,
//             });

//             marker.addListener("mouseover", () => {
//                 // infoWindow.close();
//                 infoWindow.setContent(marker.myTitle);
//                 infoWindow.open(marker.getMap(), marker);
//                 infoWindow.open(
//                     setTimeout(() => {
//                         document
//                             .getElementById("infowindow-assign")
//                             .addEventListener("click", assignButtonClickHandler);
//                     })
//                 );
//             });
//         });
//     }
//     window.myInitMap = myInitMap;

//     return (
//         <div className='viewRouteContainer'>
//             <div id="map-viewModal"></div>
//         </div>
//     )
// }

// export default ViewRoute