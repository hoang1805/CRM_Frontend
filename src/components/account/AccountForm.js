import React, { useEffect, useState } from 'react';
import InlineForm from '../form/InlineForm';
import InputText from '../form/inputs/InputText';
import Gender from '../../utils/Gender';
import InputSelect from '../form/inputs/InputSelect';
import InputDate from '../form/inputs/InputDate';
import '../../styles/components/account/account.form.scss';
import InputUser from '../form/inputs/InputUser';
import InputSearch from '../form/inputs/InputSearch';
import AvatarName from '../elements/AvatarName';
import Client from '../../utils/client.manager';

const AccountForm = (props) => {
    const [user, setUser] = useState(props.user || null);
    const [relationships, setRelationships] = useState(
        Client.get('relationships') || []
    );
    const [sources, setSources] = useState(Client.get('sources') || []);

    useEffect(() => {
        const unsubscribe = Client.subscribe(() => {
            setRelationships(Client.get('relationships') || []);
            setSources(Client.get('sources') || []);
        });

        return () => unsubscribe();
    }, []);

    return (
        <InlineForm
            className="account-form"
            callback={props.callback}
            cancel
            cancel_text="Reset"
            submit={props.submit}
            url={props.url}
        >
            {/* Hàng 1: Thông tin chính */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <InputText
                    name="name"
                    label="Tên khách hàng*"
                    placeholder="Tên khách hàng"
                />
                <InputText
                    name="code"
                    label="Mã khách hàng*"
                    placeholder="Mã khách hàng"
                />
            </div>

            <InputText
                name="email"
                label="Email*"
                type="email"
                placeholder="Email"
            />

            {/* Hàng 2: Email, Số điện thoại, Nghề nghiệp */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <InputText name="phone" label="Số điện thoại" />
                <InputText name="job" label="Nghề nghiệp" />
            </div>

            {/* Hàng 3: Giới tính, Ngày sinh */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <InputSelect
                    name="gender"
                    label="Giới tính"
                    options={Gender.getGenders()}
                    value="OTHER"
                />
                <InputDate name="birthday" label="Ngày sinh" />
            </div>

            {/* Hàng 4: Nguồn, Mối quan hệ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <InputSelect
                    name="source_id"
                    label="Nguồn"
                    options={sources}
                    placeholder="Chọn nguồn"
                />
                <InputSelect
                    name="relationship_id"
                    label="Mối quan hệ"
                    options={relationships}
                    placeholder="Chọn mối quan hệ"
                />
            </div>

            {/* Hàng 5: Người giới thiệu, Người phụ trách */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <InputSearch
                    name="referrer_id"
                    label="Người giới thiệu"
                    url="/api/user/search"
                    display={(e) => <AvatarName name={e.name || ''} />}
                />
                <InputSearch
                    name="assigned_user_id"
                    label="Người phụ trách"
                    url="/api/user/search"
                    display={(e) => <AvatarName name={e.name || ''} />}
                />
            </div>
        </InlineForm>
    );
};

export default AccountForm;
