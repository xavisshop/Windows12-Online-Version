// 自适应功能和启动逻辑
(function() {
    'use strict';
    
    // 检测设备类型
    function detectDevice() {
        const userAgent = navigator.userAgent;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isTablet = /iPad|Android/i.test(userAgent) && window.innerWidth >= 768;
        
        return {
            isMobile: isMobile && !isTablet,
            isTablet: isTablet,
            isDesktop: !isMobile
        };
    }
    
    // 动态调整加载时间
    function getLoadingTime() {
        const device = detectDevice();
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        let baseTime = 5000; // 默认5秒
        
        // 根据设备类型调整
        if (device.isMobile) {
            baseTime = 4000; // 移动端稍快
        } else if (device.isTablet) {
            baseTime = 4500; // 平板中等
        }
        
        // 根据网络状况调整
        if (connection) {
            const effectiveType = connection.effectiveType;
            switch (effectiveType) {
                case 'slow-2g':
                case '2g':
                    baseTime += 2000;
                    break;
                case '3g':
                    baseTime += 1000;
                    break;
                case '4g':
                    baseTime -= 500;
                    break;
            }
        }
        
        return Math.max(3000, Math.min(8000, baseTime)); // 限制在3-8秒之间
    }
    
    // 处理屏幕方向变化
    function handleOrientationChange() {
        // 延迟处理，等待浏览器完成方向切换
        setTimeout(() => {
            const container = document.querySelector('.boot-container');
            if (container) {
                // 强制重新计算布局
                container.style.display = 'none';
                container.offsetHeight; // 触发重排
                container.style.display = 'flex';
            }
        }, 100);
    }
    
    // 处理视窗大小变化
    function handleResize() {
        // 防抖处理
        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(() => {
            // 更新CSS自定义属性（如果需要）
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }, 150);
    }
    
    // 初始化函数
    function init() {
        console.log('系统启动中...');
        
        // 设置初始视窗高度
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // 添加设备类型类名
        const device = detectDevice();
        const body = document.body;
        
        if (device.isMobile) {
            body.classList.add('device-mobile');
        } else if (device.isTablet) {
            body.classList.add('device-tablet');
        } else {
            body.classList.add('device-desktop');
        }
        
        // 监听事件
        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', handleResize);
        
        // 预加载主页面资源
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = 'main.html';
        document.head.appendChild(link);
        
        // 动态加载时间
        const loadingTime = getLoadingTime();
        console.log(`预计加载时间: ${loadingTime}ms`);
        
        // 模拟启动完成
        setTimeout(() => {
            // 添加淡出效果
            document.body.style.transition = 'opacity 0.5s ease-out';
            document.body.style.opacity = '0';
            
            setTimeout(() => {
                // 隐藏加载动画
                const container = document.querySelector('.boot-container');
                if (container) {
                    container.style.display = 'none';
                }
                
                // 跳转到桌面页面
                window.location.href = 'desktop.html';
            }, 500);
            
            console.log('系统启动完成！');
        }, loadingTime);
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 防止页面被缓存时出现问题
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            window.location.reload();
        }
    });
    
})();
