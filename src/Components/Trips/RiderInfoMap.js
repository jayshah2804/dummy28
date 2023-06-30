import React from "react";
import studentDropImage from "../../Assets/student_dummy_photo.png";
// import studentDummyImage from "../../Assets/student_dummy_photo.png";
import studentDummyImage from "../../Assets/new_student_marker.png";
import startPoint from "../../Assets/Pin_icon_green50.png";
import endPoint from "../../Assets/Pin_icon50.png";

let routeType = "";
let minBounds = 1;
let maxBounds = 500;
let dividend = 10;
const RiderInfoMap = ({ RIDER_DATA, driverPath }) => {
  const script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyDHdkmGjsfNqasFs6m9CooShFZsqWHcdUs&callback=myInitMap&libraries=places&v=weekly";
  script.async = true;
  document.body.appendChild(script);
  // debugger;
  routeType = RIDER_DATA[0]?.routeType?.toLowerCase() === "dropping";

  function myInitMap() {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      zoom: 11,
      center: {
        lat: RIDER_DATA[0].startingLocationLat,
        lng: RIDER_DATA[0].startingLocationLong,
      },
      disableDefaultUI: true,
      fullscreenControl: true,
      zoomControl: true,
    });
    if (driverPath) {
      let currentBounds = Math.ceil(driverPath.length / dividend);
      while (!(currentBounds < maxBounds && currentBounds >= minBounds)) {
        if (currentBounds < minBounds)
          currentBounds = Math.ceil(
            driverPath.length / (Math.ceil(dividend) / 2)
          );
        else if (currentBounds > maxBounds)
          currentBounds = Math.ceil(
            driverPath.length / (Math.ceil(dividend) * 2)
          );
      }
      var bounds = new window.google.maps.LatLngBounds();
      for (let i = 0; i < driverPath.length; i = i + currentBounds) {
        bounds.extend(
          new window.google.maps.LatLng(driverPath[i].lat, driverPath[i].lng)
        );
      }
      bounds.extend(
        new window.google.maps.LatLng(
          driverPath[driverPath.length - 1].lat,
          driverPath[driverPath.length - 1].lng
        )
      );
      map.fitBounds(bounds);
    }

    let arr = [];

    for (let i = 0; i < RIDER_DATA.length; i++) {
      if (
        arr.includes(
          routeType
            ? RIDER_DATA[i].drop_location
            : RIDER_DATA[i].pickup_location
        )
      ) {
        let index = arr.indexOf(
          routeType
            ? RIDER_DATA[i].drop_location
            : RIDER_DATA[i].pickup_location
        );
        RIDER_DATA[index].rider_name.push(RIDER_DATA[i].rider_name.toString());
        // RIDER_DATA[index].mNumber.push(filteredData[i].mNumber.toString());
        RIDER_DATA.splice(i, 1);
        i--;
      }
      // console.log(filteredData);
      // console.log(filteredData[i],i);
      else {
        RIDER_DATA[i].rider_name = [RIDER_DATA[i].rider_name];
        arr.push(
          routeType
            ? RIDER_DATA[i].drop_location
            : RIDER_DATA[i].pickup_location
        );
      }
    }

    const tourStops = [
      {
        lat: routeType
          ? RIDER_DATA[0].startingLocationLat
          : +RIDER_DATA[0].alighting_lat_lng.split(",")[0],
        lng: routeType
          ? RIDER_DATA[0].startingLocationLong
          : +RIDER_DATA[0].alighting_lat_lng.split(",")[1],
      },
    ];
    for (let i = 0; i < RIDER_DATA.length; i++) {
      let a = routeType
        ? RIDER_DATA[i].alighting_lat_lng.split(",")
        : RIDER_DATA[i].boarding_lat_lng.split(",");
      let lat = +a[0];
      let lng = +a[1];
      tourStops.push({
        lat: lat,
        lng: lng,
      });
    }

    const flightPlanCoordinates = driverPath ? driverPath : tourStops;
    // flightPlanCoordinates.push({
    //     lat: flightPlanCoordinates[flightPlanCoordinates.length - 1].lat,
    //     lng: flightPlanCoordinates[flightPlanCoordinates.length - 1].lng + 0.0001
    // });

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

    const infoWindow = new window.google.maps.InfoWindow({ minWidth: 150 });
    let icon;
    let myTitle;
    tourStops.forEach((position, i) => {
      if (i === 0) {
        icon = startPoint;
        myTitle = routeType
          ? `<div><h3>${RIDER_DATA[i].pickup_location}</h3></div>`
          : `<div><h3>${RIDER_DATA[i].drop_location}</h3></div>`;
      } else {
        // if (i === flightPlanCoordinates.length - 1) {
        //     icon = endPoint;
        // } else {
        icon = studentDummyImage;
        myTitle = `<div id="infowindow-container" ><img src=${studentDropImage} id="dummy-student-image" /><h3>${
          RIDER_DATA[i - 1]?.rider_name
        }</h3></div>`;
        // }
      }

      const marker = new window.google.maps.Marker({
        position,
        map,
        myTitle,
        icon,
        optimized: false,
      });

      marker.addListener("mouseover", () => {
        infoWindow.close();
        infoWindow.setContent(marker.myTitle);
        infoWindow.open(marker.getMap(), marker);
      });
      // document.getElementById("myHandler").addEventListener("click", () => {
      //   infoWindow.setPosition([{ lat: 23.037569650831212, lng: 72.55877665822754 }]);
      //   infoWindow.setContent("Jay Shah");
      //   infoWindow.open(marker.getMap(), marker);
      // })
    });
  }

  window.myInitMap = myInitMap;

  return <div id="map"></div>;
};

export default RiderInfoMap;
