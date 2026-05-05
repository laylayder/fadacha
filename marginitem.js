/* marginitem.js */

/* ════════════════════════════════════
    資料
════════════════════════════════════ */
const INDEX_CONTRACTS = {
  big:   { multiplier: 200, initPerLot: 526000, maintPerLot: 403000, settlePerLot: 389000 },
  small: { multiplier: 50,  initPerLot: 131500, maintPerLot: 100750, settlePerLot: 97250  },
  micro: { multiplier: 10,  initPerLot: 26300,  maintPerLot: 20150,  settlePerLot: 19450  }
};

// 個股期保證金級距比例
const TIERS = {
  1: { settle: 0.10,   maint: 0.1035, init: 0.135  },
  2: { settle: 0.12,   maint: 0.1242, init: 0.162  },
  3: { settle: 0.15,   maint: 0.1553, init: 0.2025 }
};

const STOCKS = [
  {code:"2330", name:"台積電",     mult:1000, tier:1},
  {code:"2317", name:"鴻海",       mult:2000, tier:1},
  {code:"2454", name:"聯發科",     mult:1000, tier:1},
  {code:"2382", name:"廣達",       mult:2000, tier:2},
  {code:"2303", name:"聯電",       mult:2000, tier:1},
  {code:"2881", name:"富邦金",     mult:2000, tier:1},
  {code:"2882", name:"國泰金",     mult:2000, tier:1},
  {code:"2886", name:"兆豐金",     mult:2000, tier:1},
  {code:"2891", name:"中信金",     mult:2000, tier:1},
  {code:"2884", name:"玉山金",     mult:2000, tier:1},
  {code:"2892", name:"第一金",     mult:2000, tier:1},
  {code:"2885", name:"元大金",     mult:2000, tier:1},
  {code:"5880", name:"合庫金",     mult:2000, tier:1},
  {code:"2883", name:"開發金",     mult:2000, tier:1},
  {code:"2887", name:"台新金",     mult:2000, tier:1},
  {code:"2412", name:"中華電",     mult:2000, tier:1},
  {code:"3045", name:"台灣大",     mult:2000, tier:1},
  {code:"4904", name:"遠傳",       mult:2000, tier:1},
  {code:"2002", name:"中鋼",       mult:2000, tier:1},
  {code:"1301", name:"台塑",       mult:2000, tier:1},
  {code:"1303", name:"南亞",       mult:2000, tier:1},
  {code:"1326", name:"台化",       mult:2000, tier:1},
  {code:"6505", name:"台塑化",     mult:2000, tier:1},
  {code:"2308", name:"台達電",     mult:1000, tier:1},
  {code:"2395", name:"研華",       mult:1000, tier:1},
  {code:"3711", name:"日月光投控", mult:2000, tier:1},
  {code:"2379", name:"瑞昱",       mult:1000, tier:1},
  {code:"2357", name:"華碩",       mult:1000, tier:1},
  {code:"2353", name:"宏碁",       mult:2000, tier:1},
  {code:"2376", name:"技嘉",       mult:2000, tier:2},
  {code:"2324", name:"仁寶",       mult:2000, tier:1},
  {code:"2356", name:"英業達",     mult:2000, tier:1},
  {code:"2327", name:"國巨",       mult:1000, tier:2},
  {code:"2344", name:"華邦電",     mult:2000, tier:1},
  {code:"3034", name:"聯詠",       mult:1000, tier:2},
  {code:"2408", name:"南亞科",     mult:2000, tier:2},
  {code:"2337", name:"旺宏",       mult:2000, tier:2},
  {code:"8046", name:"南電",       mult:2000, tier:2},
  {code:"3008", name:"大立光",     mult:1000, tier:1},
  {code:"2301", name:"光寶科",     mult:2000, tier:1},
  {code:"2385", name:"群光",       mult:2000, tier:1},
  {code:"4938", name:"和碩",       mult:2000, tier:1},
  {code:"2474", name:"可成",       mult:2000, tier:2},
  {code:"1216", name:"統一",       mult:2000, tier:1},
  {code:"2912", name:"統一超",     mult:1000, tier:1},
  {code:"1101", name:"台泥",       mult:2000, tier:1},
  {code:"2207", name:"和泰車",     mult:1000, tier:1},
  {code:"2105", name:"正新",       mult:2000, tier:1},
  {code:"9910", name:"豐泰",       mult:2000, tier:2},
  {code:"2401", name:"凌陽",       mult:2000, tier:2},
  {code:"6669", name:"緯穎",       mult:1000, tier:2},
];

