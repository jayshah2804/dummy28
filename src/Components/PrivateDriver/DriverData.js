import React, { useEffect, useState } from "react";
import useHttp from "../../Hooks/use-http";
import LiveMap from "./LiveMap";

let driver_data = [];
let rider_data = [];

const DriverData = (props) => {
  const [driverData, setDriverData] = useState([]);

  if (sessionStorage.getItem("interval")) {
    clearInterval(sessionStorage.getItem("interval"));
    sessionStorage.removeItem("interval");
  }

  const authenticateUser = (data) => {
    let collectedDriverData = [];
    if (data.RidersList?.length > 0) {
      rider_data = data.RidersList;
      rider_data.push({
        mobileNumber: "",
        OfficialName: "Guest"
      })
    }
    for (let i = 0; i < data.PrivetDriverlist?.length; i++) {
      collectedDriverData.push({
        driverName: data.PrivetDriverlist[i].DriverName,
        driverEmail: data.PrivetDriverlist[i].DriverEmailID,
        carNumber: data.PrivetDriverlist[i].CarNumber,
        driverImage: data.PrivetDriverlist[i].DriverImage,
        vehicleType: data.PrivetDriverlist[i].VehicleType,
        carModel: data.PrivetDriverlist[i].CarModel,
        carColor: data.PrivetDriverlist[i].Color,
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
          emailID: sessionStorage.getItem("user"),
          roleID: sessionStorage.getItem("roleId"),
          corporateID: sessionStorage.getItem("roleId") === "1" ? "" : sessionStorage.getItem("corpId"),
          isRider: "1",
          isDriver: "1"
        },
      },
      authenticateUser
    );
  }, [sendRequest]);

  return (
    <LiveMap
      driverData={driverData}
      driver_data={driver_data}
      setDriverData={setDriverData}
      isLoading={isLoading}
      riderData={rider_data}
      toggle={props.toggle}
    />
  );
};

export default DriverData;
