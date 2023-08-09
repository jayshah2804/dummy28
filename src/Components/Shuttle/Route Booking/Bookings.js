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

import DataTable from './DataTable';
import NewBooking from './NewBooking';

let corporatesData = [];
let selectedCorporateDetails = [
    {
        cpName: "",
        cpId: ""
    }
];
const Bookings = () => {
    const [bookedRouteList, setBookedRouteList] = useState([]);
    const [filteredCorporates, setFilteredCorporates] = useState([]);
    const [isApiCall, setIsApiCall] = useState(false);
    const [isNewBookingClicked, setIsNewBookingClicked] = useState(false);
    const [isRefreshBookingList, setIsRefreshBookingList] = useState(false);
    const [isNewRouteBookingSuccess, setIsNewRouteBookingSuccess] = useState(false);
    const history = useHistory();

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const corporateNameClickHandler = (e, corporateDetails) => {
        if (corporateDetails) {
            selectedCorporateDetails = corporateDetails;
            setFilteredCorporates([]);
            setIsApiCall(true);
        }
        setBookedRouteList([]);
    }

    const routeBookingDetails = (data) => {
        console.log(data.BookedRouteList);
        setBookedRouteList(data.BookedRouteList);
        setIsRefreshBookingList(false);
    }

    const coroprateLists = (data) => {
        let tempArr = [];
        if (data?.CorporateList) {
            data.CorporateList.forEach((cp, i) => {
                tempArr[i] = {};
                tempArr[i].cpName = cp.CorporateName;
                tempArr[i].cpId = cp.CorporateID;
            })
            corporatesData = tempArr;
        }
    }

    const { isLoading, sendRequest } = useHttp();

    useEffect(() => {
        sendRequest(
            {
                url: "/api/v1/Corporate/GetAllDepartmentByCorporate",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    emailID: sessionStorage.getItem("user"),
                },
            },
            coroprateLists
        );
    }, [sendRequest]);

    useEffect(() => {
        let date = new Date();
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
                    fromDate: "2023/08/06",
                    endDate: "2023/08/07"
                    // endDate: date.getFullYear() + "/" + (+date.getMonth() + 1) + "/" + (+date.getDate())
                },
            },
            routeBookingDetails
        );
    }, [sendRequest, selectedCorporateDetails.cpId, isRefreshBookingList]);

    return (
        <div>
            {isNewRouteBookingSuccess &&
                <Snackbar open={true} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={() => setIsNewRouteBookingSuccess(false)} >
                    <Alert onClose={() => setIsNewRouteBookingSuccess(false)} severity={isNewRouteBookingSuccess === "success" ? "success" : "error"} sx={{ width: '100%', backgroundColor: "rgba(42, 149, 69, 255)" }}>
                        {isNewRouteBookingSuccess === "success" ? `Booking has been added successfully` : "Some Error occured"}
                    </Alert>
                </Snackbar>
            }
            {/* <button onClick={() => history.push("/shuttle/new-booking")} >New Booking</button> */}
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "10px 20px" }} >
                <span style={{ fontWeight: "bold", fontSize: "17px", textTransform: "uppercase" }} >Shuttle Bookings</span>
                {!isNewBookingClicked &&
                    <Button variant="contained" onClick={() => setIsNewBookingClicked(true)} >New Booking</Button>
                }
            </header>
            {isNewBookingClicked &&
                <div style={{ backgroundColor: "white", margin: "0 20px", padding: "10px", borderRadius: "10px" }}>
                    <CloseIcon sx={{ float: "right", cursor: "pointer" }} onClick={() => setIsNewBookingClicked(false)} />
                    <div style={{ display: "flex", flexDirection: "column" }} >
                        <NewBooking setIsNewRouteBookingSuccess={setIsNewRouteBookingSuccess} setIsRefreshBookingList={setIsRefreshBookingList} setIsNewBookingClicked={setIsNewBookingClicked} />
                    </div>
                </div>
            }
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={corporatesData}
                sx={{ width: 300, margin: "40px 20px" }}
                getOptionLabel={(data) => data.cpName}
                renderInput={(params) => <TextField {...params} variant="standard" placeholder='Search Corporate Name' label="Corporate Name" />}
                onChange={(e, newValue) => corporateNameClickHandler(e, newValue)}
            />
            <DataTable privateDrivers={bookedRouteList ?? []} dataLoading={isLoading} setIsApiCall={setIsApiCall} selectedCorporateDetails={selectedCorporateDetails} />
        </div>
    )
}

export default Bookings