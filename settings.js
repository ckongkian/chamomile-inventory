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
                        
                        <div class="mt-3 text-xs text-blue-700">
                            <div><strong>Backup includes:</strong></div>
                            <div>• All M1/M2 sales history data</div>
                            <div>• Current inventory & batch tracking</div>
                            <div>• Universal settings & configurations</div>
                            <div>• Shelf life & safety parameters</div>
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
                        
                        <div class="mt-3 text-xs text-red-700">
                            <div><strong>⚠️ Reset effects:</strong></div>
                            <div>• Factory Reset: Keeps sales history</div>
                            <div>• Clear All: Deletes EVERYTHING</div>
                            <div>• Both actions require confirmation</div>
                        </div>
                    </div>
                </div>
                
                <!-- Emergency Recovery Guide -->
                <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 class="font-medium text-yellow-800 mb-2">🚨 Emergency Recovery Procedures</h5>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
                        <div>
                            <div class="font-medium">If System Not Working:</div>
                            <div>1. Refresh browser (F5)</div>
                            <div>2. Clear browser cache</div>
                            <div>3. Try incognito/private mode</div>
                            <div>4. Import last backup file</div>
                        </div>
                        <div>
                            <div class="font-medium">If Data Lost:</div>
                            <div>1. Check browser downloads for backups</div>
                            <div>2. Look for Google Sheets exports</div>
                            <div>3. Import most recent backup</div>
                            <div>4. Manually re-enter critical data</div>
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
        
        showNotification('Complete backup downloaded successfully! Save this file safely.', 'success', 5000);
        
    } catch (error) {
        handleError(error, 'data backup');
        showNotification('Backup failed. Please try again.', 'error');
    }
}

