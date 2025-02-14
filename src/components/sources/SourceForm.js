import React from 'react';
import DrawerForm from '../form/DrawerForm';
import InputSearch from '../form/inputs/InputSearch';
import InputText from '../form/inputs/InputText';
import InputSelect from '../form/inputs/InputSelect';

const SourceForm = (props) => {
    return (
        <DrawerForm className='source-form' submit={props.submit || 'Gửi'} url={props.url} title={props.title} callback={props.callback}>
            <InputSelect name='parent_id' value={props?.value?.parent_id} label='Nguồn khách hàng cha' placeholder='Chọn nguồn khách hàng' options={props.sources}/>
            <InputText name='name' value={props?.value?.name} label='Tên nguồn khách hàng*' placeholder='Nhập tên nguồn'/>
            <InputText name='code' value={props?.value?.code} label='Mã*' placeholder='Nhập mã nguồn'/>
        </DrawerForm>
    );
};

export default SourceForm;