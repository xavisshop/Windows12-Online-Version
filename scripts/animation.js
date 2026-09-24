/* 开机动画：猫 + 标语展示 → spinner → 淡出进桌面
 * 无布局抖动：全部 CSS 动画，JS 只负责计时跳转 */
(function () {
'use strict';

var DONE = false;

function goDesktop() {
    if (DONE) return;
    DONE = true;
    document.body.classList.add('fadeout');
    setTimeout(function () { window.location.href = 'desktop.html'; }, 480);
}

function init() {
    // spinner 在猫与标语展示后淡入
    setTimeout(function () {
        var sp = document.getElementById('spinner');
        if (sp) sp.classList.add('show');
    }, 900);

    // 总时长：展示约 4s → 淡出
    setTimeout(goDesktop, 4300);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
})();
