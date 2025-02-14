import React from 'react';
import ProfileHeader from './ProfileHeader';
import '../../styles/components/profile/profile.scss';
import ProfileDetails from './ProfileDetails';

const Profile = (props) => {
    return (
        <div className={`user-profile ${props.className || ''}`}>
            <ProfileHeader user={props?.user} />
            <ProfileDetails user={props?.user} />
        </div>
    );
};

export default Profile;