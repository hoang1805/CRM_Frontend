import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Client from '../../utils/client.manager';
import InputReminder from '../form/inputs/InputReminder';

const TaskReminder = forwardRef((props, ref) => {
    const { value = {} } = props;

    const duration_ref = useRef();

    useImperativeHandle(ref, () => ({
                getValues: () => 
                    duration_ref.current?.getData()?.value || ''
                ,
                resetValues: () => {
                    duration_ref.current?.resetData();
                }
            }));

    return (<div className='flex flex-col gap-1'>
        <InputReminder ref={duration_ref} name='duration' value={value?.duration || 0} label="Nhắc nhở trước ngày kết thúc *"/>
    </div>);
} )

export default TaskReminder;