import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Loading from "../../Loading/Loading";
import Accordian from "./Accordian";
import "./Records.css";
import Message from "../../Modal/Message";

import editImage from "../../Assets/editIcon.png";
import tripImage from "../../Assets/tripsIcon.png";
import transferImage from "../../Assets/Transfer.png";
import disableImage from "../../Assets/Disable.png";
import useHttp from "../../Hooks/use-http";
import { useEffect } from "react";
import TransferStaff from "./TransferStaff";
import { useRef } from "react";

let staffName = "";
let staffMoNumber = "";
let dptName = "";
const Records = ({ isLoading, data, headers }) => {
    const [isStudentDisbaleClicked, setIsStudentDisableClicked] = useState(false);
    const [isStaffDisbleClicked, setIsStaffDisableClicked] = useState(false);
    const [isStaffTransferClicked, setIsStaffTransferClicked] = useState(false);
    const [isResponse, setIsResponse] = useState();
    const history = useHistory();

    const authenticateUser = (data) => {
        setIsResponse(data.Message ? data.Message.toLowerCase() : data);
        setIsStudentDisableClicked(false);
        setIsStaffDisableClicked(false);
    };

    const { sendRequest } = useHttp();

    useEffect(() => {
        if (isStaffDisbleClicked)
            sendRequest({
                url: "/api/v1/Staff/SuspendStaff",
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    emailID: sessionStorage.getItem("user"),
                    mobileNumber: staffMoNumber,
                }
            }, authenticateUser);
    }, [sendRequest, isStaffDisbleClicked]);

    const subListClickHandler = (e) => {
        staffMoNumber = e.target.parentElement.parentElement.children[1].innerText;
        staffName = e.target.parentElement.parentElement.children[0].innerText;
        if (e.target.alt === "disable") {
            setIsStudentDisableClicked(true);
        }
        else if (e.target.alt === "transfer") {
            dptName = e.target.parentElement.parentElement.children[2].innerText;
            setIsStaffTransferClicked(true);
        }
        else if (e.target.alt === "trips") {
            history.push(`/trips?staff=${staffMoNumber}`);
        }
        else if (e.target.alt === "edit") {
            window.open(`https://students.little.global/?type=${sessionStorage.getItem("type").toLowerCase() === "corporate" ? "cp" : "sc"}&name=${sessionStorage.getItem("cpName")}&corpId=${sessionStorage.getItem("corpId")}&edit=${staffMoNumber}`);
        }
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
                    <tbody>
                        {data.map(myData => <tr>
                            <td>{myData.name}</td>
                            <td>{myData.mobile_no}</td>
                            {/* <td>{myData.superviser_name}</td> */}
                            <td width="15%">{myData.department}</td>
                            <td>{myData.status}</td>
                            {sessionStorage.getItem("userType") !== "AccountManager" &&
                                <td id={myData.id} onClick={subListClickHandler} className="staff-data" >
                                    <img src={editImage} alt="edit" title="Click to edit details" />
                                    <img src={tripImage} alt="trips" title="Click to see trips details" />
                                    <img src={transferImage} alt="transfer" title="Click to transfer staff to another department" />
                                    <img src={disableImage} alt="disable" title="Click to disable staff menber" />
                                </td>
                            }
                        </tr>)}
                    </tbody>
                </table>
                :
                <React.Fragment>
                    <table className="table" id="my-table">
                        <thead>
                            <tr>
                                {headers.map((data) => (
                                    <th>{data}</th>
                                ))}
                                <th>Actions</th>
                            </tr>
                        </thead>
                    </table>
                    {isLoading ? <Loading datatable="true" /> :
                        <div style={{ textAlign: "center", marginTop: "10px" }}>No Data Available</div>
                    }
                </React.Fragment>
            }
            {isStudentDisbaleClicked &&
                <React.Fragment>
                    <div className='background'></div>
                    <div className="alert_studentDisble">
                        <header>
                            <span>Alert</span><span style={{ cursor: "pointer" }} onClick={() => setIsStudentDisableClicked(false)} >X</span>
                        </header>
                        <hr />
                        <br />
                        <main>
                            <p>You going to disable the staff {staffName}</p>
                        </main>
                        <footer>
                            <span>Do you want to proceed?</span>
                            <div>
                                <button onClick={() => setIsStaffDisableClicked(true)} >Yes</button>
                                <button onClick={() => setIsStudentDisableClicked(false)}>No</button>
                            </div>
                        </footer>
                    </div>
                </React.Fragment>
            }
            {isStaffTransferClicked && <TransferStaff setIsResponse={setIsResponse} dptName={dptName} staffName={staffName} staffmobile={staffMoNumber} setIsStaffTransferClicked={setIsStaffTransferClicked} />}
            {isResponse && <Message type={isResponse.message ? isResponse.message : isResponse} message={isResponse.message ? staffName + " has been successfully transferred to " + isResponse.data : "Staff " + staffName + " disbaled successfully"} />}
        </React.Fragment>
    );
};

export default Records;
