/**
 * UIマネージャー
 * 画面の切り替えと初期化を管理します。
 */

function showPage(pageId) {
    // 取得対象の全ページ要素
    const pages = {
        hub: document.getElementById('hub-page'),
        builder: document.getElementById('card-list-page'),
        gameUI: document.getElementById('ui-layer'),
        field: document.getElementById('field-container'),
        hand: document.getElementById('hand-container')
    };

    // すべての要素を一旦非表示（強制上書き）
    Object.values(pages).forEach(el => {
        if (el) el.style.setProperty('display', 'none', 'important');
    });

    // 指定されたページのみを表示
    if (pageId === 'hub-page') {
        if (pages.hub) pages.hub.style.setProperty('display', 'flex', 'important');
    } 
    else if (pageId === 'card-list-page') {
        if (pages.builder) {
            pages.builder.style.setProperty('display', 'flex', 'important');
            // 構築/ライブラリ画面のデータを更新
            if (typeof updateLibrary === 'function') updateLibrary();
        }
    } 
    else {
        // 対戦画面（pageIdがnull、またはそれ以外の場合）
        if (pages.gameUI) pages.gameUI.style.setProperty('display', 'flex', 'important');
        if (pages.field) pages.field.style.setProperty('display', 'flex', 'important');
        if (pages.hand) pages.hand.style.setProperty('display', 'block', 'important');

        if (typeof repositionCards === 'function') {
            setTimeout(repositionCards, 50); 
        }
    }
}

/**
 * ルーム参加と画面遷移
 */
function joinRoom(role) {
    const roomIdInput = document.getElementById('roomIdInput');
    const roomId = roomIdInput ? roomIdInput.value.trim() : "";

    if (!roomId) {
        alert("ルームIDを入力してください。");
        return;
    }

    // Socket通信が確立されているか確認
    if (typeof socket !== 'undefined') {
        socket.roomId = roomId;
        socket.emit('joinRoom', { roomId, role }); // ルーム参加イベント送信
        
        // 遷移処理：プレイヤーなら構築画面へ、観戦ならフィールドへ
        if (role === 'player') {
            console.log("Moving to Deck Builder...");
            showPage('card-list-page'); // ここで構築画面に遷移
        } else {
            showPage(null); // フィールドへ直接遷移
        }
    } else {
        console.error("Socket communication error.");
    }
}

// 起動時の初期化
window.addEventListener('DOMContentLoaded', () => {
    showPage('hub-page'); // 最初は必ずハブを表示
});
