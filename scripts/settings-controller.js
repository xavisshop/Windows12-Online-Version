// 设置控制器模块
class SettingsController {
    constructor() {
        this.settingElements = {};
        this.settingOptions = {
            speedstep: ['启用', '禁用'],
            turboboost: ['启用', '禁用'],
            hyperthreading: ['启用', '禁用'],
            virtualization: ['启用', '禁用'],
            memfreq: ['2133 MHz', '2400 MHz', '2666 MHz', '3200 MHz', '3600 MHz'],
            xmp: ['禁用', 'Profile 1', 'Profile 2'],
            fastboot: ['启用', '禁用'],
            uefiboot: ['启用', '禁用'],
            secureboot: ['启用', '禁用']
        };
        this.init();
    }

    init() {
        this.bindSettingElements();
        this.attachEventListeners();
    }

    bindSettingElements() {
        const settingValues = document.querySelectorAll('.setting-value');
        settingValues.forEach(element => {
            const settingName = element.getAttribute('data-setting');
            if (settingName) {
                this.settingElements[settingName] = element;
            }
        });
    }

    attachEventListeners() {
        Object.keys(this.settingElements).forEach(settingName => {
            const element = this.settingElements[settingName];
            element.addEventListener('click', () => {
                this.toggleSetting(settingName);
            });
        });
    }

    toggleSetting(settingName) {
        const element = this.settingElements[settingName];
        const options = this.settingOptions[settingName];
        
        if (!options) return;

        const currentValue = element.textContent.trim();
        const currentIndex = options.indexOf(currentValue);
        const nextIndex = (currentIndex + 1) % options.length;
        const nextValue = options[nextIndex];

        element.textContent = nextValue;
        
        // 更新全局设置
        if (window.biosCore) {
            window.biosCore.biosSettings[settingName] = nextValue;
        }

        // 添加视觉反馈
        element.style.backgroundColor = 'rgba(255,0,0,0.6)';
        setTimeout(() => {
            element.style.backgroundColor = 'rgba(255,0,0,0.2)';
        }, 200);
    }

    getSetting(settingName) {
        const element = this.settingElements[settingName];
        return element ? element.textContent.trim() : null;
    }

    setSetting(settingName, value) {
        const element = this.settingElements[settingName];
        if (element && this.settingOptions[settingName].includes(value)) {
            element.textContent = value;
        }
    }
}

// 初始化设置控制器
const settingsController = new SettingsController();
