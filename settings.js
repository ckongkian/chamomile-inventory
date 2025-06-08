// Settings management functionality

// Load settings tab content
function loadSettingsTab() {
    const settingsContent = `
        <div class="space-y-6">
            <!-- Universal Business Settings -->
            <div class="bg-white p-6 rounded-lg border">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <span class="text-blue-600 mr-2">⚙️</span>
                    Universal Business Settings
                </h3>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Event Planning Settings -->
                    <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 class="font-medium mb-3 text-blue-900">📅 Event Planning Business</h4>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">Daily Brewing Capacity</label>
                                <input type="number" id="event-universal-capacity" value="110" min="100" max="120" 
                                       class="w-full p-2 border rounded-lg" onchange="updateUniversalSettings()">
                                <p class="text-xs text-gray-500 mt-1">100-120 bottles/day for events</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium mb-2">Default Event Duration</label>
                                <select id="event-default-duration" class="w-full p-2 border rounded-lg" onchange="updateUniversalSettings()">
                                    <option value="2">2 Days</option>
                                    <option value="3" selected>3 Days</option>
                                    <option value="4">4 Days</option>
                                </select>
                            </div>
                            
                            <div class="text-sm text-blue-700 space-y-1">
                                <div>✓ All 6 products available</div>
                                <div>✓ SULAP & JAM events</div>
                                <div>✓ Festival & national events</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Distribution Settings -->
                    <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 class="font-medium mb-3 text-green-900">🚚 Distribution Business</h4>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">Daily Brewing Capacity</label>
                                <input type="number" id="distribution-universal-capacity" value="100" min="50" max="150" 
                                       class="w-full p-2 border rounded-lg" onchange="updateUniversalSettings()">
                                <p class="text-xs text-gray-500 mt-1">Adjustable daily capacity</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium mb-2">Daily Target</label>
                                <input type="number" id="distribution-universal-target" value="100" min="10" max="150" 
                                       class="w-full p-2 border rounded-lg" onchange="updateUniversalSettings()">
                                <p class="text-xs text-gray-500 mt-1">Sales target per day</p>
                            </div>
                            
                            <div class="text-sm text-green-700 space-y-1">
                                <div>✓ Sun-Kissed Peach only</div>
                                <div>✓ Daily operations</div>
                                <div>✓ Local businesses & direct sales</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 class="font-medium text-yellow-800 mb-2">📊 Current Settings Summary</h5>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-yellow-700">
                        <div>
                            <strong>Event Capacity:</strong> <span id="current-event-capacity">110 bottles/day</span>
                        </div>
                        <div>
                            <strong>Distribution Capacity:</strong> <span id="current-dist-capacity">100 bottles/day</span>
                        </div>
                        <div>
                            <strong>Distribution Target:</strong> <span id="current-dist-target">100 bottles/day</span>
                        </div>
                        <div>
                            <strong>Default Duration:</strong> <span id="current-event-duration">3 days</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Shelf Life & Safety Settings -->
            <div class="bg-white p-6 rounded-lg border">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <span class="text-purple-600 mr-2">⏰</span>
                    Shelf Life & Safety Settings
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 class="font-medium mb-3 text-purple-900">⚙️ Safety Configuration</h4>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">Default Shelf Life (Days)</label>
                                <input type="number" id="default-shelf-life" value="7" min="1" max="30" 
                                       class="w-full p-2 border rounded-lg" onchange="updateShelfLifeSettings()">
                                <p class="text-xs text-gray-500 mt-1">Applied to all new batches</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium mb-2">Warning Days Before Expiry</label>
                                <input type="number" id="warning-days" value="2" min="1" max="7" 
                                       class="w-full p-2 border rounded-lg" onchange="updateShelfLifeSettings()">
                                <p class="text-xs text-gray-500 mt-1">Show warning alerts</p>
                            </div>
                            
                            <div class="flex items-center space-x-2">
                                <input type="checkbox" id="auto-expire-check" checked 
                                       class="w-4 h-4 text-purple-600" onchange="updateShelfLifeSettings()">
                                <label class="text-sm">Auto-mark expired products</label>
                            </div>
                            
                            <div class="flex items-center space-x-2">
                                <input type="checkbox" id="batch-tracking" checked 
                                       class="w-4 h-4 text-purple-600" onchange="updateShelfLifeSettings()">
                                <label class="text-sm">Enable batch tracking</label>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="font-medium mb-3 text-orange-900">🛡️ Food Safety Guidelines</h4>
                        <div class="space-y-3">
                            <div class="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                <h5 class="font-medium text-orange-800 mb-2">Storage Requirements</h5>
                                <div class="text-sm text-orange-700 space-y-1">
                                    <div>• Store in cool, dry place (below 25°C)</div>
                                    <div>• Keep away from direct sunlight</div>
                                    <div>• Use airtight containers</div>
                                    <div>• Label with production date</div>
                                </div>
                            </div>
                            
                            <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <h5 class="font-medium text-red-800 mb-2">Safety Protocols</h5>
                                <div class="text-sm text-red-700 space-y-1">
                                    <div>• FIFO (First In, First Out) rotation</div>
                                    <div>• Daily expiration checks</div>
                                    <div>• Immediate removal of expired items</div>
                                    <div>• Document all disposals</div>
                                </div>
                            </div>
                            
                            <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <h5 class="font-medium text-blue-800 mb-2">Quality Control</h5>
                                <div class="text-sm text-blue-700 space-y-1">
                                    <div>• Visual inspection before use</div>
                                    <div>• Check for unusual odors</div>
                                    <div>• Monitor color changes</div>
                                    <div>• When in doubt, discard</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h5 class="font-medium text-green-800 mb-2">✅ Current Settings Summary</h5>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-green-700">
                        <div>
                            <strong>Shelf Life:</strong> <span id="current-shelf-life">7 days</span>
                        </div>
                        <div>
                            <strong>Warning:</strong> <span id="current-warning-days">2 days</span>
                        </div>
                        <div>
                            <strong>Auto-expire:</strong> <span id="current-auto-expire">Enabled</span>
                        </div>
                        <div>
                            <strong>Batch Tracking:</strong> <span id="current-batch-tracking">Enabled</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Google Sheets Integration -->
            <div class="bg-white p-6 rounded-lg border">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <span class="text-green-600 mr-2">📊</span>
                    Google Sheets Integration
                </h3>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Export Templates -->
                    <div>
                        <h4 class="font-medium mb-3 text-green-900">📊 Export Data Templates</h4>
                        <div class="space-y-3">
                            <button onclick="exportToCSV('inventory')" class="w-full p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-left transition-colors">
                                <div class="font-medium text-green-800">Current Inventory Sheet</div>
                                <div class="text-sm text-green-600">Batch tracking, stock levels, brewing plans</div>
                            </button>
                            
                            <button onclick="exportToCSV('sales_history')" class="w-full p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-left transition-colors">
                                <div class="font-medium text-blue-800">Sales History Sheet</div>
                                <div class="text-sm text-blue-600">Complete historical event data</div>
                            </button>
                            
                            <button onclick="exportToCSV('forecasting_template')" class="w-full p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-left transition-colors">
                                <div class="font-medium text-purple-800">30-Day Forecasting Template</div>
                                <div class="text-sm text-purple-600">Planning template with universal settings</div>
                            </button>
                            
                            <button onclick="exportToCSV('distribution_tracking')" class="w-full p-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg text-left transition-colors">
                                <div class="font-medium text-orange-800">V-POT Distribution Tracker</div>
                                <div class="text-sm text-orange-600">Daily distribution tracking</div>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Setup Instructions -->
                    <div>
                        <h4 class="font-medium mb-3 text-blue-900">🔧 Setup Instructions</h4>
                        <div class="space-y-3">
                            <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <h5 class="font-medium text-blue-800 mb-2">Quick Setup</h5>
                                <ol class="text-sm text-blue-700 space-y-1">
                                    <li>1. Go to sheets.google.com and create a new spreadsheet</li>
                                    <li>2. Name it 'Chamomile Tea Inventory System'</li>
                                    <li>3. Create tabs: 'Current Inventory', 'Sales History', etc.</li>
                                    <li>4. Import the CSV files we generate into each tab</li>
                                </ol>
                            </div>
                            
                            <div class="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <h5 class="font-medium text-green-800 mb-2">Benefits</h5>
                                <div class="text-sm text-green-700 space-y-1">
                                    <div>✅ Automatic backup to Google Drive</div>
                                    <div>✅ Access from any device</div>
                                    <div>✅ Share with team members</div>
                                    <div>✅ Real-time collaboration</div>
                                    <div>✅ Free for small businesses</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 class="font-medium text-yellow-800 mb-2">📱 Recommended Workflow</h5>
                    <div class="text-sm text-yellow-700 space-y-1">
                        <div>• Export data from this system weekly</div>
                        <div>• Import into Google Sheets to maintain history</div>
                        <div>• Use Google Sheets for daily data entry</div>
                        <div>• Import back to this system for analysis</div>
                    </div>
                </div>
            </div>

            <!-- System Backup & Reset -->
            <div class="bg-white p-6 rounded-lg border">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <span class="text-red-600 mr-2">🔧</span>
                    System Backup & Reset
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 class="font-medium text-blue-800 mb-3">💾 Backup Options</h4>
                        <div class="space-y-3">
                            <button onclick="backupAllData()" class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                                📦 Backup All Data
                            </button>
                            <button onclick="exportSystemSettings()" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                                ⚙️ Export Settings Only
                            </button>
                            <p class="text-xs text-blue-700">Creates downloadable backup files for system recovery</p>
                        </div>
                    </div>
                    
                    <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h4 class="font-medium text-red-800 mb-3">🔄 Reset Options</h4>
                        <div class="space-y-3">
                            <button onclick="resetToDefaults()" class="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg">
                                🏭 Reset to Factory Defaults
                            </button>
                            <button onclick="clearAllData()" class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                                🗑️ Clear All Data
                            </button>
                            <p class="text-xs text-red-700">⚠️ These actions cannot be undone. Backup first!</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- System Information -->
            <div class="bg-white p-6 rounded-lg border">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <span class="text-gray-600 mr-2">ℹ️</span>
                    System Information
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="p-3 bg-gray-50 rounded-lg">
                        <h5 class="font-medium text-gray-800">System Version</h5>
                        <p class="text-sm text-gray-600">Tea Inventory v2.0</p>
                        <p class="text-xs text-gray-500">Built for Chamomile Oatmilk Tea</p>
                    </div>
                    
                    <div class="p-3 bg-gray-50 rounded-lg">
                        <h5 class="font-medium text-gray-800">Data Statistics</h5>
                        <p class="text-sm text-gray-600">Events: <span id="stats-events">0</span></p>
                        <p class="text-sm text-gray-600">Products: <span id="stats-products">6</span></p>
                        <p class="text-sm text-gray-600">Batches: <span id="stats-batches">0</span></p>
                    </div>
                    
                    <div class="p-3 bg-gray-50 rounded-lg">
                        <h5 class="font-medium text-gray-800">Last Updated</h5>
                        <p class="text-sm text-gray-600" id="last-updated">Just now</p>
                        <p class="text-xs text-gray-500">Auto-saves changes</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    safeUpdateHTML('settings-content', settingsContent);
    
    // Initialize settings
    setTimeout(() => {
        initializeSettings();
    }, 100);
}

// Initialize settings
function initializeSettings() {
    try {
        // Load current settings into form
        loadCurrentSettings();
        
        // Update displays
        updateUniversalSettings();
        updateShelfLifeSettings();
        updateSystemStats();
        
    } catch (error) {
        handleError(error, 'settings initialization');
    }
}

// Load current settings into form elements
function loadCurrentSettings() {
    try {
        // Universal settings
        safeUpdateValue('event-universal-capacity', universalSettings.eventCapacity);
        safeUpdateValue('distribution-universal-capacity', universalSettings.distributionCapacity);
        safeUpdateValue('distribution-universal-target', universalSettings.distributionTarget);
        safeUpdateValue('event-default-duration', universalSettings.eventDefaultDuration);
        
        // Shelf life settings
        safeUpdateValue('default-shelf-life', shelfLifeSettings.defaultShelfLife);
        safeUpdateValue('warning-days', shelfLifeSettings.warningDays);
        
        const autoExpireElement = document.getElementById('auto-expire-check');
        const batchTrackingElement = document.getElementById('batch-tracking');
        
        if (autoExpireElement) autoExpireElement.checked = shelfLifeSettings.autoExpireCheck;
        if (batchTrackingElement) batchTrackingElement.checked = shelfLifeSettings.batchTracking;
        
    } catch (error) {
        console.error('Error loading current settings:', error);
    }
}

// Universal settings management
function updateUniversalSettings() {
    try {
        const eventCapacityElement = document.getElementById('event-universal-capacity');
        const distCapacityElement = document.getElementById('distribution-universal-capacity');
        const distTargetElement = document.getElementById('distribution-universal-target');
        const eventDurationElement = document.getElementById('event-default-duration');

        if (eventCapacityElement) {
            universalSettings.eventCapacity = parseInt(eventCapacityElement.value);
        }
        if (distCapacityElement) {
            universalSettings.distributionCapacity = parseInt(distCapacityElement.value);
        }
        if (distTargetElement) {
            universalSettings.distributionTarget = parseInt(distTargetElement.value);
        }
        if (eventDurationElement) {
            universalSettings.eventDefaultDuration = parseInt(eventDurationElement.value);
        }

        // Update summary displays
        updateUniversalDisplays();
        
        // Sync with other parts of the system
        syncWithOtherComponents();
        
    } catch (error) {
        handleError(error, 'universal settings update');
    }
}

// Update shelf life settings
function updateShelfLifeSettings() {
    try {
        const defaultShelfLifeElement = document.getElementById('default-shelf-life');
        const warningDaysElement = document.getElementById('warning-days');
        const autoExpireElement = document.getElementById('auto-expire-check');
        const batchTrackingElement = document.getElementById('batch-tracking');

        if (defaultShelfLifeElement) {
            shelfLifeSettings.defaultShelfLife = parseInt(defaultShelfLifeElement.value);
        }
        if (warningDaysElement) {
            shelfLifeSettings.warningDays = parseInt(warningDaysElement.value);
        }
        if (autoExpireElement) {
            shelfLifeSettings.autoExpireCheck = autoExpireElement.checked;
        }
        if (batchTrackingElement) {
            shelfLifeSettings.batchTracking = batchTrackingElement.checked;
        }

        // Update summary displays
        safeUpdateText('current-shelf-life', `${shelfLifeSettings.defaultShelfLife} days`);
        safeUpdateText('current-warning-days', `${shelfLifeSettings.warningDays} days`);
        safeUpdateText('current-auto-expire', shelfLifeSettings.autoExpireCheck ? 'Enabled' : 'Disabled');
        safeUpdateText('current-batch-tracking', shelfLifeSettings.batchTracking ? 'Enabled' : 'Disabled');

        // Update batch expiration summary if function exists
        if (typeof updateBatchExpirationSummary === 'function') {
            updateBatchExpirationSummary();
        }
        
    } catch (error) {
        handleError(error, 'shelf life settings update');
    }
}

// Sync settings with other components
function syncWithOtherComponents() {
    try {
        // Update dashboard if function exists
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
        
        // Update inventory displays if function exists
        if (typeof updateInventoryDisplay === 'function') {
            updateInventoryDisplay();
        }
        
        // Update event recommendations if function exists
        if (typeof updateEventRecommendations === 'function') {
            updateEventRecommendations();
        }
        
        // Update distribution if function exists
        if (typeof updateDistribution === 'function') {
            updateDistribution();
        }
        
        // Sync event planning settings if function exists
        if (typeof syncEventPlanningSettings === 'function') {
            syncEventPlanningSettings();
        }
        
        // Sync distribution settings if function exists
        if (typeof syncDistributionSettings === 'function') {
            syncDistributionSettings();
        }
        
    } catch (error) {
        console.error('Error syncing with other components:', error);
    }
}

// Backup all data
function backupAllData() {
    try {
        const backupData = {
            timestamp: new Date().toISOString(),
            version: "2.0",
            products: products,
            salesHistory: salesHistory,
            inventory: inventory,
            universalSettings: universalSettings,
            shelfLifeSettings: shelfLifeSettings,
            distributionChannels: distributionChannels,
            eventPlanning: eventPlanning,
            batchCounter: batchCounter
        };
        
        const jsonContent = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tea_inventory_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        alert('Backup completed successfully!');
        
    } catch (error) {
        handleError(error, 'data backup');
    }
}

// Export system settings only
function exportSystemSettings() {
    try {
        const settingsData = {
            timestamp: new Date().toISOString(),
            version: "2.0",
            universalSettings: universalSettings,
            shelfLifeSettings: shelfLifeSettings,
            distributionChannels: distributionChannels
        };
        
        const jsonContent = JSON.stringify(settingsData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tea_inventory_settings_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        alert('Settings exported successfully!');
        
    } catch (error) {
        handleError(error, 'settings export');
    }
}

// Reset to factory defaults
function resetToDefaults() {
    if (confirm('Are you sure you want to reset all settings to factory defaults? This action cannot be undone.')) {
        try {
            // Reset universal settings
            universalSettings.eventCapacity = 110;
            universalSettings.distributionCapacity = 100;
            universalSettings.distributionTarget = 100;
            universalSettings.eventDefaultDuration = 3;
            
            // Reset shelf life settings
            shelfLifeSettings.defaultShelfLife = 7;
            shelfLifeSettings.warningDays = 2;
            shelfLifeSettings.autoExpireCheck = true;
            shelfLifeSettings.batchTracking = true;
            
            // Reset distribution channels
            distributionChannels.localBusiness = 60;
            distributionChannels.directSales = 40;
            
            // Reset event planning
            eventPlanning.eventType = 'sulap';
            eventPlanning.eventDays = 3;
            eventPlanning.dailyEventCapacity = 110;
            eventPlanning.selectedProducts = ['P004', 'P001', 'P005'];
            
            // Reload settings into form
            loadCurrentSettings();
            updateUniversalSettings();
            updateShelfLifeSettings();
            syncWithOtherComponents();
            
            alert('Settings reset to factory defaults successfully!');
            
        } catch (error) {
            handleError(error, 'factory reset');
        }
    }
}

// Clear all data
function clearAllData() {
    if (confirm('⚠️ WARNING: This will delete ALL data including inventory, sales history, and batches. This action cannot be undone. Are you absolutely sure?')) {
        if (confirm('Last chance! This will permanently delete everything. Continue?')) {
            try {
                // Clear sales history
                salesHistory.length = 0;
                
                // Reset inventory to minimal state
                products.forEach(product => {
                    inventory.event[product.id] = {
                        batches: [],
                        brewing: 0
                    };
                });
                
                inventory.distribution = {
                    'P004': {
                        batches: [],
                        brewing: 0
                    }
                };
                
                // Reset batch counters
                batchCounter.event = { P001: 1, P002: 1, P003: 1, P004: 1, P005: 1, P006: 1 };
                batchCounter.distribution = { P004: 1 };
                
                // Reset sort direction
                sortDirection = {};
                editingDataIndex = -1;
                
                // Sync with all components
                syncWithOtherComponents();
                
                alert('All data cleared successfully. The system has been reset to empty state.');
                
            } catch (error) {
                handleError(error, 'data clearing');
            }
        }
    }
}

// Update system statistics
function updateSystemStats() {
    try {
        const uniqueEvents = [...new Set(salesHistory.map(sale => sale.period))].length;
        const totalBatches = Object.values(inventory.event).reduce((sum, item) => sum + (item.batches ? item.batches.length : 0), 0) +
                           Object.values(inventory.distribution).reduce((sum, item) => sum + (item.batches ? item.batches.length : 0), 0);
        
        safeUpdateText('stats-events', uniqueEvents);
        safeUpdateText('stats-products', products.length);
        safeUpdateText('stats-batches', totalBatches);
        safeUpdateText('last-updated', new Date().toLocaleTimeString());
        
    } catch (error) {
        console.error('Error updating system stats:', error);
    }
}

// Import settings from backup
function importSettings() {
    try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        
                        // Validate data structure
                        if (data.universalSettings) {
                            Object.assign(universalSettings, data.universalSettings);
                        }
                        if (data.shelfLifeSettings) {
                            Object.assign(shelfLifeSettings, data.shelfLifeSettings);
                        }
                        if (data.distributionChannels) {
                            Object.assign(distributionChannels, data.distributionChannels);
                        }
                        
                        // Reload settings
                        loadCurrentSettings();
                        updateUniversalSettings();
                        updateShelfLifeSettings();
                        syncWithOtherComponents();
                        
                        alert('Settings imported successfully!');
                        
                    } catch (error) {
                        alert('Error importing settings: Invalid file format');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
        
    } catch (error) {
        handleError(error, 'settings import');
    }
}

// Validate settings
function validateSettings() {
    try {
        const issues = [];
        
        // Validate universal settings
        if (universalSettings.eventCapacity < 100 || universalSettings.eventCapacity > 120) {
            issues.push('Event capacity should be between 100-120 bottles/day');
        }
        
        if (universalSettings.distributionCapacity < 50 || universalSettings.distributionCapacity > 150) {
            issues.push('Distribution capacity should be between 50-150 bottles/day');
        }
        
        if (universalSettings.distributionTarget > universalSettings.distributionCapacity) {
            issues.push('Distribution target cannot exceed distribution capacity');
        }
        
        // Validate shelf life settings
        if (shelfLifeSettings.defaultShelfLife < 1 || shelfLifeSettings.defaultShelfLife > 30) {
            issues.push('Shelf life should be between 1-30 days');
        }
        
        if (shelfLifeSettings.warningDays >= shelfLifeSettings.defaultShelfLife) {
            issues.push('Warning days should be less than shelf life');
        }
        
        // Validate distribution channels
        const totalChannels = distributionChannels.localBusiness + distributionChannels.directSales;
        if (Math.abs(totalChannels - 100) > 0.1) {
            issues.push('Distribution channel percentages must total 100%');
        }
        
        return issues;
        
    } catch (error) {
        console.error('Error validating settings:', error);
        return ['Error validating settings'];
    }
}

// Auto-save settings
function autoSaveSettings() {
    try {
        // This would typically save to a backend or local storage
        // For now, we just update the last updated time
        updateSystemStats();
        
    } catch (error) {
        console.error('Error auto-saving settings:', error);
    }
}

// Setup auto-save interval
let autoSaveInterval;

function startAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
    
    // Auto-save every 30 seconds
    autoSaveInterval = setInterval(autoSaveSettings, 30000);
}

function stopAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
        autoSaveInterval = null;
    }
}

// Initialize auto-save when settings are loaded
function initializeAutoSave() {
    startAutoSave();
    
    // Stop auto-save when page is unloaded
    window.addEventListener('beforeunload', stopAutoSave);
}