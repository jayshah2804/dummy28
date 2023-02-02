import React from 'react';
import "./LiveMap.css";
import photo from "../../Assets/admin.jpg";
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import useHttp from '../../Hooks/use-http';

const DUMMY_DATA = [
    {
        driverName: "Dharmik Gurav",
        carNumber: "GJ 01 AA 2343",
        status: "online",
    },
    {
        driverName: "Mahesh Gohil",
        carNumber: "GJ 01 AA 2343",
        status: "on trip",
    },
    {
        driverName: "Vivek Zala",
        carNumber: "GJ 01 AA 2343",
        status: "on trip",
    },
    {
        driverName: "Gautam Solanki",
        carNumber: "GJ 01 AA 2343",
        status: "",
    },
    {
        driverName: "Ketan Patel",
        carNumber: "GJ 01 AA 2343",
        status: "",
    },
    {
        driverName: "Gautam Solanki",
        carNumber: "GJ 01 AA 2343",
        status: "online",
    },
];

let driver_data = structuredClone(DUMMY_DATA);

const LiveMap = () => {
    const [filteredData, setFilteredData] = useState(DUMMY_DATA);
    const searchInputRef = useRef();


    const authenticateUser = (data) => {
        console.log(data);
    };

    const { isLoading, sendRequest } = useHttp();

    useEffect(() => {
        sendRequest({
            url: "/api/v1/DriverList/GetPrivateDriverList",
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                emailID: "nihal@little.global",
                userType: "corporate"
            }
        }, authenticateUser);
        // }
        // tripListFlag++;
    }, [sendRequest]);



    useEffect(() => {
        const script = document.createElement("script");
        script.src =
            "https://maps.googleapis.com/maps/api/js?key=AIzaSyAq88vEj-mQ9idalgeP1IuvulowkkFA-Nk&callback=myInitMap&libraries=places&v=weekly";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    function myInitMap() {
        var map = new window.google.maps.Map(document.getElementById("live-map"), {
            center: { lat: 23.0225, lng: 72.5714 },
            zoom: 11,
            disableDefaultUI: true,
            fullscreenControl: true,
            zoomControl: true
        });
    }

    window.myInitMap = myInitMap;

    const driverSearchHandler = (e) => {
        setFilteredData(driver_data.filter(data =>
            data.driverName?.toLowerCase().includes(e.target.value.toLowerCase()) ||
            data.carNumber?.toLowerCase().includes(e.target.value.toLowerCase())
        ));
    }

    const filterButtonClickHandler = (e) => {
        console.log(e.target.innerText);
        searchInputRef.current.value = "";
        if (e.target.innerText.toLowerCase() === "all")
            setFilteredData(driver_data);
        else if (e.target.innerText.toLowerCase() === "on trip")
            setFilteredData(driver_data.filter(data => data.status === e.target.innerText.toLowerCase()));
        else if (e.target.innerText.toLowerCase() === "online")
            setFilteredData(driver_data.filter(data => data.status === e.target.innerText.toLowerCase()));
    }

    return (
        <div className='main-container' id="privatedriver" >
            <div className='driverlist'>
                <h4>Driver List</h4>
                <div className='filter-buttons' onClick={filterButtonClickHandler} >
                    <button>All</button>
                    <button>Online</button>
                    <button>On Trip</button>
                    {/* <button><span>All</span><span>6</span></button>
                    <button><span>Online</span><span>2</span></button>
                    <button><span>On Trip</span><span>2</span></button> */}
                </div>
                <input type="text" className='search' onChange={driverSearchHandler} ref={searchInputRef} />
                <div className='driverDetails'>
                    <br />
                    {filteredData.map((ele, index) => {
                        return (
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                <div style={{ display: "flex", gap: "5px" }}>
                                    <img className='driverPhoto' src={photo} />
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <span className='drivername'>{ele.driverName}</span>
                                        <span className='carnumber'>{ele.carNumber}</span>
                                    </div>
                                </div>
                                <div className={ele?.status === "online" ? "online" : (ele.status === "on trip" ? "ontrip" : "")}></div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='livetrip' id="live-map" ></div>
        </div>
    )
}

export default LiveMap