import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import InputText from '../form/inputs/InputText';
import InputDateRange from '../form/inputs/InputDateRange';
import InputTextarea from '../form/inputs/InputTextarea';
import InputSelect from '../form/inputs/InputSelect';
import Client from '../../utils/client.manager';
import InputSearch from '../form/inputs/InputSearch';
import InputFiles from '../form/inputs/InputFiles';

const TaskDrawerForm = forwardRef((props, ref) => {
    const { value = {} } = props;
    const [users, setUsers] = useState(Client.get('users') || []);

    useEffect(() => {
        const unsubscribe = Client.subscribe(() => {
            setUsers(Client.get('users') || []);
        });
        return () => unsubscribe();
    }, []);

    const name_ref = useRef();
    const project_ref = useRef();
    const date_ref = useRef();
    const content_ref = useRef();
    const manager_ref = useRef();
    const participant_ref = useRef();
    const account_ref = useRef();

    useImperativeHandle(ref, () => ({
                getValues: () => ({
                    name: name_ref.current?.getData()?.value || '',
                    project: project_ref.current?.getData()?.value || '',
                    start_date: date_ref.current?.getData()[0]?.value || '',
                    end_date: date_ref.current?.getData()[1]?.value || '',
                    description: content_ref.current?.getData()?.value || '',
                    manager_id: manager_ref.current?.getData()?.value || '',
                    participant_id: participant_ref.current?.getData()?.value || '',
                    account_id: account_ref.current?.getData()?.value || '',
                }),
                resetValues: () => {
                    name_ref.current?.resetData();
                    project_ref.current?.resetData();
                    date_ref.current?.resetData();
                    content_ref.current?.resetData();
                    manager_ref.current?.resetData();
                    participant_ref.current?.resetData();
                    account_ref.current?.resetData();
                }
            }));

    return (<div className='flex flex-col gap-1'>
        <div className='flex flex-row items-center gap-2'>
            <InputText ref={name_ref} className='flex-1' name='name' value={value.name} label="Tên công việc *"/>
            <InputText ref={project_ref} className='flex-1' name='project' value={value.project} label='Dự án *'/>
        </div>
        <InputDateRange ref={date_ref} name={['start_date', 'end_date']} value={[value?.start_date, value?.end_date]} label='Thời gian thực hiện *'/>
        <InputTextarea ref={content_ref} name='description' value={value.description} label='Nội dung'/>
        <InputSelect ref={manager_ref} name='manager_id' value={value.manager_id} label='Người phụ trách *' options={users}/>
        <InputSelect ref={participant_ref}  name='participant_id' value={value.participant_id} label='Người tham gia *' options={users}/>
        <InputSearch ref={account_ref} name='account_id' object={value.account_export || props.account || null} label='Khách hàng liên quan' display={(e) => e.name} url='/api/account/search'/>
        <InputFiles name='attachment' label='Tài liệu đính kèm'/>
    </div>);
} )

export default TaskDrawerForm;