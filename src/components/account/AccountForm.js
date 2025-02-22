import React, { useEffect, useState } from 'react';
import InlineForm from '../form/InlineForm';
import InputText from '../form/inputs/InputText';
import Gender from '../../utils/Gender';
import InputSelect from '../form/inputs/InputSelect';
import InputDate from '../form/inputs/InputDate';
import '../../styles/components/account/account.form.scss';
import InputSearch from '../form/inputs/InputSearch';
import AvatarName from '../elements/AvatarName';
import Client from '../../utils/client.manager';
import Arr from '../../utils/Array';

const AccountForm = (props) => {
    const [relationships, setRelationships] = useState(
        Client.get('relationships') || []
    );
    console.log(props);
    const [sources, setSources] = useState(Client.get('sources') || []);
    const [users, setUsers] = useState(Client.get('users') || []);
    const account = props?.account;

    useEffect(() => {
        const unsubscribe = Client.subscribe(() => {
            setRelationships(Client.get('relationships') || []);
            setSources(Client.get('sources') || []);
            setUsers(Client.get('users') || []);
        });

        return () => unsubscribe();
    }, []);

    return (
        <InlineForm
            className="account-form"
            callback={props.callback}
            cancel
            submit={props.submit}
            url={props.url}
        >
            {/* Hàng 1: Thông tin chính */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <InputText
                    name="name"
                    label="Tên khách hàng*"
                    placeholder="Tên khách hàng"
                    value={account?.name}
                />
                <InputText
                    name="code"
                    label="Mã khách hàng*"
                    placeholder="Mã khách hàng"
                    value={account?.code}
                />
            </div>

            <InputText
                name="email"
                label="Email*"
                type="email"
                placeholder="Email"
                value={account?.email}
            />

            {/* Hàng 2: Email, Số điện thoại, Nghề nghiệp */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <InputText name="phone" label="Số điện thoại" value={account?.phone} />
                <InputText name="job" label="Nghề nghiệp" value={account?.job} />
            </div>

            {/* Hàng 3: Giới tính, Ngày sinh */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <InputSelect
                    name="gender"
                    label="Giới tính"
                    options={Gender.getGenders()}
                    value={account?.gender || 'OTHER'}
                />
                <InputDate name="birthday" label="Ngày sinh" value={account?.birthday}/>
            </div>

            {/* Hàng 4: Nguồn, Mối quan hệ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <InputSelect
                    name="source_id"
                    label="Nguồn *"
                    options={sources}
                    placeholder="Chọn nguồn"
                    value={account?.sourceId}
                />
                <InputSelect
                    name="relationship_id"
                    label="Mối quan hệ"
                    options={relationships}
                    placeholder="Chọn mối quan hệ"
                    value={account?.relationshipId}
                />
            </div>

            {/* Hàng 5: Người giới thiệu, Người phụ trách */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <InputSearch
                    name="referrer_id"
                    label="Người giới thiệu*"
                    placeholder='Nhập tên người giới thiệu'
                    url="/api/user/search"
                    display={(e) => <AvatarName name={e.name || ''} />}
                    object={Arr.findById(users, account?.referrerId)}
                />
                <InputSearch
                    name="assigned_user_id"
                    label="Người phụ trách"
                    url="/api/user/search"
                    placeholder='Nhập tên người phụ trách'
                    display={(e) => <AvatarName name={e.name || ''} />}
                    object={Arr.findById(users, account?.assignedUserId)}
                />
            </div>
        </InlineForm>
    );
};

export default AccountForm;
