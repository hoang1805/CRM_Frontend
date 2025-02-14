import React from 'react';
import { IoIosNotificationsOutline } from "react-icons/io";

const Notification = (props) => {
    return (
        <div className={`notification ${props.className || ''}`}>
            <IoIosNotificationsOutline />
        </div>
    );
};

export default Notification;