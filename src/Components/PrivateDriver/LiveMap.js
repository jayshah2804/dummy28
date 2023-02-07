import React from "react";
import "./LiveMap.css";
import photo from "../../Assets/admin.jpg";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import useHttp from "../../Hooks/use-http";
import DriverBooking from "./DriverBooking";
import Loading from "../../Loading/Loading";

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

const LiveMap = (props) => {
  const [filteredData, setFilteredData] = useState(DUMMY_DATA);
  const [bookedDriver, setBookedDriver] = useState(false);
  const searchInputRef = useRef();

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
    props.setDriverData(
      props.driver_data.filter(
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
    if (e.target.innerText.toLowerCase() === "all")
      props.setDriverData(props.driver_data);
    else if (e.target.innerText.toLowerCase() === "on trip")
      props.setDriverData(
        props.driver_data.filter(
          (data) => data.status === e.target.innerText.toLowerCase()
        )
      );
    else if (e.target.innerText.toLowerCase() === "online")
      props.setDriverData(
        props.driver_data.filter(
          (data) => data.status === e.target.innerText.toLowerCase()
        )
      );
  };

  const onTripDriverClickHandler = () => {
    
  } 

  const bookButtonClickHandler = (
    driverImage,
    driverEmail,
    carNumber,
    carType
  ) => {
    // alert(e.target.parentElement.id);
    console.log(driverEmail, carNumber, carType);
    setBookedDriver([
      {
        driverImage,
        driverEmail,
        carNumber,
        carType,
      },
    ]);
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
            {props.isLoading && <Loading driver="true" />}
            {props.driverData.length < 1 && !props.isLoading && (
              <div style={{ textAlign: "center" }}>No Drivers Available</div>
            )}
            {props.driverData.map((ele, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  id={ele.driverEmail}
                  className={ele.status === "on trip" ? "driverContainer" : ""}
                  onClick={() =>
                    onTripDriverClickHandler(ele.driverEmail, ele.status)
                  }
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
                      onClick={() =>
                        bookButtonClickHandler(
                          ele.driverImage,
                          ele.driverName,
                          ele.carNumber,
                          ele.vehicleType
                        )
                      }
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
      {bookedDriver && (
        <DriverBooking
          bookedDriver={bookedDriver}
          setBookedDriver={setBookedDriver}
        />
      )}
    </React.Fragment>
  );
};

export default LiveMap;
