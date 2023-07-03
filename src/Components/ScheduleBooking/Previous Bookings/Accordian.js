import React, { useRef, useState } from "react";
import { MdArrowRight } from "react-icons/md";
import { MdArrowDropDown } from "react-icons/md";
import photo from "../../../Assets/admin.jpg";

import classes from "./Accordian.module.css";
import useHttp from "../../../Hooks/use-http";
import { useEffect } from "react";
// import RiderInfoMap from "./RiderInfoMap";
import Loading from "../../../Loading/Loading";

import connectionPoint from "../../../Assets/start_location_green.png";
import threedots from "../../../Assets/route_3dots.png";
import endPoint from "../../../Assets/place_outline.png";
import editImage from "../../../Assets/editIcon.png";

const RIDER_TITLE = [
    // "Booking Id",
    "Booking Date",
    "Pickup Location",
    "Drop Location",
    "Assigned Driver",
    "Action"
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
    // const [bookingCancellationId, setBookingCancellationId] = useState();
    // const [isBookingCancelClicked, setIsBookingCancelClicked] = useState(false);
    // const cancelNoteInputRef = useRef();
    // const [editDriverBookingId, setEditDriverBookingId] = useState();

    const tableRowClickHandler = (targetId) => {
        if (parent_prev_id !== targetId && !prev_active_status)
            props.formyRender(parent_prev_id);
        setIsActive((prev) => !prev);
        parent_prev_id = targetId;
        previous_id = currentId;
        currentId = targetId;
        prev_active_status = isActive;
        evenFlag++;

        if (evenFlag % 2 !== 0)
            current_journeyId =
                document.getElementById(targetId)?.children[1].innerText;
    };

    return (
        <React.Fragment>
            <tr
                onClick={() => tableRowClickHandler(props.id + "tr")}
                id={props.id + "tr"}
            >
                {sessionStorage.getItem("roleId") == 1 &&
                    <td>{props.corporateName}</td>
                }
                <td>{props.bookingId} </td>
                <td>
                    <div className={classes.twoEntries}>
                        <span>{props.guestName}</span>
                        <span>{props.guestMobile}</span>
                    </div>
                </td>
                <td>
                    <div className={classes.twoEntries} >
                        <span>{props.pickupDate}</span>
                        <span>{props.pickupTime}</span>
                    </div>
                </td>
                <td>
                    <div className={classes.twoEntries} >
                        <span>{props.dropDate ?? "-"}</span>
                        <span>{props.dropTime}</span>
                    </div>
                </td>
                <td>{props.bookingType} </td>
                <td>{props.vehicleType.charAt(0) + props.vehicleType.substring(1).toLowerCase()} </td>
                <td>
                    <div className={classes.totalTrip}>
                        <span className={classes[props.status ? props.status.toLowerCase() : "pending"]} >{props.status ? (props.status.charAt(0) + props.status.substring(1).toLowerCase()) : "Pending"}{" "}</span>
                        {isActive ? (
                            <MdArrowDropDown className={classes.toggleIcon} />
                        ) : (
                            <MdArrowRight className={classes.toggleIcon} />
                        )}{" "}
                    </div>
                </td>
            </tr>
            {isActive && (
                <td colSpan={sessionStorage.getItem("roleId") == 1 ? 9 : 8}>
                    <React.Fragment>
                        <div className={classes.rideTableContainer}>
                            <table className={classes.riderTable}>
                                <tr>
                                    {RIDER_TITLE.map((data) => (
                                        <th>{data}</th>
                                    ))}
                                </tr>
                                <tbody>
                                    <tr id="myHandler">
                                        {/* <td>{props.bookingId} </td> */}
                                        <td>{props.bookingDate} </td>
                                        <td>{props.pickupLocation} </td>
                                        <td>{props.dropLocation} </td>
                                        <td>
                                            <div className={classes.twoEntriesRow}>
                                                <span>{props.driverName}</span>
                                                {(sessionStorage.getItem("roleId") == "1" && props.status?.toLowerCase() !== "cancelled") ?
                                                    <img src={editImage} className={classes.icon} onClick={() => props.setEditDriverBookingId(props.bookingId)} /> :
                                                    <React.Fragment>
                                                        {!props.driverName && <span>-</span>}
                                                    </React.Fragment>
                                                }
                                            </div>
                                        </td>
                                        {/* {console.log(((new Date(props.pickupDate) > new Date()) && (!props.status || props.status.toLowerCase() === "accepted")) ? "false" : "true")} */}
                                        {/* {console.log((new Date(props.pick) > new Date()), (!props.status || props.status.toLowerCase() === "accepted"))} */}
                                        <td>{props.status?.toLowerCase() === "cancelled" ? ("Cancelled due to " + props.cancelNotes) : <button className={((new Date(props.pickupDate + " " + props.pickupTime) > new Date()) && (!props.status || props.status.toLowerCase() === "accepted" || props.status.toLowerCase() === "pending")) ? classes.cancelBooking : classes.disable} disabled={((new Date(props.pickupDate + " " + props.pickupTime) > new Date()) && (!props.status || props.status.toLowerCase() === "pending" || props.status.toLowerCase() === "accepted")) ? false : true} onClick={() => props.setBookingCancellationId(props.bookingId)}>Cancel Booking</button>}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </React.Fragment>
                </td>
            )}
        </React.Fragment>
    );
};

export default Accordian;
