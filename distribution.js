// M2 - Distribution management functionality

// Load distribution tab content
function loadDistributionTab() {
    const distributionContent = `
        <div class="space-y-6">
            <div class="bg-white p-6 rounded-lg border">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-lg font-semibold flex items-center">
                        <span class="text-green-600 mr-2">📍</span>
                        M2 - Distribution - Sun-Kissed Peach Only
                    </h3>
                </div>
                
                <div class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p class="text-sm text-yellow-800">
                        <strong>📋 M2 - Distribution Business:</strong> Daily distribution business focuses exclusively on Sun-Kissed Peach (V-POT) 
                        with daily brewing capacity managed in universal settings, separate from M1 - Event Planning operations.
                    </p>
                </div>
                
                <!-- How to Use Guide -->
                <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 class="font-medium text-blue-800 mb-3">📖 How to Use M2 - Distribution Management</h4>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h5 class="font-medium text-blue-800 mb-2">🚀 Daily Workflow</h5>
                            <ol class="text-sm text-blue-700 space-y-2">
                                <li><strong>1. Morning Check:</strong> Review current stock levels</li>
                                <li><strong>2. Plan Production:</strong> Use +5/-5 buttons for brewing</li>
                                <li><strong>3. Monitor Channels:</strong> Check Local Business vs Direct Sales split</li>
                                <li><strong>4. Track Progress:</strong> Monitor target achievement</li>
                                <li><strong>5. Record Sales:</strong> Use "Record Today's Sales" button</li>
                                <li><strong>6. Plan Tomorrow:</strong> Use "Plan Tomorrow" for next day</li>
                            </ol>
                        </div>
                        
                        <div>
                            <h5 class="font-medium text-blue-800 mb-2">⚡ Quick Actions Guide</h5>
                            <div class="text-sm text-blue-700 space-y-2">
                                <div><strong>📊 Record Today's Sales:</strong> Enter actual bottles sold to local businesses and direct customers</div>
                                <div><strong>📅 Plan Tomorrow:</strong> System calculates optimal production for next day based on current stock</div>
                                <div><strong>📋 Export Report:</strong> Download complete distribution report with batch details</div>
                                <div><strong>🔄 Refresh Data:</strong> Update all displays with latest information</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div class="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                            <h4 class="font-semibold text-green-900 mb-2">🍑 M2 - Distribution Product</h4>
                            <div class="flex items-center space-x-3">
                                <div class="w-16 h-16 bg-orange-200 rounded-lg flex items-center justify-center">
                                    <span class="text-2xl">🍑</span>
                                </div>
                                <div>
                                    <h5 class="font-medium">Sun-Kissed Peach (V-POT)</h5>
                                    <p class="text-sm text-gray-600">Peach & Orange Peel & Rosehips</p>
                                    <p class="text-sm text-green-700 font-medium">M2 - Distribution Business Focus</p>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span>Current Stock:</span>
                                <span class="font-semibold" id="vpot-stock">0 bottles</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span>Daily Distribution Brewing:</span>
                                <div class="flex items-center space-x-2">
                                    <button onclick="updateDistributionBrewing(-5)" 
                                            class="w-8 h-8 rounded bg-red-100 hover:bg-red-200 text-red-600 text-xs flex items-center justify-center">-5</button>
                                    <span class="font-semibold" id="vpot-brewing">0 bottles</span>
                                    <button onclick="updateDistributionBrewing(5)" 
                                            class="w-8 h-8 rounded bg-green-100 hover:bg-green-200 text-green-600 text-xs flex items-center justify-center">+5</button>
                                </div>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-blue-50 rounded border border-blue-200">
                                <span>Available Tomorrow:</span>
                                <span class="font-semibold text-blue-700" id="vpot-available">0 bottles</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
                                <span>Daily Target:</span>
                                <span class="font-semibold text-green-700" id="target-display">100 bottles/day</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between items-center mb-3">
                            <h4 class="font-semibold">🚚 Distribution Channels</h4>
                            <p class="text-sm text-gray-600">Target: <span id="target-display-2">100</span> bottles/day</p>
                        </div>
                        
                        <!-- Channel Allocation Controls -->
                        <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <h5 class="font-medium text-blue-800 mb-2">📊 Channel Allocation</h5>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-xs font-medium mb-1">Local Business %</label>
                                    <input type="number" id="local-business-percent" value="100" min="0" max="100" 
                                           class="w-full p-2 border rounded text-sm" onchange="updateChannelAllocation()">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium mb-1">Direct Sales %</label>
                                    <input type="number" id="direct-sales-percent" value="0" min="0" max="100" 
                                           class="w-full p-2 border rounded text-sm" onchange="updateChannelAllocation()">
                                </div>
                            </div>
                            <p class="text-xs text-blue-600 mt-1">Total must equal 100%</p>
                        </div>
                        
                        <div class="space-y-3">
                            <div class="border rounded-lg p-3">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="font-medium">Local Businesses</span>
                                    <span class="text-green-600 font-semibold" id="local-business-target">100 bottles/day</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div id="local-business-bar" class="bg-green-500 h-2 rounded-full" style="width: 100%"></div>
                                </div>
                                <p class="text-xs text-gray-500 mt-1">Cafes, restaurants, retail stores in Kota Kinabalu</p>
                            </div>
                            
                            <div class="border rounded-lg p-3">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="font-medium">Direct Sales</span>
                                    <span class="text-blue-600 font-semibold" id="direct-sales-target">0 bottles/day</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div id="direct-sales-bar" class="bg-blue-500 h-2 rounded-full" style="width: 0%"></div>
                                </div>
                                <p class="text-xs text-gray-500 mt-1">Online orders, walk-ins, special orders</p>
                            </div>
                        </div>

                        <div class="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <h5 class="font-medium text-orange-800 mb-2">📊 Distribution Status</h5>
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-sm text-orange-700">Target vs Available:</span>
                                <span class="text-sm font-semibold" id="target-vs-available">100 vs 0</span>
                            </div>
                            <div id="distribution-status">
                                <div class="flex items-center text-red-700">
                                    <span class="mr-1">⚠️</span>
                                    <span class="text-sm">Need 100 more bottles</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Distribution Analytics Section -->
                <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h5 class="font-medium text-blue-800 mb-2">📈 Weekly Performance</h5>
                        <div class="space-y-1 text-sm">
                            <div class="flex justify-between">
                                <span>This Week:</span>
                                <span class="font-semibold" id="weekly-distributed">0 bottles</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Daily Average:</span>
                                <span class="font-semibold" id="weekly-daily-avg">0 bottles</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Target Achievement:</span>
                                <span class="font-semibold" id="weekly-achievement">0%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h5 class="font-medium text-green-800 mb-2">🎯 Today's Plan</h5>
                        <div class="space-y-1 text-sm">
                            <div class="flex justify-between">
                                <span>Morning Stock:</span>
                                <span class="font-semibold" id="morning-stock">0 bottles</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Production Goal:</span>
                                <span class="font-semibold" id="production-goal">100 bottles</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Evening Target:</span>
                                <span class="font-semibold" id="evening-target">100 bottles</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h5 class="font-medium text-purple-800 mb-2">📦 Inventory Health</h5>
                        <div class="space-y-1 text-sm">
                            <div class="flex justify-between">
                                <span>Days of Stock:</span>
                                <span class="font-semibold" id="days-of-stock">0.0 days</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Reorder Status:</span>
                                <span class="font-semibold text-red-600" id="reorder-status">Critical</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Safety Stock:</span>
                                <span class="font-semibold" id="safety-stock">30 bottles</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions with Detailed Instructions -->
                <div class="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h5 class="font-medium text-gray-800 mb-3">⚡ Quick M2 - Distribution Actions</h5>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button onclick="recordDailyDistribution()" class="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded text-sm transition-colors">
                            📊 Record Today's Sales
                        </button>
                        <button onclick="planTomorrowProduction()" class="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded text-sm transition-colors">
                            📅 Plan Tomorrow
                        </button>
                        <button onclick="exportDistributionReport()" class="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded text-sm transition-colors">
                            📋 Export Report
                        </button>
                        <button onclick="refreshDistributionData()" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm transition-colors">
                            🔄 Refresh Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    safeUpdateHTML('distribution-content', distributionContent);
    
    // Initialize distribution display
    setTimeout(() => {
        initializeDistribution();
    }, 100);
}

// Initialize distribution management
function initializeDistribution() {
    try {
        distributionChannels.localBusiness = 100;
        distributionChannels.directSales = 0;
        
        // Update all distribution displays
        updateDistribution();
        updateDistributionAnalytics();
        
    } catch (error) {
        handleError(error, 'distribution initialization');
    }
}

// Updated distribution function to use universal settings
function updateDistribution() {
    try {
        const vpotStock = getTotalStock('distribution', 'P004');
        const vpotBrewing = inventory.distribution['P004']?.brewing || 0;
        const available = vpotStock + vpotBrewing;
        
        // FORCE UPDATE: Update basic info with immediate refresh
        const stockElement = document.getElementById('vpot-stock');
        const brewingElement = document.getElementById('vpot-brewing');
        const availableElement = document.getElementById('vpot-available');
        
        if (stockElement) stockElement.textContent = `${vpotStock} bottles`;
        if (brewingElement) brewingElement.textContent = `${vpotBrewing} bottles`;
        if (availableElement) availableElement.textContent = `${available} bottles`;
        
        // Update target displays to use universal settings
        safeUpdateText('target-display', `${universalSettings.distributionTarget} bottles/day`);
        safeUpdateText('target-display-2', universalSettings.distributionTarget);
        
        // Update channel allocation
        const localBusinessTarget = Math.round(universalSettings.distributionTarget * distributionChannels.localBusiness / 100);
        const directSalesTarget = Math.round(universalSettings.distributionTarget * distributionChannels.directSales / 100);
        
        safeUpdateText('local-business-target', `${localBusinessTarget} bottles/day`);
        safeUpdateText('direct-sales-target', `${directSalesTarget} bottles/day`);
        
        // Update channel bars
        const localBusinessBar = document.getElementById('local-business-bar');
        const directSalesBar = document.getElementById('direct-sales-bar');
        
        if (localBusinessBar) localBusinessBar.style.width = `${distributionChannels.localBusiness}%`;
        if (directSalesBar) directSalesBar.style.width = `${distributionChannels.directSales}%`;
        
        // Update target vs available
        safeUpdateText('target-vs-available', `${universalSettings.distributionTarget} vs ${available}`);
        
        // Update distribution status
        updateDistributionStatus(available);
        
        // Update analytics
        updateDistributionAnalytics();
        
        // FORCE REFRESH: Trigger a DOM reflow to ensure updates are visible
        if (stockElement) {
            stockElement.offsetHeight; // Force reflow
        }
        
    } catch (error) {
        handleError(error, 'distribution update');
    }
}

// Update distribution status indicator
function updateDistributionStatus(available) {
    try {
        const statusElement = document.getElementById('distribution-status');
        if (!statusElement) return;
        
        const target = universalSettings.distributionTarget;
        const shortage = target - available;
        
        if (available >= target) {
            statusElement.innerHTML = `
                <div class="flex items-center text-green-700">
                    <span class="mr-1">✅</span>
                    <span class="text-sm">Daily target achievable</span>
                </div>
            `;
        } else if (shortage <= 20) {
            statusElement.innerHTML = `
                <div class="flex items-center text-orange-700">
                    <span class="mr-1">⚠️</span>
                    <span class="text-sm">Need ${shortage} more bottles (minor shortage)</span>
                </div>
            `;
        } else {
            statusElement.innerHTML = `
                <div class="flex items-center text-red-700">
                    <span class="mr-1">🚨</span>
                    <span class="text-sm">Need ${shortage} more bottles (critical shortage)</span>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Error updating distribution status:', error);
    }
}

