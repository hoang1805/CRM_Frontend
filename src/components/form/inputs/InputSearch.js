import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { debounce } from 'lodash';
import { Select, Spin } from 'antd';
import api from '../../../utils/Axios';

const TIMEOUT = 800;

const transfer = (item) => ({
    label: item.name || item.label,
    value: item.id,
    data: item,
});

const InputSearch = forwardRef((props, ref) => {
    const [object, setObject] = useState(props.object || null);
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);
    const fetch_ref = useRef(0);

    const debounceFetcher = useMemo(() => {
        const fetchData = async (search) => {
            try {
                const response = await api.get(`${props.url}?query=${search}`);
                return response.data.slice(0, 20).map(transfer);
            } catch (e) {
                return [];
            }
        };

        const loadData = async (search) => {
            fetch_ref.current++;
            const fetch_id = fetch_ref.current;
            setFetching(true);
            const new_options = await fetchData(search);
            if (fetch_id !== fetch_ref.current) return;

            setOptions(new_options);
            setFetching(false);
        };

        return debounce(loadData, TIMEOUT);
    }, [props.url]);

    useImperativeHandle(ref, () => ({
        getData: () => ({ key: props.name, value: object?.id || null }),
        resetData: () => setObject(props.object || null),
    }));

    // Cập nhật object khi props thay đổi
    useEffect(() => {
        setObject(props.object || null);
    }, [props.object]);

    // Thêm object vào options nếu chưa có
    useEffect(() => {
        if (object && !options.some((opt) => opt.value === object.id)) {
            setOptions((prevOptions) => [...prevOptions, transfer(object)]);
        }
    }, [object, options]);

    return (
        <div className={`form-group input-user ${props.className || ''}`}>
            <label className="group-label block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor={props.name || ''}>
                {props.label}
            </label>
            <div className="group-input">
                <Select
                    showSearch
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                    options={options}
                    filterOption={false}
                    placeholder={props.placeholder}
                    onSearch={debounceFetcher}
                    value={object?.id || undefined}
                    onSelect={(value) => {
                        const selected = options.find((opt) => opt.value === value);
                        setObject(selected?.data || null);
                    }}
                    className="w-full"
                />
            </div>
        </div>
    );
});

export default InputSearch;
