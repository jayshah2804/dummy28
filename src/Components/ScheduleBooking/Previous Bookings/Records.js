import React, { useEffect, useRef, useState } from "react";
import Loading from "../../../Loading/Loading";
import Accordian from "./Accordian";
import { useReactToPrint } from "react-to-print";
import "./Records.css";
import useHttp from "../../../Hooks/use-http";
import Message from '../../../Modal/Message';
import loadingGif from "../../../Assets/loading-gif.gif";
import EditDriver from "./EditDriver";

let bookingData = {
    driverEmail: "",
    amount: "",
    bookingId: ""
}

const Records = (props) => {
    const [bookingCancellationId, setBookingCancellationId] = useState();
    const [isBookingCancelClicked, setIsBookingCancelClicked] = useState(false);
    const [editDriverBookingId, setEditDriverBookingId] = useState(false);
    const [bookingRequestCancalStatus, setBookingRequestCancalStatus] = useState();
    const [isSaveEditDriverClicked, setIsSaveDriverClicked] = useState(false);
    const [editDriverRequestStatus, setEditDriverRequestStatus] = useState(false);
    const cancelNoteInputRef = useRef();

    const { isLoading, sendRequest } = useHttp();

    const cancallationStatusHandler = (data) => {
        if (data.Message.toLowerCase() === "success")
            setBookingRequestCancalStatus("success");
        else
            setBookingRequestCancalStatus("fail");
    }

    const assignDriverResponse = (data) => {
        setEditDriverRequestStatus(data.Message.toLowerCase());
        setIsSaveDriverClicked(false);
    }

    useEffect(() => {
        if (isBookingCancelClicked) {
            setBookingCancellationId("");
            setIsBookingCancelClicked(false);
            sendRequest(
                {
                    url: "/api/v1/ScheduleBooking/CancelScheduleTrip",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: {
                        emailID: sessionStorage.getItem("user"),
                        status: "CANCELLED",
                        bookingID: bookingCancellationId,
                        cancelNotes: cancelNoteInputRef.current.value
                    },
                },
                cancallationStatusHandler
            );
        }
    }, [sendRequest, isBookingCancelClicked]);

    useEffect(() => {
        if (isSaveEditDriverClicked)
            sendRequest(
                {
                    url: "/api/v1/DriverList/EditAssignedDriver",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: {
                        emailID: sessionStorage.getItem("user"),
                        amount: bookingData.amount,
                        roleID: sessionStorage.getItem("roleId"),
                        status: "ACCEPTED",
                        bookingID: bookingData.bookingId,
                        driverEmailID: bookingData.driverEmail,
                        sendSms: "1"
                    },
                },
                assignDriverResponse
            );
    }, [sendRequest, isSaveEditDriverClicked]);

    const editDriverFun = (selectedDriverEmail, amount) => {
        bookingData.driverEmail = selectedDriverEmail;
        bookingData.amount = amount;
        bookingData.bookingId = editDriverBookingId;
        setEditDriverBookingId("");
        setIsSaveDriverClicked(true);
    }

    const func = (val) => {
        if (val) {
            document.getElementById(val)?.click();
        }
    }

    return (
        <React.Fragment>
            {props.data[0] ?
                <table className="table" id="my-table">
                    <thead>
                        <tr>
                            {sessionStorage.getItem("roleId") == 1 &&
                                <th>Corporate Name</th>
                            }
                            {props.headers.map((data) => (
                                <th style={{ width: "auto" }} scope="col">{data}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {props.data.map((item, index) => (
                            <Accordian
                                formyRender={func}
                                id={index}
                                bookingId={item.bookingId}
                                guestName={item.guestName}
                                guestMobile={item.guestMobile}
                                pickupDate={item.pickupDate}
                                pickupTime={item.pickupTime}
                                dropDate={item.dropDate}
                                dropTime={item.dropTime}
                                vehicleType={item.vehicleType}
                                status={item.status}
                                pickupLocation={item.pickupLocation}
                                dropLocation={item.dropLocation}
                                driverName={item.driverName}
                                driverCarNumber={item.driverCarNumber}
                                driverCarModel={item.driverCarModel}
                                bookingDate={item.bookingDate}
                                cancelNotes={item.cancelNotes}
                                setBookingCancellationId={setBookingCancellationId}
                                setEditDriverBookingId={setEditDriverBookingId}
                                bookingType={item.bookingType}
                                coprorateId={item.coprorateId}
                                corporateName={item.corporateName}
                            />
                        ))}
                    </tbody>
                </table> :
                <React.Fragment>
                    <table className="table" id="my-table" >
                        <thead>
                            <tr>
                                {props.headers.map((data) => (
                                    <th style={{ width: "auto" }} >{data}</th>
                                ))}
                                <th>Actions</th>
                            </tr>
                        </thead>
                    </table>
                    {props.isLoading ? <Loading datatable="true" /> :
                        <div style={{ textAlign: "center", marginTop: "10px" }}>No Data Available</div>
                    }
                </React.Fragment>
            }
            {editDriverBookingId &&
                <React.Fragment>
                    <div className="overlay"></div>
                    <EditDriver setEditDriverBookingId={setEditDriverBookingId} bookingId={editDriverBookingId} editDriverFun={editDriverFun} />
                </React.Fragment>
            }
            {bookingCancellationId &&
                <React.Fragment>
                    <div className="overlay"></div>
                    <div className="cancelBookingModal">
                        <header>
                            <span>Cancel Schedule Booking</span>
                            <span onClick={() => setBookingCancellationId("")} style={{ cursor: "pointer" }} >X</span>
                        </header>
                        <main>
                            <textarea ref={cancelNoteInputRef} placeholder="Enter Cancellation Reason" />
                        </main>
                        <footer>
                            <button onClick={() => setIsBookingCancelClicked(true)} >Save</button>
                        </footer>
                    </div>
                </React.Fragment>
            }
            {isLoading && <img src={loadingGif} className="loading-gif" />}
            {bookingRequestCancalStatus && <Message type={bookingRequestCancalStatus} message="Your booking has been cancelled successfully" />}
            {editDriverRequestStatus && <Message type={editDriverRequestStatus} message="Data is saved successfully" />}
        </React.Fragment>
    );
};

export default Records;
