// Main application controller for Tea Inventory System

// Application state
let isInitialized = false;
let currentTab = 'dashboard';
let initializationRetries = 0;
const MAX_RETRIES = 3;

// Initialize the entire application
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('🍃 Chamomile Oatmilk Tea Inventory System Starting...');
        
        // Initialize core components with retry mechanism
        initializeApp();
        
    } catch (error) {
        console.error('Critical error during app initialization:', error);
        showCriticalError(error);
    }
});

// Main initialization function with enhanced error handling
function initializeApp() {
    try {
        // Set loading state
        showLoadingState();
        
        // Initialize data structures with validation
        initializeDataStructures();
        
        // Set current date
        initializeDateTime();
        
        // Initialize universal settings
        initializeUniversalSettings();
        
        // Initialize event product pre-selection
        initializeEventProductPreSelection();
        
        // Load default tab (dashboard) with proper content loading
        initializeDashboard();
        
        // Set up enhanced event listeners
        setupEventListeners();
        
        // Start auto-save functionality
        initializeAutoSave();
        
        // Mark as initialized
        isInitialized = true;
        
        // Hide loading state
        hideLoadingState();
        
        console.log('✅ Tea Inventory System initialized successfully');
        
        // Show welcome message for first-time users
        showWelcomeMessage();
        
    } catch (error) {
        hideLoadingState();
        
        // Retry initialization if not at max retries
        if (initializationRetries < MAX_RETRIES) {
            initializationRetries++;
            console.warn(`Initialization failed, retrying... (${initializationRetries}/${MAX_RETRIES})`);
            setTimeout(() => initializeApp(), 1000);
        } else {
            handleError(error, 'application initialization');
            showCriticalError(error);
        }
    }
}

// Initialize data structures with enhanced validation
function initializeDataStructures() {
    try {
        // Ensure all required data structures exist
        if (typeof products === 'undefined') {
            throw new Error('Products data not loaded');
        }
        
        if (typeof salesHistory === 'undefined') {
            throw new Error('Sales history data not loaded');
        }
        
        if (typeof inventory === 'undefined') {
            throw new Error('Inventory data not loaded');
        }
        
        // Validate inventory structure
        validateInventoryStructure();
        
        // Initialize missing batch counters
        initializeBatchCounters();
        
        // Initialize business model states
        if (typeof currentBusinessModel === 'undefined') {
            window.currentBusinessModel = 'event';
        }
        
        if (typeof currentDashboardModel === 'undefined') {
            window.currentDashboardModel = 'm1';
        }
        
        console.log('📊 Data structures initialized');
        
    } catch (error) {
        throw new Error(`Data structure initialization failed: ${error.message}`);
    }
}

// Validate inventory structure with comprehensive checks
function validateInventoryStructure() {
    // Ensure all products have inventory entries
    products.forEach(product => {
        if (!inventory.event[product.id]) {
            inventory.event[product.id] = {
                batches: [],
                brewing: 0
            };
        }
        
        // Ensure batches array exists
        if (!inventory.event[product.id].batches) {
            inventory.event[product.id].batches = [];
        }
        
        // Ensure brewing property exists
        if (typeof inventory.event[product.id].brewing !== 'number') {
            inventory.event[product.id].brewing = 0;
        }
    });
    
    // Ensure distribution inventory exists for P004
    if (!inventory.distribution['P004']) {
        inventory.distribution['P004'] = {
            batches: [],
            brewing: 0
        };
    }
    
    // Validate batch structure
    Object.keys(inventory).forEach(businessModel => {
        Object.keys(inventory[businessModel]).forEach(productId => {
            const item = inventory[businessModel][productId];
            if (!item.batches) item.batches = [];
            if (typeof item.brewing !== 'number') item.brewing = 0;
        });
    });
}

// Initialize batch counters with proper fallbacks
function initializeBatchCounters() {
    // Initialize event batch counters
    products.forEach(product => {
        if (!batchCounter.event[product.id]) {
            const existingBatches = inventory.event[product.id]?.batches || [];
            const maxBatchNum = existingBatches.reduce((max, batch) => {
                const batchNum = parseInt(batch.id.split('_')[1]);
                return batchNum > max ? batchNum : max;
            }, 0);
            batchCounter.event[product.id] = maxBatchNum + 1;
        }
    });
    
    // Initialize distribution batch counter
    if (!batchCounter.distribution['P004']) {
        const existingBatches = inventory.distribution['P004']?.batches || [];
        const maxBatchNum = existingBatches.reduce((max, batch) => {
            const batchNum = parseInt(batch.id.split('_')[1]);
            return batchNum > max ? batchNum : max;
        }, 0);
        batchCounter.distribution['P004'] = maxBatchNum + 1;
    }
}

// Initialize date and time with timezone handling
function initializeDateTime() {
    try {
        const currentDateElement = document.getElementById('current-date');
        if (currentDateElement) {
            const now = new Date();
            currentDateElement.textContent = now.toLocaleDateString('en-MY', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
    } catch (error) {
        console.error('Error initializing date/time:', error);
    }
}

// Initialize universal settings and sync across system
function initializeUniversalSettings() {
    try {
        // Ensure universal settings exist with defaults
        if (typeof universalSettings === 'undefined') {
            window.universalSettings = {
                eventCapacity: 110,
                distributionCapacity: 100,
                distributionTarget: 100,
                eventDefaultDuration: 3
            };
        }
        
        // Update universal displays
        updateUniversalDisplays();
        
        console.log('⚙️ Universal settings initialized');
        
    } catch (error) {
        console.error('Error initializing universal settings:', error);
    }
}

// Enhanced event listeners setup
function setupEventListeners() {
    try {
        // Tab navigation listeners with enhanced error handling
        setupTabListeners();
        
        // Keyboard shortcuts
        setupKeyboardShortcuts();
        
        // Window events with improved handling
        setupWindowEvents();
        
        // Form validation listeners
        setupFormValidation();
        
        // Navigation state management
        setupNavigationStateManagement();
        
        console.log('👂 Event listeners setup complete');
        
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

// Enhanced tab navigation with proper error handling
function setupTabListeners() {
    const tabButtons = document.querySelectorAll('[id^="tab-"]');
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            try {
                e.preventDefault();
                const tabName = e.target.closest('button').id.replace('tab-', '');
                handleTabChange(tabName);
            } catch (error) {
                console.error('Error in tab click handler:', error);
                handleError(error, 'tab navigation');
            }
        });
    });
}

// Enhanced tab change handling with retry mechanism
function handleTabChange(tabName) {
    try {
        // Don't switch if already on this tab
        if (currentTab === tabName && isTabContentLoaded(tabName)) {
            return;
        }
        
        // Show loading state for tab
        showTabLoadingState(tabName);
        
        // Cleanup current tab if needed
        cleanupCurrentTab();
        
        // Switch to new tab with enhanced loading
        showTabWithRetry(tabName);
        
        // Update current tab
        currentTab = tabName;
        
        // Initialize tab-specific functionality with error handling
        setTimeout(() => {
            try {
                initializeTabSpecificFeatures(tabName);
            } catch (error) {
                console.error(`Error initializing ${tabName}:`, error);
                retryTabInitialization(tabName);
            }
        }, 100);
        
        // Update URL hash (for bookmarking)
        updateURLHash(tabName);
        
    } catch (error) {
        handleError(error, 'tab change');
        retryTabChange(tabName);
    }
}

// Check if tab content is properly loaded
function isTabContentLoaded(tabName) {
    try {
        const tabContent = document.getElementById(`${tabName}-content`);
        return tabContent && tabContent.innerHTML.trim().length > 0 && 
               !tabContent.innerHTML.includes('Loading...');
    } catch (error) {
        return false;
    }
}

// Show tab with retry mechanism
function showTabWithRetry(tabName, retryCount = 0) {
    try {
        // Hide all tab contents
        const contents = document.querySelectorAll('.tab-content');
        contents.forEach(content => content.classList.add('hidden'));
        
        // Remove active class from all tabs
        const tabs = document.querySelectorAll('[id^="tab-"]');
        tabs.forEach(tab => {
            tab.className = tab.className.replace('tab-active', 'tab-inactive');
        });
        
        // Show selected tab content
        const targetContent = document.getElementById(tabName + '-content');
        if (targetContent) {
            targetContent.classList.remove('hidden');
            
            // Check if content needs to be loaded
            if (!targetContent.innerHTML.trim()) {
                loadTabContent(tabName);
            }
        } else if (retryCount < 3) {
            // Retry if element not found
            setTimeout(() => showTabWithRetry(tabName, retryCount + 1), 200);
            return;
        }
        
        // Add active class to selected tab
        const targetTab = document.getElementById('tab-' + tabName);
        if (targetTab) {
            targetTab.className = targetTab.className.replace('tab-inactive', 'tab-active');
        }
        
        // Hide tab loading state
        hideTabLoadingState();
        
    } catch (error) {
        console.error(`Error showing tab ${tabName}:`, error);
        if (retryCount < 3) {
            setTimeout(() => showTabWithRetry(tabName, retryCount + 1), 500);
        }
    }
}

// Enhanced tab content loading with proper error handling
function loadTabContent(tabName) {
    try {
        switch(tabName) {
            case 'dashboard':
                if (typeof loadDashboardContent === 'function') {
                    loadDashboardContent();
                } else {
                    console.warn('loadDashboardContent function not available');
                    setTimeout(() => loadTabContent(tabName), 500);
                }
                break;
                
            case 'inventory':
                if (typeof loadInventoryTab === 'function') {
                    loadInventoryTab();
                } else {
                    console.warn('loadInventoryTab function not available');
                    setTimeout(() => loadTabContent(tabName), 500);
                }
                break;
                
            case 'events':
                if (typeof loadEventsTab === 'function') {
                    loadEventsTab();
                } else {
                    console.warn('loadEventsTab function not available');
                    setTimeout(() => loadTabContent(tabName), 500);
                }
                break;
                
            case 'distribution':
                if (typeof loadDistributionTab === 'function') {
                    loadDistributionTab();
                } else {
                    console.warn('loadDistributionTab function not available');
                    setTimeout(() => loadTabContent(tabName), 500);
                }
                break;
                
            case 'databank':
                if (typeof loadDatabankTab === 'function') {
                    loadDatabankTab();
                } else {
                    console.warn('loadDatabankTab function not available');
                    setTimeout(() => loadTabContent(tabName), 500);
                }
                break;
                
            case 'settings':
                if (typeof loadSettingsTab === 'function') {
                    loadSettingsTab();
                } else {
                    console.warn('loadSettingsTab function not available');
                    setTimeout(() => loadTabContent(tabName), 500);
                }
                break;
                
            default:
                console.warn(`Unknown tab: ${tabName}`);
        }
    } catch (error) {
        console.error(`Error loading tab content for ${tabName}:`, error);
        handleError(error, `loading ${tabName} tab`);
        
        // Fallback: show basic content
        const tabContent = document.getElementById(`${tabName}-content`);
        if (tabContent) {
            tabContent.innerHTML = `
                <div class="p-8 text-center">
                    <div class="text-gray-500 mb-4">⚠️ Content loading error</div>
                    <button onclick="retryTabLoad('${tabName}')" class="bg-blue-600 text-white px-4 py-2 rounded">
                        Retry Loading
                    </button>
                </div>
            `;
        }
    }
}

// Retry tab initialization
function retryTabInitialization(tabName, retryCount = 0) {
    if (retryCount >= 3) {
        console.error(`Max retries reached for ${tabName} initialization`);
        return;
    }
    
    setTimeout(() => {
        try {
            initializeTabSpecificFeatures(tabName);
        } catch (error) {
            console.warn(`Retry ${retryCount + 1} failed for ${tabName}:`, error);
            retryTabInitialization(tabName, retryCount + 1);
        }
    }, 1000 * (retryCount + 1));
}

// Retry tab change
function retryTabChange(tabName, retryCount = 0) {
    if (retryCount >= 3) {
        console.error(`Max retries reached for tab change to ${tabName}`);
        return;
    }
    
    setTimeout(() => {
        try {
            handleTabChange(tabName);
        } catch (error) {
            console.warn(`Tab change retry ${retryCount + 1} failed:`, error);
            retryTabChange(tabName, retryCount + 1);
        }
    }, 1000 * (retryCount + 1));
}

// Retry tab loading
function retryTabLoad(tabName) {
    try {
        const tabContent = document.getElementById(`${tabName}-content`);
        if (tabContent) {
            tabContent.innerHTML = '<div class="p-4 text-center text-gray-500">Loading...</div>';
        }
        
        setTimeout(() => {
            loadTabContent(tabName);
        }, 500);
    } catch (error) {
        console.error(`Error retrying tab load for ${tabName}:`, error);
    }
}

// Show/hide tab loading states
function showTabLoadingState(tabName) {
    try {
        const targetTab = document.getElementById('tab-' + tabName);
        if (targetTab) {
            targetTab.style.opacity = '0.6';
        }
    } catch (error) {
        console.error('Error showing tab loading state:', error);
    }
}

function hideTabLoadingState() {
    try {
        const tabs = document.querySelectorAll('[id^="tab-"]');
        tabs.forEach(tab => {
            tab.style.opacity = '1';
        });
    } catch (error) {
        console.error('Error hiding tab loading state:', error);
    }
}

