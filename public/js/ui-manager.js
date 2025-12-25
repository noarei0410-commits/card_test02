/**
 * UIマネージャー
 * 画面遷移（ハブ / デッキ構築 / 対戦フィールド）およびモーダルの表示管理を担当します。
 */

/**
 * ページ切り替え関数
 * すべてのメインコンテナを一旦非表示にし、指定されたページのみを確実に表示します。
 * @param {string|null} pageId - 表示したい要素のID。nullの場合は対戦フィールドを表示します。
 */
function showPage(pageId) {
    // 実行の都度、最新のDOM要素を取得（要素の取得漏れによる表示バグを防止）
    const pages = {
        hub: document.getElementById('hub-page'),
        builder: document.getElementById('card-list-page'),
        gameUI: document.getElementById('ui-layer'),
        field: document.getElementById('field-container'),
        hand: document.getElementById('hand-container')
    };

    // 1. 全てのページ要素を「完全に非表示」にする
    // インラインスタイルで !important を適用し、CSSファイル側の設定を強制上書きします
    Object.values(pages).forEach(el => {
        if (el) {
            el.style.setProperty('display', 'none', 'important');
        }
    });

    // 2. 指定されたページのみを表示
    if (pageId === 'hub-page') {
        // ハブ画面（ロビー）を表示
        if (pages.hub) {
            pages.hub.style.setProperty('display', 'flex', 'important');
        }
    } 
    else if (pageId === 'card-list-page') {
        // デッキ構築画面を表示
        if (pages.builder) {
            pages.builder.style.setProperty('display', 'flex', 'important');
        }
        
        // ライブラリの表示内容をリフレッシュ（deck-builder.js側の関数）
        if (typeof updateLibrary === 'function') {
            updateLibrary();
        }
    } 
    else {
        // pageId が null またはそれ以外の場合は「対戦フィールド」を表示
        // 対戦画面は 上部UI、中央フィールド、下部手札の3層で構成
        if (pages.gameUI) pages.gameUI.style.setProperty('display', 'flex', 'important');
        if (pages.field) pages.field.style.setProperty('display', 'flex', 'important');
        if (pages.hand) pages.hand.style.setProperty('display', 'block', 'important');

        // フィールド表示後、カードの配置を計算し直す（game-logic.js側の関数）
        if (typeof repositionCards === 'function') {
            setTimeout(repositionCards, 50); 
        }
    }
}

/**
 * モーダル管理（拡大表示・デッキ確認）
 */
const zoomModal = document.getElementById('zoom-modal');
const deckModal = document.getElementById('deck-inspection-modal');

/**
 * すべてのモーダル（拡大画面や山札確認画面）を閉じる
 */
function closeAllModals() {
    if (zoomModal) zoomModal.style.display = 'none';
    if (deckModal) deckModal.style.display = 'none';
}

/**
 * 山札やアーカイブの確認モーダルを開く
 * @param {string} title - モーダルのヘッダーに表示するタイトル
 */
function openDeckModal(title) {
    const titleEl = document.getElementById('inspection-title');
    if (titleEl) titleEl.innerText = title;
    if (deckModal) deckModal.style.display = 'flex';
}

/**
 * キーボードイベント
 * エスケープキーで開いているモーダルを閉じる
 */
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

/**
 * アプリケーション起動時の初期化
 */
window.addEventListener('DOMContentLoaded', () => {
    // 起動時は必ずハブ画面（hub-page）からスタートする
    showPage('hub-page');
    
    // 拡大表示モーダルの背景部分をクリックした時に閉じる設定
    if (zoomModal) {
        zoomModal.onclick = (e) => {
            if (e.target === zoomModal) {
                zoomModal.style.display = 'none';
            }
        };
    }
});
