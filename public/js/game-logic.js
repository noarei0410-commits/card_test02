/**
 * カードDOMの生成
 */
function createCardElement(data, withEvents = true) {
    if (!data) return document.createElement('div');
    const el = document.createElement('div'); el.id = data.id || ""; el.className = 'card';
    
    // 種別クラスの付与
    if (data.type === 'oshi') el.classList.add('oshi-card');
    if (data.type === 'ayle') el.classList.add('ayle-card');
    if (data.type === 'support') el.classList.add('support-card');

    // 属性色の適用
    if (data.type !== 'support') {
        const colorVal = data.color || (data.type === 'ayle' ? data.name.charAt(0) : null);
        const colorKey = COLORS[colorVal] || 'white';
        el.classList.add('border-' + colorKey);
    }

    // カード内部デザインの分岐
    if (data.type === 'ayle') {
        const centerIcon = document.createElement('div');
        centerIcon.className = 'ayle-center-icon';
        centerIcon.style.background = COLORS[data.name.charAt(0)] || 'white';
        el.appendChild(centerIcon);
    } else {
        const nameSpan = document.createElement('span');
        nameSpan.innerText = data.name || ""; 
        el.appendChild(nameSpan);

        if (data.type === 'support' && data.category) {
            const catDiv = document.createElement('div');
            catDiv.className = 'card-support-category-initial';
            catDiv.innerText = data.category.charAt(0).toUpperCase();
            el.appendChild(catDiv);
        }
    }

    el.classList.add(data.isFaceUp !== false ? 'face-up' : 'face-down');
    if (data.isRotated) el.classList.add('rotated');

    // ホロメン専用ステータス
    if (data.type === 'holomen') {
        const currentHp = data.currentHp !== undefined ? data.currentHp : data.hp;
        const hpDiv = document.createElement('div'); 
        hpDiv.className = 'card-hp'; hpDiv.id = `hp-display-${data.id}`;
        hpDiv.innerText = currentHp || ""; el.appendChild(hpDiv);

        if (data.bloom) {
            const bl = document.createElement('div'); bl.className = 'card-bloom'; 
            bl.innerText = data.bloom.charAt(0); el.appendChild(bl);
        }
        if (data.baton !== undefined) {
            const bDiv = document.createElement('div'); bDiv.className = 'card-baton';
            for(let i=0; i<data.baton; i++) { 
                const d=document.createElement('div'); d.className='baton-dot'; bDiv.appendChild(d); 
            }
            el.appendChild(bDiv);
        }
    }

    if ((data.type === 'holomen' || data.type === 'oshi') && data.color) {
        const clDiv = document.createElement('div'); 
        clDiv.className = 'card-color-icon'; 
        clDiv.style.background = COLORS[data.color] || 'white';
        el.appendChild(clDiv);
    }

    el.cardData = data;
    if (withEvents) setupCardEvents(el);
    return el;
}

/**
 * 拡大表示 (ズーム)
 */
function openZoom(cardData, cardElement = null) {
    if (!cardData || (cardElement && cardElement.classList.contains('face-down') && cardElement.dataset.zoneId === 'life-zone')) return;
    
    const zoomOuter = document.getElementById('zoom-outer');
    const contentInner = document.querySelector('.zoom-content-inner');
    if (!zoomOuter || !contentInner) return;

    zoomOuter.className = 'zoom-outer-container';

    // サポート・エール・推し・ホロメンそれぞれのHTML生成（省略：既存ロジックを維持）
    // ... 

    zoomModal.style.display = 'flex';
}

/**
 * カードイベント設定
 */
function setupCardEvents(el) {
    el.onpointerdown = (e) => {
        startX = e.clientX; startY = e.clientY; potentialZoomTarget = el;
        if (myRole === 'spectator' || el.dataset.zoneId === 'archive') return;
        isDragging = true; dragStarted = false; currentDragEl = el; el.setPointerCapture(e.pointerId);
        el.oldZoneId = el.dataset.zoneId || "";
        currentStack = (el.dataset.zoneId) ? Array.from(document.querySelectorAll('.card')).filter(c => c.dataset.zoneId === el.dataset.zoneId) : [el];
        currentStack.sort((a,b) => (parseInt(a.style.zIndex)||0)-(parseInt(b.style.zIndex)||0));
        const rect = el.getBoundingClientRect(); offsetX = e.clientX - rect.left; offsetY = e.clientY - rect.top;
        e.stopPropagation();
    };
}

/**
 * 再整列ロジック (ライフゾーンのオフセット配置を含む)
 */
function repositionCards() {
    const zones = document.querySelectorAll('.zone');
    zones.forEach(zone => {
        const cards = Array.from(document.querySelectorAll('.card')).filter(c => c.dataset.zoneId === zone.id);
        if (cards.length === 0) return;

        const rect = zone.getBoundingClientRect();
        const fieldRect = field.getBoundingClientRect();

        cards.forEach((card, index) => {
            card.style.position = 'absolute';
            
            if (zone.id === 'life-zone') {
                // ライフゾーン：縦に少しずつずらして配置
                const offsetX = (rect.width - 82) / 2; // 回転考慮
                const offsetY = 10 + (index * 6);
                card.style.left = (rect.left - fieldRect.left + offsetX) + 'px';
                card.style.top = (rect.top - fieldRect.top + offsetY) + 'px';
            } else {
                // 通常ゾーン：中央配置
                const offsetX = (rect.width - 58) / 2;
                const offsetY = (rect.height - 82) / 2;
                card.style.left = (rect.left - fieldRect.left + offsetX) + 'px';
                card.style.top = (rect.top - fieldRect.top + offsetY) + 'px';
            }
            card.style.zIndex = 100 + index;
        });
    });
}

// pointermove, pointerup ロジック（既存の snapStack 等を維持）
// ...

function changeHp(id, delta) {
    const el = document.getElementById(id);
    if (el && el.cardData) {
        el.cardData.currentHp = Math.max(0, (el.cardData.currentHp || el.cardData.hp || 0) + delta);
        const fhp = document.getElementById(`hp-display-${id}`); if (fhp) fhp.innerText = el.cardData.currentHp;
        socket.emit('updateHp', { id, currentHp: el.cardData.currentHp });
    }
}

function returnToHand(el) {
    if (el.dataset.zoneId === 'life-zone') { if (!confirm("ライフを手札に戻しますか？")) return; }
    socket.emit('returnToHand', { id: el.id });
    el.dataset.zoneId = ""; el.style.position = 'relative'; el.style.left = 'auto'; el.style.top = 'auto';
    el.classList.remove('rotated'); el.classList.add('face-up'); el.classList.remove('face-down');
    handDiv.appendChild(el); repositionCards();
}
