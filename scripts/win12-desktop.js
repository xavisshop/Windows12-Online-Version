/* Windows 12 网页版 — 桌面逻辑
 * 还原对象：Kamer Kaan Avdan《Introducing Windows 12 (Concept)》
 * 任务栏：深色悬浮整宽条（左小组件 / 中应用 / 右托盘时钟）
 */
(function () {
'use strict';

/* ================= SVG 图标库 ================= */
const S = (inner, vb) => `<svg viewBox="${vb || '0 0 24 24'}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
const RSQ = (fill, inner) => S(`<rect x="1" y="1" width="22" height="22" rx="5.5" fill="${fill}"/>${inner}`);
const GLYPH = (bg, fg, t, fs) => RSQ(bg, `<text x="12" y="${15 + (fs ? 0 : 0)}" text-anchor="middle" font-size="${fs || 13}" font-weight="700" fill="${fg}" font-family="Segoe UI, Arial">${t}</text>`);

const ICONS = {
    search: S('<circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="#e0449e" stroke-width="2.6"/><line x1="15.3" y1="15.3" x2="21" y2="21" stroke="#e0449e" stroke-width="2.6" stroke-linecap="round"/>'),
    widgets: S('<rect x="2" y="2" width="11" height="11" rx="3" fill="#8b5cf6"/><rect x="11" y="11" width="11" height="11" rx="3" fill="#e0449e"/>'),
    explorer: S('<path d="M2.5 6.5c0-1.4 1.1-2.5 2.5-2.5h4.6c.8 0 1.6.4 2 1.1l1.2 1.9h6.2c1.4 0 2.5 1.1 2.5 2.5v8c0 1.4-1.1 2.5-2.5 2.5H5c-1.4 0-2.5-1.1-2.5-2.5v-11z" fill="#ffc83d"/><path d="M2.5 10.5h19v7c0 1.4-1.1 2.5-2.5 2.5H5c-1.4 0-2.5-1.1-2.5-2.5v-7z" fill="#ffab1a"/><rect x="7" y="13" width="10" height="4.6" rx="2.3" fill="#ff8f6b" opacity=".85"/>'),
    edge: S('<path d="M12 2a10 10 0 1 0 9.5 13.2c-.3-1-1.4-1.6-2.4-1.3-2.9.9-6.1-.4-7.4-3.2-.4-.9.1-2 1.1-2.2 2.5-.6 5.2.5 6.3 2.8.4.9 1.6 1.1 2.4.5A10 10 0 0 0 12 2z" fill="#0c88c1"/><path d="M12 6.5c-3 0-5.5 2.4-5.5 5.5 0 .8.6 1.4 1.3 1.3 2-.3 4 .8 4.7 2.7.3.8 1.3 1 2 .4A5.5 5.5 0 0 0 12 6.5z" fill="#37c6d0"/>'),
    photos: S('<rect x="2" y="4" width="20" height="16" rx="3" fill="#0ea5e9"/><circle cx="8.5" cy="10" r="2" fill="#fef9c3"/><path d="M2 17l5.5-5 4 4 3.5-3.5L22 19v1a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-3z" fill="#4ade80"/>'),
    store: S('<path d="M5 8h14l-1.2 12.1a1.5 1.5 0 0 1-1.5 1.4H7.7a1.5 1.5 0 0 1-1.5-1.4L5 8z" fill="#3b82f6"/><path d="M8.5 8V6.8a3.5 3.5 0 0 1 7 0V8" fill="none" stroke="#1d4ed8" stroke-width="2"/>'),
    settings: S('<circle cx="12" cy="12" r="3.4" fill="#9ca3af"/><path d="M12 2.8l1.2 2.7 2.9-.6 1 2.8 2.9.7-.3 3 2.3 1.9-1.9 2.3.6 2.9-2.8 1-1 2.8-2.9-.6-1.2 2.7-1.2-2.7-2.9.6-1-2.8-2.9-.7.3-3-2.3-1.9 1.9-2.3-.6-2.9 2.8-1 1-2.8 2.9.6z" fill="#9ca3af" opacity=".55"/>'),
    terminal: RSQ('#111', '<text x="12" y="16.5" text-anchor="middle" font-size="11" font-weight="700" fill="#4ade80" font-family="Consolas, monospace">&gt;_</text>'),
    notepad: S('<rect x="5" y="2.5" width="14" height="19" rx="2" fill="#fff"/><rect x="5" y="2.5" width="14" height="5" rx="2" fill="#3b82f6"/><line x1="8" y1="12" x2="16" y2="12" stroke="#cbd5e1" stroke-width="1.6"/><line x1="8" y1="15.5" x2="16" y2="15.5" stroke="#cbd5e1" stroke-width="1.6"/><line x1="8" y1="19" x2="14" y2="19" stroke="#cbd5e1" stroke-width="1.6"/>'),
    mail: S('<rect x="2.5" y="5" width="19" height="14" rx="2.5" fill="#0ea5e9"/><path d="M3 7l9 6 9-6" fill="none" stroke="#fff" stroke-width="2"/>'),
    calendar: S('<rect x="3" y="4.5" width="18" height="17" rx="2.5" fill="#fff"/><rect x="3" y="4.5" width="18" height="5.5" rx="2.5" fill="#e0449e"/><rect x="7" y="2.5" width="2.4" height="5" rx="1.2" fill="#64748b"/><rect x="14.6" y="2.5" width="2.4" height="5" rx="1.2" fill="#64748b"/><text x="12" y="18.5" text-anchor="middle" font-size="8" font-weight="700" fill="#334155">12</text>'),
    todo: S('<circle cx="12" cy="12" r="10" fill="#0ea5e9"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'),
    clock: S('<circle cx="12" cy="12" r="9.5" fill="#fff"/><circle cx="12" cy="12" r="9.5" fill="none" stroke="#64748b" stroke-width="1.6"/><path d="M12 7v5.4l3.6 2.2" fill="none" stroke="#334155" stroke-width="2" stroke-linecap="round"/>'),
    weather: S('<circle cx="9" cy="9" r="4.4" fill="#fbbf24"/><ellipse cx="15" cy="16" rx="6" ry="4" fill="#e2e8f0"/><ellipse cx="12" cy="14.5" rx="4.4" ry="3.2" fill="#f1f5f9"/>'),
    calc: S('<rect x="5" y="2.5" width="14" height="19" rx="2.5" fill="#334155"/><rect x="8" y="6" width="8" height="4" rx="1" fill="#a5f3fc"/><circle cx="9" cy="14" r="1.3" fill="#e2e8f0"/><circle cx="12" cy="14" r="1.3" fill="#e2e8f0"/><circle cx="15" cy="14" r="1.3" fill="#e2e8f0"/><circle cx="9" cy="17.5" r="1.3" fill="#e2e8f0"/><circle cx="12" cy="17.5" r="1.3" fill="#e2e8f0"/><circle cx="15" cy="17.5" r="1.3" fill="#e2e8f0"/>'),
    word: GLYPH('#2b579a', '#fff', 'W'),
    excel: GLYPH('#217346', '#fff', 'X'),
    ppt: GLYPH('#d24726', '#fff', 'P'),
    adobe: GLYPH('#1f1f2e', '#e0449e', 'A', 14),
    ae: GLYPH('#1f1f3a', '#a78bfa', 'Ae', 11),
    pdf: GLYPH('#dc2626', '#fff', 'PDF', 8),
    mp4: RSQ('#7c3aed', '<path d="M10 8.5l6 3.5-6 3.5z" fill="#fff"/>'),
    txt: RSQ('#e2e8f0', '<line x1="7" y1="8" x2="17" y2="8" stroke="#64748b" stroke-width="1.8"/><line x1="7" y1="12" x2="17" y2="12" stroke="#64748b" stroke-width="1.8"/><line x1="7" y1="16" x2="14" y2="16" stroke="#64748b" stroke-width="1.8"/>'),
    exe: RSQ('#475569', '<text x="12" y="16" text-anchor="middle" font-size="8" font-weight="700" fill="#fff">EXE</text>'),
    zip: GLYPH('#a16207', '#fff', 'ZIP', 8),
    home: S('<path d="M3 11.5L12 4l9 7.5" fill="none" stroke="#e0449e" stroke-width="2.4" stroke-linecap="round"/><path d="M5.5 10.5V20h13v-9.5" fill="none" stroke="#e0449e" stroke-width="2.4" stroke-linejoin="round"/>'),
    cloud: S('<ellipse cx="12" cy="15" rx="7.5" ry="4.6" fill="#38bdf8"/><ellipse cx="12" cy="13" rx="5.4" ry="3.8" fill="#7dd3fc"/>'),
    desktopIco: S('<rect x="2.5" y="4" width="19" height="13" rx="1.6" fill="#8b5cf6"/><rect x="9" y="17" width="6" height="2.4" fill="#8b5cf6"/><rect x="7" y="20.4" width="10" height="1.8" rx=".9" fill="#8b5cf6"/>'),
    documents: S('<rect x="5" y="2.5" width="14" height="19" rx="2" fill="#e2e8f0"/><line x1="8" y1="8" x2="16" y2="8" stroke="#94a3b8" stroke-width="1.8"/><line x1="8" y1="12" x2="16" y2="12" stroke="#94a3b8" stroke-width="1.8"/><line x1="8" y1="16" x2="13" y2="16" stroke="#94a3b8" stroke-width="1.8"/>'),
    downloads: S('<circle cx="12" cy="12" r="10" fill="#38bdf8"/><path d="M12 6v9m0 0l-3.6-3.6M12 15l3.6-3.6" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
    pictures: S('<rect x="2" y="4" width="20" height="16" rx="3" fill="#a78bfa"/><circle cx="8.5" cy="10" r="2" fill="#fef9c3"/><path d="M2 17l5.5-5 4 4 3.5-3.5L22 19v1a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-3z" fill="#c4b5fd"/>'),
    thispc: S('<rect x="2.5" y="4" width="19" height="12.5" rx="1.6" fill="#38bdf8"/><rect x="4.5" y="6" width="15" height="8.5" fill="#e0f2fe"/><rect x="9" y="16.5" width="6" height="2.2" fill="#38bdf8"/><rect x="7" y="20" width="10" height="1.8" rx=".9" fill="#38bdf8"/>'),
    network: S('<circle cx="12" cy="12" r="2.4" fill="#38bdf8"/><circle cx="5" cy="5.5" r="2" fill="#38bdf8" opacity=".7"/><circle cx="19" cy="5.5" r="2" fill="#38bdf8" opacity=".7"/><circle cx="5" cy="18.5" r="2" fill="#38bdf8" opacity=".7"/><circle cx="19" cy="18.5" r="2" fill="#38bdf8" opacity=".7"/><path d="M6.5 7l4 3.4M17.5 7l-4 3.4M6.5 17l4-3.4M17.5 17l-4-3.4" stroke="#38bdf8" stroke-width="1.4" opacity=".6"/>'),
    wifi: S('<path d="M2.5 9a15 15 0 0 1 19 0M5.5 12.5a10 10 0 0 1 13 0M8.6 16a5 5 0 0 1 6.8 0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="19" r="1.8" fill="currentColor"/>'),
    vol: S('<path d="M4 9v6h4l5 4.5v-15L8 9H4z" fill="currentColor"/><path d="M16 9a4.5 4.5 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
    bat: S('<rect x="2" y="8" width="18" height="9" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><rect x="4" y="10" width="12" height="5" rx="1" fill="currentColor"/><rect x="21" y="11" width="2.4" height="3.4" rx="1.2" fill="currentColor"/>'),
    plus: S('<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
    copy: S('<rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 15V5a1 1 0 0 1 1-1h9" fill="none" stroke="currentColor" stroke-width="2"/>'),
    paste: S('<rect x="5" y="5" width="14" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="9" y="2.5" width="6" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.8"/>'),
    cut: S('<circle cx="6.5" cy="6.5" r="2.6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="6.5" cy="17.5" r="2.6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.5 8.2L20 20M8.5 15.8L20 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
    share: S('<circle cx="6" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="5.5" r="2.6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="18.5" r="2.6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.4 10.8l6.8-4M8.4 13.2l6.8 4" stroke="currentColor" stroke-width="2"/>'),
    trash: S('<path d="M4.5 6.5h15M9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M6.5 6.5l1 13a1.5 1.5 0 0 0 1.5 1.4h6a1.5 1.5 0 0 0 1.5-1.4l1-13" fill="none" stroke="currentColor" stroke-width="2"/>'),
    tag: S('<path d="M3.5 12V4.5A1 1 0 0 1 4.5 3.5H12L20.5 12a1.4 1.4 0 0 1 0 2L14 20.5a1.4 1.4 0 0 1-2 0L3.5 12z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="8.5" cy="8.5" r="1.6" fill="currentColor"/>'),
    collect: S('<path d="M12 3l2.2 4.8 5.3.6-3.9 3.6 1 5.2-4.6-2.6-4.6 2.6 1-5.2L4.5 8.4l5.3-.6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'),
    grid: S('<rect x="3.5" y="3.5" width="7" height="7" rx="1.6" fill="currentColor"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6" fill="currentColor"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6" fill="currentColor"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6" fill="currentColor"/>'),
    sort: S('<path d="M7 4v13m0 0l-3.5-3.5M7 17l3.5-3.5M17 20V7m0 0l-3.5 3.5M17 7l3.5 3.5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
    filter: S('<path d="M4 5h16l-6.5 8v6l-3 2v-8L4 5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'),
    dots: S('<circle cx="5" cy="12" r="1.8" fill="currentColor"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/><circle cx="19" cy="12" r="1.8" fill="currentColor"/>'),
    split: S('<rect x="3" y="4" width="18" height="16" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" stroke-width="2"/>'),
    back: S('<path d="M14.5 5.5L8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'),
    fwd: S('<path d="M9.5 5.5L16 12l-6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'),
    up: S('<path d="M12 19V6m0 0l-6 6m6-6l6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'),
    refresh: S('<path d="M20 12a8 8 0 1 1-2.3-5.6M20 3v4.5h-4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'),
    folderUp: S('<path d="M2.5 6.5c0-1.4 1.1-2.5 2.5-2.5h4.6c.8 0 1.6.4 2 1.1l1.2 1.9h6.2c1.4 0 2.5 1.1 2.5 2.5v8c0 1.4-1.1 2.5-2.5 2.5H5c-1.4 0-2.5-1.1-2.5-2.5v-11z" fill="#ffc83d"/>'),
    power: S('<path d="M12 3v8" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M6.3 6.5a8 8 0 1 0 11.4 0" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'),
    lock: S('<rect x="5" y="10" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10" fill="none" stroke="currentColor" stroke-width="2"/>'),
    user: S('<circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M4 21a8 8 0 0 1 16 0" fill="currentColor"/>'),
    bluetooth: S('<path d="M7 8l10 8-5 4V4l5 4L7 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'),
    moon: S('<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'),
    sun: S('<circle cx="12" cy="12" r="4.4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5 5l1.8 1.8M17.2 17.2L19 19M19 5l-1.8 1.8M6.8 17.2L5 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
    plane: S('<path d="M10.5 13.5L3 11l1.5-1.5L11 11l3.5-5.5c.8-1.2 2.6-1.4 3.5-.5.9.9.7 2.7-.5 3.5L13 12l1.5 6.5L13 20l-2.5-6.5z" fill="currentColor"/>'),
    saver: S('<path d="M13 2L4.5 13.5H11L9.5 22 19 10h-6.5L13 2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'),
    camera: S('<rect x="2.5" y="7" width="19" height="13" rx="2.5" fill="#8b5cf6"/><circle cx="12" cy="13" r="4" fill="#fff"/><rect x="8" y="4.5" width="8" height="3" rx="1.5" fill="#6d28d9"/>'),
    game: S('<rect x="2" y="7" width="20" height="11" rx="5.5" fill="#22c55e"/><path d="M8 10.5v4M6 12.5h4" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><circle cx="15.5" cy="11.5" r="1.3" fill="#fff"/><circle cx="18" cy="14" r="1.3" fill="#fff"/>'),
    music: S('<circle cx="8" cy="17.5" r="3" fill="#f59e0b"/><circle cx="17" cy="15.5" r="3" fill="#f59e0b"/><path d="M11 17.5V6l9-2v11.5" fill="none" stroke="#f59e0b" stroke-width="2.4"/>'),
};
const ico = (n, cls) => `<span class="${cls || 'a-ico'}">${ICONS[n] || ICONS.exe}</span>`;

/* 图片缩略图：CSS 渐变（视频里的彩色 png 墙） */
const THUMBS = [
    'linear-gradient(135deg,#e0449e,#7c3aed)', 'linear-gradient(135deg,#fb923c,#ef4444)',
    'linear-gradient(135deg,#38bdf8,#818cf8)', 'linear-gradient(135deg,#f9a8d4,#fde68a)',
    'linear-gradient(135deg,#60a5fa,#a78bfa)', 'linear-gradient(135deg,#c084fc,#4c1d95)',
    'linear-gradient(135deg,#a78bfa,#e0449e)', 'linear-gradient(135deg,#fda4af,#fb7185)',
    'linear-gradient(135deg,#22d3ee,#0ea5e9)', 'linear-gradient(135deg,#1e1b4b,#312e81)',
    'linear-gradient(135deg,#2dd4bf,#0d9488)', 'linear-gradient(135deg,#fbbf24,#f97316)',
    'linear-gradient(135deg,#4ade80,#16a34a)', 'linear-gradient(135deg,#fb7185,#e11d48)',
    'linear-gradient(135deg,#818cf8,#e0449e)',
];

/* ================= 工具 ================= */
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const store = {
    get(k, d) { try { const v = localStorage.getItem('w12_' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('w12_' + k, JSON.stringify(v)); } catch (e) {} }
};
function toast(msg, icon) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span style="font-size:18px">${icon || '🔔'}</span><span>${esc(msg)}</span>`;
    $('#toasts').appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 350); }, 2600);
}

