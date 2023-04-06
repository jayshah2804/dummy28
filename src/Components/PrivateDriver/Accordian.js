import React, { useState } from "react";
import { MdArrowRight } from "react-icons/md";
import { MdArrowDropDown } from "react-icons/md";
import photo from "../../Assets/admin.jpg";

import classes from "./Accordian.module.css";
import useHttp from "../../Hooks/use-http";
import { useEffect } from "react";
import RiderInfoMap from "./RiderInfoMap";
import Loading from "../../Loading/Loading";

import connectionPoint from "../../Assets/start_location_green.png";
import threedots from "../../Assets/route_3dots.png";
import endPoint from "../../Assets/place_outline.png";

const RIDER_TITLE = [
  "Rider Name",
  // "Shuttle Arrival Time",
  "Pickup Location",
  "",
  // "Boarding Time",
  // "Boarding (Lat Lng )",
  "Drop Location",
  // "Alighting Time",
  // "Aligthing (Lat Lng)",
  // "starting (Lat Lng)"
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
    // console.log(data.TripdetailList);
    driverPath = data.Triplatlong;
    let trip_rider_list = [];
    for (let i = 0; i < data?.TripdetailList?.length; i++) {
      trip_rider_list.push({
        id: i + 1,
        actual_pickup_name: data.TripdetailList[i].ActualPickupName,
        actual_dropOff_name: data.TripdetailList[i].ActualDropOffName,
        actual_pickup_latLng: data.TripdetailList[i].ActualPickupAddress,
        actual_dropOff_latLng: data.TripdetailList[i].ActualDropoffAddress,
        rider_name: data.TripdetailList[i].RiderName,
        pickup_name: data.TripdetailList[i].PickupAddress,
        drop_name: data.TripdetailList[i].DropOffAddress,
        pickup_latLng: data.TripdetailList[i].PickupLatitude + "," + data.TripdetailList[i].PickupLongitude,
        dropoff_latLng: data.TripdetailList[i].DropoffLatitude + "," + data.TripdetailList[i].DropoffLongitude,
        trip_status: data.TripdetailList[i].TripStatus
      });
    }
    rider_details = trip_rider_list;
    setRiderData(rider_details);
  };

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    // console.log(rider_dataFlag);
    // if (rider_dataFlag > 1) {
    // console.log("here");
    if (
      (currentId !== previous_id ||
        (currentId === previous_id && !prev_active_status)) && current_journeyId
    ) {
      sendRequest(
        {
          url: "/api/v1//PrivateTrip/PrivateTripDetails",
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
    }
    // }
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
      let a = current_journeyId.split(",");
      if (a.length !== 1)
        current_journeyId = e.target.parentElement.children[1].id;
    }
  };

  return (
    <React.Fragment>
      {/* {console.log(riderData)} */}
      <tr onClick={tableRowClickHandler} id={props.id + "tr"}>
        <td>
          <div className={classes.driverInfo}>
            <div className={classes.div}>
              <p>{props.driver_name}</p>
              <p className={classes.carInfo} id={props.journey_id} >{props.car_info}</p>
            </div>
          </div>
        </td>
        <td>{props.journey_id} </td>
        <td>{props.trip_date} </td>
        <td>{props.pickup_time} </td>
        <td>{props.drop_time} </td>
        <td>{props.total_trip_time} </td>
        <td>{props.trip_status} </td>
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
        <td colSpan="8">
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
                          <td>{data.rider_name}
                            {/* <img src={photo} alt="" /> */}
                            {/* <p>{data.rider_name}</p> */}
                          </td>
                          {/* <td>{data.shuttle_arrival_time} </td> */}
                          <td>{data.trip_status.toLowerCase() !== "ended" ? data.pickup_name : data.actual_pickup_name} </td>
                          {/* <td>{data.boarding_time} </td> */}
                          {/* <td>{data.boarding_lat_lng} </td> */}
                          <td style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            {/* <span className={classes.green}></span>
                            <span className={classes.line}></span>
                            <span className={classes.red}></span> */}
                            <div>
                              <img style={{ width: "20px", height: "20px" }} src={connectionPoint} />
                              <img style={{ width: "20px", height: "20px", transform: "rotate(90deg)" }} src={threedots} />
                              <img style={{ width: "20px", height: "20px", transform: "rotate(90deg)" }} src={threedots} />
                              <img style={{ width: "20px", height: "20px", transform: "rotate(90deg)" }} src={threedots} />
                              <img style={{ width: "20px", height: "20px", transform: "rotate(90deg)" }} src={threedots} />
                              <img style={{ width: "20px", height: "20px", transform: "rotate(90deg)" }} src={threedots} />
                              <img style={{ width: "20px", height: "20px", transform: "rotate(90deg)" }} src={threedots} />
                              <img style={{ width: "20px", height: "20px", transform: "rotate(90deg)" }} src={threedots} />
                              <img style={{ width: "20px", height: "20px", transform: "rotate(90deg)" }} src={threedots} />
                              <img style={{ width: "20px", height: "20px", transform: "rotate(90deg)" }} src={threedots} />
                              <img style={{ width: "20px", height: "20px", transform: "rotate(90deg)" }} src={threedots} />
                              <img style={{ width: "20px", height: "20px" }} src={endPoint} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "grey", fontSize: "10px" }}>
                              <p>{data.actual_pickup_latLng}</p>
                              <p>{data.actual_dropOff_latLng}</p>
                            </div>
                          </td>
                          <td>{data.trip_status.toLowerCase() !== "ended" ? data.drop_name : data.actual_dropOff_name} </td>
                          {/* <td>{data.alighting_time} </td> */}
                          {/* <td>{data.alighting_lat_lng} </td> */}
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
