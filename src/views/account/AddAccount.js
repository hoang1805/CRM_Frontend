import React from 'react';
import Header from '../../components/page/Header';
import { PiUsersThreeFill } from "react-icons/pi";
import MainContent from '../../components/page/MainContent';
import AccountForm from '../../components/account/AccountForm';
import '../../styles/views/account/add.account.scss';
import flash from '../../utils/Flash';
import { useNavigate } from 'react-router-dom';

const AddAccount = () => {
    const navigate = useNavigate();
    return (
        <div className='add-account-page'>
            <Header icon={<PiUsersThreeFill className='icon' />} title={"Khách hàng"} subtitle={"Thêm khách hàng mới"}></Header>
            <MainContent className='account-content'>
                <div>
                    <div className='title text-2xl font-medium'>Thông tin khách hàng</div>
                    <AccountForm submit='Tạo khách hàng mới' url='/api/account/create' callback={(data) => {
                        flash.success('Thêm khách hàng thành công!!!');
                        const account = data?.account || '';
                        if (account.id) navigate(`/account/${account.id}`);
                    }}/>
                </div>
            </MainContent>
        </div>
    );
};

export default AddAccount;