// Channel allocation update function
function updateChannelAllocation() {
    try {
        const localPercentElement = document.getElementById('local-business-percent');
        const directPercentElement = document.getElementById('direct-sales-percent');
        
        if (!localPercentElement || !directPercentElement) return;
        
        const localPercent = parseInt(localPercentElement.value);
        const directPercent = parseInt(directPercentElement.value);
        
        // Auto-adjust to ensure total equals 100%
        if (localPercent + directPercent !== 100) {
            if (event && event.target.id === 'local-business-percent') {
                directPercentElement.value = 100 - localPercent;
            } else {
                localPercentElement.value = 100 - directPercent;
            }
        }
        
        distributionChannels.localBusiness = parseInt(localPercentElement.value);
        distributionChannels.directSales = parseInt(directPercentElement.value);
        
        updateDistribution();
        
    } catch (error) {
        handleError(error, 'channel allocation update');
    }
}

// Update distribution analytics
function updateDistributionAnalytics() {
    try {
        const vpotStock = getTotalStock('distribution', 'P004');
        const vpotBrewing = inventory.distribution['P004']?.brewing || 0;
        const available = vpotStock + vpotBrewing;
        const target = universalSettings.distributionTarget;
        
        // Calculate weekly performance (mock data for demo)
        const weeklyDistributed = 420; // This would come from actual sales data
        const weeklyDailyAvg = Math.round(weeklyDistributed / 7);
        const weeklyAchievement = Math.round((weeklyDailyAvg / target) * 100);
        
        safeUpdateText('weekly-distributed', `${weeklyDistributed} bottles`);
        safeUpdateText('weekly-daily-avg', `${weeklyDailyAvg} bottles`);
        safeUpdateText('weekly-achievement', `${weeklyAchievement}%`);
        
        // Today's plan
        const productionGoal = Math.max(0, target - vpotStock);
        safeUpdateText('morning-stock', `${vpotStock} bottles`);
        safeUpdateText('production-goal', `${productionGoal} bottles`);
        safeUpdateText('evening-target', `${target} bottles`);
        
        // Inventory health
        const daysOfStock = target > 0 ? (vpotStock / target).toFixed(1) : '0.0';
        let reorderStatus = 'Good';
        if (vpotStock < 30) reorderStatus = 'Critical';
        else if (vpotStock < 50) reorderStatus = 'Low';
        
        safeUpdateText('days-of-stock', `${daysOfStock} days`);
        safeUpdateText('reorder-status', reorderStatus);
        safeUpdateText('safety-stock', '30 bottles');
        
    } catch (error) {
        console.error('Error updating distribution analytics:', error);
    }
}

