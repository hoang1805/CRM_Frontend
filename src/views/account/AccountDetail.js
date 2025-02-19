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
import AccountInformation from './details/AccountInformation';
import flyonui from 'flyonui';
import AccountTask from './details/AccountTask';

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
                        className="mr-[5px] bg-white p-2 border rounded-lg"
                        style={siderStyle}
                    >
                        <AccountInformation account={account} />
                    </Layout.Sider>
                    <Layout.Content className="ml-[5px] bg-white p-2 border rounded-lg">
                        <Tabs className='pl-[5px]'
                            defaultActiveKey="1"
                            items={[
                                {
                                    label: 'Lịch hẹn',
                                    key: '1',
                                    children: <AccountTask account={account}/>,
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
