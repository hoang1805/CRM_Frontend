import { useState, useRef, useEffect, forwardRef } from "react";

const InputSelectSearch = forwardRef(({ options, placeholder = "Chọn một mục..." }, ref) => {
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Lọc danh sách theo từ khóa
    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative w-64" ref={dropdownRef}>
            {/* Ô chọn giá trị */}
            <div
                className="border rounded px-3 py-2 cursor-pointer bg-white"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                {selected ? selected.label : placeholder}
            </div>

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute w-full border bg-white shadow-md mt-1 rounded z-10">
                    {/* Thanh tìm kiếm bên trong dropdown */}
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm kiếm..."
                        className="w-full p-2 border-b outline-none"
                        autoFocus
                    />
                    
                    {/* Danh sách tùy chọn */}
                    <ul className="max-h-48 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li
                                    key={option.value}
                                    onMouseDown={() => {
                                        setSelected(option);
                                        setShowDropdown(false);
                                    }}
                                    className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                                >
                                    {option.label}
                                </li>
                            ))
                        ) : (
                            <li className="px-3 py-2 text-gray-500">Không có kết quả</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
});

export default InputSelectSearch;
