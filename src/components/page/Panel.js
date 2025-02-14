import React from 'react';
import { AiFillHome } from "react-icons/ai";
import { PiUsersThreeFill } from "react-icons/pi";
import { CgWorkAlt } from "react-icons/cg";
import { RiSettings3Fill } from "react-icons/ri";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/components/page/panel.scss';

const items = [
    {name: "Trang chủ", icon: <AiFillHome className='item-icon' />, path: '/home'},
    {name: "Khách hàng", icon: <PiUsersThreeFill className='item-icon' />, path: '/account', actions: [
        {name: "Danh sách khách hàng", path: '/account/list'},
        {name: "Thêm mới khách hàng", path: '/account/create'},
        {name: "Tải lên khách hàng", path: '/account/import'}
    ]},
    {name: "Công việc", icon: <CgWorkAlt className='item-icon' />, path: '/task'},
    {name: "Báo cáo", icon: <IoDocumentTextOutline className='item-icon' />, path: '/report'}
];

const Item = ({name, icon, path, actions, top}) => {
    const location = useLocation();
    const is_active = location.pathname.startsWith(path) && top;
    const navigate = useNavigate();
    const handleClick = (e) => {
        if (actions) {
            e.preventDefault(); // Ngăn điều hướng nếu có menu con
        } else {
            navigate(path);
        }
    };
    return (
        <div className={`panel-item ${is_active ? 'active' : ''}`} onClick={handleClick}>
            {icon || ''}
            <span className='item-name'>{name || ''}</span>
            {actions ? <div className='actions'>
                {actions.map((action, index) => { return <Item key={index} name={action.name} path={action.path}/>;})}
            </div> : ''}
        </div>
    );
}

const Panel = () => {
    return <div className='panel'>
        <div className='items-top'>
            {items.map((item, index) => { return <Item key={index} name={item.name} icon={item.icon} path={item.path} actions={item.actions} top={true} />;})}
        </div>
        <div className='items-bottom'>
            <Item icon={<RiSettings3Fill className='item-icon'/>} path={'/settings'} top={true}/>
        </div>
    </div>;
};

export default Panel;
