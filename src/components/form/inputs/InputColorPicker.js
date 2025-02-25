import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {generate, green, presetPalettes, red} from '@ant-design/colors';
import { ColorPicker, theme } from 'antd';
import loading from '../../../utils/Loading';

const genPresets = (presets = presetPalettes) => {
    return Object.entries(presets).map(([label, colors]) => ({
        label,
        colors,
        key: label,
    }));
};

const InputColorPicker = forwardRef((props, ref) => {
    const [value, setValue] = useState(props.value || '#1677ff');
    const {token} = theme.useToken();
    const presets = genPresets({
        primary: generate(token.colorPrimary),
        red,
    });

    useImperativeHandle(ref, () => ({
        getData: () => ({ key: props.name, value: typeof value === 'string' ? value : value.toHexString()}),
        validate,
        resetData: () => {
            // setValue(props.value || '#1677ff');
        },
    }));

    const validate = () => {
        if (props.validate && typeof props.validate === 'function') {
            return props.validate(value);
        }
        return ''; // Tránh trả về undefined
    };

    return (
        <div
            className={`form-group input-color-picker ${props.className || ''} ${
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
                <ColorPicker 
                    value={value}
                    presets={presets}
                    showText
                    onChangeComplete={(c) => {
                        if (props.callback) {
                            console.log('callback');
                            (async() => {
                                loading.show();
                                let status = await props.callback(c.toHexString());
                                loading.hide();
                                if (status) {
                                    setValue(c.toHexString())
                                } else {
                                    setValue(value);
                                }
                            })();
                            
                        } else {
                            setValue(c.toHexString());
                        }
                    }}
                    disabledAlpha
                />
                
                {props.explanation && (
                    <p className="explanation mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {props.explanation}
                    </p>
                )}
            </div>
        </div>
    );
});

export default InputColorPicker;