/* ================= 应用注册表 ================= */
const APPS = [
    { id: 'explorer', name: '文件资源管理器', icon: 'explorer', pinned: true },
    { id: 'edge', name: 'Edge', icon: 'edge', pinned: true },
    { id: 'store', name: 'Microsoft Store', icon: 'store', pinned: true },
    { id: 'settings', name: '设置', icon: 'settings', pinned: true },
    { id: 'terminal', name: '终端', icon: 'terminal', pinned: true },
    { id: 'notepad', name: '记事本', icon: 'notepad', pinned: true },
    { id: 'photos', name: '照片', icon: 'photos', pinned: false },
    { id: 'mail', name: '邮件', icon: 'mail', pinned: false },
    { id: 'calendar', name: '日历', icon: 'calendar', pinned: false },
    { id: 'word', name: 'Word', icon: 'word', pinned: false },
    { id: 'excel', name: 'Excel', icon: 'excel', pinned: false },
    { id: 'ppt', name: 'PowerPoint', icon: 'ppt', pinned: false },
    { id: 'todo', name: 'To Do', icon: 'todo', pinned: false },
    { id: 'clock', name: '时钟', icon: 'clock', pinned: false },
    { id: 'weather', name: '天气', icon: 'weather', pinned: false },
    { id: 'calc', name: '计算器', icon: 'calc', pinned: false },
    { id: 'camera', name: '相机', icon: 'camera', pinned: false },
];
const appById = id => APPS.find(a => a.id === id);

/* 文件类型 → 图标 */
function fileIcon(name, thumbIdx) {
    const ext = (name.split('.').pop() || '').toLowerCase();
    if (['png', 'jpg', 'jpeg', 'webp', 'bmp'].includes(ext) && thumbIdx !== undefined)
        return { thumb: THUMBS[thumbIdx % THUMBS.length] };
    const map = { docx: 'word', doc: 'word', xlsx: 'excel', xls: 'excel', pptx: 'ppt', ppt: 'ppt', aep: 'ae', pdf: 'pdf', mp4: 'mp4', mkv: 'mp4', mp3: 'music', txt: 'txt', exe: 'exe', zip: 'zip', lnk: 'explorer' };
    return { icon: map[ext] || 'txt' };
}

/* ================= 时钟 ================= */
const WEEK = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
function tickClock() {
    const n = new Date();
    const hh = String(n.getHours()).padStart(2, '0'), mm = String(n.getMinutes()).padStart(2, '0');
    $('#clockTime').textContent = `${hh}:${mm}`;
    $('#clockDate').textContent = `${n.getMonth() + 1}/${n.getDate()}`;
    $('#lockTime').textContent = `${hh}:${mm}`;
    $('#lockDate').textContent = `${n.getFullYear()} 年 ${n.getMonth() + 1} 月 ${n.getDate()} 日 ${WEEK[n.getDay()]}`;
    const wc = $('#wgClock'); if (wc) wc.textContent = `${hh}:${mm}`;
}
setInterval(tickClock, 10000);

/* ================= 任务栏 ================= */
function renderTaskbar() {
    const c = $('#tbApps');
    c.innerHTML = '';
    const mk = (html, title, act) => {
        const b = document.createElement('button');
        b.className = 'tb-btn'; b.title = title; b.innerHTML = html;
        b.addEventListener('click', act);
        c.appendChild(b); return b;
    };
    mk(`<img src="icon/logo-sm.png" alt="开始">`, '开始', () => togglePanel('startMenu'));
    mk(`<span class="tk-ico">${ICONS.widgets}</span>`, '小组件', () => togglePanel('widgetsPanel'));
    mk(`<span class="tk-ico">${ICONS.search}</span>`, '搜索', () => togglePanel('searchPanel'));
    const sep = document.createElement('span'); sep.className = 'tb-sep'; c.appendChild(sep);
    APPS.filter(a => a.pinned).forEach(a => {
        const b = mk(`<span class="tk-ico">${ICONS[a.icon]}</span><span class="run-dot"></span>`, a.name, () => openApp(a.id));
        b.dataset.app = a.id;
    });
}
function refreshTaskbarDots() {
    $$('#tbApps .tb-btn[data-app]').forEach(b => {
        b.classList.toggle('running', wins.some(w => w.app === b.dataset.app && !w.closed));
    });
}

/* ================= 浮出面板开关 ================= */
const PANELS = ['startMenu', 'searchPanel', 'quickSettings', 'calPanel'];
function closePanels(except) {
    PANELS.forEach(p => { if (p !== except) $('#' + p).classList.remove('open'); });
    if (except !== 'widgetsPanel') $('#widgetsPanel').classList.remove('open');
    $('#smPowerMenu').classList.remove('open');
}
function togglePanel(id) {
    const el = $('#' + id);
    const willOpen = !el.classList.contains('open');
    closePanels(id);
    el.classList.toggle('open', willOpen);
    if (id === 'searchPanel' && willOpen) setTimeout(() => $('#spInput').focus(), 120);
    if (id === 'startMenu' && willOpen) setTimeout(() => $('#smSearch').focus(), 120);
}

/* ================= 开始菜单 ================= */
const RECENT = [
    { name: 'Project Vision UX', sub: 'OneDrive › Documents', time: '1 小时前', icon: 'ppt' },
    { name: 'Plans 2023', sub: 'OneDrive › Documents', time: '2 小时前', icon: 'word' },
    { name: 'Shaping the Future', sub: 'OneDrive › Documents', time: '昨天', icon: 'ppt' },
];
function renderStartMenu() {
    $('#smPinned').innerHTML = APPS.map(a =>
        `<button class="sm-app" data-app="${a.id}">${ico(a.icon)}<span>${esc(a.name)}</span></button>`).join('');
    $('#smRecent').innerHTML = RECENT.map(r =>
        `<button class="sm-rec-item"><span class="f-ico">${ICONS[r.icon]}</span><span class="r-meta"><b>${esc(r.name)}</b><i>${esc(r.sub)}</i></span><span class="r-time">${esc(r.time)}</span></button>`).join('');
    // 所有应用 A-Z
    const sorted = [...APPS].sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    let html = '', lastH = '';
    sorted.forEach(a => {
        const h = /^[A-Za-z]/.test(a.name) ? a.name[0].toUpperCase() : '#';
        if (h !== lastH) { html += `<div class="abc-head">${h}</div>`; lastH = h; }
        html += `<button class="abc-item" data-app="${a.id}">${ico(a.icon)}<span>${esc(a.name)}</span></button>`;
    });
    $('#smAbcList').innerHTML = html;
}
function filterStart(q) {
    q = q.trim().toLowerCase();
    $$('#smPinned .sm-app').forEach(b => {
        const a = appById(b.dataset.app);
        b.style.display = (!q || a.name.toLowerCase().includes(q)) ? '' : 'none';
    });
}

/* ================= 搜索 ================= */
function renderSearch() {
    $('#spApps').innerHTML = APPS.slice(0, 10).map(a =>
        `<button class="sm-app" data-app="${a.id}">${ico(a.icon)}<span>${esc(a.name)}</span></button>`).join('');
    $('#spRecent').innerHTML = RECENT.map(r =>
        `<button class="sp-item" data-app="explorer">${ico(r.icon)}<span>${esc(r.name)}</span></button>`).join('');
}
function doSearch(q) {
    q = q.trim().toLowerCase();
    const hits = APPS.filter(a => !q || a.name.toLowerCase().includes(q));
    $('#spApps').innerHTML = hits.length
        ? hits.map(a => `<button class="sm-app" data-app="${a.id}">${ico(a.icon)}<span>${esc(a.name)}</span></button>`).join('')
        : '<div style="grid-column:1/-1;text-align:center;color:var(--text-dim);padding:18px;font-size:13px">没有找到匹配项</div>';
}

/* ================= 小组件 ================= */
function renderWidgets() {
    const n = new Date();
    $('#wgCalMonth').textContent = `${n.getFullYear()} 年 ${n.getMonth() + 1} 月`;
    $('#wgEvents').innerHTML = [
        ['午餐', '和朋友', '14:00', '#e0449e'], ['团队演示', '线上会议', '15:00', '#38bdf8'], ['作品集研讨', '线上会议', '17:00', '#a78bfa'],
    ].map(e => `<div class="wg-ev"><span class="ev-bar" style="background:${e[3]}"></span><span><b>${e[0]}</b><i>${e[1]}</i></span><span class="ev-t">${e[2]}</span></div>`).join('');
    $('#wgPhotos').innerHTML = THUMBS.slice(0, 3).map(t => `<div class="wg-ph" style="background:${t}"></div>`).join('');
    const todos = store.get('todos', [['发送邀请审阅', 0], ['买菜', 0], ['跑步 5 公里', 1]]);
    const paint = () => {
        $('#wgTodoList').innerHTML = todos.map((t, i) =>
            `<div class="wg-todo${t[1] ? ' done' : ''}" data-i="${i}"><span class="ck">${t[1] ? '✓' : ''}</span><span>${esc(t[0])}</span></div>`).join('');
    };
    paint();
    $('#wgTodoList').onclick = e => {
        const it = e.target.closest('.wg-todo'); if (!it) return;
        const i = +it.dataset.i; todos[i][1] = todos[i][1] ? 0 : 1;
        store.set('todos', todos); paint();
    };
    const days = ['今天', '周五', '周六', '周日', '周一'];
    $('#wgDays').innerHTML = days.map((d, i) =>
        `<div class="wg-day"><span>${d}</span><span>⛅</span><b>${24 - i}°</b></div>`).join('');
}

/* ================= 快捷设置 ================= */
const QS = [
    { id: 'wifi', name: 'WLAN', icon: '📶', on: true },
    { id: 'bt', name: '蓝牙', icon: '🔵', on: false },
    { id: 'plane', name: '飞行模式', icon: '✈️', on: false },
    { id: 'saver', name: '节能模式', icon: '🔋', on: false },
    { id: 'night', name: '夜间模式', icon: '🌙', on: false },
    { id: 'theme', name: '深色模式', icon: '🌗', on: true },
];
function renderQS() {
    $('#qsToggles').innerHTML = QS.map(q =>
        `<button class="qs-t${q.on ? ' on' : ''}" data-q="${q.id}"><span class="qs-ico">${q.icon}</span><span>${q.name}</span></button>`).join('');
}
function applyQS() {
    const theme = QS.find(q => q.id === 'theme').on ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    store.set('theme', theme);
    document.body.style.filter = QS.find(q => q.id === 'night').on ? 'sepia(0.35)' : '';
}

/* ================= 日历 / 通知 ================= */
let calCursor = new Date();
function renderCal() {
    const y = calCursor.getFullYear(), m = calCursor.getMonth();
    $('#calTitle').textContent = `${y} 年 ${m + 1} 月`;
    const first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
    const prevDays = new Date(y, m, 0).getDate(), today = new Date();
    let html = ['日', '一', '二', '三', '四', '五', '六'].map(d => `<span class="dow">${d}</span>`).join('');
    for (let i = first - 1; i >= 0; i--) html += `<span class="day dim">${prevDays - i}</span>`;
    for (let d = 1; d <= days; d++) {
        const isT = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
        html += `<span class="day${isT ? ' today' : ''}">${d}</span>`;
    }
    $('#calGrid').innerHTML = html;
    $('#ntfList').innerHTML = [
        ['Microsoft Store', 'Edge 已更新到最新版本', '🔵'], ['天气', '明天多云，24°C，适合出行', '⛅'], ['日历', '14:00 有一场会议：午餐', '📅'],
    ].map(n => `<div class="ntf"><b>${n[2]} ${n[0]}</b><i>${n[1]}</i></div>`).join('');
}

/* ================= 窗口管理器 ================= */
const wins = [];
let zTop = 510, winSeq = 0;

function openApp(appId, arg) {
    closePanels();
    const app = appById(appId);
    if (!app) return;
    // 单例应用：已开则聚焦
    const single = ['explorer', 'settings', 'store'].includes(appId);
    if (single) {
        const ex = wins.find(w => w.app === appId && !w.closed && !w.min);
        if (ex) { focusWin(ex); return; }
        const exMin = wins.find(w => w.app === appId && !w.closed);
        if (exMin) { exMin.min = false; exMin.el.classList.remove('min'); focusWin(exMin); return; }
    }
    const builders = { explorer: buildExplorer, settings: buildSettings, edge: buildEdge, notepad: buildNotepad, terminal: buildTerminal, store: buildStore };
    const simple = ['photos', 'mail', 'calendar', 'word', 'excel', 'ppt', 'todo', 'clock', 'weather', 'calc', 'camera'];
    let bodyHtml, w = 880, h = 560, title = app.name;
    if (builders[appId]) { const r = builders[appId](arg); bodyHtml = r.html; w = r.w || w; h = r.h || h; title = r.title || title; }
    else if (simple.includes(appId)) { const r = buildSimpleApp(app); bodyHtml = r.html; w = r.w; h = r.h; }
    else return;
    createWin(app, title, bodyHtml, w, h);
    refreshTaskbarDots();
}

function createWin(app, title, bodyHtml, w, h) {
    const layer = $('#windowLayer');
    const el = document.createElement('div');
    el.className = 'win';
    const id = ++winSeq;
    const vw = innerWidth, vh = innerHeight;
    w = Math.min(w, vw - 40); h = Math.min(h, vh - 110);
    const x = Math.max(20, (vw - w) / 2 + (wins.length % 5) * 28 - 56);
    const y = Math.max(20, (vh - h) / 2 - 30 + (wins.length % 5) * 22 - 44);
    el.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${++zTop}`;
    el.innerHTML = `
        <div class="titlebar" data-drag>
            <span class="t-ico">${ICONS[app.icon]}</span>
            <span class="t-name">${esc(title)}</span>
            <div class="win-btns">
                <button data-wb="min" title="最小化">—</button>
                <button data-wb="max" title="最大化">▢</button>
                <button data-wb="close" class="close" title="关闭">✕</button>
            </div>
        </div>
        <div class="win-body">${bodyHtml}</div>`;
    layer.appendChild(el);
    const win = { id, app: app.id, el, x, y, w, h, min: false, max: false, closed: false, prev: null };
    wins.push(win);
    wireWin(win);
    focusWin(win);
    return win;
}

function focusWin(win) {
    wins.forEach(w => w.el.classList.remove('focused'));
    win.el.classList.add('focused');
    win.el.style.zIndex = ++zTop;
}

function closeWin(win) {
    win.closed = true;
    win.el.classList.add('closing');
    setTimeout(() => { win.el.remove(); refreshTaskbarDots(); }, 160);
    const i = wins.indexOf(win); if (i >= 0) wins.splice(i, 1);
}

function toggleMax(win) {
    const el = win.el;
    if (!win.max) {
        win.prev = { x: win.x, y: win.y, w: win.w, h: win.h };
        Object.assign(win, { x: 8, y: 8, w: innerWidth - 16, h: innerHeight - 96, max: true });
    } else {
        Object.assign(win, win.prev, { max: false });
    }
    el.classList.toggle('max', win.max);
    el.style.left = win.x + 'px'; el.style.top = win.y + 'px';
    el.style.width = win.w + 'px'; el.style.height = win.h + 'px';
}

function snapWin(win, side) {
    if (side === 'max') { if (!win.max) toggleMax(win); return; }
    if (win.max) toggleMax(win);
    win.prev = { x: win.x, y: win.y, w: win.w, h: win.h };
    win.w = Math.floor((innerWidth - 24) / 2); win.h = innerHeight - 96; win.y = 8;
    win.x = side === 'left' ? 8 : 8 + win.w + 8;
    const el = win.el;
    el.classList.remove('max');
    el.style.left = win.x + 'px'; el.style.top = win.y + 'px';
    el.style.width = win.w + 'px'; el.style.height = win.h + 'px';
}

function wireWin(win) {
    const el = win.el, bar = $('.titlebar', el);
    el.addEventListener('pointerdown', () => focusWin(win), true);
    $$('.win-btns button', el).forEach(b => b.addEventListener('click', e => {
        e.stopPropagation();
        const k = b.dataset.wb;
        if (k === 'close') closeWin(win);
        else if (k === 'max') toggleMax(win);
        else if (k === 'min') { win.min = true; el.classList.add('min'); refreshTaskbarDots(); }
    }));
    bar.addEventListener('dblclick', e => { if (!e.target.closest('.win-btns')) toggleMax(win); });
    // 拖拽 + 边缘贴靠
    let sx, sy, ox, oy, dragging = false, hint = null;
    bar.addEventListener('pointerdown', e => {
        if (e.target.closest('.win-btns') || e.button !== 0) return;
        dragging = true; sx = e.clientX; sy = e.clientY; ox = win.x; oy = win.y;
        bar.setPointerCapture(e.pointerId);
    });
    bar.addEventListener('pointermove', e => {
        if (!dragging) return;
        if (win.max) { // 从最大化拖出还原
            toggleMax(win);
            ox = e.clientX - win.w / 2; oy = e.clientY - 20;
            sx = e.clientX; sy = e.clientY;
        }
        win.x = Math.min(Math.max(ox + e.clientX - sx, -win.w + 80), innerWidth - 80);
        win.y = Math.min(Math.max(oy + e.clientY - sy, 0), innerHeight - 120);
        el.style.left = win.x + 'px'; el.style.top = win.y + 'px';
        const nh = e.clientX < 8 ? 'l' : e.clientX > innerWidth - 8 ? 'r' : null;
        if (nh !== hint) {
            el.classList.remove('snap-hint-l', 'snap-hint-r'); hint = nh;
            if (nh) el.classList.add(nh === 'l' ? 'snap-hint-l' : 'snap-hint-r');
        }
    });
    bar.addEventListener('pointerup', e => {
        if (!dragging) return;
        dragging = false;
        el.classList.remove('snap-hint-l', 'snap-hint-r');
        if (e.clientX < 8) snapWin(win, 'left');
        else if (e.clientX > innerWidth - 8) snapWin(win, 'right');
        else if (e.clientY < 4) snapWin(win, 'max');
        hint = null;
    });
}

/* 点击任务栏运行中应用 → 聚焦/最小化切换 */
document.addEventListener('click', e => {
    const b = e.target.closest('#tbApps .tb-btn[data-app]');
    if (!b || !b.classList.contains('running')) return;
});

/* ================= 虚拟文件系统 ================= */
const TAGS = [
    { id: 'work', name: '工作', color: '#f9a8d4' }, { id: 'important', name: '重要', color: '#e0449e' },
    { id: 'project', name: '项目', color: '#fbbf24' }, { id: 'design', name: '设计', color: '#a78bfa' },
    { id: 'family', name: '家庭', color: '#2dd4bf' }, { id: 'trips', name: '旅行', color: '#f87171' },
    { id: 'finance', name: '财务', color: '#22d3ee' },
];
let thumbSeq = 0;
const F = (name, tags, sub) => Object.assign({ name, tags: tags || [], sub: sub || '', thumb: /png|jpg|jpeg|webp/i.test(name) ? (thumbSeq++) : undefined }, {});
const FS = {
    'Home': { label: '主页', icon: 'home', special: 'home' },
    'OneDrive': { label: 'OneDrive', icon: 'cloud', files: [F('Project Vision UX.pptx', ['work', 'project'], '1 小时前'), F('Plans 2023.docx', ['work'], '2 小时前')] },
    'Desktop': { label: '桌面', icon: 'desktopIco', files: [F('Edge.lnk'), F('文件资源管理器.lnk'), F('年度总结.docx', ['work', 'important']), F('壁纸.png', ['design'])] },
    'Documents': { label: '文档', icon: 'documents', files: [F('Project Vision UX.pptx', ['work', 'project']), F('The History of Eskisehir.docx', ['project']), F('Plans 2023.docx', ['work']), F('Motion Design.aep', ['design', 'project']), F('The Future.pptx', ['important'])] },
    'Downloads': { label: '下载', icon: 'downloads', files: [F('wallpaper-concept-purple.jpg', ['design']), F('Windows12-Setup.exe'), F('使用说明.txt')] },
    'Pictures': { label: '图片', icon: 'pictures', files: [F('Infinity.png', ['design', 'important']), F('Orange.png', ['design']), F('The Rise.png', ['design']), F('Pastel.png', ['design']), F('Cards.png', ['work']), F('Neon.png', ['design']), F('Lake.png', ['trips']), F('The Rings.png', ['design']), F('Rings 2.png', ['design']), F('Night.png', []), F('Gradient.png', ['design']), F('The Road.png', ['trips']), F('Green.png', []), F('Pentagons.png', ['design']), F('Gradient V2.png', ['design'])] },
    'Projects': { label: '项目', icon: 'folderUp', files: [F('Introduction.pptx', ['work', 'project']), F('Design Guidelines.docx', ['design', 'project']), F('Vision UX.pptx', ['design', 'project']), F('Avdan.aep', ['design', 'important']), F('Wallpapers', ['design']), F('Essentials', [])] },
    'This PC': { label: '此电脑', icon: 'thispc', files: [F('Windows (C:)'), F('数据 (D:)')] },
    'Network': { label: '网络', icon: 'network', files: [] },
};
const tagById = id => TAGS.find(t => t.id === id);

/* ================= 文件资源管理器 ================= */
function buildExplorer() {
    const state = {
        tabs: [{ path: 'Home', mode: 'tags', tagFilter: null, search: '', collect: [], hist: ['Home'], hi: 0 }],
        ti: 0,
        split: false,
        panes: [{ path: 'Documents' }, { path: 'Pictures' }],
        activePane: 0,
        sel: new Set(),
        collections: store.get('collections', []),
    };
    const html = `
    <div class="exp" data-exp>
        <div class="exp-tabs"><div data-tabs style="display:flex;gap:6px;align-items:center"></div><button class="exp-tab-add" data-addtab title="新标签页">＋</button></div>
        <div class="exp-cmd">
            <button class="cb" data-nav="back" title="后退">${ICONS.back}</button>
            <button class="cb" data-nav="fwd" title="前进">${ICONS.fwd}</button>
            <span class="sep"></span>
            <button class="cb" data-cmd="new">${ICONS.plus}<span>新建 ▾</span></button>
            <span class="sep"></span>
            <button class="cb" data-cmd="copy" title="复制">${ICONS.copy}</button>
            <button class="cb" data-cmd="paste" title="粘贴">${ICONS.paste}</button>
            <button class="cb" data-cmd="cut" title="剪切">${ICONS.cut}</button>
            <button class="cb" data-cmd="share" title="共享">${ICONS.share}</button>
            <button class="cb" data-cmd="del" title="删除">${ICONS.trash}</button>
            <span class="sep"></span>
            <button class="cb" data-cmd="sort" title="排序">${ICONS.sort}</button>
            <button class="cb" data-cmd="filter" title="筛选">${ICONS.filter}</button>
            <button class="cb" data-cmd="split" title="窗口内分屏（视频功能）">${ICONS.split}</button>
            <span class="grow"></span>
            <button class="cb" data-cmd="more" title="更多">${ICONS.dots}</button>
        </div>
        <div class="exp-addr">
            <div class="exp-nav"></div>
            <div class="exp-path" data-path></div>
            <div class="exp-search"><span class="s-ico"></span><input data-search placeholder="搜索"></div>
        </div>
        <div class="exp-main">
            <div class="exp-side" data-side></div>
            <div class="exp-content">
                <div class="exp-single" data-single></div>
                <div class="exp-split"><div class="exp-pane" data-pane="0"></div><div class="exp-pane" data-pane="1"></div></div>
            </div>
        </div>
    </div>`;
    setTimeout(() => initExplorer($('[data-exp]'), state), 0);
    return { html, w: 980, h: 620, title: '文件资源管理器' };
}

function initExplorer(root, st) {
    const tab = () => st.tabs[st.ti];
    const curPath = () => tab().path;

    /* ---- 标签页 ---- */
    function paintTabs() {
        const c = $('[data-tabs]', root);
        c.innerHTML = st.tabs.map((t, i) =>
            `<button class="exp-tab${i === st.ti ? ' active' : ''}" data-tab="${i}">${esc(FS[t.path] ? FS[t.path].label : t.path)}<span class="x" data-xtab="${i}">✕</span></button>`).join('');
    }

    /* ---- 侧边栏 ---- */
    function paintSide() {
        const keys = ['Home', 'OneDrive', 'Desktop', 'Documents', 'Downloads', 'Pictures', 'Projects', 'This PC', 'Network'];
        $('[data-side]', root).innerHTML =
            keys.map(k => `<button class="si${curPath() === k ? ' active' : ''}" data-nav="${k}">${ico(FS[k].icon)}<span>${FS[k].label}</span></button>`).join('') +
            (st.collections.length ? `<div class="sg">收藏集</div>` + st.collections.map((c, i) =>
                `<button class="si${curPath() === 'collection:' + i ? ' active' : ''}" data-nav="collection:${i}">${ico('collect')}<span>${esc(c.name)}</span><span class="cnt">${c.files.length}</span></button>`).join('') : '');
    }

    /* ---- 路径栏 ---- */
    function paintPath() {
        const p = curPath();
        const label = p.startsWith('collection:') ? st.collections[+p.split(':')[1]].name : (FS[p] ? FS[p].label : p);
        $('[data-path]', root).innerHTML = `<span class="crumb">${esc(label)}</span>`;
        const s = $('[data-search]', root); if (s) s.value = tab().search;
    }

    /* ---- 文件图标 ---- */
    function fIcon(f) {
        const fi = fileIcon(f.name, f.thumb);
        if (fi.thumb) return `<span class="f-thumb" style="background:${fi.thumb}"></span>`;
        return ico(fi.icon, 'f-ico');
    }
    function tagDots(f) {
        return f.tags && f.tags.length ? `<span class="f-tags">${f.tags.map(t => `<i style="background:${tagById(t).color}"></i>`).join('')}</span>` : '';
    }

    function filesOf(path) {
        if (path.startsWith('collection:')) return st.collections[+path.split(':')[1]].files;
        return (FS[path] && FS[path].files) || [];
    }
    function filteredFiles(path) {
        let fs = filesOf(path).slice();
        const t = tab();
        if (t.tagFilter) fs = fs.filter(f => f.tags && f.tags.includes(t.tagFilter));
        if (t.search) fs = fs.filter(f => f.name.toLowerCase().includes(t.search.toLowerCase()));
        return fs;
    }

    /* ---- 内容区 ---- */
    function paintContent() {
        const t = tab(), p = curPath();
        const modeBtns = `
            <div class="exp-modes">
                <button class="mode-btn${t.mode === 'tags' ? ' on' : ''}" data-mode="tags">${ICONS.tag}<span>Tags</span></button>
                <button class="mode-btn${t.mode === 'collect' ? ' on' : ''}" data-mode="collect">${ICONS.collect}<span>Drag and Collect</span></button>
                <button class="mode-btn${t.mode === 'search' ? ' on' : ''}" data-mode="search">${ICONS.search}<span>Search</span></button>
            </div>`;
        const tagPills = (t.mode === 'tags') ? `
            <div class="exp-tags">${TAGS.map(g =>
                `<button class="tag-pill${t.tagFilter === g.id ? ' on' : ''}" data-tag="${g.id}"><span class="tag-dot" style="background:${g.color}"></span>${g.name}</button>`).join('')}
                ${t.tagFilter ? `<button class="tag-pill" data-tag="">✕ 清除</button>` : ''}
            </div>` : '';
        const selBar = st.sel.size ? `
            <div class="exp-selbar">
                <button data-sel="folder">${ICONS.plus} 新建文件夹</button>
                <button data-sel="collect">${ICONS.collect} 创建收藏集</button>
                <button data-sel="share">${ICONS.share} 共享</button>
                <button data-sel="copy">${ICONS.copy} 复制</button>
                <button data-sel="del">${ICONS.trash} 删除</button>
                <button class="x" data-sel="clear">✕</button>
            </div>` : '';
        const collectPanel = (t.mode === 'collect') ? `
            <div class="exp-collect"><h5>拖放文件到此处进行收集（视频：Drag and Collect）</h5>
                <div class="collect-tray" data-tray>
                    ${t.collect.length ? t.collect.map((f, i) => `<span class="collect-chip">${fIcon(f)}<span>${esc(f.name)}</span><span class="cx" data-unc="${i}">✕</span></span>`).join('') : '<div class="collect-empty">将文件拖到这里…</div>'}
                </div>
            </div>` : '';
        if (st.split) {
            root.classList.add('split');
            $$('[data-pane]', root).forEach(pane => {
                const pi = +pane.dataset.pane, pp = st.panes[pi].path;
                pane.innerHTML = `
                    <div class="exp-addr" style="padding:8px 12px"><div class="exp-path"><span class="crumb">${esc(FS[pp] ? FS[pp].label : pp)}</span></div></div>
                    <div class="exp-grid">${filteredFiles(pp).map(f => gridItem(f, pp)).join('') || emptyHint()}</div>`;
                pane.style.outline = st.activePane === pi ? '1px solid var(--accent)' : 'none';
                pane.style.outlineOffset = '-1px';
            });
        } else {
            root.classList.remove('split');
            let inner = modeBtns + tagPills;
            if (p === 'Home') {
                inner += `<div class="exp-recent"><h4>▾ 最近使用的文件</h4><div class="exp-recent-cards">
                    ${RECENT.map(r => `<button class="recent-card">${fIcon(F(r.name + (r.icon === 'ppt' ? '.pptx' : '.docx')))}<span><b>${esc(r.name)}</b><i>${esc(r.sub)} · ${esc(r.time)}</i></span></button>`).join('')}
                </div></div>`;
            } else {
                inner += `<div class="exp-grid" style="margin-top:8px">${filteredFiles(p).map(f => gridItem(f, p)).join('') || emptyHint()}</div>`;
            }
            inner += selBar + collectPanel;
            inner += `<div class="exp-status"><span>${filteredFiles(p).length} 个项目</span><span class="grow"></span><span>${t.collect.length ? '已收集 ' + t.collect.length + ' 项' : ''}</span></div>`;
            $('[data-single]', root).innerHTML = inner;
        }
    }
    const gridItem = (f, path) => `
        <div class="fitem${st.sel.has(f.name + '|' + path) ? ' sel' : ''}" data-file="${esc(f.name)}" data-path="${esc(path)}" draggable="true">
            ${fIcon(f)}<span>${esc(f.name)}</span>${tagDots(f)}
        </div>`;
    const emptyHint = () => `<div style="grid-column:1/-1;text-align:center;color:var(--text-faint);padding:40px;font-size:13px">此文件夹为空</div>`;

    function nav(path) {
        const t = tab();
        t.path = path; t.tagFilter = null; t.search = ''; st.sel.clear();
        t.hist = t.hist.slice(0, t.hi + 1); t.hist.push(path); t.hi++;
        refresh();
    }
    function refresh() { paintTabs(); paintSide(); paintPath(); paintContent(); }

    /* ---- 事件 ---- */
    root.addEventListener('click', e => {
        const q = sel => e.target.closest(sel);
        let m;
        if ((m = q('[data-xtab]'))) { e.stopPropagation(); const i = +m.dataset.xtab; st.tabs.splice(i, 1); if (!st.tabs.length) st.tabs.push({ path: 'Home', mode: 'tags', tagFilter: null, search: '', collect: [], hist: ['Home'], hi: 0 }); st.ti = Math.min(st.ti, st.tabs.length - 1); refresh(); return; }
        if ((m = q('[data-tab]'))) { st.ti = +m.dataset.tab; st.sel.clear(); refresh(); return; }
        if (q('[data-addtab]')) { st.tabs.push({ path: 'Home', mode: 'tags', tagFilter: null, search: '', collect: [], hist: ['Home'], hi: 0 }); st.ti = st.tabs.length - 1; refresh(); return; }
        if ((m = q('[data-nav]'))) {
            const t = tab();
            if (m.dataset.nav === 'back') { if (t.hi > 0) { t.hi--; t.path = t.hist[t.hi]; } }
            else if (m.dataset.nav === 'fwd') { if (t.hi < t.hist.length - 1) { t.hi++; t.path = t.hist[t.hi]; } }
            else nav(m.dataset.nav);
            st.sel.clear(); refresh(); return;
        }
        if ((m = q('.exp-side [data-nav]'))) { nav(m.dataset.nav); return; }
        if ((m = q('[data-mode]'))) { tab().mode = m.dataset.mode; refresh(); return; }
        if ((m = q('[data-tag]'))) { tab().tagFilter = m.dataset.tag || null; refresh(); return; }
        if ((m = q('[data-cmd]'))) { cmd(m.dataset.cmd); return; }
        if ((m = q('[data-sel]'))) { selCmd(m.dataset.sel); return; }
        if ((m = q('[data-unc]'))) { tab().collect.splice(+m.dataset.unc, 1); refresh(); return; }
        if ((m = q('.fitem'))) {
            const key = m.dataset.file + '|' + m.dataset.path;
            if (e.ctrlKey || e.metaKey) { st.sel.has(key) ? st.sel.delete(key) : st.sel.add(key); }
            else { st.sel.clear(); st.sel.add(key); }
            refresh(); return;
        }
        if (e.target.closest('.exp-grid') && !q('.fitem')) { st.sel.clear(); refresh(); }
    });
    root.addEventListener('dblclick', e => {
        const it = e.target.closest('.fitem'); if (!it) return;
        const f = filesOf(it.dataset.path).find(x => x.name === it.dataset.file);
        openFile(f);
    });
    const sInput = $('[data-search]', root);
    sInput.addEventListener('input', () => { tab().search = sInput.value; tab().mode = 'search'; paintContent(); });

    function cmd(k) {
        const t = tab();
        if (k === 'new') { const fs = filesOf(t.path); fs.push(F('新建文件夹', [])); refresh(); toast('已新建文件夹'); }
        else if (k === 'split') { st.split = !st.split; refresh(); toast(st.split ? '已开启窗口内分屏' : '已关闭分屏'); }
        else if (k === 'del') delSel();
        else if (k === 'copy' || k === 'cut') toast(st.sel.size ? `已${k === 'copy' ? '复制' : '剪切'} ${st.sel.size} 项（演示）` : '请先选择文件');
        else if (k === 'paste') toast('已粘贴（演示）');
        else if (k === 'share') toast(st.sel.size ? `正在共享 ${st.sel.size} 项…（演示）` : '请先选择文件');
        else if (k === 'sort' || k === 'filter' || k === 'more') toast('演示版本暂未实现此功能');
    }
    function selCmd(k) {
        if (k === 'clear') { st.sel.clear(); refresh(); }
        else if (k === 'del') delSel();
        else if (k === 'folder') cmd('new');
        else if (k === 'copy' || k === 'share') cmd(k);
        else if (k === 'collect') {
            const t = tab();
            st.sel.forEach(key => {
                const [nm, path] = key.split('|');
                const f = filesOf(path).find(x => x.name === nm);
                if (f && !t.collect.includes(f)) t.collect.push(f);
            });
            t.mode = 'collect'; st.sel.clear(); refresh();
            toast(`已收集 ${t.collect.length} 项，点击「创建收藏集」完成`);
        }
    }
    function delSel() {
        if (!st.sel.size) { toast('请先选择文件'); return; }
        st.sel.forEach(key => {
            const [nm, path] = key.split('|');
            const arr = filesOf(path), i = arr.findIndex(x => x.name === nm);
            if (i >= 0) arr.splice(i, 1);
        });
        st.sel.clear(); refresh(); toast('已删除所选项目');
    }

    /* ---- 拖放收集 ---- */
    let dragFile = null;
    root.addEventListener('dragstart', e => {
        const it = e.target.closest('.fitem'); if (!it) return;
        const f = filesOf(it.dataset.path).find(x => x.name === it.dataset.file);
        dragFile = { f, path: it.dataset.path };
        e.dataTransfer.effectAllowed = 'copy';
    });
    root.addEventListener('dragover', e => {
        const tray = e.target.closest('[data-tray]');
        if (tray && dragFile) { e.preventDefault(); $('.collect-empty', tray)?.classList.add('over'); }
    });
    root.addEventListener('dragleave', e => { $('.collect-empty.over', root)?.classList.remove('over'); });
    root.addEventListener('drop', e => {
        const tray = e.target.closest('[data-tray]');
        if (tray && dragFile) {
            e.preventDefault();
            const t = tab();
            if (!t.collect.includes(dragFile.f)) t.collect.push(dragFile.f);
            dragFile = null; refresh();
            toast('已加入收集篮');
        }
    });

    /* 收集篮 → 创建收藏集（双击托盘标题区或按钮） */
    root.addEventListener('dblclick', e => {
        if (e.target.closest('.exp-collect h5') && tab().collect.length) makeCollection();
    });

    function makeCollection() {
        const t = tab();
        const name = prompt('为收藏集命名：', '我的收藏集');
        if (!name) return;
        st.collections.push({ name, files: t.collect.slice() });
        t.collect = []; t.mode = 'tags';
        store.set('collections', st.collections);
        refresh(); toast(`已创建收藏集「${name}」`);
    }
    // 在收集面板加一个创建按钮（通过事件委托补一个）
    const obs = new MutationObserver(() => {
        const h = $('.exp-collect h5', root);
        if (h && !h.dataset.btn) {
            h.dataset.btn = '1';
            const b = document.createElement('button');
            b.className = 'mode-btn'; b.style.cssText = 'margin-left:10px;padding:5px 14px;font-size:12px';
            b.innerHTML = `${ICONS.collect}<span>创建收藏集</span>`;
            b.onclick = ev => { ev.stopPropagation(); makeCollection(); };
            h.appendChild(b);
        }
    });
    obs.observe(root, { childList: true, subtree: true });

    function openFile(f) {
        if (!f) return;
        if (/lnk$/i.test(f.name)) { const id = /edge/i.test(f.name) ? 'edge' : 'explorer'; openApp(id); return; }
        if (/exe$/i.test(f.name)) { toast('无法在此演示环境中运行该程序'); return; }
        if (/txt$/i.test(f.name)) { openApp('notepad'); return; }
        if (/mp4|mkv$/i.test(f.name)) { toast('媒体播放器（演示）'); return; }
        if (/pptx|docx|xlsx|aep|pdf/i.test(f.name)) { toast(`正在打开 ${f.name}…（演示）`); return; }
        if (f.thumb !== undefined) { openApp('photos', f); return; }
        nav(f.name);
    }

    refresh();
}

/* 占位应用 */
function buildSimpleApp(app) {
    return {
        html: `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:14px;color:var(--text-dim)">
            <span style="width:72px;height:72px">${ICONS[app.icon]}</span>
            <div style="font-size:16px;color:var(--text)">${esc(app.name)}</div>
            <div style="font-size:13px">此应用为网页演示占位，完整功能开发中…</div>
            <button class="mode-btn" onclick="this.textContent='👍 收到！'">点我试试</button>
        </div>`,
        w: 560, h: 420, title: app.name,
    };
}

/* ================= 设置 ================= */
const WALLPAPERS = [
    { id: 'concept', name: '紫韵流体', src: 'img/wallpaper-concept-purple.jpg' },
    { id: 'bloom', name: '绽放', src: 'img/wallpaper-bloom.jpg' },
    { id: 'classic', name: '经典', src: 'img/img0.jpg' },
];
function buildSettings() {
    const html = `
    <div class="set" data-set>
        <div class="set-side">
            <div class="set-user"><span class="avatar">🐭</span><span><b>xavisshop</b><i>本地账户</i></span></div>
            <div data-nav>
                <button class="set-nav active" data-p="system">${ico('thispc')}<span>系统</span></button>
                <button class="set-nav" data-p="personal">${ico('photos')}<span>个性化</span></button>
                <button class="set-nav" data-p="apps">${ico('grid')}<span>应用</span></button>
                <button class="set-nav" data-p="accounts">${ico('user')}<span>账户</span></button>
                <button class="set-nav" data-p="about">${ico('settings')}<span>关于</span></button>
            </div>
        </div>
        <div class="set-main" data-page></div>
    </div>`;
    setTimeout(() => initSettings($('[data-set]')), 0);
    return { html, w: 940, h: 600, title: '设置' };
}
function initSettings(root) {
    const page = $('[data-page]', root);
    function paint(p) {
        $$('.set-nav', root).forEach(b => b.classList.toggle('active', b.dataset.p === p));
        if (p === 'personal') {
            const cur = store.get('wallpaper', 'concept');
            page.innerHTML = `<h2>个性化</h2>
                <div class="set-card"><div class="set-row"><span class="grow"><b>场景</b><i>壁纸会随你的使用而变化（视频：Scenes）</i></span></div>
                    <div class="wp-pick">${WALLPAPERS.map(w =>
                        `<button class="wp-opt${cur === w.id ? ' on' : ''}" data-wp="${w.id}"><img src="${w.src}" alt="${w.name}"><span>${w.name}</span></button>`).join('')}</div>
                </div>
                <div class="set-card"><div class="set-row"><span class="grow"><b>主题</b><i>深色 / 浅色（视频展示了两种变体）</i></span>
                    <button class="toggle${document.documentElement.dataset.theme === 'dark' ? ' on' : ''}" data-t="theme"></button></div></div>`;
        } else if (p === 'system') {
            page.innerHTML = `<h2>系统</h2>
                <div class="set-card">
                    <div class="set-row"><span class="grow"><b>显示</b><i>亮度、缩放、分辨率</i></span><span style="color:var(--text-faint)">›</span></div>
                    <div class="set-row"><span class="grow"><b>声音</b><i>音量、输出设备</i></span><span style="color:var(--text-faint)">›</span></div>
                    <div class="set-row"><span class="grow"><b>通知</b><i>来自应用和系统的通知</i></span><button class="toggle on" data-t="notif"></button></div>
                    <div class="set-row"><span class="grow"><b>电源</b><i>节能模式</i></span><button class="toggle" data-t="saver"></button></div>
                </div>`;
        } else if (p === 'apps') {
            page.innerHTML = `<h2>应用</h2><div class="set-card">${APPS.map(a =>
                `<div class="set-row">${ico(a.icon)}<span class="grow"><b>${esc(a.name)}</b><i>已安装</i></span><button class="mode-btn" style="padding:5px 14px;font-size:12px" data-open="${a.id}">打开</button></div>`).join('')}</div>`;
        } else if (p === 'accounts') {
            page.innerHTML = `<h2>账户</h2><div class="set-card">
                <div class="set-row"><span class="avatar">🐭</span><span class="grow"><b>xavisshop</b><i>本地账户 · 管理员</i></span></div>
                <div class="set-row"><span class="grow"><b>同步设置</b><i>跨设备同步主题与壁纸</i></span><button class="toggle" data-t="sync"></button></div></div>`;
        } else {
            page.innerHTML = `<h2>关于</h2><div class="set-card" style="text-align:center;padding:30px">
                <img src="icon/logo-sm.png" style="width:72px;height:72px;margin-bottom:12px">
                <div style="font-size:18px;font-weight:600;margin-bottom:4px">Windows 12 网页版</div>
                <div style="font-size:13px;color:var(--text-dim)">概念还原 · 灵感来自 Kamer Kaan Avdan《Introducing Windows 12 (Concept)》</div>
                <div style="font-size:12px;color:var(--text-faint);margin-top:8px">版本 24H2（网页演示）</div></div>
            <div class="set-card">
                <div class="set-row"><span class="grow"><b>Built with OrcaRouter</b><i>OrcaRouter 是一个大模型 API 路由网关：一次接入，即可通过统一接口调用多种主流大模型，按实际调用量计费。</i></span></div>
                <div class="set-row"><span class="grow"><i>🔀 模型路由 · 💰 按量计费 · 🧩 多模型接入</i></span>
                    <button class="mode-btn" style="padding:6px 16px;font-size:12px" data-orca>了解更多</button></div>
            </div>`;
        }
    }
    root.addEventListener('click', e => {
        const n = e.target.closest('.set-nav'); if (n) { paint(n.dataset.p); return; }
        const w = e.target.closest('[data-wp]');
        if (w) { setWallpaper(w.dataset.wp); paint('personal'); return; }
        const t = e.target.closest('.toggle');
        if (t) {
            t.classList.toggle('on');
            if (t.dataset.t === 'theme') { QS.find(q => q.id === 'theme').on = t.classList.contains('on'); renderQS(); applyQS(); }
            else toast('设置已保存（演示）');
            return;
        }
        const o = e.target.closest('[data-open]'); if (o) openApp(o.dataset.open);
        if (e.target.closest('[data-orca]')) { window.open('https://www.orcarouter.ai/ref/ref_57e9d042b829968c3b14', '_blank'); }
    });
    paint('system');
}
function setWallpaper(id) {
    const w = WALLPAPERS.find(x => x.id === id);
    if (!w) return;
    $('#wallpaper').style.backgroundImage = `url("${w.src}")`;
    $('#lockscreen').style.backgroundImage = `url("${w.src}")`;
    store.set('wallpaper', id);
}

/* ================= Edge ================= */
function buildEdge() {
    const html = `
    <div class="edge" data-edge>
        <div class="edge-bar">
            <button class="eb" data-e="back">‹</button><button class="eb" data-e="fwd">›</button><button class="eb" data-e="reload">⟳</button>
            <div class="edge-url"><span class="s-ico"></span><input data-url value="edge://newtab" spellcheck="false"></div>
        </div>
        <div class="edge-page" data-page>
            <div class="edge-logo">${ICONS.edge}</div>
            <div class="edge-box"><span class="s-ico"></span><input data-q placeholder="搜索或输入网址"></div>
            <div class="edge-links">
                <button class="edge-link" data-l="bilibili">${ico('mp4')}<span>Bilibili</span></button>
                <button class="edge-link" data-l="github">${ico('terminal')}<span>GitHub</span></button>
                <button class="edge-link" data-l="youtube">${ico('mp4')}<span>YouTube</span></button>
                <button class="edge-link" data-l="store">${ico('store')}<span>应用商店</span></button>
            </div>
        </div>
    </div>`;
    setTimeout(() => initEdge($('[data-edge]')), 0);
    return { html, w: 960, h: 620, title: 'Edge' };
}
function initEdge(root) {
    const go = url => {
        const page = $('[data-page]', root);
        const showErr = !/^edge:\/\//.test(url);
        page.innerHTML = showErr
            ? `<div class="edge-err"><div class="big">🌐</div><h3 style="color:var(--text);margin-bottom:8px">无法访问此页面</h3><p>网页演示环境无真实网络访问。<br>试试 edge://newtab</p></div>`
            : `<div class="edge-logo">${ICONS.edge}</div>
               <div class="edge-box"><span class="s-ico"></span><input data-q placeholder="搜索或输入网址"></div>
               <div class="edge-links">
                   <button class="edge-link" data-l="bilibili">${ico('mp4')}<span>Bilibili</span></button>
                   <button class="edge-link" data-l="github">${ico('terminal')}<span>GitHub</span></button>
                   <button class="edge-link" data-l="youtube">${ico('mp4')}<span>YouTube</span></button>
                   <button class="edge-link" data-l="store">${ico('store')}<span>应用商店</span></button>
               </div>`;
    };
    root.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        if (e.target.matches('[data-url]')) go(e.target.value.trim() || 'edge://newtab');
        if (e.target.matches('[data-q]')) { $('[data-url]', root).value = e.target.value; toast('网页演示环境无真实网络访问'); }
    });
    root.addEventListener('click', e => {
        const l = e.target.closest('[data-l]');
        if (l) { if (l.dataset.l === 'store') openApp('store'); else toast('网页演示环境无真实网络访问'); }
        const b = e.target.closest('[data-e]');
        if (b) { if (b.dataset.e === 'reload') go($('[data-url]', root).value); else toast('（演示）'); }
    });
}

