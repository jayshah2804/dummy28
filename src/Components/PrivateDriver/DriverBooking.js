import React from "react";
import "./DriverBooking.css";

const DriverBooking = (props) => {
  console.log(props.bookedDriver);
  return (
    <div className="driverBooking-container">
      <header>
        <div className="driverInfo">
          <img src={props.bookedDriver[0].driverImage}></img>
          <div>{props.bookedDriver[0].driverEmail}</div>
        </div>
        <div className="carInfo">
          <div>{props.bookedDriver[0].carNumber}</div>
          {/* <div>{props.bookedDriver[0].carType}</div> */}
          <div>Comfort</div>
        </div>
      </header>
      <button onClick={() => props.setBookedDriver(false)}>Cancel</button>
    </div>
  );
};

export default DriverBooking;