/* ════════════════════════════════════
    狀態
════════════════════════════════════ */
let productMode = 'index';
let stockMode = 'preset';
let selectedContract = 'big';
let selectedStock = STOCKS[0];
let direction = 'long';

/* ════════════════════════════════════
    商品類別切換
════════════════════════════════════ */
function switchProduct(p) {
  productMode = p;
  document.getElementById('ptab-index').classList.toggle('active', p === 'index');
  document.getElementById('ptab-stock').classList.toggle('active', p === 'stock');
  document.getElementById('panel-index').style.display = p === 'index' ? '' : 'none';
  document.getElementById('panel-stock').style.display = p === 'stock' ? '' : 'none';
  document.getElementById('ref-index-card').style.display = p === 'index' ? '' : 'none';
  document.getElementById('ref-stock-card').style.display = p === 'stock' ? '' : 'none';

  const isStock = p === 'stock';
  document.getElementById('label-entry').textContent   = isStock ? '成交股價' : '成交點位';
  document.getElementById('label-current').textContent = isStock ? '目前股價' : '目前點位';
  document.getElementById('unit-entry').textContent    = isStock ? '元' : '點';
  document.getElementById('unit-current').textContent  = isStock ? '元' : '點';
  
  // 切換時給定合理的初始數值
  document.getElementById('entryPrice').value  = isStock ? '1000' : '41000';
  document.getElementById('currentPrice').value = isStock ? '950' : '39000';
  
  if (isStock && selectedStock) {
    updateSelectedBar();
  }
  calc();
}

/* ════════════════════════════════════
    個股子模式切換
════════════════════════════════════ */
function switchStockMode(m) {
  stockMode = m;
  document.getElementById('stab-preset').classList.toggle('active', m === 'preset');
  document.getElementById('stab-manual').classList.toggle('active', m === 'manual');
  document.getElementById('spanel-preset').style.display = m === 'preset' ? '' : 'none';
  document.getElementById('spanel-manual').style.display = m === 'manual' ? '' : 'none';
  calc();
}

/* ════════════════════════════════════
    指數合約選擇
════════════════════════════════════ */
function selectContract(key) {
  selectedContract = key;
  ['big', 'small', 'micro'].forEach(k => {
    document.getElementById('card-' + k).classList.toggle('active', k === key);
  });
  calc();
}

/* ════════════════════════════════════
    方向切換
════════════════════════════════════ */
function selectDir(d) {
  direction = d;
  document.getElementById('btn-long').classList.toggle('active', d === 'long');
  document.getElementById('btn-short').classList.toggle('active', d === 'short');
  const badge = document.getElementById('dir-badge');
  badge.textContent = d === 'long' ? '做多' : '放空';
  badge.className = 'dir-badge ' + d;
  calc();
}

/* ════════════════════════════════════
    個股搜尋與選取列表
════════════════════════════════════ */
function tierLabel(t) {
  return '級距' + t;
}

function renderList(items) {
  const el = document.getElementById('stock-list');
  if (!items.length) {
    el.innerHTML = '<div class="no-result">查無結果，可切換至「手動輸入」模式</div>';
    return;
  }
  el.innerHTML = items.map(s => `
    <div class="stock-item${s.code === selectedStock.code ? ' selected' : ''}" onclick="selectStock('${s.code}')">
      <span class="stock-code">${s.code}</span>
      <span class="stock-name">${s.name}</span>
      <span class="stock-init">${tierLabel(s.tier)} · ${s.mult.toLocaleString()}股</span>
    </div>`).join('');
}

