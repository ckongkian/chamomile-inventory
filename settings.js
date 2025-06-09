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
                    <!-- M1 - Event Planning Settings -->
                    <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 class="font-medium mb-3 text-blue-900">📅 M1 - Event Planning Business</h4>
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
                    
                    <!-- M2 - Distribution Settings -->
                    <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 class="font-medium mb-3 text-green-900">🚚 M2 - Distribution Business</h4>
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
                            <strong>M1 Capacity:</strong> <span id="current-event-capacity">110 bottles/day</span>
                        </div>
                        <div>
                            <strong>M2 Capacity:</strong> <span id="current-dist-capacity">100 bottles/day</span>
                        </div>
                        <div>
                            <strong>M2 Target:</strong> <span id="current-dist-target">100 bottles/day</span>
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
                    <div class="p-4 bg-purple-50 border border-purple-200 rounded-lg">
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

            <!-- Batch Management -->
            <div class="bg-white p-6 rounded-lg border">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <span class="text-indigo-600 mr-2">🔢</span>
                    Batch ID Management
                </h3>
                
                <div class="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <p class="text-sm text-indigo-800">
                        <strong>Batch ID Format:</strong> E001_001 (Event), D004_001 (Distribution)<br>
                        <strong>Purpose:</strong> Reset batch counters if needed for inventory reorganization.
                    </p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 class="font-medium mb-3 text-blue-900">📅 M1 - Event Planning Batch Counters</h4>
                        <div class="space-y-2" id="event-batch-counters">
                            <!-- Will be populated by JavaScript -->
                        </div>
                        <button onclick="resetEventBatchCounters()" class="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                            Reset All Event Batch Counters
                        </button>
                    </div>
                    
                    <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 class="font-medium mb-3 text-green-900">🚚 M2 - Distribution Batch Counter</h4>
                        <div class="space-y-2" id="distribution-batch-counter">
                            <!-- Will be populated by JavaScript -->
                        </div>
                        <button onclick="resetDistributionBatchCounter()" class="mt-3 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                            Reset Distribution Batch Counter
                        </button>
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
                            <button onclick="backupAllData()" class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                                📦 Backup All Data
                            </button>
                            <button onclick="exportSystemSettings()" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                                ⚙️ Export Settings Only
                            </button>
                            <button onclick="importSettings()" class="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                                📥 Import Backup
                            </button>
                        </div>
                    </div>
                    
                    <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h4 class="font-medium text-red-800 mb-3">🔄 Reset Options</h4>
                        <div class="space-y-3">
                            <button onclick="resetToDefaults()" class="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
                                🏭 Reset to Factory Defaults
                            </button>
                            <button onclick="clearAllData()" class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                                🗑️ Clear All Data
                            </button>
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
                        <p class="text-xs text-gray-500">M1/M2 Business Models</p>
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
        loadCurrentSettings();
        updateUniversalSettings();
        updateShelfLifeSettings();
        updateSystemStats();
        updateBatchCounterDisplays();
    } catch (error) {
        handleError(error, 'settings initialization');
    }
}

// Load current settings into form elements
function loadCurrentSettings() {
    try {
        safeUpdateValue('event-universal-capacity', universalSettings.eventCapacity);
        safeUpdateValue('distribution-universal-capacity', universalSettings.distributionCapacity);
        safeUpdateValue('distribution-universal-target', universalSettings.distributionTarget);
        safeUpdateValue('event-default-duration', universalSettings.eventDefaultDuration);
        
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

// Update universal settings
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

        updateUniversalDisplays();
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

        safeUpdateText('current-shelf-life', `${shelfLifeSettings.defaultShelfLife} days`);
        safeUpdateText('current-warning-days', `${shelfLifeSettings.warningDays} days`);
        safeUpdateText('current-auto-expire', shelfLifeSettings.autoExpireCheck ? 'Enabled' : 'Disabled');
        safeUpdateText('current-batch-tracking', shelfLifeSettings.batchTracking ? 'Enabled' : 'Disabled');

        if (typeof updateBatchExpirationSummary === 'function') {
            updateBatchExpirationSummary();
        }
        
    } catch (error) {
        handleError(error, 'shelf life settings update');
    }
}

