import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import '../../styles/components/elements/user.info.scss';
import { useNavigate } from 'react-router-dom';

const UserInfo = () => {
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    return (
        <div className='user-info' onClick={() => navigate('/me')}>
            {user?.avatar ? '' : <img src='/avatar-default.svg' className='avatar' alt='avatar'/>}
        </div>
    );
};

export default UserInfo;