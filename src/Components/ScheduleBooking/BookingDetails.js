import React, { useEffect, useState } from 'react';
import "./BookingDetails.css";
import { useLocation } from 'react-router-dom';

const FIELDS = ["Booking ID", "Booking Date Time", "Booking Status", "Pickup Date Time", "Drop Date Time", "Guest Name", "Guest Mobile Number", "Vehicle Type", "Assigned Driver", "Pickup Address", "Dropoff Address"];
const getDATA = ["bookingId", "bookingDate", "status", "pickupDate", "dropDate", "guestName", "guestNumber", "vehicleType", "driverName", "pickup", "drop"];
const DATA = [];
const BookingDetails = (props) => {
    const [isGetData, setIsGetDate] = useState(false);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    
    useEffect(() => {
        console.log(location.state);
        debugger;
        if (DATA.length === 0) {
            debugger;
            for (let i = 0; i < getDATA.length; i++) {
                DATA.push(searchParams.get(getDATA[i]));
            }
            console.log(DATA);
            setIsGetDate(true);
        }
    }, []);
    return (
        <div className='bookingDetailsContainer'>
            <div className='bookingData'>
                <h3>Booking Details</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        {FIELDS?.map((item, index) => <p>{item}</p>)}
                    </div>
                    <div>
                        {DATA?.map((data, index) => <p>{data !== "undefined" ? data : "-"}</p>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingDetails