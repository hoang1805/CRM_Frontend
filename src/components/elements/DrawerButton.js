import React from 'react';
import DrawerForm from '../form/DrawerForm';
import drawer from '../../utils/Drawer';

const DrawerButton = ({ props }) => {
    const uuid = crypto.randomUUID();
    return (
        <div className="drawer-button">
            <button
                className={`${props.className}`}
                aria-haspopup="dialog"
                aria-expanded="false"
                aria-controls={uuid}
                data-overlay={`#${uuid}`}
            >
                {props.name}
            </button>
            {props.render && drawer.useDrawer(props.render)}
        </div>
    );
};

export default DrawerButton;
