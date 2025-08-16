// 时间显示管理模块
class TimeManager {
    constructor() {
        this.timeElement = document.getElementById('current-time');
        this.dateElement = document.getElementById('current-date');
        this.init();
    }

    init() {
        this.updateTime();
        setInterval(() => {
            this.updateTime();
        }, 1000);
    }

    updateTime() {
        const now = new Date();
        
        const timeString = now.toLocaleTimeString('zh-CN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const dateString = now.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'short'
        });

        if (this.timeElement) {
            this.timeElement.textContent = timeString;
        }
        
        if (this.dateElement) {
            this.dateElement.textContent = dateString;
        }
    }
}

// 初始化时间管理器
const timeManager = new TimeManager();
