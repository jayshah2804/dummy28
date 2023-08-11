import React, { useRef } from 'react';
import "./NewBooking.css";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from "@mui/material/FormHelperText";
import Select from '@mui/material/Select';
import { useState } from 'react';
import { useEffect } from 'react';
import { MdOutlineArrowBack } from "react-icons/md";
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import BasicCar from "../../../Assets/basic_car.png";
import ComfortCar from "../../../Assets/comfort_car.png";
import ComfortPlusCar from "../../../Assets/comfort_plus_car.png";

import useHttp from '../../../Hooks/use-http';
import Message from '../../../Modal/Message';

let today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1;
let dd = today.getDate() + 2;

if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}
Date.prototype.addMinutes = function (m) {
    this.setTime(this.getTime() + (m * 60 * 1000));
    return this;
}

const formattedOvermorrow = dd + '/' + mm + '/' + yyyy;
const Dates = ["Today", "Tomorrow", formattedOvermorrow];
const packageList = ["8hrs 80km", "12hrs 120km"];
const times = [];
let guestDetails = {
    name: "",
    number: ""
}
let bookingDetails = {
    pickup: "",
    drop: "",
    date: "",
    time: "",
    package: "",
    pickupLat: "",
    pickupLng: "",
    dropLat: "",
    dropLng: ""
}
let autocomplete = [];
let errorFileds = {
    guestNameError: "",
    guestNumberError: "",
    pickupLocationError: "",
    dropLocationEror: "",
    pickupDateError: "",
    pickupTimeError: "",
    rentalPackageError: ""
}
let isError = false;
let corporatesData = [];
let selectedCorporateDetails = [];
const NewBooking = () => {
    const pickupInputRef = useRef();
    const dropInputRef = useRef();
    const [tripDate, setTripDate] = useState();
    const [tripTime, setTripTime] = useState();
    const [page, setPage] = useState(0);
    const guestNameInputRef = useRef();
    const guestNumberInputRef = useRef();
    const [cabBookingClicked, setCabBookingClicked] = useState(false);
    const [packageType, setPackageType] = useState();
    const [isConfirmRide, setIsConfirmRide] = useState(false);
    const [formError, setFormError] = useState(errorFileds);
    const [isBookingSuccess, setIsBookingSuccess] = useState(false);
    const [servicesTabbarValue, setServicesTabbarValue] = useState(0);

    const coroprateLists = (data) => {
        let tempArr = [];
        data.CorporateList?.forEach((cp, i) => {
            tempArr[i] = {};
            tempArr[i].cpName = cp.CorporateName;
            tempArr[i].cpId = cp.CorporateID;
            tempArr[i].adminDptId = cp.DepartmentID?.split(",")[(cp.DepartmentName.toLowerCase().split(",").includesWithIndex("admin"))];
        })
        corporatesData = tempArr;
    }

    const corporateNameClickHandler = (e, corporateDetails) => {
        if (corporateDetails) {
            selectedCorporateDetails = corporateDetails;
        } else
            selectedCorporateDetails = [];
    }

    useEffect(() => {
        debugger;
        if (page === 1 && !autocomplete[0]?.getPlace()?.geometry?.location?.lat()) {
            const script = document.createElement("script");
            script.src =
                "https://maps.googleapis.com/maps/api/js?key=AIzaSyDHdkmGjsfNqasFs6m9CooShFZsqWHcdUs&callback=scheduleInitMap&libraries=places&v=weekly";
            script.async = true;
            document.body.appendChild(script);
        }
    }, [page]);

    function initMap() {
        var input1 = document.getElementById("pac-input1");
        var input2 = document.getElementById("pac-input2");
        autocomplete[0] = new window.google.maps.places.Autocomplete(input1, { componentRestrictions: { country: ["in"] } });
        autocomplete[1] = new window.google.maps.places.Autocomplete(input2, { componentRestrictions: { country: ["in"] } });
    }
    window.scheduleInitMap = initMap;

    // useEffect(() => {
    //     if (page === 1 && !pickupInputRef.current.value) {
    //         document.getElementById("btn1").style.boxShadow = "0 10px 10px rgba(33, 33, 33, .3)";
    //         document.getElementById("btn1").style.transform = "scale(1.05)";
    //     }
    // }, [page]);

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

    const rideStatus = (data) => {
        if (data.Message.toLowerCase() === "success") {
            autocomplete = [];
            guestDetails.name = "";
            guestDetails.number = "";
            bookingDetails = {
                pickup: "",
                drop: "",
                date: "",
                time: "",
                package: "",
                pickupLat: "",
                pickupLng: "",
                dropLat: "",
                dropLng: ""
            };
            // pickupInputRef.current.value = "";
            // dropInputRef.current.value = "";
            // guestNameInputRef.current.value = "";
            // guestNumberInputRef.current.value = "";
            setIsBookingSuccess("success");
        } else setIsBookingSuccess("error");
        setIsConfirmRide(false);
    }

    useEffect(() => {
        if (isConfirmRide) {
            let flag = tripTime.includes("PM") && tripTime.split(":")[0] != 12;
            let convertedTime = (flag ? +tripTime.split(":")[0] + 12 : +tripTime.split(":")[0]) + ":" + tripTime.split(":")[1].split(" ")[0];
            let today = new Date();
            let bookingTime = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + " " + today.getHours() + ":" + today.getMinutes();
            bookingDetails.pickupLat = autocomplete[0].getPlace().geometry.location.lat();
            bookingDetails.pickupLng = autocomplete[0].getPlace().geometry.location.lng();
            bookingDetails.dropLat = autocomplete[1]?.getPlace()?.geometry?.location?.lat();
            bookingDetails.dropLng = autocomplete[1]?.getPlace()?.geometry?.location?.lng();
            let myTripDate = tripDate;
            if (tripDate.toLowerCase() === "today")
                myTripDate = (today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate());
            else if (tripDate.toLowerCase() === "tomorrow") {
                today.addHours(24);
                myTripDate = (today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate());
            }
            sendRequest(
                {
                    url: "/api/v1/ScheduleBooking/addEditBookingRequest",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: {
                        apiOperatedOn: "",
                        apiModuleID: "",
                        emailID: sessionStorage.getItem("user"),
                        amount: "500.00",
                        bookingDateTime: bookingTime,
                        bookingID: "",
                        bookingType: "VISITORS",
                        city: "Ahmedabad",
                        corporateID: sessionStorage.getItem("roleId") === "2" ? sessionStorage.getItem("corpId") : selectedCorporateDetails.cpId,
                        country: "India",
                        currency: "INR",
                        dropoffAddress: bookingDetails.drop ? bookingDetails.drop : bookingDetails.pickup,
                        dropOffDateTime: "",
                        dropoffLatitude: bookingDetails.dropLat ? bookingDetails.dropLat : bookingDetails.pickupLat,
                        dropoffLongitude: bookingDetails.dropLng ? bookingDetails.dropLng : bookingDetails.pickupLng,
                        guestMobileNumber: "91" + guestDetails.number,
                        guestName: guestDetails.name,
                        localAmount: "0.00",
                        mobileNumber: "91" + guestDetails.number + "-01",
                        otpTollChargeTrip: "0",
                        otpOnEndTrip: "1",
                        otpOnParkingTrip: "0",
                        otpOnStartTrip: "1",
                        pickupAddress: bookingDetails.pickup,
                        pickupDateTime: myTripDate + " " + convertedTime,
                        pickupLatitude: bookingDetails.pickupLat,
                        pickupLongitude: bookingDetails.pickupLng,
                        routeJSON: "[{}]",
                        vehicleType: cabBookingClicked,
                        walletUniqueID: sessionStorage.getItem("corpId"),
                        sendSms: "1",
                        sendEMail: "1",
                        justification: servicesTabbarValue == "0" ? "City Ride" : (servicesTabbarValue == "1" ? "Out Station" : ("Rental " + bookingDetails.package))
                    },
                },
                rideStatus
            );
        }
    }, [isConfirmRide, sendRequest]);

    const cabBookingHandlerClicked = (cabType) => {
        // if ((!(bookingDetails.pickup.toLowerCase().includes("airport") || bookingDetails.drop.toLowerCase().includes("airport")) && confirmedServiceTypeId === "btn1")) {
        //     isError = true;
        //     setFormError(prev => ({ ...prev, pickupLocationError: "Pickup/drop location must be Airport" }));
        // }
        if (!bookingDetails.pickup) {
            isError = true;
            setFormError(prev => ({ ...prev, pickupLocationError: "Please enter valid location" }));
        }
        if (!bookingDetails.drop && servicesTabbarValue != "2") {
            isError = true;
            setFormError(prev => ({ ...prev, dropLocationEror: "Please enter valid location" }));
        }
        if (!bookingDetails.date) {
            isError = true;
            setFormError(prev => ({ ...prev, pickupDateError: "Please select valid date" }));
        }
        if (!bookingDetails.time) {
            isError = true;
            setFormError(prev => ({ ...prev, pickupTimeError: "Please select valid time" }));
        }
        if (!bookingDetails.package && servicesTabbarValue == "2") {
            isError = true;
            setFormError(prev => ({ ...prev, rentalPackageError: "Please select valid package" }));
        }
        if (!isError) {
            setPage(prev => prev + 1);
            setCabBookingClicked(cabType);
        }
    }

    const guestDetailsNextButtonClickHandler = () => {
        if (!guestDetails.name) {
            isError = true;
            setFormError(prev => ({ ...prev, guestNameError: "Please enter valid name" }));
        }
        if (!guestDetails.number || guestDetails.number.toString().length !== 10) {
            isError = true;
            setFormError(prev => ({ ...prev, guestNumberError: "Please enter valid name" }));
        }
        if (!isError) {
            setPage(prev => prev + 1);
        }
    }

    if (today.getHours() >= 19 && Dates.includes("Today")) Dates.shift();

    const tripDateChangeHandler = (e) => {
        today = new Date();
        let currentDate = today.getDate();
        let i = 0;
        while (currentDate === today.addMinutes(30).getDate()) {
            if (i === 0) {
                if (e.target.value.toLowerCase() === "today")
                    today.addHours(3);
                else {
                    today.setDate(today.getDate() + 1);
                    today.setMinutes(0);
                    today.setHours(0);
                    currentDate = today.getDate();
                }
                today.setMinutes(0);
            }
            times[i] = (+today.getHours() > 12 ? today.getHours() - 12 : today.getHours()) + ":" + (i === 0 ? "00" : today.getMinutes() == "0" ? ("0" + today.getMinutes()) : today.getMinutes()) + (+today.getHours() >= 12 ? " PM" : " AM");
            i++;
        }
        times.length = i;
        if (e.target.value) {
            isError = false;
            setFormError(prev => ({ ...prev, pickupDateError: "" }));
        }
        setTripDate(e.target.value);
    }

    const tripTimeChangeHandler = (e) => {
        if (e.target.value) {
            isError = false;
            setFormError(prev => ({ ...prev, pickupTimeError: "" }));
        }
        setTripTime(e.target.value);
    }

    const packageTypeChangeHandler = (e) => {
        if (e.target.value) {
            isError = false;
            setFormError(prev => ({ ...prev, rentalPackageError: "" }));
        }
        setPackageType(e.target.value);
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    return (
        <React.Fragment>
            <div className='booking-main'>
                <div className='booking-sub'>
                    {page === 0 && (
                        <div style={{ padding: "5% 15%", display: "flex", flexDirection: "column", gap: "15px" }}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={corporatesData}
                                getOptionLabel={(data) => data.cpName}
                                renderInput={(params) => <TextField {...params} variant="standard" placeholder='Search Corporate Name' label="Corporate Name" />}
                                onChange={(e, newValue) => corporateNameClickHandler(e, newValue)}
                                defaultValue={sessionStorage.getItem("roleId") === "2" ? { cpName: sessionStorage.getItem("cpName") } : { cpName: selectedCorporateDetails.cpName ?? "" }}
                                disabled={sessionStorage.getItem("roleId") === "2" ? true : false}
                            />
                            <TextField className="standard-basic" defaultValue={guestDetails.name} error={formError.guestNameError} helperText={formError.guestNameError} onBlur={(e) => guestDetails.name = e.target.value} onChange={(e) => { if (e.target.value) { isError = false; setFormError(prev => ({ ...prev, guestNameError: "" })) } }} label="Guest Name" variant="standard" inputRef={guestNameInputRef} autoComplete='off' />
                            <TextField className="standard-basic" defaultValue={guestDetails.number} error={formError.guestNumberError} helperText={formError.guestNumberError} onBlur={(e) => guestDetails.number = e.target.value} onChange={(e) => { if (e.target.value) { isError = false; setFormError(prev => ({ ...prev, guestNumberError: "" })) } }} label="Guest Mobile Number" variant="standard" inputRef={guestNumberInputRef} autoComplete='off' />
                            <Button style={{ marginTop: "40px" }} variant="contained" onClick={guestDetailsNextButtonClickHandler} disabled={false} >Next</Button>
                        </div>
                    )
                    }
                    {page !== 0 &&
                        <MdOutlineArrowBack className='backArrow' onClick={() => {
                            isError = false;
                            setPage(prev => prev - 1);
                        }
                        } />
                    }
                    {page === 1 &&
                        (
                            <div style={{ height: "100%", width: "100%" }}>
                                <Tabs variant='fullWidth' style={{ cursor: "pointer" }} centered value={servicesTabbarValue} onChange={(e, newValue) => setServicesTabbarValue(newValue)} aria-label="basic tabs example">
                                    <Tab label="City Ride" />
                                    <Tab label="Outstation" />
                                    <Tab label="Rentals" />
                                </Tabs>
                                <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "10px" }} >
                                    <TextField id="pac-input1" defaultValue={bookingDetails.pickup} error={formError.pickupLocationError} helperText={formError.pickupLocationError} onBlur={(e) => bookingDetails.pickup = e.target.value} onChange={(e) => { if (e.target.value) { isError = false; setFormError(prev => ({ ...prev, pickupLocationError: "" })) } }} className="standard-basic" label="Pickup Location" variant="standard" inputRef={pickupInputRef} autoComplete='off' />
                                    <TextField id="pac-input2" style={{ display: servicesTabbarValue == "2" ? "none" : "" }} defaultValue={bookingDetails.drop} error={formError.dropLocationEror} helperText={formError.dropLocationEror} onBlur={(e) => bookingDetails.drop = e.target.value} onChange={(e) => { if (e.target.value) { isError = false; setFormError(prev => ({ ...prev, dropLocationEror: "" })) } }} className="standard-basic" label="Drop Location" variant="standard" inputRef={dropInputRef} autoComplete='off' />
                                    <React.Fragment>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120, margin: "0", width: "40%" }} error={formError.pickupDateError} >
                                                <InputLabel id="date-select-standard-label">Date</InputLabel>
                                                <Select
                                                    labelId="date-select-standard-label"
                                                    id="date-select-standard"
                                                    value={tripDate}
                                                    onChange={tripDateChangeHandler}
                                                    label="Date"
                                                    onBlur={(e) => bookingDetails.date = e.target.value}
                                                >
                                                    {Dates.map(val => <MenuItem value={val}>{val}</MenuItem>)}
                                                </Select>
                                                <FormHelperText>{formError.pickupDateError}</FormHelperText>
                                            </FormControl>
                                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120, margin: "0", width: "40%" }} error={formError.pickupTimeError} >
                                                <InputLabel id="time-select-standard-label">Time</InputLabel>
                                                <Select
                                                    labelId="time-select-standard-label"
                                                    id="time-select-standard"
                                                    value={tripTime}
                                                    onChange={tripTimeChangeHandler}
                                                    label="Time"
                                                    onBlur={(e) => bookingDetails.time = e.target.value}
                                                >
                                                    {times?.map(val => <MenuItem value={val}>{val}</MenuItem>)}
                                                </Select>
                                                <FormHelperText>{formError.pickupTimeError}</FormHelperText>
                                            </FormControl>
                                        </div>
                                    </React.Fragment>
                                    {servicesTabbarValue == "2" &&
                                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120, margin: "0" }} error={formError.rentalPackageError} >
                                            <InputLabel id="package-select-standard-label">Select Package</InputLabel>
                                            <Select
                                                labelId="package-select-standard-label"
                                                id="package-select-standard"
                                                label="Journey Type"
                                                value={packageType}
                                                onChange={packageTypeChangeHandler}
                                                onBlur={(e) => bookingDetails.package = e.target.value}
                                            >
                                                {packageList.map(val => <MenuItem value={val}>{val}</MenuItem>)}
                                            </Select>
                                            <FormHelperText>{formError.rentalPackageError}</FormHelperText>
                                        </FormControl>
                                    }
                                </div>
                                <div style={{ marginTop: "20px" }}>
                                    <p style={{ color: "rgba(34, 137, 203, 255)" }}>Available Rides</p>
                                    <div className='available-cab-details' style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div className='basic' onClick={() => cabBookingHandlerClicked("Basic")} >
                                            <img src={BasicCar} />
                                            <div className='basic-sub'>
                                                <span className='cab-type' >Basic</span>
                                                <span className='cab-names'>Wagonar, Micra, Celerio</span>
                                                <span className='cab-details' >Affordable AC cab for city rides</span>
                                            </div>
                                        </div>
                                        <div className='comfort' onClick={() => cabBookingHandlerClicked("Comfort")} >
                                            <img src={ComfortCar} />
                                            <div className='comfort-sub'>
                                                <span className='cab-type'>Comfort</span>
                                                <span className='cab-names' >Dzire, Excent, Etios</span>
                                                <span className='cab-details' >Comfortable sedans with extra legroom</span>
                                            </div>
                                        </div>
                                        <div className='comfort-plus' onClick={() => cabBookingHandlerClicked("Comfort Plus")} >
                                            <img src={ComfortPlusCar} />
                                            <div className='comfort-plus-sub'>
                                                <span className='cab-type' >Comfort Plus</span>
                                                <span className='cab-names' >Ertiga, Enjoy</span>
                                                <span className='cab-details' >Comfortable SUVs for group travel</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    {page === 2 &&
                        <div style={{ display: "flex", flexDirection: "column", margin: "10%", marginTop: "0" }}>
                            <div style={{ border: "1px solid gray", borderRadius: "10px", padding: "15px", paddingTop: "0" }} >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <img src={cabBookingClicked.toLowerCase().includes("basic") ? BasicCar : (cabBookingClicked.toLowerCase().includes("plus") ? ComfortPlusCar : ComfortCar)} />
                                    <h4>Pickup on {tripDate} at <span style={{ color: "rgba(34, 137, 203, 255)" }} >{tripTime}</span></h4>
                                </div>
                                <div>
                                    <h5>Pickup</h5>
                                    <p style={{ color: "rgb(130,130,130)", fontSize: "10.5px", marginTop: "2px" }} >{bookingDetails.pickup}</p>
                                    <br />
                                    <h5>{servicesTabbarValue == "2" ? "Package" : "Drop"}</h5>
                                    <p style={{ color: "rgb(130,130,130)", fontSize: "10.5px", marginTop: "2px" }} >{servicesTabbarValue == "2" ? packageType : bookingDetails.drop}</p>
                                </div>
                            </div>
                            <Button style={{ marginTop: "40px" }} variant="contained" onClick={() => setIsConfirmRide(true)} >Confirm & Book</Button>
                        </div>
                    }
                </div>
            </div >
            {isLoading &&
                <Backdrop
                    sx={{ color: 'rgba(34, 137, 203, 255)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            }
            {isBookingSuccess && <Message type={isBookingSuccess} message="Your booking has been successful" url="/schedule-booking/bookings" />}
        </React.Fragment>
    )
}

export default NewBooking;