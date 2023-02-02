import React from "react";
import "./LiveMap.css";
import photo from "../../Assets/admin.jpg";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import useHttp from "../../Hooks/use-http";
import DriverBooking from "./DriverBooking";

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

let driver_data = [];

const LiveMap = () => {
  const [filteredData, setFilteredData] = useState(DUMMY_DATA);
  const [driverData, setDriverData] = useState([]);
  const [bookedDriver, setBookedDriver] = useState(false);
  const searchInputRef = useRef();

  const authenticateUser = (data) => {
    console.log(data);
    let collectedDriverData = [];
    for (let i = 0; i < data.PrivetDriverlist.length; i++) {
      collectedDriverData.push({
        driverName: data.PrivetDriverlist[i].DriverName,
        driverEmail: data.PrivetDriverlist[i].DriverEmailID,
        carNumber: data.PrivetDriverlist[i].CarNumber,
        driverImage: data.PrivetDriverlist[i].DriverImage,
        status:
          data.PrivetDriverlist[i].LiveStatus == "1"
            ? "on trip"
            : data.PrivetDriverlist[i].IsOnline === true
            ? "online"
            : "",
      });
    }
    driver_data = structuredClone(collectedDriverData);
    setDriverData(collectedDriverData);
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
          emailID: "nihal@little.global",
          userType: "corporate",
        },
      },
      authenticateUser
    );
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
      zoomControl: true,
    });
  }

  window.myInitMap = myInitMap;

  const driverSearchHandler = (e) => {
    setDriverData(
      driver_data.filter(
        (data) =>
          data.driverName
            ?.toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          data.carNumber?.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const filterButtonClickHandler = (e) => {
    console.log(e.target.innerText);
    searchInputRef.current.value = "";
    if (e.target.innerText.toLowerCase() === "all") setDriverData(driver_data);
    else if (e.target.innerText.toLowerCase() === "on trip")
      setDriverData(
        driver_data.filter(
          (data) => data.status === e.target.innerText.toLowerCase()
        )
      );
    else if (e.target.innerText.toLowerCase() === "online")
      setDriverData(
        driver_data.filter(
          (data) => data.status === e.target.innerText.toLowerCase()
        )
      );
  };

  const bookButtonClickHandler = (e) => {
    // alert(e.target.parentElement.id);
    setBookedDriver(
      driverData.filter(
        (data) => data.driverEmail === e.target.parentElement.id
      )
    );
  };

  return (
    <React.Fragment>
      {bookedDriver && <div className="backdrop"></div>}
      <div className="main-container" id="privatedriver">
        <div className="driverlist">
          <h4>Driver List</h4>
          <div className="filter-buttons" onClick={filterButtonClickHandler}>
            <button>All</button>
            <button>Online</button>
            <button>On Trip</button>
          </div>
          <input
            type="text"
            className="search"
            onChange={driverSearchHandler}
            ref={searchInputRef}
          />
          <div className="driverDetails">
            <br />
            {driverData.map((ele, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  id={ele.driverEmail}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      <img className="driverPhoto" src={ele.driverImage} />
                      <p
                        className={
                          ele?.status === "online"
                            ? "online"
                            : ele.status === "on trip"
                            ? "ontrip"
                            : ""
                        }
                      ></p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span className="drivername">{ele.driverName}</span>
                      <span className="carnumber">{ele.carNumber}</span>
                    </div>
                  </div>
                  {ele.status === "online" && ele.status !== "on trip" && (
                    <button
                      className="bookButton"
                      onClick={bookButtonClickHandler}
                    >
                      Book
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="livetrip" id="live-map"></div>
      </div>
      {bookedDriver && <DriverBooking />}
    </React.Fragment>
  );
};

export default LiveMap;
