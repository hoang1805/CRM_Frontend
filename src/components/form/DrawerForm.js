import React, { useRef } from 'react';
import loading from '../../utils/Loading';
import popup from '../../utils/popup/Popup';
import api from '../../utils/Axios';
import drawer from '../../utils/Drawer';

const DrawerForm = (props) => {
    
    return (
        <div className={`drawer-form form ${props.className || ''}`}>
            {/* {collectRefs(props.children)} */}
        </div>
    );
};

export default DrawerForm;