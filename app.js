/**
 * Stock Checker Pro - Core Application Logic
 * Enhanced with Bulletproof Dual-Layer Storage (IndexedDB + localStorage + Cloud Firestore)
 */

// --- Default Preloaded Categories & Fallback Inventory ---
const DEFAULT_MAIN_CATEGORIES = ['SPUN', 'MAGIC COTTON', 'LICHI', 'SIMRAN', 'BHAGALPURI(KHADI)', 'Champion', 'General'];

const DEFAULT_FALLBACK_STOCKS = [
  {
    "id": "stock_z06d7r2x8_1781870016970",
    "name": "L-4021/N.C.GREEN",
    "mainCategory": "MAGIC COTTON",
    "fullBoxes": 3,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T11:53:36.970Z",
    "checked": false
  },
  {
    "id": "stock_tuccj3nwl_1781870137587",
    "name": "L-4023/PISTA",
    "mainCategory": "MAGIC COTTON",
    "fullBoxes": 4,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T11:55:37.587Z",
    "checked": false
  },
  {
    "id": "stock_2r9u542l0_1781870202988",
    "name": "L-2794/LEVANDER",
    "mainCategory": "SPUN",
    "fullBoxes": 2,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T11:57:06.854Z",
    "checked": false
  },
  {
    "id": "stock_syui951i6_1781870299122",
    "name": "L-4025/FIROJI",
    "mainCategory": "MAGIC COTTON",
    "fullBoxes": 2,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T12:35:02.295Z",
    "checked": false
  },
  {
    "id": "stock_yxhsrhsqs_1781870324755",
    "name": "L-4024/LEVENDER",
    "mainCategory": "MAGIC COTTON",
    "fullBoxes": 1,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T11:58:44.755Z",
    "checked": false
  },
  {
    "id": "stock_bhhifqghw_1781870407205",
    "name": "L-4016/LEMON",
    "mainCategory": "MAGIC COTTON",
    "fullBoxes": 2,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T12:00:07.205Z",
    "checked": false
  },
  {
    "id": "stock_c1kklzld8_1781870438140",
    "name": "L-4012/IVERY",
    "mainCategory": "MAGIC COTTON",
    "fullBoxes": 4,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T12:00:38.140Z",
    "checked": false
  },
  {
    "id": "stock_8l361xf55_1781870477356",
    "name": "L-4020/N.PINK",
    "mainCategory": "MAGIC COTTON",
    "fullBoxes": 0,
    "halfBoxes": 1,
    "updatedAt": "2026-06-19T12:01:17.356Z",
    "checked": false
  },
  {
    "id": "stock_8fgu4zbop_1781871935875",
    "name": "L-1273/PINK",
    "mainCategory": "SPUN",
    "fullBoxes": 3,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T12:25:35.875Z",
    "checked": false
  },
  {
    "id": "stock_5x2caxs0f_1781872002147",
    "name": "L-3814/COFFEE",
    "mainCategory": "SPUN",
    "fullBoxes": 0,
    "halfBoxes": 1,
    "updatedAt": "2026-06-19T12:26:42.147Z",
    "checked": false
  },
  {
    "id": "stock_mtu4sgj38_1781872144776",
    "name": "L-2302/N.LEMON",
    "mainCategory": "SPUN",
    "fullBoxes": 3,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T12:29:04.777Z",
    "checked": false
  },
  {
    "id": "stock_50cb0ynpt_1781872369744",
    "name": "L-2385/FIROJI",
    "mainCategory": "SPUN",
    "fullBoxes": 3,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T12:32:49.748Z",
    "checked": false
  },
  {
    "id": "stock_x1b2vrm9z_1781872909490",
    "name": "L-1729/PISTA",
    "mainCategory": "SPUN",
    "fullBoxes": 3,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T12:41:49.490Z",
    "checked": false
  },
  {
    "id": "stock_wyqq738jk_1781873003877",
    "name": "L-37/BLACK",
    "mainCategory": "SPUN",
    "fullBoxes": 4,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T12:43:23.877Z",
    "checked": false
  },
  {
    "id": "stock_2ush7oxl6_1781873033375",
    "name": "L-3776/CHIKOO",
    "mainCategory": "SPUN",
    "fullBoxes": 0,
    "halfBoxes": 1,
    "updatedAt": "2026-06-19T12:43:53.375Z",
    "checked": false
  },
  {
    "id": "stock_klmbkbx6l_1781873087543",
    "name": "L-2151/C.GREEN",
    "mainCategory": "SPUN",
    "fullBoxes": 3,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T12:44:47.543Z",
    "checked": false
  },
  {
    "id": "stock_edj4piy4o_1781873132093",
    "name": "L-3985/D.LEMON",
    "mainCategory": "SPUN",
    "fullBoxes": 2,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T12:45:32.093Z",
    "checked": false
  },
  {
    "id": "stock_0pz26bfkb_1781873165380",
    "name": "L-3980/N.C.GREEN",
    "mainCategory": "SPUN",
    "fullBoxes": 7,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T12:46:05.380Z",
    "checked": false
  },
  {
    "id": "stock_2gyycylga_1781873190709",
    "name": "L-3817/P.BLUE",
    "mainCategory": "SPUN",
    "fullBoxes": 0,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T12:46:30.709Z",
    "checked": false
  },
  {
    "id": "stock_o7o8fabjb_1781873234893",
    "name": "L-3983/N.PINK",
    "mainCategory": "SPUN",
    "fullBoxes": 8,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T12:47:14.893Z",
    "checked": false
  },
  {
    "id": "stock_g8u4qu58c_1781873269676",
    "name": "L-3981/N.PISTA",
    "mainCategory": "SPUN",
    "fullBoxes": 8,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T12:47:49.676Z",
    "checked": false
  },
  {
    "id": "stock_i34eboklo_1781873363643",
    "name": "L-4013/IVERY",
    "mainCategory": "SPUN",
    "fullBoxes": 4,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T12:49:23.643Z",
    "checked": false
  },
  {
    "id": "stock_4js1giqj4_1781874988093",
    "name": "L-1268/GAJRI",
    "mainCategory": "SPUN",
    "fullBoxes": 1,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:16:28.093Z",
    "checked": false
  },
  {
    "id": "stock_wqwxdjw1u_1781875018294",
    "name": "L-3459/CREAM",
    "mainCategory": "SPUN",
    "fullBoxes": 1,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:16:58.294Z",
    "checked": false
  },
  {
    "id": "stock_10y62464s_1781875051394",
    "name": "L-298/N BLUE",
    "mainCategory": "SIMRAN",
    "fullBoxes": 1,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:17:31.394Z",
    "checked": false
  },
  {
    "id": "stock_5ehrpb6hz_1781875194928",
    "name": "L-37/BLACK",
    "mainCategory": "SIMRAN",
    "fullBoxes": 2,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:29:05.786Z",
    "checked": false
  },
  {
    "id": "stock_3qxa84llm_1781875231862",
    "name": "L-2118/RED",
    "mainCategory": "SIMRAN",
    "fullBoxes": 1,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:20:31.862Z",
    "checked": false
  },
  {
    "id": "stock_07qk3gdji_1781875259793",
    "name": "L-2102/BT.GREEN",
    "mainCategory": "SIMRAN",
    "fullBoxes": 1,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:20:59.793Z",
    "checked": false
  },
  {
    "id": "stock_jdoavxxhe_1781875281994",
    "name": "L-1941/WINE",
    "mainCategory": "SIMRAN",
    "fullBoxes": 1,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:21:21.994Z",
    "checked": false
  },
  {
    "id": "stock_ro3rkx87l_1781875310976",
    "name": "L-2146/RAMA",
    "mainCategory": "SIMRAN",
    "fullBoxes": 3,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:21:50.976Z",
    "checked": false
  },
  {
    "id": "stock_zchb5gctl_1781875379091",
    "name": "L-2351/GOLD",
    "mainCategory": "SIMRAN",
    "fullBoxes": 1,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:45:15.598Z",
    "checked": false
  },
  {
    "id": "stock_wuii6121t_1781875730920",
    "name": "L-3817/P.BLUE",
    "mainCategory": "SIMRAN",
    "fullBoxes": 4,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:28:50.920Z",
    "checked": false
  },
  {
    "id": "stock_ajjhj6676_1781875771420",
    "name": "L-1632/RANI",
    "mainCategory": "SIMRAN",
    "fullBoxes": 4,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:29:31.420Z",
    "checked": false
  },
  {
    "id": "stock_ga03ddp0s_1781875792103",
    "name": "L-3814/COFFEE",
    "mainCategory": "SIMRAN",
    "fullBoxes": 3,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:29:52.103Z",
    "checked": false
  },
  {
    "id": "stock_45zb9r544_1781875827836",
    "name": "L-4003/CHIKOO",
    "mainCategory": "BHAGALPURI(KHADI)",
    "fullBoxes": 5,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:30:27.836Z",
    "checked": false
  },
  {
    "id": "stock_yy94bcw2x_1781875856136",
    "name": "L-3785/MEHNDI",
    "mainCategory": "BHAGALPURI(KHADI)",
    "fullBoxes": 3,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:30:56.136Z",
    "checked": false
  },
  {
    "id": "stock_rtax8xf9c_1781875880836",
    "name": "L-3788/P.BLUE",
    "mainCategory": "BHAGALPURI(KHADI)",
    "fullBoxes": 2,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:31:20.836Z",
    "checked": false
  },
  {
    "id": "stock_bde34dqai_1781875905253",
    "name": "L-3789/RAMA",
    "mainCategory": "BHAGALPURI(KHADI)",
    "fullBoxes": 2,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:31:45.253Z",
    "checked": false
  },
  {
    "id": "stock_2hwp1mwp2_1781875923969",
    "name": "L-3790/JAMLI",
    "mainCategory": "BHAGALPURI(KHADI)",
    "fullBoxes": 3,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:32:03.969Z",
    "checked": false
  },
  {
    "id": "stock_psr8som2t_1781875966903",
    "name": "L-3786/D.PINK",
    "mainCategory": "BHAGALPURI(KHADI)",
    "fullBoxes": 2,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:32:46.903Z",
    "checked": false
  },
  {
    "id": "stock_51jywbegy_1781875989370",
    "name": "L-3784/GREY",
    "mainCategory": "BHAGALPURI(KHADI)",
    "fullBoxes": 2,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:33:09.370Z",
    "checked": false
  },
  {
    "id": "stock_o9c34o6f7_1781876012286",
    "name": "L-4067/COFFEE",
    "mainCategory": "BHAGALPURI(KHADI)",
    "fullBoxes": 2,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:33:32.286Z",
    "checked": false
  },
  {
    "id": "stock_nml2qzige_1781876053969",
    "name": "L-37/BLACK",
    "mainCategory": "LICHI",
    "fullBoxes": 1,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:35:06.852Z",
    "checked": false
  },
  {
    "id": "stock_6efr74vmb_1781876105035",
    "name": "L-558/N.BLUE",
    "mainCategory": "LICHI",
    "fullBoxes": 2,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:35:05.036Z",
    "checked": false
  },
  {
    "id": "stock_gc2rjm2uk_1781876131235",
    "name": "L-1235/BT GREEN",
    "mainCategory": "LICHI",
    "fullBoxes": 2,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:35:31.236Z",
    "checked": false
  },
  {
    "id": "stock_5peiv86xb_1781876157203",
    "name": "L-1663/P.RED",
    "mainCategory": "LICHI",
    "fullBoxes": 2,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:35:57.203Z",
    "checked": false
  },
  {
    "id": "stock_l04l86ovg_1781876183653",
    "name": "L-1906/P.RANI",
    "mainCategory": "LICHI",
    "fullBoxes": 6,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:36:23.653Z",
    "checked": false
  },
  {
    "id": "stock_btb9qgz6w_1781876219369",
    "name": "L-2859/WINE",
    "mainCategory": "LICHI",
    "fullBoxes": 3,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:36:59.369Z",
    "checked": false
  },
  {
    "id": "stock_qoyaga2cf_1781876491517",
    "name": "MEHANDI",
    "mainCategory": "LICHI",
    "fullBoxes": 1,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:41:31.517Z",
    "checked": false
  },
  {
    "id": "stock_u52rlqbf8_1781876527332",
    "name": "L-2631/P.FIROJI",
    "mainCategory": "LICHI",
    "fullBoxes": 1,
    "halfBoxes": 0,
    "updatedAt": "2026-06-19T13:42:07.332Z",
    "checked": false
  }
];

