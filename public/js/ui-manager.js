function showPage(pageId) {
    const pages = {
        hub: document.getElementById('hub-page'),
        library: document.getElementById('library-page'), // ライブラリ画面
        builder: document.getElementById('builder-page'), // 構築画面
        gameUI: document.getElementById('ui-layer'),
        field: document.getElementById('field-container'),
        hand: document.getElementById('hand-container')
    };

    // すべて隠す
    Object.values(pages).forEach(el => {
        if (el) el.style.setProperty('display', 'none', 'important');
    });

    // 遷移先表示
    if (pageId === 'hub-page') {
        if (pages.hub) pages.hub.style.setProperty('display', 'flex', 'important');
    } 
    else if (pageId === 'library-page') {
        if (pages.library) {
            pages.library.style.setProperty('display', 'block', 'important');
            renderFullLibrary(); // 閲覧専用の描画
        }
    }
    else if (pageId === 'builder-page') {
        if (pages.builder) {
            pages.builder.style.setProperty('display', 'block', 'important');
            updateLibrary(); // 構築用の描画
        }
    }
    else {
        // 対戦フィールド
        if (pages.gameUI) pages.gameUI.style.setProperty('display', 'flex', 'important');
        if (pages.field) pages.field.style.setProperty('display', 'flex', 'important');
        if (pages.hand) pages.hand.style.setProperty('display', 'block', 'important');
        if (typeof repositionCards === 'function') setTimeout(repositionCards, 50);
    }
}

/**
 * ルーム参加と動線の回復
 */
function joinRoom(role) {
    const roomId = document.getElementById('roomIdInput').value.trim();
    if (!roomId) return alert("ルームIDを入力してください");

    if (typeof socket !== 'undefined') {
        socket.emit('joinRoom', { roomId, role });
        document.getElementById('display-room-id').innerText = roomId;

        if (role === 'player') {
            showPage('builder-page'); // プレイヤーは構築画面へ
        } else {
            showPage(null); // 観戦者は直接フィールドへ
        }
    }
}
