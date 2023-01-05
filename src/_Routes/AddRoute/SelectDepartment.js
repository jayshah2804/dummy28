import React, { useEffect, useRef, useState } from 'react';
import StudentsInfo from './StopInfo';

import "./SelectDepartment.css";
import useHttp from '../../../Hooks/use-http';
import Loading from '../../../Loading/Loading';

// let selectedDepartment = "";
let dptId = "";
let error = "";
const DEPARTMENTS = ["Sales and Marketing", "Little school testing"];
const SelectDepartment = (props) => {
    const departmentInputRef = useRef();
    const [isDepartmentChanged, setIsDepartmentChanged] = useState();
    const [departmentList, setDepartmentList] = useState([]);
    const [isError, setIsError] = useState(error);

    const authenticateUser = (data) => {
        // console.log(data.DepartMentList);
        let departments = [];
        for(let i = 0; i < data.DepartMentList.length; i++){
            departments.push({
                name: data.DepartMentList[i].DepartmentName,
                dptID: data.DepartMentList[i].DepartmentID
            })
        }
        setDepartmentList(departments);
    };

    const { isLoading, sendRequest } = useHttp();

    useEffect(() => {
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
    }, [sendRequest]);

    const departmentChangeHandler = (e) => {
        // selectedDepartment = e.target.value;
        dptId = e.target.id;
        if (e.target.value)
            setIsError("");
    }
    const nextClickHandler = () => {
        // if (selectedDepartment) {
            setIsDepartmentChanged(prev => !prev);
            props.nextWizard("StopInfo");
        // } else setIsError("Department is invalid");
        // document.getElementsByClassName("add-route-container")[0].style.width = "max-content";
    }
    const backClickHandler = () => {
        props.backWizard("Departments");
        props.setIsNextClicked(false);
    }
    return (
        <React.Fragment>
            {!isDepartmentChanged &&
                <div className='department-container'>
                    <p>Select Department</p>
                    <div className='department-subcontainer'>
                        {isLoading && <Loading />}
                        {departmentList[0] && departmentList.map(data => {
                            return (
                                    <div style={{display: "inline-block"}}>
                                        <input type="radio" ref={departmentInputRef} name='department' id={data.dptID} onChange={departmentChangeHandler} value={data.name} /><span>{data.name}</span>
                                    </div>
                            );
                        })}
                        {isError && <p className='department-error'>{isError}</p>}
                    </div>
                    <div className='footer'>
                        <button onClick={backClickHandler}>Back</button>
                        <button onClick={nextClickHandler} >Next</button>
                    </div>
                </div>
            }
            {isDepartmentChanged && <StudentsInfo dptId={dptId} backWizard={props.backWizard} nextWizard={props.nextWizard} setIsDepartmentChanged={setIsDepartmentChanged} setIsAddRouteClicked={props.setIsAddRouteClicked} />}
        </React.Fragment>
    )
}

export default SelectDepartment