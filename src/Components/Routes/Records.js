import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Loading from "../../Loading/Loading";
// import Accordian from "./_Accordian";
import "./Records.css";
import editIcon from "../../Assets/editIcon.png";
import AddRoute from "./AddRoute/RouteInfo";
import Message from "../../Modal/Message";

let routeId = "";
const Records = ({ isLoading, data, headers }) => {
    const [isEditRouteClicked, setIsEditRouteClicked] = useState(false);
    const [isRouteCreated, setIsRouteCreated] = useState();

    const routeCreationStatus = (data) => {
        setIsRouteCreated(data);
    }
    const history = useHistory();
    // const func = (val) => {
    //     if (val) {
    //         document.getElementById(val).click();
    //     }
    // }
    const editRouteClickHandler = (e) => {
        routeId = e.target.parentElement.parentElement.children[0].innerText;
        setIsEditRouteClicked(true);
    }
    return (
        <React.Fragment>
            {data[0] ?
                <table className="table" id="my-table">
                    <thead>
                        <tr>
                            {headers.map((data) => (
                                <th>{data}</th>
                            ))}
                            {sessionStorage.getItem("userType") !== "AccountManager" &&
                                <th>Actions</th>
                            }
                        </tr>
                    </thead>
                    <tbody className="routes_records">
                        {data.map(myData => <tr>
                            <td>{myData.route_id}</td>
                            <td>{myData.route}</td>
                            <td>{myData.city}</td>
                            <td>{myData.country}</td>
                            <td>{myData.zone_price}</td>
                            <td>{myData.route_type}</td>
                            {sessionStorage.getItem("userType") !== "AccountManager" &&
                                <td>
                                    <img onClick={editRouteClickHandler} className="edit-route" src={editIcon} />
                                </td>
                            }
                        </tr>)}
                    </tbody>
                </table> :
                <React.Fragment>
                    <table className="table" id="my-table">
                        <thead>
                            <tr>
                                {headers.map((data) => (
                                    <th>{data}</th>
                                ))}
                            </tr>
                        </thead>
                    </table>
                    {isLoading ? <Loading datatable="true" /> :
                        <div style={{ textAlign: "center", marginTop: "10px" }}>No Data Available</div>
                    }
                </React.Fragment>
            }
            {isEditRouteClicked && <div className="background"></div>}
            {isEditRouteClicked && <AddRoute routeCreationStatus={routeCreationStatus} routeId={routeId} setIsAddRouteClicked={setIsEditRouteClicked} />}
            {isRouteCreated &&
                <Message type={isRouteCreated} message={"Route name " + sessionStorage.getItem("routeName") + " has been Successfully edited"} />
            }
        </React.Fragment>
    );
};

export default Records;
