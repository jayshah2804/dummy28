import React, { useRef, useState } from 'react';
import photo from "../../Assets/admin.jpg";
import "./Trips.css";

const TRIP_DATA = [
    {
        id: 1,
        driver_image: "",
        driver_name: "Anil Chauhan",
        car_info: "Alto, GJ 01 SH 0987",
        journey_id: "SDFGT65657",
        trip_date: "10/13/2022",
        pickup_time: "01:00 PM",
        drop_time: "03:00 PM",
        total_trip_time: "02:00 Hrs",
        total_trip_km: "46 KM"
    },
    {
        id: 2,
        driver_image: "",
        driver_name: "Anil Chauhan",
        car_info: "Alto, GJ 01 SH 0987",
        journey_id: "SDFGT65657",
        trip_date: "10/18/2022",
        pickup_time: "01:00 PM",
        drop_time: "03:00 PM",
        total_trip_time: "02:00 Hrs",
        total_trip_km: "46 KM"
    },
    {
        id: 3,
        driver_image: "",
        driver_name: "Anil Chauhan",
        car_info: "Alto, GJ 01 SH 0987",
        journey_id: "SDFGT65657",
        trip_date: "10/25/2022",
        pickup_time: "01:00 PM",
        drop_time: "03:00 PM",
        total_trip_time: "02:00 Hrs",
        total_trip_km: "46 KM"
    },
    {
        id: 4,
        driver_image: "",
        driver_name: "Anil Chauhan",
        car_info: "Alto, GJ 01 SH 0987",
        journey_id: "SDFGT65657",
        trip_date: "09/15/2022",
        pickup_time: "01:00 PM",
        drop_time: "03:00 PM",
        total_trip_time: "02:00 Hrs",
        total_trip_km: "46 KM"
    },
    {
        id: 5,
        driver_image: "",
        driver_name: "Anil Chauhan",
        car_info: "Alto, GJ 01 SH 0987",
        journey_id: "SDFGT65657",
        trip_date: "09/15/2022",
        pickup_time: "01:00 PM",
        drop_time: "03:00 PM",
        total_trip_time: "02:00 Hrs",
        total_trip_km: "46 KM"
    },
    {
        id: 6,
        driver_image: "",
        driver_name: "Anil Chauhan",
        car_info: "Alto, GJ 01 SH 0987",
        journey_id: "SDFGT65657",
        trip_date: "09/15/2022",
        pickup_time: "01:00 PM",
        drop_time: "03:00 PM",
        total_trip_time: "02:00 Hrs",
        total_trip_km: "46 KM"
    },
    {
        id: 7,
        driver_image: "",
        driver_name: "Anil Chauhan",
        car_info: "Alto, GJ 01 SH 0987",
        journey_id: "SDFGT65657",
        trip_date: "09/15/2022",
        pickup_time: "01:00 PM",
        drop_time: "03:00 PM",
        total_trip_time: "02:00 Hrs",
        total_trip_km: "46 KM"
    },
    {
        id: 8,
        driver_image: "",
        driver_name: "Anil Chauhan",
        car_info: "Alto, GJ 01 SH 0987",
        journey_id: "SDFGT65657",
        trip_date: "09/15/2022",
        pickup_time: "01:00 PM",
        drop_time: "03:00 PM",
        total_trip_time: "02:00 Hrs",
        total_trip_km: "46 KM"
    },
    {
        id: 9,
        driver_image: "",
        driver_name: "Anil Chauhan",
        car_info: "Alto, GJ 01 SH 0987",
        journey_id: "SDFGT65657",
        trip_date: "10/11/2022",
        pickup_time: "01:00 PM",
        drop_time: "03:00 PM",
        total_trip_time: "02:00 Hrs",
        total_trip_km: "46 KM"
    },
    {
        id: 10,
        driver_image: "",
        driver_name: "Anil Chauhan",
        car_info: "Alto, GJ 01 SH 0987",
        journey_id: "SDFGT65657",
        trip_date: "09/15/2022",
        pickup_time: "01:00 PM",
        drop_time: "03:00 PM",
        total_trip_time: "02:00 Hrs",
        total_trip_km: "46 KM"
    },
    {
        id: 11,
        driver_image: "",
        driver_name: "Anil Chauhan",
        car_info: "Alto, GJ 01 SH 0987",
        journey_id: "SDFGT65657",
        trip_date: "09/15/2022",
        pickup_time: "01:00 PM",
        drop_time: "03:00 PM",
        total_trip_time: "02:00 Hrs",
        total_trip_km: "46 KM"
    },
    {
        id: 12,
        driver_image: "",
        driver_name: "Anil Chauhan",
        car_info: "Alto, GJ 01 SH 0987",
        journey_id: "SDFGT65657",
        trip_date: "09/15/2020",
        pickup_time: "01:00 PM",
        drop_time: "03:00 PM",
        total_trip_time: "02:00 Hrs",
        total_trip_km: "46 KM"
    },
    {
        id: 13,
        driver_image: "",
        driver_name: "Anil Chauhan",
        car_info: "Alto, GJ 01 SH 0987",
        journey_id: "SDFGT65657",
        trip_date: "09/15/2019",
        pickup_time: "01:00 PM",
        drop_time: "03:00 PM",
        total_trip_time: "02:00 Hrs",
        total_trip_km: "46 KM"
    }
]

