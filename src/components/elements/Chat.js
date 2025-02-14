import React from 'react';
import { IoChatboxOutline } from "react-icons/io5";

const Chat = (props) => {
    return (
        <div className={`chat ${props.className || ''}`}>
            <IoChatboxOutline />
        </div>
    );
};

export default Chat;