/* ================= 记事本 ================= */
function buildNotepad() {
    const html = `
    <div class="np" data-np>
        <div class="np-menu"><button data-n="new">新建</button><button data-n="save">保存</button><button data-n="clear">清空</button></div>
        <textarea data-ta placeholder="在此输入…" spellcheck="false"></textarea>
        <div class="np-status" data-st>0 字</div>
    </div>`;
    setTimeout(() => {
        const root = $('[data-np]'), ta = $('[data-ta]', root);
        ta.value = store.get('note', '');
        const upd = () => $('[data-st]', root).textContent = ta.value.length + ' 字';
        ta.addEventListener('input', upd); upd();
        root.addEventListener('click', e => {
            const b = e.target.closest('[data-n]'); if (!b) return;
            if (b.dataset.n === 'save') { store.set('note', ta.value); toast('已保存到本地'); }
            else if (b.dataset.n === 'clear') { ta.value = ''; upd(); }
            else if (b.dataset.n === 'new') { if (confirm('放弃当前内容新建？')) { ta.value = ''; upd(); } }
        });
    }, 0);
    return { html, w: 640, h: 480, title: '记事本' };
}

/* ================= 终端 ================= */
function buildTerminal() {
    const html = `<div class="term" data-term><div data-out></div><div class="term-input"><span>PS&gt;</span><input data-in spellcheck="false"></div></div>`;
    setTimeout(() => {
        const root = $('[data-term]'), out = $('[data-out]', root), inp = $('[data-in]', root);
        const print = (t, cls) => { const d = document.createElement('div'); d.className = 'tl' + (cls ? ' ' + cls : ''); d.textContent = t; out.appendChild(d); root.scrollTop = root.scrollHeight; };
        print('Windows 12 网页终端 [版本 24H2]', 'tp');
        print('这是一个演示 shell，试试 help');
        inp.addEventListener('keydown', e => {
            if (e.key !== 'Enter') return;
            const cmd = inp.value.trim(); print('PS> ' + cmd); inp.value = '';
            const [c, ...rest] = cmd.split(/\s+/), arg = rest.join(' ');
            if (!c) return;
            if (c === 'help') print('可用命令：help / echo / ver / date / cls / open <应用名>');
            else if (c === 'echo') print(arg);
            else if (c === 'ver') print('Windows 12 网页版 24H2');
            else if (c === 'date') print(new Date().toString());
            else if (c === 'cls') out.innerHTML = '';
            else if (c === 'open') { const a = APPS.find(x => x.id === arg || x.name === arg); a ? (print('正在打开 ' + a.name + '…'), openApp(a.id)) : print(`找不到应用: ${arg}`); }
            else print(`'${c}' 不是内部命令（演示 shell）`);
        });
        setTimeout(() => inp.focus(), 100);
    }, 0);
    return { html, w: 680, h: 440, title: '终端' };
}

