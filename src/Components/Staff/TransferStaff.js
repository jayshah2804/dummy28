import React from 'react'
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import useHttp from '../../Hooks/use-http';
import "./TransferStaff.css";
import loadingGif from "../../Assets/loading-gif.gif";

let flag = true;
let dptID = "";
let transferredDpt = "";
const TransferStaff = (props) => {
    const [departmentList, setDepartmentList] = useState([]);
    const [isError, setIsError] = useState({ transferDptError: "" });
    const [isCall, setIsCall] = useState(false);
    const transferDepartmentSelectRef = useRef();

    const authenticateUser = (data) => {
        console.log(data);
        if (isCall) {
            props.setIsStaffTransferClicked();
            props.setIsResponse({ message: data.Message ? data.Message.toLowerCase() : data, data: transferredDpt });
        } else {
            let departmentData = [];
            for (let i = 0; i < data.DepartMentList.length; i++) {
                departmentData.push({
                    id: data.DepartMentList[i].DepartmentID,
                    name: data.DepartMentList[i].DepartmentName
                })
            }
            setDepartmentList(departmentData);
        }
    };

    const { isLoading, sendRequest } = useHttp();

    useEffect(() => {
        if (flag)
            sendRequest({
                url: "/api/v1/Department/DepartmentList",
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    emailID: sessionStorage.getItem("user"),
                    corporateID: sessionStorage.getItem("corpId")
                }
            }, authenticateUser);
        flag = false;
        if (isCall)
            sendRequest({
                url: "/api/v1/Staff/TransferStaff",
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    emailID: sessionStorage.getItem("user"),
                    departmentID: dptID,
                    mobileNumber: props.staffmobile
                }
            }, authenticateUser);
    }, [sendRequest, isCall]);

    const staffTransferSaveHandler = () => {
        if (transferDepartmentSelectRef.current.value.toLowerCase() === "select") {
            setIsError(prev => ({ ...prev, transferDptError: "Please select the department name" }));
        } else setIsCall(true);
    }

    return (
        <React.Fragment>
            <div className='background'></div>
            <div className='transferStaff-container'>
                <header>
                    <span>Staff Transfer</span>
                    <span style={{ cursor: "pointer" }} onClick={() => props.setIsStaffTransferClicked()} >X</span>
                </header>
                <hr />
                <div className='sub-container'>
                    <main>
                        <p>Staff Name: {props.staffName}</p>
                        <p>Current Department: {props.dptName}</p>
                        <br />
                        <label>Transfer To:</label>
                        <select ref={transferDepartmentSelectRef} onChange={(e) => {
                            dptID = e.target.options[e.target.selectedIndex].id;
                            transferredDpt = e.target.options[e.target.selectedIndex].innerText;
                            setIsError(prev => ({ ...prev, transferDptError: "" }))
                        }} >
                            <option disabled selected>Select</option>
                            {departmentList && departmentList.map(data => {
                                if (data.name !== props.dptName)
                                    return (
                                        <option id={data.id}>{data.name}</option>
                                    )
                            }
                            )}
                        </select>
                        {isError.transferDptError && <p className='error'>{isError.transferDptError}</p>}
                    </main>
                    <footer>
                        <button onClick={staffTransferSaveHandler}>Save</button>
                    </footer>
                </div>
            </div>
            {isLoading &&
                <img src={loadingGif} style={{ position: "absolute", top: "40%", left: "40%" }} />
            }
        </React.Fragment>
    )
}

export default TransferStaff