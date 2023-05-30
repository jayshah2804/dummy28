import React, { useRef, useState } from "react";
import Records from "./Records";
import ReactPaginate from "react-paginate";
// import "./Trips.css";
import { CSVLink } from "react-csv";
import { useLocation, useParams } from "react-router-dom";
import useHttp from "../../../Hooks/use-http";
import { useEffect } from "react";
// import generatePDF from "../../GeneratePDF/generatePdf";
import Modal from "../../../GeneratePDF/Modal";

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

const SHIFT_TITLE = [
    "Driver Info",
    // "Shift Date",
    "Start Time",
    "End Time",
    "Started On",
    "Ended On",
    "Status",
];

let myClick = false;
let prev_id = "1";

let tripListFlag = 0;
let total_shift_data = "";
let today = new Date()
    .getFullYear()
    .toString()
    .concat("-", new Date().getMonth() + 1, "-", new Date().getDate());
let startDate = today;
let endDate = today;

function Shifts(props) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    let staffMoNumber = queryParams.get("staff");

    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(7);
    const [filteredData, setFilteredData] = useState([]);
    const [isDataFiltered, setIsDataFiltered] = useState(true);
    const [isExportButtonClicked, setIsExportButtonClicked] = useState(false);
    const startDateRef = useRef();
    const endDateRef = useRef();

    const authenticateUser = (data) => {
        // console.log(data);
        let shift_list = [];
        if (data.DriverShiftList) {
            for (let i = 0; i < data.DriverShiftList.length; i++) {
                shift_list.push({
                    id: i + 1,
                    driver_name: data.DriverShiftList[i].DriverName,
                    car_info:
                        data.DriverShiftList[i].Model +
                        "," +
                        data.DriverShiftList[i].Color,
                    shift_id: data.DriverShiftList[i].ShiftID,
                    // shift_date: data.DriverShiftList[i].StartTime.split("T")[0],
                    shift_startTime: data.DriverShiftList[i].StartTime.replace("T", " "),
                    shift_endTime: data.DriverShiftList[i].EndTime.replace("T", " "),
                    shift_startedOn: data.DriverShiftList[i].ShiftStartedOn?.replace("T", " "),
                    shift_endedOn: data.DriverShiftList[i].ShiftEndedOn?.replace("T", " "),
                    reporting_location: data.DriverShiftList[i].ReportingLocaiton,
                    reporting_latLng: data.DriverShiftList[i].ReportingLL,
                    status: data.DriverShiftList[i].Status,
                    corporate: data.DriverShiftList[i].CorporateName
                });
            }
        }
        total_shift_data = shift_list;
        setFilteredData(shift_list);
        setIsDataFiltered(false);
    };

    const { isLoading, sendRequest } = useHttp();

    useEffect(() => {
        if (isDataFiltered) {
            setFilteredData([]);
            sendRequest(
                {
                    url: "/api/v1/DriverShift/GetDriverShiftDetails",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: {
                        emailID: sessionStorage.getItem("user"),
                        corporateID: sessionStorage.getItem("adminDepartmentID"),
                        startDate: startDate,
                        endDate: endDate,
                        shiftID: "",
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
            <div className="title">Private Driver Shifts</div>
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
                    isShift = "1"
                    type="shifts"
                />
            )}
            {isExportButtonClicked && <div className="add-route-fullcontainer"></div>}
        </div>
    );
}

export default Shifts;
