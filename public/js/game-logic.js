/**
 * カードDOMの生成
 */
function createCardElement(data, withEvents = true) {
    if (!data) return document.createElement('div');
    const el = document.createElement('div'); el.id = data.id || ""; el.className = 'card';
    
    if (data.color) {
        const colorKey = COLORS[data.color] || 'white';
        el.classList.add('border-' + colorKey);
    }
    if (data.type === 'oshi') el.classList.add('oshi-card');

    const nameSpan = document.createElement('span');
    nameSpan.innerText = data.name || ""; 
    el.appendChild(nameSpan);

    el.classList.add(data.isFaceUp !== false ? 'face-up' : 'face-down');

    if (data.type === 'holomen' || data.type === 'oshi') {
        if (data.color) {
            const clDiv = document.createElement('div'); clDiv.className = 'card-color-icon'; 
            clDiv.style.background = COLORS[data.color] || 'white'; el.appendChild(clDiv);
        }
        if (data.type === 'holomen') {
            const currentHp = data.currentHp !== undefined ? data.currentHp : data.hp;
            const hpDiv = document.createElement('div'); hpDiv.className = 'card-hp'; hpDiv.id = `hp-display-${data.id}`;
            hpDiv.innerText = currentHp || ""; el.appendChild(hpDiv);
            if (data.bloom) {
                const bl = document.createElement('div'); bl.className = 'card-bloom'; bl.innerText = data.bloom.charAt(0); el.appendChild(bl);
            }
            if (data.baton !== undefined) {
                const bDiv = document.createElement('div'); bDiv.className = 'card-baton';
                for(let i=0; i<data.baton; i++) { const d=document.createElement('div'); d.className='baton-dot'; bDiv.appendChild(d); }
                el.appendChild(bDiv);
            }
        }
    }
    el.cardData = data;
    if (withEvents) setupCardEvents(el);
    return el;
}

/**
 * 拡大表示 (完全統合版)
 */
function openZoom(cardData, cardElement = null) {
    if (!cardData || (cardElement && cardElement.classList.contains('face-down') && cardElement.dataset.zoneId === 'life-zone')) return;
    
    const zoomOuter = document.getElementById('zoom-outer');
    const contentInner = document.querySelector('.zoom-content-inner');
    if (!zoomOuter || !contentInner) return;

    zoomOuter.className = 'zoom-outer-container';
    const colorKey = COLORS[cardData.color] || 'white';
    zoomOuter.classList.add('border-' + colorKey);
    const colorCode = COLORS[cardData.color] || 'white';

    if (cardData.type === 'oshi') {
        zoomOuter.classList.add('oshi-zoom');
        const skillsHtml = (cardData.skills || []).map((s) => {
            const isSP = s.name.includes("SP");
            const costIcons = (s.cost || []).map(() => `<div class="cost-dot-small" style="background: #9b59b6;"></div>`).join('');
            return `<div class="oshi-skill-bar ${isSP ? 'oshi-sp' : 'oshi-normal'}">
                <div class="oshi-skill-header"><span class="oshi-skill-label">${s.name}</span><div class="oshi-skill-cost">${costIcons}</div></div>
                <div class="oshi-skill-text">${s.text || ""}</div></div>`;
        }).join('');
        contentInner.innerHTML = `<div class="oshi-zoom-layout"><div class="oshi-skill-container">${skillsHtml}</div>
            <div class="zoom-oshi-name">${cardData.name}</div><div class="zoom-oshi-right-bottom"><div class="zoom-oshi-life-label">LIFE</div>
            <div class="zoom-oshi-life">${cardData.hp || 0}</div><div class="zoom-oshi-color-large" style="background: ${colorCode};"></div></div></div>`;
    } else {
        const isSpec = (myRole === 'spectator');
        let attachedAyles = []; // エール判定
        const hpControlsHtml = (!isSpec && cardData.type === 'holomen') ? `<div class="zoom-hp-controls-inline"><button class="btn-zoom-hp-inline minus" onclick="changeHp('${cardData.id}', -10)">-</button><button class="btn-zoom-hp-inline plus" onclick="changeHp('${cardData.id}', 10)">+</button></div>` : "";
        const skillsHtml = (cardData.skills || []).map((s) => {
            let leftContent = ""; let showDamage = false;
            if (s.type === 'gift') leftContent = `<div class="effect-label label-gift">G ギフト</div>`;
            else if (s.type === 'bloom') leftContent = `<div class="effect-label label-bloom-effect">B ブルーム</div>`;
            else if (s.type === 'collab') leftContent = `<div class="effect-label label-collab-effect">C コラボ</div>`;
            else { showDamage = true; const costIcons = (s.cost || []).map(c => `<div class="cost-dot-small" style="background: ${COLORS[c] || '#ddd'};"></div>`).join(''); leftContent = costIcons; }
            const skillText = (s.text === "なし" || !s.text) ? "" : s.text;
            return `<div class="skill-box"><div class="skill-top-row"><div class="skill-label-container">${leftContent}</div><div class="skill-name-container-center"><span class="skill-name-text">${s.name}</span></div><div class="skill-damage-text">${showDamage ? (s.damage || "") : ""}</div></div>${skillText ? `<div class="skill-text-detail">${skillText}</div>` : ""}</div>`;
        }).join('');
        contentInner.innerHTML = `<div class="zoom-name-center">${cardData.name}</div><div class="zoom-top-right-group"><div class="zoom-color-icon-large" style="background: ${colorCode};"></div><div class="zoom-hp-container-row">${hpControlsHtml}<div class="zoom-hp-display" id="zoom-hp-val">HP ${cardData.currentHp || cardData.hp || 0}</div></div></div><div class="zoom-main-content">${skillsHtml}</div>`;
    }
    document.getElementById('zoom-modal').style.display = 'flex';
}