const FIRESTORE_DOC_ID = 'current_state';

// --- Application State ---
let state = {
  stocks: [],
  mainCategories: [...DEFAULT_MAIN_CATEGORIES],
  searchQuery: '',
  filter: 'all', // availability filter ('all', 'inStock', 'outOfStock')
  mainCategoryFilter: 'all', // category filter ('all' or specific category)
  theme: 'dark',
  useFirebase: false,
  db: null,
  updatedAt: null,
  sortBy: 'name',
  isInitialSeed: false,
  userExplicitlyClearedAll: false
};

// --- DOM Elements ---
const themeToggleBtn = document.getElementById('themeToggleBtn');
const manageTypesBtn = document.getElementById('manageTypesBtn');
const syncBtn = document.getElementById('syncBtn');
const backupRestoreBtn = document.getElementById('backupRestoreBtn');
const lessStockBtn = document.getElementById('lessStockBtn');
const lowStockModal = document.getElementById('lowStockModal');
const lowStockListContainer = document.getElementById('lowStockListContainer');
const copyLowStockBtn = document.getElementById('copyLowStockBtn');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const mainCategoryFilterSelect = document.getElementById('mainCategoryFilterSelect');
const mainCatFilterWrapper = document.getElementById('mainCatFilterWrapper');
const filterSelect = document.getElementById('filterSelect');
const sortSelect = document.getElementById('sortSelect');
const addStockBtn = document.getElementById('addStockBtn');
const mobileFabAddBtn = document.getElementById('mobileFabAddBtn');
const stockItemsList = document.getElementById('stockItemsList');
const emptyState = document.getElementById('emptyState');
const emptyStateAddBtn = document.getElementById('emptyStateAddBtn');

// Dashboard Elements
const totalItemsEl = document.getElementById('totalItems');
const totalFullBoxesEl = document.getElementById('totalFullBoxes');
const totalHalfBoxesEl = document.getElementById('totalHalfBoxes');
const totalEquivBoxesEl = document.getElementById('totalEquivBoxes');

// Modals
const stockModal = document.getElementById('stockModal');
const stockForm = document.getElementById('stockForm');
const modalTitle = document.getElementById('modalTitle');
const stockIdInput = document.getElementById('stockId');
const stockMainCategoryInput = document.getElementById('stockMainCategoryInput');
const stockNameInput = document.getElementById('stockNameInput');
const stockFullInput = document.getElementById('stockFullInput');
const stockHalfInput = document.getElementById('stockHalfInput');
const nameError = document.getElementById('nameError');

const typesModal = document.getElementById('typesModal');
const newTypeNameInput = document.getElementById('newTypeNameInput');
const typesListContainer = document.getElementById('typesListContainer');
const addTypeForm = document.getElementById('addTypeForm');

const backupModal = document.getElementById('backupModal');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const exportJsonFileBtn = document.getElementById('exportJsonFileBtn');
const importFileInput = document.getElementById('importFile');
const importFile = document.getElementById('importFile');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const clearAllDataBtn = document.getElementById('clearAllDataBtn');
const restoreFromCloudBtn = document.getElementById('restoreFromCloudBtn');
const firebaseConfigInput = document.getElementById('firebaseConfigInput');
const saveFirebaseConfigBtn = document.getElementById('saveFirebaseConfigBtn');
const clearFirebaseConfigBtn = document.getElementById('clearFirebaseConfigBtn');

// --- Helper Functions ---
function generateId() {
  return 'stock_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
}

function triggerHaptic(duration = 15) {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(duration);
    } catch (e) {}
  }
}