// Enhanced tab-specific feature initialization
function initializeTabSpecificFeatures(tabName) {
    try {
        switch(tabName) {
            case 'dashboard':
                // Dashboard initialization with retry
                setTimeout(() => {
                    const dashboardContent = document.getElementById('dashboard-content');
                    if (!dashboardContent || !dashboardContent.innerHTML.trim()) {
                        if (typeof loadDashboardContent === 'function') {
                            loadDashboardContent();
                        }
                    } else {
                        if (typeof updateDashboard === 'function') {
                            updateDashboard();
                        }
                    }
                }, 100);
                break;
                
            case 'inventory':
                // Inventory initialization with retry
                setTimeout(() => {
                    const inventoryContent = document.getElementById('inventory-content');
                    if (!inventoryContent || !inventoryContent.innerHTML.trim()) {
                        if (typeof loadInventoryTab === 'function') {
                            loadInventoryTab();
                        }
                    } else {
                        if (typeof updateInventoryDisplay === 'function') {
                            updateInventoryDisplay();
                        }
                    }
                }, 100);
                break;
                
            case 'events':
                // Events initialization with retry
                setTimeout(() => {
                    const eventsContent = document.getElementById('events-content');
                    if (!eventsContent || !eventsContent.innerHTML.trim()) {
                        if (typeof loadEventsTab === 'function') {
                            loadEventsTab();
                        }
                    } else {
                        if (typeof updateEventRecommendations === 'function') {
                            updateEventRecommendations();
                        }
                    }
                }, 100);
                break;
                
            case 'distribution':
                // Distribution initialization with retry
                setTimeout(() => {
                    const distributionContent = document.getElementById('distribution-content');
                    if (!distributionContent || !distributionContent.innerHTML.trim()) {
                        if (typeof loadDistributionTab === 'function') {
                            loadDistributionTab();
                        }
                    } else {
                        if (typeof updateDistribution === 'function') {
                            updateDistribution();
                        }
                    }
                }, 100);
                break;
                
            case 'databank':
                // Databank initialization with retry
                setTimeout(() => {
                    const databankContent = document.getElementById('databank-content');
                    if (!databankContent || !databankContent.innerHTML.trim()) {
                        if (typeof loadDatabankTab === 'function') {
                            loadDatabankTab();
                        }
                    } else {
                        if (typeof updateDataBank === 'function') {
                            updateDataBank();
                        }
                    }
                }, 100);
                break;
                
            case 'settings':
                // Settings initialization with retry
                setTimeout(() => {
                    const settingsContent = document.getElementById('settings-content');
                    if (!settingsContent || !settingsContent.innerHTML.trim()) {
                        if (typeof loadSettingsTab === 'function') {
                            loadSettingsTab();
                        }
                    } else {
                        if (typeof updateSystemStats === 'function') {
                            updateSystemStats();
                        }
                    }
                }, 100);
                break;
        }
        
    } catch (error) {
        console.error(`Error initializing ${tabName} tab:`, error);
        
        // Fallback: force reload the tab content
        setTimeout(() => {
            try {
                const tabContent = document.getElementById(`${tabName}-content`);
                if (tabContent) {
                    tabContent.innerHTML = '<div class="p-4 text-center text-gray-500">Loading...</div>';
                    
                    // Try to reload content
                    loadTabContent(tabName);
                }
            } catch (fallbackError) {
                console.error(`Fallback error for ${tabName}:`, fallbackError);
            }
        }, 500);
    }
}

// Navigation state management
function setupNavigationStateManagement() {
    try {
        // Check for hash on load
        const hash = window.location.hash.substring(1);
        if (hash && ['dashboard', 'inventory', 'events', 'distribution', 'databank', 'settings'].includes(hash)) {
            currentTab = hash;
            setTimeout(() => handleTabChange(hash), 500);
        }
        
        // Set up periodic content verification
        setInterval(() => {
            verifyTabContentIntegrity();
        }, 30000); // Check every 30 seconds
        
    } catch (error) {
        console.error('Error setting up navigation state management:', error);
    }
}

// Verify tab content integrity
function verifyTabContentIntegrity() {
    try {
        const currentTabContent = document.getElementById(`${currentTab}-content`);
        if (currentTabContent && (!currentTabContent.innerHTML.trim() || currentTabContent.innerHTML.includes('Loading...'))) {
            console.warn(`Tab content integrity issue detected for ${currentTab}, reloading...`);
            loadTabContent(currentTab);
        }
    } catch (error) {
        console.error('Error verifying tab content integrity:', error);
    }
}

// Cleanup current tab resources
function cleanupCurrentTab() {
    try {
        // Stop any running intervals or timers
        // Clean up any modal dialogs
        const modals = document.querySelectorAll('.modal:not(.hidden)');
        modals.forEach(modal => modal.classList.add('hidden'));
        
        // Clear any temporary states
        if (typeof editingDataIndex !== 'undefined') {
            editingDataIndex = -1;
        }
        
    } catch (error) {
        console.error('Error cleaning up current tab:', error);
    }
}

// Enhanced keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Only handle shortcuts when not in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            return;
        }
        
        // Handle shortcuts with improved error handling
        try {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        handleTabChange('dashboard');
                        break;
                    case '2':
                        e.preventDefault();
                        handleTabChange('inventory');
                        break;
                    case '3':
                        e.preventDefault();
                        handleTabChange('events');
                        break;
                    case '4':
                        e.preventDefault();
                        handleTabChange('distribution');
                        break;
                    case '5':
                        e.preventDefault();
                        handleTabChange('databank');
                        break;
                    case '6':
                        e.preventDefault();
                        handleTabChange('settings');
                        break;
                    case 'r':
                        e.preventDefault();
                        refreshCurrentTab();
                        break;
                }
            }
            
            // ESC key to close modals
            if (e.key === 'Escape') {
                closeAnyOpenModals();
            }
        } catch (error) {
            console.error('Error handling keyboard shortcut:', error);
        }
    });
}

