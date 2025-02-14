import React from 'react';
import DrawerForm from '../form/DrawerForm';
import InputText from '../form/inputs/InputText';
import InputColorPicker from '../form/inputs/InputColorPicker';
import InputTextarea from '../form/inputs/InputTextarea';

const RelationshipForm = (props) => {
    return (
        <DrawerForm className='relationship-form' submit={props.submit || 'Gửi'} url={props.url} title={props.title} callback={props.callback}>
            <InputText name='name' value={props?.value?.name} label='Tên mối quan hệ*' placeholder='Nhập tên mối quan hệ'/>
            <InputColorPicker name='color' value={props?.value?.color} label='Màu mối quan hệ' />
            <InputTextarea name='description' value={props?.value?.description} label='Mô tả' placeholder='Nhập mô tả'/>
        </DrawerForm>
    );
};

export default RelationshipForm;