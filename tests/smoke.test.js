/* Windows 12 网页版 — jsdom 冒烟测试
 *
 * 运行：node tests/smoke.test.js   （或在 tests/ 下执行 npm test）
 * 用 jsdom 加载 desktop.html 并注入 scripts/win12-desktop.js，
 * 验证"首次访问纯净状态"、视频壁纸接线、AI 助手、窗口管理等核心行为。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'desktop.html'), 'utf8');
const desktopJs = fs.readFileSync(path.join(ROOT, 'scripts', 'win12-desktop.js'), 'utf8');
const desktopCss = fs.readFileSync(path.join(ROOT, 'css', 'win12-desktop.css'), 'utf8');

const jobs = [];
function t(name, fn) { jobs.push([name, fn]); } // 顺序执行，保证"先检查纯净、后做交互"
function ok(cond, msg) { if (!cond) throw new Error(msg || '断言失败'); }

/* 启动一个全新的浏览器环境（空 localStorage），加载页面并等待 init 完成
 * preset：可选，在脚本执行前预置的 localStorage 键值（模拟"非首次访问"） */
async function boot(preset) {
    const dom = new JSDOM(html, {
        url: 'http://localhost/',
        runScripts: 'dangerously',
        pretendToBeVisual: true,
    });
    const { window } = dom;
    // 媒体自动播放探针：任何 audio/video 的 play() 调用都会被计数
    let playCalls = 0;
    const origPlay = window.HTMLMediaElement.prototype.play;
    window.HTMLMediaElement.prototype.play = function () {
        playCalls++;
        return origPlay ? origPlay.call(this) : Promise.resolve();
    };
    if (preset) for (const [k, v] of Object.entries(preset)) window.localStorage.setItem(k, v);
    window.eval(desktopJs);
    await new Promise((resolve, reject) => {
        const iv = setInterval(() => {
            const q = window.document.querySelector('#qsToggles');
            if (q && q.children.length) { clearInterval(iv); resolve(); }
        }, 10);
        setTimeout(() => { clearInterval(iv); reject(new Error('init 未在 5s 内完成')); }, 5000);
    });
    await new Promise(r => setTimeout(r, 60)); // 让 toast 定时器等收尾
    return { dom, window, doc: window.document, playCalls: () => playCalls };
}

function click(window, el) {
    ok(el, '要点击的元素不存在');
    el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
}
function lsKeys(window) {
    const out = [];
    for (let i = 0; i < window.localStorage.length; i++) out.push(window.localStorage.key(i));
    return out;
}

