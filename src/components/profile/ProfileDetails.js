import React from 'react';
import Gender from '../../utils/Gender';
import '../../styles/components/profile/profile.scss';
import DateHelpers from '../../utils/Date';


const getDetailInfo = (user) => {
    return [
        {label: 'Họ và tên', value: user.name},
        {label: 'Điện thoại', value: user.phone},
        {label: 'Email', value: user.email},
        {label: 'Ngày sinh', value: user.birthday ? DateHelpers.formatDate(user.birthday, 'DD-MM-YYYY') : ''},
        {label: 'Giới tính', value: Gender.fromContext(user.gender)?.label},
        {label: 'Chữ ký', value: user?.sign || 'Không'},
    ];
}

const ProfileDetails = (props) => {
    const user = props.user;
    if (!user) {
        return '';
    }

    return (
        <div className={`profile-details ${props.className || ''}`}>
            <div className='title'>Thông tin chung</div>
            <div className='details-grid'>
                {getDetailInfo(user).map((info, index) => (
                    <div key={index} className='detail-item'>
                        <div className='label'>{info.label}:</div>
                        <div className='value'>{info.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileDetails;