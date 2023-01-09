import React, { useEffect, useState } from 'react';
import classes from "./LiveTrip.module.css";
import icon from "../../Assets/live_car.png";
import studentDummyImage from "../../Assets/new_student_marker.png";

let valLat = 23.0350155;
let valLng = 72.5672725;

let flightPlanCoordinates = [
    { lat: 23.0358311, lng: 72.5579656 },
    { lat: 23.0350155, lng: 72.5672725 }
];
let markers = [];

const LiveTrip = () => {
    const [isRender, setIsRender] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src =
            "https://maps.googleapis.com/maps/api/js?key=AIzaSyAq88vEj-mQ9idalgeP1IuvulowkkFA-Nk&callback=myInitMap&libraries=places&v=weekly";
        script.async = true;
        document.body.appendChild(script);
    }, [])

    function myInitMap() {
        // var map = new window.google.maps.Map(document.getElementById("map-modal"), {
        //   center: { lat: 23.0225, lng: 72.5714 },
        //   zoom: 11,
        //   disableDefaultUI: true,
        //   fullscreenControl: true,
        //   zoomControl: true
        // });

        // let myInt = setInterval(() => {
        //   if (document.getElementsByClassName("gm-control-active")[0]) {
        //     document.getElementsByClassName(
        //       "gm-control-active"
        //     )[0].style.marginTop = "40px";
        //     clearInterval(myInt);
        //   }
        // });
        // INSTANTIATE MAP
        const map = new window.google.maps.Map(document.getElementById("map-modal"), {
            zoom: 10,
            center: { lat: 23.0358311, lng: 72.5579656 },
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false
        });
        // let waypts = [];
        // waypts.push({
        //     location: new window.google.maps.LatLng(23.0264486, 72.5555701), //KP
        //     stopover: true
        // });

        // setInterval(() => {
        //     // marker.setMap(null);
        //     // map.setCenter({ lat: flightPlanCoordinates[flightPlanCoordinates.length - 1].lat, lng: flightPlanCoordinates[flightPlanCoordinates.length - 1].lng }, 13);
        //     flightPlanCoordinates.push({
        //         lat: valLat,
        //         lng: valLng
        //     })
        //     valLat = valLat + 0.0001115;
        //     valLng = valLng + 0.0000015;
        //     setIsRender(prev => !prev);
        //     const flightPathBorder = new window.google.maps.Polyline({
        //         path: flightPlanCoordinates,
        //         geodesic: true,
        //         strokeColor: "black",
        //         strokeOpacity: 1.0,
        //         strokeWeight: 4,
        //     });

        //     const flightPath = new window.google.maps.Polyline({
        //         path: flightPlanCoordinates,
        //         geodesic: true,
        //         strokeColor: "rgba(34, 137, 203, 255)",
        //         strokeOpacity: 1.0,
        //         strokeWeight: 3,
        //     });

        //     flightPath.setMap(map);
        //     flightPathBorder.setMap(map);
        //     for (let i = 0; i < markers.length; i++) {
        //         markers[i].setMap(null);
        //     }
        //     const marker = new window.google.maps.Marker({
        //         position: flightPlanCoordinates[flightPlanCoordinates.length - 1],
        //         map,
        //         icon,
        //         optimized: false,
        //     });
        //     markers.push(marker);
        // }, 4000);

        // console.log(flightPlanCoordinates);
        // DEFINE THE POLYLINE
        // const polyline1 = {
        //     strokeColor: 'rgba(34, 137, 203, 255)',
        //     strokeOpacity: 10.0,
        //     strokeWeight: 4
        // };
        // const polyline2 = {
        //     strokeColor: 'black',
        //     strokeOpacity: 10.0,
        //     strokeWeight: 6
        // };

        // //DIRECTION SERVICE
        // let directionsService = new window.google.maps.DirectionsService();
        // // let directionsRenderer = new window.google.maps.DirectionsRenderer();
        // let directionsRenderer1 = new window.google.maps.DirectionsRenderer({
        //     polylineOptions: polyline1, suppressMarkers: true
        // });
        // let directionsRenderer2 = new window.google.maps.DirectionsRenderer({
        //     polylineOptions: polyline2, suppressMarkers: true
        // });

        // directionsRenderer1.setMap(map);
        // directionsRenderer2.setMap(map);

        // const request = {
        //     origin: { lat: parseFloat(23.0448498), lng: parseFloat(72.52949269999999) }, //Eximious
        //     destination: { lat: parseFloat(23.0338), lng: parseFloat(72.546584) }, //LD
        //     waypoints: waypts,
        //     travelMode: window.google.maps.TravelMode.DRIVING
        // }

        // const infoWindow = new window.google.maps.InfoWindow();

        // directionsService.route(request, function (response, status) {
        //     if (status == window.google.maps.DirectionsStatus.OK) {

        //         directionsRenderer2.setDirections(response); // Add route to the map
        //         directionsRenderer1.setDirections(response); // Add route to the map
        //         // console.log(response.routes[0].start_location);
        //         console.log(waypts[0].location.lat());

        //         // var leg = response.routes[0];

        //         let marker = new window.google.maps.Marker({
        //             position: { lat: waypts[0].location.lat(), lng: waypts[0].location.lng() },
        //             map: map,
        //             icon: studentDummyImage,
        //             myTitle: "Jay"
        //         })
        //         marker.addListener("mouseover", () => {
        //             console.log(marker);
        //             infoWindow.close();
        //             infoWindow.setContent(marker.myTitle);
        //             infoWindow.open(marker.getMap(), marker);
        //         });
        //     }
        // });
    }

    window.myInitMap = myInitMap;

    return (
        <React.Fragment>
            <div id="map-modal" className={classes.map}></div>
            <div className={classes.mapText}>Live Trip Tracker</div>
        </React.Fragment>
    )
}

export default React.memo(LiveTrip);