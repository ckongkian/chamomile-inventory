// =============================================================================
// DASHBOARD FUNCTIONALITY AND METRICS
// =============================================================================

// Update dashboard metrics with enhanced batch tracking and detailed tables
function updateDashboard() {
    try {
        // Remove expired batches first
        removeExpiredBatches();
        
        // Update universal displays first
        updateUniversalDisplays();
        
        if (currentDashboardModel === 'm1') {
            // M1 - Event Planning Metrics with batch tracking
            updateEventPlanningMetrics();
            updateEventStockTable();
            updateEventAlertsDisplay();
        } else {
            // M2 - Distribution Metrics with batch tracking
            updateDistributionMetrics();
            updateDistributionStockTable();
            updateDistributionAlertsDisplay();
        }
        
        // Update performance metrics
        if (typeof performanceMetrics !== 'undefined') {
            performanceMetrics.lastRefresh = Date.now();
            performanceMetrics.updateCount++;
        }
        
    } catch (error) {
        handleError(error, 'dashboard update');
    }
}

// =============================================================================
// M1 - EVENT PLANNING DASHBOARD FUNCTIONS
// =============================================================================

// Update Event Planning Metrics
function updateEventPlanningMetrics() {
    try {
        const eventLowStockProducts = products.filter(p => getTotalStock('event', p.id) < 30);
        const eventExpiredBatches = [];
        const eventExpiringSoonBatches = [];
        
        products.forEach(product => {
            const batches = inventory.event[product.id]?.batches || [];
            batches.forEach(batch => {
                if (isExpired(batch.expirationDate)) {
                    eventExpiredBatches.push({product, batch});
                } else if (isExpiringSoon(batch.expirationDate)) {
                    eventExpiringSoonBatches.push({product, batch});
                }
            });
        });
        
        const totalAlerts = eventLowStockProducts.length + eventExpiredBatches.length + eventExpiringSoonBatches.length;
        safeUpdateText('event-low-stock-count', totalAlerts);
        
        // Update additional metrics
        updateEventCapacityUtilization();
        updateEventProductAvailability();
        
        debugLog('Event planning metrics updated', {
            lowStock: eventLowStockProducts.length,
            expired: eventExpiredBatches.length,
            expiringSoon: eventExpiringSoonBatches.length,
            totalAlerts: totalAlerts
        });
        
    } catch (error) {
        console.error('Error updating event planning metrics:', error);
        handleError(error, 'event planning metrics update');
    }
}