// Record daily distribution
function recordDailyDistribution() {
    try {
        const currentStock = getTotalStock('distribution', 'P004');
        
        // Show current stock first
        const localSold = prompt(`Current stock: ${currentStock} bottles\n\nEnter bottles sold to local businesses today:`);
        if (!localSold || isNaN(localSold) || parseInt(localSold) < 0) {
            return;
        }
        
        const directSold = prompt(`Current stock: ${currentStock} bottles\nLocal business: ${localSold} bottles\n\nEnter bottles sold directly today:`);
        if (!directSold || isNaN(directSold) || parseInt(directSold) < 0) {
            return;
        }
        
        const localSoldNum = parseInt(localSold);
        const directSoldNum = parseInt(directSold);
        const totalSold = localSoldNum + directSoldNum;
        
        // Check if we have enough stock
        if (totalSold > currentStock) {
            alert(`❌ Not enough stock!\n\nCurrent stock: ${currentStock} bottles\nTrying to sell: ${totalSold} bottles\nShortage: ${totalSold - currentStock} bottles\n\nPlease check your stock levels.`);
            return;
        }
        
        // Consume stock using FIFO
        const consumed = consumeStock('distribution', 'P004', totalSold);
        
        if (consumed) {
            alert(`✅ Sales recorded successfully!\n\nTotal sold: ${totalSold} bottles\n• Local Business: ${localSoldNum} bottles\n• Direct Sales: ${directSoldNum} bottles\n\nRemaining stock: ${currentStock - totalSold} bottles`);
            
            // Force update displays
            updateDistribution();
            if (typeof updateDashboard === 'function') {
                updateDashboard();
            }
            
            // Log the sales
            if (typeof logActivity === 'function') {
                logActivity('Distribution', `Daily sales recorded: ${totalSold} bottles (Local: ${localSoldNum}, Direct: ${directSoldNum})`);
            }
        } else {
            alert('❌ Error processing sales. Please check stock levels and try again.');
        }
        
    } catch (error) {
        handleError(error, 'daily distribution recording');
    }
}

