import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/page/Header';
import { FaRegUser } from 'react-icons/fa';
import MainContent from '../../components/page/MainContent';
import UserForm from '../../components/user/UserForm';
import flash from '../../utils/Flash';

const AddUser = () => {
    const navigate = useNavigate();
    return (
        <div className="add-user">
            <Header
                icon={<FaRegUser className="icon" />}
                title={'Quản lý người dùng'}
                subtitle={'Thêm người dùng mới'}
            ></Header>
            <MainContent className="add-user flex flex-col items-center justify-center p-20">
                <div>
                    <div className="title text-2xl font-medium pb-4">
                        Thông tin người dùng
                    </div>
                    <UserForm
                        create={true}
                        submit="Tạo người dùng mới"
                        url="/api/user/create"
                        callback={(data) => {
                            flash.success('Thêm người dùng thành công!!!');
                            const user = data?.user || '';
                            if (user.id) navigate(`/user/${user.id}`);
                        }}
                    />
                </div>
            </MainContent>
        </div>
    );
};

export default AddUser;
