import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import InputText from '../form/inputs/InputText';
import InputTextarea from '../form/inputs/InputTextarea';
import InputNum from '../form/inputs/InputNum';

const APDrawerForm = forwardRef((props, ref) => {
    const { value = {} } = props;
    const { account = {} } = props;

    const name_ref = useRef();
    const category_ref = useRef();
    const description_ref = useRef();
    const quantity_ref = useRef();
    const price_ref = useRef();
    const tax_ref = useRef();
    const discount_ref = useRef();

    useImperativeHandle(ref, () => ({
        getValues: () => ({
            name: name_ref.current?.getData()?.value || '',
            category: category_ref.current?.getData()?.value || '',
            description: description_ref.current?.getData()?.value || '',
            quantity: quantity_ref.current?.getData()?.value || 0,
            price: price_ref.current?.getData()?.value || 0,
            tax: tax_ref.current?.getData()?.value || 0,
            discount: discount_ref.current?.getData()?.value || 0,
            account_id: account.id,
        }),
        resetValues: () => {
            name_ref.current?.resetData();
            category_ref.current?.resetData();
            description_ref.current?.resetData();
            quantity_ref.current?.resetData();
            price_ref.current?.resetData();
            tax_ref.current?.resetData();
            discount_ref.current?.resetData();
        },
    }));

    return (
        <div className="flex flex-col gap-1">
            <InputText
                ref={name_ref}
                name="name"
                value={value.name}
                label="Tên sản phẩm *"
            />
            <InputText
                ref={category_ref}
                className="flex-1"
                name="category"
                value={value.category}
                label="Nhóm sản phẩm *"
            />
            <div className="flex flex-row items-center gap-2">
                <InputNum
                    ref={quantity_ref}
                    name="quantity"
                    value={value.quantity}
                    label="Số lượng *"
                    className="flex-1"
                />
                <InputNum
                    ref={price_ref}
                    name="price"
                    value={value.price}
                    label="Giá tiền *"
                    className="flex-1"
                    currency
                    float
                />
            </div>
            <InputTextarea
                ref={description_ref}
                name="description"
                value={value.description}
                label="Mô tả sản phẩm"
            />
            <div className="flex flex-row items-center gap-2">
                <InputNum
                    ref={tax_ref}
                    name="tax"
                    value={value.tax}
                    className="flex-1"
                    label="Thuế %"
                    float
                    percent
                />
                <InputNum
                    ref={discount_ref}
                    name="discount"
                    value={value.discount}
                    className="flex-1"
                    label="Giảm giá %"
                    float
                    percent
                />
            </div>
        </div>
    );
});

export default APDrawerForm;
