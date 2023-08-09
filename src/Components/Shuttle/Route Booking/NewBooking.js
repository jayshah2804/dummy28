import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect } from 'react';
import { useState } from 'react';
import MultipleDatesPicker from '@ambiot/material-ui-multiple-dates-picker'
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import useHttp from '../../../Hooks/use-http';
import "./NewBooking.css";


let corporatesData = [];
let routesData = [];
let driversData = [];
let selectedCorporateDetails = [];
let selectedRouteDetails = [];
let selecteddriverDetails = [];
const NewBooking = (props) => {
    // const [filteredCorporates, setFilteredCorporates] = useState([]);
    const [cpPrivateDriverData, setCpPrivateDriverData] = useState([]);
    const [isApiCall, setIsApiCall] = useState(false);
    const [isCalenderOpen, setIsCalenderOpen] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const [filteredDate, setFilteredDate] = useState([]);
    const [isRouteBookingClicked, setIsRouteBookingClicked] = useState(false);

    const corporateNameClickHandler = (e, corporateDetails) => {
        if (corporateDetails) {
            selectedCorporateDetails = corporateDetails;
            // routesData = [];
            // selectedRouteDetails = [];
            // setFilteredCorporates([]);
            setIsApiCall(true);
        }
    }

    const routeNameClickHandler = (e, routeDetails) => {
        if (routeDetails) {
            selectedRouteDetails = routeDetails;
            // setFilteredCorporates([]);
            // setIsApiCall(true);
        }
    }

    const driverNameClickHandler = (e, driverDetails) => {
        if (driverDetails) {
            selecteddriverDetails = driverDetails;
        }
    }

    const newBookingSubmitHandler = () => {
        setIsRouteBookingClicked(true);
    }

    const datesSubmitHandler = (dates) => {
        let filteredDates = [];
        dates.forEach(date => {
            filteredDates.push(
                {
                    BookingDate: date.getFullYear() + "/" + (+date.getMonth() + 1) + "/" + date.getDate(),
                    Weekday: +date.getDay() + 1
                });
        })
        setFilteredDate(filteredDates);
        setSelectedDates(dates);
        setIsCalenderOpen(false);
    }

    const coroprateLists = (data) => {
        let tempArr = [];
        data.CorporateList.forEach((cp, i) => {
            tempArr[i] = {};
            tempArr[i].cpName = cp.CorporateName;
            tempArr[i].cpId = cp.CorporateID;
        })
        corporatesData = tempArr;
    }

    const routeList = (data) => {
        let tempArr = [];
        data.RouteList?.forEach((route, i) => {
            tempArr[i] = {};
            tempArr[i].routeName = route.RouteName;
            tempArr[i].routeId = route.RouteID;
            tempArr[i].routeType = route.RouteTypeName === "dropping" ? "dropoff" : "pickup";
        })
        routesData = tempArr;
        setIsApiCall(false);
    }

    const driverList = (data) => {
        let tempArr = [];
        data.DriverList?.forEach((driver, i) => {
            tempArr[i] = {};
            tempArr[i].driverName = driver.DriverName;
            tempArr[i].driverEmailId = driver.DriverEmailID;
            tempArr[i].driverCarModel = driver.Model;
        })
        driversData = tempArr;
        setIsApiCall(false);
    }

    const bookingConfirmationHandler = (data) => {
        data?.Message?.toLowerCase() === "success" ? props.setIsNewRouteBookingSuccess("success") : props.setIsNewRouteBookingSuccess("error");
        props.setIsRefreshBookingList(true);
        props.setIsNewBookingClicked(false);
    }

    const { isLoading, sendRequest } = useHttp();

    useEffect(() => {
        if (isRouteBookingClicked)
            sendRequest(
                {
                    url: "/api/v1/ShuttleTrips/AddEditDriverwithRiderAssing",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: {
                        emailID: sessionStorage.getItem("user"),
                        driverEmailID: selecteddriverDetails.driverEmailId,
                        routeID: selectedRouteDetails.routeId,
                        routeType: selectedRouteDetails.routeType,
                        shuttleDetails: JSON.stringify(filteredDate)
                    },
                },
                bookingConfirmationHandler
            );
    }, [sendRequest, isRouteBookingClicked]);

    useEffect(() => {
        if (isApiCall)
            sendRequest(
                {
                    url: "/api/v1/Route/GetRoutList",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: {
                        emailID: sessionStorage.getItem("user"),
                        CorporateID: sessionStorage.getItem("roleId") === "1" ? selectedCorporateDetails.cpId : sessionStorage.getItem("corpId"),
                        departmentID: ""
                    },
                },
                routeList
            );
    }, [sendRequest, isApiCall]);

    useEffect(() => {
        sendRequest(
            {
                url: "/api/v1/DriverList/GetDriverList",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    emailID: sessionStorage.getItem("user"),
                    CorporateID: "",
                    roleID: sessionStorage.getItem("roleId")
                },
            },
            driverList
        );
        if (sessionStorage.getItem("roleId") === "1")
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
        else setIsApiCall(true);
    }, [sendRequest]);

    return (
        <React.Fragment>
            {isLoading &&
                <Backdrop
                    sx={{ color: 'rgba(34, 137, 203, 255)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            }
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                {/* {sessionStorage.getItem("roleId") === "1" ? */}
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={corporatesData}
                    sx={{ width: 250, margin: "20px" }}
                    getOptionLabel={(data) => data.cpName}
                    renderInput={(params) => <TextField {...params} variant="standard" placeholder='Search Corporate Name' label="Corporate Name" />}
                    onChange={(e, newValue) => corporateNameClickHandler(e, newValue)}
                    disabled={sessionStorage.getItem("roleId") === "2" ? true : false}
                    defaultValue={sessionStorage.getItem("roleId") === "2" ? { cpName: sessionStorage.getItem("cpName") } : { cpName: "" }}
                />
                {/* :
                    <TextField disabled id="standard-basic" label="Corporate Name" defaultValue={sessionStorage.getItem("cpName")} variant="standard" />
                } */}
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={routesData}
                    sx={{ width: 250, margin: "20px" }}
                    getOptionLabel={(data) => data.routeName}
                    renderInput={(params) => <TextField {...params} variant="standard" placeholder='Search Route Name' label="Route Name" />}
                    onChange={(e, newValue) => routeNameClickHandler(e, newValue)}
                />
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={driversData}
                    sx={{ width: 250, margin: "20px" }}
                    getOptionLabel={(data) => data.driverName + " (" + data.driverCarModel + ")"}
                    renderInput={(params) => <TextField {...params} variant="standard" placeholder='Search Driver Name' label="Driver Name" />}
                    onChange={(e, newValue) => driverNameClickHandler(e, newValue)}
                />
                <span className='selectDatesClick' onClick={() => setIsCalenderOpen(!isCalenderOpen)} >Select Dates</span>
            </div>
            <div>
                {filteredDate.length > 0 &&
                    <div style={{ marginLeft: "20px" }}>
                        Selected Dates:
                        {filteredDate.map(ele => <span className='singleRouteBookingDate' >{ele.BookingDate}</span>)}
                    </div>
                }
                <MultipleDatesPicker
                    open={isCalenderOpen}
                    selectedDates={selectedDates}
                    onCancel={() => setIsCalenderOpen(false)}
                    onSubmit={dates => datesSubmitHandler(dates)}

                />
            </div>
            <Button sx={{ alignSelf: "end" }} variant="contained" onClick={newBookingSubmitHandler} >Add Booking</Button>
        </React.Fragment>
    )
}

export default NewBooking;