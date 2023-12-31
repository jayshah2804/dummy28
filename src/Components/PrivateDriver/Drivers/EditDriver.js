import React, { useState, useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import QRCode from "react-qr-code";

import DataTable from './DataTable'
import './EditDriver.css';
import useHttp from '../../../Hooks/use-http';

let corporatesData = [];
let selectedCorporateDetails = [];

Array.prototype.includesWithIndex = function (str) {
    for (let i = 0; i < this.length; i++) {
        if (this[i].toLowerCase().includes(str.toLowerCase()))
            return i;
    }
}
const EditDriver = () => {
    const [filteredCorporates, setFilteredCorporates] = useState([]);
    const [cpPrivateDriverData, setCpPrivateDriverData] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [isApiCall, setIsApiCall] = useState(false);

    const corporateNameClickHandler = (e, corporateDetails) => {
        if (corporateDetails) {
            selectedCorporateDetails = corporateDetails;
            setFilteredCorporates([]);
        } else
            selectedCorporateDetails = [];
        setIsDataLoading(true);
        setIsApiCall(true);
        setCpPrivateDriverData([]);
    }

    const privateDriverData = (data) => {
        setCpPrivateDriverData(data.PrivetDriverlist);
        setIsDataLoading(false);
        setIsApiCall(false);
    }

    const coroprateLists = (data) => {
        let tempArr = [];
        data.CorporateList?.forEach((cp, i) => {
            tempArr[i] = {};
            tempArr[i].cpName = cp.CorporateName;
            tempArr[i].cpId = cp.CorporateID;
            tempArr[i].adminDptId = cp.DepartmentID?.split(",")[(cp.DepartmentName.toLowerCase().split(",").includesWithIndex("admin"))];
        })
        corporatesData = tempArr;
    }

    const { isLoading, sendRequest } = useHttp();

    useEffect(() => {
        // if (isApiCall) {
        sendRequest(
            {
                url: "/api/v1/DriverList/GetPrivateDriverList",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    emailID: sessionStorage.getItem("user"),
                    roleID: sessionStorage.getItem("roleId"),
                    corporateID: selectedCorporateDetails?.cpId ? selectedCorporateDetails.cpId : "",
                    isDriver: "1",
                    isRider: "1"
                },
            },
            privateDriverData
        );
        // }
    }, [sendRequest, isApiCall]);

    useEffect(() => {
        sendRequest(
            {
                url: "/api/v1/Corporate/GetAllDepartmentByCorporate",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    emailID: sessionStorage.getItem("user"),
                },
            },
            coroprateLists
        );
    }, [sendRequest]);

    return (
        <div className='privateDriver-addEdit'>
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={corporatesData}
                sx={{ width: 300, margin: "40px 20px" }}
                getOptionLabel={(data) => data.cpName}
                renderInput={(params) => <TextField {...params} variant="standard" placeholder='Search Corporate Name' label="Corporate Name" />}
                onChange={(e, newValue) => corporateNameClickHandler(e, newValue)}
                defaultValue={sessionStorage.getItem("roleId") === "2" ? { cpName: sessionStorage.getItem("cpName") } : { cpName: "" }}
                disabled={sessionStorage.getItem("roleId") === "2" ? true : false}
            />
            {/* <div style={{ background: 'white', padding: '16px' }}>
                <QRCode
                    size={50}
                    style={{ height: "50%", maxWidth: "100%", width: "20%" }}
                    value="31847"
                    viewBox={`0 0 100 100`}
                />
            </div> */}
            <DataTable privateDrivers={cpPrivateDriverData ?? []} setIsApiCall={setIsApiCall} dataLoading={isLoading} selectedCorporateDetails={selectedCorporateDetails} />
        </div>
    )
}

export default EditDriver;