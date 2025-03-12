import React, { useContext, useEffect, useState } from 'react';
import InlineForm from '../form/InlineForm';
import InputText from '../form/inputs/InputText';
import InputSelect from '../form/inputs/InputSelect';
import InputDate from '../form/inputs/InputDate';
import Gender from '../../utils/Gender';
import AuthContext from '../../context/AuthContext';
import Role from '../../utils/Role';
import Client from '../../utils/client.manager';

function isSuperAdmin(user) {
    return user.role === Role.SUPER_ADMIN;
}

const UserForm = (props) => {
    const n_user = props?.user;
    const {user} = useContext(AuthContext);
    const [systems_cache, setSystemsCache] = useState(Client.get('systems'));


    useEffect(() => {
        const unsubscribe = Client.subscribe(() => {
            setSystemsCache(Client.get('systems'));
        });

        return () => unsubscribe();
    }, []);

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
                    value={n_user?.name}
                />
                <InputText
                    label="Username *"
                    name="username"
                    placeholder="Username"
                    value={n_user?.username}
                    disabled={!props.create ? true : false}
                />
            </div>

            <InputText
                label="Email *"
                name="email"
                type="email"
                placeholder="Email"
                value={n_user?.email}
                disabled={!props.create ? true : false}
                className='pt-1 pb-1'
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 pt-1 pb-1">
                <InputText
                    label="Chức danh"
                    name="title"
                    placeholder="Chức danh"
                    value={n_user?.title}
                />

                <InputText
                    label="Số điện thoại"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={n_user?.phone}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 pt-1 pb-1">
                <InputSelect
                    name="gender"
                    label="Giới tính"
                    options={Gender.getGenders()}
                    value={n_user?.gender || 'OTHER'}
                />
                <InputDate
                    name="birthday"
                    label="Ngày sinh"
                    value={n_user?.birthday}
                    placeholder="Ngày sinh"
                />
            </div>

            {n_user == null && isSuperAdmin(user) && <InputSelect name="system_id" label='Hệ thống*' options={systems_cache}/>}
        </InlineForm>
    );
};

export default UserForm;
