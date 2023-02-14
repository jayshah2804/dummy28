import React, { useEffect } from 'react';
import "./Message.css";
import TickmarkImage from "../Assets/Tickmark.png";
import ErrorImage from "../Assets/Error.png";

const Message = (props) => {
    useEffect(() => {
        if (props.flag) document.getElementsByClassName("container-success-msg")[0].style.top = "0";
        document.body.style.overflow = "hidden";
    },[])
    // useEffect(() => {
    //     if (props.type.toLowerCase() === "success")
    //         document.getElementById("header").style.backgroundColor = "rgba(42, 149, 69, 255)";
    //     else document.getElementById("header").style.backgroundColor = "rgb(226, 44, 29)";

    // })
    return (
        // <div className='modal-background'>
        //     <div className='modal-data'>
        //         <div>
        //             <header id='header' >
        //                 <span>
        //                     {props.type}
        //                 </span>
        //                 <span className='cross' onClick={() => window.location.reload()} >X</span>
        //             </header>
        //             <hr />
        //         </div>
        //         <main>
        //             <p>{props.type.toLowerCase() === "success" ? props.message : "Some Error Occured. Please Try Again Later"}</p>
        //         </main>
        //     </div>
        // </div>
        <div className="container-success-msg">
            <div className="success-sub-container">
                <div className="success-msg">
                    {console.log(props.type.toLowerCase(), props.type.toLowerCase === "success")}
                    <img src={props.type.toLowerCase() === "success" ? TickmarkImage : ErrorImage} />
                    <p className="data-save">{props.type.toLowerCase() === "success" ? props.message : (props.driveErrorMessage ? props.driveErrorMessage : "Some Error Occured. Please Try Again Later")}</p>
                </div>
                <hr />
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "10px",
                    }}
                >
                    <button className={props.type.toLowerCase() === "success" ? "" : "error"} onClick={() => window.location.reload()}>OK</button>
                </div>
            </div>
        </div>
    )
}

export default Message