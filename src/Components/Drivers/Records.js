import React from "react";
import Loading from "../../Loading/Loading";
import "./Records.css";

const Records = ({ isLoading, data, headers }) => {
    console.log(data);
    return (
        <React.Fragment>
            {data[0] ?
                <table className="table" id="my-table">
                    <thead>
                        <tr>
                            {headers.map((data) => (
                                <th>{data}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(myData => <tr>
                            <td style={{ display: "flex", gap: "10px", alignItems: "center", paddingLeft: "10px" }}>
                                <img src={myData.DriverImage} style={{width: "40px", height: "40px", borderRadius: "50%"}} />
                                <span>{myData.DriverName}</span>
                            </td>
                            <td>{myData.CarModel}</td>
                            <td>{myData.CarNumber}</td>
                            <td>{myData.Status}</td>
                            <td style={{position: "relative"}}><p style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}} className={myData.LiveStatus == "1" ? "live" : "not-live"}></p></td>
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
        </React.Fragment>
    );
};

export default Records;
