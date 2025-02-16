import React, { useEffect, useState } from 'react';
import Header from '../../components/page/Header';
import { PiUsersThreeFill } from 'react-icons/pi';
import MainContent from '../../components/page/MainContent';
import AccountForm from '../../components/account/AccountForm';
import '../../styles/views/account/add.account.scss';
import flash from '../../utils/Flash';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/Axios';
import loading from '../../utils/Loading';
import { Button, Result } from 'antd';

const EditAccount = () => {
    const params = useParams();
    const id = params['id'];

    const navigate = useNavigate();
    const [account, setAccount] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (error) {
            return ;
        }

        (async () => {
            try {
                loading.show();
                const response = await api.get(`/api/account/${id || ''}`);
                const data = response.data;
                setAccount(data?.account);
            } catch (err) {
                setError(err.message || err.data.message || 'Có lỗi xảy ra');
            } finally {
                loading.hide();
            }
        })();
    }, []);

    return (
        <div className="add-account-page">
            <Header
                icon={<PiUsersThreeFill className="icon" />}
                title={'Khách hàng'}
                subtitle={'Sửa thông tin khách hàng'}
            ></Header>
            <MainContent className="account-content">
                <div>
                    <div className="title text-2xl font-medium">
                        Thông tin khách hàng
                    </div>
                    {error ? (
                        <Result
                            status={'error'}
                            title="Error"
                            subTitle="Error"
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
                        <AccountForm
                            account={account}
                            submit="Sửa thông tin"
                            url={`/api/account/edit/${account?.id}`}
                            callback={(data) => {
                                flash.success('Sửa khách hàng thành công!!!');
                                const account = data?.account || '';
                                if (account?.id)
                                    navigate(`/account/${account?.id}`);
                            }}
                        />
                    )}
                </div>
            </MainContent>
        </div>
    );
};

export default EditAccount;
