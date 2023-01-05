import React from "react";
import Loading from "../../Loading/Loading";
// import Accordian from "./Accordian";

const Records = ({ isLoading, data, headers }) => {
    const func = (val) => {
        if (val) {
            document.getElementById(val).click();
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
                                <td>{item.car_info}</td>
                                <td>{item.total_trip_time}</td>
                                <td>{item.pickup_time}</td>
                                <td>{item.trip_date}</td>
                                <td>{item.journey_id}</td>
                                <td>{item.driver_name}</td>
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
