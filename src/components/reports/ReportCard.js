import React from 'react';
import '../../styles/components/reports/report.card.scss';
const ReportCard = (props) => {
    return (
        <div className={`report-card ${props.className || ''}`}>
            <div className="report-card-title ap-xdot">{props.title}</div>
            <div className='report-card-value ap-xdot'>{props.value}</div>
        </div>
    );
};

export default ReportCard;