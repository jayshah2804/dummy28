import React, { useEffect, useRef, useState } from "react";
import useHttp from "../Hooks/use-http";
import generatePDF from "./generatePdf";
import "./Modal.css";
// import { OpenSans } from './font-descriptors';

let drivers = [];
let riders = [];
let selectedDriverData = {
  name: "",
  email: "",
};
let selectedRiderData = {
  name: "",
  number: "",
};
let searchedDriverEmail = "";
let searchedRiderNumber = "";
const Modal = (props) => {
  const [searchedRiderData, setSearchedRiderData] = useState([]);
  const [searchedDriverData, setSearchedDriverData] = useState([]);
  const [isGeneratePdfClicked, setIsGeneratePdfClicked] = useState(false);
  const [generatePdfError, setGeneratePdfError] = useState(false);
  const startDateRef = useRef();
  const endDateRef = useRef();
  const riderInputSearchRef = useRef();
  const driverInputSearchRef = useRef();

  useEffect(() => {
    let date = new Date();
    startDateRef.current.defaultValue =
      date.getFullYear() +
      "-" +
      (+date.getMonth() + 1 > 9
        ? +date.getMonth() + 1
        : "0" + (+date.getMonth() + 1)) +
      "-" +
      "01";
    endDateRef.current.defaultValue =
      date.getFullYear() +
      "-" +
      (+date.getMonth() + 1 > 9
        ? +date.getMonth() + 1
        : "0" + (+date.getMonth() + 1)) +
      "-" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate());
  }, []);

  const authenticateUser = (data) => {
    if (isGeneratePdfClicked) {
      debugger;
      if (data?.TripdetailList || data?.DriverShiftList) {
        let totalKm = 0;
        for (let i = 0; i < data?.TripdetailList?.length; i++) {
          totalKm += +data.TripdetailList[i].TripDistance;
        }
        generatePDF(
          startDateRef.current.value,
          endDateRef.current.value,
          props.isShift == "1" ? data.DriverShiftList :data.TripdetailList,
          selectedRiderData.name,
          selectedDriverData.name,
          data.TripdetailList?.length,
          totalKm.toFixed(2),
          JSON.parse(data.CorporateLogo)[0].Image,
          document.getElementById("cpAddress").innerText,
          document.getElementById("cpAddress").clientWidth,
          props.isShift
        );
      } else {
        setGeneratePdfError(true);
        setTimeout(() => setGeneratePdfError(false), 4000);
      }
      setIsGeneratePdfClicked(false);
    } else {
      drivers = [];
      riders = [];
      for (let i = 0; i < data.RidersList?.length; i++) {
        riders.push({
          name: data.RidersList[i].OfficialName,
          number: data.RidersList[i].MobileNumber,
        });
      }
      for (let i = 0; i < data.PrivetDriverlist?.length; i++) {
        drivers.push({
          name: data.PrivetDriverlist[i].DriverName,
          email: data.PrivetDriverlist[i].DriverEmailID,
        });
      }
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
      let startDate = startDateRef.current.value
        ? formatToMMDDYYYYfromYYYYMMDD(startDateRef.current.value)
        : "";
      let endDate = endDateRef.current.value
        ? formatToMMDDYYYYfromYYYYMMDD(endDateRef.current.value)
        : "";
      sendRequest(
        {
          url: props.isShift != "1" ? "/api/v1/Report/ShuttleTripReport" : "/api/v1/DriverShift/DriverShiftDetailsReport",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: props.isShift != "1" ? {
            emailID: sessionStorage.getItem("user"),
            driverEmailID: selectedDriverData.email,
            fromDate: startDate ? startDate : "2018/01/01",
            toDate: endDate
              ? endDate
              : new Date()
                .getFullYear()
                .toString()
                .concat(
                  "-",
                  +new Date().getMonth() + 1,
                  "-",
                  new Date().getDate()
                ),
            riderMobileNumber: selectedRiderData.number,
            corporateID: sessionStorage.getItem("corpId"),
            isPrivateTrip: props.isPrivateDriver ? "1" : "0",
          } : {
            emailID: sessionStorage.getItem("user"),
            driverEmailID: selectedDriverData.email,
            roleID: "1",
            corporateID: sessionStorage.getItem("adminDepartmentID"),
            startDate: startDate ? startDate : "2018/01/01",
            endDate: endDate
              ? endDate
              : new Date()
                .getFullYear()
                .toString()
                .concat(
                  "-",
                  +new Date().getMonth() + 1,
                  "-",
                  new Date().getDate()
                )
          },
        },
        authenticateUser
      );
    }
  }, [isGeneratePdfClicked]);

  const riderSearchHandler = () => {
    if (riderInputSearchRef.current.value) {
      setSearchedRiderData(
        riders.filter((rider) =>
          rider.name
            .toLowerCase()
            .includes(riderInputSearchRef.current.value.toLowerCase())
        )
      );
    } else {
      selectedRiderData.name = "";
      selectedRiderData.number = "";
      setSearchedRiderData([]);
    }
  };

  const driverSearchHandler = () => {
    if (driverInputSearchRef.current.value) {
      setSearchedDriverData(
        drivers.filter((driver) =>
          driver.name
            .toLowerCase()
            .includes(driverInputSearchRef.current.value.toLowerCase())
        )
      );
    } else {
      selectedDriverData.name = "";
      selectedDriverData.email = "";
      setSearchedDriverData([]);
    }
  };

  const generatePdfClickHandler = () => {
    setIsGeneratePdfClicked(true);
  };

  // const riderSelectedHandler = (e) => {
  //     riderInputSearchRef.current.value = e.target.innerText;
  //     searchedRiderNumber = rider.number;
  //     setSearchedRiderData([]);
  // }

  return (
    <div className="generatePdf-container">
      <header>
        <span>Report</span>
        <span
          style={{ cursor: "pointer" }}
          onClick={() => props.setIsExportButtonClicked(false)}
        >
          X
        </span>
      </header>
      <div id="cpAddress" style={{ fontSize: "0px" }}>
        201- 208, Venus Atlantis, Landmark, 100 Feet Anand Nagar Rd, Prahlad
        Nagar, Ahmedabad, Gujarat 380015
      </div>
      <div className="generatePdf-subContainer">
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
          {generatePdfError && (
            <div className="pdfGenerateError">
              No Records Available for Selected Fields
            </div>
          )}
          <label htmlFor="startDate">Start Date: </label>
          <input type="date" ref={startDateRef} id="startDate" />
          <br />
          <label htmlFor="startDate">End Date: </label>
          <input type="date" ref={endDateRef} id="endDate" />
          <br />
          {props.isShift != "1" &&
            <div style={{ position: "relative" }}>
              <label htmlFor="searchRider">Rider: </label>
              <input
                type="text"
                id="searchRider"
                onChange={riderSearchHandler}
                ref={riderInputSearchRef}
              />
              {searchedRiderData && (
                <div className="searchedRiders">
                  {searchedRiderData.map((rider) => (
                    <p
                      onClick={(e) => {
                        riderInputSearchRef.current.value = e.target.innerText;
                        selectedRiderData.name = rider.name;
                        selectedRiderData.number = rider.number;
                        setSearchedRiderData([]);
                      }}
                    >
                      {rider.name + " ( " + rider.number + " )"}
                    </p>
                  ))}
                </div>
              )}
            </div>
          }
          {/* <br /> */}
          <label htmlFor="searchDriver">Driver: </label>
          <input
            type="text"
            id="searchDriver"
            onChange={driverSearchHandler}
            ref={driverInputSearchRef}
          />
          {searchedDriverData && (
            <div className="searchedRiders">
              {searchedDriverData.map((driver) => (
                <p
                  onClick={(e) => {
                    driverInputSearchRef.current.value = e.target.innerText;
                    selectedDriverData.name = driver.name;
                    selectedDriverData.email = driver.email;
                    setSearchedDriverData([]);
                  }}
                >
                  {driver.name}
                </p>
              ))}
            </div>
          )}
          <br />
        </main>
        <footer>
          <button onClick={generatePdfClickHandler}>Generate Pdf</button>
        </footer>
      </div>
    </div>
  );
};

export default Modal;
