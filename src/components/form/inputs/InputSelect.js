import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';

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
                <select
                    id={props.name || ''}
                    className="select"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                >
                    {props.placeholder && <option>{props.placeholder}</option>}
                    {props.options?.map((option, index) => (
                        <option key={index} value={option.value || option.id}>
                            {option.label || option.name || ''}
                        </option>
                    ))}
                </select>
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
