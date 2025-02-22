import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';
import { Select, Spin } from 'antd';

const InputSelect = forwardRef((props, ref) => {
    const [value, setValue] = useState(props.value || '');

    useImperativeHandle(ref, () => ({
        getData: () => ({ key: props.name, value: value }),
        resetData: () => setValue(props.value || ''),
    }));

    useEffect(() => {
        setValue(props.value || '');
    }, [props.value]);

    return (
        <div
            className={`form-group input-select ${props.className || ''} ${
                props.compact ? 'compact' : ''
            }`}
        >
            {props.label && (
                <label
                    className="ap-xdot group-label block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    htmlFor={props.name || ''}
                >
                    {props.label}
                </label>
            )}
            <div className="group-input">
                <Select
                    showSearch
                    className="w-full"
                    placeholder={props.placeholder}
                    value={value}
                    onSelect={(value) => {
                        setValue(value);
                    }}
                    options={props.options?.map((item) => ({
                        value: item.value || item.id,
                        label: item.label || item.name || '',
                    }))}
                />
                {props.explanation && (
                    <p className="explanation mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {props.explanation}
                    </p>
                )}
            </div>
        </div>
    );
});

export default InputSelect;
