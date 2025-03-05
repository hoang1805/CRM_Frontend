import { ClockCircleOutlined } from '@ant-design/icons';
import { InputNumber, Select } from 'antd';
import { Option } from 'antd/es/mentions';
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';

function convertToMilliseconds(input) {
    if (!input) return 0;

    // Biểu thức chính quy để tách số và đơn vị (vd: "5d", "3h", "2w")
    const match = input.match(/^(\d+)([mhdwM])$/);
    if (!match) throw new Error("Invalid format. Example: '5d', '3h', '2w'");

    const value = parseInt(match[1], 10); // Lấy số
    const unit = match[2]; // Lấy đơn vị

    // Chuyển đổi sang milliseconds
    const millisecondsMap = {
        "M": 30 * 24 * 60 * 60 * 1000, // Tháng (giả sử 30 ngày)
        "w": 7 * 24 * 60 * 60 * 1000,  // Tuần
        "d": 24 * 60 * 60 * 1000,      // Ngày
        "h": 60 * 60 * 1000,          // Giờ
        "m": 60 * 1000               // Phút
    };

    if (!millisecondsMap[unit]) throw new Error("Unknown time unit: " + unit);

    return value * millisecondsMap[unit];
}

function convertFromMilliseconds(ms) {
    if (ms <= 0) return [0, 'd'];

    const units = [
        { unit: "M", value: 30 * 24 * 60 * 60 * 1000 }, // Tháng (30 ngày)
        { unit: "w", value: 7 * 24 * 60 * 60 * 1000 },  // Tuần
        { unit: "d", value: 24 * 60 * 60 * 1000 },      // Ngày
        { unit: "h", value: 60 * 60 * 1000 },          // Giờ
        { unit: "m", value: 60 * 1000 }               // Phút
    ];

    for (let { unit, value } of units) {
        if (ms % value === 0) {  // Chỉ nhận nếu chia hết
            return [ms / value, unit];
            // return `${ms / value}${unit}`;
        }
    }

    return [0, 'm'];
    // return "0m"; // Nếu không chia hết đơn vị nào
}



const InputReminder = forwardRef((props, ref) => {
    const [value, setValue] = useState(0);
    const [select, setSelect] = useState(props.select || 'd');
    const [error, setError] = useState('');

    useImperativeHandle(ref, () => ({
        getData: () => ({ key: props.name, value: convertToMilliseconds(`${value}${select}`) }),
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

    // useEffect(() => {
    //     let res = convertFromMilliseconds(props.value || 0);
    //     console.log(res);
    //     setValue(res[0]);
    //     setSelect(res[1]);
    //     // setValue(props.value || 0);
    // }, [props.value]);

    useEffect(() => {
        setError(validate() || '');
    }, [value]);

    useEffect(() => {
        let res = convertFromMilliseconds(props.value || 0);
        setValue(res[0]);
        setSelect(res[1]);
        setError('');
    }, [props.value]);

    const selectAfter = (
        <Select
            defaultValue="d"
            value={select}
            onSelect={setSelect}
            style={{ width: 100 }}
        >
            <Option value="M">Tháng</Option>
            <Option value="w">Tuần</Option>
            <Option value="d">Ngày</Option>
            <Option value="h">Giờ</Option>
            <Option value="m">Phút</Option>
        </Select>
    );

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
                    className="w-full"
                    id={props.name || ''}
                    value={value}
                    onChange={(e) => setValue(e)}
                    min={0}
                    max={60}
                    prefix={<ClockCircleOutlined />}
                    defaultValue={0}
                    addonAfter={selectAfter}
                    formatter={(value) => {
                        if (
                            value === null ||
                            value === undefined ||
                            isNaN(value)
                        )
                            return '';

                        let num = Number(value);
                        let formatted = num.toString();

                        formatted = formatted.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ','
                        );

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

export default InputReminder;