function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconName = 'check-circle';
  if (type === 'error') iconName = 'alert-circle';
  if (type === 'info') iconName = 'info';

  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <span>${escapeHtml(message)}</span>
  `;

  toastContainer.appendChild(toast);
  if (window.lucide) {
    lucide.createIcons({ root: toast });
  }

  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 2500);
}

// --- Theme Management ---
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
}

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  const darkIcon = themeToggleBtn.querySelector('.theme-icon-dark');
  const lightIcon = themeToggleBtn.querySelector('.theme-icon-light');
  
  if (theme === 'dark') {
    if (darkIcon) darkIcon.classList.remove('hidden');
    if (lightIcon) lightIcon.classList.add('hidden');
  } else {
    if (darkIcon) darkIcon.classList.add('hidden');
    if (lightIcon) lightIcon.classList.remove('hidden');
  }
}

themeToggleBtn.addEventListener('click', () => {
  triggerHaptic(20);
  const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
});

// --- Persistent IndexedDB Storage Layer (Prevents Safari 7-day eviction) ---
const DB_NAME = 'StockCheckerDB';
const DB_VERSION = 1;
const STORE_NAME = 'inventory_store';

function openStockDB() {
  return new Promise((resolve) => {
    if (!window.indexedDB) return resolve(null);
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

async function idbGet(key) {
  try {
    const db = await openStockDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result !== undefined ? req.result : null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

async function idbSet(key, value) {
  try {
    const db = await openStockDB();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(value, key);
  } catch (e) {
    console.warn('idbSet failed:', e);
  }
}

function requestPersistentStorage() {
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().then(persistent => {
      if (persistent) {
        console.log('Persistent Storage: Granted (immune to 7-day browser eviction)');
      } else {
        console.log('Persistent Storage: Active via IndexedDB');
      }
    }).catch(() => {});
  }
}

// --- State Storage & Syncing ---
function loadState() {
  try {
    // 1. Load Main Categories
    const savedCategories = localStorage.getItem('mainCategories');
    if (savedCategories) {
      const parsed = JSON.parse(savedCategories);
      if (Array.isArray(parsed) && parsed.length > 0) {
        state.mainCategories = parsed.map(c => typeof c === 'string' ? c : (c.name || 'General')).filter(Boolean);
      }
    }
    if (!state.mainCategories || state.mainCategories.length === 0) {
      state.mainCategories = [...DEFAULT_MAIN_CATEGORIES];
    }
    localStorage.setItem('mainCategories', JSON.stringify(state.mainCategories));

    // 2. Load Stock List
    const savedStocks = localStorage.getItem('stocks');
    if (savedStocks) {
      const parsed = JSON.parse(savedStocks);
      if (Array.isArray(parsed)) {
        state.stocks = parsed;
        state.stocks.forEach(item => {
          item.id = String(item.id || generateId());
          item.name = String(item.name || '').trim();
          item.mainCategory = String(item.mainCategory || item.type || state.mainCategories[0] || 'General').trim();
          item.fullBoxes = parseInt(item.fullBoxes, 10) || 0;
          item.halfBoxes = parseInt(item.halfBoxes, 10) || 0;
        });
        state.isInitialSeed = false;
      }
    }

    // If localStorage was empty, use fallback items as initial seed with safe ancient timestamp
    if (!state.stocks || state.stocks.length === 0) {
      state.stocks = JSON.parse(JSON.stringify(DEFAULT_FALLBACK_STOCKS));
      state.isInitialSeed = true;
      state.updatedAt = '1970-01-01T00:00:00.000Z';
    }

    // 3. Load Timestamp
    const savedUpdatedAt = localStorage.getItem('stateUpdatedAt');
    if (savedUpdatedAt && !state.isInitialSeed) {
      state.updatedAt = savedUpdatedAt;
    } else if (state.isInitialSeed) {
      state.updatedAt = '1970-01-01T00:00:00.000Z';
    }

    // Asynchronously check IndexedDB in case localStorage was cleared by Safari
    if (state.isInitialSeed) {
      idbGet('stocks').then(idbStocks => {
        if (Array.isArray(idbStocks) && idbStocks.length > 0) {
          console.log('Restored', idbStocks.length, 'stocks from persistent IndexedDB');
          state.stocks = idbStocks;
          state.isInitialSeed = false;
          idbGet('stateUpdatedAt').then(ts => {
            if (ts) state.updatedAt = ts;
            localStorage.setItem('stocks', JSON.stringify(state.stocks));
            localStorage.setItem('stateUpdatedAt', state.updatedAt || new Date().toISOString());
            updateDashboard();
            renderStockList();
          });
        }
      });
    }
    
    populateTypeDropdowns();
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
    showToast('Failed to load saved stock data.', 'error');
  }
}

let syncTimeout = null;
let firestoreUnsubscribe = null;

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDoFIMrql2BGlAWlwWvgZiu6NKVsTfRvEk",
  authDomain: "stock-checker-57c31.firebaseapp.com",
  projectId: "stock-checker-57c31",
  storageBucket: "stock-checker-57c31.firebasestorage.app",
  messagingSenderId: "468866240777",
  appId: "1:468866240777:web:33ad75fec61551d9d703d8",
  measurementId: "G-43RT8EZ1ER"
};

// Initialize Firebase dynamically from config saved in localStorage or default fallback
function initFirebase() {
  if (typeof firebase === 'undefined') {
    console.warn('Firebase library not loaded (possibly offline or blocked CDN).');
    state.useFirebase = false;
    state.db = null;
    return;
  }
  
  let configStr = localStorage.getItem('firebaseConfig');
  let config = null;
  
  if (configStr) {
    try {
      config = JSON.parse(configStr);
    } catch (e) {
      console.error('Error parsing saved firebaseConfig:', e);
    }
  }
  
  if (!config) {
    config = DEFAULT_FIREBASE_CONFIG;
  }
  
  if (config && config.apiKey && config.projectId) {
    try {
      if (firebase.apps.length === 0) {
        firebase.initializeApp(config);
        try {
          firebase.firestore().enablePersistence({ synchronizeTabs: true }).catch(err => {
            console.warn('Firestore persistence status:', err.code);
          });
        } catch (e) {
          console.warn('Firestore persistence not supported:', e);
        }
      }
      state.db = firebase.firestore();
      state.useFirebase = true;
      
      if (firebaseConfigInput) {
        firebaseConfigInput.value = localStorage.getItem('firebaseConfig') || '';
      }
      
      setupFirebaseListener();
      console.log('Firebase initialized successfully.');
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      state.useFirebase = false;
      state.db = null;
      updateSyncStatus(false);
    }
  } else {
    state.useFirebase = false;
    state.db = null;
    if (firebaseConfigInput) {
      firebaseConfigInput.value = '';
    }
    if (firestoreUnsubscribe) {
      firestoreUnsubscribe();
      firestoreUnsubscribe = null;
    }
  }
}

// Lossless Merge: Combines local and remote states without dropping items
function mergeInventory(remoteStocks, remoteCategories, remoteUpdatedAt) {
  const remoteTime = new Date(remoteUpdatedAt || 0).getTime();
  const localTime = new Date(state.updatedAt || 0).getTime();
  
  // If local state was merely the initial seed, adopt remote completely
  if (state.isInitialSeed || state.stocks.length === 0) {
    return {
      stocks: remoteStocks,
      mainCategories: Array.isArray(remoteCategories) && remoteCategories.length > 0 ? remoteCategories : state.mainCategories,
      updatedAt: remoteUpdatedAt || new Date().toISOString()
    };
  }

  const itemMap = new Map();
  
  // 1. Put all remote items into map
  if (Array.isArray(remoteStocks)) {
    remoteStocks.forEach(item => {
      itemMap.set(String(item.id), { ...item });
    });
  }
  
  // 2. Merge local items
  state.stocks.forEach(localItem => {
    const id = String(localItem.id);
    if (!itemMap.has(id)) {
      // Item created locally - keep it!
      itemMap.set(id, { ...localItem });
    } else {
      // Exists in both: compare timestamps
      const remoteItem = itemMap.get(id);
      const lTime = new Date(localItem.updatedAt || 0).getTime();
      const rTime = new Date(remoteItem.updatedAt || 0).getTime();
      if (lTime > rTime) {
        itemMap.set(id, { ...localItem });
      }
    }
  });
  
  const mergedStocks = Array.from(itemMap.values());
  const mergedCategories = Array.isArray(remoteCategories) && remoteCategories.length > 0
    ? Array.from(new Set([...state.mainCategories, ...remoteCategories]))
    : state.mainCategories;
    
  return {
    stocks: mergedStocks,
    mainCategories: mergedCategories,
    updatedAt: remoteTime > localTime ? remoteUpdatedAt : state.updatedAt
  };
}

// Real-time listener for Firestore document
function setupFirebaseListener() {
  if (firestoreUnsubscribe) {
    firestoreUnsubscribe();
  }
  
  if (!state.db) return;
  
  firestoreUnsubscribe = state.db.collection('inventory').doc(FIRESTORE_DOC_ID)
    .onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        if (data && Array.isArray(data.stocks)) {
          // If remote has stocks and local was an initial seed or empty, adopt remote directly!
          if (data.stocks.length > 0 && (state.isInitialSeed || state.stocks.length === 0)) {
            state.stocks = data.stocks;
            if (Array.isArray(data.mainCategories) && data.mainCategories.length > 0) {
              state.mainCategories = data.mainCategories;
            }
            state.updatedAt = data.updatedAt || new Date().toISOString();
            state.isInitialSeed = false;
            
            // Persist to dual storage
            localStorage.setItem('stocks', JSON.stringify(state.stocks));
            localStorage.setItem('mainCategories', JSON.stringify(state.mainCategories));
            localStorage.setItem('stateUpdatedAt', state.updatedAt);
            idbSet('stocks', state.stocks);
            idbSet('mainCategories', state.mainCategories);
            idbSet('stateUpdatedAt', state.updatedAt);
            idbSet('backup_latest', {
              stocks: state.stocks,
              mainCategories: state.mainCategories,
              updatedAt: state.updatedAt
            });
            
            populateTypeDropdowns();
            updateDashboard();
            renderStockList();
            updateSyncStatus(true);
            return;
          }
          
          const merged = mergeInventory(data.stocks, data.mainCategories || [], data.updatedAt);
          const localStocksStr = JSON.stringify(state.stocks);
          const mergedStocksStr = JSON.stringify(merged.stocks);
          const localCatsStr = JSON.stringify(state.mainCategories);
          const mergedCatsStr = JSON.stringify(merged.mainCategories);
          
          if (localStocksStr !== mergedStocksStr || localCatsStr !== mergedCatsStr) {
            state.stocks = merged.stocks;
            state.mainCategories = merged.mainCategories;
            state.updatedAt = merged.updatedAt || new Date().toISOString();
            state.isInitialSeed = false;
            
            localStorage.setItem('stocks', JSON.stringify(state.stocks));
            localStorage.setItem('mainCategories', JSON.stringify(state.mainCategories));
            localStorage.setItem('stateUpdatedAt', state.updatedAt);
            idbSet('stocks', state.stocks);
            idbSet('mainCategories', state.mainCategories);
            idbSet('stateUpdatedAt', state.updatedAt);
            
            populateTypeDropdowns();
            updateDashboard();
            renderStockList();
            updateSyncStatus(true);
          }
        }
      }
    }, (error) => {
      console.error('Firestore listener notice:', error);
      updateSyncStatus(false);
    });
}

// Silent background server sync with safety guards
async function autoSyncWithServer() {
  if (state.isInitialSeed) {
    console.log('Initial seed state: skipping cloud push to protect remote data.');
    return;
  }
  
  try {
    // Guard against clearing cloud when local stocks is 0 without explicit user action
    if (state.stocks.length === 0 && !state.userExplicitlyClearedAll) {
      console.warn('Local stocks is empty and clear was not confirmed. Skipping cloud overwrite.');
      return;
    }

    const payload = {
      stocks: state.stocks,
      mainCategories: state.mainCategories,
      updatedAt: state.updatedAt || new Date().toISOString()
    };
    
    if (state.useFirebase) {
      if (!state.db) return;
      await state.db.collection('inventory').doc(FIRESTORE_DOC_ID).set(payload);
      // Auto-save backup document asynchronously
      state.db.collection('inventory').doc(FIRESTORE_DOC_ID + '_backup').set(payload).catch(() => {});
      updateSyncStatus(true);
    } else {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        updateSyncStatus(true);
      } else {
        updateSyncStatus(false);
      }
    }
  } catch (err) {
    console.error('autoSync error:', err);
    updateSyncStatus(false);
  }
}

function saveState(stocksUpdated = true) {
  if (stocksUpdated) {
    state.isInitialSeed = false;
    state.updatedAt = new Date().toISOString();
    
    try {
      localStorage.setItem('stocks', JSON.stringify(state.stocks));
      localStorage.setItem('mainCategories', JSON.stringify(state.mainCategories));
      localStorage.setItem('stateUpdatedAt', state.updatedAt);
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }

    // Dual-Layer Persistence: Save to IndexedDB
    idbSet('stocks', state.stocks);
    idbSet('mainCategories', state.mainCategories);
    idbSet('stateUpdatedAt', state.updatedAt);
    idbSet('backup_latest', {
      stocks: state.stocks,
      mainCategories: state.mainCategories,
      updatedAt: state.updatedAt
    });
    
    // Auto-sync in background, debounced by 1 second
    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      autoSyncWithServer();
    }, 1000);
  }
  updateDashboard();
  renderStockList();
}

// Fetch Inventory Data from Firestore with safety reconciliation
async function loadFromServer(isManual = false) {
  if (state.useFirebase) {
    if (!state.db) return;
    try {
      const doc = await state.db.collection('inventory').doc(FIRESTORE_DOC_ID).get();
      if (doc.exists) {
        const data = doc.data();
        if (data && Array.isArray(data.stocks) && data.stocks.length > 0) {
          const remoteTime = new Date(data.updatedAt || 0).getTime();
          const localTime = new Date(state.updatedAt || 0).getTime();
          
          if (isManual || state.isInitialSeed || remoteTime >= localTime || state.stocks.length === 0) {
            state.stocks = data.stocks;
            if (Array.isArray(data.mainCategories) && data.mainCategories.length > 0) {
              state.mainCategories = data.mainCategories;
            }
            state.updatedAt = data.updatedAt || new Date().toISOString();
            state.isInitialSeed = false;
            
            localStorage.setItem('stocks', JSON.stringify(state.stocks));
            localStorage.setItem('mainCategories', JSON.stringify(state.mainCategories));
            localStorage.setItem('stateUpdatedAt', state.updatedAt);
            idbSet('stocks', state.stocks);
            idbSet('mainCategories', state.mainCategories);
            idbSet('stateUpdatedAt', state.updatedAt);
            
            populateTypeDropdowns();
            updateDashboard();
            renderStockList();
            updateSyncStatus(true);
            if (isManual) {
              showToast(`Restored ${state.stocks.length} items from cloud!`);
            }
            return;
          }
        }
      } else {
        if (!state.isInitialSeed && state.stocks.length > 0) {
          await autoSyncWithServer();
        }
      }
    } catch (err) {
      console.error('Error loading from Firestore:', err);
      updateSyncStatus(false);
      if (isManual) {
        showToast('Could not fetch cloud data. Check connection.', 'error');
      }
    }
  } else {
    const isStaticHost = window.location.hostname.endsWith('github.io') || window.location.hostname.includes('vercel.app');
    if (isStaticHost) {
      return;
    }

    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Server returned error status');
      
      const data = await response.json();
      if (data && Array.isArray(data.stocks)) {
        const remoteTime = new Date(data.updatedAt || 0).getTime();
        const localTime = new Date(state.updatedAt || 0).getTime();
        
        if (remoteTime > localTime) {
          state.stocks = data.stocks;
          if (Array.isArray(data.mainCategories)) {
            state.mainCategories = data.mainCategories;
          }
          state.updatedAt = data.updatedAt || new Date().toISOString();
          saveState(false);
          updateSyncStatus(true);
        }
      }
    } catch (err) {
      updateSyncStatus(false);
    }
  }
}

// Save & Sync Inventory Data manually
async function syncWithServer() {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
    syncTimeout = null;
  }
  triggerHaptic(20);
  const syncText = syncBtn.querySelector('.btn-text');
  const activeIcon = syncBtn.querySelector('.sync-icon-connected:not(.hidden)') || 
                     syncBtn.querySelector('.sync-icon-disconnected:not(.hidden)') || 
                     syncBtn.querySelector('svg') || 
                     syncBtn.querySelector('i');
  
  if (activeIcon) activeIcon.classList.add('spin');
  syncBtn.disabled = true;
  if (syncText) syncText.textContent = 'Syncing...';
  
  try {
    state.isInitialSeed = false;
    state.updatedAt = new Date().toISOString();
    
    const payload = {
      stocks: state.stocks,
      mainCategories: state.mainCategories,
      updatedAt: state.updatedAt
    };
    
    // Save to dual storage
    localStorage.setItem('stocks', JSON.stringify(state.stocks));
    localStorage.setItem('mainCategories', JSON.stringify(state.mainCategories));
    localStorage.setItem('stateUpdatedAt', state.updatedAt);
    idbSet('stocks', state.stocks);
    idbSet('mainCategories', state.mainCategories);
    idbSet('stateUpdatedAt', state.updatedAt);
    idbSet('backup_latest', {
      stocks: state.stocks,
      mainCategories: state.mainCategories,
      updatedAt: state.updatedAt
    });
    
    if (state.useFirebase) {
      if (!state.db) throw new Error('Firestore not initialized');
      await state.db.collection('inventory').doc(FIRESTORE_DOC_ID).set(payload);
      state.db.collection('inventory').doc(FIRESTORE_DOC_ID + '_backup').set(payload).catch(() => {});
      updateSyncStatus(true);
      showToast('Inventory saved & synced to cloud!');
    } else {
      const isStaticHost = window.location.hostname.endsWith('github.io') || window.location.hostname.includes('vercel.app');
      if (isStaticHost) {
        showToast('Saved locally in persistent storage.', 'info');
        updateSyncStatus(true);
        return;
      }

      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error('Post to server failed');
      updateSyncStatus(true);
      showToast('Inventory saved & synced to all devices!');
    }
  } catch (err) {
    console.error('Server sync error:', err);
    updateSyncStatus(false);
    showToast(`Sync Notice: ${err.message || 'Saved locally'}`, 'error');
  } finally {
    if (activeIcon) activeIcon.classList.remove('spin');
    syncBtn.disabled = false;
    if (syncText) syncText.textContent = 'Save & Sync';
  }
}

// Update Sync Button UI based on connection state
function updateSyncStatus(isSynced) {
  const connectedIcon = syncBtn.querySelector('.sync-icon-connected');
  const disconnectedIcon = syncBtn.querySelector('.sync-icon-disconnected');
  
  if (isSynced) {
    syncBtn.classList.remove('btn-secondary');
    syncBtn.classList.add('btn-primary');
    syncBtn.title = 'Saved & Synced with Global Cloud';
    if (connectedIcon) connectedIcon.classList.remove('hidden');
    if (disconnectedIcon) disconnectedIcon.classList.add('hidden');
  } else {
    syncBtn.classList.remove('btn-primary');
    syncBtn.classList.add('btn-secondary');
    syncBtn.title = 'Saved in Persistent Storage';
    if (connectedIcon) connectedIcon.classList.add('hidden');
    if (disconnectedIcon) disconnectedIcon.classList.remove('hidden');
  }
}

// --- Main Categories Management ---
function populateTypeDropdowns() {
  if (!mainCategoryFilterSelect || !stockMainCategoryInput) return;

  const mainCategories = state.mainCategories || [];
  
  // 1. Populate Main Category Filter Dropdown in Toolbar
  const currentMainFilter = state.mainCategoryFilter || 'all';
  mainCategoryFilterSelect.innerHTML = '<option value="all">All Categories</option>';
  mainCategories.forEach(cat => {
    mainCategoryFilterSelect.innerHTML += `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`;
  });
  mainCategoryFilterSelect.value = currentMainFilter;
  if (!mainCategoryFilterSelect.value) {
    mainCategoryFilterSelect.value = 'all';
    state.mainCategoryFilter = 'all';
  }

  // 2. Populate Main Category in Add/Edit Stock Form
  const currentEditMainCat = stockMainCategoryInput.value || (mainCategories.length > 0 ? mainCategories[0] : 'Spun');
  stockMainCategoryInput.innerHTML = '';
  mainCategories.forEach(cat => {
    stockMainCategoryInput.innerHTML += `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`;
  });
  stockMainCategoryInput.value = currentEditMainCat;
  if (!stockMainCategoryInput.value && mainCategories.length > 0) {
    stockMainCategoryInput.value = mainCategories[0];
  }
}

// Render the Category management view in Types Modal
function renderTypesList() {
  if (!typesListContainer) return;
  const categories = state.mainCategories || [];
  
  if (categories.length === 0) {
    typesListContainer.innerHTML = '<p class="file-name-display" style="padding: 1rem; text-align: center;">No categories defined. Use the form above to add one.</p>';
    return;
  }

  typesListContainer.innerHTML = categories.map((cat, idx) => {
    const count = state.stocks.filter(item => (item.mainCategory || '').toLowerCase() === cat.toLowerCase()).length;

    return `
      <div class="category-item" id="catItem_${idx}" data-cat-name="${escapeHtml(cat)}">
        <div class="category-item-info">
          <span class="category-item-name">${escapeHtml(cat)}</span>
          <span class="category-item-count">${count} ${count === 1 ? 'item' : 'items'}</span>
        </div>
        <div class="category-item-actions">
          <button type="button" class="icon-btn edit-btn rename-cat-btn" data-cat-idx="${idx}" data-cat-name="${escapeHtml(cat)}" title="Edit / Rename Category" aria-label="Rename Category">
            <i data-lucide="pencil" style="width: 15px; height: 15px;"></i>
          </button>
          <button type="button" class="icon-btn delete-btn delete-cat-btn" data-cat-name="${escapeHtml(cat)}" title="Delete Category" aria-label="Delete Category">
            <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();

  // Bind Rename Main Category buttons to inline edit form
  typesListContainer.querySelectorAll('.rename-cat-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      triggerHaptic(20);
      const idx = btn.dataset.catIdx;
      const oldName = btn.dataset.catName;
      const row = document.getElementById(`catItem_${idx}`);
      if (!row) return;

      row.innerHTML = `
        <form class="category-edit-form" id="catEditForm_${idx}">
          <input type="text" class="category-rename-input" id="catEditInput_${idx}" value="${escapeHtml(oldName)}" required autocomplete="off">
          <button type="submit" class="btn btn-sm btn-primary save-rename-btn" title="Save Changes">Save</button>
          <button type="button" class="btn btn-sm btn-secondary cancel-rename-btn" title="Cancel">Cancel</button>
        </form>
      `;

      const input = document.getElementById(`catEditInput_${idx}`);
      if (input) {
        input.focus();
        input.select();
      }

      const form = document.getElementById(`catEditForm_${idx}`);
      form.onsubmit = (ev) => {
        ev.preventDefault();
        const newName = input.value.trim();
        if (!newName) {
          showToast('Category name cannot be empty.', 'error');
          return;
        }
        performCategoryRename(oldName, newName);
      };

      const cancelBtn = row.querySelector('.cancel-rename-btn');
      cancelBtn.onclick = (ev) => {
        ev.stopPropagation();
        renderTypesList();
      };
    };
  });

  // Bind Delete Main Category buttons
  typesListContainer.querySelectorAll('.delete-cat-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      triggerHaptic(25);
      const catName = btn.dataset.catName;
      deleteMainCategory(catName);
    };
  });
}