/* ================= 商店 ================= */
function buildStore() {
    const html = `<div class="store" data-store>
        <div class="store-hero"><h3>精选应用</h3><p>为 Windows 12 网页版挑选的好应用</p></div>
        <div class="store-grid">${APPS.map(a => `
            <div class="store-card">${ico(a.icon)}<b>${esc(a.name)}</b><i>免费 · 演示版</i><button data-get="${a.id}">获取</button></div>`).join('')}
        </div></div>`;
    setTimeout(() => {
        $('[data-store]').addEventListener('click', e => {
            const b = e.target.closest('[data-get]'); if (!b) return;
            const a = appById(b.dataset.get);
            b.textContent = '打开'; b.onclick = () => openApp(a.id);
            toast(`「${a.name}」已安装（演示）`, '✅');
            b.addEventListener('click', () => openApp(a.id), { once: true });
        });
    }, 0);
    return { html, w: 900, h: 600, title: 'Microsoft Store' };
}

/* ================= 托盘图标填充 ================= */
function fillTray() {
    $$('.ti').forEach(s => { s.innerHTML = ICONS[s.dataset.ti] || ''; });
}

/* ================= 桌面图标 ================= */
const DESK_ICONS = [
    { name: '此电脑', icon: 'thispc', app: 'explorer' },
    { name: '文件资源管理器', icon: 'explorer', app: 'explorer' },
    { name: 'Microsoft Edge', icon: 'edge', app: 'edge' },
    { name: '记事本', icon: 'notepad', app: 'notepad' },
    { name: '回收站', icon: 'trash', app: null },
];
function renderDesktopIcons() {
    $('#desktopIcons').innerHTML = DESK_ICONS.map((d, i) =>
        `<button class="dicon" data-i="${i}"><span class="di-img">${ICONS[d.icon]}</span><span>${d.name}</span></button>`).join('');
    let sel = -1;
    $('#desktopIcons').addEventListener('click', e => {
        const b = e.target.closest('.dicon'); if (!b) return;
        sel = +b.dataset.i;
        $$('.dicon').forEach(x => x.style.background = '');
        b.style.background = 'var(--active)';
    });
    $('#desktopIcons').addEventListener('dblclick', e => {
        const b = e.target.closest('.dicon'); if (!b) return;
        const d = DESK_ICONS[+b.dataset.i];
        if (d.app) openApp(d.app); else toast('回收站是空的 ✨');
    });
}

