import React, { useEffect, useRef, useState } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';

import useHttp from "../Hooks/use-http";
import generatePDF from "./generatePdf";
import "./Modal.css";

let drivers = [];
let riders = [];
let reportURLs = {
  trips: "Report/ShuttleTripReport",
  shifts: "DriverShift/DriverShiftDetailsReport",
  bookingRequests: "ScheduleBooking/GetBookingRequestDetailsReport",
  scheduleTrips: "ScheduleBooking/ScheduleTripReport"
}
let driverAndRiderURLs = {
  shuttle: "ShuttleTrips/GetShuttleDriverList",
  schedule: "DriverList/GetPrivateDriverList",
  private: "DriverList/GetPrivateDriverList",
}
let date = new Date();
const Modal = (props) => {
  const [selectedRiderData, setSelectedRiderData] = useState([]);
  const [selectedDriverData, setSelectedDriverData] = useState([]);
  const [isGeneratePdfClicked, setIsGeneratePdfClicked] = useState(false);
  const [corporatesData, setCorporatesData] = useState([]);
  const [generatePdfError, setGeneratePdfError] = useState(false);
  const [selectedCoroparte, setSelectedCorporate] = useState({});
  const [modules, setModules] = useState([]);
  const [driverAndRiderData, setDriverAndRiderData] = useState({});
  const [selectedModule, setSelectedModule] = useState();
  const [startDateValue, setStartDateValue] = useState(dayjs(new Date(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + "01")));
  const [endDateValue, setEndDateValue] = useState(dayjs(new Date()));
  const [isError, setIsError] = useState(false);

  const authenticateUser = (data) => {
    if (isGeneratePdfClicked) {
      if (data?.ReportDetails) {
        let totalKm = 0;
        let totalTrips = 0;
        for (let i = 0; i < data?.ReportDetails?.length; i++) {
          totalKm += +(data.ReportDetails[i].TripDistance ?? data.ReportDetails[i].TripKm);
          totalTrips += data.ReportDetails[i]?.Totaltrip ? data.ReportDetails[i]?.Totaltrip : 0;
        }
        if (!(selectedDriverData.DriverName || selectedRiderData?.OfficialName)) {
          for (let i = 0; i < data?.AdhocDriverList?.length; i++) {
            totalKm += +data.AdhocDriverList[i].kilometers;
          }
        }
        generatePDF(
          new Date(startDateValue).getDate() + "/" + (+new Date(startDateValue).getMonth() + 1) + "/" + new Date(startDateValue).getFullYear(),
          new Date(endDateValue).getDate() + "/" + (+new Date(endDateValue).getMonth() + 1) + "/" + new Date(endDateValue).getFullYear(),
          data.ReportDetails,
          selectedRiderData?.OfficialName ?? "", //OfficialName
          selectedDriverData?.DriverName ?? "", //DriverName
          totalTrips ? totalTrips : data.ReportDetails?.length,
          totalKm.toFixed(2),
          JSON.parse(data.CorporateLogo)[0].Image,
          document.getElementById("cpAddress").innerText,
          document.getElementById("cpAddress").clientWidth,
          props.type === "bookingRequests",
          props.type,
          data.AdhocDriverList
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

  const getCorporateList = (data) => {
    setCorporatesData(data.CorporateList);
    console.log(data.CorporateList);
  }

  const getDriverAndRiderData = (data) => {
    let obj = {
      driverList: data.PrivetDriverlist,
      riderList: data.RidersList
    }
    setDriverAndRiderData(obj);
    console.log(data);
  }

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    if (selectedModule)
      sendRequest(
        {
          url: "/api/v1/" + driverAndRiderURLs[selectedModule],
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            emailID: sessonStorage.getItem("user"),
            roleID: sessonStorage.getItem("roleId"),
            corporateID: sessonStorage.getItem("roleId") === "1" ? selectedCoroparte.CorporateID : sessonStorage.getItem("corpId"),
            isRider: "1",
            isDriver: "1"
          },
        },
        getDriverAndRiderData
      );
  }, [selectedModule]);

  useEffect(() => {
    let modules = "";
    if (sessonStorage.getItem("roleId") === "1")
      modules = selectedCoroparte?.EnabledModule?.split(",");
    else
      modules = sessionStorage.getItem("enabledModule").split(",");
    setModules(modules);
  }, [selectedCoroparte]);

  useEffect(() => {
    if (sessonStorage.getItem("roleId") === "1")
      sendRequest(
        {
          url: "/api/v1/Corporate/GetAllDepartmentByCorporate",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            emailID: sessonStorage.getItem("user")
          },
        },
        getCorporateList
      );
    else selectedCoroparte.CorporateID = sessonStorage.getItem("corpId");
  }, [sendRequest]);

  useEffect(() => {
    function formatToMMDDYYYYfromYYYYMMDD(inputDate) {
      var date = new Date(inputDate);
      return (
        (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
      );
    }
    if (isGeneratePdfClicked) {
      let startDate = startDateValue
        ? formatToMMDDYYYYfromYYYYMMDD(startDateValue)
        : "";
      let endDate = endDateValue
        ? formatToMMDDYYYYfromYYYYMMDD(endDateValue)
        : "";
      sendRequest(
        {
          url: "/api/v1/" + (selectedModule === "schedule" ? reportURLs["scheduleTrips"] : reportURLs[props.type]),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            emailID: sessonStorage.getItem("user"),
            driverEmailID: selectedDriverData?.DriverEmailID ?? "",
            riderMobileNumber: selectedRiderData?.MobileNumber ?? "",
            corporateID: props.type === "trips" ? selectedCoroparte.CorporateID : sessonStorage.getItem("adminDepartmentID"),
            isPrivateTrip: selectedModule === "private" ? "1" : "0",
            startDate: startDate,
            endDate: endDate,
          },
        },
        authenticateUser
      );
    }
  }, [isGeneratePdfClicked]);

  const generatePdfClickHandler = () => {
    if (!selectedModule) setIsError(true);
    else
      setIsGeneratePdfClicked(true);
  };

  return (
    <div className="generatePdf-container" style={{ zIndex: "999" }}>
      <header>
        <span>Report</span>
        <CloseIcon style={{ cursor: "pointer" }}
          onClick={() => props.setIsExportButtonClicked(false)} />
      </header>
      <div id="cpAddress" style={{ fontSize: "0px" }}>
        201- 208, Venus Atlantis, Landmark, 100 Feet Anand Nagar Rd, Prahlad
        Nagar, Ahmedabad, Gujarat 380015
      </div>
      <div className="generatePdf-subContainer">
        <main>
          {isLoading && isGeneratePdfClicked && (
            // {true && (
            < React.Fragment >
              <div class="wrapper">
                <div class="progressbar">
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
          <Backdrop
            sx={{ color: 'rgba(34, 137, 203, 255)', backgroundColor: "transparent", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading && !isGeneratePdfClicked}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          {generatePdfError && (
            <div className="pdfGenerateError">
              No Records Available for Selected Fields
            </div>
          )}
          <Autocomplete
            id="tags-standard"
            options={corporatesData}
            getOptionLabel={(cp) => cp?.CorporateName}
            disabled={sessonStorage.getItem("roleId") === "1" ? false : true}
            defaultValue={sessonStorage.getItem("roleId") !== "1" ? { CorporateName: sessonStorage.getItem("cpName") } : { CorporateName: "" }}
            onChange={(e, newValue) => newValue && setSelectedCorporate(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Corporate*"
                placeholder="Search Corporate"
              />
            )}
          />
          <Autocomplete
            id="tags-standard"
            options={modules ?? []}
            getOptionLabel={(data) => data}
            onChange={(e, newValue) => {
              setIsError(false);
              setSelectedModule(newValue.toLowerCase());
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                error={isError}
                helperText={isError && "This field is required"}
                variant="standard"
                label="Trip Type*"
                placeholder="Search Trip Type"
              />
            )}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{ display: "flex", gap: "10px" }} >
              <DatePicker
                label="Start Date*"
                value={startDateValue}
                slotProps={{ textField: { variant: "standard", readOnly: true, inputProps: { sx: { padding: "2px", fontSize: "14px" } } } }}
                onChange={(newValue) => {
                  setStartDateValue(newValue)
                }}
              />
              <DatePicker
                label="End Date*"
                value={endDateValue}
                slotProps={{ textField: { variant: "standard", readOnly: true, inputProps: { sx: { padding: "2px", fontSize: "14px" } } } }}
                onChange={(newValue) => {
                  setEndDateValue(newValue)
                }}
              />
            </div>
          </LocalizationProvider>
          {(props.type !== "scheduleTrips" && props.type !== "bookingRequests") &&
            <Autocomplete
              id="tags-standard"
              options={driverAndRiderData.driverList ?? []}
              getOptionLabel={(data) => data.DriverName}
              onChange={(e, newValue) => setSelectedDriverData(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Driver Name"
                  placeholder="Search Driver"
                />
              )}
            />
          }
          {!(props.type === "scheduleTrips" || props.type === "bookingRequests" || props.isShift === "1") &&
            <Autocomplete
              id="tags-standard"
              options={driverAndRiderData?.riderList ?? []}
              getOptionLabel={(data) => data?.OfficialName}
              onChange={(e, newValue) => setSelectedRiderData(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Staff Name"
                  placeholder="Search Staff"
                />
              )}
            />
          }
          <br />
        </main>
        <footer>
          <Button variant="contained" color="success" onClick={generatePdfClickHandler}>Generate Pdf</Button>
        </footer>
      </div>
    </div >
  );
};

export default Modal;