// Perform Category Rename
function performCategoryRename(oldName, newName) {
  const trimmed = newName.trim();
  if (!trimmed) {
    showToast('Category name cannot be empty.', 'error');
    return;
  }
  if (trimmed.toLowerCase() === oldName.toLowerCase() && trimmed === oldName) {
    renderTypesList();
    return;
  }

  const isDuplicate = state.mainCategories.some(c => c.toLowerCase() === trimmed.toLowerCase() && c.toLowerCase() !== oldName.toLowerCase());
  if (isDuplicate) {
    showToast(`Category "${trimmed}" already exists.`, 'error');
    return;
  }

  const catIdx = state.mainCategories.findIndex(c => c.toLowerCase() === oldName.toLowerCase());
  if (catIdx !== -1) {
    state.mainCategories[catIdx] = trimmed;
  } else {
    state.mainCategories.push(trimmed);
  }

  // Update in existing stock items
  let count = 0;
  state.stocks.forEach(item => {
    if ((item.mainCategory || '').toLowerCase() === oldName.toLowerCase()) {
      item.mainCategory = trimmed;
      item.updatedAt = new Date().toISOString();
      count++;
    }
  });

  if ((state.mainCategoryFilter || '').toLowerCase() === oldName.toLowerCase()) {
    state.mainCategoryFilter = trimmed;
  }

  saveState();
  populateTypeDropdowns();
  renderTypesList();
  renderStockList();
  syncWithServer();
  showToast(`Renamed "${oldName}" to "${trimmed}". Updated ${count} stock items.`);
}