(async () => {
    console.log('== Windows 12 冒烟测试 ==');
    const { window, doc, playCalls } = await boot();

    t('默认壁纸为视频壁纸（#wallpaper 有 wp-video 类）', () => {
        ok(doc.querySelector('#wallpaper').classList.contains('wp-video'), '#wallpaper 缺少 wp-video 类');
        ok(doc.querySelector('#lockscreen').classList.contains('wp-video'), '#lockscreen 缺少 wp-video 类');
    });

    t('无 localStorage 时首次加载不写入任何 w12_ 开头 key', () => {
        const keys = lsKeys(window).filter(k => k.startsWith('w12_'));
        ok(keys.length === 0, '首次加载写入了 localStorage：' + keys.join(', '));
    });

    t('默认主题为深色（html[data-theme]=dark）', () => {
        ok(doc.documentElement.dataset.theme === 'dark', 'data-theme=' + doc.documentElement.dataset.theme);
    });

    t('不自动播放媒体：无 audio/video 元素，无 play() 调用', () => {
        ok(!doc.querySelector('audio'), '页面存在 <audio> 元素');
        ok(!doc.querySelector('video'), '页面存在 <video> 元素');
        ok(playCalls() === 0, '检测到 ' + playCalls() + ' 次媒体 play() 调用');
        ok(!/new\s+Audio\s*\(/.test(desktopJs), '脚本源码中存在 new Audio(');
        ok(!/\.play\s*\(/.test(desktopJs), '脚本源码中存在 .play( 调用');
    });

    t('任务栏媒体小组件存在但不含媒体元素', () => {
        const m = doc.querySelector('#tbMedia');
        ok(m, '#tbMedia 不存在');
        ok(!m.querySelector('audio,video'), '任务栏媒体小组件内含媒体元素');
    });

    t('AI 助手在任务栏已固定（pinned）', () => {
        ok(doc.querySelector('#tbApps .tb-btn[data-app="ai"]'), '任务栏没有 AI 助手按钮');
    });

    t('AI 助手在开始菜单已固定区可找到，点击打开窗口', () => {
        const btn = doc.querySelector('#smPinned .sm-app[data-app="ai"]');
        ok(btn, '开始菜单已固定区没有 AI 助手');
        click(window, btn);
        const win = [...doc.querySelectorAll('#windowLayer .win')]
            .find(w => w.querySelector('[data-aikey]'));
        ok(win, '点击后未打开 AI 助手窗口');
    });

    t('AI 应用窗口内有 Key 输入框和模型输入框', () => {
        const win = [...doc.querySelectorAll('#windowLayer .win')]
            .find(w => w.querySelector('[data-aikey]'));
        ok(win.querySelector('[data-aikey]'), '缺少 [data-aikey] 输入框');
        ok(win.querySelector('[data-aimodel]'), '缺少 [data-aimodel] 输入框');
    });

    t('标题栏按钮为 SVG（min/max/close），最大化后出现还原图标逻辑', () => {
        const win = [...doc.querySelectorAll('#windowLayer .win')]
            .find(w => w.querySelector('[data-aikey]'));
        const btns = win.querySelector('.win-btns');
        ['min', 'max', 'close'].forEach(k => {
            const b = btns.querySelector(`[data-wb="${k}"]`);
            ok(b, '缺少标题栏按钮 data-wb="' + k + '"');
            ok(b.querySelector('svg'), `data-wb="${k}" 按钮内不是 SVG`);
        });
        const maxB = btns.querySelector('[data-wb="max"]');
        ok(maxB.querySelector('.wb-max svg'), '最大化按钮缺少 .wb-max svg');
        ok(maxB.querySelector('.wb-restore svg'), '最大化按钮缺少 .wb-restore svg');
        ok(/\.win\.max\s+\.win-btns\s+\.wb-restore\s*\{\s*display:\s*flex/.test(desktopCss),
            'CSS 缺少 .win.max .win-btns .wb-restore { display:flex } 可见逻辑');
        click(window, maxB);
        ok(win.classList.contains('max'), '点击最大化后 .win 未添加 .max 类');
        click(window, maxB); // 还原，避免影响后续用例
        ok(!win.classList.contains('max'), '再次点击后未还原');
    });

    t('最小化添加 .minimizing 动画类', () => {
        click(window, doc.querySelector('#tbApps .tb-btn[data-app="notepad"]')); // 打开记事本
        const win = [...doc.querySelectorAll('#windowLayer .win')].pop();
        click(window, win.querySelector('[data-wb="min"]'));
        ok(win.classList.contains('minimizing'), '最小化瞬间未添加 .minimizing 类');
    });

    t('打开窗口有 winIn 入场动画（CSS 声明）', () => {
        ok(/@keyframes\s+winIn/.test(desktopCss), 'CSS 缺少 @keyframes winIn');
        ok(/\.win\s*\{[^}]*animation:\s*winIn/.test(desktopCss), 'CSS .win 未使用 winIn 动画');
        ok(doc.querySelector('#windowLayer .win'), '没有已打开的窗口');
    });

    t('body 字体栈含 Segoe UI', () => {
        ok(/font-family:[^;]*Segoe UI/.test(desktopCss), 'CSS body 字体栈不含 Segoe UI');
    });

    t('设置应用里不存在 AI/OrcaRouter 页面（SET_PAGES 无 ai，导航无 AI 助手）', () => {
        const m = desktopJs.match(/const SET_PAGES\s*=\s*\{([\s\S]*?)\};/);
        ok(m, '源码中找不到 SET_PAGES 定义');
        ok(!/(^|[\s,])ai\s*:/.test(m[1]), 'SET_PAGES 含有 ai 页面：' + m[1].trim());
        const nav = desktopJs.match(/const SET_NAV\s*=\s*\[([\s\S]*?)\];/);
        ok(nav && !/['"]ai['"]/.test(nav[1]), 'SET_NAV 含有 AI 助手导航项');
        click(window, doc.querySelector('#tbApps .tb-btn[data-app="settings"]')); // 打开设置
        const setWin = [...doc.querySelectorAll('#windowLayer .win')].pop();
        const navText = [...setWin.querySelectorAll('.set-nav')].map(b => b.textContent).join('|');
        ok(!/AI|Orca/i.test(navText), '设置导航出现 AI 相关项：' + navText);
    });

    t('用户点击切换壁纸后 localStorage 才写入 w12_wallpaper', async () => {
        ok(window.localStorage.getItem('w12_wallpaper') === null, '切换前 w12_wallpaper 已存在');
        const setWin = [...doc.querySelectorAll('#windowLayer .win')].pop();
        await new Promise(r => setTimeout(r, 40)); // 设置窗口的事件委托是 setTimeout(0) 延迟绑定的
        click(window, setWin.querySelector('.set-nav[data-p="personal"]')); // 个性化页
        const th = setWin.querySelector('[data-theme="ribbon"]');
        ok(th, '个性化页没有壁纸缩略图按钮');
        click(window, th);
        ok(window.localStorage.getItem('w12_wallpaper') === '"ribbon"',
            '切换后 w12_wallpaper=' + window.localStorage.getItem('w12_wallpaper'));
        ok(doc.querySelector('#wallpaper').classList.contains('wp-ribbon'), '#wallpaper 未切换到 wp-ribbon');
    });

    t('用户点击切换主题时才写入 w12_theme', () => {
        ok(window.localStorage.getItem('w12_theme') === null, '切换前 w12_theme 已存在');
        const tg = doc.querySelector('#quickSettings .qs-t[data-q="theme"]');
        ok(tg, '快捷设置没有主题开关');
        click(window, tg);
        ok(window.localStorage.getItem('w12_theme') === '"light"',
            '切换后 w12_theme=' + window.localStorage.getItem('w12_theme'));
        ok(doc.documentElement.dataset.theme === 'light', '主题未切换到 light');
    });

    t('已保存的壁纸/主题在刷新后被读取应用（非首次访问路径）', async () => {
        const { doc: d2 } = await boot({ w12_wallpaper: '"night"', w12_theme: '"light"' });
        ok(d2.querySelector('#wallpaper').classList.contains('wp-night'), '刷新后未应用已保存的壁纸');
        ok(d2.documentElement.dataset.theme === 'light', '刷新后未应用已保存的主题');
    });

    console.log('\n== 执行 ==');
    let pass = 0, fail = 0;
    for (const [name, fn] of jobs) {
        try { await fn(); pass++; console.log('  ok - ' + name); }
        catch (e) { fail++; console.log('  FAIL - ' + name + '\n       ' + (e && e.message)); }
    }
    console.log(`\n结果：${pass} 通过，${fail} 失败`);
    process.exit(fail ? 1 : 0);
})().catch(e => { console.error('测试框架异常：', e); process.exit(1); });
