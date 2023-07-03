import React, { useRef } from 'react';
import { useState } from 'react';
import "./Stops.css";
import StopsMap from './StopsMap';
import connectionPoint from "../../Assets/start_location.png";
import threedots from "../../Assets/route_3dots.png";
import endPoint from "../../Assets/place_outline.png";

let indexToBeMove;
let indexToBeShift;
const TIMINGS_DATA = [
    {
        day: "Monday",
        pickup: "11:00",
        drop: "18:00"
    },
    {
        day: "Tuesday",
        pickup: "11:00",
        drop: "18:00"
    },
    {
        day: "Wednesday",
        pickup: "11:00",
        drop: "18:00"
    },
    {
        day: "Thursday",
        pickup: "11:00",
        drop: "18:00"
    },
    {
        day: "Friday",
        pickup: "11:00",
        drop: "18:00"
    },
    {
        day: "Saturday",
        pickup: "11:00",
        drop: "18:00"
    },
    {
        day: "Sunday",
        pickup: "11:00",
        drop: "18:00"
    },
]
const STOPS = [
    {
        stopName: "S.S. Divine School",
        location: { lat: 23.04272371760406, lng: 72.53682455444338 },
        status: false
    },
    {
        stopName: "Craft Silicon",
        location: {
            lat: 23.020922774165125,
            lng: 72.46970495605471
        },
        studnets: ["Jay Shah"],
        status: false
    },
    {
        stopName: "Craft Silicon",
        location: {
            lat: 23.020922774165125,
            lng: 72.46970495605471
        },
        studnets: ["Het Desai"],
        status: false
    },
    {
        stopName: "JEEP Ahmedabad",
        location: {
            lat: 23.015234991655756,
            lng: 72.51416525268557
        },
        studnets: ["Dev Shah"],
        status: false
    },
    {
        stopName: "Divya Bhaskar Office",
        location: {
            lat: 23.034509283424683,
            lng: 72.55879721069338
        },
        studnets: ["Darshan Kansara"],
        status: false
    },
    {
        stopName: "L.D. College of Enginnering",
        location: {
            lat: 22.993429603752258,
            lng: 72.5378545227051
        },
        studnets: ["Nihar Gupte", "Roshan Patel"],
        status: false
    },
]

