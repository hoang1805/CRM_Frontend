import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Layout, Progress, Row, Tag, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { CiStar } from 'react-icons/ci';
import { FaMoneyBillWave, FaRegCalendarMinus, FaRegEnvelope, FaRegUserCircle, FaStar, FaTrash } from 'react-icons/fa';
import { LiaBirthdayCakeSolid } from 'react-icons/lia';
import { LuPhone } from 'react-icons/lu';
import { MdContentPaste, MdOutlineEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import DateHelpers from '../../../utils/Date';
import { BsGenderAmbiguous } from 'react-icons/bs';
import Gender from '../../../utils/Gender';
import { FiTarget } from 'react-icons/fi';
import AvatarName from '../../../components/elements/AvatarName';
import Client from '../../../utils/client.manager';
import Arr from '../../../utils/Array';
import dayjs from 'dayjs';

const formatNumber = (e) => {
    return `${e}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

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

const AccountInformation = ({account, data}) => {
    const navigate = useNavigate();
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

    const [relationship, setRelationship] = useState(null);
    const [assigned_user_id, setAssignedUserId] = useState(null);
    const [source, setSource] = useState(null);
    const [creator, setCreator] = useState(null);

    useEffect(() => {
        if (account != null) {
            setRelationship(
                Arr.findById(relationships, account.relationshipId)
            );
            setAssignedUserId(Arr.findById(users, account.assignedUserId));
            setSource(Arr.findById(sources, account.sourceId));
            setCreator(Arr.findById(users, account.creatorId));
        }
    }, [account, relationships, sources, users])

    return (
        <div>
            <div className="flex flex-row gap-2 items-center">
                <Avatar size={64} icon={<UserOutlined />} />
                <div className="name text-xl font-medium">{account.name}</div>
            </div>
            <div className="flex flex-row gap-2 items-center pt-2">
                <Tooltip title="Sửa" arrow={false} placement="top">
                    <Button
                        shape="circle"
                        icon={<MdOutlineEdit className="" />}
                        size="large"
                        className="bg-[#233f80] text-white"
                        onClick={() => navigate(`/account/edit/${account.id}`)}
                    ></Button>
                </Tooltip>
                <Tooltip title="Lịch hẹn" arrow={false} placement="top">
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
                <div style={{ flexShrink: 0 }}>Hoàn thiện hồ sơ</div>
                <Progress
                    percent={calculateCompletion(
                        account,
                        users,
                        relationships,
                        sources
                    )}
                    status="active"
                />
            </div>
            <div className="pt-2">
                <div className="flex flex-col gap-2 bg-blue-100 border-blue-600 rounded-lg p-1 border">
                    <div className="flex flex-row gap-1 items-center">
                        <CiStar className="text-blue-600 size-5" />
                        {account.name}
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-between">
                        <div className="flex flex-row w-[170px] gap-1 items-center ">
                            <LuPhone className="text-blue-600 size-5" />
                            <div className="ap-xdot">
                                {account.phone || 'Chưa có dữ liệu'}
                            </div>
                        </div>
                        <div className="flex flex-row w-[162px] gap-1 items-center">
                            <FaRegEnvelope className="text-blue-600 size-5" />
                            <div className="ap-xdot">
                                {account.email || 'Chưa có dữ liệu'}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-rrow gap-2 items-center justify-between">
                        <div className="flex flex-row w-[170px] gap-1 items-center">
                            <LiaBirthdayCakeSolid className="text-blue-600 size-5" />
                            <div className="ap-xdot">
                                {account.birthday
                                    ? DateHelpers.formatDate(
                                          account.birthday,
                                          'DD-MM-YYYY'
                                      )
                                    : 'Chưa có dữ liệu'}
                            </div>
                        </div>
                        <div className="flex flex-row w-[170px] gap-1 items-center">
                            <BsGenderAmbiguous className="text-blue-600 size-5" />
                            <div className="ap-xdot">
                                {account.gender
                                    ? Gender.fromContext(account.gender).label
                                    : 'Chưa có dữ liệu'}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-grow gap-1 items-center">
                        <MdContentPaste className="text-blue-600 size-5" />
                        <div>{account?.content || 'Chưa có dữ liệu'}</div>
                    </div>
                </div>
            </div>
            <div className="pt-2">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-1">
                        <FiTarget />
                        Mối quan hệ
                    </div>
                    <div className="w-[170px]">
                        <Tag
                            fontSize="16"
                            color={relationship?.color || ''}
                            className="ap-xdot text-center"
                        >
                            {relationship?.name || 'Chưa có dữ liệu'}
                        </Tag>
                    </div>
                </div>
            </div>
            <div className="pt-2">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-1">
                        <FaRegUserCircle />
                        Người phụ trách
                    </div>
                    <div className="w-[170px]">
                        {assigned_user_id?.name ? (
                            <AvatarName name={assigned_user_id.name} />
                        ) : (
                            'Chưa có dữ liệu'
                        )}
                    </div>
                </div>
            </div>
            <div className="pt-2 list-card">
                <Row gutter={16}>
                    <Col span={8}>
                        <Card
                            className="drop-shadow-lg"
                            title={
                                <div className="flex flex-col gap-1 justify-center items-center h-23 text-center">
                                    <div className="bg-[#233f80] text-white rounded-full size-6 flex items-center justify-center">
                                        <FaRegCalendarMinus className="" />
                                    </div>
                                    <div
                                        className="text-wrap text-center"
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 400,
                                        }}
                                    >
                                        Liên hệ lần cuối
                                    </div>
                                </div>
                            }
                            hoverable
                        >
                            <div className="font-medium text-center">{data.last_contact ? dayjs(data.last_contact).format('DD-MM-YYYY HH:mm:ss') : 0}</div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            className="drop-shadow-lg"
                            title={
                                <div className="flex flex-col gap-1 justify-center items-center h-23 text-center">
                                    <div className="bg-orange-600 text-white rounded-full size-6 flex items-center justify-center">
                                        <FaStar className="" />
                                    </div>
                                    <div
                                        className="text-wrap text-center"
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 400,
                                        }}
                                    >
                                        Tổng số tương tác
                                    </div>
                                </div>
                            }
                            hoverable
                        >
                            <div className="font-medium text-center">{data.total_contact || 0}</div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            className="drop-shadow-lg"
                            title={
                                <div className="flex flex-col gap-1 justify-center items-center h-23 text-center">
                                    <div className="bg-green-500 text-white rounded-full size-6 flex items-center justify-center">
                                        <FaMoneyBillWave className="" />
                                    </div>
                                    <div
                                        className="text-wrap text-center"
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 400,
                                        }}
                                    >
                                        Giá trị đơn hàng
                                    </div>
                                </div>
                            }
                            hoverable
                        >
                            <div className="font-medium text-center">{formatNumber(data.total?.toFixed(0)) || 0} VND</div>
                        </Card>
                    </Col>
                </Row>
            </div>
            <div className="mt-2 flex flex-col gap-2 p-2 border-2 rounded-lg">
                <div className="flex flex-row items-center justify-between">
                    Nguồn
                    <div className="font-medium">
                        {source?.name || 'Chưa có dữ liệu'}
                    </div>
                </div>
                <div className="flex flex-row items-center justify-between">
                    Người tạo
                    <div className="font-medium">
                        {creator?.name || 'Chưa có dữ liệu'}
                    </div>
                </div>
                <div className="flex flex-row items-center justify-between">
                    Ngày tạo
                    <div className="font-medium">
                        {account?.createdAt
                            ? DateHelpers.formatDate(
                                  account.createdAt,
                                  'DD/MM/YYYY HH:mm'
                              )
                            : 'Chưa có dữ liệu'}
                    </div>
                </div>
                <div className="flex flex-row items-center justify-between">
                    Đã mua
                    <div className="font-medium">
                        {/* {source?.name || 'Chưa có dữ liệu'} */}1 lần
                    </div>
                </div>
                <div className="flex flex-row items-center justify-between">
                    Lần mua hàng gần nhất
                    <div className="font-medium">
                        {account?.lastUpdate
                            ? DateHelpers.formatDate(
                                  account.lastUpdate,
                                  'DD/MM/YYYY HH:mm'
                              )
                            : 'Chưa có dữ liệu'}
                    </div>
                </div>
            </div>
            <div className="mt-2">
                <Card title="Thông tin chính" className="main-info border-2">
                    <div>
                        <b>Tên khách hàng:</b>{' '}
                        {account?.name || 'Chưa có dữ liệu'}
                    </div>
                    <div>
                        <b>Mã khách hàng:</b>{' '}
                        {account?.code || 'Chưa có dữ liệu'}
                    </div>
                    <div>
                        <b>Email:</b> {account?.email || 'Chưa có dữ liệu'}
                    </div>
                    <div>
                        <b>Số điện thoại:</b>{' '}
                        {account?.phone || 'Chưa có dữ liệu'}
                    </div>
                    <div>
                        <b>Ngành nghề:</b> {account?.job || 'Chưa có dữ liệu'}
                    </div>
                    <div>
                        <b>Giới tính:</b>{' '}
                        {account?.gender
                            ? Gender.fromContext(account.gender).label
                            : 'Chưa có dữ liệu'}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AccountInformation;
