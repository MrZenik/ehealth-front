import React from "react";

function Exception(props) {
    let message = props.message
    if (props.message !== message) message = props.message
    return (
        <div>
            {message ? (
                <div className={"float-right alert alert-danger"} style={{width:"100%"}}>
                    <span>{message}</span>
                </div>
            ) : null}

        </div>
    )
}

export default Exception