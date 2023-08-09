import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import "./Message.css";
import TickmarkImage from "../Assets/Tickmark.png";
import ErrorImage from "../Assets/Error.png";

const Message = (props) => {
    const history = useHistory();
    useEffect(() => {
        if (props.flag) document.getElementsByClassName("container-success-msg")[0].style.top = "0";
        document.body.style.overflow = "hidden";
    }, [])

    return (
        <div className="container-success-msg">
            <div className="success-sub-container">
                <div className="success-msg">
                    <img src={props.type.toLowerCase() === "success" ? TickmarkImage : ErrorImage} />
                    <p className="data-save">{props.type.toLowerCase() === "success" ? props.message : (props.driveErrorMessage ? props.driveErrorMessage : "Some Error Occured. Please Try Again Later")}</p>
                </div>
                <hr />
                <div className='footer' style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", padding: "0" }} >
                    <button className={props.type.toLowerCase() === "success" ? "" : "error"} onClick={() => props.url ? history.push(props.url) : window.location.reload()}>OK</button>
                </div>
            </div>
        </div>
    )
}

export default Message