/* ================= 右键菜单 ================= */
function showCtx(x, y, items) {
    const m = $('#ctxMenu');
    m.innerHTML = items.map(it => it.sep ? '<div class="ctx-sep"></div>' :
        it.sub ? `<div class="ctx-sub"><button class="ctx-item" data-k="${it.k}"><span>${it.icon || ''}</span>${esc(it.label)}<span class="k">›</span></button>
            <div class="ctx-submenu">${it.sub.map(s => `<button class="ctx-item" data-k="${s.k}"><span>${s.icon || ''}</span>${esc(s.label)}</button>`).join('')}</div></div>` :
        `<button class="ctx-item" data-k="${it.k}"><span>${it.icon || ''}</span>${esc(it.label)}${it.hint ? `<span class="k">${it.hint}</span>` : ''}</button>`).join('');
    m.classList.add('open');
    const r = m.getBoundingClientRect();
    m.style.left = Math.min(x, innerWidth - 240) + 'px';
    m.style.top = Math.min(y, innerHeight - r.height - 90) + 'px';
    m.onclick = e => {
        const b = e.target.closest('[data-k]'); if (!b) return;
        m.classList.remove('open');
        ctxAction(b.dataset.k);
    };
}
function ctxAction(k) {
    if (k === 'refresh') { location.reload(); }
    else if (k === 'personal') openApp('settings');
    else if (k === 'nextwp') {
        const cur = store.get('wallpaper', 'concept');
        const ids = WALLPAPERS.map(w => w.id);
        setWallpaper(ids[(ids.indexOf(cur) + 1) % ids.length]);
        toast('已切换到下一个场景');
    }
    else if (k === 'terminal') openApp('terminal');
    else if (k === 'display') openApp('settings');
    else toast('（演示）' + k);
}
const DESK_CTX = [
    { k: 'view', label: '查看', icon: '🖥️', sub: [{ k: 'v1', label: '大图标' }, { k: 'v2', label: '中等图标' }, { k: 'v3', label: '小图标' }] },
    { k: 'sort', label: '排序方式', icon: '↕️', sub: [{ k: 's1', label: '名称' }, { k: 's2', label: '日期' }, { k: 's3', label: '类型' }] },
    { k: 'refresh', label: '刷新', icon: '🔄', hint: '' },
    { sep: true },
    { k: 'nextwp', label: '下一个桌面背景', icon: '🖼️' },
    { k: 'terminal', label: '在终端中打开', icon: '⌨️' },
    { sep: true },
    { k: 'display', label: '显示设置', icon: '🖥️' },
    { k: 'personal', label: '个性化', icon: '🎨' },
];

/* ================= 事件总线 ================= */
function wireGlobal() {
    // 开始菜单
    $('#startMenu').addEventListener('click', e => {
        const a = e.target.closest('[data-app]');
        if (a) { openApp(a.dataset.app); return; }
        if (e.target.closest('#smAllAppsBtn')) { $('#startMenu').classList.add('show-all'); return; }
        if (e.target.closest('#smAllAppsBack')) { $('#startMenu').classList.remove('show-all'); return; }
        if (e.target.closest('#smPower')) { $('#smPowerMenu').classList.toggle('open'); return; }
        const pw = e.target.closest('[data-pw]');
        if (pw) {
            $('#smPowerMenu').classList.remove('open'); closePanels();
            if (pw.dataset.pw === 'lock') lockScreen();
            else if (pw.dataset.pw === 'sleep') { document.body.style.filter = 'brightness(0)'; setTimeout(() => { document.body.style.filter = ''; lockScreen(); }, 1200); }
            else if (pw.dataset.pw === 'restart') { toast('正在重启…', '🔄'); setTimeout(() => location.reload(), 1200); }
        }
    });
    $('#smSearch').addEventListener('input', e => filterStart(e.target.value));
    $('#smAllSearch').addEventListener('input', e => {
        const q = e.target.value.trim().toLowerCase();
        $$('#smAbcList .abc-item').forEach(b => {
            const a = appById(b.dataset.app);
            b.style.display = (!q || a.name.toLowerCase().includes(q)) ? '' : 'none';
        });
        $$('#smAbcList .abc-head').forEach(h => h.style.display = q ? 'none' : '');
    });
    // 搜索
    $('#searchPanel').addEventListener('click', e => {
        const a = e.target.closest('[data-app]'); if (a) openApp(a.dataset.app);
    });
    $('#spInput').addEventListener('input', e => doSearch(e.target.value));
    // 小组件：点空白关闭
    $('#widgetsPanel').addEventListener('click', e => {
        if (e.target.id === 'widgetsPanel' || e.target.classList.contains('wg-hint')) closePanels();
    });
    // 快捷设置
    $('#quickSettings').addEventListener('click', e => {
        const t = e.target.closest('.qs-t');
        if (t) {
            const q = QS.find(x => x.id === t.dataset.q);
            q.on = !q.on; t.classList.toggle('on', q.on); applyQS();
            if (q.id === 'theme') toast(q.on ? '已切换深色模式' : '已切换浅色模式', q.on ? '🌙' : '☀️');
            return;
        }
        if (e.target.closest('#qsSettings')) { closePanels(); openApp('settings'); }
    });
    $('#qsBrightness').addEventListener('input', e => {
        $('#wallpaper').style.filter = `brightness(${e.target.value / 100})`;
    });
    $('#qsVolume').addEventListener('input', () => {});
    // 日历
    $('#calPrev').addEventListener('click', () => { calCursor.setMonth(calCursor.getMonth() - 1); renderCal(); });
    $('#calNext').addEventListener('click', () => { calCursor.setMonth(calCursor.getMonth() + 1); renderCal(); });
    $('#calToday').addEventListener('click', () => { calCursor = new Date(); renderCal(); });
    // 任务栏
    $('#tbQuick').addEventListener('click', () => togglePanel('quickSettings'));
    $('#tbClock').addEventListener('click', () => togglePanel('calPanel'));
    ['tbWeather', 'tbStock'].forEach(id => $('#' + id).addEventListener('click', () => togglePanel('widgetsPanel')));
    $('#tbMedia').addEventListener('click', e => {
        const m = e.target.closest('[data-m]');
        if (m) {
            e.stopPropagation();
            if (m.dataset.m === 'play') { m.textContent = m.textContent === '⏸' ? '▶' : '⏸'; }
            toast('媒体控制（演示）', '🎵');
            return;
        }
        togglePanel('widgetsPanel');
    });
    // 点击桌面空白关闭面板
    $('#wallpaper').addEventListener('click', () => closePanels());
    // 右键菜单
    document.addEventListener('contextmenu', e => {
        if (e.target.closest('input, textarea')) return;
        e.preventDefault();
        if (e.target.closest('#wallpaper') || e.target.closest('#desktopIcons')) showCtx(e.clientX, e.clientY, DESK_CTX);
        else $('#ctxMenu').classList.remove('open');
    });
    document.addEventListener('click', e => {
        if (!e.target.closest('#ctxMenu')) $('#ctxMenu').classList.remove('open');
    });
    // 键盘
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closePanels();
        if (e.metaKey || e.key === 'Meta') { e.preventDefault(); togglePanel('startMenu'); }
    });
    // 锁屏
    $('#lockscreen').addEventListener('click', () => $('#lockscreen').classList.add('hide'));
}
function lockScreen() { $('#lockscreen').classList.remove('hide'); }

/* ================= 启动 ================= */
function init() {
    fillTray();
    renderTaskbar();
    renderStartMenu();
    renderSearch();
    renderWidgets();
    renderQS();
    renderCal();
    renderDesktopIcons();
    wireGlobal();
    tickClock();
    applyQS();
    const wp = WALLPAPERS.find(w => w.id === store.get('wallpaper', 'concept'));
    if (wp) {
        $('#wallpaper').style.backgroundImage = `url("${wp.src}")`;
        $('#lockscreen').style.backgroundImage = `url("${wp.src}")`;
    }
    setTimeout(() => toast('欢迎来到 Windows 12 网页版 🎉', '🐭'), 900);
}
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
