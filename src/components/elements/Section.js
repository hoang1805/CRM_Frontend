import React from 'react';

const Section = (props) => {
    return (
        <div className={`section ${props.className || ''}`}>
            <div className='title'>{props.title || ''}</div>
            <div className='content'>
                {props.children || ''}
            </div>
        </div>
    );
};

export default Section;