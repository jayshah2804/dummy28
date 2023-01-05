import React, { useEffect, useRef, useState } from 'react';
import TimingsInfo from './TimingsInfo';
import "./RouteInfo.css";
import useHttp from '../../../Hooks/use-http';
import loadingGif from "../../../Assets/loading-gif.gif";

let prev = "";
let current = "RouteInfo";
let next = "";
let flag = 0;
let error = {
    routeName: "",
    routeType: "",
    shuttleType: ""
}

let defaultShuttleTimings = "";
function RouteInfo(props) {
    const routeNameInputRef = useRef();
    const routeTypeSelectRef = useRef();
    const shuttleTypeSelectRef = useRef();
    const [isNextClicked, setIsNextClicked] = useState();
    const [isError, setIsError] = useState(error);


    const authenticateUser = (data) => {
        // console.log(data);
        sessionStorage.setItem("routeDetails", JSON.stringify(data.RouteDetails));
        defaultShuttleTimings = data.ShuttleTiming;
        let routeName = data.Route[0].RouteName;
        let routeType = data.Route[0].RouteType;
        let shuttleType = data.Route[0].ShuttleTypeName;
        // alert(shuttleType);
        setTimeout(() => {
            routeNameInputRef.current.value = routeName;
            routeTypeSelectRef.current.value = routeType;
            shuttleTypeSelectRef.current.value = shuttleType;
            if (props.routeId) document.getElementsByTagName("select")[0].setAttribute("disabled", "disabled");
        })
        sessionStorage.setItem("routeName", routeName);
        sessionStorage.setItem("routeType", routeType);
        if (shuttleType.toLowerCase() === "basic") sessionStorage.setItem("shuttleType", 1);
        else if (shuttleType.toLowerCase() === "comfort") sessionStorage.setItem("shuttleType", 2);
        else if (shuttleType.toLowerCase() === "comfort plus") sessionStorage.setItem("shuttleType", 3);
        else if (shuttleType.toLowerCase() === "busbuddy") sessionStorage.setItem("shuttleType", 4);
    };

    const { isLoading, sendRequest } = useHttp();

    useEffect(() => {
        if (props.routeId && flag > 0) {
            sendRequest({
                url: "/api/v1/Route/GetRouteDetails",
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    emailID: sessionStorage.getItem("user"),
                    routeID: props.routeId
                }
            }, authenticateUser);
        }
        flag++;
    }, [sendRequest]);

    const routeNameChangeHandler = () => {
        if (routeNameInputRef.current.value) {
            sessionStorage.setItem("routeName", routeNameInputRef.current.value);
            setIsError(prev => ({ ...prev, routeName: "" }));
        }
    }
    const routeTypeChangeHandler = () => {
        if (routeTypeSelectRef.current.value !== "Route Type") {
            sessionStorage.setItem("routeType", routeTypeSelectRef.current.value);
            setIsError(prev => ({ ...prev, routeType: "" }));
        }
    }

    const shuttleTypeChangeHandler = () => {
        if (shuttleTypeSelectRef.current.value !== "Shuttle Type") {
            if (shuttleTypeSelectRef.current.value.toLowerCase() === "basic")
                sessionStorage.setItem("shuttleType", "1");
            else if (shuttleTypeSelectRef.current.value.toLowerCase() === "comfort")
                sessionStorage.setItem("shuttleType", "2");
            else if (shuttleTypeSelectRef.current.value.toLowerCase() === "comfort plus")
                sessionStorage.setItem("shuttleType", "3");
            else if (shuttleTypeSelectRef.current.value.toLowerCase() === "busbuddy")
                sessionStorage.setItem("shuttleType", "4");
            setIsError(prev => ({ ...prev, shuttleType: "" }));
        }
    }

    const nextWizard = (value) => {
        console.log(current, "value");
        document.getElementById(current).classList.remove("in-progress");
        document.getElementById(current).classList.add("complete");
        if (value === "TimingInfo") {
            prev = "RouteInfo";
            current = value;
            next = "StopInfo";
        }
        if (value === "StopInfo") {
            prev = "TimingInfo";
            current = value;
            next = "";
        }
        if (value !== "Submit")
            document.getElementById(current).classList.add("in-progress");
    }

    const backWizard = (value) => {
        document.getElementById(current).classList.remove("in-progress");
        document.getElementById(prev).classList.remove("complete");
        document.getElementById(prev).classList.add("in-progress");
        if (value === "TimingInfo") {
            current = "RouteInfo";
            next = "TimingInfo";
        }
        if (value === "StopInfo") {
            current = "TimingInfo";
            next = "StopInfo";
            prev = "RouteInfo";
        }
    }

    const nextClickHandler = () => {
        if (routeNameInputRef.current.value && routeTypeSelectRef.current.value !== "Route Type" && shuttleTypeSelectRef.current.value !== "Shuttle Type") {
            current = "RouteInfo";
            nextWizard("TimingInfo");
            setIsNextClicked(true);
        } else {
            if (!routeNameInputRef.current.value)
                setIsError(prev => ({ ...prev, routeName: "Route name is invalid" }));
            if (routeTypeSelectRef.current.value === "Route Type")
                setIsError(prev => ({ ...prev, routeType: "Route type is invalid" }));
            if (shuttleTypeSelectRef.current.value === "Shuttle Type")
                setIsError(prev => ({ ...prev, shuttleType: "Shuttle type is invalid" }));
        }
    }
    const backClickHandler = () => {
        backWizard("TimingInfo");
    }
    return (
        <React.Fragment>
            {/* {
                isLoading ?
                    <img src={loadingGif} style={{ position: "absolute", top: "35%", left: "45%", zIndex: "100" }
                    } /> : */}
            <div className="add-route-container">
                <header>
                    <div> {props.routeId ? "Edit Shuttle Route" : "Shuttle Route Creation"}</div>
                    <div className='closeIcon' onClick={() => window.location.reload()}>X</div>
                </header>
                <hr />
                <br />
                <div className="wizard-progress">
                    <div className="step in-progress" id="RouteInfo">
                        Route Info
                        <div className="node"></div>
                    </div>
                    <div className="step" id="TimingInfo">
                        Timing Info
                        <div className="node"></div>
                    </div>
                    <div className="step" id="StopInfo">
                        Stop Info
                        <div className="node"></div>
                    </div>
                </div>
                {!isNextClicked &&
                    <div className='routeInfo-container'>
                        <div className='routeInfo-subContainer'>
                            <div>
                                <input type="text" id="route-name" ref={routeNameInputRef} placeholder='Route Name' onChange={routeNameChangeHandler} />
                                {isError.routeName && <p className='error' >{isError.routeName}</p>}
                            </div>
                            <div >
                                <select ref={routeTypeSelectRef} onChange={routeTypeChangeHandler} >
                                    <option disabled selected>Route Type</option>
                                    <option>Pickup</option>
                                    <option>Drop</option>
                                </select>
                                {isError.routeType && <p className='error'>{isError.routeType}</p>}
                            </div>
                            <div>
                                <select ref={shuttleTypeSelectRef} onChange={shuttleTypeChangeHandler} >
                                    <option disabled selected>Shuttle Type</option>
                                    <option>Basic</option>
                                    <option>Comfort</option>
                                    <option>Comfort plus</option>
                                    <option>BusBuddy</option>
                                </select>
                                {isError.shuttleType && <p className='error'>{isError.shuttleType}</p>}
                            </div>
                        </div>
                        <button className='nextButton' onClick={nextClickHandler}>Next</button>
                    </div>
                }
                {isNextClicked && <TimingsInfo routeCreationStatus={props.routeCreationStatus} routeId={props.routeId} defaultShuttleTimings={defaultShuttleTimings} routeType={sessionStorage.getItem("routeType")} nextWizard={nextWizard} backWizard={backWizard} setIsNextClicked={setIsNextClicked} backClickHandler={backClickHandler} setIsAddRouteClicked={props.setIsAddRouteClicked} />}
            </div>
        </React.Fragment>
    )
}

export default RouteInfo;