const TRIP_TITLE = ["Driver Name", "Journey_ID", "Trip Date", "Pickup Start Time", "Drop End Time", "Total Trip Time", "Total Trip KM"]

const Trips = () => {
    const [rawData, setRawData] = useState(TRIP_DATA);
    const startDateRef = useRef();
    const endDateRef = useRef();
    // rawData.length = 10;

    const dateChangeHandler = () => {
        if(startDateRef.current.value && endDateRef.current.value){
            let startdate = formatToMMDDYYYYfromYYYYMMDD(startDateRef.current.value);
            let enddate = formatToMMDDYYYYfromYYYYMMDD(endDateRef.current.value);
            startdate = new Date(startdate);
            enddate = new Date(enddate);
            console.log(startdate, enddate);
            setRawData(rawData.filter(myRawData => new Date(myRawData.trip_date) > startdate && new Date(myRawData.trip_date) < enddate));
        }
    }

    function formatToMMDDYYYYfromYYYYMMDD(inputDate){
        var date = new Date(inputDate);
        return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
    }

    function formatDate(date = new Date(), format = 'mm/dd/yy') {
        const map = {
            mm: date.getMonth() + 1,
            dd: date.getDate(),
            yy: date.getFullYear().toString(),
            yyyy: date.getFullYear()
        }
        return format.replace(/mm|dd|yy|yyy/gi, matched => map[matched])
    }

    function differenceInDays(date1, date2) {
        var Difference_In_Time = new Date(date2).getTime() - new Date(date1).getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        return Difference_In_Days;
    }

    const buttonFilterClickHandler = (e) => {
        if (e.target.innerText === "Today") {
            let todayDate = formatDate();
            setRawData(rawData.filter(myRawData => myRawData.trip_date === todayDate));
        }
        else if (e.target.innerText === "This Week") {
            let todayDate = formatDate();
            setRawData(rawData.filter(myRawData => differenceInDays(myRawData.trip_date, todayDate) <= 7));
        }
        else if (e.target.innerText === "This Month") {
            let todayDate = formatDate();
            setRawData(rawData.filter(myRawData => differenceInDays(myRawData.trip_date, todayDate) <= 31));
        }
    }

    return (
        <div>
            <table>
                <div onClick={buttonFilterClickHandler} style={{ display: "inline-block" }} >
                    <button>Today</button>
                    <button>This Week</button>
                    <button>This Month</button>
                </div>
                <div onChange={dateChangeHandler}>
                    <input type="date" ref={startDateRef} />
                    <input type="date" ref={endDateRef} />
                </div>
                <tr>{TRIP_TITLE.map((title) => <th>{title}</th>)}</tr>
                {rawData.map((data) => {
                    return (
                        <React.Fragment>
                            <tr key={data.id}>
                                <td style={{ display: "flex" }}>
                                    <img src={photo} alt='' style={{ width: "35px", height: "35px", objectFit: "cover", borderRadius: "50%" }} />
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <p>{data.driver_name}</p>
                                        <p>{data.car_info}</p>
                                    </div>
                                </td>
                                <td>{data.journey_id}</td>
                                <td>{data.trip_date}</td>
                                <td>{data.pickup_time}</td>
                                <td>{data.drop_time}</td>
                                <td>{data.total_trip_time}</td>
                                <td>{data.total_trip_km}</td>
                            </tr>
                        </React.Fragment>
                    )
                })}
            </table>
            <p>showing 1 to {rawData.length} of {TRIP_DATA.length} entries</p>
        </div>
    )
}

export default Trips;