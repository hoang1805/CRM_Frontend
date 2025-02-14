import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Client from '../../../utils/client.manager';
import { useNavigate } from 'react-router-dom';
import AvatarName from '../../elements/AvatarName';
import { BsX } from "react-icons/bs";

const getId = (user) => {
    if (typeof user === 'object') {
        return user?.id || null;
    }

    return user;
};

const findById = (users, user_id) => {
    if (!user_id) {
        return null;
    }
    return users.find((user) => getId(user) === user_id);
};

const InputUser = forwardRef((props, ref) => {
    const [users, setUsers] = useState(Client.get('users'));
    const [user, setUser] = useState();
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useImperativeHandle(ref, () => ({
        getData: () => ({ key: props.name, value: user?.id || null }),
        validate,
        resetData: () => {
            const user_id = getId(props.user);
            const user = findById(users, user_id);
            if (user_id && user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setInput('');
            setSuggestions([]);
        }
    }));

    const validate = () => {
        if (props.validate && typeof props.validate === 'function') {
            return props.validate(user);
        }
        return ''; // Tránh trả về undefined
    };

    useEffect(() => {
        const unsubscribe = Client.subscribe(() => {
            setUsers(Client.get('users'));
        });

        const user_id = getId(props.user);
        const user = findById(users, user_id);
        if (user_id && user) {
            setUser(user);
        }
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (input.trim()) {
            const filtered = users?.filter((user) =>
                user?.username.toLowerCase().includes(input.toLowerCase()) || 
                user?.name.toLowerCase().includes(input.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    }, [input, users]);

    const handleSelect = (user) => {
        setUser(user);
        setInput(user.username);
        setSuggestions([]);
    };

    const clear = () => {
        setUser(null);
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
                {user ? (
                    <div className="flex items-center justify-between input">
                        <span className="text-sm" onClick={() => navigate(`/user/${user.id}`)}><AvatarName name={user.name} avatar_url={user?.avatar_url || null} /></span>
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
                    />
                )}
                {suggestions.length > 0 && !user && (
                    <ul
                        className="suggestions dropdown-menu opacity-100 vertical-scrollbar min-w-60"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="dropdown-default"
                        style={{
                            position: "absolute",
                        }}
                    >
                        {suggestions.map((user) => (
                            <li
                                key={user.id}
                                className="dropdown-item"
                                onClick={() => handleSelect(user)}
                            >
                                <AvatarName name={user.name} avatar_url={user?.avatar_url || null} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
});

export default InputUser;
