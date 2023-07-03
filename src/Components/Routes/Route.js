import React, { useEffect, useRef, useState } from "react";
import Records from "./Records";
import ReactPaginate from "react-paginate";
import "./Route.css";
import { CSVLink } from "react-csv";
import { Route, useLocation } from "react-router-dom";
import AddRoute from "./AddRoute/RouteInfo";
import useHttp from "../../Hooks/use-http";
import Message from "../../Modal/Message";
import loadingGif from "../../Assets/loading-gif.gif";

const TRIP_DATA = [
    {
        id: 1,
        route_id: "SDFGT65657",
        route: "my route",
        city: "Ahmedabad",
        country: "India",
        zone_price: "100",
        route_type: "dropping",
        department: "Sales and Marketing",
    },
    {
        id: 2,
        route_id: "SDFGT65657",
        route: "Route 1",
        city: "Ahmedabad",
        country: "India",
        zone_price: "100",
        route_type: "dropping",
        department: "Admin",
    },
    {
        id: 3,
        route_id: "SDFGT65657",
        route: "Route 1",
        city: "Ahmedabad",
        country: "India",
        zone_price: "100",
        route_type: "picking",
        department: "Sales and Marketing",
    },
    {
        id: 4,
        route_id: "SDFGT65657",
        route: "Testing route",
        city: "Ahmedabad",
        country: "India",
        zone_price: "100",
        route_type: "dropping",
        department: "Sales and Marketing",
    },
    {
        id: 5,
        route_id: "SDFGT65657",
        route: "Route 1",
        city: "Ahmedabad",
        country: "India",
        zone_price: "100",
        route_type: "dropping",
        department: "Sales and Marketing",
    },
    {
        id: 6,
        route_id: "SDFGT65657",
        route: "Route 1",
        city: "Ahmedabad",
        country: "India",
        zone_price: "100",
        route_type: "dropping",
        department: "Sales and Marketing",
    },
    {
        id: 7,
        route_id: "SDFGT65657",
        route: "Route 1",
        city: "Ahmedabad",
        country: "India",
        zone_price: "100",
        route_type: "dropping",
        department: "Sales and Marketing",
    },
    {
        id: 8,
        route_id: "SDFGT65657",
        route: "Route 1",
        city: "Ahmedabad",
        country: "India",
        zone_price: "100",
        route_type: "dropping",
        department: "Sales and Marketing",
    },
    {
        id: 9,
        route_id: "SDFGT65657",
        route: "Route 1",
        city: "Ahmedabad",
        country: "India",
        zone_price: "100",
        route_type: "dropping",
        department: "Sales and Marketing",
    },
    {
        id: 10,
        route_id: "SDFGT65657",
        route: "Route 1",
        city: "Ahmedabad",
        country: "India",
        zone_price: "100",
        route_type: "dropping",
        department: "Sales and Marketing",
    },
    {
        id: 11,
        route_id: "SDFGT65657",
        route: "Route 1",
        city: "Ahmedabad",
        country: "India",
        zone_price: "100",
        route_type: "dropping",
        department: "Sales and Marketing",
    },
    {
        id: 12,
        route_id: "SDFGT65657",
        route: "Route 1",
        city: "Ahmedabad",
        country: "India",
        zone_price: "100",
        route_type: "dropping",
        department: "Sales and Marketing",
    },
    {
        id: 13,
        route_id: "SDFGT65657",
        route: "Route 1",
        city: "Ahmedabad",
        country: "India",
        zone_price: "100",
        route_type: "dropping",
        department: "Sales and Marketing",
    },
    {
        id: 14,
        route_id: "SDFGT65657",
        route: "Route 1",
        city: "Ahmedabad",
        country: "India",
        zone_price: "100",
        route_type: "dropping",
        department: "Sales and Marketing",
    },
    {
        id: 15,
        route_id: "SDFGT65657",
        route: "Route 1",
        city: "Ahmedabad",
        country: "India",
        zone_price: "100",
        route_type: "dropping",
        department: "Sales and Marketing",
    },
];

