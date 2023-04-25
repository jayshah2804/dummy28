import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import "./ShiftCreation.css";
import useHttp from '../../../Hooks/use-http';
import { GrFormNext } from "react-icons/gr";
import DatePicker from "react-multi-date-picker";
import { MdEdit } from "react-icons/md";
import transition from "react-element-popper/animations/transition";
import ShiftMap from './ShiftMap';
import loadingGif from "../../../Assets/loading-gif.gif";
import Message from "../../../Modal/Message";
import { AiOutlineDelete } from "react-icons/ai";

let corporates;
let drivers;
let selectedDepartment = {};
let selectedDriver = {};
var autocomplete = "";
let shiftData = [];
let marker;
let errorFileds = {
    coprorateNameError: "",
    departmentNameError: "",
    driverNameError: "",
    roMobileError: "",
    rpLocationError: "",
}

const ShiftCreation = () => {
    const corporateNameRef = useRef();
    const departmentNameRef = useRef();
    const driverNameRef = useRef();
    const reportingOfficerMobileInputRef = useRef();
    const rpLocationInputRef = useRef();
    const [filteredCorporates, setIsFilteredCorporates] = useState([]);
    const [filteredDrivers, setIsFilteredDrivers] = useState([]);
    const [isGetDriverData, setIsGetDriverData] = useState(sessionStorage.getItem("roleId") === "1" ? false : true);
    const [isNextClicked, setIsNextClicked] = useState(false);
    const [dateValues, setDateValues] = useState([]);
    const [shiftTimings, setShiftTimings] = useState([]);
    const [isShiftSaveClicked, setIsShiftSaveClicked] = useState(false);
    const [isShiftCreationSuccess, setIsShiftCreationSuccess] = useState(false);
    const [formError, setFormError] = useState(errorFileds);
    const shiftStartTimeInputRef = useRef();
    const shiftEndTimeInputRef = useRef();

    useEffect(() => {
        const script = document.createElement("script");
        script.src =
            "https://maps.googleapis.com/maps/api/js?key=AIzaSyAq88vEj-mQ9idalgeP1IuvulowkkFA-Nk&callback=initMap&libraries=places&v=weekly";
        script.async = true;

        document.body.appendChild(script);
    }, [isNextClicked]);

    function initMap() {
        var map = new window.google.maps.Map(document.getElementById("shift-map"), {
            center: { lat: 23.0225, lng: 72.5714 },
            zoom: 11,
            disableDefaultUI: true,
            fullscreenControl: true,
            zoomControl: true
        });
        marker = new window.google.maps.Marker({
            position: "",
            map: map,
            animation: window.google.maps.Animation.DROP,
        });
        let input = document.getElementById("pac-input");
        autocomplete = new window.google.maps.places.Autocomplete(input, { componentRestrictions: { country: ["in"] } });
        marker.setVisible(false);
        // let place = autocomplete.getPlace();
        autocomplete.bindTo("bounds", map);
        autocomplete.addListener("place_changed", function () {
            // debugger;
            map.setCenter(autocomplete.getPlace().geometry.location);
            map.setZoom(18);
            marker.setPosition(autocomplete.getPlace().geometry.location);
            marker.setVisible(true);
        });
        // console.log(place.geometry.location);
    }
    window.initMap = initMap;

    const getCorporateList = (data) => {
        corporates = data.CorporateList;
    }

    const getDriverList = (data) => {
        drivers = data.DriverList;
        setIsGetDriverData(false);
    }

    const shiftCreationResponse = (data) => {
        // debugger;
        console.log(data);
        setIsShiftCreationSuccess(data.Message.toLowerCase() === "success" ? "success" : data.SystemMessage);
        setIsShiftSaveClicked(false);
    }

    useEffect(() => {
        if (isGetDriverData) {
            sendRequest(
                {
                    url: "/api/v1/DriverList/GetDriverList",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: {
                        emailID: sessionStorage.getItem("user"),
                        corporateID: sessionStorage.getItem("adminDepartmentID"),
                        roleID: sessionStorage.getItem("roleId")
                    },
                },
                getDriverList
            );
        }
        if (isShiftSaveClicked) {
            let detailsRecord = [];
            for (let i = 0; i < shiftTimings.length; i++) {
                detailsRecord.push({
                    StartTime: shiftTimings[i].startDate + " " + shiftTimings[i].startTime,
                    EndTime: shiftTimings[i].endDate + " " + shiftTimings[i].endTime
                })
            }
            sendRequest(
                {
                    url: "/api/v1/DriverShift/AddEditDriverShift",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: {
                        emailID: sessionStorage.getItem("user"),
                        corporateID: selectedDepartment.dptId ? selectedDepartment.dptId : sessionStorage.getItem("adminDepartmentID"),
                        detailsRecord: JSON.stringify(detailsRecord),
                        driverEmailID: selectedDriver.email,
                        reportingMobileNo: reportingOfficerMobileInputRef.current.value,
                        reportingLL: marker.getPosition().lat() + "," + marker.getPosition().lng(),
                        reportingLocaiton: autocomplete.getPlace().name
                    },
                },
                shiftCreationResponse
            );
        }
    }, [isGetDriverData, isShiftSaveClicked]);

    useEffect(() => {
        if (sessionStorage.getItem("roleId") === "1") {
            sendRequest(
                {
                    url: "/api/v1/Corporate/GetAllDepartmentByCorporate",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: {
                        emailID: sessionStorage.getItem("user")
                    },
                },
                getCorporateList
            );
        } else {
            corporateNameRef.current.value = sessionStorage.getItem("cpName");
            corporateNameRef.current.disabled = true;
            departmentNameRef.current.disabled = true;
        }
        departmentNameRef.current.value = "Admin Department";
    }, []);

    const { isLoading, sendRequest } = useHttp();

    const driverSearchHandler = (e) => {
        if (e.target.value)
            setIsFilteredDrivers(drivers?.filter(data =>
                data.DriverName.toLowerCase().includes(e.target.value) || data.Model.toLowerCase().includes(e.target.value)));
        else setIsFilteredDrivers([]);
    }

    const corporateSearchHandler = (e) => {
        if (e.target.value)
            setIsFilteredCorporates(corporates?.filter(data => data.CorporateName.toLowerCase().includes(e.target.value)));
        else setIsFilteredCorporates([]);
    }

    const corporateSelectHandler = (cpName, dptNames, dptIds) => {
        corporateNameRef.current.value = cpName;
        if (dptNames.toLowerCase().includes("admin")) {
            let departmets = dptNames.toLowerCase().split(",");
            let indexOf = departmets.indexOf("admin department");
            selectedDepartment.name = departmets[indexOf];
            selectedDepartment.dptId = dptIds[indexOf];
        }
        else {
            let departmets = dptNames.toLowerCase().split(",");
            let indexOf = departmets.indexOf("imitation department");
            selectedDepartment.name = departmets[indexOf];
            selectedDepartment.dptId = dptIds[indexOf];
        }
        setFormError(prev => ({ ...prev, coprorateNameError: "" }));
        departmentNameRef.current.value = selectedDepartment.name;
        setIsFilteredCorporates([]);
    }

    const driverSelectHandler = (drName, drEmail) => {
        selectedDriver.name = drName;
        selectedDriver.email = drEmail;
        driverNameRef.current.value = drName;
        setFormError(prev => ({ ...prev, driverNameError: "" }));
        setIsFilteredDrivers([]);
    }

    const calenderCloseHandler = () => {
        // let newDetails = structuredClone(dateValues);
        for (let i = 0; i < dateValues.length; i++) {
            if (!shiftData[i]) shiftData[i] = {};
            shiftData[i].startDate = dateValues[i].year + "-" + (dateValues[i].month.toString().length === 1 ? ("0" + dateValues[i].month) : dateValues[i].month) + "-" + (dateValues[i].day.toString().length === 1 ? ("0" + dateValues[i].day) : dateValues[i].day);
            shiftData[i].endDate = + dateValues[i].year + "-" + (dateValues[i].month.toString().length === 1 ? ("0" + dateValues[i].month) : dateValues[i].month) + "-" + (dateValues[i].day.toString().length === 1 ? ("0" + dateValues[i].day) : dateValues[i].day);
        }
        console.log(shiftData);
    }

    const startTimePickerCloseHandler = () => {
        for (let i = 0; i < dateValues.length; i++) {
            shiftData[i].startTime = shiftStartTimeInputRef.current.value;
        }
    }

    const endTimePickerCloseHandler = () => {
        for (let i = 0; i < dateValues.length; i++) {
            shiftData[i].endTime = shiftEndTimeInputRef.current.value;
        }
        console.log(shiftData);
    }

    const shiftRowCancelHandler = (i) => {
        shiftData.filter((val, index) => index !== i);
        setShiftTimings(prev => prev.filter((val, index) => index !== i));
        setDateValues(prev => prev.filter((val, index) => index !== i));
    }

    const shiftRowValueChangeHandler = (e, i) => {
        // debugger;
        let a = structuredClone(shiftTimings);
        a[i][e.target.name] = e.target.value;
        console.log(a);
        setShiftTimings(a);
        shiftData = a;
        // console.log(e.targetIndex);
    }

    const addShiftDetailsClickHandler = () => {
        // debugger;
        for (let i = 0; i < shiftData.length; i++) {
            if (!shiftData[i].startDate || !shiftData[i].startTime || !shiftData[i].endDate || !shiftData[i].endTime) {
                return;
            }
        }
        let a = structuredClone(shiftData);
        setShiftTimings(a);
    }

    const corporateNameChangeHandler = () => {
        if (corporateNameRef.current.value) {
            setFormError(prev => ({ ...prev, coprorateNameError: "" }));
        }
    }

    const departmentNameChangeHandler = () => {
        if (departmentNameRef.current.value) {
            setFormError(prev => ({ ...prev, departmentNameError: "" }));
        }
    }

    const roMobileNumberChangeHandler = () => {
        if (reportingOfficerMobileInputRef.current.value) {
            setFormError(prev => ({ ...prev, roMobileError: "" }));
        }
    }

    const rpLocationChangeHandler = () => {
        if (rpLocationInputRef.current.value) {
            setFormError(prev => ({ ...prev, rpLocationError: "" }));
        }
    }

    const nextSlideClickHandler = () => {
        if (!corporateNameRef.current.value) {
            setFormError(prev => ({ ...prev, coprorateNameError: "Invalid Corporate Name" }));
        }
        if (!departmentNameRef.current.value) {
            setFormError(prev => ({ ...prev, departmentNameError: "Invalid Department Name" }));
        }
        if ((!reportingOfficerMobileInputRef.current.value) || reportingOfficerMobileInputRef.current.value.length !== 10) {
            setFormError(prev => ({ ...prev, roMobileError: "Invalid Mobile Number" }));
        }
        if (!rpLocationInputRef.current.value) {
            setFormError(prev => ({ ...prev, rpLocationError: "Invalid Reporting Location" }));
        }
        if (!driverNameRef.current.value) {
            setFormError(prev => ({ ...prev, driverNameError: "Invalid Driver Name" }));
        }
        if ((corporateNameRef.current.value && departmentNameRef.current.value && reportingOfficerMobileInputRef.current.value && rpLocationInputRef.current.value && driverNameRef.current.value)) {
            setIsNextClicked(true);
        }
    }

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <div style={{ textTransform: "uppercase", fontWeight: "bold", padding: "1% 2%", fontSize: "18px" }}>Private Driver Shift Creation</div>
            <div className='shift-container'>
                <div className='shift-general-details'>
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "5%" }}>
                        <TextField className="standard-basic" error={formError.coprorateNameError ? true : false} helperText={formError.coprorateNameError} label="Corporate" variant="standard" inputRef={corporateNameRef} onChange={corporateSearchHandler} />
                        {filteredCorporates && (
                            <div>
                                {filteredCorporates.map(cp => <p onClick={() => corporateSelectHandler(cp.CorporateName, cp.DepartmentName, cp.DepartmentID)}>{cp.CorporateName}</p>)}
                            </div>
                        )}
                        <TextField className="standard-basic" onChange={departmentNameChangeHandler} error={formError.departmentNameError ? true : false} helperText={formError.departmentNameError} label="Department" variant="standard" inputRef={departmentNameRef} />
                        <div style={{ position: "relative" }}>
                            <TextField className="standard-basic" error={formError.driverNameError ? true : false} helperText={formError.driverNameError} label="Driver Details" variant="standard" onChange={driverSearchHandler} inputRef={driverNameRef} autoComplete='off' />
                            {filteredDrivers?.length > 0 && (
                                <div className='searchedDriverList'>
                                    {filteredDrivers.map(dr => <p onClick={() => driverSelectHandler(dr.DriverName, dr.DriverEmailID)}>{dr.DriverName + " (" + dr.Model + " )"}</p>)}
                                </div>
                            )}
                        </div>
                        <TextField className="standard-basic" onChange={roMobileNumberChangeHandler} error={formError.roMobileError ? true : false} helperText={formError.roMobileError} label="Reporting Officer Mobile Number" variant="standard" inputRef={reportingOfficerMobileInputRef} />
                        <TextField className="standard-basic" onChange={rpLocationChangeHandler} error={formError.rpLocationError ? true : false} helperText={formError.rpLocationError} label="Reporting Location" id="pac-input" variant="standard" inputRef={rpLocationInputRef} />
                    </div>
                    <div style={{ alignSelf: "flex-end", marginTop: "30px" }}>
                        <button style={{ backgroundColor: "rgba(34, 137, 203, 255)", width: "80px", color: "white", border: "1px solid rgba(34, 137, 203, 255)", padding: "7px 15px", borderRadius: "10px", cursor: "pointer" }} onClick={nextSlideClickHandler}>Next</button>
                    </div>
                </div>
                <div className="shift-timing-details">
                    {!isNextClicked ?
                        <ShiftMap /> :
                        (
                            <div style={{ backgroundColor: "#f3f6f9", width: "100%", height: "100%" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", margin: "0 2%" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", alignItems: "center" }} >
                                        <DatePicker
                                            multiple
                                            format="YYYY-MM-DD"
                                            onChange={(data) => {
                                                setDateValues(data);
                                                if (shiftTimings.length > 0) {
                                                    shiftStartTimeInputRef.current.value = "";
                                                    shiftEndTimeInputRef.current.value = "";
                                                }
                                            }}
                                            sort
                                            onClose={calenderCloseHandler}
                                            // inputClass="custom-input"
                                            style={{ border: "none", height: "30px", paddingLeft: "7px", borderRadius: "5px", width: "150px" }}
                                            editable={false}
                                            placeholder='Select Date'
                                        />
                                        <input className='jay' style={{ border: "none", height: "30px", paddingLeft: "7px", borderRadius: "5px", width: "150px" }} type="text" placeholder='Start Time' onChange={startTimePickerCloseHandler} ref={shiftStartTimeInputRef} onFocus={(e) => e.target.type = "time"} onBlur={(e) => e.target.type = "text"} />
                                        <input className='jay' style={{ border: "none", height: "30px", paddingLeft: "7px", borderRadius: "5px", width: "150px" }} type="text" placeholder='End Time' onChange={endTimePickerCloseHandler} ref={shiftEndTimeInputRef} onFocus={(e) => e.target.type = "time"} onBlur={(e) => e.target.type = "text"} />
                                    </div>
                                    <button className='addShiftDetails' onClick={addShiftDetailsClickHandler}>Add Details</button>
                                </div>
                                <div style={{ background: "white", height: "90%", margin: "2%", borderRadius: "10px", display: "flex", flexDirection: "column", justifyContent: "space-between" }} >
                                    <div style={{ height: "auto" }}>
                                        <br />
                                        <div className='shiftDetailsHeader' style={{ display: "flex", justifyContent: "space-evenly", height: "40px", alignItems: "center", backgroundColor: "rgba(235, 237, 240, 0.34)", margin: "0 2%", borderRadius: "10px" }}>
                                            <div>StartDate</div>
                                            <div>StartTime</div>
                                            <div>EndDate</div>
                                            <div>EndTime</div>
                                        </div>
                                        <div className='shiftTimingsContainer'>
                                            {shiftTimings?.map((val, index) =>
                                                <React.Fragment>
                                                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                                        <div className='shiftDetailsRow' style={{ width: "99%" }} id={index + "date"} onChange={(e) => shiftRowValueChangeHandler(e, index)} >
                                                            <input name="startDate" type="date" value={val.startDate} />
                                                            <input name="startTime" value={val.startTime} style={{ color: "rgba(42, 149, 69, 255)", backgroundColor: "rgba(42, 149, 69, 0.14)", padding: "7px 15px", borderRadius: "10px" }} type="text" onFocus={(e) => e.target.type = "time"} onBlur={(e) => e.target.type = "text"} />
                                                            <input name="endDate" value={val.endDate} type="date" />
                                                            <input name="endTime" value={val.endTime} style={{ color: "rgb(226, 44, 29)", backgroundColor: "rgba(226, 44, 29, 0.14)", padding: "7px 15px", borderRadius: "10px" }} type="text" onFocus={(e) => e.target.type = "time"} onBlur={(e) => e.target.type = "text"} />
                                                            {/* <p onClick={() => shiftRowCancelHandler(index)}>X</p> */}
                                                            {/* <MdEdit onClick={() => shiftRowEditHandler(index)} /> */}
                                                        </div>
                                                        <AiOutlineDelete style={{ marginTop: "10px", marginRight: "20px", cursor: "pointer" }} onClick={() => shiftRowCancelHandler(index)} />
                                                    </div>
                                                    < hr style={{ margin: "2%", borderTop: "#f3f6f9" }} />
                                                </React.Fragment>
                                            )}
                                        </div>
                                    </div>
                                    <button className='shiftSaveButton' onClick={() => setIsShiftSaveClicked(true)} >Save</button>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            {isLoading && isShiftSaveClicked && <img src={loadingGif} className="loading-gif" />}
            {console.log(isShiftCreationSuccess)}
            {isShiftCreationSuccess && <Message type={isShiftCreationSuccess} driveErrorMessage={isShiftCreationSuccess?.toLowerCase()?.includes("greater") ? "Shift End Time should be greater than Current Time/ Start Time" : ""} message={selectedDriver.name + "'s shift has been created Successfully"} />}
        </div >
    )
}

export default ShiftCreation