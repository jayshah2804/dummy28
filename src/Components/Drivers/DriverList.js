import React, { useEffect, useRef, useState } from "react";
import Records from "./Records";
import ReactPaginate from "react-paginate";
import { CSVLink } from "react-csv";
import useHttp from "../../Hooks/use-http";

const DRIVER_TITLE = [
    "Driver Name",
    "Car Model",
    "Car Number",
    "Status",
    "Live Status"
];

let myClick = false;
let driverlist = [];
function DriverList() {
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(7);
    const [filteredData, setFilteredData] = useState([]);
    const searchInputRef = useRef();

    useEffect(() => {
        driverlist = JSON.parse(sessionStorage.getItem("driverList"));
        if (driverlist)
            setFilteredData(driverlist);
    }, []);

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

    const routeSearchHandler = (e) => {
        setFilteredData(driverlist.filter(data =>
            data.DriverName?.toLowerCase().includes(e.target.value.toLowerCase()) ||
            data.Status?.toLowerCase().includes(e.target.value.toLowerCase()) ||
            data.CarModel?.toLowerCase().includes(e.target.value.toLowerCase()) ||
            data.CarNumber?.toLowerCase().includes(e.target.value.toLowerCase())
        ));
    };

    return (
        <div className="trips-details" id="trip-table">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "inline-block" }} className="title">DRIVER LIST</div>
            </div>
            <div className="table-container-routes">
                <div className="header">
                    <div>
                        <div onChange={routeSearchHandler} className="route-search">
                            <input
                                placeholder="Search"
                                type="text"
                                ref={searchInputRef}
                            />
                        </div>
                        <CSVLink data={driverlist ? driverlist : []} className="export_csv">
                            Export
                        </CSVLink>
                    </div>
                </div>
                <Records data={currentRecords} headers={DRIVER_TITLE} isLoading={false} />
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
        </div>
    );
}

export default DriverList;