// Plan tomorrow's production
function planTomorrowProduction() {
    try {
        const currentStock = getTotalStock('distribution', 'P004');
        const currentBrewing = inventory.distribution['P004']?.brewing || 0;
        const target = universalSettings.distributionTarget;
        const capacity = universalSettings.distributionCapacity;
        
        const recommendedProduction = Math.min(capacity, Math.max(0, target - currentStock));
        
        const planMessage = `
📅 Tomorrow's Production Plan

Current Stock: ${currentStock} bottles
Current Brewing: ${currentBrewing} bottles
Daily Target: ${target} bottles
Production Capacity: ${capacity} bottles

Recommended Production: ${recommendedProduction} bottles

This will give you:
- Total Available: ${currentStock + recommendedProduction} bottles
- Target Achievement: ${Math.round(((currentStock + recommendedProduction) / target) * 100)}%

Would you like to set this production amount?
        `;
        
        if (confirm(planMessage)) {
            inventory.distribution['P004'].brewing = recommendedProduction;
            updateDistribution();
            if (typeof updateDashboard === 'function') {
                updateDashboard();
            }
            alert(`Production plan set: ${recommendedProduction} bottles for tomorrow`);
        }
        
    } catch (error) {
        handleError(error, 'production planning');
    }
}

// Export distribution report
function exportDistributionReport() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const vpotStock = getTotalStock('distribution', 'P004');
        const vpotBrewing = inventory.distribution['P004']?.brewing || 0;
        const available = vpotStock + vpotBrewing;
        
        let csvContent = 'M2 - Distribution Business Report\n';
        csvContent += `Report Date,${today}\n`;
        csvContent += `Business Model,M2 - Distribution (Sun-Kissed Peach Only)\n\n`;
        
        csvContent += 'Current Status\n';
        csvContent += `Current Stock,${vpotStock} bottles\n`;
        csvContent += `Current Brewing,${vpotBrewing} bottles\n`;
        csvContent += `Total Available,${available} bottles\n`;
        csvContent += `Daily Target,${universalSettings.distributionTarget} bottles\n`;
        csvContent += `Daily Capacity,${universalSettings.distributionCapacity} bottles\n`;
        csvContent += `Target Achievement,${Math.round((available / universalSettings.distributionTarget) * 100)}%\n\n`;
        
        csvContent += 'Channel Allocation\n';
        csvContent += `Local Business,${distributionChannels.localBusiness}%,${Math.round(universalSettings.distributionTarget * distributionChannels.localBusiness / 100)} bottles\n`;
        csvContent += `Direct Sales,${distributionChannels.directSales}%,${Math.round(universalSettings.distributionTarget * distributionChannels.directSales / 100)} bottles\n\n`;
        
        csvContent += 'Inventory Health\n';
        csvContent += `Days of Stock,${(vpotStock / universalSettings.distributionTarget).toFixed(1)} days\n`;
        csvContent += `Reorder Status,${vpotStock < 30 ? 'Critical' : vpotStock < 50 ? 'Low' : 'Good'}\n`;
        csvContent += `Safety Stock Level,30 bottles\n\n`;
        
        // Add batch information
        const batches = inventory.distribution['P004']?.batches || [];
        if (batches.length > 0) {
            csvContent += 'Batch Details\n';
            csvContent += 'Batch ID,Quantity,Production Date,Expiration Date,Status\n';
            batches.forEach(batch => {
                const status = getExpirationStatus(batch.expirationDate);
                csvContent += `${batch.id},${batch.quantity},${batch.productionDate},${batch.expirationDate},${status.text}\n`;
            });
        }
        
        downloadCSV(csvContent, `m2_distribution_report_${today}.csv`);
        
    } catch (error) {
        handleError(error, 'distribution report export');
    }
}

