import React, { useRef, useState } from "react";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import Button from '@mui/material/Button';

import Records from "./Records";
import useHttp from "../../../Hooks/use-http";
import Modal from "../../../GeneratePDF/Modal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const SHIFT_TITLE = [
  "Booking Id",
  "Guest Details",
  "Pickup Date",
  "Drop Date",
  "Booking Type",
  "Vehicle Type",
  "Trip Cost",
  "Status",
];

let myClick = false;
let prev_id = "1";
let total_shift_data = "";
let today = new Date()
  .getFullYear()
  .toString()
  .concat("-", new Date().getMonth() + 1, "-", new Date().getDate());
let startDate = today;
let endDate = today;

function PreviousBookings(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(7);
  const [filteredData, setFilteredData] = useState([]);
  const [isDataFiltered, setIsDataFiltered] = useState(true);
  const [isExportButtonClicked, setIsExportButtonClicked] = useState(false);
  const startDateRef = useRef();
  const endDateRef = useRef();
  const history = useHistory();

  const authenticateUser = (data) => {
    let booking_list = [];
    if (data.RequestBookingDetails) {
      for (let i = 0; i < data.RequestBookingDetails.length; i++) {
        booking_list.push({
          id: i + 1,
          bookingId: data.RequestBookingDetails[i].BookingID,
          guestName: data.RequestBookingDetails[i].GuestName,
          guestMobile: data.RequestBookingDetails[i].GuestMobileNumber,
          bookingDate: data.RequestBookingDetails[i].BookingDateTime?.replace("T", " "),
          pickupDate: data.RequestBookingDetails[i].PickupDateTime?.split(" ")[0],
          pickupTime: data.RequestBookingDetails[i].PickupDateTime?.split(" ")[1],
          dropDate: data.RequestBookingDetails[i].EndedOn?.split(" ")[0],
          dropTime: data.RequestBookingDetails[i].EndedOn?.split(" ")[1],
          pickupLocation: data.RequestBookingDetails[i].PickupAddress,
          dropLocation: data.RequestBookingDetails[i].DropoffAddress,
          vehicleType: data.RequestBookingDetails[i].VehicleType,
          status: data.RequestBookingDetails[i].Status,
          driverName: data.RequestBookingDetails[i].DriverName,
          driverCarModel: data.RequestBookingDetails[i].carModel,
          driverCarNumber: data.RequestBookingDetails[i].carNumber,
          cancelNotes: data.RequestBookingDetails[i].CancelNotes,
          bookingType: data.RequestBookingDetails[i].Justification,
          corporateName: data.RequestBookingDetails[i].CorporateName,
          coprorateId: data.RequestBookingDetails[i].AdminDepartmentID,
          driverCost: data.RequestBookingDetails[i].DriverCost,
          driverEmailId: data.RequestBookingDetails[i].DriverEmailId,
          companyCost: data.RequestBookingDetails[i].CompanyCost
        });
      }
    }
    total_shift_data = booking_list;
    setFilteredData(booking_list);
    setIsDataFiltered(false);
  };

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    if (isDataFiltered) {
      setFilteredData([]);
      sendRequest(
        {
          url: "/api/v1/ScheduleBooking/GetBookingRequestDetails",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            emailID: sessionStorage.getItem("user"),
            corporateID: sessionStorage.getItem("adminDepartmentID"),
            startDate: startDate,
            endDate: endDate,
            roleID: sessionStorage.getItem("roleId")
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
    };
  }

  const dateChangeHandler = () => {
    if (startDateRef.current.value && endDateRef.current.value) {
      startDate = startDateRef.current.value;
      endDate = endDateRef.current.value;
      document.getElementById(prev_id)?.classList.remove("selected");
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
      <div className="title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
        <p>Schedule Booking</p>
        <Button onClick={() => history.push("/schedule-booking/new booking")} variant="contained" size="small" sx={{ boxShadow: "none", marginRight: "10px", fontFamily: "Montserrat" }} >Add New Booking</Button>
      </div>
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
            <span
              className="export_csv"
              style={{ cursor: "pointer" }}
              onClick={() => setIsExportButtonClicked(true)}
            >
              Export
            </span>
          </div>
        </div>
        <Records
          data={currentRecords}
          headers={SHIFT_TITLE}
          isLoading={isLoading}
        />
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
        </div>
      </div>
      {isExportButtonClicked && (
        <Modal
          setIsExportButtonClicked={setIsExportButtonClicked}
          type="bookingRequests"
        />
      )}
      {isExportButtonClicked && <div className="add-route-fullcontainer"></div>}
    </div>
  );
}

export default PreviousBookings;
