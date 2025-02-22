import React, { useContext, useEffect, useState } from 'react';
import { AiFillHome } from 'react-icons/ai';
import Header from '../components/page/Header';
import MainContent from '../components/page/MainContent';
import DateHelpers from '../utils/Date';
import AuthContext from '../context/AuthContext';
import Section from '../components/elements/Section';
import ReportCard from '../components/reports/ReportCard';
import '../styles/views/home.scss';
import api from '../utils/Axios';
import loading from '../utils/Loading';
import { createStyles } from 'antd-style';
import { ConfigProvider, Empty, Table } from 'antd';
import TaskStatus from './account/TaskStatus';
import Arr from '../utils/Array';
import Client from '../utils/client.manager';
const renderEmpty = (component_name) => {
    if (component_name === 'Table.filter') {
        return (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data" />
        );
    }
};

const useStyle = createStyles(({ css, token }) => {
    const { antCls } = token;

    return {
        customTable: css`
            .${antCls || 'ant'}-table {
                .${antCls || 'ant'}-table-container {
                    .${antCls || 'ant'}-table-body,
                        .${antCls || 'ant'}-table-content {
                        scrollbar-width: thin;
                        scrollbar-color: #eaeaea transparent;
                        scrollbar-gutter: stable;
                    }
                }
            }
        `,
    };
});

const getColumns = (user, users) => {
    return [
        {
            title: 'Công việc',
            dataIndex: 'name',
            width: 150,
            fixed: 'left',
        },
        {
            title: 'Dự án',
            dataIndex: 'project',
            width: 150,
            fixed: 'left',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'start_date',
            width: 150,
            render: (e) => {
                return e ? DateHelpers.formatDate(e, 'DD/MM/YYYY') : '';
            },
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'end_date',
            width: 150,
            render: (e) => {
                return e ? DateHelpers.formatDate(e, 'DD/MM/YYYY') : '';
            },
        },
        {
            title: 'Người phụ trách',
            dataIndex: 'manager_id',
            width: 200,
            render: (e) => {
                const user = Arr.findById(users, e);
                return user ? user.name : 'Không có dữ liệu';
            },
        },
        {
            title: 'Người tham gia',
            dataIndex: 'participant_id',
            width: 200,
            render: (e) => {
                const user = Arr.findById(users, e);
                return user ? user.name : 'Không có dữ liệu';
            },
        },
        {
            title: 'Khách hàng liên quan',
            dataIndex: 'account_export',
            width: 200,
            render: (e) => {
                return e ? e.name : 'Không có dữ liệu';
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 150,
            render: (e) => {
                return e
                    ? TaskStatus.fromContext(e)?.label
                    : 'Không có dữ liệu';
            },
        },
    ];
};

const Home = () => {
    const now = DateHelpers.now();
    const { user } = useContext(AuthContext);
    const [accounts, setAccounts] = useState(0);
    const [completed, setCompleted] = useState(0);
    const [progress, setProgress] = useState(0);
    const [expired, setExpired] = useState(0);
    const [upcoming, setUpcoming] = useState([]);
    const { styles } = useStyle();

    const [users, setUsers] = useState(Client.get('users') || []);

    useEffect(() => {
        const unsubscribe = Client.subscribe(() => {
            setUsers(Client.get('users') || []);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                loading.show();
                const response = await api.get('/api/home/info');
                const data = response.data;
                setAccounts(data.accounts || 0);
                setCompleted(data.completed_task || 0);
                setProgress(data.in_progress || 0);
                setExpired(data.expired || 0);
                setUpcoming(data.upcoming || []);
            } catch (error) {
                console.error(error);
            } finally {
                loading.hide();
            }
        };
        fetchData();
    }, []);
    return (
        <div className="home-page">
            <Header
                icon={<AiFillHome className="icon" />}
                title={'Trang chủ'}
            ></Header>
            <MainContent className="home-page-content">
                <div className="sidebar">
                    <div className="date">
                        {DateHelpers.getDay(now)},{' '}
                        {DateHelpers.formatDate(now, 'DD/MM/YYYY')}
                    </div>
                    <div className="hello">
                        Chào buổi {DateHelpers.getTimeOfDay(now)}, {user.name}!
                    </div>
                </div>
                <Section title="Tổng quan" className="report">
                    <ReportCard
                        title="Số khách hàng"
                        value={accounts}
                        className="bg-blue-400"
                    />
                    <ReportCard
                        title="Công việc đã hoàn thành"
                        value={completed}
                        className="bg-green-400"
                    />
                    <ReportCard
                        title="Công việc đang hoàn thành"
                        value={progress}
                        className="bg-teal-400"
                    />
                    <ReportCard
                        title="Công việc quá hạn"
                        value={expired}
                        className="bg-red-400"
                    />
                </Section>
                <Section title="Truy cập nhanh" className="quick-access">
                    <button className="bg-blue-400">Tạo công việc</button>
                    <button className="bg-green-400">
                        Danh sách khách hàng
                    </button>
                    <button className="bg-teal-400">Tải lên khách hàng</button>
                    <button className="bg-red-400">Tạo khách hàng</button>
                </Section>
                <Section
                    title="Các công việc sắp đến hạn"
                    className="coming-up-task"
                >
                    <ConfigProvider renderEmpty={renderEmpty}>
                        <Table
                            className={styles.customTable}
                            rowKey={(e) => e.id}
                            bordered
                            columns={getColumns(user, users)}
                            dataSource={upcoming || []}
                            pagination={{
                                showSizeChanger: true,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} of ${total} items`,
                                pageSizeOptions: [10, 20, 50, 100, 500],
                            }}
                            locale={{
                                emptyText: (
                                    <Empty description="No Data"></Empty>
                                ),
                            }}
                            scroll={{
                                x: 'max-content',
                                y: 485,
                            }}
                        />
                    </ConfigProvider>
                </Section>
            </MainContent>
        </div>
    );
};

export default Home;
