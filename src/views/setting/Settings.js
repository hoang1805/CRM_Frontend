import React from 'react';
import Header from '../../components/page/Header';
import { RiSettings3Fill } from 'react-icons/ri';
import MainContent from '../../components/page/MainContent';
import Section from '../../components/elements/Section';
import '../../styles/views/setting/settings.scss';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();
    return (
        <div className='settings-page'>
            <Header icon={<RiSettings3Fill className='icon'/>} title={"Cài đặt"}/>
            <MainContent className='settings-content'>
                <Section title='Cấu hình hệ thống' className='settings-section'>
                    <ul className="bg-white border-base-content/25 divide-base-content/25 divide-y rounded-md border *:p-3 first:*:rounded-t-md last:*:rounded-b-md">
                        <li className='settings-action' onClick={() => navigate('/settings/sources')}>
                            <div className='name'>Quản lý nguồn khách hàng</div>
                            <div className='description'>Cài đặt thông tin về nguồn khách hàng</div>
                            <div className='button text-blue-600/100 font-medium'>Chi tiết</div>
                        </li>
                        <li className='settings-action' onClick={() => navigate('/settings/relationships')}>
                            <div className='name'>Quản lý mối quan hệ</div>
                            <div className='description'>Cài đặt thông tin về mối quan hệ</div>
                            <div className='button text-blue-600/100 font-medium'>Chi tiết</div>
                        </li>
                        <li className='settings-action' onClick={() => navigate('/settings/customers')}>
                            <div className='name'>Quản lý người dùng</div>
                            <div className='description'>Cài đặt thông tin về người dùng</div>
                            <div className='button text-blue-600/100 font-medium'>Chi tiết</div>
                        </li>
                    </ul>
                </Section>
            </MainContent>
        </div>
    );
};

export default Settings;