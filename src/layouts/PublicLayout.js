import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/layouts/public.layout.scss';

const PublicLayout = () => {
    return (
        <div className="public-layout">
            <div className="public-page">
                <Outlet />
            </div>
        </div>
    );
};

export default PublicLayout;
