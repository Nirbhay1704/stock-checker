/**
 * Stock Checker Pro - Core Application Logic
 */

// --- Application State ---
let state = {
  stocks: [],
  stockTypes: [], // User-defined categories
  searchQuery: '',
  filter: 'all', // availability filter
  typeFilter: 'all', // category filter
  theme: 'dark',
  useFirebase: false,
  db: null
};

// --- DOM Elements ---
const themeToggleBtn = document.getElementById('themeToggleBtn');
const manageTypesBtn = document.getElementById('manageTypesBtn');
const syncBtn = document.getElementById('syncBtn');
const backupRestoreBtn = document.getElementById('backupRestoreBtn');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const filterSelect = document.getElementById('filterSelect');
const typeFilterSelect = document.getElementById('typeFilterSelect');
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
const stockNameInput = document.getElementById('stockNameInput');
const stockTypeInput = document.getElementById('stockTypeInput');
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
    // Load Stock Types first
    const savedTypes = localStorage.getItem('stockTypes');
    if (savedTypes) {
      state.stockTypes = JSON.parse(savedTypes);
    } else {
      state.stockTypes = [];
      localStorage.setItem('stockTypes', JSON.stringify(state.stockTypes));
    }

    // Load Stock List
    const savedStocks = localStorage.getItem('stocks');
    if (savedStocks) {
      state.stocks = JSON.parse(savedStocks);
    } else {
      // Load sample data if empty
      state.stocks = [
        { id: '1', name: 'Premium Lager (24x330ml)', type: '', fullBoxes: 5, halfBoxes: 2, updatedAt: new Date().toISOString() },
        { id: '2', name: 'Cola Zero (24x330ml)', type: '', fullBoxes: 12, halfBoxes: 1, updatedAt: new Date().toISOString() },
        { id: '3', name: 'Energy Soda (12x250ml)', type: '', fullBoxes: 0, halfBoxes: 3, updatedAt: new Date().toISOString() },
        { id: '4', name: 'Orange Juice Box (10x1L)', type: '', fullBoxes: 0, halfBoxes: 0, updatedAt: new Date().toISOString() }
      ];
      localStorage.setItem('stocks', JSON.stringify(state.stocks));
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
function mergeInventory(remoteStocks, remoteTypes, remoteUpdatedAt) {
  const remoteTime = new Date(remoteUpdatedAt || 0).getTime();
  const mergedStocks = [];
  
  // 1. Process items that exist locally
  state.stocks.forEach(localItem => {
    const remoteItem = remoteStocks.find(item => item.id === localItem.id);
    const localTime = new Date(localItem.updatedAt || 0).getTime();
    
    if (remoteItem) {
      // Item exists in both. Take the newer one.
      const remoteItemTime = new Date(remoteItem.updatedAt || 0).getTime();
      if (remoteItemTime > localTime) {
        mergedStocks.push(remoteItem);
      } else {
        mergedStocks.push(localItem);
      }
    } else {
      // Item exists locally but is missing in the remote list.
      // Was it deleted remotely, or was it created locally while offline?
      if (localTime > remoteTime) {
        // It was modified locally *after* the remote state was last saved. Keep it!
        mergedStocks.push(localItem);
      } else {
        // It was modified locally *before* the remote state was saved, but is missing remotely.
        // This means it was deleted remotely. Skip it (delete it locally).
      }
    }
  });
  
  // 2. Process items that exist remotely but not locally (created remotely)
  remoteStocks.forEach(remoteItem => {
    const existsLocally = state.stocks.some(item => item.id === remoteItem.id);
    if (!existsLocally) {
      mergedStocks.push(remoteItem);
    }
  });
  
  // Merge categories (stock types)
  const mergedTypes = Array.from(new Set([...state.stockTypes, ...remoteTypes]));
  
  return {
    stocks: mergedStocks,
    stockTypes: mergedTypes
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
          const merged = mergeInventory(data.stocks, data.stockTypes || [], data.updatedAt);
          
          const localStocksStr = JSON.stringify(state.stocks);
          const mergedStocksStr = JSON.stringify(merged.stocks);
          const localTypesStr = JSON.stringify(state.stockTypes);
          const mergedTypesStr = JSON.stringify(merged.stockTypes);
          
          if (localStocksStr !== mergedStocksStr || localTypesStr !== mergedTypesStr) {
            state.stocks = merged.stocks;
            state.stockTypes = merged.stockTypes;
            
            localStorage.setItem('stocks', JSON.stringify(state.stocks));
            localStorage.setItem('stockTypes', JSON.stringify(state.stockTypes));
            
            populateTypeDropdowns();
            updateDashboard();
            renderStockList();
            
            updateSyncStatus(true);
            showToast('Inventory synced with Cloud.', 'info');
          }
        }
      }
    }, (error) => {
      console.error('Firestore listener error:', error);
      updateSyncStatus(false);
    });
}

