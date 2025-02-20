import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import DrawerForm from '../form/DrawerForm';
import InputSearch from '../form/inputs/InputSearch';
import InputText from '../form/inputs/InputText';
import InputSelect from '../form/inputs/InputSelect';

const SourceDrawerForm = forwardRef((props, ref) => {
    // Lấy giá trị mặc định nếu không có props.value
        const { value = {} } = props;
    
        // Tạo ref cho từng input
        const parent_ref = useRef();
        const name_ref = useRef();
        const code_ref = useRef();
    
        // Expose các method cho ref bên ngoài có thể gọi
        useImperativeHandle(ref, () => ({
            getValues: () => ({
                parent_id: parent_ref.current?.getData()?.value || '',
                name: name_ref.current?.getData()?.value || '',
                code: code_ref.current?.getData()?.value || '',
            }),
            resetValues: () => {
                parent_ref.current?.resetData();
                name_ref.current?.resetData();
                code_ref.current?.resetData();
            }
        }));

    return (
        <div className='source-form flex flex-col gap-2'>
            <InputSelect ref={parent_ref} name='parent_id' value={value?.parent_id} label='Nguồn khách hàng cha' placeholder='Chọn nguồn khách hàng' options={props.sources}/>
            <InputText ref={name_ref} name='name' value={value?.name} label='Tên nguồn khách hàng*' placeholder='Nhập tên nguồn'/>
            <InputText ref={code_ref} name='code' value={value?.code} label='Mã*' placeholder='Nhập mã nguồn'/>
        </div>
    );
});

export default SourceDrawerForm;