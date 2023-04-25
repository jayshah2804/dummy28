import React, { useEffect, useRef } from "react";
import { useState } from "react";
import useHttp from "../../Hooks/use-http";
import Message from "../../Modal/Message";
import "./DriverBooking.css";

import building from "../../Assets/buildings.png";
import pickupicon from "../../Assets/pickupicon.png";
import dropicon from "../../Assets/drop-icon.png";
import user from "../../Assets/user.png";
import threedots from "../../Assets/route_3dots.png";
import startLocation from "../../Assets/start_location.png";
import TickmarkImage from "../../Assets/Tickmark.png";
import addStopIcon from "../../Assets/addStopIcon.png";
import ErrorImage from "../../Assets/Error.png";

let autocomplete = [];
let url;
let requestOptions = {};
let requestTripId = "";
let myHeaders = "";
let riderInfo = {};
let authToken = "";
let error = {
  riderName: "",
  pickupStop: "",
  dropStop: "",
  guestName: "",
  guestMoNumber: "",
};
let str = [];
let pickupDrop = [];
let dropOffs = [];
let arr = [];
arr.length = 8;
arr.fill(0, 0, 8);
let baseURL =
  window.location.origin === "https://corp.little.global"
    ? "https://corp.little.global/server"
    : "";
const DriverBooking = (props) => {
  const [isDriverBookingClicked, setIsDriverBookingClicked] = useState(false);
  const [isToken, setIsToken] = useState("");
  const [searchedRidersData, setIsSearchedRidersData] = useState(false);
  const [isRequestSentToDriver, setIsRequestSentToDriver] = useState(false);
  const [tripRequestStatus, setTripRequestStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRender, setIsRender] = useState(false);
  const [isFieldError, setIsFieldError] = useState(false);
  const [addStopCount, setAddStopCount] = useState(0);
  const riderInputSearchRef = useRef();
  const pickupInputRef = useRef();
  const dropInputRef = useRef();
  const guestNameInputRef = useRef();
  const guestMoNumberInputRef = useRef();
  // console.log(props);

  // if (tripRequestStatus) {
  //   move(91, 50);
  //   setTimeout(() => {
  //     props.tripRequestStatusFunc(tripRequestStatus);
  //   }, 1000);
  // }

  // useEffect(() => {
  //   props.riderData.push({
  //     mobileNumber: "",
  //     OfficialName: "Guest"
  //   })
  //   // console.log(props.riderData);
  // }, []);

  function paraMeters() {
    if (isDriverBookingClicked) {
      url = "/map/app/token";
      myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Basic NmViNzcwZmVhYmZlZDhlYzpMRUpSaTFFcEJRY1FQUjZLOW1jMTFnPT0="
      );
      requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
    } else if (isToken) {
      url = "/map/service/ride/book";
      myHeaders = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + isToken,
      };
      requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          type: "CORPORATE",
          driver: props.bookedDriver[0].driverEmail,
          rider: {
            mobileNumber: "+" + riderInfo.mobileNumber,
            name: riderInfo.name,
            email: sessionStorage.getItem("user"),
            picture: "https://google.com/mypicture.com",
          },
          skipDrivers: [],
          vehicle: {
            type: "BASIC",
            details: {
              itemCarried: "goods",
              size: "2",
              recipientName: "My Person",
              recipientMobile: "919426803515",
              recipientAddress: "the place",
              contactPerson: "My Person",
              deliveryNotes: "another one",
              typeOfAddress: "Home",
            },
          },
          pickUp: {
            // latlng: "22.9929777,72.5013096",
            latlng: pickupDrop[0].latLng,
            address: pickupDrop[0].address,
          },
          dropOff: {
            // latlng: "22.9929777,72.5013096",
            latlng: pickupDrop[1].latLng,
            address: pickupDrop[1].address,
          },
          dropOffs,
          corporate: {
            corporateId: sessionStorage.getItem("corpId"),
          },
        }),
        redirect: "follow",
      };
      console.log(requestOptions.body);
    } else if (isRequestSentToDriver === "yes") {
      url = "/map/service/ride/" + requestTripId + "/status";
      myHeaders = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      };
      requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
    }
  }

  useEffect(() => {
    if (isDriverBookingClicked) {
      move();
      paraMeters();
      fetch(baseURL + url, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          setIsToken(JSON.parse(result).token);
          authToken = JSON.parse(result).token;
          setIsDriverBookingClicked(false);
        })
        .catch((error) => console.log("error", error));
    } else if (isToken) {
      paraMeters();
      fetch(baseURL + url, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          JSON.parse(result).tripId
            ? setIsRequestSentToDriver("yes")
            : setIsRequestSentToDriver("no");
          if (JSON.parse(result).tripId) {
            requestTripId = JSON.parse(result).tripId;
          }
          setIsLoading(false);
          setIsToken(false);
        })
        .catch((error) => console.log("error", error));
    } else if (isRequestSentToDriver === "yes") {
      setIsLoading(true);
      setTimeout(() => {
        document.getElementById("progressBarText").innerText =
          "Sending Trip Request ...";
      });
      //test
      move(0, 50);
      setTimeout(() => {
        paraMeters();
        fetch(baseURL + url, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            pickupDrop = [];
            dropOffs = [];
            setTripRequestStatus(
              /accepted|arrived|started/.test(
                JSON.parse(result).tripStatus?.toLowerCase()
              )
                ? "success"
                : "fail"
            );
            // props.setBookedDriver(false);
          })
          .catch((error) =>
            console.log(
              "error",
              !JSON.parse(error).tripStatus ? setTripRequestStatus("fail") : ""
            )
          );
      }, 30000);
    }
  }, [isDriverBookingClicked, isToken]);

  useEffect(() => {
    // if (addStopCount < 2) {
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyAq88vEj-mQ9idalgeP1IuvulowkkFA-Nk&callback=initMap&libraries=places&v=weekly";
    script.async = true;
    document.body.appendChild(script);
    // }
    let elements = document.getElementsByClassName("removedropInput");
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", removeDropoffs, false);
    }
    return () => {
      for (let i = 0; i < elements.length; i++) {
        elements[i].removeEventListener("click", removeDropoffs);
      }
    };
  }, [isRender]);

  function initMap() {
    // var input1 = document.getElementById("pac-input1");
    // var input2 = document.getElementById("pac-input2");
    // autocomplete[0] = new window.google.maps.places.Autocomplete(input1, {});
    // autocomplete[1] = new window.google.maps.places.Autocomplete(input2);
    for (
      let i = 0;
      i < document.getElementsByClassName("pacInput").length;
      i++
    ) {
      autocomplete[i] = new window.google.maps.places.Autocomplete(
        document.getElementsByClassName("pacInput")[i],
        {
          componentRestrictions: { country: ["in"] },
        }
      );
    }
    for (
      let i = 0;
      i < document.getElementsByClassName("dropoffInput").length;
      i++
    ) {
      autocomplete[i + 2] = new window.google.maps.places.Autocomplete(
        document.getElementsByClassName("dropoffInput")[i],
        {
          componentRestrictions: { country: ["in"] },
        }
      );
    }
  }
  window.initMap = initMap;

  const tripBookClicked = () => {
    if (
      riderInputSearchRef.current.value &&
      pickupInputRef.current.value &&
      dropInputRef.current.value &&
      !error.riderName &&
      (riderInputSearchRef.current.value.toLowerCase() === "guest"
        ? guestNameInputRef.current.value &&
          guestMoNumberInputRef.current.value.toString().length === 10
        : 1)
    ) {
      if (riderInputSearchRef.current.value.toLowerCase() === "guest") {
        riderInfo.name = guestNameInputRef.current.value;
        riderInfo.mobileNumber = "91" + guestMoNumberInputRef.current.value;
      }
      // debugger;
      if (!dropOffs[0]?.order) {
        for (let i = 0; i < 2; i++) {
          if (autocomplete[i]?.getPlace()?.geometry?.location?.lat()) {
            pickupDrop[i] = {
              address: document.getElementsByClassName("pacInput")[i].value,
              latLng:
                autocomplete[i].getPlace().geometry.location.lat() +
                "," +
                autocomplete[i].getPlace().geometry.location.lng(),
            };
          }
        }
        for (let i = 2; i < autocomplete.length; i++) {
          if (autocomplete[i]?.getPlace()?.geometry?.location?.lat()) {
            dropOffs[i - 2] = {
              address:
                document.getElementsByClassName("dropoffInput")[i - 2].value,
              latLng:
                autocomplete[i].getPlace().geometry.location.lat() +
                "," +
                autocomplete[i].getPlace().geometry.location.lng(),
            };
          }
        }
        let addStops = [];
        if (dropOffs.length > 0) {
          addStops.push({
            order: 1,
            contactMobileNumber: "",
            contactName: "",
            notes: "",
            latlng: pickupDrop[1].latLng,
            address: pickupDrop[1].address,
          });
          pickupDrop[1] = {
            latLng: dropOffs[dropOffs.length - 1].latLng,
            address: dropOffs[dropOffs.length - 1].address,
          };
        }
        for (let i = 0; i < dropOffs.length; i++) {
          addStops.push({
            order: i + 2,
            contactMobileNumber: "",
            contactName: "",
            notes: "",
            latlng: dropOffs[i].latLng,
            address: dropOffs[i].address,
          });
        }
        dropOffs = addStops;
      }
      console.log(pickupDrop);
      console.log(dropOffs);
      // autocomplete = [];
      // console.log(dropOffs);

      error.riderName = "";
      error.pickupStop = "";
      error.dropStop = "";
      error.guestName = "";
      error.guestMoNumber = "";
      setIsFieldError((prev) => !prev);
      setIsLoading(true);
      setIsDriverBookingClicked(true);
    } else {
      setIsFieldError((prev) => !prev);
      if (riderInputSearchRef.current.value.toLowerCase() === "guest") {
        !guestNameInputRef.current.value &&
          (error.guestName = "Please add guest name");
        !(guestMoNumberInputRef.current.value.toString().length === 10) &&
          (error.guestMoNumber = "Please enter valid mobile number");
      }
      !riderInputSearchRef.current.value &&
        (error.riderName = "Please add one rider");
      !pickupInputRef.current.value &&
        (error.pickupStop = "Please add pickup stop");
      !dropInputRef.current.value && (error.dropStop = "Please add drop stop");
    }
  };
  const riderSearchHandler = () => {
    if (riderInputSearchRef.current.value) {
      error.riderName = "";
      setIsSearchedRidersData(
        props.riderData.filter(
          (data) =>
            data?.OfficialName?.toLowerCase().includes(
              riderInputSearchRef.current.value.toLowerCase()
            ) ||
            data?.MobileNumber?.toLowerCase().includes(
              riderInputSearchRef.current.value.toLowerCase()
            )
        )
      );
    } else {
      error.riderName = "Please add one rider";
      setIsSearchedRidersData(false);
    }
    for (let i = 0; i < props.riderData.length; i++) {
      debugger;
      if (
        props.riderData[i].OfficialName.toLowerCase().includes(
          riderInputSearchRef.current.value.toLowerCase()
        )
      )
        break;
      if (i === props.riderData.length - 1) {
        error.riderName =
          riderInputSearchRef.current.value + " is not registred";
        setIsFieldError((prev) => !prev);
      }
    }
  };

  const riderSelectedHandler = (riderName, riderNumber) => {
    riderInfo.name = riderName;
    riderInfo.mobileNumber = riderNumber;
    riderInputSearchRef.current.value =
      riderName + (riderNumber ? "  ( " + riderNumber + " )" : "");
    setIsSearchedRidersData(false);
  };

  if (isRequestSentToDriver === "no") {
    setTimeout(() => {
      setIsRequestSentToDriver(false);
    }, 5000);
  }

  const pickupStopChangeHandler = () => {
    if (pickupInputRef.current.value) {
      error.pickupStop = "";
      setIsFieldError((prev) => !prev);
    } else {
      error.pickupStop = "Please add pickup stop";
      setIsFieldError((prev) => !prev);
    }
  };

  const dropStopChangeHandler = () => {
    if (dropInputRef.current.value) {
      error.dropStop = "";
      setIsFieldError((prev) => !prev);
    } else {
      error.dropStop = "Please add drop stop";
      setIsFieldError((prev) => !prev);
    }
  };

  const guestNameChangeHandler = () => {
    if (guestNameInputRef.current.value) {
      error.guestName = "";
      setIsFieldError((prev) => !prev);
    } else {
      error.guestName = "Please add guest name";
      setIsFieldError((prev) => !prev);
    }
  };

  const guestMoNumberChangeHandler = () => {
    if (guestMoNumberInputRef.current.value.toString().length === 10) {
      error.guestMoNumber = "";
      setIsFieldError((prev) => !prev);
    }
    // else {
    //   error.guestMoNumber = "Please enter valid mobile number";
    //   setIsFieldError(prev => !prev);
    // }
  };

  const addStopClickHandler = () => {
    for (
      let i = 0;
      i < document.getElementById("addStopDiv").children.length;
      i++
    ) {
      if (
        !document.getElementById("addStopDiv").children[i].style.display ||
        document.getElementById("addStopDiv").children[i].style.display ===
          "none"
      ) {
        document.getElementById("addStopDiv").children[i].style.display =
          "flex";
        document.getElementById("addStopIconDiv").children[i].style.display =
          "flex";
        break;
      }
    }
    for (let i = 0; i < 2; i++) {
      if (autocomplete[i]?.getPlace()?.geometry?.location?.lat()) {
        pickupDrop[i] = {
          address: document.getElementsByClassName("pacInput")[i].value,
          latLng:
            autocomplete[i].getPlace().geometry.location.lat() +
            "," +
            autocomplete[i].getPlace().geometry.location.lng(),
        };
      }
    }
    for (let i = 2; i < autocomplete.length; i++) {
      if (autocomplete[i]?.getPlace()?.geometry?.location?.lat()) {
        dropOffs[i - 2] = {
          address: document.getElementsByClassName("dropoffInput")[i - 2].value,
          latLng:
            autocomplete[i].getPlace().geometry.location.lat() +
            "," +
            autocomplete[i].getPlace().geometry.location.lng(),
        };
      }
    }
    let i = 0;
    while (document.getElementsByClassName("dropoffInput")[i].value) i++;
    dropOffs.length = i;
  };

  const removeDropoffs = (e) => {
    for (let i = 0; i < 2; i++) {
      if (autocomplete[i]?.getPlace()?.geometry?.location?.lat()) {
        pickupDrop[i] = {
          address: document.getElementsByClassName("pacInput")[i].value,
          latLng:
            autocomplete[i].getPlace().geometry.location.lat() +
            "," +
            autocomplete[i].getPlace().geometry.location.lng(),
        };
      }
    }
    for (let i = 2; i < autocomplete.length; i++) {
      if (autocomplete[i]?.getPlace()?.geometry?.location?.lat()) {
        dropOffs[i - 2] = {
          address: document.getElementsByClassName("dropoffInput")[i - 2].value,
          latLng:
            autocomplete[i].getPlace().geometry.location.lat() +
            "," +
            autocomplete[i].getPlace().geometry.location.lng(),
        };
      }
    }
    for (
      let i = 0;
      i < document.getElementsByClassName("dropoffInput").length;
      i++
    ) {
      if (
        e.target.parentElement.children[0].value ===
        document.getElementById("addStopDiv").children[i].children[0].value
      ) {
        autocomplete.splice(i + 2, 1);
        document.getElementById("addStopDiv").children[i].style.display =
          "none";
        document.getElementById("addStopIconDiv").children[i].style.display =
          "none";
        document.getElementById("addStopDiv").children[i].children[0].value =
          "";
        document
          .getElementById("addStopDiv")
          .insertBefore(
            document.getElementById("addStopDiv").children[i],
            document.getElementById("addStopDiv").children[
              document.getElementById("addStopDiv").children
            ]
          );
        document
          .getElementById("addStopIconDiv")
          .insertBefore(
            document.getElementById("addStopIconDiv").children[i],
            document.getElementById("addStopIconDiv").children[
              document.getElementById("addStopIconDiv").children
            ]
          );
        dropOffs.splice(i, 1);
        break;
      }
    }
    let i = 0;
    while (document.getElementsByClassName("dropoffInput")[i].value) i++;
    dropOffs.length = i;
    setIsRender((prev) => !prev);
  };

  function move(j = 0, time = 20) {
    // debugger;
    // setTimeout(() => {
    //   let i = j;
    //   if (i == 0) {
    //     i = 1;
    //     var elem = document.getElementById("myBar");
    //     var width = 10;
    //     var id = setInterval(frame, time);
    //     function frame() {
    //       if (width >= 95) {
    //         clearInterval(id);
    //         i = 0;
    //       } else {
    //         width++;
    //         elem.style.width = width + "%";
    //       }
    //     }
    //   }
    // });
  }

  return (
    <div className="driverBooking-container">
      <header>
        <div className="driverInfo">
          <img src={props.bookedDriver[0].driverImage}></img>
          <div className="driverDetailsInfo">
            <div>{props.bookedDriver[0].driverName}</div>
            <div style={{ fontSize: "12px" }}>
              {props.bookedDriver[0].carNumber}
            </div>
          </div>
        </div>
        <div className="carInfo">
          {/* <div>Honda Amaze</div> */}
          {/* <div style={{ fontSize: "12px" }}>Platinum White</div> */}
          <div>{props.bookedDriver[0].carModel.toLowerCase()}</div>
          <div style={{ fontSize: "12px" }}>
            {props.bookedDriver[0].carColor.toLowerCase()}
          </div>
        </div>
      </header>
      {tripRequestStatus && (
        <div className="success-sub-container" style={{ top: "65%" }}>
          <div className="success-msg">
            <img
              src={tripRequestStatus === "success" ? TickmarkImage : ErrorImage}
            />
            <p className="data-save">
              {"Driver has" +
                (tripRequestStatus === "success" ? " " : " not ") +
                "accepted your request"}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <button
              className={tripRequestStatus === "success" ? "" : "error"}
              onClick={() => window.location.reload()}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {!tripRequestStatus && (
        <React.Fragment>
          <main>
            {isLoading && (
              <React.Fragment>
                <div class="wrapper">
                  <div class="progressbar">
                    {/* <div class="stylization"></div> */}
                  </div>
                  <span
                    id="progressBarText"
                    style={{
                      display: "inline-block",
                      zIndex: "999",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    Connecting to driver ...
                  </span>
                  <br />
                </div>
              </React.Fragment>
            )}
            {isRequestSentToDriver === "no" && (
              <div className="tripRequestError">
                {"Driver is unreachable. Please try again after some time"}
              </div>
            )}
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <img src={building} style={{ width: "20px", height: "20px" }} />
              <input type="text" disabled value="Ahmedabad" className="tags" />
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <img src={user} style={{ width: "20px", height: "20px" }} />
              <div style={{ width: "100%" }}>
                <input
                  type="text"
                  placeholder="Please add any one rider"
                  className="tags"
                  ref={riderInputSearchRef}
                  onChange={riderSearchHandler}
                ></input>
                {error.riderName && (
                  <p className="errorField">{error.riderName}</p>
                )}
                {searchedRidersData && (
                  <div className="searchedRiders">
                    {searchedRidersData.map((data) => (
                      <p
                        onClick={(e) =>
                          riderSelectedHandler(
                            data.OfficialName,
                            data?.MobileNumber
                          )
                        }
                      >
                        {data.OfficialName +
                          (data?.MobileNumber
                            ? "  ( " + data.MobileNumber + " )"
                            : "")}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {riderInputSearchRef?.current?.value.toLowerCase() === "guest" && (
              <div
                style={{ display: "flex", justifyContent: "end", gap: "20px" }}
              >
                <div style={{ width: "45%", display: "inline-block" }}>
                  <input
                    type="text"
                    ref={guestNameInputRef}
                    onChange={guestNameChangeHandler}
                    placeholder="Name of the Guest"
                    className="tags"
                  />
                  {error.guestName && (
                    <p className="errorField">{error.guestName}</p>
                  )}
                </div>
                <div style={{ width: "45%", display: "inline-block" }}>
                  <input
                    type="text"
                    ref={guestMoNumberInputRef}
                    onChange={guestMoNumberChangeHandler}
                    placeholder="Mobile Number of the Guest"
                    className="tags"
                  />
                  {error.guestMoNumber && (
                    <p className="errorField">{error.guestMoNumber}</p>
                  )}
                </div>
              </div>
            )}
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <img
                  src={pickupicon}
                  style={{ width: "20px", height: "20px" }}
                />
                <img
                  src={threedots}
                  style={{ width: "20px", height: "20px" }}
                />
                <div id="addStopIconDiv">
                  {arr.map(() => (
                    <div className="addStopIconSubDiv">
                      <img
                        src={startLocation}
                        style={{ width: "20px", height: "20px" }}
                      />
                      <img
                        src={threedots}
                        style={{ width: "20px", height: "20px" }}
                      />
                    </div>
                  ))}
                </div>
                <img src={dropicon} style={{ width: "20px", height: "20px" }} />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <input
                  type="text"
                  id="pac-input1"
                  placeholder="Pickup Address"
                  className="tags pacInput"
                  ref={pickupInputRef}
                  onChange={pickupStopChangeHandler}
                />
                {error.pickupStop && (
                  <p className="errorField">{error.pickupStop}</p>
                )}
                <input
                  type="text"
                  id="pac-input2"
                  placeholder="Dropoff Address"
                  className="tags pacInput"
                  ref={dropInputRef}
                  onChange={dropStopChangeHandler}
                />
                {error.dropStop && (
                  <p className="errorField">{error.dropStop}</p>
                )}
                <div id="addStopDiv">
                  {arr.map(() => (
                    <div className="addStopSubDiv">
                      <input
                        type="text"
                        className="tags dropoffInput"
                        placeholder="Add Stop"
                      />
                      <span className="removedropInput">X</span>
                    </div>
                  ))}
                </div>
                {/* {addStopCount > 0 && str.map(ele => ele)} */}
              </div>
            </div>
            <div
              onClick={addStopClickHandler}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                marginTop: "5px",
              }}
            >
              <img
                src={addStopIcon}
                style={{ width: "20px", height: "20px" }}
              />
              <p style={{ color: "rgba(34, 137, 203, 255)", fontSize: "14px" }}>
                Add Stop
              </p>
            </div>
            {/* <button onClick={addStopClickHandler} >Add Stop</button> */}
          </main>
          <footer>
            <button onClick={() => props.setBookedDriver(false)}>Cancel</button>
            <button onClick={tripBookClicked}>Book Now</button>
          </footer>
        </React.Fragment>
      )}
    </div>
  );
};

export default DriverBooking;
