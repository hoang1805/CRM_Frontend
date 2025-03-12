const processes = [
    { id: 'BEGIN', label: 'Chưa bắt đầu', color: '' }, // Màu xanh dương
    { id: 'DOING', label: 'Đang tiến hành', color: '#f39c12' }, // Màu vàng cam
    { id: 'END', label: 'Đã kết thúc', color: '#3498db' }, // Màu xanh lá
    { id: 'EXPIRED', label: 'Quá hạn', color: '#e74c3c' } // Màu đỏ
];

const Process = {
    DOING: 'DOING',
    END: 'END',
    EXPIRED: 'EXPIRED',
    BEGIN: 'BEGIN',
    fromContext(id) {
        return processes.find(process => process.id === id);
    },
    getProcesses(){
        return processes;
    }
};

export default Process;