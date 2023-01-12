import React, { useRef, useState } from "react";
import Records from "./Records";
import ReactPaginate from "react-paginate";
import "./Trips.css";
import { CSVLink } from "react-csv";
import { useLocation, useParams } from "react-router-dom";
import useHttp from "../../Hooks/use-http";
import { useEffect } from "react";

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
  }
];

const TRIP_TITLE = [
  "Driver Name",
  "Journey_ID",
  "Trip Date",
  "Pickup Start Time",
  "Drop End Time",
  "Total Trip Time",
  "Total Trip KM",
];

let myClick = false;
let prev_id = "1";

let tripListFlag = 0;
let total_trip_data = "";

function App(props) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let staffMoNumber = queryParams.get('staff');
  const id = queryParams.get('corpId');

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(7);
  const [filteredData, setFilteredData] = useState([]);
  const startDateRef = useRef();
  const endDateRef = useRef();

  const authenticateUser = (data) => {
    console.log("data");
    let trip_list = [];
    if (data.TripList) {
      for (let i = 0; i < data.TripList.length; i++) {
        trip_list.push({
          id: i + 1,
          driver_name: data.TripList[i].DriverName,
          car_info: data.TripList[i].VehicaleModel + "," + data.TripList[i].VehicaleNumber,
          journey_id: data.TripList[i].DriverTripID,
          trip_date: data.TripList[i].StartedOnDate,
          pickup_time: data.TripList[i].StartedOnTime,
          drop_time: data.TripList[i].EndedOnTime,
          total_trip_time: data.TripList[i].TotalTripTime,
          total_trip_km: data.TripList[i].TripDistance
        })
      }
    }
    total_trip_data = trip_list;
    setFilteredData(trip_list);
  };

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    let date = new Date();
    console.log(date.getMonth());
    let today = date.getFullYear().toString().concat("-", +date.getMonth() + 1, "-", date.getDate());
    // if (tripListFlag > 0) {
      console.log(tripListFlag);
      sendRequest({
        url: "/api/v1/ShuttleTrips/GetShuttleTrips",
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          emailID: sessionStorage.getItem("user"),
          corporateID: id ? id : (sessionStorage.getItem("userType") === "AccountManager" ? "" : sessionStorage.getItem("corpId")),
          departmentID: "",
          staffMobileNumber: staffMoNumber ? staffMoNumber : "",
          fromDate: "2018-01-01",
          toDate: today
        }
      }, authenticateUser);
    // }
    tripListFlag++;
  }, [sendRequest, id]);


  function formatDate(date = new Date(), format = "mm/dd/yy") {
    const map = {
      mm: date.getMonth() + 1,
      dd: date.getDate(),
      yy: date.getFullYear().toString(),
      yyyy: date.getFullYear(),
    };
    return format.replace(/mm|dd|yy|yyy/gi, (matched) => map[matched]);
  }

  function differenceInDays(date1, date2) {
    var Difference_In_Time =
      new Date(date2).getTime() - new Date(date1).getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
  }

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
    document.getElementById(e.target.id).classList.add("selected");
    document.getElementById(prev_id).classList.remove("selected");
    prev_id = e.target.id;

    setCurrentPage(1);
    myClick = true;

    if (e.target.innerText === "Today") {
      let todayDate = formatDate();
      setFilteredData(total_trip_data.filter((data) => data.trip_date === todayDate));
    } else if (e.target.innerText === "This Week") {
      let todayDate = formatDate();
      setFilteredData(
        total_trip_data.filter(
          (data) => differenceInDays(data.trip_date, todayDate) <= 7
        )
      );
    } else if (e.target.innerText === "This Month") {
      let todayDate = formatDate();
      setFilteredData(
        total_trip_data.filter(
          (data) => differenceInDays(data.trip_date, todayDate) <= 31
        )
      );
    }
  };

  const dateChangeHandler = () => {
    if (startDateRef.current.value && endDateRef.current.value) {
      let startdate = formatToMMDDYYYYfromYYYYMMDD(startDateRef.current.value);
      let enddate = formatToMMDDYYYYfromYYYYMMDD(endDateRef.current.value);
      startdate = new Date(startdate);
      enddate = new Date(enddate);
      // console.log(startdate, enddate);
      setFilteredData(
        filteredData.filter(
          (data) =>
            new Date(data.trip_date) > startdate &&
            new Date(data.trip_date) < enddate
        )
      );
    }
  };

  const allDataButtonClickHandler = () => {
    myClick = false;
    setFilteredData(total_trip_data);
  };

  const inputFromDateBlurHandler = (e) => {
    e.target.type = "text";
    if (startDateRef.current.value)
      startDateRef.current.value = formatToMMDDYYYYfromYYYYMMDD(startDateRef.current.value);
  }

  const inputToDateBlurHandler = (e) => {
    e.target.type = "text";
    if (endDateRef.current.value)
      endDateRef.current.value = formatToMMDDYYYYfromYYYYMMDD(endDateRef.current.value);
  }

  return (
    <div className="trips-details" id="trip-table">
      <div className="title">{sessionStorage.getItem("type") + " shuttle trips"}</div>
      <div className="table-container">
        <div className="header">
          <div onClick={filterButtonClickHandler} className="filter-buttons">
            <button
              onClick={allDataButtonClickHandler}
              id="1"
              className="selected"
            >
              All Data
            </button>
            <button id="2">Today</button>
            <button id="3">This Week</button>
            <button id="4">This Month</button>
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
            <CSVLink data={filteredData} className="export_csv" filename={"data.csv"} >
              Export
            </CSVLink>
          </div>
        </div>
        <Records data={currentRecords} headers={TRIP_TITLE} isLoading={isLoading} />
        <div className="footer">
          <p>
            Showing {fromRecords} to {toRecords} of {filteredData.length}{" "}
            entries{" "}
          </p>
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
    </div>
  );
}

export default App;
