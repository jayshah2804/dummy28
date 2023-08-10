import React, { useEffect, useRef, useState } from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import useHttp from '../../../Hooks/use-http';
import "./EditDriver.css";

let selectedDriverEmailId = "";
const EditDriver = (props) => {
    const [driverList, setDriverList] = useState([]);
    const driverCostInputRef = useRef();
    const companyCostInputRef = useRef();

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

    const editDriverSaveClickHandler = () => {
        props.editDriverFun(selectedDriverEmailId, companyCostInputRef.current.value, driverCostInputRef.current.value);
    }

    return (
        <React.Fragment>
            <div className='editDriverContainer'>
                <header>
                    <span>{props.bookingData.modalHeader}</span>
                    <span style={{ cursor: "pointer" }} onClick={() => props.setEditDriverBookingId("")} >X</span>
                </header>
                <main>
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={driverList}
                            getOptionLabel={(data) => data.driverName + (data.carDetails ? `(${data.carDetails})` : "")}
                            renderInput={(params) => <TextField {...params} className='standard-basic' variant="standard" placeholder='Search Driver Name' label="Assigned Driver Details" />}
                            onChange={(e, newValue) => (selectedDriverEmailId = newValue.driverEmail)}
                            disabled={props.bookingData.isDisableDriverField}
                            sx={{ width: "300px", alignSelf: "center" }}
                            defaultValue={{ driverName: props.bookingData.driverName, carDetails: props.bookingData.driverCarModel }}
                        />
                        <TextField className="standard-basic" inputRef={driverCostInputRef} defaultValue={props.bookingData.driverCost} sx={{ width: "300px", alignSelf: "center" }} label="Driver Cost" variant="standard" autoComplete='off' />
                        <TextField className="standard-basic" inputRef={companyCostInputRef} defaultValue={props.bookingData.companyCost} sx={{ width: "300px", alignSelf: "center" }} label="Company Cost" variant="standard" autoComplete='off' />
                    </div>
                </main>
                <footer>
                    <button onClick={editDriverSaveClickHandler} >Save</button>
                </footer>
            </div>
        </React.Fragment>
    )
}

export default EditDriver