// Update batch counter displays
function updateBatchCounterDisplays() {
    try {
        // Event batch counters
        const eventCountersHtml = products.map(product => `
            <div class="flex justify-between items-center text-sm">
                <span>${product.icon} ${product.name}:</span>
                <span class="font-semibold">Next ID: ${product.id.slice(-3)}_${String(batchCounter.event[product.id]).padStart(3, '0')}</span>
            </div>
        `).join('');
        safeUpdateHTML('event-batch-counters', eventCountersHtml);
        
        // Distribution batch counter
        const distCounterHtml = `
            <div class="flex justify-between items-center text-sm">
                <span>🍑 Sun-Kissed Peach:</span>
                <span class="font-semibold">Next ID: D004_${String(batchCounter.distribution['P004']).padStart(3, '0')}</span>
            </div>
        `;
        safeUpdateHTML('distribution-batch-counter', distCounterHtml);
        
    } catch (error) {
        console.error('Error updating batch counter displays:', error);
    }
}

// Reset batch counters
function resetEventBatchCounters() {
    if (confirm('Reset all event batch counters to 001? This will affect future batch ID generation.')) {
        try {
            products.forEach(product => {
                batchCounter.event[product.id] = 1;
            });
            updateBatchCounterDisplays();
            showNotification('Event batch counters reset to 001', 'success');
            logActivity('Batch Counters', 'Reset all event batch counters to 001');
        } catch (error) {
            handleError(error, 'event batch counter reset');
        }
    }
}

function resetDistributionBatchCounter() {
    if (confirm('Reset distribution batch counter to 001? This will affect future batch ID generation.')) {
        try {
            batchCounter.distribution['P004'] = 1;
            updateBatchCounterDisplays();
            showNotification('Distribution batch counter reset to 001', 'success');
            logActivity('Batch Counters', 'Reset distribution batch counter to 001');
        } catch (error) {
            handleError(error, 'distribution batch counter reset');
        }
    }
}

// Sync with other components
function syncWithOtherComponents() {
    try {
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
        if (typeof updateInventoryDisplay === 'function') {
            updateInventoryDisplay();
        }
        if (typeof updateEventRecommendations === 'function') {
            updateEventRecommendations();
        }
        if (typeof updateDistribution === 'function') {
            updateDistribution();
        }
        if (typeof syncEventPlanningSettings === 'function') {
            syncEventPlanningSettings();
        }
        if (typeof syncDistributionSettings === 'function') {
            syncDistributionSettings();
        }
    } catch (error) {
        console.error('Error syncing with other components:', error);
    }
}

