import React from 'react';
import { useState } from 'react';
import classes from "./Notification.module.css";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useEffect } from 'react';
import useHttp from '../../Hooks/use-http';
import notification_live_trip from "../../Assets/notification_live_trip.png";
import notification_department_add from "../../Assets/notification_department_add.png";
import notification_rider from "../../Assets/notification_rider.png";

const NOTIFICATION_DATA = [
    {
        title: "Another meeting today,",
        status: " at 12:00 PM",
        time: "Just Now",
    },
    {
        title: "Application",
        status: " Error",
        time: "Just Now",
    },
    {
        title: "New User Registration",
        time: "2 days ago",
    },
    {
        title: "Application",
        status: " Error",
        time: "2 days ago",
    },
];

let flag = true;
let count = "";
const Notification = (props) => {
    const [isNotificationIconClicked, setIsNotificationIconClicked] = useState(false);
    const [notificationData, setNotificationData] = useState([]);

    const authenticateUser = (data) => {
        // console.log(data.NotificationList);
        let date = new Date();
        let current = date.getDate();
        let notificationData = [];
        count = null;
        // count = data.NotificationList?.length;
        let time;
        let status;

        function formatToMMDDYYYYfromYYYYMMDD(inputDate) {
            var date = new Date(inputDate);
            return (
                date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
            );
        }

        for (let i = 0; i < data.NotificationList.length; i++) {
            let createdon = data.NotificationList[i].CreatedOn;
            // let digits = createdon.split(" ")[0];
            let H = createdon.split(":")[0]
            let M = createdon.split(":")[1]
            if (+M + 30 >= 60) {
                H = +H + 1;
                M = +M + 30 - 60;
            } else M = +M + 30
            if (+H + 5 > 24) H = +H + 5 - 24
            else H = +H + 5
            if (M.toString().length === 1) M = "0" + M.toString();

            let newDate = data.NotificationList[i].CreatedDate.replaceAll("-", "/");
            let myDate = formatToMMDDYYYYfromYYYYMMDD(newDate);
            let d = new Date(myDate);
            d.setHours(H);
            d.setMinutes(M);
            if (+localStorage.getItem("notificationClickedTime") < d.getTime()) count += 1;

            if (H > 12) {
                H = H - 12;
                if (H.toString().length === 1) H = "0" + H.toString();
                status = " at " + H + ":" + M + " PM";
            } else {
                if (H.toString().length === 1) H = "0" + H.toString();
                status = " at " + H + ":" + M + " AM";
            }

            if (+data.NotificationList[i].CreatedDate.split("-")[2] === current) time = "Today";
            else if (+data.NotificationList[i].CreatedDate.split("-")[2] === current - 1) time = "Yesterday";
            else time = "2 days ago";
            notificationData.push({
                title: data.NotificationList[i].Description,
                status,
                time
            })
        }
        setNotificationData(notificationData);
    };

    const { isLoading, sendRequest } = useHttp();

    useEffect(() => {
        if (flag) {
            let interval = setInterval(() => {
                sendRequest({
                    url: "/api/v1/Header/GetNotification",
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: {
                        emailID: sessionStorage.getItem("user"),
                        corporateID: sessionStorage.getItem("corpId")
                    }
                }, authenticateUser);
            }, 10000)
            flag = false;
        }
    }, [sendRequest]);

    useEffect(() => {
        if (props.isAdminPhotoClicked) setIsNotificationIconClicked(false);
    }, [props.isAdminPhotoClicked]);

    const notificationIconClicked = () => {
        count = null;
        localStorage.setItem("notificationClickedTime", new Date().getTime());
        props.setIsAdminPhotoClicked(false);
        setIsNotificationIconClicked((prev) => !prev);
    };

    return (
        <React.Fragment>
            <div className={classes.notificationIcon} >
                <IoMdNotificationsOutline onClick={notificationIconClicked} />
                {isNotificationIconClicked && (
                    <React.Fragment>
                        <div className={classes.backdrop} onClick={() => setIsNotificationIconClicked(false)} ></div>
                        <div className={classes.notificationPanel}>
                            <div className={classes.topBorder}></div>
                            <div className={classes.header} >Notification</div>
                            <hr />
                            <div className={classes.notificationdataContainer}>
                                {notificationData.length > 0 ? notificationData.map((ele) => {
                                    return (
                                        <div className={classes.data} >
                                            <img className={classes.icon} src={ele.title.toLowerCase().includes("department") ? notification_department_add : (ele.title.toLowerCase().includes("rider") ? notification_rider : notification_live_trip)} ></img>
                                            <div style={{width: "-webkit-fill-available"}}>
                                                {/* <div> */}
                                                    <span className={classes.title} >{ele.title}</span>
                                                {/* </div> */}
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", marginTop: "3px" }}>
                                                    <span className={classes.status}>
                                                        {ele.status}
                                                    </span>
                                                    <p className={classes.time} >
                                                        {ele.time}
                                                    </p>
                                                </div>
                                                <div style={{ marginTop: "10px", borderTop: "1px solid #80808073" }}></div>
                                            </div>
                                        </div>
                                    );
                                }) : <p className={classes.content}>No new notifications</p>
                                }
                            </div>
                        </div>
                    </React.Fragment>
                )}
            </div>
            {count &&
                <span className={classes.notificationCount} >{count}</span>
            }
        </React.Fragment>
    )
}

export default Notification