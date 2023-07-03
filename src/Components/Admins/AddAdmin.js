import React from 'react'
import { useState } from 'react';
import "./AddAdmin.css";

const AddAdmin = (props) => {
    const [isCheckChanged, setIsCheckChanged] = useState();
    const departmentCheckChangeHandler = (e) => {
        for (let i = 0; i < props.departments.length; i++) {
            if (props.departments[i].name === e.target.value) {
                props.departments[i].checked = e.target.checked;
                break;
            }
        }
        setIsCheckChanged(prev => !prev);
    }
    return (
        <div className="admin-container">
            <header>
                <p>Add New Admin to the Department</p><p className="close" onClick={() => props.setIsAddAdminClicked(false)} >X</p>
            </header>
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
                <main>
                    <p>Add Admin Details</p>
                    <div className='admin-details'>
                        <input type="text" placeholder="Name" />
                        <input type="text" placeholder="Email" />
                        <input type="number" placeholder="Mobile No." />
                    </div>
                    <p className='selectDepartment-text'>Please select Department to add</p>
                    <div className="department-list">
                        {props.departments.map(data => {
                            return (
                                <div onChange={departmentCheckChangeHandler}>
                                    <input checked={data.checked} type="checkbox" id={data.name} name="vehicle1" value={data.name} />
                                    <label htmlFor={data.name}>{data.name}</label>
                                </div>
                            )
                        })}
                    </div>
                </main>
                <footer>
                    <button>Save Details</button>
                </footer>
            </div>
        </div>
    )
}

export default AddAdmin