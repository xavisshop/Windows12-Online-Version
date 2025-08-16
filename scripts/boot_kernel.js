// 自适应进度条宽度计算
function getProgressBarWidth() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 480) {
        return Math.min(screenWidth * 0.8, 250); // 移动端更窄
    } else if (screenWidth <= 768) {
        return Math.min(screenWidth * 0.6, 300); // 平板端
    } else {
        return 400; // 桌面端保持原始宽度
    }
}

// 初始化进度条宽度
function initProgressBar() {
    const progressWidth = getProgressBarWidth();
    const backElement = document.getElementById('back');
    const wrapperElement = document.querySelector('.progress-bar-wrapper');
    
    if (backElement) {
        backElement.style.width = `${progressWidth}px`;
    }
    if (wrapperElement) {
        wrapperElement.style.width = `${progressWidth}px`;
    }
}

// 设置进度条进度
function setProgress(n) {
    const progressWidth = getProgressBarWidth();
    const loadWidth = (progressWidth / 20) * n;
    
    const loadElement = document.getElementById('load');
    const backElement = document.getElementById('back');
    
    if (loadElement) {
        loadElement.style.width = `${loadWidth}px`;
    }
    if (backElement) {
        backElement.style.width = `${progressWidth}px`;
    }
}

// 响应窗口大小变化
function handleResize() {
    initProgressBar();
    // 重新计算当前进度
    if (typeof currentProgress !== 'undefined') {
        setProgress(currentProgress);
    }
    
    // 自适应字体大小
    const screenWidth = window.innerWidth;
    const infoElement = document.getElementById('info');
    if (infoElement) {
        if (screenWidth <= 480) {
            infoElement.style.fontSize = '12px';
        } else if (screenWidth <= 768) {
            infoElement.style.fontSize = '14px';
        } else {
            infoElement.style.fontSize = '16px';
        }
    }
    
    // 自适应Logo位置
    const logoElement = document.querySelector('.xptech-logo');
    if (logoElement) {
        if (screenWidth <= 480) {
            logoElement.style.maxWidth = '95vw';
            logoElement.style.maxHeight = '40vh';
        } else if (screenWidth <= 768) {
            logoElement.style.maxWidth = '90vw';
            logoElement.style.maxHeight = '50vh';
        } else {
            logoElement.style.maxWidth = '90vw';
            logoElement.style.maxHeight = '60vh';
        }
    }
}

// 初始化变量
let currentProgress = 0;
let i = 0;
const progress = [0, 0, 1, 3, 7, 17, 20];
let timer;

// 启动进度动画
function startProgress() {
    timer = setInterval(() => {
        currentProgress = progress[i];
        setProgress(currentProgress);
        i++;
        if (i >= progress.length) {
            if (timer !== undefined) {
                clearInterval(timer);
            }
            setTimeout(() => {
                window.location.href = './animation.html';
            }, 500);
        }
    }, 300);
}

// 启动BIOS
function toBIOS() {
    if (timer !== undefined) {
        clearInterval(timer);
    }
    
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        document.body.innerHTML = '';
        document.body.style.cssText = 'background-color: black; opacity: 1;';
    }, 500);
    
    setTimeout(() => {
        window.location.href = './bios.html';
    }, 1000);
}

// 页面初始化
function initPage() {
    initProgressBar();
    setProgress(0);
    handleResize();
}

// 事件监听器设置
function setupEventListeners() {
    // 窗口大小变化监听
    window.addEventListener('resize', handleResize);
    
    // 设备方向变化监听
    window.addEventListener('orientationchange', () => {
        setTimeout(handleResize, 100);
    });

    // 键盘事件监听
    window.addEventListener('keydown', (event) => {
        if (event.keyCode === 113 || event.key === 'F2') {
            toBIOS();
        }
    });

    // 触摸事件处理
    let touchStartTime = 0;
    let touchMoved = false;
    
    window.addEventListener('touchstart', (e) => {
        touchStartTime = Date.now();
        touchMoved = false;
    });
    
    window.addEventListener('touchmove', () => {
        touchMoved = true;
    });

    window.addEventListener('touchend', (e) => {
        const touchDuration = Date.now() - touchStartTime;
        if (touchDuration < 500 && !touchMoved) {
            toBIOS();
        }
    });

    // 防止右键菜单
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
    
    // 防止双击缩放
    let lastTouchEnd = 0;
    window.addEventListener('touchend', (e) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

// 页面加载完成处理
function handlePageLoad() {
    initPage();
    setupEventListeners();
    setTimeout(startProgress, 500);
}

// 启动应用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handlePageLoad);
} else {
    handlePageLoad();
}
