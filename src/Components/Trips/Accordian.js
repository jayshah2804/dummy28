import React, { useState } from "react";
import { MdArrowRight } from "react-icons/md";
import { MdArrowDropDown } from "react-icons/md";
import photo from "../../Assets/admin.jpg";

import classes from "./Accordian.module.css";
import useHttp from "../../Hooks/use-http";
import { useEffect } from "react";
import RiderInfoMap from "./RiderInfoMap";
import Loading from "../../Loading/Loading";

const RIDER_TITLE = [
  "Rider Name",
  "Pickup Location",
  // "Shuttle Arrival Time",
  "Boarding Time",
  "Boarding (Lat Lng )",
  "Drop Location",
  "Alighting Time",
  "Aligthing (Lat Lng)",
];

const RIDER_DATA = [
  {
    id: 1,
    rider_name: "Deep Parmar",
    pickup_location: "A/4 Kuldeep Apartment, Maninagar, East",
    shuttle_arrival_time: "5:21 PM",
    boarding_time: "5:24 PM",
    boarding_lat_lng: "23.676763,72.878787",
    drop_location: "A/4 Kuldeep Apartment, Maninagar, East",
    alighting_time: "07:00",
    alighting_lat_lng: "23.7878787,72.8778787",
  },
  {
    id: 2,
    rider_name: "Jay Shah",
    pickup_location: "A/4 Kuldeep Apartment, Maninagar, East",
    shuttle_arrival_time: "5:21 PM",
    boarding_time: "5:24 PM",
    boarding_lat_lng: "23.676763,72.878787",
    drop_location: "A/4 Kuldeep Apartment, Maninagar, East",
    alighting_time: "07:00",
    alighting_lat_lng: "23.7878787,72.8778787",
  },
  {
    id: 3,
    rider_name: "Rahul Patel",
    pickup_location: "A/4 Kuldeep Apartment, Maninagar, East",
    shuttle_arrival_time: "5:21 PM",
    boarding_time: "5:24 PM",
    boarding_lat_lng: "23.676763,72.878787",
    drop_location: "A/4 Kuldeep Apartment, Maninagar, East",
    alighting_time: "07:00",
    alighting_lat_lng: "23.7878787,72.8778787",
  },
  {
    id: 4,
    rider_name: "Vishwas Parmar",
    pickup_location: "A/4 Kuldeep Apartment, Maninagar, East",
    shuttle_arrival_time: "5:21 PM",
    boarding_time: "5:24 PM",
    boarding_lat_lng: "23.676763,72.878787",
    drop_location: "A/4 Kuldeep Apartment, Maninagar, East",
    alighting_time: "07:00",
    alighting_lat_lng: "23.7878787,72.8778787",
  },
  {
    id: 5,
    rider_name: "Deep Parmar",
    pickup_location: "A/4 Kuldeep Apartment, Maninagar, East",
    shuttle_arrival_time: "5:21 PM",
    boarding_time: "5:24 PM",
    boarding_lat_lng: "23.676763,72.878787",
    drop_location: "A/4 Kuldeep Apartment, Maninagar, East",
    alighting_time: "07:00",
    alighting_lat_lng: "23.7878787,72.8778787",
  },
];

