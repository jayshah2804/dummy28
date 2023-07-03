import React from "react";
import Loading from "../../Loading/Loading";
import Accordian from "./Accordian";

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
              <Accordian
                formyRender={func}
                id={index}
                car_info={item.car_info}
                total_trip_time={item.total_trip_time}
                drop_time={item.drop_time}
                pickup_time={item.pickup_time}
                trip_date={item.trip_date}
                journey_id={item.journey_id}
                driver_name={item.driver_name}
                total_trip_km={item.total_trip_km}
              />
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
