import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/flatpickr.min.css";
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import DateHelpers from '../../../utils/Date';

const InputDate = forwardRef((props, ref) => {
    const [value, setValue] = useState(props.value || DateHelpers.now());
    const [error, setError] = useState('');

    useImperativeHandle(ref, () => ({
        getData: () => ({ key: props.name, value: value }),
        validate,
        resetData:() => {
            setValue(props.value || DateHelpers.now());
            setError('')
        }
    }));

    const validate = () => {
        if (props.validate && typeof props.validate === 'function') {
            return props.validate(value);
        }
        return ''; // Tránh trả về undefined
    };

    const format_date = "DD-MM-YYYY";
    // console.log(DateHelpers.formatDate(value, format_date));
    return (
        <div className={`form-group input-date ${props.className || ''} ${props.compact ? 'compact' : ''}`}>
            {props.label && (
                <label
                    className="ap-xdot group-label block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    htmlFor={props.name || ''}
                >
                    {props.label}
                </label>
            )}
            <div className='group-input'>
                <DatePicker 
                    style={{width: '100%'}}
                    format={format_date}
                    onChange={(val, date_string) => {
                        setValue(+dayjs(date_string, format_date));
                    }}
                    value={value? dayjs(DateHelpers.formatDate(value, format_date), format_date) : null}
                />
                {error && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        {error}
                    </p>
                )}
                {props.explanation && (
                    <p className="explanation mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {props.explanation}
                    </p>
                )}
            </div>
        </div>
    );
});

export default InputDate;
