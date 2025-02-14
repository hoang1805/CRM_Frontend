import React, { useContext } from 'react';
import { AiFillHome } from "react-icons/ai";
import Header from '../components/page/Header';
import MainContent from '../components/page/MainContent';
import DateHelpers from '../utils/Date';
import AuthContext from '../context/AuthContext';
import Section from '../components/elements/Section';
import ReportCard from '../components/reports/ReportCard';
import '../styles/views/home.scss';
const Home = () => {
    const now = DateHelpers.now();
    const {user} = useContext(AuthContext);
    return (
        <div className='home-page'>
            <Header icon={<AiFillHome className='icon'/>} title={"Trang chủ"}>
            </Header>
            <MainContent className='home-page-content'>
                <div className='sidebar'>
                    <div className='date'>{DateHelpers.getDay(now)}, {DateHelpers.formatDate(now, 'DD/MM/YYYY')}</div>
                    <div className='hello'>Chào buổi {DateHelpers.getTimeOfDay(now)}, {user.name}!</div>
                </div>
                <Section title='Tổng quan' className='report'>
                    <ReportCard title='Số khách hàng' value='150' className='bg-blue-400'/>
                    <ReportCard title='Công việc đã hoàn thành' value='150' className='bg-green-400'/>
                    <ReportCard title='Công việc đang hoàn thành' value='150' className='bg-teal-400'/>
                    <ReportCard title='Công việc quá hạn' value='150' className='bg-red-400'/>
                </Section>
                <Section title='Truy cập nhanh' className='quick-access'>
                    <button className='bg-blue-400'>Tạo công việc</button>
                    <button className='bg-green-400'>Danh sách khách hàng</button>
                    <button className='bg-teal-400'>Tải lên khách hàng</button>
                    <button className='bg-red-400'>Tạo khách hàng</button>
                </Section>
                <Section title='Các công việc sắp đến hạn' className='coming-up-task'></Section>
            </MainContent>
        </div>
    );
};

export default Home;