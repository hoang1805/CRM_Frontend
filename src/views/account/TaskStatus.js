const TASK_STATUS = [
    {id: '10', label: 'Draft'},
    {id: '20', label: 'Đang thực hiện'},
    {id: '30', label: 'Đang chờ duyệt'},
    {id: '33', label: 'Đã từ chối'},
    {id: '36', label: 'Đã chấp nhận'},
    {id: '40', label: 'Đã hoàn thành'},
    {id: '50', label: 'Đã hủy'},
];

const TaskStatus = {
    DRAFT: 10,
    IN_PROGRESS: 20,
    PENDING_APPROVAL: 30,
    REJECTED: 33,
    APPROVED: 36,
    COMPLETED: 40,
    CANCELLED: 50,
    fromContext(id) {
        return TASK_STATUS.find(item => item.id == id);
    },
    getTaskStatuses(){
        return TASK_STATUS;
    }
};

export default TaskStatus;