// Refresh distribution data
function refreshDistributionData() {
    try {
        updateDistribution();
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
        
        showNotification('M2 - Distribution data refreshed!', 'success', 2000);
        
    } catch (error) {
        handleError(error, 'distribution data refresh');
    }
}

// Sync distribution with universal settings
function syncDistributionSettings() {
    try {
        // Update all target displays with new universal settings
        updateDistribution();
        
        // Update analytics with new targets
        updateDistributionAnalytics();
        
    } catch (error) {
        console.error('Error syncing distribution settings:', error);
    }
}

// Distribution brewing functions (separate from events) - Updated for ±5 precision
function updateDistributionBrewing(change) {
    try {
        const current = inventory.distribution['P004']?.brewing || 0;
        const newValue = Math.max(0, Math.min(universalSettings.distributionCapacity, current + change));
        inventory.distribution['P004'].brewing = newValue;
        
        // IMMEDIATE UPDATE: Force update the display elements
        const brewingElement = document.getElementById('vpot-brewing');
        const availableElement = document.getElementById('vpot-available');
        
        if (brewingElement) {
            brewingElement.textContent = `${newValue} bottles`;
        }
        
        if (availableElement) {
            const currentStock = getTotalStock('distribution', 'P004');
            const newAvailable = currentStock + newValue;
            availableElement.textContent = `${newAvailable} bottles`;
        }
        
        // Update other displays
        updateDistribution();
        
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
        
        showNotification(`M2 - Distribution brewing ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change)} bottles`, 'info', 1500);
        
    } catch (error) {
        handleError(error, 'distribution brewing update');
    }
}

