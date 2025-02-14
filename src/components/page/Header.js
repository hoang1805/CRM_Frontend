import React from 'react';
import '../../styles/components/page/header.scss';
import UserInfo from '../elements/UserInfo';
import Notification from '../elements/Notification';
import Chat from '../elements/Chat';

const Header = ({icon, title, subtitle}) => {
    return <div className='page-header'>
        {icon ? <div className='header-icon'>{icon}</div> : ''}
        <div className='header-content'>
            <div className='header-title'>{title || ''}</div>
            {subtitle ? <div className='header-subtitle text-black-500'>{subtitle}</div> : ''}
        </div>
        <div className='header-actions'>
            <div className='actions'>
                <Notification className='icon action-item' />
                <Chat className='icon action-item' />
            </div>
            <UserInfo />
        </div>
    </div>;
};

export default Header;
