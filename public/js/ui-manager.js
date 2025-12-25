/**
 * UIマネージャー
 * 画面遷移（ページ切り替え）の完全制御
 */

/**
 * ページ切り替え関数
 * @param {string} pageId - 表示したい要素のID ('hub-page', 'card-list-page', または null)
 */
function showPage(pageId) {
    const pages = {
        hub: document.getElementById('hub-page'),
        builder: document.getElementById('card-list-page'),
        gameUI: document.getElementById('ui-layer'),
        field: document.getElementById('field-container'),
        hand: document.getElementById('hand-container')
    };

    // 1. 全てのページ要素を「非表示」に統一
    Object.values(pages).forEach(el => {
        if (el) el.style.setProperty('display', 'none', 'important');
    });

    // 2. 遷移先に応じた表示処理
    if (pageId === 'hub-page') {
        // 【ハブ画面】を表示
        if (pages.hub) pages.hub.style.setProperty('display', 'flex', 'important');
    } 
    else if (pageId === 'card-list-page') {
        // 【デッキ構築画面】を表示
        if (pages.builder) pages.builder.style.setProperty('display', 'flex', 'important');
        if (typeof updateLibrary === 'function') updateLibrary();
    } 
    else {
        // 【対戦フィールド】を表示 (pageIdがnull、または対戦開始時)
        if (pages.gameUI) pages.gameUI.style.setProperty('display', 'flex', 'important');
        if (pages.field) pages.field.style.setProperty('display', 'flex', 'important');
        if (pages.hand) pages.hand.style.setProperty('block', 'important');

        // 配置の再計算
        if (typeof repositionCards === 'function') {
            setTimeout(repositionCards, 50); 
        }
    }
}

// モーダル管理
const zoomModal = document.getElementById('zoom-modal');
const deckModal = document.getElementById('deck-inspection-modal');

function closeAllModals() {
    if (zoomModal) zoomModal.style.display = 'none';
    if (deckModal) deckModal.style.display = 'none';
}

// 起動時の処理
window.addEventListener('DOMContentLoaded', () => {
    // 確実にハブ画面からスタートさせる
    showPage('hub-page');
});
