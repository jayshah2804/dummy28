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
let trip_interval = "";
let pathInterval = "";
let myFlag = 1;

const LiveTrip = (props) => {
    const [isRender, setIsRender] = useState("first");

    // console.log(isRender);
    if (prev_driverEmail && prev_driverEmail !== props.driverEmail && myFlag) {
        // clearInterval(trip_interval);
        // clearInterval(pathInterval);
        // setIsRender(prev => !prev);
        myFlag = 0;
    } else myFlag = 1;

    useEffect(() => {
        const script = document.createElement("script");
        script.src =
            "https://maps.googleapis.com/maps/api/js?key=AIzaSyAq88vEj-mQ9idalgeP1IuvulowkkFA-Nk&callback=myInitMap&libraries=places&v=weekly";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const authenticateUser = (data) => {
        console.log(data, driverFlag);
        // debugger;
        if (data.Livetripdetails) {
            if (!driverFlag) {
                flightPlanCoordinates.push({
                    lat: data.Livetripdetails[0].Latitude,
                    lng: data.Livetripdetails[0].Longitude
                })
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
        } else flightPlanCoordinates = [];
        // setIsRender((prev) => !prev);
    };

    const { isLoading, sendRequest } = useHttp();

    useEffect(() => {
        if (props.driverEmail) {
            // debugger;
            prev_driverEmail === props.driverEmail ? driverFlag = false : driverFlag = true;
            prev_driverEmail = props.driverEmail;
            // clearInterval(trip_interval);
            // clearInterval(pathInterval);
        }
        // if (props.driverEmail) {
        //     console.log("here");
        //     if (prev_driverEmail !== props.driverEmail) {
        //         driverFlag = false;
        //         prev_driverEmail = props.driverEmail;
        //     } else driverFlag = true;
        // }

        if (props.driverEmail)
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
                            driverEmailID: props.driverEmail,
                            corporateID: sessionStorage.getItem("corpId"),
                            Isall: driverFlag === true ? 1 : 0,
                        },
                    },
                    authenticateUser
                );
            }, 5000);
    }, [props.driverEmail, sendRequest]);

    function myInitMap() {
        const map = new window.google.maps.Map(
            document.getElementById("map-modal"),
            {
                zoom: 15,
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
        // console.log(flightPlanCoordinates);
        pathInterval = setInterval(() => {
            const flightPath = new window.google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: "#397273",
                strokeOpacity: 1.0,
                strokeWeight: 5,
            });
            // debugger;
            // if (prev_driverEmail && prev_driverEmail !== props.driverEmail)
            // console.log(flightPlanCoordinates, "flightPlanCoordinates");
            // if (flightPlanCoordinates.toString() === "")
            //     flightPath.setPath([]);
            flightPath.setMap(map);
            marker.setPosition(flightPlanCoordinates[flightPlanCoordinates.length - 1]);
            map.setCenter({ lat: flightPlanCoordinates[flightPlanCoordinates.length - 1]?.lat, lng: flightPlanCoordinates[flightPlanCoordinates.length - 1]?.lng }, 15)
        }, 7000);

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
