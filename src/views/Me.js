import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Header from '../components/page/Header';
import { FaRegUser } from "react-icons/fa";
import MainContent from '../components/page/MainContent';
import Profile from '../components/profile/Profile';
import '../styles/views/me.scss';

const Me = () => {
    const {user} = useContext(AuthContext);
    return (
        <div className='me-page'>
            <Header icon={<FaRegUser className='icon'/>} title={"Thông tin cá nhân"}>
            </Header>
            <MainContent className='me-info'>
                <Profile user={user} />
            </MainContent>
        </div>
    );
};

export default Me;