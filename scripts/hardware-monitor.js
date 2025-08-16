// 硬件监控模块
class HardwareMonitor {
    constructor() {
        this.temperatureElements = {
            cpu: document.getElementById('cpu-temp'),
            motherboard: document.getElementById('mb-temp'),
            gpu: document.getElementById('gpu-temp')
        };
        
        this.fanSpeedElements = {
            cpu: document.getElementById('cpu-fan'),
            sys1: document.getElementById('sys-fan1'),
            sys2: document.getElementById('sys-fan2')
        };

        this.monitoringInterval = null;
        this.init();
    }

    init() {
        this.startMonitoring();
    }

    startMonitoring() {
        this.updateHardwareData();
        this.monitoringInterval = setInterval(() => {
            this.updateHardwareData();
        }, 2000);
    }

    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
    }

    updateHardwareData() {
        this.updateTemperatures();
        this.updateFanSpeeds();
    }

    updateTemperatures() {
        // 模拟温度数据，实际应用中应该从硬件读取
        const cpuTemp = this.generateTemperature(40, 70);
        const mbTemp = this.generateTemperature(35, 50);
        const gpuTemp = this.generateTemperature(38, 75);

        if (this.temperatureElements.cpu) {
            this.temperatureElements.cpu.textContent = `${cpuTemp}°C`;
            this.updateTemperatureColor(this.temperatureElements.cpu, cpuTemp);
        }

        if (this.temperatureElements.motherboard) {
            this.temperatureElements.motherboard.textContent = `${mbTemp}°C`;
            this.updateTemperatureColor(this.temperatureElements.motherboard, mbTemp);
        }

        if (this.temperatureElements.gpu) {
            this.temperatureElements.gpu.textContent = `${gpuTemp}°C`;
            this.updateTemperatureColor(this.temperatureElements.gpu, gpuTemp);
        }
    }

    updateFanSpeeds() {
        // 模拟风扇转速数据
        const cpuFanSpeed = this.generateFanSpeed(1500, 2500);
        const sys1FanSpeed = this.generateFanSpeed(800, 1500);
        const sys2FanSpeed = this.generateFanSpeed(800, 1500);

        if (this.fanSpeedElements.cpu) {
            this.fanSpeedElements.cpu.textContent = `${cpuFanSpeed} RPM`;
        }

        if (this.fanSpeedElements.sys1) {
            this.fanSpeedElements.sys1.textContent = `${sys1FanSpeed} RPM`;
        }

        if (this.fanSpeedElements.sys2) {
            this.fanSpeedElements.sys2.textContent = `${sys2FanSpeed} RPM`;
        }
    }

    generateTemperature(min, max) {
        const baseTemp = Math.floor(Math.random() * (max - min) + min);
        const variation = Math.floor(Math.random() * 4) - 2; // ±2度的随机变化
        return Math.max(min, Math.min(max, baseTemp + variation));
    }

    generateFanSpeed(min, max) {
        const baseSpeed = Math.floor(Math.random() * (max - min) + min);
        const variation = Math.floor(Math.random() * 100) - 50; // ±50 RPM的变化
        return Math.max(min, Math.min(max, baseSpeed + variation));
    }

    updateTemperatureColor(element, temperature) {
        if (temperature < 50) {
            element.style.color = '#66ff66'; // 绿色 - 正常
        } else if (temperature < 70) {
            element.style.color = '#ffff66'; // 黄色 - 警告
        } else {
            element.style.color = '#ff6666'; // 红色 - 高温
        }
    }
}

// 初始化硬件监控器
const hardwareMonitor = new HardwareMonitor();
