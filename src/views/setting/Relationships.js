import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/page/Header';
import { RiSettings3Fill } from 'react-icons/ri';
import MainContent from '../../components/page/MainContent';
import api from '../../utils/Axios';
import drawer from '../../utils/Drawer';
import Table from '../../components/table/Table';
import '../../styles/views/setting/relationships.scss';
import { useNavigate } from 'react-router-dom';
import flash from '../../utils/Flash';
import confirm from '../../utils/popup/ConfirmPopup';
import loading from '../../utils/Loading';
import RelationshipDrawerForm from '../../components/relationships/RelationshipDrawerForm';
import InputColorPicker from '../../components/form/inputs/InputColorPicker';
import DateHelpers from '../../utils/Date';
import Client from '../../utils/client.manager';
import popup from '../../utils/popup/Popup';

const EmptyState = () => {
    return (
        <div className="min-h-60 w-full flex items-center justify-center">
            <div className="flex items-center justify-center flex-col">
                <span className="icon-[tabler--brand-google-drive] mb-2 size-10"></span>
                <div className="text-lg font-medium">No data to show.</div>
            </div>
        </div>
    );
};

const LoadingComponent = () => {
    return (
        <div className="min-h-60 w-full flex items-center justify-center">
            <div className="flex items-center justify-center flex-col">
                <span className="loading loading-spinner loading-lg"></span>
                <div className="text-lg font-medium">Loading</div>
            </div>
        </div>
    );
};

const getColumns = (relationships, navigate, users = [], formRef) => {
    return [
        {
            name: 'Tên mối quan hệ',
            render: (e) => {
                return e.name;
            },
        },
        {
            name: 'Màu mối quan hệ',
            render: (e) => {
                return (
                    <InputColorPicker
                        value={e.color}
                        callback={async (color) => {
                            try {
                                const response = await api.post(
                                    `/api/relationship/edit.color/${e.id}`,
                                    { color: color }
                                );
                                flash.success('Cập nhật màu thành công!');
                                return true;
                            } catch (err) {
                                flash.error('Cập nhật màu thất bại!');
                                return false;
                            }
                        }}
                    />
                );
            },
        },
        {
            name: 'Mô tả',
            render: (e) => {
                return e.description;
            },
            style: {
                maxWidth: '250px',
            },
        },
        {
            name: 'Người tạo / Ngày tạo',
            render: (e) => {
                const user = users.find(
                    (u) => u.id === e.creatorId || u.id === e.creator_id
                );
                return (
                    <div>
                        <div>{user?.name || 'Không có dữ liệu'}</div>
                        <div className="text-sm text-gray-500">
                            {DateHelpers.formatDate(
                                e.createdAt,
                                'DD/MM/YYYY HH:mm'
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            name: 'Thao tác',
            render: (e) => {
                const acl = e.acl;
                return (
                    <>
                        {acl?.edit || acl?.edit == null ? (
                            <button
                                className="btn btn-circle btn-text btn-sm"
                                aria-label="Action button"
                                onClick={() => {
                                    drawer.showForm({
                                        title: 'Cập nhật mối quan hệ',
                                        url: `/api/relationship/edit/${e.id}`,
                                        callback: () => {
                                            flash.success(
                                                'Cập nhật thành công!'
                                            );
                                            navigate(0);
                                        },
                                        width: 500,
                                        submit: 'Cập nhật',
                                        content: (
                                            <RelationshipDrawerForm
                                                value={e}
                                                submit="Cập nhật"
                                            />
                                        ),
                                    });
                                }}
                            >
                                <span className="icon-[tabler--pencil] size-5"></span>
                            </button>
                        ) : (
                            ''
                        )}
                        {acl?.delete || acl?.delete == null ? (
                            <button
                                className="btn btn-circle btn-text btn-sm"
                                aria-label="Action button"
                                onClick={() => {
                                    confirm.show(
                                        'Are you sure you want to delete this relationship? This action can not be undone.',
                                        (choose) => {
                                            if (choose) {
                                                const deleteRelationship =
                                                    async () => {
                                                        try {
                                                            loading.show();
                                                            const response =
                                                                await api.delete(
                                                                    `/api/relationship/delete/${e.id}`
                                                                );
                                                            flash.success(
                                                                'Xóa thành công!'
                                                            );
                                                            navigate(0);
                                                        } catch (err) {
                                                            popup.error(
                                                                'Xóa thất bại!'
                                                            );
                                                            console.error(err);
                                                        } finally {
                                                            loading.hide();
                                                        }
                                                    };
                                                deleteRelationship();
                                            }
                                        }
                                    );
                                }}
                            >
                                <span className="icon-[tabler--trash] size-5"></span>
                            </button>
                        ) : (
                            ''
                        )}
                    </>
                );
            },
        },
    ];
};

const Relationships = () => {
    const formRef = useRef({});
    const [relationships, setRelationships] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [users, setUsers] = useState(Client.get('users'));

    useEffect(() => {
        const unsubscribe = Client.subscribe(() => {
            setUsers(Client.get('users'));
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        async function loadRelationships() {
            setLoading(true);
            try {
                const response = await api.get('/api/relationship/list');
                const data = response.data || [];

                if (Array.isArray(data)) {
                    setRelationships(data);
                } else {
                    setRelationships([]);
                }
            } catch (error) {
                setRelationships([]);
            } finally {
                setLoading(false);
            }
        }

        loadRelationships();
    }, []);

    return (
        <div className="relationships-page">
            <Header
                icon={<RiSettings3Fill className="icon" />}
                title={'Cấu hình hệ thống'}
                subtitle={'Quản lý mối quan hệ'}
            />
            <MainContent className="relationships">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="text-lg font-semibold">
                                Quản lý mối quan hệ
                            </div>
                        </div>
                        <button
                            className="btn bg-[#233F80] text-white hover:bg-[#233F80]/90"
                            onClick={() => {
                                drawer.showForm({
                                    title: 'Thêm mối quan hệ',
                                    url: `/api/relationship/create`,
                                    callback: () => {
                                        flash.success('Thêm thành công!');
                                        navigate(0);
                                    },
                                    width: 500,
                                    submit: 'Thêm',
                                    content: <RelationshipDrawerForm />,
                                });
                            }}
                        >
                            Thêm mới
                        </button>
                    </div>
                    {loading && <LoadingComponent />}
                    {!loading && relationships.length === 0 && <EmptyState />}
                    {!loading && relationships.length !== 0 && (
                        <Table
                            className={'relationship-table bg-white'}
                            columns={getColumns(
                                relationships,
                                navigate,
                                users,
                                formRef
                            )}
                            data={relationships}
                        />
                    )}
                </div>
            </MainContent>
        </div>
    );
};

export default Relationships;
