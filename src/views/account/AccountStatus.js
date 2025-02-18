const ACCOUNT_STATUS = [
    {id: '10', label: 'Draft'},
    {id: '20', label: 'Đang thực hiện'},
    {id: '30', label: 'Chờ duyệt'},
    {id: '40', label: 'Đã hoàn thành'},
    {id: '50', label: 'Đã hủy'},
];

const AccountStatus = {
    fromContent(id) {
        return ACCOUNT_STATUS.find(item => item.id === id);
    }
};

export default AccountStatus;