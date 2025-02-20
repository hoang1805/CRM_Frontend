import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import InputText from '../form/inputs/InputText';
import InputColorPicker from '../form/inputs/InputColorPicker';
import InputTextarea from '../form/inputs/InputTextarea';

const RelationshipDrawerForm = forwardRef((props, ref) => {
    // Lấy giá trị mặc định nếu không có props.value
    const { value = {} } = props;

    // Tạo ref cho từng input
    const nameRef = useRef();
    const colorRef = useRef();
    const descriptionRef = useRef();

    // Expose các method cho ref bên ngoài có thể gọi
    useImperativeHandle(ref, () => ({
        getValues: () => ({
            name: nameRef.current?.getData()?.value || '',
            color: colorRef.current?.getData()?.value || '',
            description: descriptionRef.current?.getData()?.value || '',
        }),
        resetValues: () => {
            nameRef.current?.resetData();
            colorRef.current?.resetData();
            descriptionRef.current?.resetData();
        }
    }));

    return (
        <div className='relationship-form flex flex-col gap-2'>
            <InputText ref={nameRef} name='name' value={value.name} label='Tên mối quan hệ*' placeholder='Nhập tên mối quan hệ' />
            <InputColorPicker ref={colorRef} name='color' value={value.color} label='Màu mối quan hệ' />
            <InputTextarea ref={descriptionRef} name='description' value={value.description} label='Mô tả' placeholder='Nhập mô tả' />
        </div>
    );
});

export default RelationshipDrawerForm;
