import React, { useRef, useState } from "react";
import Records from "./Records";
import ReactPaginate from "react-paginate";
// import "./Trips.css";
import { CSVLink } from "react-csv";
import { useLocation, useParams } from "react-router-dom";
import useHttp from "../../Hooks/use-http";
import { useEffect } from "react";
import generatePDF from "../../GeneratePDF/generatePdf";
import Modal from "../../GeneratePDF/Modal";

const TRIP_DATA = [
  {
    id: 1,
    driver_image: "",
    driver_name: "Jay Chauhan",
    car_info: "Alto, GJ 01 SH 0987",
    journey_id: "SDFGT65657",
    trip_date: "10/10/2022",
    pickup_time: "01:00 PM",
    drop_time: "03:00 PM",
    total_trip_time: "02:00 Hrs",
    total_trip_km: "419 KM",
  },
];

const TRIP_TITLE = [
  "Driver Info",
  "Journey_ID",
  "Trip Date",
  // "Reporting location",
  "Start Time",
  "End Time",
  "Total Trip Time",
  "Trip Status",
  "Total Trip KM",
];

let myClick = false;
let prev_id = "1";

let tripListFlag = 0;
let total_trip_data = "";
let today = new Date()
  .getFullYear()
  .toString()
  .concat("-", new Date().getMonth() + 1, "-", new Date().getDate());
let startDate = today;
let endDate = today;

