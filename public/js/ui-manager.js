/**
 * UIマネージャー
 * 画面遷移（ハブ / デッキ構築 / 対戦）の完全排他制御
 */

/**
 * ページ切り替え関数
 * @param {string|null} pageId - 表示したい要素のID。nullの場合は対戦フィールドを表示。
 */
function showPage(pageId) {
    console.log("Navigating to:", pageId || "Game Field");

    const pages = {
        hub: document.getElementById('hub-page'),
        builder: document.getElementById('card-list-page'),
        gameUI: document.getElementById('ui-layer'),
        field: document.getElementById('field-container'),
        hand: document.getElementById('hand-container')
    };

    // 1. 全てのメインコンテナを一旦「物理的に非表示」にする
    Object.values(pages).forEach(el => {
        if (el) {
            el.style.setProperty('display', 'none', 'important');
        }
    });

    // 2. 指定されたページのみを表示
    if (pageId === 'hub-page') {
        if (pages.hub) pages.hub.style.setProperty('display', 'flex', 'important');
    } 
    else if (pageId === 'card-list-page') {
        if (pages.builder) {
            pages.builder.style.setProperty('display', 'flex', 'important');
            // デッキ構築画面が表示されたらライブラリを更新
            if (typeof updateLibrary === 'function') updateLibrary();
        }
    } 
    else {
        // 対戦フィールド（ゲーム画面）を表示
        if (pages.gameUI) pages.gameUI.style.setProperty('display', 'flex', 'important');
        if (pages.field) pages.field.style.setProperty('display', 'flex', 'important');
        if (pages.hand) pages.hand.style.setProperty('display', 'block', 'important');

        // カードの再配置を実行
        if (typeof repositionCards === 'function') {
            setTimeout(repositionCards, 50); 
        }
    }
}

/**
 * ルーム参加処理
 * ハブ画面の「対戦する」「観戦する」ボタンから呼び出されます。
 */
function joinRoom(role) {
    const roomIdInput = document.getElementById('roomIdInput');
    const roomId = roomIdInput ? roomIdInput.value.trim() : "";

    if (!roomId) {
        alert("ルームIDを入力してください。");
        return;
    }

    // socket-handler.js で初期化されている socket オブジェクトを使用
    if (typeof socket !== 'undefined') {
        socket.roomId = roomId;
        socket.emit('joinRoom', { roomId, role });
        
        // プレイヤーとして参加ならデッキ構築へ、観戦なら直接フィールドへ
        if (role === 'player') {
            showPage('card-list-page');
        } else {
            showPage(null);
        }
    } else {
        console.error("Socket is not initialized.");
    }
}

/**
 * モーダル管理
 */
const zoomModal = document.getElementById('zoom-modal');

function closeAllModals() {
    if (zoomModal) zoomModal.style.display = 'none';
}

/**
 * 初期化処理
 */
window.addEventListener('DOMContentLoaded', () => {
    // 起動時は必ずハブ画面のみを表示
    showPage('hub-page');
    
    // 拡大モーダルの背景クリックで閉じる
    if (zoomModal) {
        zoomModal.onclick = (e) => {
            if (e.target === zoomModal) zoomModal.style.display = 'none';
        };
    }
});
