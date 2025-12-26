/**
 * UIマネージャー
 * 画面遷移（ハブ / デッキ構築 / 対戦フィールド）の完全な排他制御とモーダル管理を担当します。
 */

/**
 * ページ切り替え関数
 * 指定されたページ以外をすべて非表示にし、表示の重なりを物理的に排除します。
 * @param {string|null} pageId - 表示したい要素のID。nullの場合は対戦フィールドを表示します。
 */
function showPage(pageId) {
    // 実行の都度、最新のDOM要素を取得することで、動的な画面更新に対応します
    const pages = {
        hub: document.getElementById('hub-page'),
        builder: document.getElementById('card-list-page'),
        gameUI: document.getElementById('ui-layer'),
        field: document.getElementById('field-container'),
        hand: document.getElementById('hand-container')
    };

    // 1. 全てのメインページコンテナを一旦「完全に非表示」にする
    // インラインスタイルで !important を適用し、CSSファイル側の display 設定を強制的に上書きします
    Object.values(pages).forEach(el => {
        if (el) {
            el.style.setProperty('display', 'none', 'important');
        }
    });

    // 2. 指定されたページのみを有効なレイアウトで表示する
    if (pageId === 'hub-page') {
        // ハブ画面（ルーム選択・ロビー）を表示
        if (pages.hub) {
            pages.hub.style.setProperty('display', 'flex', 'important');
        }
    } 
    else if (pageId === 'card-list-page') {
        // デッキ構築画面を表示
        if (pages.builder) {
            pages.builder.style.setProperty('display', 'flex', 'important');
        }
        
        // 構築画面に切り替わった際、ライブラリの描画をリフレッシュ（deck-builder.js）
        if (typeof updateLibrary === 'function') {
            updateLibrary();
        }
    } 
    else {
        // 対戦フィールドを表示 (pageId が null または対戦開始時)
        // 情報バー、盤面、手札の3つのコンテナをセットで表示
        if (pages.gameUI) pages.gameUI.style.setProperty('display', 'flex', 'important');
        if (pages.field) pages.field.style.setProperty('display', 'flex', 'important');
        if (pages.hand) pages.hand.style.setProperty('display', 'block', 'important');

        // フィールド表示後、カードの物理配置を再計算（game-logic.js）
        if (typeof repositionCards === 'function') {
            setTimeout(repositionCards, 50); 
        }
    }
}

/**
 * モーダル管理（拡大表示 / デッキ・アーカイブ確認）
 */
const zoomModal = document.getElementById('zoom-modal');
const deckModal = document.getElementById('deck-inspection-modal');

/**
 * すべてのモーダル（拡大画面や山札確認画面）を閉じます。
 */
function closeAllModals() {
    if (zoomModal) zoomModal.style.display = 'none';
    if (deckModal) deckModal.style.display = 'none';
}

/**
 * 山札やアーカイブの確認モーダルを開きます。
 * @param {string} title - モーダル上部に表示するタイトル
 */
function openDeckModal(title) {
    const titleEl = document.getElementById('inspection-title');
    if (titleEl) titleEl.innerText = title;
    if (deckModal) deckModal.style.display = 'flex';
}

/**
 * グローバルキーボードイベント
 */
window.addEventListener('keydown', (e) => {
    // Escapeキーが押されたら、現在開いているモーダルをすべて閉じます
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

/**
 * アプリケーションの初期化処理
 */
window.addEventListener('DOMContentLoaded', () => {
    // 起動時は必ず「ハブ画面」からスタートするように設定
    showPage('hub-page');
    
    // 拡大表示モーダルの背景部分をクリックした際に閉じる設定
    if (zoomModal) {
        zoomModal.onclick = (e) => {
            if (e.target === zoomModal) {
                zoomModal.style.display = 'none';
            }
        };
    }
});
