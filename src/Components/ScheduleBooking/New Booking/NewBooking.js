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
import { BiRupee } from "react-icons/bi";
import { MdNavigateNext } from "react-icons/md";
import Button from '@mui/material/Button';
import BasicCar from "../../../Assets/basic_car.png";
import ComfortCar from "../../../Assets/comfort_car.png";
import ComfortPlusCar from "../../../Assets/comfort_plus_car.png";
import useHttp from '../../../Hooks/use-http';
import Message from '../../../Modal/Message';
import loadingGif from "../../../Assets/loading-gif.gif";

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
const packageList = ["1hrs 10km", "2hrs 20km", "3hrs 30km", "4hrs 40km", "5hrs 50km", "6hrs 60km", "7hrs 70km", "8hrs 80km", "9hrs 90km", "10hrs 100km"];
const times = [];
let guestDetails = {
    name: "",
    number: ""
}
let confirmedServiceTypeId = "btn1";
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
const NewBooking = () => {
    const pickupInputRef = useRef();
    const dropInputRef = useRef();
    const [tripDate, setTripDate] = useState();
    const [tripTime, setTripTime] = useState();
    const [page, setPage] = useState(0);
    const guestNameInputRef = useRef();
    const guestNumberInputRef = useRef();
    const [selectedServiceTypeId, setSelectedServiceTypeId] = useState("btn1");
    const [cabBookingClicked, setCabBookingClicked] = useState(false);
    const [packageType, setPackageType] = useState();
    const [isConfirmRide, setIsConfirmRide] = useState(false);
    const [formError, setFormError] = useState(errorFileds);
    const [isBookingSuccess, setIsBookingSuccess] = useState(false)

    useEffect(() => {
        debugger;
        if (page === 1) {
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

    useEffect(() => {
        if (page === 1 && !pickupInputRef.current.value) {
            document.getElementById("btn1").style.boxShadow = "0 10px 10px rgba(33, 33, 33, .3)";
            document.getElementById("btn1").style.transform = "scale(1.05)";
        }
    }, [page]);

    const rideStatus = (data) => {
        if (data.Message.toLowerCase() === "success") {
            setIsBookingSuccess("success");
        } else setIsBookingSuccess("error");
        setIsConfirmRide(false);
    }

    const { isLoading, sendRequest } = useHttp();

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
                        corporateID: sessionStorage.getItem("adminDepartmentID"),
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
                        otpOnEndTrip: "0",
                        otpOnParkingTrip: "0",
                        otpOnStartTrip: "0",
                        pickupAddress: bookingDetails.pickup,
                        pickupDateTime: myTripDate + " " + convertedTime,
                        pickupLatitude: bookingDetails.pickupLat,
                        pickupLongitude: bookingDetails.pickupLng,
                        routeJSON: "[{}]",
                        vehicleType: cabBookingClicked,
                        walletUniqueID: sessionStorage.getItem("adminDepartmentID"),
                        sendSms: "1",
                        sendEMail: "0",
                        justification: confirmedServiceTypeId === "btn1" ? "Airport Transfer" : (confirmedServiceTypeId === "btn2" ? "Out Station" : ("Rental " + bookingDetails.package))
                    },
                },
                rideStatus
            );
        }
    }, [isConfirmRide, sendRequest]);

    const scheduleFilterBUttonClickHandler = (id, cameFromBack = false) => {
        if (id) {
            if (!cameFromBack) {
                document.getElementById(selectedServiceTypeId).style.boxShadow = null;
                document.getElementById(selectedServiceTypeId).style.transform = null;
            }
            document.getElementById(id).style.boxShadow = "0 10px 10px rgba(33, 33, 33, .3)";
            document.getElementById(id).style.transform = "scale(1.05)";
            setSelectedServiceTypeId(id);
            confirmedServiceTypeId = id;
        }
    }

    const cabBookingHandlerClicked = (cabType) => {
        if ((!(bookingDetails.pickup.toLowerCase().includes("airport") || bookingDetails.drop.toLowerCase().includes("airport")) && confirmedServiceTypeId === "btn1")) {
            isError = true;
            setFormError(prev => ({ ...prev, pickupLocationError: "Pickup/drop location must be Airport" }));
        }
        if (!bookingDetails.pickup) {
            isError = true;
            setFormError(prev => ({ ...prev, pickupLocationError: "Please enter valid location" }));
        }
        if (!bookingDetails.drop && confirmedServiceTypeId !== "btn3") {
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
        if (!bookingDetails.package && confirmedServiceTypeId === "btn3") {
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

    return (
        <React.Fragment>
            <div className='booking-main'>
                <div className='booking-sub'>
                    {page === 0 && (
                        <div style={{ padding: "5% 15%", display: "flex", flexDirection: "column", gap: "15px" }}>
                            <TextField className="standard-basic" defaultValue={guestDetails.name} error={formError.guestNameError} helperText={formError.guestNameError} onBlur={(e) => guestDetails.name = e.target.value} onChange={(e) => { if (e.target.value) { isError = false; setFormError(prev => ({ ...prev, guestNameError: "" })) } }} label="Guest Name" variant="standard" inputRef={guestNameInputRef} autoComplete='off' />
                            <TextField className="standard-basic" defaultValue={guestDetails.number} error={formError.guestNumberError} helperText={formError.guestNumberError} onBlur={(e) => guestDetails.number = e.target.value} onChange={(e) => { if (e.target.value) { isError = false; setFormError(prev => ({ ...prev, guestNumberError: "" })) } }} label="Guest Mobile Number" variant="standard" inputRef={guestNumberInputRef} autoComplete='off' />
                            <Button style={{ marginTop: "40px" }} variant="contained" onClick={guestDetailsNextButtonClickHandler} disabled={false} >Next</Button>
                        </div>
                    )
                    }
                    {page !== 0 &&
                        <MdOutlineArrowBack className='backArrow' onClick={() => {
                            isError = false;
                            if (page === 2) setTimeout(() => (scheduleFilterBUttonClickHandler(confirmedServiceTypeId, true)), 1000);
                            setPage(prev => prev - 1);
                        }
                        } />
                    }
                    {page === 1 &&
                        (
                            <div style={{ height: "100%", width: "100%" }}>
                                <div className='schedule_filter_buttons' onClick={(e) => scheduleFilterBUttonClickHandler(e.target?.id)} >
                                    <Button variant='contained' id="btn1" style={{ backgroundColor: "rgba(34, 137, 203, 255)", width: "180px" }} >Airport Transfer</Button>
                                    <Button variant='contained' id="btn2" style={{ backgroundColor: "rgba(42, 149, 69, 255)", width: "180px" }} >OutStation</Button>
                                    <Button variant='contained' id="btn3" style={{ backgroundColor: "rgba(245, 174, 48, 255)", width: "180px" }} >Rental</Button>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "10px" }} >
                                    <TextField id="pac-input1" defaultValue={bookingDetails.pickup} error={formError.pickupLocationError} helperText={formError.pickupLocationError} onBlur={(e) => bookingDetails.pickup = e.target.value} onChange={(e) => { if (e.target.value) { isError = false; setFormError(prev => ({ ...prev, pickupLocationError: "" })) } }} className="standard-basic" label="Pickup Location" variant="standard" inputRef={pickupInputRef} autoComplete='off' />
                                    {/* {selectedServiceTypeId !== "btn3" && */}
                                    <TextField id="pac-input2" style={{ display: selectedServiceTypeId === "btn3" ? "none" : "" }} defaultValue={bookingDetails.drop} error={formError.dropLocationEror} helperText={formError.dropLocationEror} onBlur={(e) => bookingDetails.drop = e.target.value} onChange={(e) => { if (e.target.value) { isError = false; setFormError(prev => ({ ...prev, dropLocationEror: "" })) } }} className="standard-basic" label="Drop Location" variant="standard" inputRef={dropInputRef} autoComplete='off' />
                                    {/* } */}
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
                                    {selectedServiceTypeId === "btn3" &&
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
                                    <h5>{selectedServiceTypeId === "btn3" ? "Package" : "Drop"}</h5>
                                    <p style={{ color: "rgb(130,130,130)", fontSize: "10.5px", marginTop: "2px" }} >{selectedServiceTypeId === "btn3" ? packageType : bookingDetails.drop}</p>
                                </div>
                            </div>
                            <Button style={{ marginTop: "40px" }} variant="contained" onClick={() => setIsConfirmRide(true)} >Confirm & Book</Button>
                        </div>
                    }
                </div>
            </div >
            {isLoading && <img src={loadingGif} className="loading-gif" />}
            {isBookingSuccess && <Message type={isBookingSuccess} message="Your booking has been successful" />}
        </React.Fragment>
    )
}

export default NewBooking;