// Update Event Planning Stock Table
function updateEventStockTable() {
    try {
        const tableHtml = products.map(product => {
            const stock = getTotalStock('event', product.id);
            const brewing = inventory.event[product.id]?.brewing || 0;
            const available = stock + brewing;
            const earliestBatch = getEarliestExpiringBatch('event', product.id);
            const expirationStatus = earliestBatch ? getExpirationStatus(earliestBatch.expirationDate) : 
                { status: 'expired', class: 'bg-red-100 text-red-800', text: 'No Stock' };
            
            // Determine row background color for alerts
            const hasAlert = stock < 30 || expirationStatus.status === 'expired' || expirationStatus.status === 'warning';
            
            return `
                <tr class="${hasAlert ? 'bg-red-50' : 'bg-white'} ${hasAlert ? 'alert-row' : ''}">
                    <td class="border border-gray-300 px-3 py-2">
                        <div class="flex items-center space-x-2">
                            <span class="text-lg">${product.icon}</span>
                            <div>
                                <div class="font-medium">${product.name}</div>
                                <div class="text-xs text-gray-500">${product.description}</div>
                            </div>
                        </div>
                    </td>
                    <td class="border border-gray-300 px-3 py-2 text-center font-semibold ${stock < 30 ? 'text-red-600' : 'text-gray-900'}">${stock}</td>
                    <td class="border border-gray-300 px-3 py-2 text-center font-semibold ${brewing > 0 ? 'text-blue-600' : 'text-gray-900'}">${brewing}</td>
                    <td class="border border-gray-300 px-3 py-2 text-center font-semibold ${available < 30 ? 'text-orange-600' : 'text-green-600'}">${available}</td>
                    <td class="border border-gray-300 px-3 py-2 text-center">
                        <span class="inline-block ${expirationStatus.class} text-xs px-2 py-1 rounded">
                            ${expirationStatus.text}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
        
        safeUpdateHTML('event-stock-table', tableHtml);
        
        debugLog('Event stock table updated', {
            products: products.length,
            alerts: document.querySelectorAll('.alert-row').length
        });
        
    } catch (error) {
        console.error('Error updating event stock table:', error);
        handleError(error, 'event stock table update');
    }
}

// Update Event Alerts Display
function updateEventAlertsDisplay() {
    try {
        const eventAlerts = generateEventAlerts();
        
        if (eventAlerts.length > 0) {
            const eventAlertsHtml = eventAlerts.map(alert => `
                <div class="p-3 border rounded ${alert.severity === 'danger' ? 'border-red-300 bg-red-50' : 'border-orange-300 bg-orange-50'} transition-all duration-200 hover:shadow-md">
                    <div class="flex justify-between items-center">
                        <span class="${alert.severity === 'danger' ? 'text-red-700' : 'text-orange-700'} font-medium flex items-center">
                            <span class="mr-2">${alert.severity === 'danger' ? '🚨' : '⚠️'}</span>
                            ${alert.name}
                        </span>
                        <span class="font-semibold ${alert.severity === 'danger' ? 'text-red-800' : 'text-orange-800'}">${alert.issue}</span>
                    </div>
                    <p class="text-xs ${alert.severity === 'danger' ? 'text-red-600' : 'text-orange-600'} mt-1">${alert.type}</p>
                </div>
            `).join('');
            safeUpdateHTML('event-alert-items', eventAlertsHtml);
        } else {
            safeUpdateHTML('event-alert-items', `
                <div class="text-green-700 text-sm flex items-center">
                    <span class="mr-2">✅</span>
                    No alerts - all products in good condition
                </div>
            `);
        }
        
        debugLog('Event alerts updated', { alertCount: eventAlerts.length });
        
    } catch (error) {
        console.error('Error updating event alerts display:', error);
        handleError(error, 'event alerts update');
    }
}

// Generate Event Planning Alerts
function generateEventAlerts() {
    const eventAlerts = [];
    
    try {
        products.forEach(product => {
            const stock = getTotalStock('event', product.id);
            const batches = inventory.event[product.id]?.batches || [];
            
            // Low stock alert
            if (stock < 30) {
                eventAlerts.push({
                    name: product.name,
                    issue: `${stock} bottles`,
                    type: 'Low Stock - Below 30 bottles',
                    severity: stock < 10 ? 'danger' : 'warning',
                    priority: stock < 10 ? 1 : 2
                });
            }
            
            // Check for expired or expiring batches
            batches.forEach(batch => {
                if (isExpired(batch.expirationDate)) {
                    eventAlerts.push({
                        name: product.name,
                        issue: `Batch ${batch.id} EXPIRED`,
                        type: 'Expired Batch - Remove immediately',
                        severity: 'danger',
                        priority: 1
                    });
                } else if (isExpiringSoon(batch.expirationDate)) {
                    const daysLeft = getDaysUntilExpiration(batch.expirationDate);
                    eventAlerts.push({
                        name: product.name,
                        issue: `Batch ${batch.id} - ${daysLeft} day${daysLeft > 1 ? 's' : ''} left`,
                        type: 'Expiring Soon - Use first',
                        severity: daysLeft === 1 ? 'danger' : 'warning',
                        priority: daysLeft === 1 ? 1 : 3
                    });
                }
            });
        });
        
        // Sort by priority (1 = highest priority)
        eventAlerts.sort((a, b) => a.priority - b.priority);
        
    } catch (error) {
        console.error('Error generating event alerts:', error);
    }
    
    return eventAlerts;
}

// Update Event Capacity Utilization
function updateEventCapacityUtilization() {
    try {
        const totalBrewing = Object.values(inventory.event).reduce((sum, item) => sum + (item.brewing || 0), 0);
        const capacity = universalSettings.eventCapacity;
        const utilization = capacity > 0 ? Math.round((totalBrewing / capacity) * 100) : 0;
        
        // Update capacity utilization display if element exists
        const utilizationElement = document.getElementById('event-capacity-utilization');
        if (utilizationElement) {
            utilizationElement.textContent = `${utilization}%`;
            utilizationElement.className = `font-semibold ${
                utilization > 90 ? 'text-red-600' : 
                utilization > 70 ? 'text-orange-600' : 
                'text-green-600'
            }`;
        }
        
    } catch (error) {
        console.error('Error updating event capacity utilization:', error);
    }
}

// Update Event Product Availability
function updateEventProductAvailability() {
    try {
        const availableProducts = products.filter(p => getTotalStock('event', p.id) > 0).length;
        const availabilityElement = document.getElementById('event-product-availability');
        if (availabilityElement) {
            availabilityElement.textContent = `${availableProducts}/${products.length}`;
        }
        
    } catch (error) {
        console.error('Error updating event product availability:', error);
    }
}

// =============================================================================
// M2 - DISTRIBUTION DASHBOARD FUNCTIONS
// =============================================================================

// Update Distribution Metrics
function updateDistributionMetrics() {
    try {
        const distStock = getTotalStock('distribution', 'P004');
        const distBrewing = inventory.distribution['P004']?.brewing || 0;
        const distAvailable = distStock + distBrewing;
        const earliestDistBatch = getEarliestExpiringBatch('distribution', 'P004');
        const distExpired = earliestDistBatch ? isExpired(earliestDistBatch.expirationDate) : false;
        
        // Update basic metrics
        safeUpdateText('distribution-brewing-count', distBrewing);
        safeUpdateText('dist-available-tomorrow', distExpired ? '0 (Expired)' : distAvailable);
        
        // Calculate capacity utilization
        const capacityUtilization = universalSettings.distributionCapacity > 0 ? 
            Math.round((distBrewing / universalSettings.distributionCapacity) * 100) : 0;
        
        const capacityElement = document.getElementById('distribution-capacity-utilization');
        if (capacityElement) {
            capacityElement.textContent = `${capacityUtilization}%`;
            capacityElement.className = `font-semibold ${
                capacityUtilization > 90 ? 'text-red-600' : 
                capacityUtilization > 70 ? 'text-orange-600' : 
                'text-green-600'
            }`;
        }
        
        // Update target achievement
        updateDistributionTargetAchievement(distAvailable);
        
        debugLog('Distribution metrics updated', {
            stock: distStock,
            brewing: distBrewing,
            available: distAvailable,
            capacityUtilization: capacityUtilization
        });
        
    } catch (error) {
        console.error('Error updating distribution metrics:', error);
        handleError(error, 'distribution metrics update');
    }
}

// Update Distribution Stock Table
function updateDistributionStockTable() {
    try {
        const product = products.find(p => p.id === 'P004');
        if (!product) {
            console.error('Product P004 not found');
            return;
        }
        
        const stock = getTotalStock('distribution', 'P004');
        const brewing = inventory.distribution['P004']?.brewing || 0;
        const available = stock + brewing;
        const earliestBatch = getEarliestExpiringBatch('distribution', 'P004');
        const expirationStatus = earliestBatch ? getExpirationStatus(earliestBatch.expirationDate) : 
            { status: 'expired', class: 'bg-red-100 text-red-800', text: 'No Stock' };
        
        const hasAlert = stock < 30 || expirationStatus.status === 'expired';
        
        const tableHtml = `
            <tr class="${hasAlert ? 'bg-red-50 alert-row' : ''} transition-colors duration-200">
                <td class="border border-gray-300 px-3 py-2">
                    <div class="flex items-center space-x-2">
                        <span class="text-lg">${product.icon}</span>
                        <div>
                            <div class="font-medium">${product.name}</div>
                            <div class="text-xs text-gray-500">${product.description}</div>
                            <div class="text-xs text-green-600 font-medium">M2 - Distribution Focus</div>
                        </div>
                    </div>
                </td>
                <td class="border border-gray-300 px-3 py-2 text-center font-semibold ${stock < 30 ? 'text-red-600' : 'text-gray-900'}">${stock}</td>
                <td class="border border-gray-300 px-3 py-2 text-center font-semibold ${brewing > 0 ? 'text-blue-600' : 'text-gray-900'}">${brewing}</td>
                <td class="border border-gray-300 px-3 py-2 text-center font-semibold ${available < universalSettings.distributionTarget ? 'text-orange-600' : 'text-green-600'}">${available}</td>
                <td class="border border-gray-300 px-3 py-2 text-center">
                    <span class="inline-block ${expirationStatus.class} text-xs px-2 py-1 rounded">
                        ${expirationStatus.text}
                    </span>
                </td>
            </tr>
        `;
        
        safeUpdateHTML('distribution-stock-table', tableHtml);
        
        debugLog('Distribution stock table updated', {
            stock: stock,
            brewing: brewing,
            available: available,
            hasAlert: hasAlert
        });
        
    } catch (error) {
        console.error('Error updating distribution stock table:', error);
        handleError(error, 'distribution stock table update');
    }
}

// Update Distribution Alerts Display
function updateDistributionAlertsDisplay() {
    try {
        const distributionAlerts = generateDistributionAlerts();
        
        if (distributionAlerts.length > 0) {
            const distributionAlertsHtml = distributionAlerts.map(alert => `
                <div class="p-3 border rounded ${alert.severity === 'danger' ? 'border-red-300 bg-red-50' : 'border-orange-300 bg-orange-50'} transition-all duration-200 hover:shadow-md">
                    <div class="flex justify-between items-center">
                        <span class="${alert.severity === 'danger' ? 'text-red-700' : 'text-orange-700'} font-medium flex items-center">
                            <span class="mr-2">${alert.severity === 'danger' ? '🚨' : '⚠️'}</span>
                            ${alert.name}
                        </span>
                        <span class="font-semibold ${alert.severity === 'danger' ? 'text-red-800' : 'text-orange-800'}">${alert.issue}</span>
                    </div>
                    <p class="text-xs ${alert.severity === 'danger' ? 'text-red-600' : 'text-orange-600'} mt-1">${alert.type}</p>
                </div>
            `).join('');
            safeUpdateHTML('distribution-alert-items', distributionAlertsHtml);
        } else {
            safeUpdateHTML('distribution-alert-items', `
                <div class="text-green-700 text-sm flex items-center">
                    <span class="mr-2">✅</span>
                    No alerts - distribution stock in good condition
                </div>
            `);
        }
        
        debugLog('Distribution alerts updated', { alertCount: distributionAlerts.length });
        
    } catch (error) {
        console.error('Error updating distribution alerts display:', error);
        handleError(error, 'distribution alerts update');
    }
}

// Generate Distribution Alerts
function generateDistributionAlerts() {
    const distributionAlerts = [];
    
    try {
        const distStock = getTotalStock('distribution', 'P004');
        const distBatches = inventory.distribution['P004']?.batches || [];
        const target = universalSettings.distributionTarget;
        
        // Low stock alert
        if (distStock < 30) {
            distributionAlerts.push({
                name: 'Sun-Kissed Peach',
                issue: `${distStock} bottles`,
                type: 'Low Stock - Below 30 bottles',
                severity: distStock < 10 ? 'danger' : 'warning',
                priority: distStock < 10 ? 1 : 2
            });
        }
        
        // Target achievement alert
        const currentAvailable = distStock + (inventory.distribution['P004']?.brewing || 0);
        if (currentAvailable < target) {
            const shortage = target - currentAvailable;
            distributionAlerts.push({
                name: 'Sun-Kissed Peach',
                issue: `${shortage} bottles short of target`,
                type: `Target: ${target} bottles/day`,
                severity: shortage > target * 0.5 ? 'danger' : 'warning',
                priority: shortage > target * 0.5 ? 1 : 3
            });
        }
        
        // Check distribution batches
        distBatches.forEach(batch => {
            if (isExpired(batch.expirationDate)) {
                distributionAlerts.push({
                    name: 'Sun-Kissed Peach',
                    issue: `Batch ${batch.id} EXPIRED`,
                    type: 'Expired Batch - Remove immediately',
                    severity: 'danger',
                    priority: 1
                });
            } else if (isExpiringSoon(batch.expirationDate)) {
                const daysLeft = getDaysUntilExpiration(batch.expirationDate);
                distributionAlerts.push({
                    name: 'Sun-Kissed Peach',
                    issue: `Batch ${batch.id} - ${daysLeft} day${daysLeft > 1 ? 's' : ''} left`,
                    type: 'Expiring Soon - Distribute first',
                    severity: daysLeft === 1 ? 'danger' : 'warning',
                    priority: daysLeft === 1 ? 1 : 3
                });
            }
        });
        
        // Sort by priority (1 = highest priority)
        distributionAlerts.sort((a, b) => a.priority - b.priority);
        
    } catch (error) {
        console.error('Error generating distribution alerts:', error);
    }
    
    return distributionAlerts;
}

// Update Distribution Target Achievement
function updateDistributionTargetAchievement(available) {
    try {
        const target = universalSettings.distributionTarget;
        const achievement = target > 0 ? Math.round((available / target) * 100) : 0;
        
        const achievementElement = document.getElementById('distribution-target-achievement');
        if (achievementElement) {
            achievementElement.textContent = `${achievement}%`;
            achievementElement.className = `font-semibold ${
                achievement >= 100 ? 'text-green-600' : 
                achievement >= 80 ? 'text-orange-600' : 
                'text-red-600'
            }`;
        }
        
    } catch (error) {
        console.error('Error updating distribution target achievement:', error);
    }
}

// =============================================================================
// UNIVERSAL DASHBOARD FUNCTIONS
// =============================================================================

// Update universal displays across the system
function updateUniversalDisplays() {
    try {
        // Update settings summary (if on settings page)
        safeUpdateText('current-event-capacity', `${universalSettings.eventCapacity} bottles/day`);
        safeUpdateText('current-dist-capacity', `${universalSettings.distributionCapacity} bottles/day`);
        safeUpdateText('current-dist-target', `${universalSettings.distributionTarget} bottles/day`);
        safeUpdateText('current-event-duration', `${universalSettings.eventDefaultDuration} days`);

        // Update dashboard displays
        safeUpdateText('event-capacity-display', universalSettings.eventCapacity);
        safeUpdateText('dist-capacity-display', universalSettings.distributionCapacity);
        safeUpdateText('dist-target-display', universalSettings.distributionTarget);
        
        // Update all distribution capacity displays
        const distCapacityElements = document.querySelectorAll('#dist-capacity-display');
        distCapacityElements.forEach(element => {
            element.textContent = universalSettings.distributionCapacity;
        });
        
        // Update all distribution target displays
        const distTargetElements = document.querySelectorAll('#dist-target-display');
        distTargetElements.forEach(element => {
            element.textContent = universalSettings.distributionTarget;
        });
        
        // Update target display 2
        safeUpdateText('target-display-2', universalSettings.distributionTarget);
        
        // Update all target-display elements in distribution page
        const targetDisplayElements = document.querySelectorAll('#target-display');
        targetDisplayElements.forEach(element => {
            element.textContent = `${universalSettings.distributionTarget} bottles/day`;
        });
        
        debugLog('Universal displays updated', universalSettings);
        
    } catch (error) {
        console.error('Error updating universal displays:', error);
        handleError(error, 'universal displays update');
    }
}

// Initialize dashboard when loaded
function initializeDashboard() {
    try {
        // Set current date
        const currentDateElement = document.getElementById('current-date');
        if (currentDateElement) {
            const currentDate = getCurrentDate();
            currentDateElement.textContent = currentDate.display;
        }
        
        // Initial dashboard update
        updateDashboard();
        
        // Set up periodic updates (every 30 seconds)
        if (typeof systemState !== 'undefined' && systemState.autoSaveEnabled) {
            setInterval(() => {
                if (systemState.currentTab === 'dashboard') {
                    updateDashboard();
                }
            }, 30000);
        }
        
        debugLog('Dashboard initialized successfully');
        
    } catch (error) {
        handleError(error, 'dashboard initialization');
    }
}

// Refresh dashboard manually
function refreshDashboard() {
    try {
        measurePerformance('Dashboard Refresh', () => {
            updateDashboard();
        });
        
        // Show a brief success message
        showNotification('Dashboard refreshed successfully!', 'success', 2000);
        
    } catch (error) {
        handleError(error, 'dashboard refresh');
    }
}

// =============================================================================
// DASHBOARD ANALYTICS AND INSIGHTS
// =============================================================================

// Generate dashboard insights
function generateDashboardInsights() {
    try {
        const insights = [];
        
        if (currentDashboardModel === 'm1') {
            // M1 - Event Planning insights
            const totalStock = products.reduce((sum, p) => sum + getTotalStock('event', p.id), 0);
            const totalBrewing = Object.values(inventory.event).reduce((sum, item) => sum + (item.brewing || 0), 0);
            const lowStockProducts = products.filter(p => getTotalStock('event', p.id) < 30);
            
            if (totalStock < 100) {
                insights.push({
                    type: 'warning',
                    message: `Total event stock is low (${totalStock} bottles). Consider increasing production.`,
                    action: 'Increase brewing for upcoming events'
                });
            }
            
            if (lowStockProducts.length > 3) {
                insights.push({
                    type: 'danger',
                    message: `${lowStockProducts.length} products have low stock. This may affect event variety.`,
                    action: 'Prioritize brewing for low-stock products'
                });
            }
            
            if (totalBrewing === 0) {
                insights.push({
                    type: 'info',
                    message: 'No products currently brewing. Plan ahead for upcoming events.',
                    action: 'Check upcoming events and start brewing'
                });
            }
            
        } else {
            // M2 - Distribution insights
            const distStock = getTotalStock('distribution', 'P004');
            const distBrewing = inventory.distribution['P004']?.brewing || 0;
            const target = universalSettings.distributionTarget;
            const available = distStock + distBrewing;
            
            if (available < target) {
                const shortage = target - available;
                insights.push({
                    type: 'warning',
                    message: `Distribution target not met. Short by ${shortage} bottles.`,
                    action: `Brew ${shortage} more bottles to meet daily target`
                });
            }
            
            if (distStock < 20) {
                insights.push({
                    type: 'danger',
                    message: 'Critical stock level for distribution. Immediate action required.',
                    action: 'Start emergency brewing session'
                });
            }
            
            if (available > target * 1.5) {
                insights.push({
                    type: 'success',
                    message: 'Excellent stock levels! Consider expanding distribution channels.',
                    action: 'Explore new business opportunities'
                });
            }
        }
        
        return insights;
        
    } catch (error) {
        console.error('Error generating dashboard insights:', error);
        return [];
    }
}

// Display dashboard insights
function displayDashboardInsights() {
    try {
        const insights = generateDashboardInsights();
        const insightsElement = document.getElementById('dashboard-insights');
        
        if (insightsElement && insights.length > 0) {
            const insightsHtml = insights.map(insight => `
                <div class="p-3 border rounded ${
                    insight.type === 'danger' ? 'border-red-300 bg-red-50' :
                    insight.type === 'warning' ? 'border-orange-300 bg-orange-50' :
                    insight.type === 'success' ? 'border-green-300 bg-green-50' :
                    'border-blue-300 bg-blue-50'
                }">
                    <div class="flex items-start space-x-2">
                        <span class="text-lg">
                            ${insight.type === 'danger' ? '🚨' :
                              insight.type === 'warning' ? '⚠️' :
                              insight.type === 'success' ? '✅' : 'ℹ️'}
                        </span>
                        <div class="flex-1">
                            <p class="text-sm font-medium ${
                                insight.type === 'danger' ? 'text-red-800' :
                                insight.type === 'warning' ? 'text-orange-800' :
                                insight.type === 'success' ? 'text-green-800' :
                                'text-blue-800'
                            }">${insight.message}</p>
                            <p class="text-xs ${
                                insight.type === 'danger' ? 'text-red-600' :
                                insight.type === 'warning' ? 'text-orange-600' :
                                insight.type === 'success' ? 'text-green-600' :
                                'text-blue-600'
                            } mt-1">💡 ${insight.action}</p>
                        </div>
                    </div>
                </div>
            `).join('');
            
            insightsElement.innerHTML = insightsHtml;
        }
        
    } catch (error) {
        console.error('Error displaying dashboard insights:', error);
    }
}

// =============================================================================
// DASHBOARD EXPORT AND REPORTING
// =============================================================================

// Export dashboard summary
function exportDashboardSummary() {
    try {
        const currentDate = getCurrentDate();
        const insights = generateDashboardInsights();
        
        let csvContent = `Dashboard Summary Report\n`;
        csvContent += `Generated: ${currentDate.display}\n`;
        csvContent += `Business Model: ${currentDashboardModel === 'm1' ? 'M1 - Event Planning' : 'M2 - Distribution'}\n\n`;
        
        if (currentDashboardModel === 'm1') {
            // M1 - Event Planning summary
            csvContent += `M1 - Event Planning Summary\n`;
            csvContent += `Event Capacity: ${universalSettings.eventCapacity} bottles/day\n`;
            csvContent += `Products Available: ${products.length}\n`;
            csvContent += `Total Alerts: ${generateEventAlerts().length}\n\n`;
            
            csvContent += `Product,Current Stock,Current Brewing,Available Tomorrow,Status\n`;
            products.forEach(product => {
                const stock = getTotalStock('event', product.id);
                const brewing = inventory.event[product.id]?.brewing || 0;
                const available = stock + brewing;
                const earliestBatch = getEarliestExpiringBatch('event', product.id);
                const status = earliestBatch ? getExpirationStatus(earliestBatch.expirationDate).text : 'No Stock';
                
                csvContent += `${product.name},${stock},${brewing},${available},"${status}"\n`;
            });
            
        } else {
            // M2 - Distribution summary
            const distStock = getTotalStock('distribution', 'P004');
            const distBrewing = inventory.distribution['P004']?.brewing || 0;
            const distAvailable = distStock + distBrewing;
            
            csvContent += `M2 - Distribution Summary\n`;
            csvContent += `Daily Target: ${universalSettings.distributionTarget} bottles/day\n`;
            csvContent += `Daily Capacity: ${universalSettings.distributionCapacity} bottles/day\n`;
            csvContent += `Current Stock: ${distStock} bottles\n`;
            csvContent += `Current Brewing: ${distBrewing} bottles\n`;
            csvContent += `Available Tomorrow: ${distAvailable} bottles\n`;
            csvContent += `Target Achievement: ${Math.round((distAvailable / universalSettings.distributionTarget) * 100)}%\n\n`;
        }
        
        // Add insights
        if (insights.length > 0) {
            csvContent += `Insights and Recommendations\n`;
            insights.forEach((insight, index) => {
                csvContent += `${index + 1}. ${insight.message}\n`;
                csvContent += `   Action: ${insight.action}\n\n`;
            });
        }
        
        downloadCSV(csvContent, `dashboard_summary_${currentDashboardModel}_${currentDate.iso}.csv`);
        
    } catch (error) {
        handleError(error, 'dashboard summary export');
    }
}

// =============================================================================
// INITIALIZATION AND CLEANUP
// =============================================================================

// Auto-initialize dashboard when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeDashboard();
    });
}

// Export dashboard functions for external use
if (typeof window !== 'undefined') {
    window.DashboardFunctions = {
        updateDashboard,
        updateEventPlanningMetrics,
        updateDistributionMetrics,
        updateEventStockTable,
        updateDistributionStockTable,
        updateEventAlertsDisplay,
        updateDistributionAlertsDisplay,
        generateEventAlerts,
        generateDistributionAlerts,
        updateUniversalDisplays,
        initializeDashboard,
        refreshDashboard,
        generateDashboardInsights,
        displayDashboardInsights,
        exportDashboardSummary
    };
}