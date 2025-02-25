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
import Profile from '../../components/profile/Profile';
import '../../styles/views/me.scss';

const UserDetail = () => {
    const params = useParams();
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
                if (!data?.user || !data?.user?.acl?.view) {
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
        <div className="user-page">
            <Header
                icon={<FaRegUser className="icon" />}
                title={'Quản lý người dùng'}
                subtitle={'Thông tin cá nhân'}
            ></Header>
            <MainContent className="user-info pt-10">
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
                    <Profile user={user} />
                )}
            </MainContent>
        </div>
    );
};

export default UserDetail;