function filterList() {
  const q = document.getElementById('search').value.trim().toLowerCase();
  renderList(q ? STOCKS.filter(s => s.code.includes(q) || s.name.includes(q)) : STOCKS);
}

function selectStock(code) {
  selectedStock = STOCKS.find(s => s.code === code);
  updateSelectedBar();
  filterList();
  
  // 選股後自動嘗試拉取最新股價
  fetchRealtimePrice(true);
}

// 抽取更新資訊欄的邏輯
function updateSelectedBar() {
  if (!selectedStock) return;
  const t = TIERS[selectedStock.tier];
  const entryPrice = parseFloat(document.getElementById('entryPrice').value) || 0;
  const initAmt = Math.round(entryPrice * selectedStock.mult * t.init);
  
  document.getElementById('sel-label').textContent = selectedStock.code + ' ' + selectedStock.name;
  document.getElementById('sel-margin').textContent =
    '　' + tierLabel(selectedStock.tier) + '・' + selectedStock.mult.toLocaleString() + '股／口' +
    (entryPrice > 0 ? '・原始保證金約 ' + initAmt.toLocaleString() + ' 元' : '');
  document.getElementById('selected-bar').style.display = 'flex';
}

/* ════════════════════════════════════
    API 擷取台股即時股價 (FinMind API)
════════════════════════════════════ */
async function fetchRealtimePrice(isAuto = false) {
  if (!selectedStock || productMode !== 'stock' || stockMode !== 'preset') return;

  const btn = document.getElementById('btn-fetch-price');
  btn.textContent = '⚡ 讀取中...';
  btn.disabled = true;

  const today = new Date();
  const rawStartDate = new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000);
  const startDate = rawStartDate.toISOString().split('T')[0];

  const url = `https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockPrice&data_id=${selectedStock.code}&start_date=${startDate}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('FinMind API 回應異常');

    const resData = await response.json();
    
    if (resData && resData.data && resData.data.length > 0) {
      const latestData = resData.data[resData.data.length - 1];
      const fetchedPrice = latestData.close;

      if (fetchedPrice) {
        document.getElementById('entryPrice').value = fetchedPrice;
        document.getElementById('currentPrice').value = fetchedPrice;
        
        updateSelectedBar();
        calc();

        btn.textContent = `✅ $${fetchedPrice}`;
        btn.style.backgroundColor = '#34C759';
      } else {
        throw new Error('未取得有效股價');
      }
    } else {
      throw new Error('查無個股資料');
    }
  } catch (error) {
    console.error('FinMind 抓取股價失敗：', error);
    btn.textContent = '❌ 擷取失敗';
    btn.style.backgroundColor = '#FF3B30';
    
    if (!isAuto) {
      alert('無法取得即時股價，可能已達 API 流量限制。請手動輸入股價。');
    }
  }

  setTimeout(() => {
    btn.textContent = '🔄 擷取即時股價';
    btn.style.backgroundColor = '';
    btn.disabled = false;
  }, 3000);
}

/* ════════════════════════════════════
    取得保證金與乘數（計算核心）
════════════════════════════════════ */
function getMarginsAndMultiplier(entry, current) {
  if (productMode === 'index') {
    const c = INDEX_CONTRACTS[selectedContract];
    return { 
      init: c.initPerLot, 
      maint: c.maintPerLot, 
      settle: c.settlePerLot, 
      mult: c.multiplier 
    };
  }

  if (stockMode === 'preset') {
    const s = selectedStock;
    const t = TIERS[s.tier];
    const activeCurrentPrice = current > 0 ? current : entry;
    
    return {
      init:   Math.round(entry * s.mult * t.init),
      maint:  Math.round(activeCurrentPrice * s.mult * t.maint),
      settle: Math.round(activeCurrentPrice * s.mult * t.settle),
      mult:   s.mult
    };
  }

  return {
    init:   parseFloat(document.getElementById('m-init').value)   || 0,
    maint:  parseFloat(document.getElementById('m-maint').value)  || 0,
    settle: parseFloat(document.getElementById('m-settle').value) || 0,
    mult:   parseInt(document.getElementById('m-mult').value)     || 2000
  };
}

/* ════════════════════════════════════
    格式化工具
════════════════════════════════════ */
function fmt(n) { return Math.round(n).toLocaleString('zh-TW'); }

/* ════════════════════════════════════
    主計算邏輯
════════════════════════════════════ */
function calc() {
  const entry = parseFloat(document.getElementById('entryPrice').value) || 0;
  const current = parseFloat(document.getElementById('currentPrice').value) || 0;
  
  if (productMode === 'stock' && stockMode === 'preset') {
    updateSelectedBar();
  }

  const m = getMarginsAndMultiplier(entry, current);
  const qty = Math.max(1, parseInt(document.getElementById('qty').value) || 1);
  const equity = parseFloat(document.getElementById('equity').value) || 0;

  const initTotal   = m.init   * qty;
  const maintTotal  = m.maint  * qty;
  const settleTotal = m.settle * qty;
  
  const diff = direction === 'long' ? (current - entry) : (entry - current);
  const pnl  = diff * m.mult * qty;
  const effectiveEquity = equity + pnl;
  
  const ratio = maintTotal > 0 ? (effectiveEquity / maintTotal) * 100 : 0;

  document.getElementById('r-init').textContent   = fmt(initTotal)   + ' 元';
  document.getElementById('r-maint').textContent  = fmt(maintTotal)  + ' 元';
  document.getElementById('r-settle').textContent = fmt(settleTotal) + ' 元';

  const pnlEl = document.getElementById('r-pnl');
  pnlEl.textContent = (pnl >= 0 ? '+' : '') + fmt(pnl) + ' 元';
  pnlEl.className = 'metric-cell-value ' + (pnl > 0 ? 'success' : pnl < 0 ? 'danger' : '');

  const ratioEl = document.getElementById('r-ratio');
  ratioEl.textContent = ratio.toFixed(1) + '%';

  let statusClass, statusText, barColor, infoText;
  const dirLabel = direction === 'long' ? '做多' : '放空';

  if (ratio >= 130) {
    statusClass = 'success'; statusText = '健康'; barColor = '#34C759';
    infoText = `<strong>${dirLabel}部位安全。</strong> 維持率 <strong>${ratio.toFixed(1)}%</strong>，高於追繳線，有效權益 ${fmt(effectiveEquity)} 元。`;
  } else if (ratio >= 100) {
    statusClass = 'warning'; statusText = '注意'; barColor = '#FF9500';
    infoText = `<strong>接近危險區。</strong> ${dirLabel}維持率 <strong>${ratio.toFixed(1)}%</strong>，已低於 130% 警戒線。建議補繳或減少部位，避免觸及追繳線。`;
  } else {
    statusClass = 'danger'; statusText = '追繳'; barColor = '#FF3B30';
    const shortfall = initTotal - effectiveEquity;
    infoText = `<strong>需要追繳！</strong> ${dirLabel}維持率 <strong>${ratio.toFixed(1)}%</strong>，低於 100%。需補繳約 <strong>${fmt(Math.max(0, shortfall))} 元</strong>，使帳戶回到原始保證金（${fmt(initTotal)} 元）。`;
  }

  document.getElementById('status-tag').className   = 'status-tag ' + statusClass;
  document.getElementById('status-tag').textContent = statusText;
  ratioEl.className = 'metric-cell-value big ' + statusClass;

  const barPct = Math.min(100, Math.max(0, ratio / 2));
  document.getElementById('ratio-bar').style.width      = barPct.toFixed(1) + '%';
  document.getElementById('ratio-bar').style.background = barColor;
  document.getElementById('bar-label').textContent       = '維持率 ' + ratio.toFixed(1) + '%';
  document.getElementById('info-box').innerHTML          = infoText;
}

/* ════════════════════════════════════
    初始化執行
════════════════════════════════════ */
renderList(STOCKS);
selectStock('2330');