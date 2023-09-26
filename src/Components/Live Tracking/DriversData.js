import React, { useEffect, useState } from "react";
import useHttp from "../../Hooks/use-http";
import LiveMap from "./LiveTracking";

let rider_data = [];
const DriverData = (props) => {
  const [driverData, setDriverData] = useState([]);

  if (sessionStorage.getItem("interval")) {
    clearInterval(sessionStorage.getItem("interval"));
    sessionStorage.removeItem("interval");
  }

  const driverList = (data) => {
    let collectedDriverData = [];
    if (data.RidersList?.length > 0) {
      rider_data = data.RidersList;
      rider_data.push({
        mobileNumber: "",
        OfficialName: "Guest"
      })
    }
    for (let i = 0; i < data.DriverList?.length; i++) {
      collectedDriverData.push({
        driverName: data.DriverList[i].DriverName,
        driverEmail: data.DriverList[i].DriverEmailID,
        carNumber: data.DriverList[i].CarNumber,
        driverImage: data.DriverList[i].DriverImage,
        vehicleType: data.DriverList[i].VehicleTypes?.toLowerCase().includes("basic") ? "BASIC" : (data.DriverList[i].VehicleTypes.toLowerCase().includes("+") ? "COMFORT+" : "COMFORT"),
        carModel: data.DriverList[i].CarModel,
        carColor: data.DriverList[i].Color,
        isOnline: data.DriverList[i].IsOnline,
        isOnTrip: data.DriverList[i].IsOnline == "1" ? data.DriverList[i].LiveStatus : "0",
        isShiftStarted: data.DriverList[i].IsShiftStarted,
        activeShiftCororateName: data.DriverList[i].CorporateName,
        activeShiftCorporateId: data.DriverList[i].CorporateID,
        tripType: data.DriverList[i].TripType
      });
    }
    setDriverData(collectedDriverData);
  };

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    sendRequest(
      {
        url: "/api/v1/DriverList/DriverListV2",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          emailID: sessionStorage.getItem("user"),
          roleID: sessionStorage.getItem("roleId"),
          corporateID: sessionStorage.getItem("roleId") === "1" ? "" : sessionStorage.getItem("corpId"),
          isRider: "0",
          isDriver: "1"
        },
      },
      driverList
    );
  }, [sendRequest]);

  return (
    <LiveMap
      driverData={driverData}
      isLoading={isLoading}
      riderData={rider_data}
      toggle={props.toggle}
    />
  );
};

export default DriverData;
