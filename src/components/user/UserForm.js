import React from 'react';
import InlineForm from '../form/InlineForm';
import InputText from '../form/inputs/InputText';
import InputSelect from '../form/inputs/InputSelect';
import InputDate from '../form/inputs/InputDate';
import Gender from '../../utils/Gender';

const UserForm = (props) => {
    const user = props?.user;
    return (
        <InlineForm
            className="user-form w-[700px]"
            callback={props.callback}
            cancel
            submit={props.submit}
            url={props.url}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 pt-1 pb-1">
                <InputText
                    name="name"
                    label="Tên người dùng *"
                    placeholder="Tên người dùng"
                    value={user?.name}
                />
                <InputText
                    label="Username *"
                    name="username"
                    placeholder="Username"
                    value={user?.username}
                    disabled={!props.create ? true : false}
                />
            </div>

            <InputText
                label="Email *"
                name="email"
                type="email"
                placeholder="Email"
                value={user?.email}
                disabled={!props.create ? true : false}
                className='pt-1 pb-1'
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 pt-1 pb-1">
                <InputText
                    label="Chức danh"
                    name="title"
                    placeholder="Chức danh"
                    value={user?.title}
                />

                <InputText
                    label="Số điện thoại"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={user?.phone}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 pt-1 pb-1">
                <InputSelect
                    name="gender"
                    label="Giới tính"
                    options={Gender.getGenders()}
                    value={user?.gender || 'OTHER'}
                />
                <InputDate
                    name="birthday"
                    label="Ngày sinh"
                    value={user?.birthday}
                    placeholder="Ngày sinh"
                />
            </div>
        </InlineForm>
    );
};

export default UserForm;
