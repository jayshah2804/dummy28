import React, { useRef, useState } from 'react';
import classes from './ChangePassword.module.css';
import { GrClose } from 'react-icons/gr';

const ChangePassword = (props) => {
    const [isError, setIsError] = useState({ error: "" });
    const newPasswordRef = useRef();
    const confirmNewPasswordRef = useRef();

    const savePasswordClickHandler = () => {
        if (newPasswordRef.current.value !== confirmNewPasswordRef.current.value)
            setIsError((prev) => ({ ...prev, error: "Password doesn't match" }));
        else
            props.saveNewPassword();
    }
    return (
        <div className={classes.changePassword_modal_background}>
            <div className={classes.changePassword_modal}>
                <div className={classes.closeIcon} >
                    <div>Change Password</div>
                    <GrClose onClick={() => props.close(false)} />
                </div>
                <hr />
                <div className={classes.inputForPasswordChange}>
                    <input type="password" placeholder="Old Password" className={classes.input} />
                    <input type="password" placeholder="New Password" ref={newPasswordRef} className={classes.input} />
                    <input type="password" placeholder="Confirm New Password" ref={confirmNewPasswordRef} className={classes.input} />
                    <p>{isError.error}</p>
                </div>
                <br />
                <div className={classes.savePassword}>
                    <input type="button" value="Save" className={classes.save} onClick={savePasswordClickHandler} />
                </div>
            </div>
        </div>
    )
}

export default ChangePassword