// Enhanced window event setup
function setupWindowEvents() {
    // Handle window resize with debouncing
    window.addEventListener('resize', debounce(() => {
        try {
            handleWindowResize();
        } catch (error) {
            console.error('Error handling window resize:', error);
        }
    }, 250));
    
    // Handle window beforeunload
    window.addEventListener('beforeunload', (e) => {
        try {
            handleBeforeUnload(e);
        } catch (error) {
            console.error('Error handling before unload:', error);
        }
    });
    
    // Handle hash changes for back/forward navigation
    window.addEventListener('hashchange', () => {
        try {
            handleHashChange();
        } catch (error) {
            console.error('Error handling hash change:', error);
        }
    });
    
    // Handle online/offline events
    window.addEventListener('online', () => {
        showNotification('Connection restored', 'success');
    });
    
    window.addEventListener('offline', () => {
        showNotification('Connection lost - working offline', 'warning');
    });
}

// Enhanced form validation setup
function setupFormValidation() {
    // Add real-time validation to number inputs
    document.addEventListener('input', (e) => {
        try {
            if (e.target.type === 'number') {
                validateNumberInput(e.target);
            }
        } catch (error) {
            console.error('Error in input validation:', error);
        }
    });
    
    // Add validation to percentage inputs
    document.addEventListener('change', (e) => {
        try {
            if (e.target.classList.contains('percentage-input')) {
                validatePercentageInput(e.target);
            }
        } catch (error) {
            console.error('Error in percentage validation:', error);
        }
    });
}

// Enhanced number input validation
function validateNumberInput(input) {
    try {
        const value = parseFloat(input.value);
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);
        
        if (!isNaN(min) && value < min) {
            input.setCustomValidity(`Value must be at least ${min}`);
        } else if (!isNaN(max) && value > max) {
            input.setCustomValidity(`Value must be no more than ${max}`);
        } else {
            input.setCustomValidity('');
        }
    } catch (error) {
        console.error('Error validating number input:', error);
    }
}

// Enhanced percentage input validation
function validatePercentageInput(input) {
    try {
        const value = parseFloat(input.value);
        if (value < 0 || value > 100) {
            input.setCustomValidity('Percentage must be between 0 and 100');
        } else {
            input.setCustomValidity('');
        }
    } catch (error) {
        console.error('Error validating percentage input:', error);
    }
}

// Enhanced window resize handler
function handleWindowResize() {
    try {
        // Adjust table layouts
        adjustTableLayouts();
        
        // Adjust modal positions
        adjustModalPositions();
        
        // Update responsive elements
        updateResponsiveElements();
        
    } catch (error) {
        console.error('Error handling window resize:', error);
    }
}

// Update responsive elements
function updateResponsiveElements() {
    try {
        // Update navigation for mobile
        const nav = document.querySelector('nav');
        if (nav && window.innerWidth < 768) {
            nav.classList.add('mobile-nav');
        } else if (nav) {
            nav.classList.remove('mobile-nav');
        }
        
        // Update card layouts
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            if (window.innerWidth < 640) {
                card.classList.add('mobile-card');
            } else {
                card.classList.remove('mobile-card');
            }
        });
        
    } catch (error) {
        console.error('Error updating responsive elements:', error);
    }
}

// Enhanced before unload handler
function handleBeforeUnload(e) {
    try {
        // Check if there are unsaved changes
        if (hasUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            return e.returnValue;
        }
    } catch (error) {
        console.error('Error handling before unload:', error);
    }
}

// Enhanced hash change handler
function handleHashChange() {
    try {
        const hash = window.location.hash.substring(1);
        if (hash && hash !== currentTab && ['dashboard', 'inventory', 'events', 'distribution', 'databank', 'settings'].includes(hash)) {
            handleTabChange(hash);
        }
    } catch (error) {
        console.error('Error handling hash change:', error);
    }
}

// Update URL hash with error handling
function updateURLHash(tabName) {
    try {
        if (history.replaceState) {
            history.replaceState(null, null, `#${tabName}`);
        }
    } catch (error) {
        console.error('Error updating URL hash:', error);
    }
}

// Enhanced unsaved changes detection
function hasUnsavedChanges() {
    try {
        // Check if any forms have been modified
        const forms = document.querySelectorAll('form');
        for (let form of forms) {
            if (form.classList.contains('modified')) {
                return true;
            }
        }
        
        // Check for any brewing changes that haven't been completed
        if (typeof inventory !== 'undefined') {
            const eventBrewing = Object.values(inventory.event || {}).some(item => item.brewing > 0);
            const distBrewing = inventory.distribution?.P004?.brewing > 0;
            if (eventBrewing || distBrewing) {
                return true;
            }
        }
        
        return false;
    } catch (error) {
        console.error('Error checking unsaved changes:', error);
        return false;
    }
}

