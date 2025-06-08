// Main application controller for Tea Inventory System

// Application state
let isInitialized = false;
let currentTab = 'dashboard';

// Initialize the entire application
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('🍃 Chamomile Oatmilk Tea Inventory System Starting...');
        
        // Initialize core components
        initializeApp();
        
    } catch (error) {
        console.error('Critical error during app initialization:', error);
        showCriticalError(error);
    }
});

// Main initialization function
function initializeApp() {
    try {
        // Set loading state
        showLoadingState();
        
        // Initialize data structures
        initializeDataStructures();
        
        // Set current date
        initializeDateTime();
        
        // Initialize universal settings
        initializeUniversalSettings();
        
        // Initialize event product pre-selection
        initializeEventProductPreSelection();
        
        // Load default tab (dashboard)
        initializeDashboard();
        
        // Set up event listeners
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
        handleError(error, 'application initialization');
    }
}

// Initialize data structures
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
        
        console.log('📊 Data structures initialized');
        
    } catch (error) {
        throw new Error(`Data structure initialization failed: ${error.message}`);
    }
}

// Validate inventory structure
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
}

// Initialize batch counters
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

// Initialize date and time
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
        // Ensure universal settings are applied everywhere
        updateUniversalDisplays();
        
        // Initialize business model state
        currentBusinessModel = 'event';
        
        console.log('⚙️ Universal settings initialized');
        
    } catch (error) {
        console.error('Error initializing universal settings:', error);
    }
}

// Setup event listeners for the application
function setupEventListeners() {
    try {
        // Tab navigation listeners
        setupTabListeners();
        
        // Keyboard shortcuts
        setupKeyboardShortcuts();
        
        // Window events
        setupWindowEvents();
        
        // Form validation listeners
        setupFormValidation();
        
        console.log('👂 Event listeners setup complete');
        
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

// Setup tab navigation listeners
function setupTabListeners() {
    const tabButtons = document.querySelectorAll('[id^="tab-"]');
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const tabName = e.target.id.replace('tab-', '');
            handleTabChange(tabName);
        });
    });
}

// Handle tab changes with proper cleanup and initialization
function handleTabChange(tabName) {
    try {
        // Don't switch if already on this tab
        if (currentTab === tabName) return;
        
        // Cleanup current tab if needed
        cleanupCurrentTab();
        
        // Switch to new tab
        showTab(tabName);
        currentTab = tabName;
        
        // Initialize tab-specific functionality
        initializeTabSpecificFeatures(tabName);
        
        // Update URL hash (for bookmarking)
        updateURLHash(tabName);
        
    } catch (error) {
        handleError(error, 'tab change');
    }
}

// Cleanup current tab
function cleanupCurrentTab() {
    // Stop any running intervals or timers
    // Clean up any modal dialogs
    // Save any unsaved changes
}

// Initialize tab-specific features
function initializeTabSpecificFeatures(tabName) {
    try {
        switch(tabName) {
            case 'dashboard':
                // Dashboard is always ready, just refresh
                updateDashboard();
                break;
                
            case 'inventory':
                // Load inventory tab content if not already loaded
                if (!document.getElementById('inventory-content').innerHTML.trim()) {
                    loadInventoryTab();
                } else {
                    updateInventoryDisplay();
                }
                break;
                
            case 'events':
                // Load events tab content if not already loaded
                if (!document.getElementById('events-content').innerHTML.trim()) {
                    loadEventsTab();
                } else {
                    updateEventRecommendations();
                }
                break;
                
            case 'distribution':
                // Load distribution tab content if not already loaded
                if (!document.getElementById('distribution-content').innerHTML.trim()) {
                    loadDistributionTab();
                } else {
                    updateDistribution();
                }
                break;
                
            case 'databank':
                // Load databank tab content if not already loaded
                if (!document.getElementById('databank-content').innerHTML.trim()) {
                    loadDatabankTab();
                } else {
                    updateDataBank();
                }
                break;
                
            case 'settings':
                // Load settings tab content if not already loaded
                if (!document.getElementById('settings-content').innerHTML.trim()) {
                    loadSettingsTab();
                } else {
                    updateSystemStats();
                }
                break;
        }
        
    } catch (error) {
        console.error(`Error initializing ${tabName} tab:`, error);
    }
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Only handle shortcuts when not in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            return;
        }
        
        // Handle shortcuts
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
    });
}

