import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import "./Accordian.css";

let parent_prev_id;
let prev_active_status;
const Accordian = (props) => {
    const [isActionsClicked, setIsActionsClicked] = useState();
    const history = useHistory();

    const actionsClickHandler = (e) => {
        if (parent_prev_id !== e.target.id && !prev_active_status)
            props.forMyRender(parent_prev_id);
        parent_prev_id = e.target.id;
        prev_active_status = isActionsClicked;

        setIsActionsClicked(prev => !prev);
    }
    const subListClickHandler = (e) => {
        document.getElementById(e.target.parentElement.parentElement.children[0].id).click();
        // console.log(e.target.parentNode.parentNode.parentNode.parentNode.children[0].innerText.toLowerCase().replace(/\s+/g, ''));
        if (e.target.innerText === "Trips")
            history.push("/trips?department=" + e.target.parentNode.parentNode.parentNode.parentNode.children[0].innerText.toLowerCase());
        if (e.target.innerText === "Disable")
            props.setIsStudentDisableClicked(true);

        // history.push(e.target.innerText.toLowerCase());
    }
    return (
        <div style={{ position: "relative" }}><button id={props.myId} className="actions" onClick={actionsClickHandler} >Actions</button>
            {isActionsClicked && <div className='staff_actions' onClick={subListClickHandler}>
                <p>Trips</p>
                <p>Transfer</p>
                <p>Edit</p>
                <p>Disable</p>
            </div>
            }
        </div>
    )
}

export default Accordian;