// Export system settings only
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
        
    } catch (error) {
        handleError(error, 'settings export');
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
                        if (!data.version) {
                            throw new Error('Invalid backup file format');
                        }
                        
                        const confirmMessage = `Import Backup Data?\n\n` +
                            `File: ${file.name}\n` +
                            `Version: ${data.version}\n` +
                            `Date: ${data.timestamp}\n\n` +
                            `This will replace current settings and data. Continue?`;
                        
                        if (confirm(confirmMessage)) {
                            // Import based on backup type
                            if (data.type === "settings_only") {
                                // Import settings only
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
                            } else {
                                // Full backup import
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
                            }
                            
                            // Reload settings and sync
                            loadCurrentSettings();
                            updateUniversalSettings();
                            updateShelfLifeSettings();
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

// Reset to factory defaults
function resetToDefaults() {
    const confirmMessage = `🏭 Reset to Factory Defaults?\n\n` +
        `This will reset:\n` +
        `• Universal settings (M1/M2 capacities, targets)\n` +
        `• Shelf life settings\n` +
        `• Distribution channel allocation\n` +
        `• Event planning preferences\n\n` +
        `This will NOT delete:\n` +
        `• Sales history data\n` +
        `• Current inventory batches\n\n` +
        `Continue with factory reset?`;
    
    if (confirm(confirmMessage)) {
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
            
            showNotification('Settings reset to factory defaults successfully! Sales history and inventory preserved.', 'success', 5000);
            
        } catch (error) {
            handleError(error, 'factory reset');
        }
    }
}

// Clear all data
function clearAllData() {
    const confirmMessage = `🗑️ CLEAR ALL DATA?\n\n` +
        `⚠️ WARNING: This will permanently delete:\n` +
        `• ALL sales history data\n` +
        `• ALL inventory and batches\n` +
        `• ALL settings and configurations\n` +
        `• Everything will be reset to empty state\n\n` +
        `This action CANNOT be undone!\n\n` +
        `Are you absolutely sure?`;
    
    if (confirm(confirmMessage)) {
        const finalConfirm = `🚨 FINAL WARNING!\n\n` +
            `You are about to delete EVERYTHING.\n` +
            `This will permanently erase all your data.\n\n` +
            `Type "DELETE ALL" to confirm:`;
        
        const userInput = prompt(finalConfirm);
        
        if (userInput === "DELETE ALL") {
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
                
                // Reset all settings to defaults
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
                
                // Reset sort direction and editing state
                sortDirection = {};
                editingDataIndex = -1;
                
                // Reload everything
                loadCurrentSettings();
                updateUniversalSettings();
                updateShelfLifeSettings();
                syncWithOtherComponents();
                
                showNotification('ALL DATA CLEARED. System reset to empty state. You can start fresh!', 'success', 7000);
                
            } catch (error) {
                handleError(error, 'data clearing');
            }
        } else {
            showNotification('Data clearing cancelled - incorrect confirmation text', 'warning');
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

// Helper function to safely update form values
function safeUpdateValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.value = value;
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
}>
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

            <!-- Enhanced Google Sheets Integration -->
            <div class="bg-white p-6 rounded-lg border">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <span class="text-green-600 mr-2">📊</span>
                    Google Sheets Integration
                </h3>
                
                <!-- Step-by-Step Setup Guide -->
                <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 class="font-medium text-blue-800 mb-3">📖 Complete Setup Guide - 5 Minutes</h4>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h5 class="font-medium text-blue-800 mb-2">🚀 Step-by-Step Setup</h5>
                            <ol class="text-sm text-blue-700 space-y-2">
                                <li><strong>1. Create Sheet:</strong> Go to <a href="https://sheets.google.com" target="_blank" class="underline">sheets.google.com</a></li>
                                <li><strong>2. New Spreadsheet:</strong> Click "Create" → "Blank spreadsheet"</li>
                                <li><strong>3. Name It:</strong> "Chamomile Tea Inventory System"</li>
                                <li><strong>4. Create Tabs:</strong> At bottom, add these tabs:
                                    <div class="ml-4 text-xs space-y-1 mt-1">
                                        <div>• Current Inventory</div>
                                        <div>• Sales History</div>
                                        <div>• 30-Day Forecast</div>
                                        <div>• M2 Distribution Tracking</div>
                                    </div>
                                </li>
                                <li><strong>5. Import Data:</strong> Use export buttons below → File → Import → Upload</li>
                                <li><strong>6. Replace Data:</strong> Choose "Replace current sheet"</li>
                            </ol>
                        </div>
                        
                        <div>
                            <h5 class="font-medium text-blue-800 mb-2">💡 Pro Setup Tips</h5>
                            <div class="text-sm text-blue-700 space-y-2">
                                <div><strong>📊 Import Process:</strong> File → Import → Upload CSV → Replace current sheet</div>
                                <div><strong>🔄 Weekly Updates:</strong> Export fresh data weekly to keep sheets current</div>
                                <div><strong>👥 Team Access:</strong> Share button → Anyone with link → Editor/Viewer</div>
                                <div><strong>📱 Mobile Use:</strong> Download Google Sheets app for mobile access</div>
                                <div><strong>🔗 Automation:</strong> Use Google Apps Script for auto-updates</div>
                                <div><strong>📈 Visualizations:</strong> Insert → Chart for dashboards</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Advanced Features -->
                    <div class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h6 class="font-medium text-green-800 mb-2">🚀 Advanced Google Sheets Features</h6>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700">
                            <div>
                                <div class="font-medium">📊 Dashboard Creation:</div>
                                <div>• Insert → Chart for graphs</div>
                                <div>• Use pivot tables for analysis</div>
                                <div>• Conditional formatting rules</div>
                            </div>
                            <div>
                                <div class="font-medium">🔄 Automation:</div>
                                <div>• Google Apps Script</div>
                                <div>• Scheduled imports</div>
                                <div>• Email alerts</div>
                            </div>
                            <div>
                                <div class="font-medium">👥 Collaboration:</div>
                                <div>• Share with team</div>
                                <div>• Comment system</div>
                                <div>• Version history</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Export Templates -->
                    <div>
                        <h4 class="font-medium mb-3 text-green-900">📊 Export Data Templates</h4>
                        <div class="space-y-3">
                            <button onclick="exportToCSV('inventory')" class="w-full p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-left transition-colors">
                                <div class="font-medium text-green-800">📦 Current Inventory Sheet</div>
                                <div class="text-sm text-green-600">Batch tracking, M1/M2 stock levels, brewing plans</div>
                                <div class="text-xs text-green-500 mt-1">→ Import to "Current Inventory" tab</div>
                            </button>
                            
                            <button onclick="exportToCSV('sales_history')" class="w-full p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-left transition-colors">
                                <div class="font-medium text-blue-800">📈 Sales History Sheet</div>
                                <div class="text-sm text-blue-600">Complete historical event data with analytics</div>
                                <div class="text-xs text-blue-500 mt-1">→ Import to "Sales History" tab</div>
                            </button>
                            
                            <button onclick="exportToCSV('forecasting_template')" class="w-full p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-left transition-colors">
                                <div class="font-medium text-purple-800">🔮 30-Day Forecasting Template</div>
                                <div class="text-sm text-purple-600">M1/M2 planning with universal settings</div>
                                <div class="text-xs text-purple-500 mt-1">→ Import to "30-Day Forecast" tab</div>
                            </button>
                            
                            <button onclick="exportToCSV('distribution_tracking')" class="w-full p-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg text-left transition-colors">
                                <div class="font-medium text-orange-800">🚚 M2 Distribution Tracker</div>
                                <div class="text-sm text-orange-600">Daily M2 distribution tracking</div>
                                <div class="text-xs text-orange-500 mt-1">→ Import to "M2 Distribution Tracking" tab</div>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Usage Instructions -->
                    <div>
                        <h4 class="font-medium mb-3 text-blue-900">📚 How to Use Google Sheets Integration</h4>
                        <div class="space-y-3">
                            <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <h5 class="font-medium text-blue-800 mb-2">📊 Data Import Process</h5>
                                <div class="text-sm text-blue-700 space-y-1">
                                    <div>1. Click export button → CSV downloads</div>
                                    <div>2. In Google Sheets: File → Import</div>
                                    <div>3. Upload your CSV file</div>
                                    <div>4. Choose "Replace current sheet"</div>
                                    <div>5. Data imports automatically</div>
                                </div>
                            </div>
                            
                            <div class="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <h5 class="font-medium text-green-800 mb-2">🔄 Recommended Workflow</h5>
                                <div class="text-sm text-green-700 space-y-1">
                                    <div><strong>Daily:</strong> Check dashboards in Sheets</div>
                                    <div><strong>Weekly:</strong> Export fresh data</div>
                                    <div><strong>Monthly:</strong> Full analysis & reports</div>
                                    <div><strong>Team:</strong> Share sheets for collaboration</div>
                                </div>
                            </div>
                            
                            <div class="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                <h5 class="font-medium text-purple-800 mb-2">📈 Analysis Features</h5>
                                <div class="text-sm text-purple-700 space-y-1">
                                    <div>• Create charts for trend analysis</div>
                                    <div>• Use pivot tables for summaries</div>
                                    <div>• Apply conditional formatting</div>
                                    <div>• Set up data validation rules</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 class="font-medium text-yellow-800 mb-2">📱 Recommended Workflow</h5>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
                        <div>
                            <div class="font-medium mb-1">Daily Operations:</div>
                            <div>• Morning: Check Google Sheets dashboard</div>
                            <div>• Use this system for planning & operations</div>
                            <div>• Evening: Export updated data to Sheets</div>
                        </div>
                        <div>
                            <div class="font-medium mb-1">Weekly Maintenance:</div>
                            <div>• Full export of all data to Google Sheets</div>
                            <div>• Review trends and patterns</div>
                            <div>• Share reports with stakeholders</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced System Backup & Reset -->
            <div class="bg-white p-6 rounded-lg border">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <span class="text-red-600 mr-2">🔧</span>
                    System Backup & Reset
                </h3>
                
                <!-- Comprehensive How-to Guide -->
                <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 class="font-medium text-red-800 mb-3">📖 Complete Backup & Reset Guide</h4>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h5 class="font-medium text-red-800 mb-2">💾 How to Backup System</h5>
                            <ol class="text-sm text-red-700 space-y-2">
                                <li><strong>1. Click "Backup All Data"</strong> button below</li>
                                <li><strong>2. JSON file downloads</strong> automatically</li>
                                <li><strong>3. Save to safe location:</strong>
                                    <div class="ml-4 text-xs space-y-1 mt-1">
                                        <div>• Google Drive (recommended)</div>
                                        <div>• Dropbox or OneDrive</div>
                                        <div>• Local computer folder</div>
                                    </div>
                                </li>
                                <li><strong>4. Name with date:</strong> "tea_backup_2024_12_15.json"</li>
                                <li><strong>5. Keep multiple versions</strong> (weekly/monthly)</li>
                                <li><strong>6. Test restore occasionally</strong> to verify backups</li>
                            </ol>
                            
                            <div class="mt-3 p-2 bg-red-100 rounded text-xs text-red-600">
                                <strong>⚠️ Backup Contains:</strong> ALL data including sales history, inventory, settings, batch tracking, and business configurations.
                            </div>
                        </div>
                        
                        <div>
                            <h5 class="font-medium text-red-800 mb-2">🔄 How to Use Reset Options</h5>
                            <div class="text-sm text-red-700 space-y-3">
                                <div>
                                    <div class="font-medium">🏭 Factory Reset:</div>
                                    <div>• Returns settings to defaults</div>
                                    <div>• Keeps all sales history data</div>
                                    <div>• Preserves inventory batches</div>
                                    <div>• Resets M1/M2 configurations</div>
                                </div>
                                
                                <div>
                                    <div class="font-medium">🗑️ Clear All Data:</div>
                                    <div>• Deletes EVERYTHING permanently</div>
                                    <div>• Requires typing "DELETE ALL"</div>
                                    <div>• Cannot be undone</div>
                                    <div>• Use only for fresh start</div>
                                </div>
                                
                                <div>
                                    <div class="font-medium">📥 Import Backup:</div>
                                    <div>• Select backup JSON file</div>
                                    <div>• Restores complete system</div>
                                    <div>• Overwrites current data</div>
                                    <div>• Shows backup details first</div>
                                </div>
                            </div>
                            
                            <div class="mt-3 p-2 bg-orange-100 rounded text-xs text-orange-600">
                                <strong>💡 Best Practice:</strong> Always backup before performing any reset operations.
                            </div>
                        </div>
                    </div>
                    
                    <!-- Backup Schedule Guide -->
                    <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h6 class="font-medium text-blue-800 mb-2">📅 Recommended Backup Schedule</h6>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                            <div>
                                <div class="font-medium">Daily (During Events):</div>
                                <div>• Export to Google Sheets</div>
                                <div>• Quick settings backup</div>
                                <div>• Monitor for issues</div>
                            </div>
                            <div>
                                <div class="font-medium">Weekly (Regular):</div>
                                <div>• Full system backup</div>
                                <div>• Store in cloud storage</div>
                                <div>• Test backup integrity</div>
                            </div>
                            <div>
                                <div class="font-medium">Monthly (Archive):</div>
                                <div>• Complete data archive</div>
                                <div>• Multiple storage locations</div>
                                <div>• Document system changes</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div