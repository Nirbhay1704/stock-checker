/**
 * Stock Checker Pro - Core Application Logic
 */

// --- Default Preloaded Categories & Yarn Colors ---
const DEFAULT_MAIN_CATEGORIES = [
  {
    name: 'Spun',
    subTypes: ['Red', 'Black', 'White', 'Navy Blue', 'Maroon', 'Gold', 'Green', 'Yellow', 'Pink', 'Grey', 'Orange', 'Rani', 'Rama', 'Firozi', 'Pista', 'Bottle Green', 'Wine', 'Silver', 'Copper']
  },
  {
    name: 'Lichi',
    subTypes: ['Red', 'Black', 'White', 'Navy Blue', 'Maroon', 'Gold', 'Green', 'Yellow', 'Pink', 'Grey', 'Orange', 'Rani', 'Rama', 'Firozi', 'Pista', 'Bottle Green', 'Wine', 'Silver', 'Copper']
  },
  {
    name: 'Champion',
    subTypes: ['Red', 'Black', 'White', 'Navy Blue', 'Maroon', 'Gold', 'Green', 'Yellow', 'Pink', 'Grey', 'Orange', 'Rani', 'Rama', 'Firozi', 'Pista', 'Bottle Green', 'Wine', 'Silver', 'Copper']
  }
];

