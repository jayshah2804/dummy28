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
import TickmarkImage from "../../Assets/Tickmark.png";
import ErrorImage from "../../Assets/Error.png";

let autocomplete = [];
let url;
let requestOptions = {};
let requestTripId = "";
let myHeaders = "";
let riderInfo = {};
let authToken = "";

const DriverBooking = (props) => {
  const [isDriverBookingClicked, setIsDriverBookingClicked] = useState(false);
  const [isToken, setIsToken] = useState("");
  const [searchedRidersData, setIsSearchedRidersData] = useState(false);
  const [isRequestSentToDriver, setIsRequestSentToDriver] = useState(false);
  const [tripRequestStatus, setTripRequestStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const riderInputSearchRef = useRef();
  // console.log(props);

  // if (tripRequestStatus) {
  //   move(91, 50);
  //   setTimeout(() => {
  //     props.tripRequestStatusFunc(tripRequestStatus);
  //   }, 1000);
  // }

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
            latlng: (
              autocomplete[0].getPlace().geometry.location.lat() +
              "," +
              autocomplete[0].getPlace().geometry.location.lng()
            ).toString(),
            address: document.getElementById("pac-input1").value,
          },
          dropOff: {
            // latlng: "22.9929777,72.5013096",
            latlng: (
              autocomplete[1].getPlace().geometry.location.lat() +
              "," +
              autocomplete[1].getPlace().geometry.location.lng()
            ).toString(),
            address: document.getElementById("pac-input2").value,
          },
          dropOffs: [],
          corporate: {
            corporateId: sessionStorage.getItem("corpId"),
          },
        }),
        redirect: "follow",
      };
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
      fetch("https://corp.little.global/server" + url, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          setIsToken(JSON.parse(result).token);
          authToken = JSON.parse(result).token;
          setIsDriverBookingClicked(false);
        })
        .catch((error) => console.log("error", error));
    } else if (isToken) {
      paraMeters();
      fetch("https://corp.little.global/server" + url, requestOptions)
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
      move(0, 50);
      setTimeout(() => {
        paraMeters();
        fetch("https://corp.little.global/server" + url, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            setTripRequestStatus(/accepted|arrived|started/.test(JSON.parse(result).tripStatus.toLowerCase()) ? "success" : "fail");
            // props.setBookedDriver(false);
          })
          .catch((error) => console.log("error", error));
      }, 30000);
    }
  }, [isDriverBookingClicked, isToken]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyAq88vEj-mQ9idalgeP1IuvulowkkFA-Nk&callback=initMap&libraries=places&v=weekly";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  function initMap() {
    var input1 = document.getElementById("pac-input1");
    var input2 = document.getElementById("pac-input2");
    autocomplete[0] = new window.google.maps.places.Autocomplete(input1);
    autocomplete[1] = new window.google.maps.places.Autocomplete(input2);
  }
  window.initMap = initMap;

  const tripBookClicked = () => {
    setIsLoading(true);
    setIsDriverBookingClicked(true);
    // console.log(autocomplete[0].getPlace().geometry.location.lat());
  };
  const riderSearchHandler = () => {
    if (riderInputSearchRef.current.value)
      setIsSearchedRidersData(
        props.riderData.filter(
          (data) =>
            data.OfficialName.toLowerCase().includes(
              riderInputSearchRef.current.value.toLowerCase()
            ) ||
            data.MobileNumber.toLowerCase().includes(
              riderInputSearchRef.current.value.toLowerCase()
            )
        )
      );
    else setIsSearchedRidersData(false);
  };

  const riderSelectedHandler = (riderName, riderNumber) => {
    // console.log(riderNumber);
    riderInfo.name = riderName;
    riderInfo.mobileNumber = riderNumber;
    riderInputSearchRef.current.value = riderName + "  ( " + riderNumber + " )";
    setIsSearchedRidersData(false);
  };

  if (isRequestSentToDriver === "no") {
    setTimeout(() => {
      setIsRequestSentToDriver(false);
    }, 5000);
  }

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
            <div style={{ fontSize: "12px" }}>{props.bookedDriver[0].carNumber}</div>
          </div>
        </div>
        <div className="carInfo">
          <div>Honda Amaze</div>
          <div style={{ fontSize: "12px" }}>Platinum White</div>
          {/* <div>{props.bookedDriver[0].carModel.toLowerCase()}</div>
          <div style={{fontSize: "12px"}}>{props.bookedDriver[0].carColor.toLowerCase()}</div> */}
        </div>
      </header>
      {tripRequestStatus &&
        <div className="success-sub-container" style={{ top: "65%" }} >
          <div className="success-msg">
            <img src={tripRequestStatus === "success" ? TickmarkImage : ErrorImage} />
            <p className="data-save">{"Driver has" + (tripRequestStatus === "success" ? " " : " not ") + "accepted your request"}</p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <button className={tripRequestStatus === "success" ? "" : "error"} onClick={() => window.location.reload()}>OK</button>
          </div>
        </div>
      }
      {!tripRequestStatus &&
        <React.Fragment>
          <main>
            {isLoading && (
              <React.Fragment>
                <div class="wrapper">
                  <div class="progressbar">
                    {/* <div class="stylization"></div> */}
                  </div>
                  <span id="progressBarText" style={{display: "inline-block", zIndex: "999", width: "100%", textAlign: "center" }} >Connecting to driver ...</span>
                  <br />
                </div>
              </React.Fragment>
              // <div class="wrapper">
              //   <div class="progressbar"><span id="progressBarText" style={{color: "white", zIndex: "999", position: "absolute", width: "100%", textAlign: "center"}} >Connecting to driver ...</span>
              //     {/* <div class="stylization"></div> */}
              //   </div>
              //   <br />
              // </div>
              // <div id="myProgress">
              //   <div id="myBar"></div>
              //   <span
              //     id="progressBarText"
              //     style={{
              //       position: "absolute",
              //       top: "15%",
              //       left: "30%",
              //       fontSize: "13.5px",
              //     }}
              //   >
              //     Connecting to driver ...
              //   </span>
              // </div>
            )}
            {isRequestSentToDriver === "no" && (
              <div className="tripRequestError">
                {"Driver is unreachable. Please try again after some time"}
              </div>
            )}
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <img src={building} style={{ width: "20px", height: "20px" }} />
              <input
                type="text"
                disabled
                value="Ahmedabad"
                className="tags"
              />
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
                {searchedRidersData && (
                  <div className="searchedRiders">
                    {searchedRidersData.map((data) => (
                      <p
                        onClick={(e) =>
                          riderSelectedHandler(data.OfficialName, data.MobileNumber)
                        }
                      >
                        {data.OfficialName + "  ( " + data.MobileNumber + " )"}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
                <img src={pickupicon} style={{ width: "20px", height: "20px" }} />
                <img src={threedots} style={{ width: "20px", height: "20px" }} />
                <img src={dropicon} style={{ width: "20px", height: "20px" }} />
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", width: "100%" }}
              >
                <input
                  type="text"
                  id="pac-input1"
                  placeholder="Pickup Address"
                  className="tags"
                />
                <input
                  type="text"
                  id="pac-input2"
                  placeholder="Dropoff Address"
                  className="tags"
                />
              </div>
            </div>
          </main>
          <footer>
            <button onClick={() => props.setBookedDriver(false)}>Cancel</button>
            <button onClick={tripBookClicked}>Book Now</button>
          </footer>
        </React.Fragment>
      }
    </div>
  );
};

export default DriverBooking;
