import React from 'react'
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import useHttp from '../../Hooks/use-http';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import dayjs from 'dayjs';

import DataTable from './DataTable';


const Bookings = () => {
    const [tripsData, setTripsData] = useState([]);
    const [isRefreshData, setIsRefereshData] = useState(true);
    const [startDateValue, setStartDateValue] = useState(dayjs(new Date()));
    const [endDateValue, setEndDateValue] = useState(dayjs(new Date()));

    const tripsDataResponse = (data) => {
        setTripsData(data.TripList);
        setIsRefereshData(false);
    }

    const { isLoading, sendRequest } = useHttp();

    useEffect(() => {
        if (isRefreshData)
            sendRequest(
                {
                    url: "/api/v1/Trips/GetAllTrips",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: {
                        emailID: sessionStorage.getItem("user"),
                        corporateID: sessionStorage.getItem("roleId") == "1" ? "" : sessionStorage.getItem("corpId"),
                        roleID: sessionStorage.getItem("roleId"),
                        staffMobileNumber: "",
                        departmentID: "",
                        fromDate: `${startDateValue.$d.getFullYear()}/${startDateValue.$d.getMonth() + 1}/${startDateValue.$d.getDate()}`,
                        toDate: `${endDateValue.$d.getFullYear()}/${endDateValue.$d.getMonth() + 1}/${endDateValue.$d.getDate()}`,
                    },
                },
                tripsDataResponse
            );
    }, [sendRequest, isRefreshData]);

    return (
        <div>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "1.5%" }} >
                <span style={{ fontWeight: "bold", fontSize: "17px", textTransform: "uppercase" }} >Trips</span>
            </header>
            <DataTable setIsRefereshData={setIsRefereshData} tripsData={tripsData} dataLoading={isLoading} setStartDateValue={setStartDateValue} setEndDateValue={setEndDateValue} startDateValue={startDateValue} endDateValue={endDateValue} />
        </div>
    )
}

export default Bookings