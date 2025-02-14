import React from 'react';

const MainContent = (props) => {
    return (
        <div className='main-content-wp'>
            <div className={`main-content ${props.className || ''}`}>
                {props.children}
            </div>
        </div>
    );
};

export default MainContent;