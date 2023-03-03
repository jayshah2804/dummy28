import React, { useEffect, useRef, useState } from 'react';
import useHttp from '../Hooks/use-http';
import generatePDF from './generatePdf';
import "./Modal.css";

let drivers = [];
let riders = [];
let selectedDriverData = {
    name: "",
    email: "",
}
let selectedRiderData = {
    name: "",
    number: ""
}
let searchedDriverEmail = "";
let searchedRiderNumber = "";
const Modal = (props) => {
    const [searchedRiderData, setSearchedRiderData] = useState([]);
    const [searchedDriverData, setSearchedDriverData] = useState([]);
    const [isGeneratePdfClicked, setIsGeneratePdfClicked] = useState(false);
    const startDateRef = useRef();
    const endDateRef = useRef();
    const riderInputSearchRef = useRef();
    const driverInputSearchRef = useRef();

    const authenticateUser = (data) => {
        if (isGeneratePdfClicked) {
            // console.log(data.TripdetailList, "trip");
            if (data.TripdetailList)
                generatePDF(data.TripdetailList, props.heading, selectedRiderData.name, selectedDriverData.name);
            else alert("No data available for selected fields");
            setIsGeneratePdfClicked(false);
        }
        else {
            drivers = [];
            riders = [];
            for (let i = 0; i < data.RidersList?.length; i++) {
                riders.push({
                    name: data.RidersList[i].OfficialName,
                    number: data.RidersList[i].MobileNumber
                });
            }
            for (let i = 0; i < data.PrivetDriverlist?.length; i++) {
                drivers.push({
                    name: data.PrivetDriverlist[i].DriverName,
                    email: data.PrivetDriverlist[i].DriverEmailID
                });
            }
            console.log(drivers, riders);
        }
    };

    const { isLoading, sendRequest } = useHttp();

    useEffect(() => {
        sendRequest(
            {
                url: "/api/v1/DriverList/GetPrivateDriverList",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    emailID: sessionStorage.getItem("user"),
                    userType: "corporate",
                },
            },
            authenticateUser
        );
    }, [sendRequest]);

    useEffect(() => {
        function formatToMMDDYYYYfromYYYYMMDD(inputDate) {
            var date = new Date(inputDate);
            return (
                date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
            );
        }
        if (isGeneratePdfClicked) {
            // debugger;
            let startDate = startDateRef.current.value ? formatToMMDDYYYYfromYYYYMMDD(startDateRef.current.value) : "";
            let endDate = endDateRef.current.value ? formatToMMDDYYYYfromYYYYMMDD(endDateRef.current.value) : "";
            sendRequest(
                {
                    url: "/api/v1/Report/ShuttleTripReport",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: {
                        emailID: "sjay2804@gmail.com",
                        driverEmailID: selectedDriverData.email,
                        fromDate: startDate ? startDate : "2018/01/01",
                        toDate: endDate ? endDate : "2023/03/02",
                        riderMobileNumber: selectedRiderData.number,
                        corporateID: sessionStorage.getItem("corpId"),
                        isPrivateTrip: true
                    },
                },
                authenticateUser
            );
        }

    }, [isGeneratePdfClicked]);

    const riderSearchHandler = () => {
        if (riderInputSearchRef.current.value) {
            setSearchedRiderData(riders.filter(rider => rider.name.toLowerCase().includes(riderInputSearchRef.current.value.toLowerCase())));
        }
        else {
            selectedRiderData.name = "";
            selectedRiderData.number = "";
            setSearchedRiderData([])
        };
    }

    const driverSearchHandler = () => {
        if (driverInputSearchRef.current.value) {
            setSearchedDriverData(drivers.filter(driver => driver.name.toLowerCase().includes(driverInputSearchRef.current.value.toLowerCase())));
        }
        else {
            selectedDriverData.name = "";
            selectedDriverData.email = "";
            setSearchedDriverData([])
        };
    }

    const generatePdfClickHandler = () => {
        setIsGeneratePdfClicked(true);
        // generatePDF(props.data, props.heading);
    }

    // const riderSelectedHandler = (e) => {
    //     riderInputSearchRef.current.value = e.target.innerText;
    //     searchedRiderNumber = rider.number;
    //     setSearchedRiderData([]);
    // }

    return (
        <div className='generatePdf-container'>
            <header>
                <span>Report</span>
                <span style={{ cursor: "pointer" }} onClick={() => props.setIsExportButtonClicked(false)}>X</span>
            </header>
            <div className='generatePdf-subContainer'>
                <main>
                    {isLoading && isGeneratePdfClicked && (
                        <React.Fragment>
                            <div class="wrapper">
                                <div class="progressbar">
                                    {/* <div class="stylization"></div> */}
                                </div>
                                <span
                                    id="progressBarText"
                                    style={{
                                        display: "inline-block",
                                        zIndex: "999",
                                        width: "100%",
                                        textAlign: "center",
                                    }}
                                >
                                    Generating Your Pdf ...
                                </span>
                                <br />
                            </div>
                        </React.Fragment>
                    )}
                    {/* <div>Select Date:</div> */}
                    <label htmlFor='startDate'>Start Date: </label>
                    <input
                        type="date"
                        ref={startDateRef}
                        id="startDate"
                    />
                    <br />
                    <label htmlFor='startDate'>End Date: </label>
                    <input
                        type="date"
                        ref={endDateRef}
                        id="endDate"
                    />
                    <br />
                    <div style={{ position: "relative" }}>
                        <label htmlFor='searchRider'>Rider: </label>
                        <input type="text" id='searchRider' onChange={riderSearchHandler} ref={riderInputSearchRef} />
                        {searchedRiderData && (
                            <div className='searchedRiders'>
                                {searchedRiderData.map(rider => <p onClick={(e) => {
                                    riderInputSearchRef.current.value = e.target.innerText;
                                    selectedRiderData.name = rider.name;
                                    selectedRiderData.number = rider.number;
                                    setSearchedRiderData([]);
                                }} >{rider.name + " ( " + rider.number + " )"}</p>)}
                            </div>
                        )
                        }
                    </div>
                    {/* <br /> */}
                    <label htmlFor='searchDriver'>Driver: </label>
                    <input type="text" id='searchDriver' onChange={driverSearchHandler} ref={driverInputSearchRef} />
                    {searchedDriverData && (
                        <div className='searchedRiders'>
                            {searchedDriverData.map(driver => <p onClick={(e) => {
                                driverInputSearchRef.current.value = e.target.innerText;
                                selectedDriverData.name = driver.name;
                                selectedDriverData.email = driver.email;
                                setSearchedDriverData([]);
                            }
                            } >{driver.name}</p>)}
                        </div>
                    )
                    }
                    <br />
                </main>
                <footer>
                    <button onClick={generatePdfClickHandler} >Generate Pdf</button>
                </footer>
            </div>
        </div>
    )
}

export default Modal