let parent_prev_id;
let prev_active_status;
let rider_dataFlag = 0;
let previous_id;
let currentId;
let rider_details = "";
let current_journeyId;
let evenFlag = 0;
let driverPath = [];
const Accordian = (props) => {
  const [isActive, setIsActive] = useState(false);
  const [riderData, setRiderData] = useState([]);

  const authenticateUser = (data) => {
    driverPath = data.Triplatlong;
    let trip_rider_list = [];
    for (let i = 0; i < data?.TripdetailList?.length; i++) {
      trip_rider_list.push({
        id: i + 1,
        startingLocationLat: data.TripdetailList[i].startinglat,
        startingLocationLong: data.TripdetailList[i].startinglong,
        rider_name: data.TripdetailList[i].RiderName,
        pickup_location: data.TripdetailList[i].PickupAddress,
        shuttle_arrival_time: data.TripdetailList[i].ShuttleArriveTime,
        boarding_time: data.TripdetailList[i].BoardingTime,
        boarding_lat_lng:
          data.TripdetailList[i].PickupLatitude +
          "," +
          data.TripdetailList[i].PickupLongitude,
        drop_location: data.TripdetailList[i].DropOffAddress,
        alighting_time: data.TripdetailList[i].AlightingTime,
        alighting_lat_lng:
          data.TripdetailList[i].DropoffLatitude +
          "," +
          data.TripdetailList[i].DropoffLongitude,
        route_name: data.TripdetailList[i].RouteName,
        routeType: data.TripdetailList[i].RouteType
      });
    }
    rider_details = trip_rider_list;
    setRiderData(rider_details);
  };

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    // console.log(rider_dataFlag);
    // if (rider_dataFlag > 1) {
    console.log("here");
    if (
      currentId !== previous_id ||
      (currentId === previous_id && !prev_active_status)
    ) {
      // console.log(currentId, previous_id, prev_active_status);
      console.log("here2");
      console.log(current_journeyId);
      sendRequest(
        {
          url: "/api/v1/ShuttleTrips/ShuttleTripsDetails",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            emailID: sessionStorage.getItem("user"),
            journeyID: current_journeyId,
          },
        },
        authenticateUser
      );
      // }
    }
    rider_dataFlag++;
  }, [sendRequest, isActive]);

  const tableRowClickHandler = (e) => {
    if (parent_prev_id !== e.target.parentElement.id && !prev_active_status)
      props.formyRender(parent_prev_id);
    setIsActive((prev) => !prev);
    parent_prev_id = e.target.parentElement.id;
    previous_id = currentId;
    currentId = e.target.parentElement.id;
    prev_active_status = isActive;
    evenFlag++;

    if (evenFlag % 2 !== 0) {
      current_journeyId = e.target.parentElement.children[1].innerText;
    }
  };

  return (
    <React.Fragment>
      {/* {console.log(riderData)} */}
      <tr onClick={tableRowClickHandler} id={props.id + "tr"}>
        <td>
          <div className={classes.driverInfo}>
            {/* <img
              src={photo}
              alt=""
              className={classes.driverPhoto}
            /> */}
            <div className={classes.div}>
              <p>{props.driver_name}</p>
              <p className={classes.carInfo}>{props.car_info}</p>
            </div>
          </div>
        </td>
        <td>{props.journey_id} </td>
        <td>{props.trip_date} </td>
        <td>{props.pickup_time} </td>
        <td>{props.drop_time} </td>
        <td>{props.total_trip_time} </td>
        <td className={classes.totalTrip}>
          {props.total_trip_km}{" "}
          {isActive ? (
            <MdArrowDropDown className={classes.toggleIcon} />
          ) : (
            <MdArrowRight className={classes.toggleIcon} />
          )}{" "}
        </td>
      </tr>
      {isActive && (
        <td colSpan="7">
          {isLoading ? (
            <Loading datatable="true" />
          ) : riderData.length > 0 ? (
            <React.Fragment>
              <RiderInfoMap RIDER_DATA={riderData} driverPath={driverPath} />
              <div className={classes.rideTableContainer}>
                <table className={classes.riderTable}>
                  <tr>
                    {RIDER_TITLE.map((data) => (
                      <th>{data}</th>
                    ))}
                  </tr>
                  <tbody>
                    {riderData.map((data) => {
                      return (
                        <tr id="myHandler">
                          <td>
                            {/* <img src={photo} alt="" /> */}
                            {data.rider_name}
                          </td>
                          <td>{data.pickup_location} </td>
                          {/* <td>{data.shuttle_arrival_time} </td> */}
                          <td>{data.boarding_time} </td>
                          <td>{data.boarding_lat_lng} </td>
                          <td>{data.drop_location} </td>
                          <td>{data.alighting_time} </td>
                          <td>{data.alighting_lat_lng} </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </React.Fragment>
          ) : (
            <div>No Data Available</div>
          )}
        </td>
      )}
    </React.Fragment>
  );
};

export default Accordian;