function PrivateTrips(props) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let staffMoNumber = queryParams.get("staff");

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(7);
  const [filteredData, setFilteredData] = useState([]);
  const [isDataFiltered, setIsDataFiltered] = useState(true);
  const [isExportButtonClicked, setIsExportButtonClicked] = useState(false);
  const startDateRef = useRef();
  const endDateRef = useRef();

  const authenticateUser = (data) => {
    // console.log(data);
    let trip_list = [];
    if (data.TripList) {
      for (let i = 0; i < data.TripList.length; i++) {
        trip_list.push({
          id: i + 1,
          driver_name: data.TripList[i].DriverName,
          car_info:
            data.TripList[i].VehicaleModel +
            ", " +
            data.TripList[i].VehicaleNumber,
          journey_id: data.TripList[i].DriverTripID,
          trip_date: data.TripList[i].StartedOnDate,
          pickup_time: data.TripList[i].StartedOnTime,
          drop_time: data.TripList[i].EndedOnTime,
          total_trip_time: data.TripList[i].TotalTripTime,
          total_trip_km: data.TripList[i].TripDistance,
          trip_status: data.TripList[i].TripStatus,
        });
      }
    }
    total_trip_data = trip_list;
    setFilteredData(trip_list);
    setIsDataFiltered(false);
  };

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    if (isDataFiltered) {
      setFilteredData([]);
      sendRequest(
        {
          url: "/api/v1/PrivateTrip/GetPrivateTrip",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            emailID: sessionStorage.getItem("user"),
            userType: "corporate",
            fromDate: startDate,
            toDate: endDate,
          },
        },
        authenticateUser
      );
    }
  }, [sendRequest, isDataFiltered]);

  function formatToMMDDYYYYfromYYYYMMDD(inputDate) {
    var date = new Date(inputDate);
    return (
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
    );
  }

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  let currentRecords;
  // if (myClick) {
  currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  // } else {
  // currentRecords = filteredData;
  // }
  const nPages = Math.ceil(filteredData.length / recordsPerPage);

  let fromRecords = 0;
  if (currentPage === 1) fromRecords = 1;
  else fromRecords = (currentPage - 1) * recordsPerPage;
  let toRecords = 0;
  if (
    (myClick
      ? currentPage * recordsPerPage - (filteredData.length % recordsPerPage)
      : currentPage * recordsPerPage +
      recordsPerPage -
      (filteredData.length % recordsPerPage)) > filteredData.length
  )
    toRecords = filteredData.length;
  else toRecords = currentPage * recordsPerPage;
  if (toRecords === 0) fromRecords = 0;
  if (currentPage === nPages) toRecords = filteredData.length;

  const filterButtonClickHandler = (e) => {
    startDateRef.current.value = "";
    endDateRef.current.value = "";
    document.getElementById(e.target.id)?.classList.add("selected");
    document.getElementById(prev_id)?.classList.remove("selected");
    prev_id = e.target.id;

    setCurrentPage(1);
    setIsDataFiltered(true);
    myClick = true;

    if (e.target.innerText === "Today") {
      startDate = new Date()
        .getFullYear()
        .toString()
        .concat("-", +new Date().getMonth() + 1, "-", new Date().getDate());
      endDate = today;
    } else if (e.target.innerText === "This Week") {
      if (new Date().getDay() === 0)
        startDate =
          new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          (new Date().getDate() - 6);
      else
        startDate =
          new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          (new Date().getDate() - (new Date().getDay() - 1));
      endDate = today;
    } else if (e.target.innerText === "This Month") {
      startDate =
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        "1";
      endDate = today;
    }
  };

  const dateChangeHandler = () => {
    if (startDateRef.current.value && endDateRef.current.value) {
      startDate = startDateRef.current.value;
      endDate = endDateRef.current.value;
      document.getElementById(prev_id).classList.remove("selected");
      prev_id = null;
      setIsDataFiltered(true);
      setCurrentPage(1);
    }
  };

  const inputFromDateBlurHandler = (e) => {
    e.target.type = "text";
    if (startDateRef.current.value)
      startDateRef.current.value = formatToMMDDYYYYfromYYYYMMDD(
        startDateRef.current.value
      );
  };

  const inputToDateBlurHandler = (e) => {
    e.target.type = "text";
    if (endDateRef.current.value)
      endDateRef.current.value = formatToMMDDYYYYfromYYYYMMDD(
        endDateRef.current.value
      );
  };

  return (
    <div className="trips-details" id="trip-table">
      <div className="title">Private Driver trips</div>
      <div className="table-container">
        <div className="header">
          <div onClick={filterButtonClickHandler} className="filter-buttons">
            {/* <button
              onClick={allDataButtonClickHandler}
              id="1"
              className="selected"
            >
              All Data
            </button> */}
            <button id="1" className="selected">
              Today
            </button>
            <button id="2">This Week</button>
            <button id="3">This Month</button>
          </div>
          <div>
            <div onChange={dateChangeHandler} className="datepicker">
              <input
                placeholder="From Date"
                type="text"
                ref={startDateRef}
                onBlur={inputFromDateBlurHandler}
                onFocus={(e) => (e.target.type = "date")}
              />
              <input
                placeholder="To Date"
                type="text"
                ref={endDateRef}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={inputToDateBlurHandler}
              />
            </div>
            {/* <button onClick={() => generatePDF(filteredData)}>Click</button> */}
            <span
              className="export_csv"
              style={{ cursor: "pointer" }}
              onClick={() => setIsExportButtonClicked(true)}
            >
              Export
            </span>
            {/* <CSVLink data={filteredData} className="export_csv">
              Export
            </CSVLink> */}
          </div>
        </div>
        <Records
          data={currentRecords}
          headers={TRIP_TITLE}
          isLoading={isLoading}
        />
        <div className="footer">
          <p>
            Showing {fromRecords} to {toRecords} of {filteredData.length}{" "}
            entries{" "}
          </p>
          {/* <select onChange={(e) => setRecordsPerPage(e.target.value)}>
            <option>5</option>
            <option>10</option>
            <option>15</option>
          </select> */}
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={(e) => setCurrentPage(e.selected + 1)}
            pageRangeDisplayed={3}
            pageCount={nPages}
            previousLabel="<"
            renderOnZeroPageCount={null}
            containerClassName="pagination"
            pageLinkClassName="page-num"
            previousLinkClassName="page-num"
            nextLinkClassName="page-num"
            activeLinkClassName="active"
          />
          {/* <Pagination
                    nPages={nPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    /> */}
        </div>
      </div>
      {isExportButtonClicked && (
        <Modal
          setIsExportButtonClicked={setIsExportButtonClicked}
          isPrivateDriver="1"
          type="trips"
        />
      )}
      {isExportButtonClicked && <div className="add-route-fullcontainer"></div>}
    </div>
  );
}

export default PrivateTrips;
