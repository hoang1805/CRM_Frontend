import { InputNumber } from 'antd';
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';

const InputNum = forwardRef((props, ref) => {
    const [value, setValue] = useState(props.value || 0);
    const [error, setError] = useState('');

    useImperativeHandle(ref, () => ({
        getData: () => ({ key: props.name, value: value }),
        validate, // Cho phép cha gọi validate()
        resetData: () => {
            setValue(props.value || '');
            setError('');
        },
    }));

    const validate = () => {
        if (props.validate && typeof props.validate === 'function') {
            return props.validate(value);
        }
        return ''; // Tránh trả về undefined
    };

    useEffect(() => {
        setError(validate() || '');
    }, [value]);

    useEffect(() => {
        setValue(props.value || '');
        setError('');
    }, [props.value]);

    return (
        <div
            className={`form-group input-text ${props.className || ''} ${
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
                <InputNumber
                    className='w-full'
                    id={props.name || ''}
                    value={value}
                    onChange={(e) => setValue(e)}
                    defaultValue={0}
                    stringMode={!!props.float}
                    step={props.float ? 0.01 : 1}
                    precision={props.float ? 2 : 0} // Nếu không phải float thì precision = 0
                    formatter={(value) => {
                        if (
                            value === null ||
                            value === undefined ||
                            isNaN(value)
                        )
                            return '';

                        let num = Number(value);
                        let formatted = props.float
                            ? num.toFixed(2)
                            : num.toString();

                        formatted = formatted.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ','
                        );

                        if (props.percent) {
                            return `${formatted}%`;
                        }

                        if (props.currency) {
                            return `VND ${formatted}`;
                        }

                        return formatted;
                    }}
                    parser={(value) => {
                        if (!value) return '';

                        // Loại bỏ các ký tự không hợp lệ nhưng giữ lại dấu `.` nếu có
                        let parsedValue = value.replace(/[^0-9.-]/g, '');

                        // Đảm bảo chỉ có 1 dấu `.` trong số thập phân
                        let match = parsedValue.match(/^-?\d*\.?\d*/);
                        return match ? parseFloat(match[0]) || 0 : 0;
                    }}
                    placeholder={props.placeholder || props.label || ''}
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

export default InputNum;
