import React from 'react';
import studentDropImage from "../../Assets/student_dummy_photo.png";
// import studentDummyImage from "../../Assets/student_dummy_photo.png";
import studentDummyImage from "../../Assets/new_student_marker.png";
import startPoint from "../../Assets/Pin_icon_green50.png";
import endPoint from "../../Assets/Pin_icon50.png";
// import dummy from "../../Assets/greenNew.png";

let minBounds = 1;
let maxBounds = 500;
let dividend = 10;
const TripInfoMap = ({ RIDER_DATA, driverPath }) => {
    const script = document.createElement("script");
    script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyDHdkmGjsfNqasFs6m9CooShFZsqWHcdUs&callback=myInitMap&libraries=places&v=weekly";
    script.async = true;
    document.body.appendChild(script);

    function myInitMap() {
        const map = new window.google.maps.Map(document.getElementById("map"), {
            zoom: 11,
            center: RIDER_DATA[0]?.TripStatus?.toLowerCase() !== "ended" ? { lat: +RIDER_DATA[0]?.pickupLatLng.split(",")[0], lng: +RIDER_DATA[0]?.pickupLatLng.split(",")[1] } : { lat: RIDER_DATA[0].actualPickupLatLng, lng: RIDER_DATA[0].actualPickupLatLng },
            disableDefaultUI: true,
            fullscreenControl: true,
            zoomControl: true
        });
        if (driverPath) {
            let currentBounds = Math.ceil(driverPath.length / dividend);
            while (!(currentBounds < maxBounds && currentBounds >= minBounds)) {
                if (currentBounds < minBounds) currentBounds = Math.ceil(driverPath.length / (Math.ceil(dividend) / 2));
                else if (currentBounds > maxBounds) currentBounds = Math.ceil(driverPath.length / (Math.ceil(dividend) * 2));
            }
            var bounds = new window.google.maps.LatLngBounds();
            for (let i = 0; i < driverPath.length; i = i + currentBounds) {
                bounds.extend(new window.google.maps.LatLng(driverPath[i].lat, driverPath[i].lng));
            }
            bounds.extend(new window.google.maps.LatLng(driverPath[driverPath.length - 1].lat, driverPath[driverPath.length - 1].lng));
            map.fitBounds(bounds);
        }

        const flightPlanCoordinates = driverPath;

        const flightPathBorder = new window.google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            strokeColor: "black",
            strokeOpacity: 1.0,
            strokeWeight: 6,
        });

        const flightPath = new window.google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            strokeColor: "#00b0ff",
            strokeOpacity: 1.0,
            strokeWeight: 5,
        });

        flightPath.setMap(map);
        flightPathBorder.setMap(map);

        const infoWindow = new window.google.maps.InfoWindow();

        const marker1 = new window.google.maps.Marker({
            position: RIDER_DATA[0]?.TripStatus?.toLowerCase() === "accepted" ? { lat: +RIDER_DATA[0].pickupLatLng.split(",")[0], lng: +RIDER_DATA[0].pickupLatLng.split(",")[1] } : { lat: +RIDER_DATA[0].actualPickupLatLng.split(",")[0], lng: +RIDER_DATA[0].actualPickupLatLng.split(",")[1] },
            map,
            myTitle: RIDER_DATA[0]?.TripStatus?.toLowerCase() === "accepted" ? RIDER_DATA[0].PickupAddress : RIDER_DATA[0].actualPickupAddress,
            icon: startPoint,
            optimized: false,
        });
        const marker2 = new window.google.maps.Marker({
            position: RIDER_DATA[0]?.TripStatus?.toLowerCase() !== "ended" ? { lat: +RIDER_DATA[0].dropoffLatLng.split(",")[0], lng: +RIDER_DATA[0].dropoffLatLng.split(",")[1] } : { lat: +RIDER_DATA[0].actualDropoffLatLng.split(",")[0], lng: +RIDER_DATA[0].actualDropoffLatLng.split(",")[1] },
            map,
            myTitle: RIDER_DATA[0]?.TripStatus?.toLowerCase() !== "ended" ? RIDER_DATA[0].DropOffAddress : RIDER_DATA[0].actualDropoffAddress,
            icon: endPoint,
            optimized: false,
        });

        marker1.addListener("mouseover", () => {
            infoWindow.close();
            infoWindow.setContent(marker1.myTitle);
            infoWindow.open(marker1.getMap(), marker1);
        });
        marker2.addListener("mouseover", () => {
            infoWindow.close();
            infoWindow.setContent(marker2.myTitle);
            infoWindow.open(marker2.getMap(), marker2);
        });
    }

    window.myInitMap = myInitMap;

    return (
        <div id="map"></div>
    )
}

export default TripInfoMap