// --- Application State ---
let state = {
  stocks: [],
  mainCategories: [], // [{ name: 'Spun', subTypes: [...] }]
  searchQuery: '',
  filter: 'all', // availability filter
  mainCategoryFilter: 'all', // main category filter
  typeFilter: 'all', // color / sub-type filter
  theme: 'dark',
  useFirebase: false,
  db: null,
  updatedAt: null,
  sortBy: 'name'
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
const typeFilterSelect = document.getElementById('typeFilterSelect');
const typeFilterWrapper = document.getElementById('typeFilterWrapper');
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
const stockTypeInput = document.getElementById('stockTypeInput');
const stockNameInput = document.getElementById('stockNameInput');
const stockFullInput = document.getElementById('stockFullInput');
const stockHalfInput = document.getElementById('stockHalfInput');
const nameError = document.getElementById('nameError');

const typesModal = document.getElementById('typesModal');
const addTypeForm = document.getElementById('addTypeForm');
const newTypeNameInput = document.getElementById('newTypeNameInput');
const typesListContainer = document.getElementById('typesListContainer');

const backupModal = document.getElementById('backupModal');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const exportJsonFileBtn = document.getElementById('exportJsonFileBtn');
const importFile = document.getElementById('importFile');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const clearAllDataBtn = document.getElementById('clearAllDataBtn');
const firebaseConfigInput = document.getElementById('firebaseConfigInput');
const saveFirebaseConfigBtn = document.getElementById('saveFirebaseConfigBtn');
const clearFirebaseConfigBtn = document.getElementById('clearFirebaseConfigBtn');
const toastContainer = document.getElementById('toastContainer');

// --- Helper Functions ---

// Generate Unique ID
function generateId() {
  return 'stock_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
}

// Touch/Haptic Vibration Feedback
function triggerHaptic(duration = 15) {
  if ('vibrate' in navigator) {
    navigator.vibrate(duration);
  }
}

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Toast Notifications
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconName = 'check-circle';
  if (type === 'error') iconName = 'alert-triangle';
  if (type === 'info') iconName = 'info';
  
  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <span class="toast-message">${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  lucide.createIcons();
  
  // Slide up and then fade out
  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, -20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// --- Theme Management ---
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
}

function setTheme(theme) {
  state.theme = theme;
  localStorage.setItem('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  
  const darkIcon = themeToggleBtn.querySelector('.theme-icon-dark');
  const lightIcon = themeToggleBtn.querySelector('.theme-icon-light');
  
  if (theme === 'light') {
    if (darkIcon) darkIcon.classList.add('hidden');
    if (lightIcon) lightIcon.classList.remove('hidden');
    themeToggleBtn.title = 'Switch to Dark Mode';
  } else {
    if (darkIcon) darkIcon.classList.remove('hidden');
    if (lightIcon) lightIcon.classList.add('hidden');
    themeToggleBtn.title = 'Switch to Light Mode';
  }
}

themeToggleBtn.addEventListener('click', () => {
  triggerHaptic(20);
  const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
});

// --- State Storage & Syncing ---
function loadState() {
  try {
    // 1. Load Main Categories & Sub-types
    const savedCategories = localStorage.getItem('mainCategories');
    if (savedCategories) {
      state.mainCategories = JSON.parse(savedCategories);
    } else {
      // Check if we have legacy stockTypes to migrate
      const legacyTypes = localStorage.getItem('stockTypes');
      if (legacyTypes && JSON.parse(legacyTypes).length > 0) {
        const parsed = JSON.parse(legacyTypes);
        state.mainCategories = [
          ...DEFAULT_MAIN_CATEGORIES,
          { name: 'Custom Quality', subTypes: parsed }
        ];
      } else {
        state.mainCategories = JSON.parse(JSON.stringify(DEFAULT_MAIN_CATEGORIES));
      }
      localStorage.setItem('mainCategories', JSON.stringify(state.mainCategories));
    }

    // 2. Load Stock List
    const savedStocks = localStorage.getItem('stocks');
    if (savedStocks) {
      state.stocks = JSON.parse(savedStocks);
      // Ensure all items have mainCategory set
      state.stocks.forEach(item => {
        if (!item.mainCategory) {
          item.mainCategory = 'Spun';
        }
      });
    } else {
      // Initial sample data for yarn qualities
      state.stocks = [
        { id: '1', name: 'Spun Red', mainCategory: 'Spun', type: 'Red', fullBoxes: 5, halfBoxes: 2, updatedAt: new Date().toISOString(), checked: false },
        { id: '2', name: 'Spun Black', mainCategory: 'Spun', type: 'Black', fullBoxes: 12, halfBoxes: 1, updatedAt: new Date().toISOString(), checked: false },
        { id: '3', name: 'Lichi Gold', mainCategory: 'Lichi', type: 'Gold', fullBoxes: 4, halfBoxes: 0, updatedAt: new Date().toISOString(), checked: false },
        { id: '4', name: 'Champion Maroon', mainCategory: 'Champion', type: 'Maroon', fullBoxes: 0, halfBoxes: 2, updatedAt: new Date().toISOString(), checked: false }
      ];
      localStorage.setItem('stocks', JSON.stringify(state.stocks));
    }

    // 3. Load Last Updated Timestamp
    const savedUpdatedAt = localStorage.getItem('stateUpdatedAt');
    if (savedUpdatedAt) {
      state.updatedAt = savedUpdatedAt;
    } else {
      let maxTime = 0;
      if (state.stocks && state.stocks.length > 0) {
        state.stocks.forEach(item => {
          const t = new Date(item.updatedAt || 0).getTime();
          if (t > maxTime) maxTime = t;
        });
      }
      state.updatedAt = maxTime > 0 ? new Date(maxTime).toISOString() : new Date().toISOString();
      localStorage.setItem('stateUpdatedAt', state.updatedAt);
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
  
  // Use default fallback if no config exists in localStorage
  if (!config) {
    config = DEFAULT_FIREBASE_CONFIG;
  }
  
  if (config && config.apiKey && config.projectId) {
    try {
      if (firebase.apps.length === 0) {
        firebase.initializeApp(config);
      }
      state.db = firebase.firestore();
      state.useFirebase = true;
      
      // Update config input textarea if it exists and localStorage has custom config
      if (firebaseConfigInput) {
        firebaseConfigInput.value = localStorage.getItem('firebaseConfig') || '';
      }
      
      // Set up real-time sync listener
      setupFirebaseListener();
      console.log('Firebase initialized successfully.');
    } catch (error) {
      console.error('Error parsing/initializing Firebase config:', error);
      showToast('Invalid Firebase configuration JSON.', 'error');
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

// Merge local and remote stock states based on updatedAt timestamps
function mergeInventory(remoteStocks, remoteCategories, remoteUpdatedAt) {
  const remoteTime = new Date(remoteUpdatedAt || 0).getTime();
  const localTime = new Date(state.updatedAt || 0).getTime();
  
  // If local state is newer or equal, we keep the local state
  if (localTime >= remoteTime) {
    return {
      stocks: state.stocks,
      mainCategories: state.mainCategories
    };
  }
  
  const mergedStocks = [];
  
  // 1. Process items that exist locally
  state.stocks.forEach(localItem => {
    const remoteItem = remoteStocks.find(item => item.id === localItem.id);
    const localItemTime = new Date(localItem.updatedAt || 0).getTime();
    
    if (remoteItem) {
      // Item exists in both. Take the newer one.
      const remoteItemTime = new Date(remoteItem.updatedAt || 0).getTime();
      if (remoteItemTime > localItemTime) {
        mergedStocks.push(remoteItem);
      } else {
        mergedStocks.push(localItem);
      }
    }
  });
  
  // 2. Process items that exist remotely but not locally (created remotely)
  remoteStocks.forEach(remoteItem => {
    const existsLocally = state.stocks.some(item => item.id === remoteItem.id);
    if (!existsLocally) {
      const remoteItemTime = new Date(remoteItem.updatedAt || 0).getTime();
      if (remoteItemTime > localTime) {
        mergedStocks.push(remoteItem);
      }
    }
  });
  
  // Merge categories
  let mergedCategories = state.mainCategories;
  if (Array.isArray(remoteCategories) && remoteCategories.length > 0) {
    mergedCategories = remoteCategories;
  }
  
  return {
    stocks: mergedStocks,
    mainCategories: mergedCategories
  };
}

// Real-time listener for Firestore document
function setupFirebaseListener() {
  if (firestoreUnsubscribe) {
    firestoreUnsubscribe();
  }
  
  if (!state.db) return;
  
  firestoreUnsubscribe = state.db.collection('inventory').doc('current_state')
    .onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        if (data && Array.isArray(data.stocks)) {
          // Merge remote updates with local state instead of doing a blind overwrite
          const merged = mergeInventory(data.stocks, data.mainCategories || data.stockTypes || [], data.updatedAt);
          
          const localStocksStr = JSON.stringify(state.stocks);
          const mergedStocksStr = JSON.stringify(merged.stocks);
          const localCatsStr = JSON.stringify(state.mainCategories);
          const mergedCatsStr = JSON.stringify(merged.mainCategories);
          
          if (localStocksStr !== mergedStocksStr || localCatsStr !== mergedCatsStr) {
            state.stocks = merged.stocks;
            state.mainCategories = merged.mainCategories;
            state.updatedAt = data.updatedAt || new Date().toISOString();
            
            localStorage.setItem('stocks', JSON.stringify(state.stocks));
            localStorage.setItem('mainCategories', JSON.stringify(state.mainCategories));
            localStorage.setItem('stateUpdatedAt', state.updatedAt);
            
            populateTypeDropdowns();
            updateDashboard();
            renderStockList();
            
            updateSyncStatus(true);
            showToast('Inventory synced with Cloud.', 'info');
          } else {
            // If identical, align our local timestamp if the server timestamp is newer
            const remoteTime = new Date(data.updatedAt || 0).getTime();
            const localTime = new Date(state.updatedAt || 0).getTime();
            if (remoteTime > localTime) {
              state.updatedAt = data.updatedAt;
              localStorage.setItem('stateUpdatedAt', state.updatedAt);
            }
          }
        }
      }
    }, (error) => {
      console.error('Firestore listener error:', error);
      updateSyncStatus(false);
      showToast(`Cloud Sync Connection Failed: ${error.message || error}`, 'error');
    });
}

// Silent background server sync
async function autoSyncWithServer() {
  try {
    const payload = {
      stocks: state.stocks,
      mainCategories: state.mainCategories,
      updatedAt: state.updatedAt || new Date().toISOString()
    };
    
    if (state.useFirebase) {
      if (!state.db) return;
      await state.db.collection('inventory').doc('current_state').set(payload);
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
    updateSyncStatus(false);
  }
}

function saveState(stocksUpdated = true) {
  if (stocksUpdated) {
    state.updatedAt = new Date().toISOString();
    localStorage.setItem('stocks', JSON.stringify(state.stocks));
    localStorage.setItem('mainCategories', JSON.stringify(state.mainCategories));
    localStorage.setItem('stateUpdatedAt', state.updatedAt);
    
    // Auto-sync in background, debounced by 1 second to optimize requests
    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      autoSyncWithServer();
    }, 1000);
  }
  updateDashboard();
  renderStockList();
}

// Fetch Inventory Data from Python Server or Firestore
async function loadFromServer() {
  if (state.useFirebase) {
    if (!state.db) return;
    try {
      const doc = await state.db.collection('inventory').doc('current_state').get();
      if (doc.exists) {
        const data = doc.data();
        if (data && Array.isArray(data.stocks)) {
          // Compare timestamps
          const remoteTime = new Date(data.updatedAt || 0).getTime();
          const localTime = new Date(state.updatedAt || 0).getTime();
          
          if (localTime > remoteTime) {
            console.log('Local state is newer than Firestore. Pushing local state to cloud...');
            autoSyncWithServer();
            return;
          }
          
          state.stocks = data.stocks;
          if (Array.isArray(data.mainCategories)) {
            state.mainCategories = data.mainCategories;
          }
          state.updatedAt = data.updatedAt || new Date().toISOString();
          
          localStorage.setItem('stocks', JSON.stringify(state.stocks));
          localStorage.setItem('mainCategories', JSON.stringify(state.mainCategories));
          localStorage.setItem('stateUpdatedAt', state.updatedAt);
          
          populateTypeDropdowns();
          saveState(false); // Recalculate stats and render
          updateSyncStatus(true);
          showToast('Loaded latest synced data from cloud.', 'info');
        }
      } else {
        // Initialize Firestore with local state
        await autoSyncWithServer();
      }
    } catch (err) {
      console.error('Error loading from Firestore:', err);
      updateSyncStatus(false);
      showToast(`Failed to load from cloud: ${err.message || err}`, 'error');
    }
  } else {
    // Check if we are running on a static live server (GitHub Pages)
    const isStaticHost = window.location.hostname.endsWith('github.io');
    if (isStaticHost) {
      console.log('Running on GitHub Pages without Firebase config. Using local storage fallback.');
      updateSyncStatus(false);
      return;
    }

    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Server returned error status');
      
      const data = await response.json();
      if (data && Array.isArray(data.stocks)) {
        // Compare timestamps
        const remoteTime = new Date(data.updatedAt || 0).getTime();
        const localTime = new Date(state.updatedAt || 0).getTime();
        
        if (localTime > remoteTime) {
          console.log('Local state is newer than Python server. Pushing local state...');
          autoSyncWithServer();
          return;
        }
        
        state.stocks = data.stocks;
        if (Array.isArray(data.mainCategories)) {
          state.mainCategories = data.mainCategories;
        }
        state.updatedAt = data.updatedAt || new Date().toISOString();
        
        // Update local storage cache
        localStorage.setItem('stocks', JSON.stringify(state.stocks));
        localStorage.setItem('mainCategories', JSON.stringify(state.mainCategories));
        localStorage.setItem('stateUpdatedAt', state.updatedAt);
        
        populateTypeDropdowns();
        saveState(false); // Recalculate stats and render
        updateSyncStatus(true);
        showToast('Loaded latest synced data from server.', 'info');
      }
    } catch (err) {
      console.warn('Could not connect to Python server. Running in Offline Mode.', err);
      updateSyncStatus(false);
    }
  }
}

// Save & Sync Inventory Data to Python Server or Firestore
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
  
  // Start spinning animation
  if (activeIcon) activeIcon.classList.add('spin');
  syncBtn.disabled = true;
  if (syncText) syncText.textContent = 'Syncing...';
  
  try {
    const payload = {
      stocks: state.stocks,
      mainCategories: state.mainCategories,
      updatedAt: state.updatedAt || new Date().toISOString()
    };
    
    if (state.useFirebase) {
      if (!state.db) throw new Error('Firestore not initialized');
      await state.db.collection('inventory').doc('current_state').set(payload);
      updateSyncStatus(true);
      showToast('Inventory saved & synced to global cloud!');
    } else {
      // Check if we are running on a static live server (GitHub Pages)
      const isStaticHost = window.location.hostname.endsWith('github.io');
      if (isStaticHost) {
        showToast('Please paste your Firebase Config in the Backup settings to sync your phone.', 'info');
        updateSyncStatus(false);
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
    if (state.useFirebase) {
      showToast(`Cloud Sync Error: ${err.message || 'Check database settings'}`, 'error');
    } else {
      showToast('Failed to save to computer server. Saved locally.', 'error');
    }
  } finally {
    // End spinning animation
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
    if (state.useFirebase) {
      syncBtn.title = 'Saved & Synced with Global Cloud';
    } else {
      syncBtn.title = 'Saved & Synced with Computer';
    }
    if (connectedIcon) connectedIcon.classList.remove('hidden');
    if (disconnectedIcon) disconnectedIcon.classList.add('hidden');
  } else {
    // Show secondary styling (warning color) to indicate local-only
    syncBtn.classList.remove('btn-primary');
    syncBtn.classList.add('btn-secondary');
    syncBtn.title = 'Offline Mode (Saved on this device only)';
    if (connectedIcon) connectedIcon.classList.add('hidden');
    if (disconnectedIcon) disconnectedIcon.classList.remove('hidden');
  }
}

// --- Main Categories & Yarn Colors Management ---
function populateTypeDropdowns() {
  if (!mainCategoryFilterSelect || !typeFilterSelect || !stockMainCategoryInput || !stockTypeInput) return;

  const mainCategories = state.mainCategories || [];
  
  // 1. Populate Main Category Filter Dropdown in Toolbar
  const currentMainFilter = state.mainCategoryFilter || 'all';
  mainCategoryFilterSelect.innerHTML = '<option value="all">All Categories</option>';
  mainCategories.forEach(cat => {
    mainCategoryFilterSelect.innerHTML += `<option value="${escapeHtml(cat.name)}">${escapeHtml(cat.name)}</option>`;
  });
  mainCategoryFilterSelect.value = currentMainFilter;
  if (!mainCategoryFilterSelect.value) {
    mainCategoryFilterSelect.value = 'all';
    state.mainCategoryFilter = 'all';
  }

  // 2. Populate Sub-Category / Color Filter in Toolbar based on chosen Main Category
  updateTypeFilterDropdown();

  // 3. Populate Main Category in Add/Edit Stock Form
  const currentEditMainCat = stockMainCategoryInput.value || (mainCategories.length > 0 ? mainCategories[0].name : 'Spun');
  stockMainCategoryInput.innerHTML = '';
  mainCategories.forEach(cat => {
    stockMainCategoryInput.innerHTML += `<option value="${escapeHtml(cat.name)}">${escapeHtml(cat.name)}</option>`;
  });
  stockMainCategoryInput.value = currentEditMainCat;
  if (!stockMainCategoryInput.value && mainCategories.length > 0) {
    stockMainCategoryInput.value = mainCategories[0].name;
  }

  // 4. Populate Sub-Category / Color in Add/Edit Stock Form
  updateStockFormSubtypeDropdown();
}

// Update the Sub-Category / Color filter dropdown based on current mainCategoryFilter
function updateTypeFilterDropdown() {
  const currentTypeFilter = state.typeFilter || 'all';
  const mainCatFilter = state.mainCategoryFilter || 'all';
  
  let availableTypes = [];
  if (mainCatFilter === 'all') {
    const typeSet = new Set();
    state.mainCategories.forEach(cat => {
      (cat.subTypes || []).forEach(st => typeSet.add(st));
    });
    availableTypes = Array.from(typeSet);
  } else {
    const foundCat = state.mainCategories.find(c => c.name === mainCatFilter);
    availableTypes = foundCat ? (foundCat.subTypes || []) : [];
  }

  typeFilterSelect.innerHTML = '<option value="all">All Colors</option>';
  availableTypes.forEach(t => {
    typeFilterSelect.innerHTML += `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`;
  });
  typeFilterSelect.value = currentTypeFilter;
  if (!typeFilterSelect.value) {
    typeFilterSelect.value = 'all';
    state.typeFilter = 'all';
  }
}

// Update Sub-Category dropdown in the Stock Add/Edit modal based on selected Main Category
function updateStockFormSubtypeDropdown(selectedSubtype = '') {
  const selectedMainCat = stockMainCategoryInput.value || (state.mainCategories[0] ? state.mainCategories[0].name : 'Spun');
  const foundCat = state.mainCategories.find(c => c.name === selectedMainCat);
  const subTypes = foundCat ? (foundCat.subTypes || []) : [];

  stockTypeInput.innerHTML = '';
  subTypes.forEach(st => {
    stockTypeInput.innerHTML += `<option value="${escapeHtml(st)}">${escapeHtml(st)}</option>`;
  });

  if (selectedSubtype && subTypes.includes(selectedSubtype)) {
    stockTypeInput.value = selectedSubtype;
  } else if (subTypes.length > 0) {
    stockTypeInput.value = subTypes[0];
  }

  // Auto-generate item name if adding new stock
  const isEditing = Boolean(stockIdInput.value);
  if (!isEditing && stockTypeInput.value) {
    stockNameInput.value = `${selectedMainCat} ${stockTypeInput.value}`;
  }
}

// Render the nested Category and Color management view in Types Modal
function renderTypesList() {
  if (!typesListContainer) return;
  const categories = state.mainCategories || [];
  
  if (categories.length === 0) {
    typesListContainer.innerHTML = '<p class="file-name-display" style="padding: 1rem;">No categories defined. Use the form above to add one.</p>';
    return;
  }

  typesListContainer.innerHTML = categories.map((cat, catIdx) => {
    const subTypes = cat.subTypes || [];
    const colorCount = subTypes.length;

    const chipsHtml = subTypes.map((st, stIdx) => `
      <span class="sub-type-chip">
        ${escapeHtml(st)}
        <button type="button" class="sub-type-chip-delete" data-cat-idx="${catIdx}" data-sub-idx="${stIdx}" title="Remove color" aria-label="Remove color">
          &times;
        </button>
      </span>
    `).join('');

    return `
      <div class="main-cat-card" data-cat-name="${escapeHtml(cat.name)}">
        <div class="main-cat-header">
          <div class="main-cat-info">
            <span class="main-cat-name">${escapeHtml(cat.name)}</span>
            <span class="main-cat-badge">${colorCount} ${colorCount === 1 ? 'color' : 'colors'}</span>
          </div>
          <div class="main-cat-actions">
            <button type="button" class="icon-btn rename-cat-btn" data-cat-name="${escapeHtml(cat.name)}" title="Rename Category" aria-label="Rename Category">
              <i data-lucide="pencil" style="width: 14px; height: 14px;"></i>
            </button>
            <button type="button" class="icon-btn delete-btn delete-cat-btn" data-cat-name="${escapeHtml(cat.name)}" title="Delete Category" aria-label="Delete Category">
              <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
            </button>
          </div>
        </div>

        <div class="sub-types-wrapper">
          <div class="sub-type-chips">
            ${chipsHtml.length > 0 ? chipsHtml : '<span style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">No colors added yet.</span>'}
          </div>

          <form class="add-subtype-form" data-cat-idx="${catIdx}">
            <input type="text" class="add-subtype-input" placeholder="Add yarn color (e.g. Red, Rani, Gold...)" required autocomplete="off">
            <button type="submit" class="add-subtype-btn">+ Add Color</button>
          </form>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();

  // Bind Rename Main Category buttons
  typesListContainer.querySelectorAll('.rename-cat-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      triggerHaptic(20);
      const catName = btn.dataset.catName;
      renameMainCategory(catName);
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

  // Bind Remove Subtype / Color chip buttons
  typesListContainer.querySelectorAll('.sub-type-chip-delete').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      triggerHaptic(15);
      const catIdx = parseInt(btn.dataset.catIdx, 10);
      const subIdx = parseInt(btn.dataset.subIdx, 10);
      deleteSubtypeFromCategory(catIdx, subIdx);
    };
  });

  // Bind Add Subtype inline forms
  typesListContainer.querySelectorAll('.add-subtype-form').forEach(form => {
    form.onsubmit = (e) => {
      e.preventDefault();
      const catIdx = parseInt(form.dataset.catIdx, 10);
      const input = form.querySelector('.add-subtype-input');
      const newSubtype = input.value.trim();
      if (!newSubtype) return;

      addSubtypeToCategory(catIdx, newSubtype);
      input.value = '';
      input.focus();
    };
  });
}

// Add a new Sub-type / Color to a Main Category
function addSubtypeToCategory(catIdx, colorName) {
  if (!state.mainCategories[catIdx]) return;
  const cat = state.mainCategories[catIdx];
  if (!cat.subTypes) cat.subTypes = [];

  const exists = cat.subTypes.some(st => st.toLowerCase() === colorName.toLowerCase());
  if (exists) {
    showToast(`Color "${colorName}" already exists in ${cat.name}.`, 'error');
    return;
  }

  triggerHaptic(15);
  cat.subTypes.push(colorName);
  saveState();
  populateTypeDropdowns();
  renderTypesList();
  syncWithServer();
  showToast(`Added "${colorName}" to ${cat.name}.`);
}

// Delete a Sub-type / Color from a Main Category
function deleteSubtypeFromCategory(catIdx, subIdx) {
  if (!state.mainCategories[catIdx]) return;
  const cat = state.mainCategories[catIdx];
  const colorName = cat.subTypes[subIdx];

  cat.subTypes.splice(subIdx, 1);
  saveState();
  populateTypeDropdowns();
  renderTypesList();
  syncWithServer();
  showToast(`Removed "${colorName}" from ${cat.name}.`);
}

// Rename a Main Category
function renameMainCategory(oldName) {
  const newName = prompt(`Enter a new name for Main Category "${oldName}":`, oldName);
  if (newName === null) return;
  const trimmed = newName.trim();
  if (!trimmed) {
    showToast('Category name cannot be empty.', 'error');
    return;
  }
  if (trimmed.toLowerCase() === oldName.toLowerCase() && trimmed === oldName) return;

  const isDuplicate = state.mainCategories.some(c => c.name.toLowerCase() === trimmed.toLowerCase() && c.name !== oldName);
  if (isDuplicate) {
    showToast(`Category "${trimmed}" already exists.`, 'error');
    return;
  }

  const cat = state.mainCategories.find(c => c.name === oldName);
  if (cat) cat.name = trimmed;

  // Update in existing stock items
  let count = 0;
  state.stocks.forEach(item => {
    if (item.mainCategory === oldName) {
      item.mainCategory = trimmed;
      item.updatedAt = new Date().toISOString();
      count++;
    }
  });

  saveState();
  populateTypeDropdowns();
  renderTypesList();
  syncWithServer();
  showToast(`Renamed "${oldName}" to "${trimmed}". Updated ${count} stock items.`);
}

// Delete a Main Category
function deleteMainCategory(catName) {
  const affectedCount = state.stocks.filter(item => item.mainCategory === catName).length;
  let confirmMsg = `Are you sure you want to delete category "${catName}" and all its colors?`;
  if (affectedCount > 0) {
    confirmMsg += `\nWarning: ${affectedCount} stock items belong to this category.`;
  }

  if (confirm(confirmMsg)) {
    state.mainCategories = state.mainCategories.filter(c => c.name !== catName);
    
    // Set fallback on affected stocks
    const fallbackCat = state.mainCategories.length > 0 ? state.mainCategories[0].name : '';
    state.stocks.forEach(item => {
      if (item.mainCategory === catName) {
        item.mainCategory = fallbackCat;
        item.updatedAt = new Date().toISOString();
      }
    });

    saveState();
    populateTypeDropdowns();
    renderTypesList();
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
    totalFull += item.fullBoxes;
    totalHalf += item.halfBoxes;
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
  const typeFilter = state.typeFilter;
  
  const filtered = state.stocks.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(query) || 
                          (item.mainCategory && item.mainCategory.toLowerCase().includes(query)) ||
                          (item.type && item.type.toLowerCase().includes(query));
    const hasInventory = item.fullBoxes > 0 || item.halfBoxes > 0;
    
    // Check main category filter
    const matchesMainCat = mainCatFilter === 'all' || (item.mainCategory || '') === mainCatFilter;
    if (!matchesMainCat) return false;

    // Check type/color filter
    const matchesType = typeFilter === 'all' || (item.type || '') === typeFilter;
    if (!matchesType) return false;
    
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
      const equivA = a.fullBoxes + a.halfBoxes * 0.5;
      const equivB = b.fullBoxes + b.halfBoxes * 0.5;
      return equivB - equivA || a.name.localeCompare(b.name);
    });
  } else if (sortBy === 'boxesAsc') {
    filtered.sort((a, b) => {
      const equivA = a.fullBoxes + a.halfBoxes * 0.5;
      const equivB = b.fullBoxes + b.halfBoxes * 0.5;
      return equivA - equivB || a.name.localeCompare(b.name);
    });
  } else {
    // Default: Sort alphabetically by name
    filtered.sort((a, b) => a.name.localeCompare(b.name));
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
      const equiv = (item.fullBoxes + item.halfBoxes * 0.5).toFixed(1);
      const isInStock = item.fullBoxes > 0 || item.halfBoxes > 0;
      const itemMainCat = item.mainCategory || 'Spun';
      const itemType = item.type || '';
      
      return `
        <div class="stock-item ${item.checked ? 'checked' : ''}" data-id="${item.id}" role="listitem">
          
          <!-- Checkbox Column -->
          <div class="col-check">
            <input type="checkbox" class="custom-checkbox stock-checkbox" data-id="${item.id}" ${item.checked ? 'checked' : ''} aria-label="Check stock item">
          </div>
          
          <div class="stock-card-content">
            <!-- Column 1: Stock Name and badges -->
            <div class="stock-name-wrapper">
              <span class="stock-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</span>
              <div style="display: flex; gap: 0.35rem; align-items: center; margin-top: 0.25rem; flex-wrap: wrap;">
                ${isInStock 
                  ? `<span class="stock-badge-active">In Stock</span>` 
                  : `<span class="stock-badge-low">Out of Stock</span>`
                }
                <span class="stock-badge-main-cat">${escapeHtml(itemMainCat)}</span>
                ${itemType 
                  ? `<span class="stock-badge-type">${escapeHtml(itemType)}</span>` 
                  : ''
                }
              </div>
            </div>
            
            <!-- Desktop Counter wrappers (display: contents on desktop) -->
            <div class="stock-item-row-mobile-counters">
              
              <!-- Column 2: Full Boxes -->
              <div class="stock-item-counter-group">
                <span class="stock-item-counter-group-label">Full Boxes</span>
                <div class="stock-counter">
                  <button class="stock-counter-btn decrement-btn" data-field="fullBoxes" data-id="${item.id}" aria-label="Decrease Full Boxes">-</button>
                  <span class="stock-counter-val">${item.fullBoxes}</span>
                  <button class="stock-counter-btn increment-btn" data-field="fullBoxes" data-id="${item.id}" aria-label="Increase Full Boxes">+</button>
                </div>
              </div>
              
              <!-- Column 3: Half Boxes -->
              <div class="stock-item-counter-group">
                <span class="stock-item-counter-group-label">Half Boxes</span>
                <div class="stock-counter">
                  <button class="stock-counter-btn decrement-btn" data-field="halfBoxes" data-id="${item.id}" aria-label="Decrease Half Boxes">-</button>
                  <span class="stock-counter-val">${item.halfBoxes}</span>
                  <button class="stock-counter-btn increment-btn" data-field="halfBoxes" data-id="${item.id}" aria-label="Increase Half Boxes">+</button>
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
                <button class="icon-btn edit-btn" data-id="${item.id}" title="Edit Name" aria-label="Edit Stock Name">
                  <i data-lucide="pencil"></i>
                </button>
                <button class="icon-btn delete-btn" data-id="${item.id}" title="Delete Stock" aria-label="Delete Stock Item">
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
    const typeFilter = state.typeFilter;
    const filtered = state.stocks.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(query) || 
                            (item.mainCategory && item.mainCategory.toLowerCase().includes(query)) ||
                            (item.type && item.type.toLowerCase().includes(query));
      const hasInventory = item.fullBoxes > 0 || item.halfBoxes > 0;
      const matchesMainCat = mainCatFilter === 'all' || (item.mainCategory || '') === mainCatFilter;
      if (!matchesMainCat) return false;
      const matchesType = typeFilter === 'all' || (item.type || '') === typeFilter;
      if (!matchesType) return false;
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
    const id = element.dataset.id;
    
    // Checkbox change handler
    const checkbox = element.querySelector('.stock-checkbox');
    if (checkbox) {
      checkbox.onchange = (e) => {
        e.stopPropagation();
        const checked = checkbox.checked;
        const item = state.stocks.find(x => x.id === id);
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
    element.querySelector('.edit-btn').onclick = (e) => {
      e.stopPropagation();
      triggerHaptic(20);
      openAddEditModal(id);
    };
    
    // Delete action
    element.querySelector('.delete-btn').onclick = (e) => {
      e.stopPropagation();
      triggerHaptic(30);
      deleteStockItem(id);
    };
  });
}

function updateStockCount(id, field, change) {
  const stockIndex = state.stocks.findIndex(item => item.id === id);
  if (stockIndex !== -1) {
    const item = state.stocks[stockIndex];
    const currentVal = item[field] || 0;
    const newVal = Math.max(0, currentVal + change);
    
    if (currentVal !== newVal) {
      item[field] = newVal;
      item.updatedAt = new Date().toISOString();
      saveState();
    }
  }
}

function deleteStockItem(id) {
  const stockIndex = state.stocks.findIndex(item => item.id === id);
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
  
  if (editId) {
    const item = state.stocks.find(x => x.id === editId);
    if (!item) return;
    modalTitle.textContent = 'Edit Stock Item';
    stockIdInput.value = item.id;
    stockMainCategoryInput.value = item.mainCategory || (state.mainCategories[0] ? state.mainCategories[0].name : 'Spun');
    updateStockFormSubtypeDropdown(item.type || '');
    stockNameInput.value = item.name;
    stockFullInput.value = item.fullBoxes;
    stockHalfInput.value = item.halfBoxes;
  } else {
    modalTitle.textContent = 'Add Stock Item';
    stockIdInput.value = '';
    stockForm.reset();
    if (state.mainCategories.length > 0) {
      stockMainCategoryInput.value = state.mainCategories[0].name;
    }
    updateStockFormSubtypeDropdown();
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
  
  const mainCategory = stockMainCategoryInput.value || (state.mainCategories[0] ? state.mainCategories[0].name : 'Spun');
  const type = stockTypeInput.value || '';
  const name = stockNameInput.value.trim() || `${mainCategory} ${type}`;
  const full = parseInt(stockFullInput.value, 10) || 0;
  const half = parseInt(stockHalfInput.value, 10) || 0;
  const editId = stockIdInput.value;
  
  if (!name) {
    nameError.classList.add('visible');
    stockNameInput.classList.add('input-error');
    stockNameInput.focus();
    return;
  }
  
  // Duplicate Check
  const isDuplicate = state.stocks.some(item => 
    item.name.toLowerCase() === name.toLowerCase() && 
    (item.mainCategory || '') === mainCategory && 
    (item.type || '') === type && 
    item.id !== editId
  );
  
  if (isDuplicate) {
    nameError.textContent = 'A stock item with this name, category, and color already exists';
    nameError.classList.add('visible');
    stockNameInput.classList.add('input-error');
    stockNameInput.focus();
    return;
  }
  
  triggerHaptic(20);
  
  if (editId) {
    const item = state.stocks.find(x => x.id === editId);
    if (item) {
      item.name = name;
      item.mainCategory = mainCategory;
      item.type = type;
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
      type: type,
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

// Main Category change in Add/Edit modal updates Color dropdown
stockMainCategoryInput.addEventListener('change', () => {
  updateStockFormSubtypeDropdown();
});

// Color change in Add/Edit modal updates item name if new item
stockTypeInput.addEventListener('change', () => {
  const isEditing = Boolean(stockIdInput.value);
  if (!isEditing && stockTypeInput.value) {
    stockNameInput.value = `${stockMainCategoryInput.value} ${stockTypeInput.value}`;
  }
});

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

// Open Stock Types & Categories Modal
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
    reportText += `• ${item.name} (${item.type || 'Color'}): ${equiv.toFixed(1)} boxes\n`;
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
          <span class="low-stock-item-name">${escapeHtml(item.name)} ${item.type ? `(${escapeHtml(item.type)})` : ''}</span>
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

  const isDuplicate = state.mainCategories.some(c => c.name.toLowerCase() === newCatName.toLowerCase());
  if (isDuplicate) {
    showToast('This category already exists.', 'error');
    newTypeNameInput.focus();
    return;
  }

  triggerHaptic(20);
  state.mainCategories.push({
    name: newCatName,
    subTypes: ['Red', 'Black', 'White', 'Navy Blue', 'Maroon', 'Gold', 'Green', 'Yellow', 'Pink', 'Grey', 'Orange', 'Rani', 'Rama', 'Firozi', 'Pista', 'Bottle Green', 'Wine', 'Silver', 'Copper']
  });
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
  updateTypeFilterDropdown();
  renderStockList();
});

typeFilterSelect.addEventListener('change', (e) => {
  triggerHaptic(15);
  state.typeFilter = e.target.value;
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
    mainCategories: state.mainCategories,
    stockTypes: state.stockTypes
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
  const headers = ['Stock Name', 'Main Category', 'Color / Type', 'Full Boxes', 'Half Boxes', 'Total Equivalent Boxes', 'Last Updated'];
  
  const csvRows = state.stocks.map(item => [
    `"${item.name.replace(/"/g, '""')}"`,
    `"${(item.mainCategory || 'Spun').replace(/"/g, '""')}"`,
    `"${(item.type || '').replace(/"/g, '""')}"`,
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
        importedMainCategories = imported.mainCategories;
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
          mainCategory: item.mainCategory || 'Spun',
          type: item.type || '',
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
        const existing = state.mainCategories.find(c => c.name.toLowerCase() === cat.name.toLowerCase());
        if (existing) {
          if (Array.isArray(cat.subTypes)) {
            cat.subTypes.forEach(st => {
              if (!existing.subTypes.includes(st)) existing.subTypes.push(st);
            });
          }
        } else {
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
    const mainCatIdx = headerCols.findIndex(h => h.includes('main category') || h.includes('category'));
    const colorTypeIdx = headerCols.findIndex(h => h.includes('color') || h.includes('type'));
    
    // Skip headers (line 0)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const columns = parseCsvLine(line);
      if (columns.length >= 3 && columns[0]) {
        let name = columns[0].trim();
        let mainCategory = mainCatIdx !== -1 && columns[mainCatIdx] ? columns[mainCatIdx].trim() : 'Spun';
        let type = colorTypeIdx !== -1 && columns[colorTypeIdx] ? columns[colorTypeIdx].trim() : '';
        let full = 0;
        let half = 0;
        
        // Find full & half box column indices or default positions
        if (mainCatIdx !== -1 && colorTypeIdx !== -1) {
          full = parseInt(columns[3], 10) || 0;
          half = parseInt(columns[4], 10) || 0;
        } else if (colorTypeIdx !== -1) {
          full = parseInt(columns[2], 10) || 0;
          half = parseInt(columns[3], 10) || 0;
        } else {
          full = parseInt(columns[1], 10) || 0;
          half = parseInt(columns[2], 10) || 0;
        }
        
        validated.push({
          id: generateId(),
          name: name,
          mainCategory: mainCategory,
          type: type,
          fullBoxes: Math.max(0, full),
          halfBoxes: Math.max(0, half),
          updatedAt: new Date().toISOString(),
          checked: false
        });
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
          (x.mainCategory || '').toLowerCase() === (newItem.mainCategory || '').toLowerCase() &&
          (x.type || '').toLowerCase() === (newItem.type || '').toLowerCase()
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
    state.stocks = [];
    saveState();
    backupModal.classList.add('hidden');
    backupModal.setAttribute('aria-hidden', 'true');
    showToast('All stock items cleared.', 'info');
  }
});

// Firebase configuration management
saveFirebaseConfigBtn.addEventListener('click', async () => {
  triggerHaptic(20);
  const configText = firebaseConfigInput.value.trim();
  if (!configText) {
    showToast('Please enter a valid Firebase configuration JSON.', 'error');
    return;
  }
  
  try {
    // Validate JSON structure
    const config = JSON.parse(configText);
    if (!config.apiKey || !config.projectId) {
      throw new Error('Config missing apiKey or projectId');
    }
    
    // Save to local storage
    localStorage.setItem('firebaseConfig', configText);
    showToast('Firebase configuration saved!');
    
    // Initialize
    initFirebase();
    
    // Immediate sync
    await loadFromServer();
    
    // Close backup modal
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
  showToast('Firebase Cloud Sync disabled. Switched back to local mode.', 'info');
  
  // Close backup modal
  backupModal.classList.add('hidden');
  backupModal.setAttribute('aria-hidden', 'true');
});

// --- App Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadState(); // load local cache first
  initFirebase(); // initialize Firebase if config is present
  saveState(false); // render local cache immediately
  
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
