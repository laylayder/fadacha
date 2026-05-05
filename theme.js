// 側邊欄開關邏輯
function toggleLog(show) {
    const sidebar = document.getElementById('logSidebar');
    const overlay = document.getElementById('logOverlay');
    
    if (show) {
        overlay.classList.remove('hidden');
        // 稍微延遲讓 hidden 先移除，動畫才跑得出來
        setTimeout(() => {
            overlay.classList.add('active');
            sidebar.classList.add('show');
        }, 10);
    } else {
        sidebar.classList.remove('show');
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 300); // 對應 CSS 的 transition 時間
    }
}

// 深色模式切換邏輯
function toggleTheme() {
    const htmlElement = document.documentElement; // 這就是 <html> 標籤
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme); // 儲存設定
    
    // 更新按鈕圖示
    const btn = document.getElementById('themeBtn');
    if (btn) btn.innerText = newTheme === 'dark' ? '☀️' : '🌙';
}
// 初始化主題
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
});

function toggleGuide(show) {
    const modal = document.getElementById('guideModal');
    if (show) {
        modal.classList.remove('hidden');
        modal.classList.add('flex'); // 確保使用 flex 居中
    } else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}