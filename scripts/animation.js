/* 开机动画：霓虹徽标绘制 → spinner → 淡出进桌面
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
    // spinner 在徽标绘制完成后淡入
    setTimeout(function () {
        var sp = document.getElementById('spinner');
        if (sp) sp.classList.add('show');
    }, 1500);

    // 总时长：绘制 1.75s + 展示 2.6s → 淡出
    setTimeout(goDesktop, 4400);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
})();
