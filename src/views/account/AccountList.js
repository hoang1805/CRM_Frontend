import React from 'react';
import Header from '../../components/page/Header';
import { PiUsersThreeFill } from "react-icons/pi";

const AccountList = () => {
    return (
        <div className='account-list-page'>
            <Header icon={<PiUsersThreeFill className='icon' />} title={"Khách hàng"} subtitle={"Danh sách khách hàng"}></Header>
        </div>
    );
};

export default AccountList;