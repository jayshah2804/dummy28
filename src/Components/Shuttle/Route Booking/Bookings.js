import React from 'react'
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import useHttp from '../../../Hooks/use-http';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import dayjs from 'dayjs';

import DataTable from './DataTable';
import NewBooking from './NewBooking';

let selectedCorporateDetails = [
    {
        cpName: "",
        cpId: ""
    }
];
const Bookings = () => {
    const [bookedRouteList, setBookedRouteList] = useState([]);
    const [isNewBookingClicked, setIsNewBookingClicked] = useState(false);
    const [isRefreshBookingList, setIsRefreshBookingList] = useState(false);
    const [isNewRouteBookingSuccess, setIsNewRouteBookingSuccess] = useState(false);
    const [driverListDetails, setDriverListDetails] = useState([]);
    const [startDateValue, setStartDateValue] = useState(dayjs(new Date()));
    const [endDateValue, setEndDateValue] = useState(dayjs(new Date()));

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const routeBookingDetails = (data) => {
        setBookedRouteList(data.BookedRouteList);
        setIsRefreshBookingList(false);
    }

    const driverList = (data) => {
        let tempArr = [];
        data.PrivetDriverlist?.forEach((driver, i) => {
            tempArr[i] = {};
            tempArr[i].driverName = driver.DriverName;
            tempArr[i].driverEmailId = driver.DriverEmailID;
            tempArr[i].driverCarModel = driver.CarModel;
        })
        setDriverListDetails(tempArr);
        setIsRefreshBookingList(false);
    }

    const { isLoading, sendRequest } = useHttp();

    useEffect(() => {
        sendRequest(
            {
                url: "/api/v1/ShuttleTrips/GetShuttleDriverList",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    emailID: sessionStorage.getItem("user"),
                    roleID: sessionStorage.getItem("roleId"),
                    corporateID: sessionStorage.getItem("roleId") === "2" ? sessionStorage.getItem("corpId") : "",
                    isDriver: "1",
                    isRider: "0"
                },
            },
            driverList
        );
    }, [sendRequest]);

    useEffect(() => {
        sendRequest(
            {
                url: "/api/v1/Route/GetBookedRoute",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    emailID: sessionStorage.getItem("user"),
                    CorporateID: sessionStorage.getItem("roleId") === "1" ? selectedCorporateDetails.cpId : sessionStorage.getItem("corpId"),
                    roleID: sessionStorage.getItem("roleId"),
                    fromDate: `${startDateValue.$d.getFullYear()}/${startDateValue.$d.getMonth() + 1}/${startDateValue.$d.getDate()}`,
                    endDate: `${endDateValue.$d.getFullYear()}/${endDateValue.$d.getMonth() + 1}/${endDateValue.$d.getDate()}`
                },
            },
            routeBookingDetails
        );
    }, [sendRequest, isRefreshBookingList]);

    return (
        <div>
            {isNewRouteBookingSuccess &&
                <Snackbar open={true} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={() => setIsNewRouteBookingSuccess(false)} >
                    <Alert onClose={() => setIsNewRouteBookingSuccess(false)} severity={isNewRouteBookingSuccess.status} sx={{ width: '100%' }}>
                        {isNewRouteBookingSuccess.message}
                    </Alert>
                </Snackbar>
            }
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "1.5%" }} >
                <span style={{ fontWeight: "bold", fontSize: "17px", textTransform: "uppercase" }} >Shuttle Bookings</span>
                {!isNewBookingClicked &&
                    <Button variant="contained" size='medium' onClick={() => setIsNewBookingClicked(true)} >New Booking</Button>
                }
            </header>
            {isNewBookingClicked &&
                <div style={{ backgroundColor: "white", margin: "15px", padding: "10px", borderRadius: "10px" }}>
                    <CloseIcon sx={{ float: "right", cursor: "pointer" }} onClick={() => setIsNewBookingClicked(false)} />
                    <div style={{ display: "flex", flexDirection: "column", padding: "5px" }} >
                        <NewBooking driverListDetails={driverListDetails} setIsNewRouteBookingSuccess={setIsNewRouteBookingSuccess} setIsRefreshBookingList={setIsRefreshBookingList} setIsNewBookingClicked={setIsNewBookingClicked} />
                    </div>
                </div>
            }
            <DataTable driversList={driverListDetails} privateDrivers={bookedRouteList ?? []} dataLoading={isLoading} setIsRefreshBookingList={setIsRefreshBookingList} setStartDateValue={setStartDateValue} setEndDateValue={setEndDateValue} startDateValue={startDateValue} endDateValue={endDateValue} selectedCorporateDetails={selectedCorporateDetails} />
        </div>
    )
}

export default Bookings