import React from 'react';
import Panel from '../components/page/Panel';
import Header from '../components/page/Header';
import { Outlet } from 'react-router-dom';
import '../styles/layouts/main.layout.scss';

const MainLayout = () => {
    return (
        <div className="main-layout">
            <div className="page-panel">
                <Panel />
            </div>
            <div className="main-page">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
