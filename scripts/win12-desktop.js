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
/* ---------- 设置页图标：Win11 截图 1:1 手绘线稿 ---------- */
const L = inner => S(`<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`);
Object.assign(ICONS, {
    /* 左侧导航（彩色） */
    bell: S('<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2.5h-15z" fill="none" stroke="#e8e8e8" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 20a4 4 0 0 0 8 0" fill="none" stroke="#e8e8e8" stroke-width="1.8" stroke-linecap="round"/>'),
    navHome: S('<path d="M3 11.5 12 4l9 7.5" fill="none" stroke="#ff9f43" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.8 10.8V20h12.4v-9.2" fill="none" stroke="#4cc2ff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'),
    navSystem: S('<rect x="4" y="5" width="16" height="11" rx="2" fill="#4cc2ff"/><path d="M9 20h6" stroke="#4cc2ff" stroke-width="2.2" stroke-linecap="round"/>'),
    navBt: S('<path d="M12 3.5v17" stroke="#4cc2ff" stroke-width="1.8" stroke-linecap="round"/><path d="M6.8 7.2l10.4 9.6-4.4 3.7V3.5l4.4 3.7-10.4 9.6" fill="none" stroke="#4cc2ff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'),
    navNet: S('<path d="M3.5 10a13 13 0 0 1 17 0M6.5 13.8a8.5 8.5 0 0 1 11 0M9.7 17.3a4 4 0 0 1 4.6 0" fill="none" stroke="#4cc2ff" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="19.6" r="1.5" fill="#4cc2ff"/>'),
    navPersonal: S('<path d="M15.6 3.6l4.8 4.8L10 18.8l-5.6-5.6L15.6 3.6z" fill="#ffb020"/><path d="M4.4 13.2l-1.8 7.2 7.2-1.8-4.2-4.2-1.2-1.2z" fill="#e07b00"/>'),
    navApps: S('<rect x="4" y="4" width="7" height="7" rx="1.6" fill="#4cc2ff"/><rect x="13" y="4" width="7" height="7" rx="1.6" fill="#2f9fe0"/><rect x="4" y="13" width="7" height="7" rx="1.6" fill="#2f9fe0"/><rect x="13" y="13" width="7" height="7" rx="1.6" fill="#4cc2ff"/>'),
    navAccount: S('<circle cx="12" cy="8" r="4" fill="#2dd4bf"/><path d="M4.6 20a7.6 7.6 0 0 1 14.8 0" fill="#2dd4bf"/>'),
    navTime: S('<circle cx="12" cy="12" r="8.6" fill="none" stroke="#4cc2ff" stroke-width="2"/><path d="M12 7.4V12l3.2 2" fill="none" stroke="#4cc2ff" stroke-width="2" stroke-linecap="round"/>'),
    navGame: S('<path d="M7.5 8.5h9a5 5 0 0 1 5 5c0 2.7-1.9 4.5-4 4.5-1.5 0-2.4-.9-3.2-2.3H9.7c-.8 1.4-1.7 2.3-3.2 2.3-2.1 0-4-1.8-4-4.5a5 5 0 0 1 5-5z" fill="#6b7cff"/><circle cx="9" cy="12.8" r="1.2" fill="#fff"/><circle cx="15" cy="11.8" r="1.2" fill="#fff"/><circle cx="17" cy="14" r="1.2" fill="#fff"/>'),
    navAccess: S('<circle cx="12" cy="5.4" r="2.6" fill="#4cc2ff"/><path d="M12 9.5V15M4.8 11.5l7.2-1.2 7.2 1.2M12 15l-3.2 5.6M12 15l3.2 5.6" fill="none" stroke="#4cc2ff" stroke-width="2" stroke-linecap="round"/>'),
    navPrivacy: S('<path d="M12 2.8l7.2 2.6v5.3c0 5.2-3.1 8.8-7.2 10.3-4.1-1.5-7.2-5.1-7.2-10.3V5.4L12 2.8z" fill="#9aa0a6"/>'),
    navUpdate: S('<path d="M20 12a8 8 0 1 1-2.4-5.7" fill="none" stroke="#4cc2ff" stroke-width="2.2" stroke-linecap="round"/><path d="M20 3.5V8h-4.5" fill="none" stroke="#4cc2ff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'),
    navAi: S('<path d="M4 4.5h16a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1H9.5L4 20V5.5a1 1 0 0 1 1-1z" fill="#a855f7"/><circle cx="9" cy="10" r="1.3" fill="#fff"/><circle cx="13" cy="10" r="1.3" fill="#fff"/><circle cx="17" cy="10" r="1.3" fill="#fff"/>'),
    /* 通用占位头像（默认系统头像，不用真人信息） */
    rAvatar: S('<circle cx="12" cy="12" r="11.5" fill="#3a3a40"/><circle cx="12" cy="9.3" r="4" fill="#9a9a9a"/><path d="M4.9 19.6a7.3 7.3 0 0 1 14.2 0" fill="#9a9a9a"/>'),
    /* 行图标（白色线稿） */
    rScreen: L('<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M9 21h6M12 17v4"/>'),
    rSound: L('<path d="M4 10v4h3.2L12 18V6L7.2 10H4z"/><path d="M15.5 9.3a4.2 4.2 0 0 1 0 5.4M18 6.8a7.6 7.6 0 0 1 0 10.4"/>'),
    rFocus: L('<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="2.6"/>'),
    rPower: L('<path d="M12 3v8"/><path d="M6.2 6.4a8 8 0 1 0 11.6 0"/>'),
    rStorage: L('<rect x="3.5" y="6.5" width="17" height="11" rx="2"/><circle cx="8" cy="12" r="1.1"/><path d="M12.5 12H18"/>'),
    rMulti: L('<rect x="8.5" y="3.5" width="12" height="9.5" rx="1.6"/><path d="M3.5 8.5v8.4a1.6 1.6 0 0 0 1.6 1.6h11.4"/>'),
    rAdv: L('<path d="M4 7h16M4 12h16M4 17h16"/><circle cx="9.5" cy="7" r="2.1"/><circle cx="14.5" cy="12" r="2.1"/><circle cx="8.5" cy="17" r="2.1"/>'),
    rActive: L('<circle cx="12" cy="12" r="8.4"/><path d="M8.3 12.4l2.6 2.6 5-5.8"/>'),
    rTrouble: L('<path d="M14.8 5.2a4.2 4.2 0 0 0-5.9 5.3L4 15.4V20h4.6l4.9-4.9a4.2 4.2 0 0 0 5.3-5.9l-3 3-2.4-.7-.7-2.4 3.1-3.9z"/>'),
    rRecovery: L('<path d="M5 12a7 7 0 1 1-2 4.9"/><path d="M5 21v-5h5"/>'),
    rProject: L('<rect x="2.5" y="4.5" width="14" height="10" rx="1.6"/><path d="M6 19.5h8"/><path d="M16.5 16.5l5 5m0-5v5h-5"/>'),
    rRemote: L('<path d="M9.5 5.5L4 12l5.5 6.5M14.5 5.5L20 12l-5.5 6.5"/>'),
    rClip: L('<rect x="6" y="4.5" width="12" height="16.5" rx="2"/><rect x="9" y="2.5" width="6" height="4" rx="1.2"/>'),
    rSysComp: L('<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M4 9.5h16M4 14.5h16M9.5 4v16M14.5 4v16"/>'),
    rDevice: L('<rect x="2.5" y="8.5" width="12.5" height="8.5" rx="2"/><path d="M6 12h.01M9.3 12h.01M12.6 12h.01M6 14.8h6.5"/><rect x="16.8" y="5.5" width="4.7" height="9.5" rx="2.3"/><path d="M19.1 5.5v4"/>'),
    rPrinter: L('<path d="M7 8V3.5h10V8"/><rect x="3.5" y="8" width="17" height="8.5" rx="2"/><rect x="7" y="13" width="10" height="7.5" rx="1"/>'),
    rPhone: L('<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.8 18.8h2.4"/>'),
    rMouse: L('<rect x="8" y="2.5" width="8" height="19" rx="4"/><path d="M12 2.5V9"/>'),
    rKeyboard: L('<rect x="2.5" y="7" width="19" height="10.5" rx="2"/><path d="M6.5 10.5h.01M10.5 10.5h.01M14.5 10.5h.01M18 10.5h.01M7 14.5h10"/>'),
    rPen: L('<path d="M4 20l1.2-4.2L16.7 4.3a2 2 0 0 1 2.9 0l.1.1a2 2 0 0 1 0 2.9L8.2 18.8 4 20z"/><path d="M14.7 6.3l3 3"/>'),
    rAutoplay: L('<circle cx="12" cy="12" r="8.4"/><path d="M10 8.3l6.2 3.7-6.2 3.7V8.3z"/>'),
    rUsb: L('<path d="M10 5.5h4M12 3.5V14"/><path d="M10 5.5l2-2 2 2"/><path d="M12 14l-5.5 6.5M12 14l5.5 3.5"/><circle cx="5.8" cy="20" r="1.4"/><rect x="16.6" y="16.4" width="2.8" height="2.8"/>'),
    rBg: L('<rect x="3.5" y="5" width="17" height="14.5" rx="2"/><circle cx="9" cy="10" r="1.7"/><path d="M3.5 17.5l5-4.5 3.8 3 3.2-2.2 5 3.7"/>'),
    rColor: L('<path d="M12 3.8a8.2 8.2 0 1 0 .1 16.4c1.4 0 2.1-.9 1.5-2-.7-1.2.1-2.6 1.6-2.6h1.6a4.2 4.2 0 0 0 4.2-4.2C21 7 17 3.8 12 3.8z"/><circle cx="8.3" cy="10.2" r="1.1"/><circle cx="12" cy="7.8" r="1.1"/><circle cx="15.7" cy="10.2" r="1.1"/>'),
    rTheme: L('<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>'),
    rLight: L('<path d="M11 4l1.7 4.4L17 10l-4.3 1.7L11 16l-1.7-4.3L5 10l4.3-1.6L11 4z"/><path d="M18 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z"/>'),
    rLockScr: L('<rect x="2.5" y="4" width="19" height="12.5" rx="2"/><rect x="10" y="9.8" width="4" height="3.6" rx=".9"/><path d="M10.9 9.8V8.6a1.1 1.1 0 0 1 2.2 0v1.2"/><path d="M9 20.5h6"/>'),
    rTaskbar: L('<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M2.5 14.5h19"/><circle cx="7" cy="16.8" r=".9" fill="currentColor" stroke="none"/><circle cx="12" cy="16.8" r=".9" fill="currentColor" stroke="none"/><circle cx="17" cy="16.8" r=".9" fill="currentColor" stroke="none"/>'),
    rFont: L('<path d="M5.5 20L12 4l6.5 16M7.8 14h8.4"/>'),
    rUsage: L('<rect x="2.5" y="5" width="12.5" height="9" rx="1.6"/><rect x="16.5" y="9.5" width="5" height="10" rx="1.6"/><path d="M6.5 19.5h5"/>'),
    rInfo: L('<rect x="2.5" y="5.5" width="19" height="13.5" rx="2"/><circle cx="8.3" cy="10.8" r="2"/><path d="M5.3 16a3.4 3.4 0 0 1 6 0M14 9.8h5M14 13h5"/>'),
    rLogin: L('<circle cx="8.5" cy="12" r="4"/><path d="M12.5 12H21M17.5 12v3.5M21 12v2.5"/>'),
    rSync: L('<path d="M4.5 12a7.5 7.5 0 0 1 13-5.1M19.5 12a7.5 7.5 0 0 1-13 5.1"/><path d="M17.5 3.5v3.8h-3.8M6.5 20.5v-3.8h3.8"/>'),
    rBackup: L('<path d="M7 18.5a4.2 4.2 0 1 1 .6-8.35A5.6 5.6 0 0 1 18.4 12H18a3.2 3.2 0 0 1-1 6.23"/><path d="M12 12.5V19M9.7 14.8L12 12.5l2.3 2.3"/>'),
    rUsers: L('<circle cx="9" cy="8" r="3.4"/><path d="M2.8 19.5a6.4 6.4 0 0 1 12.4 0"/><circle cx="17" cy="9" r="2.6"/><path d="M16.2 14.6a5.6 5.6 0 0 1 5 4.4"/>'),
    rGamebar: L('<rect x="2.5" y="7" width="19" height="10.5" rx="5.2"/><path d="M8 11v3.4M6.3 12.7h3.4"/><circle cx="15.3" cy="12" r="1.1"/><circle cx="17.6" cy="14" r="1.1"/>'),
    rCapture: L('<rect x="2.5" y="6.5" width="19" height="12.5" rx="2"/><circle cx="12" cy="12.7" r="3.4"/><circle cx="12" cy="12.7" r="1" fill="currentColor" stroke="none"/>'),
    rShield: L('<path d="M12 2.8l7.2 2.6v5.3c0 5.2-3.1 8.8-7.2 10.3-4.1-1.5-7.2-5.1-7.2-10.3V5.4L12 2.8z"/><path d="M9.3 12l2.1 2.1 3.6-4.2"/>'),
    rFindDev: L('<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><path d="M12 12l4.5-4.5"/>'),
    rAds: L('<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7"/>'),
    rSpeech: L('<circle cx="10" cy="8" r="3.2"/><path d="M3.8 19.5a6.2 6.2 0 0 1 12.4 0"/><path d="M17.5 8.5a4.2 4.2 0 0 1 0 5.5M20 6.5a7.6 7.6 0 0 1 0 9.5"/>'),
    rInk: L('<path d="M12 2.8l3.8 8.2L12 21.2 8.2 11 12 2.8z"/><circle cx="12" cy="11" r="1.2"/>'),
    rDiag: L('<path d="M3.5 3.5V20.5H20.5"/><path d="M8 15.5l3-4.5 3 2.5 4-6.5"/>'),
    rLoc: L('<path d="M12 21.5s7-6.6 7-11.3a7 7 0 1 0-14 0c0 4.7 7 11.3 7 11.3z"/><circle cx="12" cy="10" r="2.5"/>'),
    rMic: L('<rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/>'),
    rVoice: L('<circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><path d="M8.7 8.7a4.7 4.7 0 0 0 0 6.6M15.3 8.7a4.7 4.7 0 0 1 0 6.6M6 6a8.6 8.6 0 0 0 0 12M18 6a8.6 8.6 0 0 1 0 12"/>'),
    rContacts: L('<rect x="5.5" y="3.5" width="14" height="17" rx="2"/><path d="M5.5 7.5H3.8M5.5 11.5H3.8M5.5 15.5H3.8"/><circle cx="12.5" cy="9.8" r="2"/><path d="M9.5 16a3.2 3.2 0 0 1 6 0"/>'),
    rCalls: L('<path d="M5.5 3.5h3.8l1.8 4.8-2.3 1.7a12.5 12.5 0 0 0 5.2 5.2l1.7-2.3 4.8 1.8v3.8a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 3.5 5.6a2 2 0 0 1 2-2.1z"/>'),
    rPause: L('<rect x="7" y="5" width="3.4" height="14" rx="1.2"/><rect x="13.6" y="5" width="3.4" height="14" rx="1.2"/>'),
    rHistory: L('<path d="M4.8 12a7.2 7.2 0 1 1 2.1 5.1"/><path d="M4.8 17.5v-5h5"/><path d="M12 8v4.2l3 1.8"/>'),
    rHelp: L('<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="3.4"/><path d="M12 3.6v5M12 15.4v5M3.6 12h5M15.4 12h5"/>'),
    rGlobe: L('<circle cx="12" cy="12" r="8.4"/><path d="M3.6 12h16.8M12 3.6c2.6 2.4 3.9 5.3 3.9 8.4s-1.3 6-3.9 8.4c-2.6-2.4-3.9-5.3-3.9-8.4s1.3-6 3.9-8.4z"/>'),
    rMega: L('<path d="M3.5 10.5v4h3l8.5 4v-12l-8.5 4h-3z"/><path d="M18 9.5a4 4 0 0 1 0 6"/><path d="M7 14.5V20"/>'),
    rEth: L('<path d="M9 2.5V8M15 2.5V8M7 8h10v3.5a5 5 0 0 1-10 0V8zM12 16.5V21"/>'),
    rBack: L('<path d="M14.5 5.5L8 12l6.5 6.5"/>'),
    rSearchSm: L('<circle cx="11" cy="11" r="6.2"/><path d="M15.6 15.6L20.5 20.5"/>'),
    rCheck: L('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    rUpdateBig: S('<path d="M20 12a8 8 0 1 1-2.4-5.7" fill="none" stroke="#4cc2ff" stroke-width="2.4" stroke-linecap="round"/><path d="M20 3.5V8h-4.5" fill="none" stroke="#4cc2ff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'),
});
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
    'Downloads': { label: '下载', icon: 'downloads', files: [F('更新日志.txt'), F('Windows12-Setup.exe'), F('使用说明.txt')] },
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

/* ================= 设置（Win11 截图 1:1） ================= */
/* 壁纸：纯 CSS 手绘场景，不再引用 AI 生成图片 */
const WALLPAPERS = [
    { id: 'ribbon', name: '紫韵丝带', cls: 'wp-ribbon', accent: '#e0449e' },
    { id: 'tide', name: '青蓝潮汐', cls: 'wp-tide', accent: '#38bdf8' },
    { id: 'pastel', name: '暖阳粉彩', cls: 'wp-pastel', accent: '#f59e0b' },
    { id: 'night', name: '深邃暗夜', cls: 'wp-night', accent: '#7c3aed' },
    { id: 'neon', name: '霓虹紫', cls: 'wp-neon', accent: '#a855f7' },
    { id: 'lake', name: '湖畔晨光', cls: 'wp-lake', accent: '#2dd4bf' },
];
function setWallpaper(id) {
    const w = WALLPAPERS.find(x => x.id === id) || WALLPAPERS[0];
    ['#wallpaper', '#lockscreen'].forEach(sel => {
        const el = $(sel);
        WALLPAPERS.forEach(x => el.classList.remove(x.cls));
        el.classList.add(w.cls);
    });
    store.set('wallpaper', w.id);
}

const SET_NAV = [
    { id: 'home', name: '主页', icon: 'navHome' },
    { id: 'system', name: '系统', icon: 'navSystem' },
    { id: 'bt', name: '蓝牙和其他设备', icon: 'navBt' },
    { id: 'net', name: '网络和 Internet', icon: 'navNet' },
    { id: 'personal', name: '个性化', icon: 'navPersonal' },
    { id: 'apps', name: '应用', icon: 'navApps' },
    { id: 'account', name: '帐户', icon: 'navAccount' },
    { id: 'time', name: '时间和语言', icon: 'navTime' },
    { id: 'gaming', name: '游戏', icon: 'navGame' },
    { id: 'access', name: '辅助功能', icon: 'navAccess' },
    { id: 'privacy', name: '隐私和安全性', icon: 'navPrivacy' },
    { id: 'update', name: 'Windows 更新', icon: 'navUpdate' },
    { id: 'ai', name: 'AI 助手', icon: 'navAi' },
];

/* 行 / 卡片 / 控件 */
const wchev = '<span class="wchev">›</span>';
/* 用 div 而非 button，避免右侧控件出现嵌套按钮 */
const wrow = (icon, title, sub, right) =>
    `<div class="wrow" data-demo role="button" tabindex="0"><span class="wrow-ico">${icon ? ICONS[icon] : ''}</span><span class="wrow-tx"><b>${title}</b>${sub ? `<i>${sub}</i>` : ''}</span><span class="wrow-r">${right === undefined ? wchev : right}</span></div>`;
const wcard = inner => `<div class="wcard">${inner}</div>`;
const wsec = t => `<div class="wsec">${t}</div>`;
const wlink = label => `<button class="wlink" data-demo>${label}</button>`;
const wtoggle = on => `<button class="wtoggle${on ? ' on' : ''}" data-tg aria-label="开关"></button>`;
const wpCur = () => WALLPAPERS.find(w => w.id === store.get('wallpaper', 'ribbon')) || WALLPAPERS[0];
const wheoInner = () => {
    const w = wpCur();
    return `<span class="wdev ${w.cls}"></span>
        <span class="whero-tx"><b>${esc(store.get('pcname', 'PC-202501201810'))}</b><i>System Product Name</i><button class="wlink" data-rename>重命名</button></span>`;
};
const wthemes = () => {
    const cur = wpCur().id;
    return `<div class="wthemes">${WALLPAPERS.map(w =>
        `<button class="wtheme ${w.cls}${cur === w.id ? ' on' : ''}" data-theme="${w.id}" title="${w.name}"><span class="abar" style="background:${w.accent}"></span></button>`).join('')}</div>`;
};

function buildSettings() {
    const html = `
    <div class="set" data-set>
        <div class="set-top">
            <button class="set-back" data-back title="返回">${ICONS.rBack}</button>
            <span class="set-title">设置</span>
            <div class="set-search"><span class="ss-ico">${ICONS.rSearchSm}</span><input data-sq placeholder="查找设置" spellcheck="false"></div>
        </div>
        <div class="set-body">
            <div class="set-side">
                <div class="set-user"><span class="set-avatar">${ICONS.rAvatar}</span><span class="su-tx"><b>User</b><i>user@example.com</i></span></div>
                <div data-nav>${SET_NAV.map(n =>
                    `<button class="set-nav" data-p="${n.id}"><span class="snav-ico">${ICONS[n.icon]}</span><span>${n.name}</span></button>`).join('')}</div>
            </div>
            <div class="set-main"><div class="wpage" data-page></div></div>
        </div>
    </div>`;
    setTimeout(() => initSettings($('[data-set]')), 0);
    return { html, w: 980, h: 620, title: '设置' };
}

/* ---------------- 各页面 ---------------- */
function pgHome() {
    const m365 = [['W', '#2b88d8'], ['X', '#217346'], ['P', '#d24726'], ['O', '#0f6cbd'], ['N', '#7719aa'], ['D', '#0078d4']]
        .map(([t, c]) => `<span class="m365a" style="background:${c}">${t}</span>`).join('');
    return `<div class="wtitle">主页</div>
    <div class="whero">${wheoInner()}
        <span class="wstats">
            <span class="wstat"><span class="wrow-ico">${ICONS.rEth}</span><span><b>以太网</b><i>已连接</i></span></span>
            <span class="wstat"><span class="wrow-ico">${ICONS.navUpdate}</span><span><b>Windows 更新</b><i>上次检查时间: 83 天前</i></span></span>
        </span>
    </div>
    <div class="wcols">
        <div>
            ${wcard(`<div class="wcard-h"><b>推荐设置</b><i>最近使用的和常用的设置</i></div>
                ${wrow('clock', '日期和时间')}${wrow('grid', '默认应用')}${wrow('rGlobe', '语言和区域')}`)}
            ${wcard(`<div class="wcard-h"><b>个性化设备</b></div>
                <div style="padding:0 16px 12px">${wthemes()}</div>
                ${wrow('rColor', '色彩模式', '', `<button class="wdd" data-ddmode><span>${document.documentElement.dataset.theme === 'dark' ? '深色' : '浅色'}</span><span class="dd-a">▾</span></button>`)}
                ${wrow('', '浏览更多背景、颜色和主题')}`)}
        </div>
        <div>
            ${wcard(`<div class="wcard-h"><div class="mslogo"><i></i><i></i><i></i><i></i></div>
                <b>充分利用 Microsoft 365</b>
                <i>你可以访问 5 GB 的云存储空间和 Word 等 Web 应用。若要获得更多存储空间、高级安全性和高效工作应用，请订阅 Microsoft 365 个人版或家庭版。</i>
                <div class="m365apps">${m365}</div>
                <button class="wbtn" data-demo>获取 Microsoft 365</button></div>`)}
            ${wcard(`<div class="wcard-h"><span class="od-ico">${ICONS.cloud}</span><b>云存储空间</b>
                <i>出现问题，无法加载你的存储详细信息。请稍等片刻，然后重试。</i></div>`)}
        </div>
    </div>
    <button class="wlink whehelp" data-demo><span class="wrow-ico sm">${ICONS.rHelp}</span>获取帮助</button>`;
}

function pgSystem() {
    return `<div class="wtitle">系统</div>
    <div class="whero">${wheoInner()}
        <span class="wstats"><span class="wstat"><span class="wrow-ico">${ICONS.navUpdate}</span><span><b>Windows 更新</b><i>检查更新</i></span></span></span>
    </div>
    ${wcard(wrow('rScreen', '屏幕', '显示器、亮度、夜间模式、显示器配置文件'))}
    ${wcard(wrow('rSound', '声音', '音量、输出、输入、声音设备'))}
    ${wcard(wrow('bell', '通知', '来自应用和系统的通知、请勿打扰'))}
    ${wcard(wrow('rFocus', '专注', '减少干扰'))}
    ${wcard(wrow('rPower', '电源', '屏幕和睡眠、电源模式、节能模式'))}
    ${wcard(wrow('rStorage', '存储', '存储空间、驱动器、配置规则'))}
    ${wcard(wrow('share', '附近共享', '可发现性、收到文件的位置'))}
    ${wcard(wrow('rMulti', '多任务处理', '贴靠窗口、桌面、任务切换'))}
    ${wcard(wrow('rAdv', '高级', '性能、优化和开发人员功能'))}
    ${wcard(wrow('rActive', '激活', '激活状态、订阅、产品密钥'))}
    ${wcard(wrow('rTrouble', '疑难解答', '建议的疑难解答、首选项和历史记录'))}
    ${wcard(wrow('rRecovery', '恢复', '重置、高级启动、返回'))}
    ${wcard(wrow('rProject', '投影到此电脑', '权限、配对 PIN、可发现性'))}
    ${wcard(wrow('rRemote', '远程桌面', '远程桌面用户、连接权限'))}
    ${wcard(wrow('rClip', '剪贴板', '剪切和复制历史记录、同步、清除'))}
    ${wcard(wrow('rSysComp', '系统组件', '管理 Windows 附带的系统组件'))}`;
}

function pgBt() {
    return `<div class="wtitle">蓝牙和其他设备</div>
    ${wcard(wrow('rDevice', '设备', '鼠标、键盘、触笔、音频、显示器和“展开”、其他设备',
        `<button class="wbtn" data-demo>添加设备</button>${wchev}`))}
    ${wcard(wrow('rPrinter', '打印机和扫描仪', '首选项'))}
    ${wcard(wrow('rPhone', '移动设备', '立即从电脑访问移动设备'))}
    ${wcard(wrow('camera', '摄像头', '连接的摄像头、默认图像设置'))}
    ${wcard(wrow('rMouse', '鼠标', '按钮、鼠标指针速度、滚动'))}
    ${wcard(wrow('rKeyboard', '键盘', '字符重复、热键'))}
    ${wcard(wrow('rPen', '笔和 Windows Ink', '右手或左手、笔按钮快捷方式、手写'))}
    ${wcard(wrow('rAutoplay', '自动播放', '可移动驱动器和内存的默认设置'))}
    ${wcard(wrow('rUsb', 'USB', '通知、USB 节电模式'))}`;
}

function pgNet() {
    return `<div class="wtitle">网络和 Internet</div>
    ${wcard(wrow('rEth', '以太网', '已连接'))}
    ${wcard(wrow('wifi', 'WLAN', '可用网络'))}
    ${wcard(wrow('rLockScr', 'VPN', ''))}
    ${wcard(wrow('rGlobe', '代理', ''))}
    ${wcard(wrow('rAdv', '高级网络设置', '查看所有网络适配器、网络重置'))}`;
}

function pgPersonal() {
    return `<div class="wtitle">个性化</div>
    <div class="wprevrow">
        <div class="wpreview ${wpCur().cls}">
            <div class="wpreview-card"><i></i><i></i><i></i><b></b></div>
        </div>
        <div class="wprevside">${wsec('选择要应用的主题')}${wthemes()}</div>
    </div>
    ${wcard(wrow('rBg', '背景', '背景图像、颜色、幻灯片'))}
    ${wcard(wrow('rColor', '颜色', '主题色、透明效果、颜色主题'))}
    ${wcard(wrow('rTheme', '主题', '安装、创建、管理'))}
    ${wcard(wrow('rLight', '动态光效', '连接的设备、效果、应用设置'))}
    ${wcard(wrow('rLockScr', '锁屏界面', '锁定屏幕图像、应用和动画'))}
    ${wcard(wrow('rKeyboard', '文本输入', '触摸键盘、语音输入、表情符号等、输入法编辑器'))}
    ${wcard(wrow('grid', '开始', '最近使用的应用和项目、文件夹'))}
    ${wcard(wrow('rTaskbar', '任务栏', '任务栏行为、系统固定项'))}
    ${wcard(wrow('rFont', '字体', '安装、管理'))}
    ${wcard(wrow('rUsage', '设备使用情况', '选择你计划使用设备的所有方法。以在 Microsoft 体验中获取个性化的提示、广告和建议。'))}`;
}

function pgApps() {
    return `<div class="wtitle">应用</div>
    ${wcard(wrow('grid', '已安装的应用', '管理此设备上安装的应用'))}
    ${wcard(wrow('rActive', '默认应用', '为文件类型和链接选择默认应用'))}
    ${wcard(wrow('plus', '可选功能', '添加或删除 Windows 可选功能'))}
    ${wcard(wrow('rPower', '启动', '管理开机自动启动的应用'))}`;
}

function pgAccount() {
    return `<div class="wtitle">帐户</div>
    ${wcard(`<div class="wprof"><span class="set-avatar big">${ICONS.rAvatar}</span>
        <span class="whero-tx"><b>User</b><i>user@example.com</i></span></div>`)}
    ${wcard(wrow('rInfo', '你的信息', '管理你的帐户信息'))}
    ${wcard(wrow('rLogin', '登录选项', 'Windows Hello、安全密钥、密码、PIN'))}
    ${wcard(wrow('mail', '电子邮件和帐户', '用于电子邮件、日历和联系人的帐户'))}
    ${wcard(wrow('rSync', '同步你的设置', '跨设备同步主题与壁纸', wtoggle(false)))}
    ${wcard(wrow('rBackup', 'Windows 备份', '备份你的文件和设置'))}
    ${wcard(wrow('rUsers', '其他用户', '添加或管理此设备上的其他用户'))}
    <button class="wlink whehelp" data-demo><span class="wrow-ico sm">${ICONS.rHelp}</span>获取帮助</button>`;
}

function pgTime() {
    return `<div class="wtitle">时间和语言</div>
    ${wcard(wrow('clock', '日期和时间', '时区、自动设置时间'))}
    ${wcard(wrow('rGlobe', '语言和区域', '首选语言、区域格式'))}
    ${wcard(wrow('rKeyboard', '键入', '触摸键盘、输入法'))}
    ${wcard(wrow('rSpeech', '语音', '语音识别、语音包'))}`;
}

function pgGaming() {
    return `<div class="wtitle">游戏</div>
    ${wcard(wrow('navGame', 'Xbox 模式', '启用，辅助功能控制器提示'))}
    ${wcard(wrow('rGamebar', 'Game Bar', '控制器和键盘快捷方式'))}
    ${wcard(wrow('rCapture', '摄像', '保存位置、录制首选项'))}
    ${wcard(wrow('game', '游戏模式', '优化电脑以便畅玩'))}`;
}

function pgAccess() {
    return `<div class="wtitle">辅助功能</div>
    ${wsec('视觉')}
    ${wcard(wrow('rFont', '文本大小', ''))}
    ${wcard(wrow('rLight', '视觉效果', '滚动效果、透明度、动画'))}
    ${wcard(wrow('rMouse', '鼠标指针和触控', ''))}
    ${wcard(wrow('rInk', '文本光标', ''))}
    ${wcard(wrow('search', '放大镜', ''))}
    ${wcard(wrow('rColor', '颜色滤镜', ''))}
    ${wcard(wrow('rTheme', '对比度主题', ''))}
    ${wcard(wrow('rSpeech', '讲述人', ''))}
    ${wsec('听觉')}
    ${wcard(wrow('rSound', '音频', '单声道音频、声音通知'))}
    ${wcard(wrow('rInk', '字幕', '字幕样式'))}
    ${wsec('交互')}
    ${wcard(wrow('rSpeech', '语音', '语音访问、语音输入'))}
    ${wcard(wrow('rKeyboard', '键盘', '粘滞键、筛选键'))}
    ${wcard(wrow('rMouse', '鼠标', '鼠标键、指针速度'))}
    ${wcard(wrow('rFocus', '眼睛控制', ''))}`;
}

function pgPrivacy() {
    return `<div class="wtitle">隐私和安全性</div>
    ${wsec('安全性')}
    ${wcard(wrow('rShield', 'Windows 安全中心', '适用于你的设备的防病毒、浏览器、防火墙和网络保护'))}
    ${wcard(wrow('rFindDev', '查找我的设备', '如果你认为设备已丢失，请跟踪设备'))}
    ${wsec('Windows 权限')}
    ${wcard(wrow('rAds', '建议和优惠', '广告 ID、个性化优惠、本地内容、应用启动、设置建议、生产力工具'))}
    ${wcard(wrow('rSpeech', '语音', '用于听写和调控基于语音的交互的在线语音识别'))}
    ${wcard(wrow('rInk', '墨迹书写和键入个性化', '自定义词典、词典中的字词'))}
    ${wcard(wrow('rDiag', '诊断和反馈', '诊断数据、墨迹书写和键入数据、反馈频率'))}
    ${wcard(wrow('search', '搜索', '搜索历史记录、搜索应用、云内容搜索、搜索索引'))}
    ${wsec('应用权限')}
    ${wcard(wrow('rLoc', '位置', ''))}
    ${wcard(wrow('camera', '摄像头', ''))}
    ${wcard(wrow('rMic', '麦克风', ''))}
    ${wcard(wrow('rVoice', '语音激活', ''))}
    ${wcard(wrow('bell', '通知', ''))}
    ${wcard(wrow('rInfo', '帐户信息', ''))}
    ${wcard(wrow('rContacts', '联系人', ''))}
    ${wcard(wrow('calendar', '日历', ''))}
    ${wcard(wrow('rCalls', '电话呼叫', ''))}`;
}

function pgUpdate() {
    return `<div class="wtitle">Windows 更新</div>
    <div class="wupd">
        <span class="wupd-ico">${ICONS.rUpdateBig}<span class="wupd-ok">${ICONS.rCheck}</span></span>
        <span class="whero-tx"><b class="wupd-t">你使用的是最新版本</b><i>上次检查时间: 2026/7/3，10:50</i></span>
        <button class="wbtn" data-demo style="margin-left:auto">检查更新</button>
    </div>
    ${wsec('更多选项')}
    ${wcard(wrow('rMega', '在最新更新可用后立即获取',
        `在推出最新的非安全更新、修复和改进时，成为第一批获知这些更新的人员。${'<button class="wlink" data-demo>了解详细信息</button>'}`,
        `<span class="wtg-lab">关</span>${wtoggle(false)}`))}
    ${wcard(wrow('rPause', '暂停更新', `选择暂停更新的截止日期。${'<button class="wlink" data-demo>了解详细信息</button>'}`,
        `<button class="wbtn2" data-demo><span class="wrow-ico sm">${ICONS.calendar}</span>选取日期</button>`))}
    ${wcard(wrow('rHistory', '更新历史记录', ''))}
    ${wcard(wrow('rAdv', '高级选项', '传递优化、可选更新、活动时间以及其他更新设置'))}
    ${wcard(wrow('rUsers', 'Windows 预览体验计划', '获取 Windows 的预览版本，以分享有关新功能和更新的反馈'))}
    <div class="wnote"><span class="wrow-ico sm ok">${ICONS.rGlobe}</span><span>Windows 更新致力于帮助减少碳排放。</span><button class="wlink" data-demo>了解详细信息</button></div>
    ${wsec('相关支持')}
    ${wcard(`<button class="wrow" data-acc><span class="wrow-ico">${ICONS.rGlobe}</span><span class="wrow-tx"><b>Windows 更新帮助</b></span><span class="wchev up">›</span></button>
        <div class="wacc open" data-accbody>
            ${wlink('轻松卸载有问题的 Windows 更新')}
            ${wlink('轻松安装暂停处理的 Windows 更新')}
            ${wlink('快速修复 Windows 更新错误')}
            ${wlink('暂停更新以在方便的时间操作')}
        </div>`)}
    <button class="wlink whehelp" data-demo><span class="wrow-ico sm">${ICONS.rHelp}</span>获取帮助</button>`;
}

function pgAi() {
    const key = store.get('orcarouter_key', '');
    return `<div class="wtitle">AI 助手</div>
    ${wcard(`<div class="wrow" style="cursor:default"><span class="wrow-ico">${ICONS.navAi}</span>
        <span class="wrow-tx"><b>AI 助手（由 OrcaRouter 驱动）</b>
        <i>通过 OrcaRouter 统一 API 接入多种主流大模型，按实际调用量计费。Built with OrcaRouter。</i></span>
        <button class="wbtn" data-orca>了解更多</button></div>`)}
    ${wcard(`<div class="wcard-h"><b>API Key</b><i>Key 仅保存在本机 localStorage，不会上传，也不会写入仓库。</i></div>
        <div class="wform">
            <input type="password" class="winput" data-aikey placeholder="输入你的 OrcaRouter API Key" value="${esc(key)}" spellcheck="false">
            <div class="wform-row"><button class="wbtn" data-aisave>保存</button><button class="wbtn2" data-aiclear>清除</button>
            <span class="waistat" data-aistat>${key ? '已保存' : '未设置'}</span></div>
        </div>`)}
    ${wcard(`<div class="wcard-h"><b>模型</b><i>默认使用自动路由，也可填写任意模型 ID。</i></div>
        <div class="wform"><input class="winput" data-aimodel value="${esc(store.get('orcarouter_model', 'orcarouter/auto'))}" spellcheck="false"></div>`)}
    ${wcard(`<div class="wcard-h"><b>连接测试</b><i>发送一条测试消息，验证 Key 与接口是否可用。</i></div>
        <div class="wform"><div class="wform-row"><button class="wbtn" data-aitest>发送测试</button></div>
        <div class="wairesult" data-airesult>尚未测试。</div></div>`)}`;
}

const SET_PAGES = {
    home: pgHome, system: pgSystem, bt: pgBt, net: pgNet, personal: pgPersonal,
    apps: pgApps, account: pgAccount, time: pgTime, gaming: pgGaming,
    access: pgAccess, privacy: pgPrivacy, update: pgUpdate, ai: pgAi,
};

function initSettings(root) {
    const page = $('[data-page]', root);
    let cur = 'home';
    function paint(p) {
        cur = p;
        $$('.set-nav', root).forEach(b => b.classList.toggle('active', b.dataset.p === p));
        page.innerHTML = (SET_PAGES[p] || pgHome)();
        page.scrollTop = 0;
    }
    const aiStat = t => { const s = $('[data-aistat]', root); if (s) s.textContent = t; };
    const aiResult = t => { const s = $('[data-airesult]', root); if (s) s.textContent = t; };
    root.addEventListener('click', e => {
        const n = e.target.closest('.set-nav'); if (n) { paint(n.dataset.p); return; }
        if (e.target.closest('[data-back]')) { paint('home'); return; }
        const th = e.target.closest('[data-theme]');
        if (th) { setWallpaper(th.dataset.theme); paint(cur); toast('已应用主题「' + (WALLPAPERS.find(w => w.id === th.dataset.theme) || {}).name + '」'); return; }
        if (e.target.closest('[data-ddmode]')) {
            const q = QS.find(x => x.id === 'theme'); q.on = !q.on;
            renderQS(); applyQS(); paint(cur);
            toast(q.on ? '已切换深色模式' : '已切换浅色模式'); return;
        }
        const tg = e.target.closest('[data-tg]');
        if (tg) {
            tg.classList.toggle('on');
            const lab = tg.previousElementSibling;
            if (lab && lab.classList.contains('wtg-lab')) lab.textContent = tg.classList.contains('on') ? '开' : '关';
            toast('设置已保存（演示）'); return;
        }
        const acc = e.target.closest('[data-acc]');
        if (acc) {
            const b = $('[data-accbody]', root);
            b.classList.toggle('open');
            const c = acc.querySelector('.wchev'); if (c) c.classList.toggle('up');
            return;
        }
        if (e.target.closest('[data-rename]')) {
            const nm = prompt('重命名此电脑：', store.get('pcname', 'PC-202501201810'));
            if (nm && nm.trim()) { store.set('pcname', nm.trim().slice(0, 32)); paint(cur); }
            return;
        }
        if (e.target.closest('[data-orca]')) { window.open('https://www.orcarouter.ai/ref/ref_57e9d042b829968c3b14', '_blank'); return; }
        if (e.target.closest('[data-aisave]')) {
            const k = $('[data-aikey]', root).value.trim();
            if (!k) { aiStat('请先输入 API Key'); return; }
            store.set('orcarouter_key', k); aiStat('已保存到本机'); toast('API Key 已保存到本机'); return;
        }
        if (e.target.closest('[data-aiclear]')) {
            store.set('orcarouter_key', ''); const i = $('[data-aikey]', root); if (i) i.value = '';
            aiStat('已清除'); toast('已清除 API Key'); return;
        }
        if (e.target.closest('[data-aitest]')) { aiTest(); return; }
        if (e.target.closest('[data-demo]')) { toast('演示版本暂未实现此功能'); return; }
    });
    const sq = $('[data-sq]', root);
    sq.addEventListener('input', () => {
        const q = sq.value.trim().toLowerCase();
        $$('.wrow', page).forEach(r => {
            r.style.display = (!q || r.textContent.toLowerCase().includes(q)) ? '' : 'none';
        });
    });
    async function aiTest() {
        const key = store.get('orcarouter_key', '');
        if (!key) { aiResult('请先保存 API Key。'); return; }
        const model = ($('[data-aimodel]', root).value || '').trim() || 'orcarouter/auto';
        store.set('orcarouter_model', model);
        aiResult('请求中…');
        try {
            const r = await fetch('https://api.orcarouter.ai/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
                body: JSON.stringify({ model, messages: [{ role: 'user', content: '你好，请用一句话介绍你自己。' }] }),
            });
            const j = await r.json().catch(() => ({}));
            if (!r.ok) aiResult('失败 ' + r.status + '：' + String((j.error && j.error.message) || JSON.stringify(j)).slice(0, 200));
            else aiResult('成功：' + String((j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || JSON.stringify(j)).slice(0, 300));
        } catch (err) { aiResult('网络错误：' + err.message); }
    }
    paint('home');
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
    setWallpaper(store.get('wallpaper', 'ribbon'));
    const sav = $('#smAvatar'); if (sav) sav.innerHTML = ICONS.rAvatar;
    setTimeout(() => toast('欢迎来到 Windows 12 网页版 🎉', '🐭'), 900);
}
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
