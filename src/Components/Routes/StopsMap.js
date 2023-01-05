import React from 'react';
import startPoint from "../../Assets/Pin_icon_green50.png";
import studentDummyImage from "../../Assets/new_student_marker.png";

let flightPlanCoordinates = [];
const StopsMap = ({ stopData }) => {
    // alert("here");
    const script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAq88vEj-mQ9idalgeP1IuvulowkkFA-Nk&callback=myInitMap&libraries=places&v=weekly";
    script.async = true;
    document.body.appendChild(script);
    // console.log(stopData);

    flightPlanCoordinates = [];
    for (let i = 0; i < stopData.length; i++) {
        flightPlanCoordinates.push(stopData[i].location);
    }
    // console.log(stopData);

    function myInitMap() {
        const map = new window.google.maps.Map(document.getElementById("main-stopsInfo-map"), {
            zoom: 12,
            center: { lat: stopData[Math.round(stopData.length / 2)].location.lat, lng: stopData[Math.round(stopData.length / 2)].location.lng },
            disableDefaultUI: true,
            fullscreenControl: true,
            zoomControl: true
        });

        const infoWindow = new window.google.maps.InfoWindow();
        let icon;
        let myTitle;

        const flightPath1 = new window.google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            strokeColor: "black",
            strokeOpacity: 1.0,
            strokeWeight: 7,
        });

        const flightPath = new window.google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            strokeColor: "rgba(34, 137, 203, 255)",
            strokeOpacity: 1.0,
            strokeWeight: 5,
        });

        flightPath1.setMap(map);
        flightPath.setMap(map);

        const assignButtonClickHandler = (e) => {
            // prev_id = e.target.parentElement.id;
            // studentCount += STOPS[e.target.parentElement.id].name.length;
            // if (studentCount > shuttleSeatingCapacity) {
            //     studentCount -= STOPS[e.target.parentElement.id].name.length;
            //     alert("Shuttle seating capacity exceeded");
            // }
            // else {
            //     if (previewRouteFlag) {
            //         flightPlanCoordinates.pop();
            //         previewRouteFlag = false;
            //     }
            //     STOPS[e.target.parentElement.id].status = true;
            //     myRecord = e.target.parentElement.id;
            //     flightPlanCoordinates.push(
            //         {
            //             lat: STOPS[e.target.parentElement.id].location.lat,
            //             lng: STOPS[e.target.parentElement.id].location.lng
            //         });
            //     // if(+e.target.parentElement.id === (RIDER_DATA.length - 1)){
            //     //   flightPlanCoordinates.push(RIDER_DATA[0].location);
            //     // }
            //     setIsRender(prev => !prev);
            // }
        }

        stopData.forEach((position, i) => {
            if (i === 0) {
                icon = startPoint;
                myTitle = `<div><h3>${position.stopName.toString()}</h3></div>`;
            }
            else {
                icon = studentDummyImage;
                if (position.status)
                    myTitle = `<div id="infowindow-container" ><h3>${position.stopName.toString()}</h3><p id="infowindow-success">Assigned</div>`;
                else
                    // myTitle = `<div id="infowindow-container" ><h3>${position.stopName.toString()}</h3><div id=${i}><span id='infowindow-assign'>Assign rider</span></div></div>`;
                    myTitle = `<div id="infowindow-container" ><h3>${position.stopName.toString()}</h3><div id=${i}></div></div>`;
            }

            const marker = new window.google.maps.Marker({
                position: position.location,
                map,
                myTitle,
                icon,
                optimized: false,
            });

            marker.addListener("mouseover", () => {
                infoWindow.setContent(marker.myTitle);
                infoWindow.open(marker.getMap(), marker);
                // infoWindow.open(
                //     setTimeout(() => {
                //         document.getElementById("infowindow-assign").addEventListener('click', assignButtonClickHandler)
                //     })
                // );
            });
        });
    }
    window.myInitMap = myInitMap;

    return (
        <div id='main-stopsInfo-map'></div>
    )
}

export default React.memo(StopsMap);