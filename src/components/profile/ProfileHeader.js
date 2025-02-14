import React from 'react';
import '../../styles/components/profile/profile.scss';

const ProfileHeader = (props) => {
    const user = props.user;
    if (!user) {
        return '';
    }

    return (
        <div className={`profile-header ${props.className || ''}`}>
                <img src={user?.avatar || '/avatar-default.svg'} alt={user.name} />
                <div className='profile-info'>
                    <div className='name'>{user?.name || ''}</div>
                    <div className='title'>{user?.title || ''}</div>
                    <div className='status'>Hiện tại: {user?.status || 'Đang hoạt động'}</div>
                </div>
        </div>
    );
};

export default ProfileHeader;