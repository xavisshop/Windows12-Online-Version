// BIOS核心功能模块
class BiosCore {
    constructor() {
        this.activeTab = 'main';
        this.biosSettings = {};
        this.init();
    }

    init() {
        this.initTabs();
        this.initBootSequence();
        this.loadDefaultSettings();
    }

    initTabs() {
        const navTabs = document.querySelectorAll('.nav-tab');
        const tabContents = document.querySelectorAll('.tab-content');

        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetTab = e.target.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });
    }

    switchTab(tabName) {
        // 移除所有active类
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // 添加active类到选中的标签
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.activeTab = tabName;
    }

    initBootSequence() {
        const bootItems = document.querySelectorAll('.boot-item');
        bootItems.forEach(item => {
            item.addEventListener('click', () => {
                this.highlightBootItem(item);
            });
        });
    }

    highlightBootItem(item) {
        document.querySelectorAll('.boot-item').forEach(bootItem => {
            bootItem.style.backgroundColor = 'rgba(255,255,255,0.05)';
        });
        item.style.backgroundColor = 'rgba(255,0,0,0.2)';
    }

    loadDefaultSettings() {
        this.biosSettings = {
            speedstep: true,
            turboboost: true,
            hyperthreading: true,
            virtualization: true,
            memfreq: '3200',
            xmp: 'Profile 1',
            fastboot: true,
            uefiboot: true,
            secureboot: true
        };
    }

    saveSettings() {
        console.log('保存BIOS设置:', this.biosSettings);
        // 这里可以添加实际的保存逻辑
    }

    resetToDefaults() {
        this.loadDefaultSettings();
        console.log('已重置为默认设置');
    }
}

// 初始化BIOS核心模块
const biosCore = new BiosCore();
