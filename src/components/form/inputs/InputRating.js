import { Rate } from 'antd';
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
const InputRating = forwardRef((props, ref) => {
    const [value, setValue] = useState(props.value || props.defaultValue || 0);
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
        setValue(   props.value || props.defaultValue || 0);
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
                <Rate
                    tooltips={desc}
                    onChange={setValue}
                    value={value}
                    starSize={props.size || 20}
                    defaultValue={props.defaultValue || 0}
                />
                {/* {value ? <span>{desc[value - 1]}</span> : null} */}
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

export default InputRating;