const TRIP_TITLE = [
    "Route ID",
    "Route Name",
    "City",
    "Country",
    // "Zone Price",
    "Route Type",
];

let myClick = false;
let prev_id = "1";
let routeListFlag = 0;
let route_details = [];

function Routes() {
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(7);
    const [filteredData, setFilteredData] = useState([]);
    const searchInputRef = useRef();
    const [isAddRouteClicked, setIsAddRouteClicked] = useState();
    const [isRouteCreated, setIsRouteCreated] = useState();

    const routeCreationStatus = (data) => {
        setIsRouteCreated(data);
    }

    const search = useLocation().search;
    const id = new URLSearchParams(search).get('departmentId');

    const authenticateUser = (data) => {
        // console.log(data.RouteList);
        // console.log(data);
        let route_list = [];
        if (data.RouteList) {
            for (let i = 0; i < data.RouteList.length; i++) {
                route_list.push({
                    id: i + 1,
                    route_id: data.RouteList[i].RouteID,
                    route: data.RouteList[i].RouteName,
                    city: data.RouteList[i].City,
                    country: data.RouteList[i].Country,
                    zone_price: data.RouteList[i].ZonePrice,
                    route_type: data.RouteList[i].RouteTypeName,
                })
            }
        }
        route_details = route_list;
        setFilteredData(route_list);
    };

    const { isLoading, sendRequest } = useHttp();

    useEffect(() => {
        // if (routeListFlag > 0)
            sendRequest({
                url: "/api/v1/Route/GetRoutList",
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    emailID: sessionStorage.getItem("user"),
                    corporateID: id ? id : (sessionStorage.getItem("userType") === "AccountManager" ? "" : sessionStorage.getItem("corpId")),
                    departmentID: ""
                }
            }, authenticateUser);
        routeListFlag++;
    }, [sendRequest]);

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

    const addRouteClickHandler = () => {
        setIsAddRouteClicked(true);
    }

    const routeSearchHandler = (e) => {
        // if (e.target.value)
        setFilteredData(route_details.filter(data => data.route?.toLowerCase().includes(e.target.value.toLowerCase()) ||
            data.route_id?.toLowerCase().includes(e.target.value.toLowerCase()) ||
            data.city?.toLowerCase().includes(e.target.value.toLowerCase()) ||
            data.country?.toLowerCase().includes(e.target.value.toLowerCase()) ||
            data.zone_price?.toString()?.toLowerCase().includes(e.target.value.toLowerCase()) ||
            data.route_type?.toLowerCase().includes(e.target.value.toLowerCase())
        ));
        // else setFilteredData(TRIP_DATA);
    };

    return (
        <React.Fragment>
            {isAddRouteClicked &&
                <div className="add-route-fullcontainer"></div>
            }
            <div className="trips-details" id="trip-table">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "inline-block" }} className="title">{sessionStorage.getItem("type") + " shuttle routes"}</div>
                    {sessionStorage.getItem("userType") !== "AccountManager" &&
                        <button onClick={addRouteClickHandler} style={{ marginRight: "40px", padding: "7px 14px", backgroundColor: "rgba(34, 137, 203, 255)", color: "white", border: "rgba(34, 137, 203, 255)", borderRadius: "5px", cursor: "pointer" }}>Add Route</button>
                    }
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
                            <CSVLink data={route_details} className="export_csv" filename={"data.csv"} >
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
                    </div>
                </div>
                {isAddRouteClicked && <AddRoute routeCreationStatus={routeCreationStatus} setIsAddRouteClicked={setIsAddRouteClicked} />}
                {isRouteCreated &&
                    (isRouteCreated === "Loading" ?
                        <img src={loadingGif} style={{ position: "absolute", top: "40%", left: "40%" }} /> :
                        <Message type={isRouteCreated} message={"Route name " + sessionStorage.getItem("routeName") + " has been Successfully created"} />
                    )
                }
            </div>
        </React.Fragment>
    );
}

export default Routes;
