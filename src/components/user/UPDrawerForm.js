import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import InputText from '../form/inputs/InputText';
import InputTextarea from '../form/inputs/InputTextarea';
import InputNum from '../form/inputs/InputNum';
import InputPassword from '../form/inputs/InputPassword';

const UPDrawerForm = forwardRef((props, ref) => {
    const { user = {} } = props;

    const old_password = useRef();
    const new_password = useRef();
    const confirm_password = useRef();

    useImperativeHandle(ref, () => ({
        getValues: () => ({
            old_password: old_password.current?.getData()?.value || '',
            new_password: new_password.current?.getData()?.value || '',
            confirm_password: confirm_password.current?.getData()?.value || '',
        }),
        resetValues: () => {
            old_password.current?.resetData();
            new_password.current?.resetData();
            confirm_password.current?.resetData();
        },
    }));

    return (
        <div className="flex flex-col gap-1">
            <InputPassword
                label='Mật khẩu hiện tại *'
                ref={old_password}
                name='old_password'
                placeholder='Nhập mật khẩu hiện tại'
            />

            <InputPassword
                label='Mật khẩu mới *'
                ref={new_password}
                name='new_password'
                placeholder='Nhập mật khẩu mới'
                explanation=<div className='ml-1'>
                    <p>Mật khẩu mới phải chứa ít nhất 8 ký tự, chứa ít nhất một chữ cái in hoa, một chữ cái in thường, một chữ số và một ký tự đặc biệt. 
                    </p>
                    <p>Ví dụ: Abcd_1234 là một mật khẩu đúng, còn abcd_1234 là một mật khẩu sai.</p>
                </div> 
            />

            <InputPassword
                label='Xác nhận mật khẩu *'
                ref={confirm_password}
                name='confirm_password'
                placeholder='Xác nhận mật khẩu mới'
            />
        </div>  
    );
});

export default UPDrawerForm;
