import React from 'react';
import Header from '../../components/page/Header';
import { PiUsersThreeFill } from "react-icons/pi";
import MainContent from '../../components/page/MainContent';
import AccountForm from '../../components/account/AccountForm';
import '../../styles/views/account/add.account.scss';

const AddAccount = () => {
    return (
        <div className='add-account-page'>
            <Header icon={<PiUsersThreeFill className='icon' />} title={"Khách hàng"} subtitle={"Thêm khách hàng mới"}></Header>
            <MainContent className='account-content'>
                <div>
                    <div className='title text-2xl font-medium'>Thông tin khách hàng</div>
                    <AccountForm />
                </div>
            </MainContent>
        </div>
    );
};

export default AddAccount;