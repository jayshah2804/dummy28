import React, { useEffect, useState } from "react";
import useHttp from "../../Hooks/use-http";
import LiveMap from "./LiveMap";

let driver_data = [];

const DriverData = () => {
  const [driverData, setDriverData] = useState([]);

  if (sessionStorage.getItem("interval")) {
    clearInterval(sessionStorage.getItem("interval"));
    sessionStorage.removeItem("interval");
  }

  const authenticateUser = (data) => {
    console.log(data);
    let collectedDriverData = [];
    for (let i = 0; i < data.PrivetDriverlist?.length; i++) {
      collectedDriverData.push({
        driverName: data.PrivetDriverlist[i].DriverName,
        driverEmail: data.PrivetDriverlist[i].DriverEmailID,
        carNumber: data.PrivetDriverlist[i].CarNumber,
        driverImage: data.PrivetDriverlist[i].DriverImage,
        vehicleType: data.PrivetDriverlist[i].VehicleType,
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
          //   emailID: "sjay2804@gmail.com",
          userType: "corporate",
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
    />
  );
};

export default DriverData;
