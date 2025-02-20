import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import AccountProduct from './details/AccountProduct';
import AccountFeedback from './details/AccountFeedback';

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
    const location = useLocation();
    const navigate = useNavigate();
    const query_params = new URLSearchParams(location.search);
    const tab = query_params.get('tab') || 'task';

    const [current_tab, setTab] = useState(tab);

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
                        <Tabs
                            className="pl-[5px]"
                            defaultActiveKey={'task'}
                            activeKey={current_tab}
                            onTabClick={(key) => {
                                query_params.set('tab', key);
                                setTab(key);
                                navigate(
                                    `${
                                        location.pathname
                                    }?${query_params.toString()}`,
                                    {
                                        replace: true, // Tránh tạo thêm một entry mới trong history
                                    }
                                );
                            }}
                            items={[
                                {
                                    label: 'Lịch hẹn',
                                    key: 'task',
                                    children: <AccountTask account={account} />,
                                },
                                {
                                    label: 'Giao dịch',
                                    key: 'product',
                                    children: (
                                        <AccountProduct account={account} />
                                    ),
                                },
                                {
                                    label: 'Khách hàng phản hồi',
                                    key: 'feedback',
                                    children: (
                                        <AccountFeedback account={account} />
                                    ),
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