// Auto-planning feature for distribution
function autoplanDistribution() {
    try {
        const currentStock = getTotalStock('distribution', 'P004');
        const target = universalSettings.distributionTarget;
        const capacity = universalSettings.distributionCapacity;
        
        // Calculate optimal production for next 3 days
        const threeDayPlan = [];
        let projectedStock = currentStock;
        
        for (let day = 1; day <= 3; day++) {
            const neededProduction = Math.min(capacity, Math.max(0, target - projectedStock));
            threeDayPlan.push({
                day: day,
                startingStock: projectedStock,
                production: neededProduction,
                endingStock: projectedStock + neededProduction - target
            });
            projectedStock = projectedStock + neededProduction - target;
        }
        
        let planText = '📊 3-Day Auto M2 - Distribution Plan:\n\n';
        threeDayPlan.forEach(plan => {
            planText += `Day ${plan.day}:\n`;
            planText += `  Starting Stock: ${plan.startingStock} bottles\n`;
            planText += `  Planned Production: ${plan.production} bottles\n`;
            planText += `  Expected Sales: ${target} bottles\n`;
            planText += `  Ending Stock: ${Math.max(0, plan.endingStock)} bottles\n\n`;
        });
        
        alert(planText);
        
    } catch (error) {
        handleError(error, 'auto distribution planning');
    }
}

// Monitor distribution alerts
function checkDistributionAlerts() {
    try {
        const alerts = [];
        const vpotStock = getTotalStock('distribution', 'P004');
        const target = universalSettings.distributionTarget;
        const batches = inventory.distribution['P004']?.batches || [];
        
        // Stock level alerts
        if (vpotStock < 30) {
            alerts.push({
                type: 'critical',
                message: `Critical stock level: ${vpotStock} bottles (below safety stock of 30)`
            });
        } else if (vpotStock < target * 0.5) {
            alerts.push({
                type: 'warning',
                message: `Low stock level: ${vpotStock} bottles (below 50% of daily target)`
            });
        }
        
        // Expiration alerts
        batches.forEach(batch => {
            const daysLeft = getDaysUntilExpiration(batch.expirationDate);
            if (daysLeft <= 0) {
                alerts.push({
                    type: 'critical',
                    message: `Batch ${batch.id} has expired - remove immediately`
                });
            } else if (daysLeft <= 2) {
                alerts.push({
                    type: 'warning',
                    message: `Batch ${batch.id} expires in ${daysLeft} day(s) - use first`
                });
            }
        });
        
        // Target achievement alerts
        const available = vpotStock + (inventory.distribution['P004']?.brewing || 0);
        const achievementRate = (available / target) * 100;
        
        if (achievementRate < 70) {
            alerts.push({
                type: 'warning',
                message: `Low target achievement: ${achievementRate.toFixed(0)}% (${available}/${target} bottles)`
            });
        }
        
        return alerts;
        
    } catch (error) {
        console.error('Error checking distribution alerts:', error);
        return [];
    }
}