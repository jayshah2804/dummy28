import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect } from 'react';
import { useState } from 'react';
import MultipleDatesPicker from '@ambiot/material-ui-multiple-dates-picker'
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import useHttp from '../../../Hooks/use-http';
import "./NewBooking.css";
import { useRef } from 'react';



let corporatesData = [];
let routesData = [];
let selectedCorporateDetails = [];
let selectedRouteDetails = [];
let selecteddriverDetails = [];
let errorFields = {
    coroprateNameError: "",
    routeNameError: "",
    driverNameError: "",
    datesError: ""
}
const NewBooking = (props) => {
    const [isApiCall, setIsApiCall] = useState(false);
    const [isCalenderOpen, setIsCalenderOpen] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const [filteredDate, setFilteredDate] = useState([]);
    const [isRouteBookingClicked, setIsRouteBookingClicked] = useState(false);
    const [isError, setIsError] = useState(errorFields);
    const corporateNameInputRef = useRef();
    const routeNameInputRef = useRef();
    const driverNameInputRef = useRef();
    const datesInputRef = useRef();

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const corporateNameClickHandler = (e, corporateDetails) => {
        if (corporateDetails) {
            selectedCorporateDetails = corporateDetails;
            setIsError(prev => ({ ...prev, coroprateNameError: "" }));
            setIsApiCall(true);
        } else setIsError(prev => ({ ...prev, coroprateNameError: "Invalid Field" }));
    }

    const routeNameClickHandler = (e, routeDetails) => {
        if (routeDetails) {
            setIsError(prev => ({ ...prev, routeNameError: "" }));
            selectedRouteDetails = routeDetails;
        } else setIsError(prev => ({ ...prev, routeNameError: "Invalid Field" }));
    }

    const driverNameClickHandler = (e, driverDetails) => {
        if (driverDetails) {
            setIsError(prev => ({ ...prev, driverNameError: "" }));
            selecteddriverDetails = driverDetails;
        } else setIsError(prev => ({ ...prev, driverNameError: "Invalid Field" }));
    }

    const newBookingSubmitHandler = () => {
        if (corporateNameInputRef.current.value && routeNameInputRef.current.value && driverNameInputRef.current.value && selectedDates.length > 0) {
            if (selectedDates.length > 0) {
                for (let i = 0; i < selectedDates.length; i++) {
                    if (new Date(selectedDates[i]) < new Date(new Date().getFullYear(), new Date().getMonth())) {
                        setIsError(true);
                        break;
                    }
                    setIsRouteBookingClicked(true);
                }
            }
        } else {
            if (!corporateNameInputRef.current.value)
                setIsError(prev => ({ ...prev, coroprateNameError: "Invalid Field" }));
            if (!routeNameInputRef.current.value)
                setIsError(prev => ({ ...prev, routeNameError: "Invalid Field" }));
            if (!driverNameInputRef.current.value)
                setIsError(prev => ({ ...prev, driverNameError: "Invalid Field" }));
            if (!selectedDates.length > 0)
                setIsError(prev => ({ ...prev, datesError: "Invalid Field" }));
        }
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
        if (dates.length > 0)
            setIsError(prev => ({ ...prev, datesError: "" }));
        setIsCalenderOpen(false);
    }

    const coroprateLists = (data) => {
        let tempArr = [];
        data.CorporateList.forEach((cp, i) => {
            tempArr[i] = {};
            tempArr[i].cpName = cp.CorporateName;
            tempArr[i].cpId = cp.CorporateID;
        });
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

    const bookingConfirmationHandler = (data) => {
        if (data?.Message?.toLowerCase() === "success") {
            props.setIsNewRouteBookingSuccess({
                status: "success",
                message: "Booking has been added successfully"
            })
        } else {
            props.setIsNewRouteBookingSuccess({
                status: "error",
                message: data.SystemMessage
            })
        }
        // data?.Message?.toLowerCase() === "success" ? props.setIsNewRouteBookingSuccess("success") : props.setIsNewRouteBookingSuccess("error");
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
        if ((sessionStorage.getItem("roleId") === "1" && isApiCall) || sessionStorage.getItem("roleId") === "2")
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
    }, [sendRequest]);

    return (
        <React.Fragment>
            {isError === true &&
                <Snackbar open={true} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={() => setIsError(false)} >
                    <Alert severity={"error"} sx={{ width: '100%' }} onClose={() => setIsError(false)} >
                        {"You are not allowed to do past bookings"}
                    </Alert>
                </Snackbar>
            }
            {
                isLoading &&
                <Backdrop
                    sx={{ color: 'rgba(34, 137, 203, 255)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            }
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={corporatesData}
                    sx={{ width: 250, margin: "20px" }}
                    getOptionLabel={(data) => data.cpName}
                    renderInput={(params) => <TextField {...params} inputRef={corporateNameInputRef} error={isError.coroprateNameError} helperText={isError.coroprateNameError} variant="standard" placeholder='Search Corporate Name' label="Corporate Name" />}
                    onChange={(e, newValue) => corporateNameClickHandler(e, newValue)}
                    disabled={sessionStorage.getItem("roleId") === "2" ? true : false}
                    defaultValue={sessionStorage.getItem("roleId") === "2" ? { cpName: sessionStorage.getItem("cpName") } : { cpName: "" }}
                />
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={routesData}
                    sx={{ width: 250, margin: "20px" }}
                    getOptionLabel={(data) => data.routeName}
                    renderInput={(params) => <TextField {...params} inputRef={routeNameInputRef} error={isError.routeNameError} helperText={isError.routeNameError} variant="standard" placeholder='Search Route Name' label="Route Name" />}
                    onChange={(e, newValue) => routeNameClickHandler(e, newValue)}
                />
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={props.driverListDetails}
                    sx={{ width: 250, margin: "20px" }}
                    getOptionLabel={(data) => data.driverName + " (" + data.driverCarModel + ")"}
                    renderInput={(params) => <TextField inputRef={driverNameInputRef} error={isError.driverNameError} helperText={isError.driverNameError} {...params} variant="standard" placeholder='Search Driver Name' label="Driver Name" />}
                    onChange={(e, newValue) => driverNameClickHandler(e, newValue)}
                />
                <TextField InputProps={{ readOnly: true }} variant='standard' inputRef={datesInputRef} error={isError.datesError} helperText={isError.datesError} sx={{ width: 250, margin: "20px" }} onClick={() => setIsCalenderOpen(!isCalenderOpen)} label='Select Dates' />
                {/* <span className='selectDatesClick' onClick={() => setIsCalenderOpen(!isCalenderOpen)} >Select Dates</span> */}
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
            <Button sx={{ alignSelf: "end" }} size='small' color="success" variant="contained" onClick={newBookingSubmitHandler} >Add Booking</Button>
        </React.Fragment >
    )
}

export default NewBooking;