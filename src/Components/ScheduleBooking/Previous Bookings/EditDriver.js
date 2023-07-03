import React, { useEffect, useRef, useState } from 'react'
import useHttp from '../../../Hooks/use-http';
import "./EditDriver.css";
import Message from '../../../Modal/Message';
import loadingGif from "../../../Assets/loading-gif.gif";

let selectedDriverEmailId = "";
const EditDriver = (props) => {
    const [driverList, setDriverList] = useState();
    const [searchedDriverData, setSearchedDriverData] = useState();
    const driverNameInputRef = useRef();
    const amountInputRef = useRef();

    const allDriverData = (data) => {
        let DriverData = [];
        for (let i = 0; i < data?.DriverList?.length; i++) {
            DriverData[i] = {
                driverName: data.DriverList[i].DriverName,
                driverEmail: data.DriverList[i].DriverEmailID,
                carDetails: data.DriverList[i].Model,
                carColor: data.DriverList[i].Color
            }
        }
        if (DriverData.length > 0)
            setDriverList(DriverData);
    }

    const { isLoading, sendRequest } = useHttp();

    useEffect(() => {
        sendRequest(
            {
                url: "/api/v1/DriverList/GetDriverList",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    emailID: sessionStorage.getItem("user"),
                    corporateID: "",
                    roleID: sessionStorage.getItem("roleId")
                },
            },
            allDriverData
        );
    }, [sendRequest]);

    const driverSearchHandler = (e) => {
        if (e.target.value)
            setSearchedDriverData(driverList?.filter(data => data.driverName.toLowerCase().includes(e.target.value.toLowerCase()) || data.driverEmail.toLowerCase().includes(e.target.value.toLowerCase()) || data.carDetails.toLowerCase().includes(e.target.value.toLowerCase())));
        else setSearchedDriverData([]);
    }

    const driverNameSelectHandler = (value, driverEmail) => {
        driverNameInputRef.current.value = value;
        selectedDriverEmailId = driverEmail;
        setSearchedDriverData([]);
    }

    const editDriverSaveClickHandler = () => {
        props.editDriverFun(selectedDriverEmailId, amountInputRef.current.value);
    }

    return (
        <React.Fragment>
            <div className='editDriverContainer'>
                <header>
                    <span>Assign Driver</span>
                    <span style={{ cursor: "pointer" }} onClick={() => props.setEditDriverBookingId("")} >X</span>
                </header>
                <main>
                    <div style={{ marginBottom: "15px", position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
                        <input type="text" placeholder='Search Driver Name' ref={driverNameInputRef} onChange={driverSearchHandler} />
                        {searchedDriverData?.length > 0 &&
                            <div className='searchedDriverData'>
                                {searchedDriverData?.map(data => (
                                    <div className='singleDriverData' onClick={(e) => driverNameSelectHandler(data.driverName, data.driverEmail)} >
                                        <span>{data.driverName}</span>
                                        <span>{data.carDetails + " (" + data.carColor + ")"}</span>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                    <input type="text" placeholder='Amount' ref={amountInputRef} />
                </main>
                <footer>
                    <button onClick={editDriverSaveClickHandler} >Save</button>
                </footer>
            </div>
        </React.Fragment>
    )
}

export default EditDriver