// Setup window events
function setupWindowEvents() {
    // Handle window resize
    window.addEventListener('resize', debounce(() => {
        handleWindowResize();
    }, 250));
    
    // Handle window beforeunload
    window.addEventListener('beforeunload', (e) => {
        handleBeforeUnload(e);
    });
    
    // Handle hash changes for back/forward navigation
    window.addEventListener('hashchange', () => {
        handleHashChange();
    });
}

// Setup form validation
function setupFormValidation() {
    // Add real-time validation to number inputs
    document.addEventListener('input', (e) => {
        if (e.target.type === 'number') {
            validateNumberInput(e.target);
        }
    });
    
    // Add validation to percentage inputs
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('percentage-input')) {
            validatePercentageInput(e.target);
        }
    });
}

// Validate number inputs
function validateNumberInput(input) {
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
}

// Validate percentage inputs
function validatePercentageInput(input) {
    const value = parseFloat(input.value);
    if (value < 0 || value > 100) {
        input.setCustomValidity('Percentage must be between 0 and 100');
    } else {
        input.setCustomValidity('');
    }
}

// Handle window resize
function handleWindowResize() {
    // Adjust table layouts
    adjustTableLayouts();
    
    // Adjust modal positions
    adjustModalPositions();
}

// Handle before unload
function handleBeforeUnload(e) {
    // Check if there are unsaved changes
    if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
    }
}

// Handle hash changes
function handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash && hash !== currentTab) {
        handleTabChange(hash);
    }
}

// Update URL hash
function updateURLHash(tabName) {
    if (history.replaceState) {
        history.replaceState(null, null, `#${tabName}`);
    }
}

// Check for unsaved changes
function hasUnsavedChanges() {
    // Check if any forms have been modified
    const forms = document.querySelectorAll('form');
    for (let form of forms) {
        if (form.classList.contains('modified')) {
            return true;
        }
    }
    return false;
}

// Refresh current tab
function refreshCurrentTab() {
    try {
        initializeTabSpecificFeatures(currentTab);
        
        // Show refresh notification
        showNotification('Tab refreshed successfully!', 'success');
        
    } catch (error) {
        handleError(error, 'tab refresh');
    }
}

// Close any open modals
function closeAnyOpenModals() {
    const modals = document.querySelectorAll('.modal, #add-data-form, #edit-data-form');
    modals.forEach(modal => {
        if (!modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
        }
    });
}

// Adjust table layouts for responsive design
function adjustTableLayouts() {
    const tables = document.querySelectorAll('.table-container');
    tables.forEach(container => {
        const table = container.querySelector('table');
        if (table && container.offsetWidth < table.offsetWidth) {
            container.classList.add('overflow-scroll');
        } else {
            container.classList.remove('overflow-scroll');
        }
    });
}

// Adjust modal positions
function adjustModalPositions() {
    const modals = document.querySelectorAll('.modal:not(.hidden)');
    modals.forEach(modal => {
        // Center modal on screen
        const rect = modal.getBoundingClientRect();
        if (rect.height > window.innerHeight) {
            modal.style.top = '0px';
            modal.style.maxHeight = `${window.innerHeight}px`;
            modal.style.overflowY = 'auto';
        }
    });
}

// Show loading state
function showLoadingState() {
    const loadingHtml = `
        <div id="loading-overlay" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded-lg shadow-xl">
                <div class="flex items-center space-x-4">
                    <div class="spinner"></div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Loading Tea Inventory System</h3>
                        <p class="text-sm text-gray-600">Please wait while we initialize...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', loadingHtml);
}

// Hide loading state
function hideLoadingState() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

// Show critical error
function showCriticalError(error) {
    const errorHtml = `
        <div id="critical-error" class="fixed inset-0 bg-red-900 bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded-lg shadow-xl max-w-md">
                <div class="flex items-center space-x-4 mb-4">
                    <span class="text-red-600 text-2xl">⚠️</span>
                    <h3 class="font-semibold text-gray-900">System Error</h3>
                </div>
                <p class="text-sm text-gray-600 mb-4">
                    The Tea Inventory System encountered a critical error and cannot start properly.
                </p>
                <details class="mb-4">
                    <summary class="text-sm font-medium text-gray-700 cursor-pointer">Technical Details</summary>
                    <pre class="text-xs text-gray-600 mt-2 bg-gray-100 p-2 rounded overflow-auto">${error.message || error}</pre>
                </details>
                <button onclick="location.reload()" class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                    Reload Page
                </button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', errorHtml);
}

