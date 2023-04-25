import React from "react";
import Loading from "../../../Loading/Loading";
import { useReactToPrint } from "react-to-print";

const Records = ({ isLoading, data, headers }) => {

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
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr>
                                <td>{item.driver_name}</td>
                                {/* <td>{item.shift_date}</td> */}
                                <td>{item.shift_startTime}</td>
                                <td>{item.shift_endTime}</td>
                                <td>{item.shift_startedOn}</td>
                                <td>{item.shift_endedOn}</td>
                                <td>{item.status}</td>
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
