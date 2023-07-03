import React from 'react';
import "./Loading.css";

const Loading = (props) => {
    return (
        <React.Fragment>
            {
                props.driver ?
                    <div className='loading driverMain'></div> :
                    props.datatable ?
                        <div className='loading dataTableMain'></div> :
                        <pre className='loading'></pre>
            }
        </React.Fragment>
    )
}

export default Loading