import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/page/Header';
import { FaRegUser } from 'react-icons/fa';
import MainContent from '../../components/page/MainContent';
import UserForm from '../../components/user/UserForm';
import flash from '../../utils/Flash';
import loading from '../../utils/Loading';
import api from '../../utils/Axios';
import { Button, Result } from 'antd';

const EditUser = () => {
    const params = useParams();
    console.log(params);
    const id = params['id'];

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (error) {
            return;
        }

        (async () => {
            try {
                loading.show();
                const response = await api.get(`/api/user/${id || ''}`);
                const data = response.data;
                if (!data?.user || !data?.user?.acl?.edit) {
                    setError(
                        'Bạn không có quyền truy cập vào trang này. Vui lòng thử lại sau!'
                    );
                }

                setUser(data?.user);
            } catch (err) {
                setError(err.message || err.data.message || 'Có lỗi xảy ra');
            } finally {
                loading.hide();
            }
        })();
    }, []);

    return (
        <div className="edit-user">
            <Header
                icon={<FaRegUser className="icon" />}
                title={'Quản lý người dùng'}
                subtitle={'Chỉnh sửa thông tin'}
            ></Header>
            <MainContent className="edit-user flex flex-col items-center justify-center p-20">
                {error ? (
                    <Result
                        status={'error'}
                        title="Error"
                        subTitle={error}
                        extra={
                            <Button
                                type="primary"
                                onClick={() => navigate('/home')}
                            >
                                Back to Home
                            </Button>
                        }
                    />
                ) : (
                    <div>
                        <div className="title text-2xl font-medium pb-4">
                            Thông tin người dùng
                        </div>
                        <UserForm
                            user={user}
                            submit="Chỉnh sửa thông tin"
                            url={`/api/user/edit/${id || ''}`}
                            callback={(data) => {
                                flash.success(
                                    'Chỉnh sửa thông tin người dùng thành công!!!'
                                );
                                const user = data?.user || '';
                                if (user.id) navigate(`/user/${user.id}`);
                            }}
                        />
                    </div>
                )}
            </MainContent>
        </div>
    );
};

export default EditUser;
