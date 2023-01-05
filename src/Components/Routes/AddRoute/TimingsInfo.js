import React, { useEffect, useRef, useState } from 'react';
import SelectDepartment from './SelectDepartment';
import StudentsInfo from './StopInfo';

import "./TimingsInfo.css";

const TIMINGS =
{
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: ""
}

let dayName = "";
const TimingsInfo = (props) => {
    const timeInputRef = useRef();
    const [isDayTimeChange, setIsDayTimeChange] = useState({ dayname: "" });
    const [isTimingChange, setIsTimingChange] = useState();
    const [isNextClicked, setIsNextClicked] = useState();
    const [isError, setIsError] = useState("");

    useEffect(() => {
        if (props.defaultShuttleTimings) {
            let obj = {
                1: "monday",
                2: "tuesday",
                3: "wednesday",
                4: "thursday",
                5: "friday",
                6: "saturday",
                7: "sunday"
            }
            for (let i = 0; i < props.defaultShuttleTimings.length; i++) {
                TIMINGS[obj[props.defaultShuttleTimings[i].WeekDay]] = props.defaultShuttleTimings[i].StartTime.split("T")[1];
            }
            console.log(TIMINGS);
            setIsTimingChange(prev => !prev);
        }
    }, []);

    const nextClickHandler = () => {
        if (TIMINGS.monday || TIMINGS.tuesday || TIMINGS.wednesday || TIMINGS.thursday || TIMINGS.friday || TIMINGS.saturday || TIMINGS.sunday) {
            props.nextWizard("StopInfo");
            setIsNextClicked(true);
            setIsError("");
        } else
            setIsError("Please set the timing for atleast one day");
    }
    const backClickHandler = () => {
        props.backClickHandler("TimingInfo");
        props.setIsNextClicked(false);
    }
    const timeChangeHandler = () => {
        if (isDayTimeChange.dayname) {
            dayTimeChangeHandler(dayName);
        } else {
            TIMINGS.monday = timeInputRef.current.value;
            TIMINGS.tuesday = timeInputRef.current.value;
            TIMINGS.wednesday = timeInputRef.current.value;
            TIMINGS.thursday = timeInputRef.current.value;
            TIMINGS.friday = timeInputRef.current.value;
            TIMINGS.saturday = timeInputRef.current.value;
            TIMINGS.sunday = timeInputRef.current.value;
        }
        setIsTimingChange(prev => !prev);
        setIsError("");
    }

    sessionStorage.setItem("timings", JSON.stringify({
        monday: TIMINGS.monday,
        tuesday: TIMINGS.tuesday,
        wednesday: TIMINGS.wednesday,
        thursday: TIMINGS.thursday,
        friday: TIMINGS.friday,
        saturday: TIMINGS.saturday,
        sunday: TIMINGS.sunday,
    }));

    const dayTimeChangeHandler = (dayName) => {
        TIMINGS[dayName.toLowerCase()] = timeInputRef.current.value;
    }

    const dayButtonClickHandler = (e) => {
        dayName = e.target.innerText;
        setIsDayTimeChange(prev => ({ ...prev, dayname: dayName }));
    }
    const disableDayClickHandler = () => {
        TIMINGS[dayName.toLowerCase()] = "";
        setIsTimingChange(prev => !prev);
    }
    return (
        <React.Fragment>
            {!isNextClicked &&
                <div className='timingsInfo-container' >
                    {isDayTimeChange.dayname &&
                        <div className='dayTimeChange-container'>
                            <p>Change the time for the {dayName} </p>
                            <p>Or to disable the {dayName} <span onClick={disableDayClickHandler} >click here</span></p>
                        </div>
                    }
                    {isError && <p className='error'>{isError}</p>}
                    <label style={{ marginLeft: "6%", marginRight: "-3%" }} >{props.routeType} Time:</label>
                    <input type="time" ref={timeInputRef} onChange={timeChangeHandler} className="pickuptime-input" />
                    {/* <br /> */}
                    <div className='dayList-container' onClick={dayButtonClickHandler} >
                        <div className='dayList-subcontainer'>
                            <div>
                                <button>Monday</button>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    {TIMINGS.monday && <span className='selected-time' >{TIMINGS.monday}</span>}
                                </div>
                            </div>
                            <div>
                                <button>Tuesday</button>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    {TIMINGS.tuesday && <span className='selected-time'>{TIMINGS.tuesday}</span>}
                                </div>
                            </div>
                            <div>
                                <button>Wednesday</button>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    {TIMINGS.wednesday && <span className='selected-time'>{TIMINGS.wednesday}</span>}
                                </div>
                            </div>
                        </div>
                        <div className='dayList-subcontainer'>
                            <div>
                                <button>Thursday</button>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    {TIMINGS.thursday && <span className='selected-time'>{TIMINGS.thursday}</span>}
                                </div>
                            </div>
                            <div>
                                <button>Friday</button>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    {TIMINGS.friday && <span className='selected-time' > {TIMINGS.friday}</span>}
                                </div>
                            </div>
                            <div>
                                <button>Saturday</button>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    {TIMINGS.saturday && <span className='selected-time' >{TIMINGS.saturday}</span>}
                                </div>
                            </div>
                        </div>
                        <div>
                            <button>Sunday</button>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                {TIMINGS.sunday && <span className='selected-time'>{TIMINGS.sunday}</span>}
                            </div>
                        </div>
                    </div>
                    <footer>
                        <button className='button' onClick={backClickHandler} >Back</button>
                        <button className='button' onClick={nextClickHandler}>Next</button>
                    </footer>
                </div>
            }
            {isNextClicked && <StudentsInfo routeCreationStatus={props.routeCreationStatus} routeId={props.routeId} backWizard={props.backWizard} nextWizard={props.nextWizard} setIsNextClicked={setIsNextClicked} setIsAddRouteClicked={props.setIsAddRouteClicked} />}
        </React.Fragment >
    )
}

export default TimingsInfo