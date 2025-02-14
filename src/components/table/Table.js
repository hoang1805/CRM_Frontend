import React from 'react';
import '../../styles/components/table/table.scss';

const Table = ({className, columns, data}) => {
    return (
        <div className='table-wp react-table border-base-content/25'>
            <div className={`table-content w-full overflow-x-auto overflow-y-auto vertical-scrollbar horizontal-scrollbar ${className} `}>
                <table className='table rounded border-collapse border border-slate-300'>
                    <thead>
                        <tr className='bg-base-200'>
                            <th className='border border-slate-300 text-center'>#</th>
                            {columns.map((column, index) => (
                                <th key={index} className='border border-slate-300'>{column?.name || ''}</th>
                            ))}
                        </tr>
                    </thead>
                <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td className='border border-slate-300 text-center'>{index + 1}</td>
                                {columns.map((column, index) => (
                                    <td className='border border-slate-300' key={index} style={column?.style || {}}>{column.render ? column.render(row) : row?.[column.key || ''] }</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;