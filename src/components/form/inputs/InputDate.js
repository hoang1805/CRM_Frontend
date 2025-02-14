import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/flatpickr.min.css";

const InputDate = forwardRef((props, ref) => {
    const [value, setValue] = useState(props.value || new Date());
    const [error, setError] = useState('');

    useImperativeHandle(ref, () => ({
        getData: () => ({ key: props.name, value: value?.getTime() || null }),
        validate,
        resetData:() => {
            setValue(props.value || new Date());
            setError('')
        }
    }));

    const validate = () => {
        if (props.validate && typeof props.validate === 'function') {
            return props.validate(value);
        }
        return ''; // Tránh trả về undefined
    };

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
                <Flatpickr
                    value={value} // Giá trị ngày ban đầu
                    onChange={(e) => setValue(e[0])} // Callback khi chọn ngày
                    options={{
                        dateFormat: 'd-m-Y', // Định dạng ngày tháng (YYYY-MM-DD)
                        enableTime: false, // Nếu muốn có cả giờ thì đặt true
                    }}
                    className="input"
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
