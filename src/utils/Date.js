const DateHelpers = {
    now(){
        return Date.now();
    },
    getDay(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDay();
        return ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'][day];
    },
    formatDate(timestamp, format = "YYYY-MM-DD HH:mm:ss") {
        const pad = (num) => String(num).padStart(2, "0");
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1); // Tháng trong JS bắt đầu từ 0
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
    
        return format
            .replace("YYYY", year)
            .replace("MM", month)
            .replace("DD", day)
            .replace("HH", hours)
            .replace("mm", minutes)
            .replace("ss", seconds);
    },
    getTimeOfDay(timestamp) {
        const date = new Date(timestamp);
        const hour = date.getHours();
    
        if (hour >= 5 && hour < 12) {
            return "sáng"; // 5h - 11h59
        } else if (hour >= 12 && hour < 14) {
            return "trưa"; // 12h - 13h59
        } else if (hour >= 14 && hour < 18) {
            return "chiều"; // 14h - 17h59
        } else {
            return "tối"; // 18h - 4h59
        }
    }
};

export default DateHelpers;