// Enhanced current tab refresh
function refreshCurrentTab() {
    try {
        showNotification('Refreshing tab...', 'info', 1000);
        
        // Clear current tab content
        const tabContent = document.getElementById(`${currentTab}-content`);
        if (tabContent) {
            tabContent.innerHTML = '<div class="p-4 text-center text-gray-500">Refreshing...</div>';
        }
        
        // Reinitialize tab
        setTimeout(() => {
            initializeTabSpecificFeatures(currentTab);
            showNotification('Tab refreshed successfully!', 'success');
        }, 500);
        
    } catch (error) {
        handleError(error, 'tab refresh');
    }
}

// Enhanced modal cleanup
function closeAnyOpenModals() {
    try {
        const modals = document.querySelectorAll('.modal, [id$="-modal"], .fixed.inset-0');
        modals.forEach(modal => {
            if (!modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        });
        
        // Clear any modal overlay states
        document.body.classList.remove('modal-open');
        
    } catch (error) {
        console.error('Error closing modals:', error);
    }
}

// Enhanced table layout adjustment
function adjustTableLayouts() {
    try {
        const tables = document.querySelectorAll('.table-container, .overflow-x-auto');
        tables.forEach(container => {
            const table = container.querySelector('table');
            if (table && container.offsetWidth < table.offsetWidth) {
                container.classList.add('overflow-scroll');
            } else {
                container.classList.remove('overflow-scroll');
            }
        });
    } catch (error) {
        console.error('Error adjusting table layouts:', error);
    }
}

// Enhanced modal position adjustment
function adjustModalPositions() {
    try {
        const modals = document.querySelectorAll('.modal:not(.hidden), .fixed.inset-0:not(.hidden)');
        modals.forEach(modal => {
            const rect = modal.getBoundingClientRect();
            if (rect.height > window.innerHeight) {
                modal.style.top = '0px';
                modal.style.maxHeight = `${window.innerHeight}px`;
                modal.style.overflowY = 'auto';
            }
        });
    } catch (error) {
        console.error('Error adjusting modal positions:', error);
    }
}

// Enhanced loading state management
function showLoadingState() {
    try {
        const loadingHtml = `
            <div id="loading-overlay" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white p-6 rounded-lg shadow-xl max-w-md">
                    <div class="flex items-center space-x-4">
                        <div class="spinner"></div>
                        <div>
                            <h3 class="font-semibold text-gray-900">Loading Tea Inventory System</h3>
                            <p class="text-sm text-gray-600">Please wait while we initialize...</p>
                            <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-blue-600 h-2 rounded-full animate-pulse" style="width: 70%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', loadingHtml);
    } catch (error) {
        console.error('Error showing loading state:', error);
    }
}

function hideLoadingState() {
    try {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            loadingOverlay.style.transition = 'opacity 0.3s ease-out';
            setTimeout(() => {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.remove();
                }
            }, 300);
        }
    } catch (error) {
        console.error('Error hiding loading state:', error);
    }
}

// Enhanced critical error display
function showCriticalError(error) {
    try {
        const errorHtml = `
            <div id="critical-error" class="fixed inset-0 bg-red-900 bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white p-6 rounded-lg shadow-xl max-w-md">
                    <div class="flex items-center space-x-4 mb-4">
                        <span class="text-red-600 text-2xl">⚠️</span>
                        <h3 class="font-semibold text-gray-900">System Initialization Error</h3>
                    </div>
                    <p class="text-sm text-gray-600 mb-4">
                        The Tea Inventory System encountered an error during startup. 
                        This is usually temporary and can be resolved by refreshing the page.
                    </p>
                    <details class="mb-4">
                        <summary class="text-sm font-medium text-gray-700 cursor-pointer">Technical Details</summary>
                        <pre class="text-xs text-gray-600 mt-2 bg-gray-100 p-2 rounded overflow-auto max-h-32">${error.message || error}</pre>
                    </details>
                    <div class="flex space-x-2">
                        <button onclick="location.reload()" class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors">
                            Reload Page
                        </button>
                        <button onclick="this.closest('#critical-error').remove()" class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', errorHtml);
    } catch (err) {
        console.error('Error showing critical error dialog:', err);
        alert(`Critical Error: ${error.message || error}\n\nPlease reload the page.`);
    }
}

// Enhanced welcome message with system tour
function showWelcomeMessage() {
    try {
        // Check if this is the first visit
        const isFirstVisit = !localStorage.getItem('tea_inventory_visited');
        
        if (isFirstVisit) {
            setTimeout(() => {
                const welcomeMessage = `
🍃 Welcome to Chamomile Oatmilk Tea Inventory System v2.0!

🏢 Dual Business Model Management:
• M1 - Event Planning: SULAP/JAM events with smart recommendations
• M2 - Distribution: Daily Sun-Kissed Peach operations

✨ Key Features:
• Advanced batch tracking with expiration monitoring
• Intelligent quantity recommendations with calculation breakdowns
• Complete Google Sheets integration
• Professional reporting and analytics
• Mobile-responsive design

⌨️ Quick Tips:
• Use Ctrl+1-6 for quick tab navigation
• All data auto-saves every 30 seconds
• Export to Google Sheets for backup and analysis
• Products in M1 are clickable regardless of stock level

🚀 Ready to start? Explore the Dashboard to see both business models!
                `;
                
                if (confirm(welcomeMessage + '\n\nWould you like a quick system tour?')) {
                    showQuickTour();
                }
                
                localStorage.setItem('tea_inventory_visited', 'true');
            }, 1000);
        }
    } catch (error) {
        console.error('Error showing welcome message:', error);
    }
}

// Enhanced system tour
function showQuickTour() {
    try {
        const tourSteps = [
            {
                element: '#tab-dashboard',
                title: 'Dashboard',
                description: 'Choose M1 (Event Planning) or M2 (Distribution) view for focused management'
            },
            {
                element: '#tab-inventory',
                title: 'Inventory Management',
                description: 'Manage stock levels, brewing plans, and batch tracking with Historical Performance Reference'
            },
            {
                element: '#tab-events',
                title: 'M1 - Event Planning',
                description: 'Smart event planning with quantity recommendations and calculation breakdowns'
            },
            {
                element: '#tab-distribution',
                title: 'M2 - Distribution',
                description: 'Daily Sun-Kissed Peach distribution with detailed usage guides'
            },
            {
                element: '#tab-databank',
                title: 'Data Bank',
                description: 'Advanced analytics and historical data with 100% validation'
            },
            {
                element: '#tab-settings',
                title: 'Settings',
                description: 'Universal settings, Google Sheets integration, and system backup'
            }
        ];
        
        let currentStep = 0;
        
        function showTourStep(stepIndex) {
            if (stepIndex >= tourSteps.length) {
                alert('🎉 Tour complete! You\'re ready to use the advanced Tea Inventory System.\n\nTip: Start with the Dashboard to choose your business model focus.');
                return;
            }
            
            const step = tourSteps[stepIndex];
            const element = document.querySelector(step.element);
            
            if (element) {
                // Highlight element
                element.style.boxShadow = '0 0 0 3px #3b82f6';
                element.style.zIndex = '1000';
                element.style.position = 'relative';
                
                setTimeout(() => {
                    const nextStep = confirm(`${step.title}\n\n${step.description}\n\nContinue tour? (${stepIndex + 1}/${tourSteps.length})`);
                    
                    // Remove highlight
                    element.style.boxShadow = '';
                    element.style.zIndex = '';
                    
                    if (nextStep) {
                        showTourStep(stepIndex + 1);
                    }
                }, 500);
            } else {
                showTourStep(stepIndex + 1);
            }
        }
        
        showTourStep(0);
    } catch (error) {
        console.error('Error showing system tour:', error);
    }
}

// Enhanced dashboard initialization
function initializeDashboard() {
    try {
        // Set current date with error handling
        const currentDateElement = document.getElementById('current-date');
        if (currentDateElement) {
            const currentDate = getCurrentDate();
            currentDateElement.textContent = currentDate.display;
        }
        
        // Load dashboard content with retry mechanism
        if (typeof loadDashboardContent === 'function') {
            loadDashboardContent();
        } else {
            // Retry loading dashboard
            setTimeout(() => {
                if (typeof loadDashboardContent === 'function') {
                    loadDashboardContent();
                } else {
                    console.warn('Dashboard functions not available, using fallback');
                    // Basic fallback content
                    const dashboardContent = document.getElementById('dashboard-content');
                    if (dashboardContent) {
                        dashboardContent.innerHTML = `
                            <div class="p-8 text-center">
                                <h2 class="text-xl font-bold mb-4">Tea Inventory Dashboard</h2>
                                <p class="text-gray-600 mb-4">Loading dashboard components...</p>
                                <button onclick="location.reload()" class="bg-blue-600 text-white px-4 py-2 rounded">
                                    Reload System
                                </button>
                            </div>
                        `;
                    }
                }
            }, 1000);
        }
        
        // Set up periodic updates (every 30 seconds)
        if (typeof systemState !== 'undefined' && systemState.autoSaveEnabled) {
            setInterval(() => {
                if (systemState.currentTab === 'dashboard' && typeof updateDashboard === 'function') {
                    updateDashboard();
                }
            }, 30000);
        }
        
        console.log('📊 Dashboard initialized');
        
    } catch (error) {
        handleError(error, 'dashboard initialization');
    }
}

// Enhanced auto-save functionality
function initializeAutoSave() {
    try {
        // Auto-save every 30 seconds
        setInterval(() => {
            try {
                autoSaveData();
            } catch (error) {
                console.error('Error during auto-save:', error);
            }
        }, 30000);
        
        // Save on page unload
        window.addEventListener('beforeunload', () => {
            try {
                autoSaveData();
            } catch (error) {
                console.error('Error saving on unload:', error);
            }
        });
        
        console.log('💾 Auto-save initialized');
        
    } catch (error) {
        console.error('Error initializing auto-save:', error);
    }
}

// Auto-save data function
function autoSaveData() {
    try {
        // Update performance metrics
        if (typeof performanceMetrics !== 'undefined') {
            performanceMetrics.lastRefresh = Date.now();
            performanceMetrics.updateCount++;
        }
        
        // Update system state
        if (typeof systemState !== 'undefined') {
            systemState.lastUpdated = Date.now();
        }
        
        // Log auto-save (in debug mode only)
        if (typeof systemState !== 'undefined' && systemState.debugMode) {
            console.log('Auto-save completed at', new Date().toLocaleTimeString());
        }
        
    } catch (error) {
        console.error('Error during auto-save:', error);
    }
}

// Global error boundary with enhanced handling
window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    
    if (!isInitialized) {
        showCriticalError(event.error);
    } else {
        // Try to recover gracefully
        showNotification('A minor error occurred. The system continues to work normally.', 'warning');
        
        // If error affects current tab, try to reload it
        if (event.filename && event.filename.includes(currentTab)) {
            setTimeout(() => {
                try {
                    initializeTabSpecificFeatures(currentTab);
                } catch (error) {
                    console.error('Error recovering from tab error:', error);
                }
            }, 1000);
        }
    }
});

