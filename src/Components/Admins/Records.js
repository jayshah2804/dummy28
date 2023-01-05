import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// import { FiUserPlus } from "react-icons/fi";
// import { FiUserX } from "react-icons/fi";
import { BiUser } from "react-icons/bi";
import "./Records.css";
import Loading from "../../Loading/Loading";

const Records = ({ isLoading, data, headers, departments }) => {
    const [editAdminClicked, setEditAdminClicked] = useState(false);
    const [isCheckChanged, setIsCheckChanged] = useState();
    const history = useHistory();
    const editAdminClickHandler = () => {
        setEditAdminClicked(true);
    }
    const departmentCheckChangeHandler = (e) => {
        for (let i = 0; i < departments.length; i++) {
            if (departments[i].name === e.target.value) {
                departments[i].checked = e.target.checked;
                break;
            }
        }
        setIsCheckChanged(prev => !prev);
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
                    {/* <tbody  onClick={(e) => console.log(e.target.parentElement.children[0])}> */}
                    <tbody>
                        {data.map(myData => <tr>
                            <td>{myData.name}</td>
                            <td>{myData.email}</td>
                            <td>{myData.mobile_no}</td>
                            <td width="30%">{myData.role}</td>
                            {sessionStorage.getItem("userType") !== "AccountManager" &&
                                <td style={{ fontSize: "20px" }}><BiUser onClick={editAdminClickHandler} title="Click to Edit user as Admin" style={{ color: "rgba(42, 149, 69, 255)", marginRight: "15px", cursor: "pointer" }} /></td>
                            }
                            {/* <td width="20%" >{myData.department}</td> */}
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
            {editAdminClicked &&
                <div className="admin-container">
                    <header>
                        <p>Edit Admin Details</p><p className="close" onClick={() => setEditAdminClicked(false)} >X</p>
                    </header>
                    <hr />
                    <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
                        <main>
                            <p>Please select or deselect to change the rights</p>
                            <div className="department-list">
                                {departments.map(data => {
                                    return (
                                        <div onChange={departmentCheckChangeHandler} >
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
            }
        </React.Fragment>
    );
};

export default Records;