// Delete a Main Category
function deleteMainCategory(catName) {
  const affectedCount = state.stocks.filter(item => (item.mainCategory || '').toLowerCase() === catName.toLowerCase()).length;
  let confirmMsg = `Are you sure you want to delete category "${catName}"?`;
  if (affectedCount > 0) {
    confirmMsg += `\n\nWarning: ${affectedCount} stock items currently belong to this category.`;
  }

  if (confirm(confirmMsg)) {
    state.mainCategories = state.mainCategories.filter(c => c.toLowerCase() !== catName.toLowerCase());
    
    // Set fallback on affected stocks
    const fallbackCat = state.mainCategories.length > 0 ? state.mainCategories[0] : 'Spun';
    state.stocks.forEach(item => {
      if ((item.mainCategory || '').toLowerCase() === catName.toLowerCase()) {
        item.mainCategory = fallbackCat;
        item.updatedAt = new Date().toISOString();
      }
    });

    if ((state.mainCategoryFilter || '').toLowerCase() === catName.toLowerCase()) {
      state.mainCategoryFilter = 'all';
    }

    saveState();
    populateTypeDropdowns();
    renderTypesList();
    renderStockList();
    syncWithServer();
    showToast(`Category "${catName}" deleted.`);
  }
}

// --- Dashboard & Calculations ---
function updateDashboard() {
  const totalItems = state.stocks.length;
  let totalFull = 0;
  let totalHalf = 0;
  
  state.stocks.forEach(item => {
    totalFull += (parseInt(item.fullBoxes, 10) || 0);
    totalHalf += (parseInt(item.halfBoxes, 10) || 0);
  });
  
  const totalEquiv = totalFull + (totalHalf * 0.5);
  
  // Update DOM with animations if values changed
  animateValueUpdate(totalItemsEl, totalItems);
  animateValueUpdate(totalFullBoxesEl, totalFull);
  animateValueUpdate(totalHalfBoxesEl, totalHalf);
  animateValueUpdate(totalEquivBoxesEl, totalEquiv.toFixed(1));
}

function animateValueUpdate(element, newValue) {
  if (element.textContent !== String(newValue)) {
    element.style.transform = 'scale(1.15)';
    element.style.color = 'var(--primary)';
    element.style.transition = 'transform 0.15s ease';
    
    setTimeout(() => {
      element.textContent = newValue;
      element.style.transform = 'scale(1)';
      element.style.color = '';
    }, 150);
  }
}

