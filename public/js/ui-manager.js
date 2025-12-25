/**
 * UIマネージャー
 * 画面遷移（ページ切り替え）およびモーダルの表示管理を担当します。
 */

/**
 * ページ切り替え管理
 * ハブ、デッキ構築、対戦フィールドの各ページを排他的に表示します。
 */
function showPage(pageId) {
    // 実行の都度、最新のDOM要素の状態を確認（ハブ画面への干渉を防止）
    const pages = {
        hub: document.getElementById('hub-page'),
        builder: document.getElementById('card-list-page'),
        gameUI: document.getElementById('ui-layer'),
        field: document.getElementById('field-container'),
        hand: document.getElementById('hand-container')
    };

    // 1. すべてのページ要素を一旦「完全に非表示」にする
    // !important を使用して、CSS側の display 設定を強制的に上書きします
    Object.values(pages).forEach(el => {
        if (el) {
            el.style.setProperty('display', 'none', 'important');
        }
    });

    // 2. 指定されたページIdに基づいて、対象の要素のみを表示する
    if (pageId === 'hub-page') {
        // ハブ画面のみを表示
        if (pages.hub) {
            pages.hub.style.setProperty('display', 'flex', 'important');
        }
    } 
    else if (pageId === 'card-list-page') {
        // デッキ構築画面のみを表示
        if (pages.builder) {
            pages.builder.style.setProperty('display', 'flex', 'important');
        }
        
        // 構築画面に切り替わった際、ライブラリの描画をリフレッシュ
        if (typeof updateLibrary === 'function') {
            updateLibrary();
        }
    } 
    else {
        // 対戦フィールドを表示 (pageId が null の場合など)
        // ゲーム画面は情報バー、盤面、手札の3要素で構成される
        if (pages.gameUI) pages.gameUI.style.setProperty('display', 'flex', 'important');
        if (pages.field) pages.field.style.setProperty('display', 'flex', 'important');
        if (pages.hand) pages.hand.style.setProperty('display', 'block', 'important');

        // フィールド表示後、カードの配置を計算し直す
        if (typeof repositionCards === 'function') {
            setTimeout(repositionCards, 50); 
        }
    }
}

/**
 * モーダル管理（ズーム・デッキ確認）
 */
const zoomModal = document.getElementById('zoom-modal');
const deckModal = document.getElementById('deck-inspection-modal');
const deckGrid = document.getElementById('deck-inspection-grid');

/**
 * すべてのモーダルを閉じる
 */
function closeAllModals() {
    if (zoomModal) zoomModal.style.display = 'none';
    if (deckModal) deckModal.style.display = 'none';
}

/**
 * デッキ（またはアーカイブ）確認モーダルを開く
 */
function openDeckModal(title) {
    const titleEl = document.getElementById('inspection-title');
    if (titleEl) titleEl.innerText = title;
    if (deckModal) deckModal.style.display = 'flex';
}

/**
 * キーボード操作イベント
 */
window.addEventListener('keydown', (e) => {
    // Escapeキーで開いているモーダルをすべて閉じる
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

/**
 * DOMロード完了時の初期化
 */
window.addEventListener('DOMContentLoaded', () => {
    // 起動時はハブ画面を最優先で表示
    showPage('hub-page');
    
    // 拡大表示モーダルの背景クリックで閉じる
    if (zoomModal) {
        zoomModal.onclick = (e) => {
            if (e.target === zoomModal) {
                zoomModal.style.display = 'none';
            }
        };
    }
});
