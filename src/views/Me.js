import React, { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import Header from '../components/page/Header';
import { FaRegUser } from "react-icons/fa";
import MainContent from '../components/page/MainContent';
import Profile from '../components/profile/Profile';
import '../styles/views/me.scss';
import { useNavigate } from 'react-router-dom';

const Me = () => {
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        navigate(`/user/${user.id || ''}`);
    })
    return ``;
};

export default Me;