// Show welcome message for first-time users
function showWelcomeMessage() {
    // Check if this is the first visit (you could use localStorage for this)
    const isFirstVisit = !localStorage.getItem('tea_inventory_visited');
    
    if (isFirstVisit) {
        setTimeout(() => {
            const welcomeMessage = `
                🍃 Welcome to Chamomile Oatmilk Tea Inventory System!
                
                This system helps you manage:
                • Event Planning (SULAP/JAM events)
                • Daily Distribution (Sun-Kissed Peach)
                • Batch tracking with expiration dates
                • Sales history and recommendations
                
                Quick tips:
                • Use Ctrl+1-6 for quick tab navigation
                • All data is saved automatically
                • Export to Google Sheets for backup
                
                Start by exploring the Dashboard tab!
            `;
            
            if (confirm(welcomeMessage + '\n\nWould you like to see a quick tour?')) {
                showQuickTour();
            }
            
            localStorage.setItem('tea_inventory_visited', 'true');
        }, 1000);
    }
}

// Show quick tour
function showQuickTour() {
    const tourSteps = [
        {
            element: '#tab-dashboard',
            title: 'Dashboard',
            description: 'Overview of both business models with real-time alerts'
        },
        {
            element: '#tab-inventory',
            title: 'Inventory Management',
            description: 'Manage stock levels, brewing plans, and batch tracking'
        },
        {
            element: '#tab-events',
            title: 'Event Planning',
            description: 'Plan quantities for SULAP/JAM events with smart recommendations'
        },
        {
            element: '#tab-distribution',
            title: 'Distribution',
            description: 'Manage daily Sun-Kissed Peach distribution'
        },
        {
            element: '#tab-databank',
            title: 'Data Bank',
            description: 'Historical sales data for accurate forecasting'
        },
        {
            element: '#tab-settings',
            title: 'Settings',
            description: 'Configure capacities, shelf life, and export data'
        }
    ];
    
    let currentStep = 0;
    
    function showTourStep(stepIndex) {
        if (stepIndex >= tourSteps.length) {
            alert('Tour complete! You\'re ready to use the Tea Inventory System. 🎉');
            return;
        }
        
        const step = tourSteps[stepIndex];
        const element = document.querySelector(step.element);
        
        if (element) {
            // Highlight element
            element.style.boxShadow = '0 0 0 3px #3b82f6';
            element.style.zIndex = '1000';
            
            setTimeout(() => {
                const nextStep = confirm(`${step.title}\n\n${step.description}\n\nContinue tour?`);
                
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
}

// Show notification
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-4 py-2 rounded shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'warning' ? 'bg-orange-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, duration);
}

// Global error boundary
window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    
    if (!isInitialized) {
        showCriticalError(event.error);
    } else {
        showNotification('An error occurred. Please refresh if issues persist.', 'error');
    }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showNotification('A background operation failed. System continues to work normally.', 'warning');
});

// Expose debug functions for development
if (typeof window !== 'undefined') {
    window.TeaInventoryDebug = {
        getCurrentState: () => ({
            currentTab,
            isInitialized,
            products,
            salesHistory: salesHistory.length,
            inventory,
            universalSettings,
            shelfLifeSettings
        }),
        
        refreshAll: () => {
            updateDashboard();
            updateInventoryDisplay();
            updateEventRecommendations();
            updateDistribution();
            updateDataBank();
        },
        
        exportDebugData: () => {
            const debugData = {
                timestamp: new Date().toISOString(),
                state: window.TeaInventoryDebug.getCurrentState(),
                errors: [], // Could track errors here
                performance: {
                    loadTime: performance.now()
                }
            };
            
            console.log('Debug Data:', debugData);
            return debugData;
        }
    };
}

// Performance monitoring
if (typeof performance !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`🚀 App loaded in ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
        }, 0);
    });
}

console.log('📝 Main controller loaded - waiting for DOM...');