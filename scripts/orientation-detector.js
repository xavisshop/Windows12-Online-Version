document.addEventListener('DOMContentLoaded', function() {
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    // 检测屏幕方向变化
    function checkOrientation() {
        if (window.innerWidth <= 768) {
            if (window.innerHeight > window.innerWidth) {
                // 竖屏状态，显示遮罩
                mobileOverlay.style.display = 'flex';
            } else {
                // 横屏状态，隐藏遮罩
                mobileOverlay.style.display = 'none';
            }
        } else {
            // 桌面设备，隐藏遮罩
            mobileOverlay.style.display = 'none';
        }
    }
    
    // 初始检测
    checkOrientation();
    
    // 监听屏幕方向变化
    window.addEventListener('orientationchange', function() {
        setTimeout(checkOrientation, 100);
    });
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkOrientation);
});