// Backup functions
function backupAllData() {
    try {
        const backupData = {
            timestamp: new Date().toISOString(),
            version: "2.0",
            systemInfo: {
                userAgent: navigator.userAgent,
                timestamp: Date.now()
            },
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
        
        showNotification('Complete backup downloaded successfully!', 'success', 5000);
        logActivity('Backup', 'Complete system backup created');
        
    } catch (error) {
        handleError(error, 'data backup');
    }
}

function exportSystemSettings() {
    try {
        const settingsData = {
            timestamp: new Date().toISOString(),
            version: "2.0",
            type: "settings_only",
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
        
        showNotification('Settings exported successfully!', 'success');
        logActivity('Settings', 'Settings export completed');
        
    } catch (error) {
        handleError(error, 'settings export');
    }
}

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
                        
                        if (!data.version) {
                            throw new Error('Invalid backup file format');
                        }
                        
                        const confirmMessage = `Import Backup Data?\n\nFile: ${file.name}\nVersion: ${data.version}\nDate: ${data.timestamp}\n\nThis will replace current settings and data. Continue?`;
                        
                        if (confirm(confirmMessage)) {
                            if (data.type === "settings_only") {
                                if (data.universalSettings) {
                                    Object.assign(universalSettings, data.universalSettings);
                                }
                                if (data.shelfLifeSettings) {
                                    Object.assign(shelfLifeSettings, data.shelfLifeSettings);
                                }
                                if (data.distributionChannels) {
                                    Object.assign(distributionChannels, data.distributionChannels);
                                }
                                showNotification('Settings imported successfully!', 'success');
                                logActivity('Settings', `Settings imported from ${file.name}`);
                            } else {
                                if (data.salesHistory) {
                                    salesHistory.length = 0;
                                    salesHistory.push(...data.salesHistory);
                                }
                                if (data.inventory) {
                                    Object.assign(inventory, data.inventory);
                                }
                                if (data.universalSettings) {
                                    Object.assign(universalSettings, data.universalSettings);
                                }
                                if (data.shelfLifeSettings) {
                                    Object.assign(shelfLifeSettings, data.shelfLifeSettings);
                                }
                                if (data.distributionChannels) {
                                    Object.assign(distributionChannels, data.distributionChannels);
                                }
                                if (data.eventPlanning) {
                                    Object.assign(eventPlanning, data.eventPlanning);
                                }
                                if (data.batchCounter) {
                                    Object.assign(batchCounter, data.batchCounter);
                                }
                                showNotification('Full backup imported successfully!', 'success');
                                logActivity('Backup', `Full backup imported from ${file.name}`);
                            }
                            
                            loadCurrentSettings();
                            updateUniversalSettings();
                            updateShelfLifeSettings();
                            updateBatchCounterDisplays();
                            syncWithOtherComponents();
                        }
                        
                    } catch (error) {
                        showNotification('Error importing backup: Invalid file format or corrupted data', 'error');
                        console.error('Import error:', error);
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

function resetToDefaults() {
    const confirmMessage = `🏭 Reset to Factory Defaults?\n\nThis will reset:\n• Universal settings (M1/M2 capacities, targets)\n• Shelf life settings\n• Distribution channel allocation\n• Event planning preferences\n\nThis will NOT delete:\n• Sales history data\n• Current inventory batches\n\nContinue with factory reset?`;
    
    if (confirm(confirmMessage)) {
        try {
            universalSettings.eventCapacity = 110;
            universalSettings.distributionCapacity = 100;
            universalSettings.distributionTarget = 100;
            universalSettings.eventDefaultDuration = 3;
            
            shelfLifeSettings.defaultShelfLife = 7;
            shelfLifeSettings.warningDays = 2;
            shelfLifeSettings.autoExpireCheck = true;
            shelfLifeSettings.batchTracking = true;
            
            distributionChannels.localBusiness = 60;
            distributionChannels.directSales = 40;
            
            eventPlanning.eventType = 'sulap';
            eventPlanning.eventDays = 3;
            eventPlanning.dailyEventCapacity = 110;
            eventPlanning.selectedProducts = ['P004', 'P001', 'P005'];
            
            loadCurrentSettings();
            updateUniversalSettings();
            updateShelfLifeSettings();
            updateBatchCounterDisplays();
            syncWithOtherComponents();
            
            showNotification('Settings reset to factory defaults successfully!', 'success', 5000);
            logActivity('System', 'Factory reset completed');
            
        } catch (error) {
            handleError(error, 'factory reset');
        }
    }
}

function clearAllData() {
    const confirmMessage = `🗑️ CLEAR ALL DATA?\n\n⚠️ WARNING: This will permanently delete:\n• ALL sales history data\n• ALL inventory and batches\n• ALL settings and configurations\n• Everything will be reset to empty state\n\nThis action CANNOT be undone!\n\nAre you absolutely sure?`;
    
    if (confirm(confirmMessage)) {
        const finalConfirm = prompt(`🚨 FINAL WARNING!\n\nYou are about to delete EVERYTHING.\nThis will permanently erase all your data.\n\nType "DELETE ALL" to confirm:`);
        
        if (finalConfirm === "DELETE ALL") {
            try {
                salesHistory.length = 0;
                
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
                
                batchCounter.event = { P001: 1, P002: 1, P003: 1, P004: 1, P005: 1, P006: 1 };
                batchCounter.distribution = { P004: 1 };
                
                universalSettings.eventCapacity = 110;
                universalSettings.distributionCapacity = 100;
                universalSettings.distributionTarget = 100;
                universalSettings.eventDefaultDuration = 3;
                
                shelfLifeSettings.defaultShelfLife = 7;
                shelfLifeSettings.warningDays = 2;
                shelfLifeSettings.autoExpireCheck = true;
                shelfLifeSettings.batchTracking = true;
                
                distributionChannels.localBusiness = 60;
                distributionChannels.directSales = 40;
                
                eventPlanning.eventType = 'sulap';
                eventPlanning.eventDays = 3;
                eventPlanning.dailyEventCapacity = 110;
                eventPlanning.selectedProducts = ['P004', 'P001', 'P005'];
                
                loadCurrentSettings();
                updateUniversalSettings();
                updateShelfLifeSettings();
                updateBatchCounterDisplays();
                syncWithOtherComponents();
                
                showNotification('ALL DATA CLEARED. System reset to empty state.', 'success', 7000);
                logActivity('System', 'Complete data clear performed');
                
            } catch (error) {
                handleError(error, 'data clearing');
            }
        } else {
            showNotification('Data clearing cancelled - incorrect confirmation text', 'warning');
        }
    }
}

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

function safeUpdateValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.value = value;
    }
}