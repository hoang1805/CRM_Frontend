import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Client from '../../../utils/client.manager';
import { useNavigate } from 'react-router-dom';
import AvatarName from '../../elements/AvatarName';
import { BsX } from "react-icons/bs";
import { useDebounce } from '../../../hooks/use.debounce';
import api from '../../../utils/Axios';

const LoadingComponent = () => {
    return <div className="loading-component h-full flex justify-center items-center">
        <span className="loading loading-spinner"></span>
    </div>;
}

const ErrorComponent = ({ error }) => {
    return <div className="error h-full flex justify-center items-center">{error}</div>;
}

const EmptyState = () => {
    return <div className="empty-state h-full flex justify-center items-center">
        <div>No results found</div>
    </div>;
};

const InputSearch = forwardRef((props, ref) => {
    const [object, setObject] = useState(props.object || null);
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [show_dropdown, setShowDropdown] = useState(false);
    const debounced_query = useDebounce(input, 300);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useImperativeHandle(ref, () => ({
        getData: () => ({ key: props.name, value: object?.id || null }),
        resetData: () => {
            setObject(props.object || null);
            setInput('');
            setSuggestions([]);
            setError('');
        }
    }));

    useEffect(() => {
        if (!debounced_query) {
            setSuggestions([]);
            return ;
        }

        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await api.get(`${props.url}?query=${encodeURIComponent(debounced_query)}`)
                const data = response.data;
                setSuggestions(data.slice(0, 20));
                setShowDropdown(true);
                setError('');
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [debounced_query, props.url]);

    const handleSelect = (object) => {
        setObject(object);
        setSuggestions([]);
        setShowDropdown(false);
    };

    const clear = () => {
        setObject(null);
        setInput('');
    };

    return (
        <div className={`form-group input-user ${props.className || ''}`}>
            <label 
                className='group-label block mb-2 text-sm font-medium text-gray-900 dark:text-white' 
                htmlFor={props.name || ''}
            >
                {props.label}
            </label>
            <div className="dropdown relative rtl:[--placement:bottom-end] group-input">
                {object ? (
                    <div className="flex items-center justify-between input">
                        <span className="text-sm">{props.display ? props.display(object) : object?.name}</span>
                        <button
                            className="ml-2"
                            onClick={() => clear()}
                        >
                            <BsX />
                        </button>
                    </div>
                ) : (
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={props.placeholder || props.label || ''}
                        className="input"
                        onFocus={() => setShowDropdown(suggestions.length > 0)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
                    />
                )}
                {show_dropdown && !object && (
                    <ul
                        className="suggestions dropdown-menu opacity-100 vertical-scrollbar min-w-60 h-28"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="dropdown-default"
                        style={{
                            position: "absolute",
                        }}
                    >
                        {loading && <LoadingComponent />}
                        {!loading && error && <ErrorComponent error={error}/>}
                        {!loading && !error && suggestions.length === 0 ? <EmptyState /> : suggestions.map((elem, index) => (
                            <li
                                key={index}
                                className="dropdown-item"
                                onClick={() => handleSelect(elem)}
                            >
                                {props.display ? props.display(elem) : elem?.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
});

export default InputSearch;
