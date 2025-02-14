import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/layouts/auth.layout.scss';

const AuthLayout = () => {
    return (
        <div className="auth-layout">
            <div className="banner">
                <div className="wrapper">
                    <img
                        src="/emojj.png"
                        alt="Emojj Banner"
                        className="image"
                    />
                    <div className="app-name">TITANCRM</div>
                    <div className="tagline">
                        Giải pháp công nghệ CRM giá rẻ, hiệu quả hàng đầu Việt
                        Nam
                    </div>
                </div>
            </div>
            <div className="content">
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default AuthLayout;
