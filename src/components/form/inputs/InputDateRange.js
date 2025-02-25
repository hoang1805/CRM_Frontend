import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';
import DateHelpers from '../../../utils/Date';


const InputDateRange = forwardRef((props, ref) => {
    const [value, setValue] = useState(props.value || []);
    const [error, setError] = useState('');

    useImperativeHandle(ref, () => ({
        getData: () => ([
            {
                key: props.name[0],
                value: value[0] || null,
            },
            {
                key: props.name[1],
                value: value[1] || null,
            },
        ]),
        resetData: () => {
            setValue(props.value || []);
            setError('');
        },
    }));


    useEffect(() => {
    }, [value]);

    const format_date = "DD-MM-YYYY";

    return (
        <div
            className={`form-group input-textarea ${props.className || ''} ${
                props.compact ? 'compact' : ''
            }`}
        >
            <label
                className="ap-xdot group-label block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor={props.name || ''}
            >
                {props.label}
            </label>
            <div className="group-input">
                <DatePicker.RangePicker 
                    style={{ width: '100%' }} 
                    format={format_date}
                    onChange={(val, date_string) => {
                        setValue([+dayjs(date_string[0], format_date), +dayjs(date_string[1], format_date)]);
                        // console.log(+dayjs(date_string[0], format_date), +dayjs(date_string[1], format_date));
                    }}
                    value={value.length === 0 ? null : [value[0] ? dayjs(DateHelpers.formatDate(value[0])) : null, value[1] ? dayjs(DateHelpers.formatDate(value[1])) : null]}
                />
                {error && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        {error}
                    </p>
                )}
                {props.explanation && (
                    <p className="explanation mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {props.explanation}
                    </p>
                )}
            </div>
        </div>
    );
});

export default InputDateRange;
