import React, { useEffect } from "react";
import { useState } from "react";
import useHttp from "../../Hooks/use-http";
import "./DriverBooking.css";

let autocomplete = [];
const DriverBooking = (props) => {
  const [isDriverBookingClicked, setIsDriverBookingClicked] = useState(false);

  const authenticateUser = (data) => {
    console.log(data);
  };

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    isDriverBookingClicked &&
      sendRequest({
        url: "/api/v1/Dispatch/GetShuttleTrips",
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
        }
      }, authenticateUser);
  }, [sendRequest, isDriverBookingClicked]);


  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyAq88vEj-mQ9idalgeP1IuvulowkkFA-Nk&callback=initMap&libraries=places&v=weekly";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  function initMap() {
    var input1 = document.getElementById("pac-input1");
    var input2 = document.getElementById("pac-input2");
    autocomplete[0] = new window.google.maps.places.Autocomplete(input1);
    autocomplete[1] = new window.google.maps.places.Autocomplete(input2);
  }
  window.initMap = initMap;

  const tripBookClicked = () => {
    setIsDriverBookingClicked(true);
    // console.log(autocomplete[0].getPlace().geometry.location.lat());
  }

  return (
    <div className="driverBooking-container">
      <header>
        <div className="driverInfo">
          <img src={props.bookedDriver[0].driverImage}></img>
          <div>{props.bookedDriver[0].driverEmail}</div>
        </div>
        <div className="carInfo">
          <div style={{ fontSize: "13px" }} >{props.bookedDriver[0].carNumber}</div>
          {/* <div style={{fontSize: "12px", color: "grey"}}>{props.bookedDriver[0].carType && "Car Type: " + props.bookedDriver[0].carType}</div> */}
          <div style={{ fontSize: "12px", color: "grey" }}>Car Type: Comfort</div>
        </div>
      </header>
      <main>
        <input type="text" disabled value="City: Ahmedabad" className="tags" />
        <input type="text" id="pac-input1" placeholder="Pickup Address" className="tags" />
        <input type="text" id="pac-input2" placeholder="Drop Address" className="tags" />
      </main>
      <footer>
        <button onClick={() => props.setBookedDriver(false)}>Cancel</button>
        <button onClick={tripBookClicked} >Book Now</button>
      </footer>
    </div>
  );
};

export default DriverBooking;