// Silent background server sync
async function autoSyncWithServer() {
  try {
    const payload = {
      stocks: state.stocks,
      stockTypes: state.stockTypes,
      updatedAt: new Date().toISOString()
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
    localStorage.setItem('stocks', JSON.stringify(state.stocks));
    localStorage.setItem('stockTypes', JSON.stringify(state.stockTypes));
    
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
          state.stocks = data.stocks;
          state.stockTypes = data.stockTypes || [];
          
          localStorage.setItem('stocks', JSON.stringify(state.stocks));
          localStorage.setItem('stockTypes', JSON.stringify(state.stockTypes));
          
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
      showToast('Failed to load from cloud.', 'error');
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
        state.stocks = data.stocks;
        if (Array.isArray(data.stockTypes)) {
          state.stockTypes = data.stockTypes;
        }
        
        // Update local storage cache
        localStorage.setItem('stocks', JSON.stringify(state.stocks));
        localStorage.setItem('stockTypes', JSON.stringify(state.stockTypes));
        
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
      stockTypes: state.stockTypes,
      updatedAt: new Date().toISOString()
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

// --- Stock Types Management ---
function populateTypeDropdowns() {
  const filterWrapper = typeFilterSelect.closest('.select-wrapper');
  const formGroupWrapper = stockTypeInput.closest('.form-group');
  
  if (state.stockTypes.length === 0) {
    if (filterWrapper) filterWrapper.classList.add('hidden');
    if (formGroupWrapper) formGroupWrapper.classList.add('hidden');
    state.typeFilter = 'all';
    return;
  }
  
  if (filterWrapper) filterWrapper.classList.remove('hidden');
  if (formGroupWrapper) formGroupWrapper.classList.remove('hidden');

  // 1. Populate Filter Dropdown in Toolbar
  const currentFilterVal = typeFilterSelect.value || 'all';
  typeFilterSelect.innerHTML = '<option value="all">All Types</option>';
  state.stockTypes.forEach(type => {
    typeFilterSelect.innerHTML += `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`;
  });
  typeFilterSelect.value = currentFilterVal;
  if (!typeFilterSelect.value) typeFilterSelect.value = 'all';

  // 2. Populate Dropdown in Stock Editor Form
  const currentEditVal = stockTypeInput.value || '';
  stockTypeInput.innerHTML = '';
  state.stockTypes.forEach(type => {
    stockTypeInput.innerHTML += `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`;
  });
  stockTypeInput.value = currentEditVal;
}

function renderTypesList() {
  if (state.stockTypes.length === 0) {
    typesListContainer.innerHTML = '<p class="file-name-display" style="padding: 1rem;">No custom categories defined.</p>';
    return;
  }

  typesListContainer.innerHTML = state.stockTypes.map(type => {
    return `
      <div class="type-item">
        <span>${escapeHtml(type)}</span>
        <div class="type-item-actions">
          <button class="icon-btn delete-btn" data-type="${escapeHtml(type)}" title="Delete Type" aria-label="Delete Type">
            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();

  // Attach delete listeners
  typesListContainer.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      triggerHaptic(25);
      const typeToDelete = btn.dataset.type;
      deleteStockType(typeToDelete);
    };
  });
}

function deleteStockType(typeToDelete) {
  const affectedCount = state.stocks.filter(item => item.type === typeToDelete).length;
  let confirmMsg = `Are you sure you want to delete the category "${typeToDelete}"?`;
  if (affectedCount > 0) {
    confirmMsg += `\nWarning: ${affectedCount} stock items belong to this category and will become uncategorized.`;
  }

  if (confirm(confirmMsg)) {
    // Reassign items
    state.stocks.forEach(item => {
      if (item.type === typeToDelete) {
        item.type = '';
        item.updatedAt = new Date().toISOString();
      }
    });

    state.stockTypes = state.stockTypes.filter(t => t !== typeToDelete);
    saveState();
    populateTypeDropdowns();
    renderTypesList();
    showToast(`Category "${typeToDelete}" deleted.`);
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
  const typeFilter = state.typeFilter;
  
  const filtered = state.stocks.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(query);
    const hasInventory = item.fullBoxes > 0 || item.halfBoxes > 0;
    
    // Check type filter
    const matchesType = typeFilter === 'all' || (item.type || '') === typeFilter;
    if (!matchesType) return false;
    
    if (filter === 'inStock') {
      return matchesSearch && hasInventory;
    } else if (filter === 'outOfStock') {
      return matchesSearch && !hasInventory;
    }
    return matchesSearch;
  });
  
  // Sort alphabetically by name
  filtered.sort((a, b) => a.name.localeCompare(b.name));
  
  // Toggle Empty State
  if (filtered.length === 0) {
    stockItemsList.innerHTML = '';
    emptyState.classList.remove('hidden');
    // If we have items in total but none match search, customize text
    if (state.stocks.length > 0) {
      emptyState.querySelector('h3').textContent = 'No Matches Found';
      emptyState.querySelector('p').textContent = `No stock items match your search or filter configuration.`;
      emptyStateAddBtn.classList.add('hidden');
    } else {
      emptyState.querySelector('h3').textContent = 'No Stock Items Found';
      emptyState.querySelector('p').textContent = 'Start by adding some stock items to track your daily inventory.';
      emptyStateAddBtn.classList.remove('hidden');
    }
  } else {
    emptyState.classList.add('hidden');
    
    // Efficiently render list items
    stockItemsList.innerHTML = filtered.map(item => {
      const equiv = (item.fullBoxes + item.halfBoxes * 0.5).toFixed(1);
      const isInStock = item.fullBoxes > 0 || item.halfBoxes > 0;
      const itemType = item.type || '';
      const showTypeBadge = state.stockTypes.length > 0 && itemType !== '';
      
      return `
        <div class="stock-item" data-id="${item.id}" role="listitem">
          
          <!-- Column 1: Stock Name and badges -->
          <div class="stock-name-wrapper">
            <span class="stock-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</span>
            <div style="display: flex; gap: 0.35rem; align-items: center; margin-top: 0.2rem; flex-wrap: wrap;">
              ${isInStock 
                ? `<span class="stock-badge-active">In Stock</span>` 
                : `<span class="stock-badge-low">Out of Stock</span>`
              }
              ${showTypeBadge 
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
      `;
    }).join('');
    
    lucide.createIcons();
    attachListEventListeners();
  }
}

// --- List Events (Edit, Delete, Increments) ---
function attachListEventListeners() {
  // Steppers logic inside list
  const stockElements = stockItemsList.querySelectorAll('.stock-item');
  
  stockElements.forEach(element => {
    const id = element.dataset.id;
    
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
    stockNameInput.value = item.name;
    stockTypeInput.value = item.type || '';
    stockFullInput.value = item.fullBoxes;
    stockHalfInput.value = item.halfBoxes;
  } else {
    modalTitle.textContent = 'Add Stock Item';
    stockIdInput.value = '';
    stockForm.reset();
    stockTypeInput.value = '';
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

// Submit Form (Save)
stockForm.addEventListener('submit', (e) => {
  e.preventDefault();
  resetFormErrors();
  
  const name = stockNameInput.value.trim();
  const type = state.stockTypes.length > 0 ? (stockTypeInput.value || '') : '';
  const full = parseInt(stockFullInput.value, 10) || 0;
  const half = parseInt(stockHalfInput.value, 10) || 0;
  const editId = stockIdInput.value;
  
  if (!name) {
    nameError.classList.add('visible');
    stockNameInput.classList.add('input-error');
    stockNameInput.focus();
    return;
  }
  
  // Check duplicates (same name AND same stock type, excluding editing item)
  const isDuplicate = state.stocks.some(item => 
    item.name.toLowerCase() === name.toLowerCase() && 
    (item.type || '') === type && 
    item.id !== editId
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
    // Edit existing
    const item = state.stocks.find(x => x.id === editId);
    if (item) {
      item.name = name;
      item.type = type;
      item.fullBoxes = Math.max(0, full);
      item.halfBoxes = Math.max(0, half);
      item.updatedAt = new Date().toISOString();
      showToast(`Updated "${name}"`);
    }
  } else {
    // Create new
    const newItem = {
      id: generateId(),
      name: name,
      type: type,
      fullBoxes: Math.max(0, full),
      halfBoxes: Math.max(0, half),
      updatedAt: new Date().toISOString()
    };
    state.stocks.push(newItem);
    showToast(`Added "${name}"`);
  }
  
  saveState();
  closeAddEditModal();
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

// Open Stock Types Modal
manageTypesBtn.addEventListener('click', () => {
  triggerHaptic(20);
  newTypeNameInput.value = '';
  renderTypesList();
  typesModal.classList.remove('hidden');
  typesModal.setAttribute('aria-hidden', 'false');
});

// Add Stock Type form submit
addTypeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newType = newTypeNameInput.value.trim();
  if (!newType) return;

  // Duplicate Check
  const isDuplicate = state.stockTypes.some(t => t.toLowerCase() === newType.toLowerCase());
  if (isDuplicate) {
    showToast('This stock type already exists.', 'error');
    newTypeNameInput.focus();
    return;
  }

  triggerHaptic(20);
  state.stockTypes.push(newType);
  saveState();
  populateTypeDropdowns();
  renderTypesList();
  newTypeNameInput.value = '';
  newTypeNameInput.focus();
  showToast(`Added category "${newType}".`);
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

filterSelect.addEventListener('change', (e) => {
  triggerHaptic(15);
  state.filter = e.target.value;
  renderStockList();
});

typeFilterSelect.addEventListener('change', (e) => {
  triggerHaptic(15);
  state.typeFilter = e.target.value;
  renderStockList();
});

// --- Import & Export Management ---

// JSON Export
exportJsonFileBtn.addEventListener('click', () => {
  triggerHaptic(15);
  const backupData = {
    stocks: state.stocks,
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
  const headers = ['Stock Name', 'Stock Type', 'Full Boxes', 'Half Boxes', 'Total Equivalent Boxes', 'Last Updated'];
  
  const csvRows = state.stocks.map(item => [
    `"${item.name.replace(/"/g, '""')}"`,
    `"${(item.type || 'General').replace(/"/g, '""')}"`,
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
    let importedTypes = [];

    if (Array.isArray(imported)) {
      importedStocks = imported;
    } else if (imported && Array.isArray(imported.stocks)) {
      importedStocks = imported.stocks;
      if (Array.isArray(imported.stockTypes)) {
        importedTypes = imported.stockTypes;
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
          type: item.type || 'General',
          fullBoxes: Math.max(0, parseInt(item.fullBoxes, 10) || 0),
          halfBoxes: Math.max(0, parseInt(item.halfBoxes, 10) || 0),
          updatedAt: item.updatedAt || new Date().toISOString()
        });
      }
    });
    
    if (validatedStocks.length === 0) {
      showToast('No valid stock items found in file.', 'error');
      return;
    }
    
    state.stocks = validatedStocks;
    if (importedTypes.length > 0) {
      importedTypes.forEach(t => {
        if (!state.stockTypes.includes(t)) {
          state.stockTypes.push(t);
        }
      });
    }
    
    saveState();
    populateTypeDropdowns();
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
    
    const headerCols = parseCsvLine(lines[0].trim());
    const hasTypeCol = headerCols.map(h => h.toLowerCase()).includes('stock type');
    
    // Skip headers (line 0)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const columns = parseCsvLine(line);
      if (columns.length >= 3 && columns[0]) {
        let name = columns[0].trim();
        let type = 'General';
        let full = 0;
        let half = 0;
        
        if (hasTypeCol) {
          type = columns[1] ? columns[1].trim() : 'General';
          full = parseInt(columns[2], 10) || 0;
          half = parseInt(columns[3], 10) || 0;
        } else {
          full = parseInt(columns[1], 10) || 0;
          half = parseInt(columns[2], 10) || 0;
        }
        
        validated.push({
          id: generateId(),
          name: name,
          type: type,
          fullBoxes: Math.max(0, full),
          halfBoxes: Math.max(0, half),
          updatedAt: new Date().toISOString()
        });
        
        if (type && !state.stockTypes.includes(type)) {
          state.stockTypes.push(type);
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
        const existing = state.stocks.find(x => x.name.toLowerCase() === newItem.name.toLowerCase());
        if (existing) {
          existing.fullBoxes += newItem.fullBoxes;
          existing.halfBoxes += newItem.halfBoxes;
          existing.type = newItem.type;
          existing.updatedAt = new Date().toISOString();
        } else {
          state.stocks.push(newItem);
        }
      });
    }
    
    saveState();
    populateTypeDropdowns();
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
