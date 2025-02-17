import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/Axios';
import loading from '../../utils/Loading';
import { PiUsersThreeFill } from 'react-icons/pi';
import MainContent from '../../components/page/MainContent';
import { Avatar, Button, Dropdown, Layout, Progress, Tooltip } from 'antd';
import Header from '../../components/page/Header';
import '../../styles/views/account/account.detail.scss';
import { UserOutlined } from '@ant-design/icons';
import { MdOutlineEdit } from 'react-icons/md';
import { FaRegCalendarMinus } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import Arr from '../../utils/Array';
import Client from '../../utils/client.manager';
import { CiStar } from "react-icons/ci";
import { LuPhone } from "react-icons/lu";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { FaRegEnvelope } from "react-icons/fa";
import { BsGenderAmbiguous } from "react-icons/bs";
import { MdContentPaste } from "react-icons/md";
import DateHelpers from '../../utils/Date';
import Gender from '../../utils/Gender';

const calculateCompletion = (account, users, relationships, sources) => {
    if (!account || typeof account !== 'object') return 0;

    const keys = Object.keys(account);
    if (keys.length === 0) return 0;

    let totalFields = keys.length;
    let filledFields = 0;
    let filledIdFields = 0;

    keys.forEach((key) => {
        if (
            key == 'creatorId' ||
            key == 'createdAt' ||
            key == 'lastUpdate' ||
            key == 'acl'
        ) {
            totalFields--;
            return;
        }
        const value = account[key];

        if (key.endsWith('Id')) {
            if (!value) {
                return;
            }

            if (key == 'referrerId' || key == 'assignedUserId') {
                filledIdFields += Arr.findById(users, value) != null;
                return;
            }

            if (key == 'relationshipId') {
                filledIdFields += Arr.findById(relationships, value) != null;
                return;
            }

            if (key == 'sourceId') {
                filledIdFields += Arr.findById(sources, value) != null;
                return;
            }

            if (value) filledIdFields++;
            return;
        }

        if (value !== null && value !== undefined && value !== '') {
            filledFields++;
        }
    });

    // Tính phần trăm hoàn thiện
    let completionRate = ((filledFields + filledIdFields) / totalFields) * 100;

    return Math.round(completionRate); // Làm tròn %
};

const AccountDetail = () => {
    const { id } = useParams();
    const [account, setAccount] = useState({});
    const [error, setError] = useState({});

    const [relationships, setRelationships] = useState(
        Client.get('relationships') || []
    );
    const [sources, setSources] = useState(Client.get('sources') || []);
    const [users, setUsers] = useState(Client.get('users') || []);

    useEffect(() => {
        const unsubscribe = Client.subscribe(() => {
            setRelationships(Client.get('relationships') || []);
            setSources(Client.get('sources') || []);
            setUsers(Client.get('users') || []);
        });

        return () => unsubscribe();
    }, []);

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
    }, []);
    return (
        <div className="account-detail">
            <Header
                icon={<PiUsersThreeFill className="icon" />}
                title={'Khách hàng'}
                subtitle={'Chi tiết khách hàng'}
            ></Header>
            <MainContent className="account-detail-content">
                <Layout>
                    <Layout.Sider width={'25%'} className="mr-[5px] bg-white p-2">
                        <div className="flex flex-row gap-2 items-center">
                            <Avatar size={64} icon={<UserOutlined />} />
                            <div className="name text-xl font-medium">
                                {account.name}
                            </div>
                        </div>
                        <div className="flex flex-row gap-2 items-center pt-2">
                            <Tooltip title="Sửa" arrow={false} placement="top">
                                <Button
                                    shape="circle"
                                    icon={<MdOutlineEdit className="" />}
                                    size="large"
                                    className="bg-[#233f80] text-white"
                                ></Button>
                            </Tooltip>
                            <Tooltip
                                title="Lịch hẹn"
                                arrow={false}
                                placement="top"
                            >
                                <Button
                                    shape="circle"
                                    icon={<FaRegCalendarMinus className="" />}
                                    size="large"
                                    className="bg-[#233f80] text-white"
                                ></Button>
                            </Tooltip>
                            <Tooltip title="Xóa" arrow={false} placement="top">
                                <Button
                                    shape="circle"
                                    icon={<FaTrash className="" />}
                                    size="large"
                                    className="bg-red-500 text-white"
                                ></Button>
                            </Tooltip>
                        </div>
                        <div className="flex flex-row gap-4 items-center pt-2">
                            <div style={{flexShrink: 0}}>Hoàn thiện hồ sơ</div>
                            <Progress
                                percent={calculateCompletion(
                                    account,
                                    users,
                                    relationships,
                                    sources
                                )}
                                status='active'
                            />
                        </div>
                        <div className='pt-2'>
                            <div className='flex flex-col gap-2 bg-blue-100 border-blue-600 rounded-lg p-1 border'>
                                <div className='flex flex-row gap-1 items-center'>
                                    <CiStar className='text-blue-600 size-5'/>
                                    {account.name}
                                </div>
                                <div className='flex flex-row gap-2 items-center justify-between'>
                                    <div className='flex flex-row w-[170px] gap-1 items-center '>
                                        <LuPhone className='text-blue-600 size-5'/>
                                        <div className='ap-xdot'>{account.phone || 'Chưa có dữ liệu'}</div>
                                        
                                    </div>
                                    <div className='flex flex-row w-[162px] gap-1 items-center'>
                                        <FaRegEnvelope className='text-blue-600 size-5'/>
                                        <div className='ap-xdot'>{account.email || 'Chưa có dữ liệu'}</div>
                                    </div>
                                </div>
                                <div className='flex flex-rrow gap-2 items-center justify-between'>
                                    <div className='flex flex-row w-[170px] gap-1 items-center'>
                                        <LiaBirthdayCakeSolid className='text-blue-600 size-5'/>
                                        <div className='ap-xdot'>{account.birthday ? DateHelpers.formatDate(account.birthday, 'DD-MM-YYYY') : 'Chưa có dữ liệu'}</div>
                                    </div>
                                    <div className='flex flex-row w-[170px] gap-1 items-center'>
                                        <BsGenderAmbiguous className='text-blue-600 size-5'/>
                                        <div className='ap-xdot'>{account.gender ? Gender.fromContext(account.gender).label : 'Chưa có dữ liệu'}</div>
                                    </div>
                                </div>
                                <div className='flex flex-grow gap-1 items-center'>
                                    <MdContentPaste className='text-blue-600 size-5'/>
                                    <div>{account?.content || 'Chưa có dữ liệu'}</div>
                                </div>
                            </div>
                        </div>
                        <div className='pt-2'></div>
                    </Layout.Sider>
                    <Layout.Content>Content</Layout.Content>
                </Layout>
            </MainContent>
        </div>
    );
};

export default AccountDetail;
