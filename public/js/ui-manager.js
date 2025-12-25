/**
 * UIマネージャー
 * 画面遷移、モーダル管理、および全般的な表示制御を担当します。
 */

// ページ要素の取得
const hubPage = document.getElementById('hub-page');
const builderPage = document.getElementById('card-list-page');
const gameUI = document.getElementById('ui-layer');
const fieldContainer = document.getElementById('field-container');
const handContainer = document.getElementById('hand-container');

// モーダル要素の取得
const zoomModal = document.getElementById('zoom-modal');
const deckModal = document.getElementById('deck-inspection-modal');
const deckGrid = document.getElementById('deck-inspection-grid');

/**
 * ページ切り替え管理
 * ハブ画面、デッキ構築画面、および対戦フィールドの表示状態を確実に同期します。
 */
function showPage(pageId) {
    // 1. 全てのメインページ要素を一括で非表示にする
    const pages = [hubPage, builderPage, gameUI, fieldContainer, handContainer];
    pages.forEach(el => {
        if (el) el.style.display = 'none';
    });

    // 2. 指定されたページのみを表示
    if (pageId === 'hub-page') {
        // ハブ画面を表示
        if (hubPage) hubPage.style.display = 'flex';
    } 
    else if (pageId === 'card-list-page') {
        // デッキ構築画面を表示
        if (builderPage) builderPage.style.display = 'flex';
        
        // 構築画面に遷移した際はライブラリ表示をリフレッシュ（deck-builder.js側の関数）
        if (typeof updateLibrary === 'function') {
            updateLibrary();
        }
    } 
    else {
        // pageId が null またはそれ以外の場合は対戦フィールド（ゲーム画面）を表示
        if (gameUI) gameUI.style.display = 'flex';
        if (fieldContainer) fieldContainer.style.display = 'flex';
        
        // 手札コンテナは block で表示
        if (handContainer) handContainer.style.display = 'block';

        // フィールドが表示された際、カードの配置を最新の状態に更新
        if (typeof repositionCards === 'function') {
            setTimeout(repositionCards, 50); 
        }
    }
}

/**
 * 各種モーダルの閉じる処理
 */
function closeAllModals() {
    if (zoomModal) zoomModal.style.display = 'none';
    if (deckModal) deckModal.style.display = 'none';
}

/**
 * デッキ確認用モーダルの表示（中身の生成は socket-handler.js 等で行う）
 */
function openDeckModal(title) {
    const titleEl = document.getElementById('inspection-title');
    if (titleEl) titleEl.innerText = title;
    if (deckModal) deckModal.style.display = 'flex';
}

// エスケープキーでモーダルを閉じるグローバルイベント
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

/**
 * ロード時の初期状態設定
 */
window.addEventListener('DOMContentLoaded', () => {
    // 初期状態はハブ画面を表示
    showPage('hub-page');
    
    // 背景クリックでズームモーダルを閉じる（game-logic.js内でも定義されているが念のため）
    if (zoomModal) {
        zoomModal.onclick = (e) => {
            if (e.target === zoomModal) zoomModal.style.display = 'none';
        };
    }
});