let myList;
let myFLag = true;
let a = "18:00";
const Stops = () => {
    const [stopList, setStopList] = useState(STOPS);

    function slist(target) {
        let items = target.getElementsByTagName("li");
        let current = null;

        for (let i = 1; i < items.length; i++) {
            items[i].ondragstart = (ev) => {
                current = items[i];
                items[i].classList.add("my");
            };
            items[i].ondragover = (evt) => { evt.preventDefault(); };

            items[i].ondragend = () => {
                for (let it of items) {
                    it.classList.remove("my");
                }
            };

            items[i].ondrop = (evt) => {
                evt.preventDefault();
                items[i].classList.remove("my");

                if (items[i] != current) {
                    let currentpos = 0, droppedpos = 0;
                    for (let it = 0; it < items.length; it++) {
                        if (current == items[it]) { currentpos = it; }
                        if (items[i] == items[it]) { droppedpos = it; }
                    }

                    stopList.map((data, index) => {
                        if (data.stopName === document.getElementById(current.id).innerText)
                            indexToBeMove = index;
                        if (data.stopName === document.getElementById(items[i].id).innerText)
                            indexToBeShift = index;
                    })
                    if (currentpos < droppedpos) {
                        // items[i].parentNode.insertBefore(current, items[i].nextSibling);
                        stopList.splice(+indexToBeShift + 1, 0, stopList[indexToBeMove]);
                        stopList.splice(indexToBeMove, 1);
                    } else {
                        // items[i].parentNode.insertBefore(current, items[i]);
                        stopList.splice(indexToBeShift, 0, stopList[indexToBeMove]);
                        stopList.splice(+indexToBeMove + 1, 1);
                    }
                }
                let newList = structuredClone(stopList);
                setStopList(newList);
            };
        }
    }
    const crossClickHandler = (e, targetIndex) => {
        let newList;
        if (targetIndex) {
            stopList.splice(targetIndex, 1);
            newList = structuredClone(stopList);
        } else {
            let holdingIndex = 0;
            for (let i = 0; i < stopList.length; i++) {
                if (stopList[i].stopName !== e.target.parentNode.children[0].innerText) {
                    stopList[holdingIndex] = stopList[i];
                    holdingIndex++;
                }
            }
            stopList.length = holdingIndex;
            newList = structuredClone(stopList);
        }
        setStopList(newList);
    }

    const subCrossClickHandler = (e) => {
        let targetIndex = 0;
        for (let i = 0; i < stopList.length; i++) {
            if (stopList[i].studnets?.includes(e.target.parentNode.children[0].innerText))
                targetIndex = i;
        }

        let holdingIndex = 0;
        if (stopList[targetIndex].studnets.length > 1) {
            for (let i = 0; i < stopList[targetIndex].studnets.length; i++) {
                if (stopList[targetIndex].studnets[i] !== e.target.parentNode.children[0].innerText) {
                    stopList[targetIndex].studnets[holdingIndex] = stopList[targetIndex].studnets[i];
                    holdingIndex++;
                }
            }
            let newList = structuredClone(stopList);
            newList[targetIndex].studnets.length = holdingIndex;
            setStopList(newList);
        } else {
            crossClickHandler(null, targetIndex);
        }
    }

    if (myFLag) {
        let arr = [];
        for (let i = 0; i < stopList.length; i++) {
            if (arr.includes(stopList[i].stopName)) {
                stopList[i - 1].studnets.push(stopList[i].studnets);
                stopList.splice(i, 1);
            }
            arr.push(stopList[i].stopName);
        }
        setTimeout(() => {
            document.getElementById("asdf").click();
        });
        myFLag = false;
    }

    setTimeout(() => {
        for (let i = 0; i < document.getElementsByClassName("stopNames-container").length; i++) {
            if (i !== 0) {
                document.getElementsByClassName("stopNames-container")[i].addEventListener("mouseover", () => {
                    document.getElementsByClassName("cross")[i].classList.add("myClassName");
                })
                document.getElementsByClassName("stopNames-container")[i].addEventListener("mouseleave", () => {
                    document.getElementsByClassName("cross")[i].classList.remove("myClassName");
                })
            }
        }
        for (let i = 0; i < document.getElementsByClassName("tempMyStudents").length; i++) {
            document.getElementsByClassName("tempMyStudents")[i].addEventListener("mouseover", () => {
                document.getElementsByClassName("studentCross")[i].classList.add("myStudentClass");
            })
            document.getElementsByClassName("tempMyStudents")[i].addEventListener("mouseleave", () => {
                document.getElementsByClassName("studentCross")[i].classList.remove("myStudentClass");
            })
        }
    })
    const pickupTimeChangeHandler = (e) => {
        TIMINGS_DATA[e.target.parentElement.id-15].pickup = e.target.value;
    }
    const dropTimeChangeHandler = (e) => {
        TIMINGS_DATA[e.target.parentElement.id-15].drop = e.target.value;
    }
    return (
        <div id="main-stop" style={{ display: "flex", flexDirection: "column", marginLeft: "15px", width: "100%" }}>
            <h3 style={{ color: "gray", marginTop: "5px" }}>Timings</h3>
            <div className='timing-details' style={{ display: "flex", justifyContent: "space-between" }} >
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <br />
                    <span style={{ marginTop: "5px" }}>Pickup : </span>
                    <span>Drop : </span>
                </div>
                {TIMINGS_DATA.map((data,index) => {
                    return (
                        <div id={index+15} style={{ display: "flex", flexDirection: "column" }}>
                            <span>{data.day}</span>
                            <input type="text" defaultValue={data.pickup} onChange={pickupTimeChangeHandler} onFocus={(e) => e.target.type = "time"} onBlur={(e) => e.target.type = "text"} />
                            <input type="text" defaultValue={data.drop} onChange={dropTimeChangeHandler} onFocus={(e) => e.target.type = "time"} onBlur={(e) => e.target.type = "text"} />
                        </div>
                    )
                })}
                <button className='save' style={{ width: "100px" }} >Save Changes</button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0px" }} >
                <div className='main-stop-container'>
                    <div style={{ width: "100%" }}>
                        <h3 style={{ color: "grey", marginBottom: "15px", marginLeft: "-8%" }}>Stops</h3>
                        <ul id='sortlist' className='main-stop-subcontainer'>
                            {stopList.map((data, index) => {
                                return (
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <div className='stopNames-container'>
                                            <div style={{ display: "flex", gap: "10px" }}>
                                                {index !== stopList.length - 1 &&
                                                    <img src={connectionPoint} className="connectedPoint" />
                                                }
                                                {index === stopList.length - 1 &&
                                                    <img src={endPoint} className="connectedPoint" style={{ width: "15px" }} />
                                                }
                                                <li id={index} className="stopNames" draggable>
                                                    <p>{data.stopName}</p>
                                                </li>
                                            </div>
                                            <p className='cross' onClick={crossClickHandler} >X</p>
                                        </div>
                                        <div className='student-info'>
                                            {index !== stopList.length - 1 &&
                                                <img src={threedots} className="threedots" />
                                            }
                                            {index === stopList.length - 1 &&
                                                <img src="" className='threedots' style={{ visibility: "hidden" }} />
                                            }
                                            <div className='studenNames-contaner'>
                                                {data?.studnets?.map((name, index) =>
                                                    <div className="tempMyStudents" style={{ marginRight: "5px", borderRadius: "0px", marginTop: "5px", display: "inline-block", width: "200px" }}>
                                                        <em>{name}</em>
                                                        <span className='studentCross' onClick={subCrossClickHandler} >X</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </ul>
                        <button id="asdf" style={{ visibility: "hidden" }} onClick={() => slist(document.getElementById("sortlist"))}>click</button>
                    </div>
                    {/* </div> */}
                </div>
                <StopsMap stopData={stopList} />
            </div>
        </div>
    )
}

export default Stops


// backgroundColor: "rgb(226, 221, 221)"