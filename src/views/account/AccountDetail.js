import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/Axios';
import loading from '../../utils/Loading';
import { PiUsersThreeFill } from 'react-icons/pi';
import MainContent from '../../components/page/MainContent';
import {
    Avatar,
    Button,
    Card,
    Col,
    Dropdown,
    Layout,
    Progress,
    Row,
    Tabs,
    Tag,
    Tooltip,
} from 'antd';
import Header from '../../components/page/Header';
import '../../styles/views/account/account.detail.scss';
import { UserOutlined } from '@ant-design/icons';
import { MdOutlineEdit } from 'react-icons/md';
import { FaRegCalendarMinus } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import Arr from '../../utils/Array';
import Client from '../../utils/client.manager';
import { CiStar } from 'react-icons/ci';
import { LuPhone } from 'react-icons/lu';
import { LiaBirthdayCakeSolid } from 'react-icons/lia';
import { FaRegEnvelope } from 'react-icons/fa';
import { BsGenderAmbiguous } from 'react-icons/bs';
import { MdContentPaste } from 'react-icons/md';
import DateHelpers from '../../utils/Date';
import Gender from '../../utils/Gender';
import { FiTarget } from 'react-icons/fi';
import { FaRegUserCircle } from 'react-icons/fa';
import AvatarName from '../../components/elements/AvatarName';
import { FaStar } from 'react-icons/fa';
import { FaMoneyBillWave } from 'react-icons/fa';
import AccountInformation from './details/AccountInformation';

const siderStyle = {
    overflow: 'auto',
    height: 'calc(100vh - 85px)',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
};

const AccountDetail = () => {
    const { id } = useParams();
    const [account, setAccount] = useState({});
    const [error, setError] = useState({});

    useEffect(() => {
        (async () => {
            try {
                loading.show();
                const response = await api.get(`/api/account/${id || ''}`);
                setAccount(response.data.account);
            } catch (err) {
                console.log(err);
                setError(
                    err.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau'
                );
            } finally {
                loading.hide();
            }
        })();
    }, [
        account.assignedUserId,
        account.creatorId,
        account.relationshipId,
        account.sourceId,
        id,
    ]);

    return (
        <div className="account-detail">
            <Header
                icon={<PiUsersThreeFill className="icon" />}
                title={'Khách hàng'}
                subtitle={'Chi tiết khách hàng'}
            ></Header>
            <MainContent className="account-detail-content">
                <Layout hasSider>
                    <Layout.Sider
                        width={'25%'}
                        className="mr-[5px] bg-white p-2"
                        style={siderStyle}
                    >
                        <AccountInformation account={account} />
                    </Layout.Sider>
                    <Layout.Content>
                        <Tabs
                            defaultActiveKey="1"
                            items={[
                                {
                                    label: 'Lịch hẹn',
                                    key: '1',
                                    children: '1',
                                },
                                {
                                    label: 'Giao dịch',
                                    key: '2',
                                    children: '2',
                                },
                                {
                                    label: 'Khách hàng phản hồi',
                                    key: '3',
                                    children: '3',
                                },
                            ]}
                        />
                    </Layout.Content>
                </Layout>
            </MainContent>
        </div>
    );
};

export default AccountDetail;