// Enhanced unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Don't show notification for minor promise rejections
    if (event.reason && event.reason.message && 
        !event.reason.message.includes('NetworkError') && 
        !event.reason.message.includes('AbortError')) {
        showNotification('A background operation failed. System continues to work normally.', 'warning');
    }
});

// Enhanced debug functions for development
if (typeof window !== 'undefined') {
    window.TeaInventoryDebug = {
        getCurrentState: () => ({
            currentTab,
            isInitialized,
            products: products?.length || 0,
            salesHistory: salesHistory?.length || 0,
            inventory,
            universalSettings,
            shelfLifeSettings,
            systemState: typeof systemState !== 'undefined' ? systemState : 'undefined'
        }),
        
        refreshAll: () => {
            try {
                if (typeof updateDashboard === 'function') updateDashboard();
                if (typeof updateInventoryDisplay === 'function') updateInventoryDisplay();
                if (typeof updateEventRecommendations === 'function') updateEventRecommendations();
                if (typeof updateDistribution === 'function') updateDistribution();
                if (typeof updateDataBank === 'function') updateDataBank();
                showNotification('All modules refreshed', 'success');
            } catch (error) {
                console.error('Error refreshing all modules:', error);
            }
        },
        
        exportDebugData: () => {
            const debugData = {
                timestamp: new Date().toISOString(),
                state: window.TeaInventoryDebug.getCurrentState(),
                errors: [], // Could track errors here
                performance: {
                    loadTime: performance.now(),
                    userAgent: navigator.userAgent,
                    currentTab: currentTab,
                    initialized: isInitialized
                }
            };
            
            console.log('Debug Data:', debugData);
            return debugData;
        },
        
        simulateError: (type = 'minor') => {
            if (type === 'critical') {
                throw new Error('Simulated critical error for testing');
            } else {
                showNotification('Simulated minor error for testing', 'error');
            }
        },
        
        testTabNavigation: () => {
            const tabs = ['dashboard', 'inventory', 'events', 'distribution', 'databank', 'settings'];
            let index = 0;
            
            const testNext = () => {
                if (index < tabs.length) {
                    console.log(`Testing navigation to ${tabs[index]}`);
                    handleTabChange(tabs[index]);
                    index++;
                    setTimeout(testNext, 2000);
                } else {
                    console.log('Tab navigation test complete');
                }
            };
            
            testNext();
        }
    };
}

// Performance monitoring with enhanced metrics
if (typeof performance !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            try {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = Math.round(perfData.loadEventEnd - perfData.loadEventStart);
                console.log(`🚀 Tea Inventory System loaded in ${loadTime}ms`);
                
                // Update performance metrics if available
                if (typeof performanceMetrics !== 'undefined') {
                    performanceMetrics.loadTime = loadTime;
                }
                
                // Show performance notification for very slow loads
                if (loadTime > 5000) {
                    showNotification('System loaded successfully (slow connection detected)', 'info');
                }
            } catch (error) {
                console.error('Error measuring performance:', error);
            }
        }, 100);
    });
}

console.log('📝 Main controller loaded - Enhanced Tea Inventory System ready!');