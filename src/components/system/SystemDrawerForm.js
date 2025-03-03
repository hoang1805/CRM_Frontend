import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import InputText from '../form/inputs/InputText';
import InputNum from '../form/inputs/InputNum';

const SystemDrawerForm = forwardRef((props, ref) => {
    // Lấy giá trị mặc định nếu không có props.value
    const { value = {} } = props;

    // Tạo ref cho từng input
    const nameRef = useRef();
    const maxRef = useRef();

    // Expose các method cho ref bên ngoài có thể gọi
    useImperativeHandle(ref, () => ({
        getValues: () => ({
            name: nameRef.current?.getData()?.value || '',
            max_user: maxRef.current?.getData()?.value || '',
        }),
        resetValues: () => {
            nameRef.current?.resetData();
            maxRef.current?.resetData();
        }
    }));

    return (
        <div className='system  -form flex flex-col gap-2'>
            <InputText ref={nameRef} name='name' value={value.name} label='Tên hệ thống*' placeholder='Nhập tên hệ thống' />
            <InputNum ref={maxRef} name='max_user' value={value.max_user} label='Số lượng người dùng tối đa*' />
        </div>
    );
});

export default SystemDrawerForm;
