import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useHttp from '../../Hooks/use-http';
import "./AddDepartment.css";

import loadingGif from "../../Assets/loading-gif.gif";

var showVehicle = true;
var showRide = true;
let allow_inter_country = "No";
let lock_vehicle_type = "No";
let preferredVehicles = ["Null"];
let enableSerices = ["Null"];
const formError = {
    vehicleCategoryError: "",
    enabledServicesError: "",
    departmentNameError: "",
    adminNameError: "",
    adminEmailError: ""
}

const defaultValues = {
    allowInterCountry: false,
    lockVehicleType: false,
    preferredVehicleCategory: "",
    enabledServices: "",
    departmentname: "",
    adminName: "",
    adminEmail: ""
}

let isFormValid = false;
let addDeptFlag = 0;
let type = "";
const AddDepartment = () => {
    const [selectionChange, setSelectionChange] = useState();
    const [isFormError, setIsFormError] = useState(formError);
    const [isCall, setIsCall] = useState(false);
    const [departmentDefaultDetails, setDepartmentDefaultDetails] = useState(defaultValues);
    const departmentNameInputRef = useRef();
    const adminNameInputRef = useRef();
    const adminEmailInputRef = useRef();
    const history = useHistory();

    const search = useLocation().search;
    const id = new URLSearchParams(search).get('departmentId');
    if (id && type !== "create") type = "edit";

    const authenticateUser = (data) => {
        console.log(data);
        if (type === "edit") {
            if (data?.DepartMentDetails) {
                let department_data = {};
                if (data.DepartMentDetails[0].InterCountryTrips === "Y")
                    document.getElementsByTagName("input")[0].click();
                if (data.DepartMentDetails[0].LockVehicleType === "Y")
                    document.getElementsByTagName("input")[1].click();
                if (data.DepartMentDetails[0].AllowedVehicleTypes?.toLowerCase().includes("basic"))
                    document.getElementsByTagName("input")[2].click();
                if (data.DepartMentDetails[0].AllowedVehicleTypes?.toLowerCase() === "comfort")
                    document.getElementsByTagName("input")[3].click();
                if (data.DepartMentDetails[0].AllowedVehicleTypes?.toLowerCase().includes("plus"))
                    document.getElementsByTagName("input")[4].click();
                showVehicleCheckboxes();
                showVehicleCheckboxes();
                if (data.DepartMentDetails[0].AvailableServices?.toLowerCase().includes("ride"))
                    document.getElementsByTagName("input")[5].click();
                if (data.DepartMentDetails[0].AvailableServices?.toLowerCase().includes("food"))
                    document.getElementsByTagName("input")[6].click();
                showRideCheckboxes();
                showRideCheckboxes();
                department_data.preferredVehicleCategory = data.DepartMentDetails[0].AllowedVehicleTypes;
                department_data.enabledServices = data.DepartMentDetails[0].AvailableServices;
                department_data.departmentname = data.DepartMentDetails[0].DepartmentName;
                department_data.adminName = data.DepartMentDetails[0].AdminName;
                department_data.adminEmail = data.DepartMentDetails[0].AdminEmailID;
                setDepartmentDefaultDetails(department_data);
                setIsCall(true);
            }
        } else if (type === "create") {
            if (data?.Message === "Success") {
                history.push("/departments");
                window.location.reload();
                setIsCall(false);
            }
            else
                alert(data.SystemMessage)
        }
    };

    const { isLoading, sendRequest } = useHttp();

    useEffect(() => {
        if (!isCall && id && addDeptFlag % 2 !== 0)
            sendRequest({
                url: "/api/v1/Department/GetDepartmentDetails",
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    emailID: sessionStorage.getItem("user"),
                    departmentID: id
                }
            }, authenticateUser);

        if (isCall === "Success")
            sendRequest({
                url: "/api/v1/Department/AddEditDepartment",
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    emailID: sessionStorage.getItem("user"),
                    adminEmail: adminEmailInputRef.current.value,
                    adminName: adminNameInputRef.current.value,
                    buttonMark: id ? "M" : "I",
                    departmentID: id ? id : "",
                    departmentname: departmentNameInputRef.current.value.toLowerCase().includes("department") ? departmentNameInputRef.current.value : (departmentNameInputRef.current.value + "Department"),
                    parentID: sessionStorage.getItem("corpId"),
                    interCountryTrips: allow_inter_country === "Yes" ? "Y" : "N",
                    lockVehicleType: lock_vehicle_type === "Yes" ? "Y" : "N",
                    allowedVehicleType: preferredVehicles.toString(),
                    availableServices: enableSerices.toString()
                }
            }, authenticateUser);
        addDeptFlag++;
    }, [sendRequest, isCall])

    function showVehicleCheckboxes() {
        var checkboxes = document.getElementsByClassName("multipleSelection")[0].children[1];

        if (showVehicle) {
            checkboxes.style.display = "block";
            showVehicle = false;
        } else {
            let length = document.getElementsByClassName("multipleSelection")[0].children[1].children.length;
            preferredVehicles = [];
            for (let i = 0; i < length; i++) {
                if (document.getElementsByClassName("multipleSelection")[0].children[1].children[i]?.checked)
                    preferredVehicles.push(document.getElementsByClassName("multipleSelection")[0].children[1].children[i].value)
            }
            if (preferredVehicles.toString())
                document.getElementsByTagName("select")[0].children[0].innerText = preferredVehicles.toString();
            else {
                document.getElementsByTagName("select")[0].children[0].innerText = "Select";
                preferredVehicles = ["Null"];
            }
            checkboxes.style.display = "none";
            showVehicle = true;
            setSelectionChange(prev => !prev);
        }
    }
    function showRideCheckboxes() {
        var checkboxes = document.getElementsByClassName("multipleSelection")[1].children[1];

        if (showRide) {
            checkboxes.style.display = "block";
            showRide = false;
        } else {
            let length = document.getElementsByClassName("multipleSelection")[1].children[1].children.length;
            enableSerices = [];
            for (let i = 0; i < length; i++) {
                if (document.getElementsByClassName("multipleSelection")[1].children[1].children[i]?.checked)
                    enableSerices.push(document.getElementsByClassName("multipleSelection")[1].children[1].children[i].value)
            }
            if (enableSerices.toString())
                document.getElementsByTagName("select")[1].children[0].innerText = enableSerices.toString();
            else {
                document.getElementsByTagName("select")[1].children[0].innerText = "Select";
                enableSerices = ["Null"];
            }
            checkboxes.style.display = "none";
            showRide = true;
            setSelectionChange(prev => !prev);
        }
    }

    const interCountryChangeHandler = (e) => {
        e.target.checked ? allow_inter_country = "Yes" : allow_inter_country = "No";
        setSelectionChange(prev => !prev);
        // console.log(allow_inter_country);
    }
    const lockVehicleTypeChangeHandler = (e) => {
        e.target.checked ? lock_vehicle_type = "Yes" : lock_vehicle_type = "No";
        setSelectionChange(prev => !prev);
    }

    const createDepartmentClickedHandler = () => {
        type = "create";
        setIsCall("Success");
    }

    return (
        <div className='add-department-container' id='add-department'>
            <div>
                <h3>{id ? "Edit Department" : "ADD NEW DEPARTMENT"}</h3>
            </div>
            <div className='add-department-subcontainer'>
                <div>
                    <main>
                        <header style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>Allow Inter Country</span>
                            <label class="switch" for="checkbox">
                                <input type="checkbox" id="checkbox" className='first' onChange={interCountryChangeHandler} />
                                <div class="slider round"></div>
                            </label>
                        </header>
                        <div className='text'>This option enables one to take Corporate Trips in different countries</div>
                    </main>
                    <footer></footer>
                </div>
                <div>
                    <main>
                        <header style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>Lock Vehicle Type</span>
                            <label class="switch" for="checkbox2">
                                <input type="checkbox" id="checkbox2" className='first' onChange={lockVehicleTypeChangeHandler} />
                                <div class="slider round"></div>
                            </label>
                        </header>
                        <div className='text'>If set to 'YES' this will restrict all staff in this corporate from changing the approved vehicle type when requesting for a trip</div>
                    </main>
                    <footer></footer>
                </div>
                <div>
                    <main onMouseEnter={showVehicleCheckboxes} onMouseLeave={showVehicleCheckboxes} >
                        <header>
                            <span>Preferred Vehicle Categories</span>
                        </header>
                        <div class="multipleSelection">
                            <div class="selectBox">
                                <select >
                                    <option>Select</option>
                                </select>
                                <div class="overSelect"></div>
                            </div>

                            <div id="checkBoxes">
                                <input type="checkbox" value="Basic" id="first" /><label htmlFor='first' >Basic</label>
                                <br />
                                <input type="checkbox" value="Comfort" id="second" /><label htmlFor='second'>Comfort</label>
                                <br />
                                <input type="checkbox" value="Comfort Plus" id="third" /><label htmlFor='third'>Comfort Plus</label>
                                <br />
                            </div>
                        </div>
                        <div className='text'>Select the vehicle categories you wish your company to use</div>
                    </main>
                    <footer></footer>
                </div>
                <div>
                    <main onMouseEnter={showRideCheckboxes} onMouseLeave={showRideCheckboxes}>
                        <header>
                            <span>Enabled Services</span>
                        </header>
                        <div class="multipleSelection">
                            <div class="selectBox">
                                <select>
                                    <option>Select</option>
                                </select>
                                <div class="overSelect"></div>
                            </div>

                            <div id="checkBoxes">
                                <input type="checkbox" value="Ride" id="first1" /><label htmlFor='first1'>Ride</label>
                                <br />
                                <input type="checkbox" value="Food" id="second1" /><label htmlFor='second1'>Food</label>
                                <br />
                            </div>
                        </div>
                        <div className='text'>Select the Services you wish your company to use</div>
                    </main>
                    <footer></footer>
                </div>
            </div>
            <div className='create-department'>
                <header>Create Department</header>
                <br />
                <div className='sub-container'>
                    <div>
                        <span>Allow Inter Country: </span><span>{allow_inter_country}</span>
                    </div>
                    <div>
                        <span>Lock Vehicle Type: </span><span>{lock_vehicle_type}</span>
                    </div>
                    <div>
                        <span>Preferred Vehicle Categories: </span><span>{preferredVehicles.toString()}</span>
                    </div>
                    <div>
                        <span>Enabled Services: </span><span>{enableSerices.toString()}</span>
                    </div>
                </div>
                <div className='admin-details'>
                    <input defaultValue={departmentDefaultDetails.departmentname} type="text" placeholder='Department Name' ref={departmentNameInputRef} />
                    <input defaultValue={departmentDefaultDetails.adminName} type="text" placeholder='Admin Name' ref={adminNameInputRef} />
                    <input defaultValue={departmentDefaultDetails.adminEmail} type="email" placeholder='Admin Email' ref={adminEmailInputRef} />
                </div>
                <br />
                <button onClick={createDepartmentClickedHandler} >{!id ? "Create Department" : "Edit Department"}</button>
            </div>
            {isLoading &&
                <img src={loadingGif} style={{ position: "absolute", top: "40%", left: "45%" }} />
            }
        </div>
    )
}

export default AddDepartment