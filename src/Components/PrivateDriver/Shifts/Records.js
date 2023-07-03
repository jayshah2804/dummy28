import React from "react";
import Loading from "../../../Loading/Loading";
import { useReactToPrint } from "react-to-print";
import editImage from "../../../Assets/editIcon.png";
import { useHistory } from "react-router-dom";

const Records = ({ isLoading, data, headers }) => {
    const history = useHistory();
    const func = (val) => {
        if (val) {
            document.getElementById(val)?.click();
        }
    }

    return (
        <React.Fragment>
            {data[0] ?
                <table className="table" id="my-table">
                    <thead>
                        <tr>
                            {headers.map((data) => (
                                <th scope="col">{data}</th>
                            ))}
                            {sessionStorage.getItem("roleId") == "1" && <th>Corporate</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr>
                                <td>{item.driver_name}</td>
                                {/* <td>{item.shift_date}</td> */}
                                <td>{item.shift_startTime}</td>
                                <td>{item.shift_endTime}</td>
                                <td>{item.shift_startedOn ? item.shift_startedOn : "-"}</td>
                                <td>{item.shift_endedOn ? item.shift_endedOn : "-"}</td>
                                {/* <td>{item.status ? item.status : "-"}</td> */}
                                <td>{((new Date() > new Date(item.shift_startTime)) || item.shift_endedOn) ?
                                    (item.status ? item.status : "Expired") :
                                    <img onClick={() => history.push("/privatedrive/shift-creation?shiftId=" + item.shift_id)} style={{ width: "17px", height: "17px", cursor: "pointer" }} src={editImage} alt="edit" title="Click to edit details" />
                                }
                                </td>
                                {sessionStorage.getItem("roleId") == "1" && <td>{item.corporate}</td>}
                            </tr>
                        ))}
                    </tbody>
                </table> :
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
        </React.Fragment>
    );
};

export default Records;