// --- Stock List Rendering ---
function renderStockList() {
  const query = state.searchQuery.toLowerCase().trim();
  const filter = state.filter;
  const mainCatFilter = state.mainCategoryFilter;
  
  const filtered = state.stocks.filter(item => {
    const itemName = String(item.name || '').toLowerCase();
    const itemCat = String(item.mainCategory || '').toLowerCase();
    const matchesSearch = itemName.includes(query) || itemCat.includes(query);
    const full = parseInt(item.fullBoxes, 10) || 0;
    const half = parseInt(item.halfBoxes, 10) || 0;
    const hasInventory = full > 0 || half > 0;
    
    // Check category filter
    const matchesMainCat = mainCatFilter === 'all' || itemCat === mainCatFilter.toLowerCase();
    if (!matchesMainCat) return false;
    
    if (filter === 'inStock') {
      return matchesSearch && hasInventory;
    } else if (filter === 'outOfStock') {
      return matchesSearch && !hasInventory;
    }
    return matchesSearch;
  });
  
  // Sort based on sortBy option
  const sortBy = state.sortBy || 'name';
  if (sortBy === 'boxesDesc') {
    filtered.sort((a, b) => {
      const equivA = (parseInt(a.fullBoxes, 10) || 0) + (parseInt(a.halfBoxes, 10) || 0) * 0.5;
      const equivB = (parseInt(b.fullBoxes, 10) || 0) + (parseInt(b.halfBoxes, 10) || 0) * 0.5;
      return equivB - equivA || String(a.name || '').localeCompare(String(b.name || ''));
    });
  } else if (sortBy === 'boxesAsc') {
    filtered.sort((a, b) => {
      const equivA = (parseInt(a.fullBoxes, 10) || 0) + (parseInt(a.halfBoxes, 10) || 0) * 0.5;
      const equivB = (parseInt(b.fullBoxes, 10) || 0) + (parseInt(b.halfBoxes, 10) || 0) * 0.5;
      return equivA - equivB || String(a.name || '').localeCompare(String(b.name || ''));
    });
  } else {
    // Default: Sort alphabetically by name
    filtered.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
  }
  
  // Toggle Empty State
  if (filtered.length === 0) {
    stockItemsList.innerHTML = '';
    emptyState.classList.remove('hidden');
    if (state.stocks.length > 0) {
      emptyState.querySelector('h3').textContent = 'No Matches Found';
      emptyState.querySelector('p').textContent = `No stock items match your search or category filter.`;
      emptyStateAddBtn.classList.add('hidden');
    } else {
      emptyState.querySelector('h3').textContent = 'No Stock Items Found';
      emptyState.querySelector('p').textContent = 'Start by adding some stock items to track your daily inventory.';
      emptyStateAddBtn.classList.remove('hidden');
    }
  } else {
    emptyState.classList.add('hidden');
    
    // Update select all checkbox state in header
    const selectAllStock = document.getElementById('selectAllStock');
    if (selectAllStock) {
      const allChecked = filtered.length > 0 && filtered.every(item => item.checked);
      selectAllStock.checked = allChecked;
    }

    // Efficiently render list items
    stockItemsList.innerHTML = filtered.map(item => {
      const full = parseInt(item.fullBoxes, 10) || 0;
      const half = parseInt(item.halfBoxes, 10) || 0;
      const equiv = (full + half * 0.5).toFixed(1);
      const isInStock = full > 0 || half > 0;
      const itemMainCat = item.mainCategory || 'Spun';
      const itemId = String(item.id);
      
      return `
        <div class="stock-item ${item.checked ? 'checked' : ''}" data-id="${escapeHtml(itemId)}" role="listitem">
          
          <!-- Checkbox Column -->
          <div class="col-check">
            <input type="checkbox" class="custom-checkbox stock-checkbox" data-id="${escapeHtml(itemId)}" ${item.checked ? 'checked' : ''} aria-label="Check stock item">
          </div>
          
          <div class="stock-card-content">
            <!-- Column 1: Stock Name and category badge -->
            <div class="stock-name-wrapper">
              <span class="stock-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</span>
              <div style="display: flex; gap: 0.35rem; align-items: center; margin-top: 0.25rem; flex-wrap: wrap;">
                ${isInStock 
                  ? `<span class="stock-badge-active">In Stock</span>` 
                  : `<span class="stock-badge-low">Out of Stock</span>`
                }
                <span class="stock-badge-main-cat">${escapeHtml(itemMainCat)}</span>
              </div>
            </div>
            
            <!-- Desktop Counter wrappers (display: contents on desktop) -->
            <div class="stock-item-row-mobile-counters">
              
              <!-- Column 2: Full Boxes -->
              <div class="stock-item-counter-group">
                <span class="stock-item-counter-group-label">Full Boxes</span>
                <div class="stock-counter">
                  <button class="stock-counter-btn decrement-btn" data-field="fullBoxes" data-id="${escapeHtml(itemId)}" aria-label="Decrease Full Boxes">-</button>
                  <span class="stock-counter-val">${full}</span>
                  <button class="stock-counter-btn increment-btn" data-field="fullBoxes" data-id="${escapeHtml(itemId)}" aria-label="Increase Full Boxes">+</button>
                </div>
              </div>
              
              <!-- Column 3: Half Boxes -->
              <div class="stock-item-counter-group">
                <span class="stock-item-counter-group-label">Half Boxes</span>
                <div class="stock-counter">
                  <button class="stock-counter-btn decrement-btn" data-field="halfBoxes" data-id="${escapeHtml(itemId)}" aria-label="Decrease Half Boxes">-</button>
                  <span class="stock-counter-val">${half}</span>
                  <button class="stock-counter-btn increment-btn" data-field="halfBoxes" data-id="${escapeHtml(itemId)}" aria-label="Increase Half Boxes">+</button>
                </div>
              </div>
            </div>
            
            <!-- Column 4 & 5 wrapper (display: contents on desktop) -->
            <div class="stock-item-row-mobile-actions">
              <!-- Column 4: Total Equivalent Boxes -->
              <div class="stock-equiv-display">
                ${equiv} <span>boxes</span>
              </div>
              
              <!-- Column 5: Action Buttons -->
              <div class="stock-actions">
                <button type="button" class="icon-btn edit-btn" data-id="${escapeHtml(itemId)}" title="Edit Item" aria-label="Edit Stock Item">
                  <i data-lucide="pencil"></i>
                </button>
                <button type="button" class="icon-btn delete-btn" data-id="${escapeHtml(itemId)}" title="Delete Item" aria-label="Delete Stock Item">
                  <i data-lucide="trash-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    lucide.createIcons();
    attachListEventListeners();
  }
}

// --- List Events (Edit, Delete, Increments) ---
function attachListEventListeners() {
  const stockElements = stockItemsList.querySelectorAll('.stock-item');
  const selectAllStock = document.getElementById('selectAllStock');
  
  // Select All handler (header checkbox)
  if (selectAllStock) {
    const query = state.searchQuery.toLowerCase().trim();
    const filter = state.filter;
    const mainCatFilter = state.mainCategoryFilter;
    const filtered = state.stocks.filter(item => {
      const itemName = String(item.name || '').toLowerCase();
      const itemCat = String(item.mainCategory || '').toLowerCase();
      const matchesSearch = itemName.includes(query) || itemCat.includes(query);
      const full = parseInt(item.fullBoxes, 10) || 0;
      const half = parseInt(item.halfBoxes, 10) || 0;
      const hasInventory = full > 0 || half > 0;
      const matchesMainCat = mainCatFilter === 'all' || itemCat === mainCatFilter.toLowerCase();
      if (!matchesMainCat) return false;
      if (filter === 'inStock') return matchesSearch && hasInventory;
      if (filter === 'outOfStock') return matchesSearch && !hasInventory;
      return matchesSearch;
    });

    selectAllStock.onchange = () => {
      triggerHaptic(20);
      const isChecked = selectAllStock.checked;
      filtered.forEach(item => {
        item.checked = isChecked;
        item.updatedAt = new Date().toISOString();
      });
      saveState();
    };
  }
  
  stockElements.forEach(element => {
    const id = String(element.dataset.id);
    
    // Checkbox change handler
    const checkbox = element.querySelector('.stock-checkbox');
    if (checkbox) {
      checkbox.onchange = (e) => {
        e.stopPropagation();
        const checked = checkbox.checked;
        const item = state.stocks.find(x => String(x.id) === id);
        if (item) {
          item.checked = checked;
          item.updatedAt = new Date().toISOString();
          
          if (checked) {
            element.classList.add('checked');
          } else {
            element.classList.remove('checked');
          }
          
          if (selectAllStock) {
            const allChecked = Array.from(stockElements).every(el => {
              const cb = el.querySelector('.stock-checkbox');
              return cb ? cb.checked : false;
            });
            selectAllStock.checked = allChecked;
          }
          
          triggerHaptic(15);
          saveState();
        }
      };
    }
    
    // Decrement handler
    element.querySelectorAll('.decrement-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        triggerHaptic(10);
        updateStockCount(id, btn.dataset.field, -1);
      };
    });
    
    // Increment handler
    element.querySelectorAll('.increment-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        triggerHaptic(10);
        updateStockCount(id, btn.dataset.field, 1);
      };
    });
    
    // Edit action
    const editBtn = element.querySelector('.edit-btn');
    if (editBtn) {
      editBtn.onclick = (e) => {
        e.stopPropagation();
        triggerHaptic(20);
        openAddEditModal(id);
      };
    }
    
    // Delete action
    const deleteBtn = element.querySelector('.delete-btn');
    if (deleteBtn) {
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        triggerHaptic(30);
        deleteStockItem(id);
      };
    }
  });
}

function updateStockCount(id, field, change) {
  const idStr = String(id);
  const stockIndex = state.stocks.findIndex(item => String(item.id) === idStr);
  if (stockIndex !== -1) {
    const item = state.stocks[stockIndex];
    const currentVal = parseInt(item[field], 10) || 0;
    const newVal = Math.max(0, currentVal + change);
    
    if (currentVal !== newVal) {
      item[field] = newVal;
      item.updatedAt = new Date().toISOString();
      saveState();
    }
  }
}

function deleteStockItem(id) {
  const idStr = String(id);
  const stockIndex = state.stocks.findIndex(item => String(item.id) === idStr);
  if (stockIndex !== -1) {
    const item = state.stocks[stockIndex];
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      state.stocks.splice(stockIndex, 1);
      saveState();
      showToast(`Deleted "${item.name}"`);
    }
  }
}

// --- Modal Handling ---

// Add/Edit Stock Modal
function openAddEditModal(editId = null) {
  resetFormErrors();
  populateTypeDropdowns();
  
  if (editId !== null && editId !== undefined && editId !== '') {
    const editIdStr = String(editId);
    const item = state.stocks.find(x => String(x.id) === editIdStr);
    if (!item) return;
    modalTitle.textContent = 'Edit Stock Item';
    stockIdInput.value = item.id;
    
    // Check if category exists in select, if not add it dynamically
    const catVal = item.mainCategory || (state.mainCategories[0] || 'Spun');
    const optionExists = Array.from(stockMainCategoryInput.options).some(opt => opt.value.toLowerCase() === catVal.toLowerCase());
    if (!optionExists) {
      stockMainCategoryInput.innerHTML += `<option value="${escapeHtml(catVal)}">${escapeHtml(catVal)}</option>`;
    }
    stockMainCategoryInput.value = catVal;
    
    stockNameInput.value = item.name || '';
    stockFullInput.value = parseInt(item.fullBoxes, 10) || 0;
    stockHalfInput.value = parseInt(item.halfBoxes, 10) || 0;
  } else {
    modalTitle.textContent = 'Add Stock Item';
    stockIdInput.value = '';
    stockForm.reset();
    if (state.mainCategories.length > 0) {
      stockMainCategoryInput.value = state.mainCategories[0];
    }
    stockFullInput.value = 0;
    stockHalfInput.value = 0;
  }
  
  stockModal.classList.remove('hidden');
  stockModal.setAttribute('aria-hidden', 'false');
  stockNameInput.focus();
}

function closeAddEditModal() {
  stockModal.classList.add('hidden');
  stockModal.setAttribute('aria-hidden', 'true');
  stockForm.reset();
}

// Stepper Logic inside Form Modals
document.querySelectorAll('.stepper-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    triggerHaptic(12);
    const targetInputId = btn.dataset.target;
    const input = document.getElementById(targetInputId);
    const val = parseInt(input.value, 10) || 0;
    
    if (btn.classList.contains('minus')) {
      input.value = Math.max(0, val - 1);
    } else {
      input.value = val + 1;
    }
  });
});

function resetFormErrors() {
  nameError.classList.remove('visible');
  stockNameInput.classList.remove('input-error');
}

// Submit Form (Save Stock)
stockForm.addEventListener('submit', (e) => {
  e.preventDefault();
  resetFormErrors();
  
  const mainCategory = stockMainCategoryInput.value || (state.mainCategories[0] || 'Spun');
  const name = stockNameInput.value.trim();
  const full = parseInt(stockFullInput.value, 10) || 0;
  const half = parseInt(stockHalfInput.value, 10) || 0;
  const editId = stockIdInput.value ? String(stockIdInput.value) : '';
  
  if (!name) {
    nameError.textContent = 'Stock name is required';
    nameError.classList.add('visible');
    stockNameInput.classList.add('input-error');
    stockNameInput.focus();
    return;
  }
  
  // Duplicate Check: only if name AND category match on a DIFFERENT item
  const isDuplicate = state.stocks.some(item => 
    item.name.toLowerCase() === name.toLowerCase() && 
    (item.mainCategory || '').toLowerCase() === mainCategory.toLowerCase() && 
    String(item.id) !== editId
  );
  
  if (isDuplicate) {
    nameError.textContent = 'A stock item with this name and category already exists';
    nameError.classList.add('visible');
    stockNameInput.classList.add('input-error');
    stockNameInput.focus();
    return;
  }
  
  triggerHaptic(20);
  
  if (editId) {
    const item = state.stocks.find(x => String(x.id) === editId);
    if (item) {
      item.name = name;
      item.mainCategory = mainCategory;
      item.fullBoxes = Math.max(0, full);
      item.halfBoxes = Math.max(0, half);
      item.updatedAt = new Date().toISOString();
      showToast(`Updated "${name}"`);
    }
  } else {
    const newItem = {
      id: generateId(),
      name: name,
      mainCategory: mainCategory,
      fullBoxes: Math.max(0, full),
      halfBoxes: Math.max(0, half),
      updatedAt: new Date().toISOString(),
      checked: false
    };
    state.stocks.push(newItem);
    showToast(`Added "${name}"`);
  }
  
  saveState();
  closeAddEditModal();
});

// Quick Manage Categories button in Add Stock modal
const quickManageCategoriesBtn = document.getElementById('quickManageCategoriesBtn');
if (quickManageCategoriesBtn) {
  quickManageCategoriesBtn.addEventListener('click', () => {
    triggerHaptic(20);
    newTypeNameInput.value = '';
    renderTypesList();
    typesModal.classList.remove('hidden');
    typesModal.setAttribute('aria-hidden', 'false');
  });
}

// Trigger modal closing on background tap
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      triggerHaptic(10);
      overlay.classList.add('hidden');
      overlay.setAttribute('aria-hidden', 'true');
    }
  });
});

document.querySelectorAll('.modal-close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    triggerHaptic(10);
    const modal = btn.closest('.modal-overlay');
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  });
});

// Open Backup Modal
backupRestoreBtn.addEventListener('click', () => {
  triggerHaptic(20);
  fileNameDisplay.textContent = 'No file selected';
  importFile.value = '';
  backupModal.classList.remove('hidden');
  backupModal.setAttribute('aria-hidden', 'false');
});

// Open Stock Categories Modal
manageTypesBtn.addEventListener('click', () => {
  triggerHaptic(20);
  newTypeNameInput.value = '';
  renderTypesList();
  typesModal.classList.remove('hidden');
  typesModal.setAttribute('aria-hidden', 'false');
});

// Open Low Stock Modal
lessStockBtn.addEventListener('click', () => {
  triggerHaptic(20);
  generateLowStockReport();
  lowStockModal.classList.remove('hidden');
  lowStockModal.setAttribute('aria-hidden', 'false');
});

// Copy Low Stock Report
copyLowStockBtn.addEventListener('click', () => {
  triggerHaptic(20);
  const lowStockItems = state.stocks.filter(item => {
    const equiv = item.fullBoxes + (item.halfBoxes * 0.5);
    return equiv <= 1;
  });
  
  lowStockItems.sort((a, b) => {
    const catA = a.mainCategory || 'General';
    const catB = b.mainCategory || 'General';
    const catCompare = catA.localeCompare(catB);
    if (catCompare !== 0) return catCompare;
    return a.name.localeCompare(b.name);
  });
  
  if (lowStockItems.length === 0) return;
  
  const dateStr = new Date().toLocaleDateString();
  let reportText = `⚠️ LOW STOCK REPORT (${dateStr})\n`;
  reportText += `------------------------------------\n`;
  
  let currentGroup = '';
  lowStockItems.forEach(item => {
    const equiv = item.fullBoxes + (item.halfBoxes * 0.5);
    const catLabel = item.mainCategory ? item.mainCategory : 'General';
    
    if (catLabel !== currentGroup) {
      currentGroup = catLabel;
      reportText += `\n📁 ${currentGroup.toUpperCase()}\n`;
    }
    reportText += `• ${item.name}: ${equiv.toFixed(1)} boxes\n`;
  });
  
  navigator.clipboard.writeText(reportText)
    .then(() => {
      showToast('Low stock report copied to clipboard!');
    })
    .catch(err => {
      console.error('Failed to copy text:', err);
      showToast('Failed to copy report.', 'error');
    });
});

function generateLowStockReport() {
  const lowStockItems = state.stocks.filter(item => {
    const equiv = item.fullBoxes + (item.halfBoxes * 0.5);
    return equiv <= 1;
  });
  
  lowStockItems.sort((a, b) => {
    const catA = a.mainCategory || 'General';
    const catB = b.mainCategory || 'General';
    const catCompare = catA.localeCompare(catB);
    if (catCompare !== 0) return catCompare;
    return a.name.localeCompare(b.name);
  });
  
  if (lowStockItems.length === 0) {
    lowStockListContainer.innerHTML = '<p style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-style: italic;">No low stock items found! All items have more than 1 box.</p>';
    copyLowStockBtn.disabled = true;
    return;
  }
  
  copyLowStockBtn.disabled = false;
  
  let currentGroup = '';
  let htmlContent = '';
  
  lowStockItems.forEach(item => {
    const equiv = item.fullBoxes + (item.halfBoxes * 0.5);
    const catLabel = item.mainCategory ? item.mainCategory : 'General';
    
    if (catLabel !== currentGroup) {
      currentGroup = catLabel;
      htmlContent += `
        <div class="low-stock-category-header" style="background-color: var(--bg-tertiary); padding: 0.5rem 1rem; font-size: 0.75rem; font-weight: 700; color: var(--primary); border-bottom: 1px solid var(--border-color); text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.4rem; margin-top: 0.5rem;">
          <i data-lucide="folder" style="width: 12px; height: 12px;"></i> ${escapeHtml(currentGroup)}
        </div>
      `;
    }
    
    htmlContent += `
      <div class="low-stock-item">
        <div class="low-stock-item-info">
          <span class="low-stock-item-name">${escapeHtml(item.name)}</span>
        </div>
        <span class="low-stock-item-qty">${equiv.toFixed(1)} boxes</span>
      </div>
    `;
  });
  
  lowStockListContainer.innerHTML = htmlContent;
  lucide.createIcons();
}

// Add New Main Category form submit
addTypeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newCatName = newTypeNameInput.value.trim();
  if (!newCatName) return;

  const isDuplicate = state.mainCategories.some(c => c.toLowerCase() === newCatName.toLowerCase());
  if (isDuplicate) {
    showToast('This category already exists.', 'error');
    newTypeNameInput.focus();
    return;
  }

  triggerHaptic(20);
  state.mainCategories.push(newCatName);
  saveState();
  populateTypeDropdowns();
  renderTypesList();
  syncWithServer();
  
  newTypeNameInput.value = '';
  newTypeNameInput.focus();
  showToast(`Added category "${newCatName}".`);
});

// Add stock button triggers
addStockBtn.addEventListener('click', () => {
  triggerHaptic(15);
  openAddEditModal();
});
mobileFabAddBtn.addEventListener('click', () => {
  triggerHaptic(15);
  openAddEditModal();
});
emptyStateAddBtn.addEventListener('click', () => {
  triggerHaptic(15);
  openAddEditModal();
});

// Sync Button trigger
syncBtn.addEventListener('click', () => {
  syncWithServer();
});

// --- Search & Filters ---
searchInput.addEventListener('input', (e) => {
  state.searchQuery = e.target.value;
  if (state.searchQuery.length > 0) {
    clearSearchBtn.classList.remove('hidden');
  } else {
    clearSearchBtn.classList.add('hidden');
  }
  renderStockList();
});

clearSearchBtn.addEventListener('click', () => {
  triggerHaptic(10);
  searchInput.value = '';
  state.searchQuery = '';
  clearSearchBtn.classList.add('hidden');
  searchInput.focus();
  renderStockList();
});

mainCategoryFilterSelect.addEventListener('change', (e) => {
  triggerHaptic(15);
  state.mainCategoryFilter = e.target.value;
  renderStockList();
});

filterSelect.addEventListener('change', (e) => {
  triggerHaptic(15);
  state.filter = e.target.value;
  renderStockList();
});

sortSelect.addEventListener('change', (e) => {
  triggerHaptic(15);
  state.sortBy = e.target.value;
  renderStockList();
});

// --- Import & Export Management ---

// JSON Export
exportJsonFileBtn.addEventListener('click', () => {
  triggerHaptic(15);
  const backupData = {
    stocks: state.stocks,
    mainCategories: state.mainCategories
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `stock_checker_backup_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  
  showToast('JSON Backup downloaded.');
});

// CSV Export
exportCsvBtn.addEventListener('click', () => {
  triggerHaptic(15);
  const headers = ['Stock Name', 'Category', 'Full Boxes', 'Half Boxes', 'Total Equivalent Boxes', 'Last Updated'];
  
  const csvRows = state.stocks.map(item => [
    `"${item.name.replace(/"/g, '""')}"`,
    `"${(item.mainCategory || 'Spun').replace(/"/g, '""')}"`,
    item.fullBoxes,
    item.halfBoxes,
    (item.fullBoxes + item.halfBoxes * 0.5).toFixed(1),
    item.updatedAt
  ]);
  
  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(','), ...csvRows.map(e => e.join(','))].join('\n');
    
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  
  downloadAnchor.setAttribute("href", encodeURI(csvContent));
  downloadAnchor.setAttribute("download", `stock_sheet_${dateStr}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  
  showToast('CSV Inventory Spreadsheet downloaded.');
});

// Import File Selector Change
importFile.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  fileNameDisplay.textContent = file.name;
  
  const reader = new FileReader();
  reader.onload = function(evt) {
    const fileContent = evt.target.result;
    
    if (file.name.endsWith('.json')) {
      handleJsonImport(fileContent);
    } else if (file.name.endsWith('.csv')) {
      handleCsvImport(fileContent);
    } else {
      showToast('Unsupported file type.', 'error');
    }
  };
  
  reader.onerror = () => showToast('Error reading backup file.', 'error');
  reader.readAsText(file);
});

function handleJsonImport(content) {
  try {
    const imported = JSON.parse(content);
    let importedStocks = [];
    let importedMainCategories = [];

    if (Array.isArray(imported)) {
      importedStocks = imported;
    } else if (imported && Array.isArray(imported.stocks)) {
      importedStocks = imported.stocks;
      if (Array.isArray(imported.mainCategories)) {
        importedMainCategories = imported.mainCategories.map(c => typeof c === 'string' ? c : (c.name || '')).filter(Boolean);
      } else if (Array.isArray(imported.stockTypes)) {
        importedMainCategories = imported.stockTypes.filter(Boolean);
      }
    } else {
      throw new Error('Invalid JSON structure.');
    }
    
    // Validate schema
    const validatedStocks = [];
    importedStocks.forEach(item => {
      if (item && typeof item.name === 'string') {
        validatedStocks.push({
          id: item.id || generateId(),
          name: item.name,
          mainCategory: item.mainCategory || item.type || (state.mainCategories[0] || 'Spun'),
          fullBoxes: Math.max(0, parseInt(item.fullBoxes, 10) || 0),
          halfBoxes: Math.max(0, parseInt(item.halfBoxes, 10) || 0),
          updatedAt: item.updatedAt || new Date().toISOString(),
          checked: item.checked === true
        });
      }
    });
    
    if (validatedStocks.length === 0) {
      showToast('No valid stock items found in file.', 'error');
      return;
    }
    
    state.stocks = validatedStocks;
    if (importedMainCategories.length > 0) {
      importedMainCategories.forEach(cat => {
        const exists = state.mainCategories.some(c => c.toLowerCase() === cat.toLowerCase());
        if (!exists) {
          state.mainCategories.push(cat);
        }
      });
    }
    
    saveState();
    populateTypeDropdowns();
    renderStockList();
    backupModal.classList.add('hidden');
    backupModal.setAttribute('aria-hidden', 'true');
    showToast(`Successfully imported ${validatedStocks.length} items.`);
  } catch (err) {
    console.error(err);
    showToast('Invalid backup file structure.', 'error');
  }
}

function handleCsvImport(content) {
  try {
    const lines = content.split('\n');
    if (lines.length <= 1) {
      showToast('CSV file is empty.', 'error');
      return;
    }
    
    const validated = [];
    
    // Standard CSV parser helper handling quotes
    const parseCsvLine = (text) => {
      let p = '', row = [''], inString = false;
      for (let i = 0; i < text.length; i++) {
        let c = text[i];
        if (c === '"') {
          if (inString && text[i+1] === '"') {
            row[row.length-1] += '"'; i++;
          } else {
            inString = !inString;
          }
        } else if (c === ',' && !inString) {
          row.push('');
        } else {
          row[row.length-1] += c;
        }
      }
      return row;
    };
    
    const headerCols = parseCsvLine(lines[0].trim()).map(h => h.toLowerCase());
    const catIdx = headerCols.findIndex(h => h.includes('category') || h.includes('type'));
    
    // Skip headers (line 0)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const columns = parseCsvLine(line);
      if (columns.length >= 3 && columns[0]) {
        let name = columns[0].trim();
        let mainCategory = catIdx !== -1 && columns[catIdx] ? columns[catIdx].trim() : (state.mainCategories[0] || 'Spun');
        let full = 0;
        let half = 0;
        
        if (catIdx !== -1) {
          full = parseInt(columns[catIdx + 1], 10) || 0;
          half = parseInt(columns[catIdx + 2], 10) || 0;
        } else {
          full = parseInt(columns[1], 10) || 0;
          half = parseInt(columns[2], 10) || 0;
        }
        
        validated.push({
          id: generateId(),
          name: name,
          mainCategory: mainCategory,
          fullBoxes: Math.max(0, full),
          halfBoxes: Math.max(0, half),
          updatedAt: new Date().toISOString(),
          checked: false
        });

        if (mainCategory && !state.mainCategories.some(c => c.toLowerCase() === mainCategory.toLowerCase())) {
          state.mainCategories.push(mainCategory);
        }
      }
    }
    
    if (validated.length === 0) {
      showToast('No valid rows found in CSV.', 'error');
      return;
    }
    
    // Append or overwrite confirmation
    if (confirm(`Do you want to REPLACE current list with ${validated.length} imported CSV items?\nClick 'Cancel' to APPEND them instead.`)) {
      state.stocks = validated;
    } else {
      // Append unique, merge duplicates or add fresh
      validated.forEach(newItem => {
        const existing = state.stocks.find(x => 
          x.name.toLowerCase() === newItem.name.toLowerCase() &&
          (x.mainCategory || '').toLowerCase() === (newItem.mainCategory || '').toLowerCase()
        );
        if (existing) {
          existing.fullBoxes += newItem.fullBoxes;
          existing.halfBoxes += newItem.halfBoxes;
          existing.updatedAt = new Date().toISOString();
        } else {
          state.stocks.push(newItem);
        }
      });
    }
    
    saveState();
    populateTypeDropdowns();
    renderStockList();
    backupModal.classList.add('hidden');
    backupModal.setAttribute('aria-hidden', 'true');
    showToast(`Inventory updated successfully.`);
  } catch (err) {
    console.error(err);
    showToast('Failed to parse CSV file.', 'error');
  }
}

// Clear all stock data
clearAllDataBtn.addEventListener('click', () => {
  triggerHaptic(40);
  if (confirm('WARNING: Are you sure you want to delete ALL stock items? This cannot be undone.')) {
    // Save emergency safety snapshot before clearing
    idbSet('backup_before_clear', {
      stocks: [...state.stocks],
      mainCategories: [...state.mainCategories],
      clearedAt: new Date().toISOString()
    });
    state.userExplicitlyClearedAll = true;
    state.stocks = [];
    saveState();
    backupModal.classList.add('hidden');
    backupModal.setAttribute('aria-hidden', 'true');
    showToast('All stock items cleared.', 'info');
  }
});

// Restore from Cloud button in Backup modal
if (restoreFromCloudBtn) {
  restoreFromCloudBtn.addEventListener('click', async () => {
    triggerHaptic(20);
    showToast('Fetching latest cloud backup...', 'info');
    await loadFromServer(true);
  });
}

// Firebase configuration management
saveFirebaseConfigBtn.addEventListener('click', async () => {
  triggerHaptic(20);
  const configText = firebaseConfigInput.value.trim();
  if (!configText) {
    showToast('Please enter a valid Firebase configuration JSON.', 'error');
    return;
  }
  
  try {
    const config = JSON.parse(configText);
    if (!config.apiKey || !config.projectId) {
      throw new Error('Config missing apiKey or projectId');
    }
    
    localStorage.setItem('firebaseConfig', configText);
    showToast('Firebase configuration saved!');
    initFirebase();
    await loadFromServer(true);
    backupModal.classList.add('hidden');
    backupModal.setAttribute('aria-hidden', 'true');
  } catch (err) {
    console.error('Invalid configuration structure:', err);
    showToast('Invalid JSON structure or missing credentials.', 'error');
  }
});

clearFirebaseConfigBtn.addEventListener('click', () => {
  triggerHaptic(20);
  if (firestoreUnsubscribe) {
    firestoreUnsubscribe();
    firestoreUnsubscribe = null;
  }
  localStorage.removeItem('firebaseConfig');
  state.useFirebase = false;
  state.db = null;
  firebaseConfigInput.value = '';
  updateSyncStatus(false);
  showToast('Firebase Cloud Sync disabled. Switched to persistent local mode.', 'info');
  backupModal.classList.add('hidden');
  backupModal.setAttribute('aria-hidden', 'true');
});

// --- App Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  requestPersistentStorage();
  initTheme();
  loadState(); // load local cache and persistent IndexedDB
  initFirebase(); // initialize Firebase if config is present
  saveState(false); // render immediately
  
  // Fetch latest from server
  loadFromServer();
  
  // Re-sync when app wakes up or gains focus (mobile browsers sleep tabs in background)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      console.log('App visible. Loading latest from server...');
      loadFromServer();
    }
  });
  
  window.addEventListener('focus', () => {
    console.log('App focused. Loading latest from server...');
    loadFromServer();
  });
  
  // Register Service Worker for PWA / offline support
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('Service Worker registered successfully!', reg.scope))
        .catch(err => console.error('Service Worker registration failed:', err));
    });
  }
});
