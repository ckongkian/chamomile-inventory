// Dashboard functionality for the Tea Inventory System

// Update dashboard metrics with enhanced batch tracking and detailed tables
function updateDashboard() {
    try {
        // Remove expired batches first
        removeExpiredBatches();
        
        // Update universal displays first
        updateUniversalDisplays();
        
        // Event Planning Metrics with batch tracking
        updateEventPlanningMetrics();
        
        // Distribution Metrics with batch tracking
        updateDistributionMetrics();
        
        // Update detailed tables
        updateEventStockTable();
        updateDistributionStockTable();
        
        // Update separated alerts by business model
        updateSeparatedAlerts();
        
    } catch (error) {
        handleError(error, 'dashboard update');
    }
}

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
        
    } catch (error) {
        console.error('Error updating event planning metrics:', error);
    }
}

// Update Distribution Metrics
function updateDistributionMetrics() {
    try {
        const distStock = getTotalStock('distribution', 'P004');
        const distBrewing = inventory.distribution['P004']?.brewing || 0;
        const distAvailable = distStock + distBrewing;
        const earliestDistBatch = getEarliestExpiringBatch('distribution', 'P004');
        const distExpired = earliestDistBatch ? isExpired(earliestDistBatch.expirationDate) : false;
        
        safeUpdateText('distribution-brewing-count', distBrewing);
        safeUpdateText('dist-available-tomorrow', distExpired ? '0 (Expired)' : distAvailable);
        
        // Calculate capacity utilization
        const capacityUtilization = universalSettings.distributionCapacity > 0 ? 
            Math.round((distBrewing / universalSettings.distributionCapacity) * 100) : 0;
        
        const capacityElement = document.getElementById('capacity-utilization-display');
        if (capacityElement) {
            capacityElement.textContent = `${capacityUtilization}%`;
        }
        
    } catch (error) {
        console.error('Error updating distribution metrics:', error);
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
                <tr class="${hasAlert ? 'bg-red-50' : 'bg-white'}">
                    <td class="border border-gray-300 px-3 py-2">
                        <div class="flex items-center space-x-2">
                            <span class="text-lg">${product.icon}</span>
                            <div>
                                <div class="font-medium">${product.name}</div>
                                <div class="text-xs text-gray-500">${product.description}</div>
                            </div>
                        </div>
                    </td>
                    <td class="border border-gray-300 px-3 py-2 text-center font-semibold">${stock}</td>
                    <td class="border border-gray-300 px-3 py-2 text-center font-semibold">${brewing}</td>
                    <td class="border border-gray-300 px-3 py-2 text-center font-semibold">${available}</td>
                    <td class="border border-gray-300 px-3 py-2 text-center">
                        <span class="inline-block ${expirationStatus.class} text-xs px-2 py-1 rounded">
                            ${expirationStatus.text}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
        
        safeUpdateHTML('event-stock-table', tableHtml);
        
    } catch (error) {
        console.error('Error updating event stock table:', error);
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
            <tr class="${hasAlert ? 'bg-red-50' : ''}">
                <td class="border border-gray-300 px-3 py-2">
                    <div class="flex items-center space-x-2">
                        <span class="text-lg">${product.icon}</span>
                        <div>
                            <div class="font-medium">${product.name}</div>
                            <div class="text-xs text-gray-500">${product.description}</div>
                        </div>
                    </div>
                </td>
                <td class="border border-gray-300 px-3 py-2 text-center font-semibold">${stock}</td>
                <td class="border border-gray-300 px-3 py-2 text-center font-semibold">${brewing}</td>
                <td class="border border-gray-300 px-3 py-2 text-center font-semibold">${available}</td>
                <td class="border border-gray-300 px-3 py-2 text-center">
                    <span class="inline-block ${expirationStatus.class} text-xs px-2 py-1 rounded">
                        ${expirationStatus.text}
                    </span>
                </td>
            </tr>
        `;
        
        safeUpdateHTML('distribution-stock-table', tableHtml);
        
    } catch (error) {
        console.error('Error updating distribution stock table:', error);
    }
}

// Update separated alerts for both business models with batch tracking
function updateSeparatedAlerts() {
    try {
        // Event Planning Alerts
        const eventAlerts = generateEventAlerts();
        updateEventAlertsDisplay(eventAlerts);
        
        // Distribution Alerts
        const distributionAlerts = generateDistributionAlerts();
        updateDistributionAlertsDisplay(distributionAlerts);
        
    } catch (error) {
        console.error('Error updating separated alerts:', error);
    }
}

// Generate Event Planning Alerts
function generateEventAlerts() {
    const eventAlerts = [];
    
    products.forEach(product => {
        const stock = getTotalStock('event', product.id);
        const batches = inventory.event[product.id]?.batches || [];
        
        if (stock < 30) {
            eventAlerts.push({
                name: product.name,
                issue: `${stock} bottles`,
                type: 'Low Stock',
                severity: 'warning'
            });
        }
        
        // Check for expired or expiring batches
        batches.forEach(batch => {
            if (isExpired(batch.expirationDate)) {
                eventAlerts.push({
                    name: product.name,
                    issue: `Batch ${batch.id} EXPIRED`,
                    type: 'Expired Batch',
                    severity: 'danger'
                });
            } else if (isExpiringSoon(batch.expirationDate)) {
                const daysLeft = getDaysUntilExpiration(batch.expirationDate);
                eventAlerts.push({
                    name: product.name,
                    issue: `Batch ${batch.id} - ${daysLeft} days left`,
                    type: 'Expiring Soon',
                    severity: 'warning'
                });
            }
        });
    });
    
    return eventAlerts;
}

// Generate Distribution Alerts
function generateDistributionAlerts() {
    const distributionAlerts = [];
    const distStock = getTotalStock('distribution', 'P004');
    const distBatches = inventory.distribution['P004']?.batches || [];
    
    if (distStock < 30) {
        distributionAlerts.push({
            name: 'Sun-Kissed Peach',
            issue: `${distStock} bottles`,
            type: 'Low Stock',
            severity: 'warning'
        });
    }
    
    // Check distribution batches
    distBatches.forEach(batch => {
        if (isExpired(batch.expirationDate)) {
            distributionAlerts.push({
                name: 'Sun-Kissed Peach',
                issue: `Batch ${batch.id} EXPIRED`,
                type: 'Expired Batch',
                severity: 'danger'
            });
        } else if (isExpiringSoon(batch.expirationDate)) {
            const daysLeft = getDaysUntilExpiration(batch.expirationDate);
            distributionAlerts.push({
                name: 'Sun-Kissed Peach',
                issue: `Batch ${batch.id} - ${daysLeft} days left`,
                type: 'Expiring Soon',
                severity: 'warning'
            });
        }
    });
    
    return distributionAlerts;
}

// Update Event Alerts Display
function updateEventAlertsDisplay(eventAlerts) {
    try {
        if (eventAlerts.length > 0) {
            const eventAlertsHtml = eventAlerts.map(alert => `
                <div class="p-3 border rounded ${alert.severity === 'danger' ? 'border-red-300 bg-red-50' : 'border-orange-300 bg-orange-50'}">
                    <div class="flex justify-between items-center">
                        <span class="${alert.severity === 'danger' ? 'text-red-700' : 'text-orange-700'} font-medium">${alert.name}</span>
                        <span class="font-semibold ${alert.severity === 'danger' ? 'text-red-800' : 'text-orange-800'}">${alert.issue}</span>
                    </div>
                    <p class="text-xs ${alert.severity === 'danger' ? 'text-red-600' : 'text-orange-600'}">${alert.type}</p>
                </div>
            `).join('');
            safeUpdateHTML('event-alert-items', eventAlertsHtml);
        } else {
            safeUpdateHTML('event-alert-items', '<div class="text-green-700 text-sm">✅ No alerts - all products in good condition</div>');
        }
        
        // Show the alerts section
        const alertsSection = document.getElementById('event-alerts');
        if (alertsSection) {
            alertsSection.style.display = 'block';
        }
        
    } catch (error) {
        console.error('Error updating event alerts display:', error);
    }
}

// Update Distribution Alerts Display
function updateDistributionAlertsDisplay(distributionAlerts) {
    try {
        if (distributionAlerts.length > 0) {
            const distributionAlertsHtml = distributionAlerts.map(alert => `
                <div class="p-3 border rounded ${alert.severity === 'danger' ? 'border-red-300 bg-red-50' : 'border-orange-300 bg-orange-50'}">
                    <div class="flex justify-between items-center">
                        <span class="${alert.severity === 'danger' ? 'text-red-700' : 'text-orange-700'} font-medium">${alert.name}</span>
                        <span class="font-semibold ${alert.severity === 'danger' ? 'text-red-800' : 'text-orange-800'}">${alert.issue}</span>
                    </div>
                    <p class="text-xs ${alert.severity === 'danger' ? 'text-red-600' : 'text-orange-600'}">${alert.type}</p>
                </div>
            `).join('');
            safeUpdateHTML('distribution-alert-items', distributionAlertsHtml);
        } else {
            safeUpdateHTML('distribution-alert-items', '<div class="text-green-700 text-sm">✅ No alerts - distribution stock in good condition</div>');
        }
        
        // Show the alerts section
        const alertsSection = document.getElementById('distribution-alerts');
        if (alertsSection) {
            alertsSection.style.display = 'block';
        }
        
    } catch (error) {
        console.error('Error updating distribution alerts display:', error);
    }
}

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
        
    } catch (error) {
        console.error('Error updating universal displays:', error);
    }
}

// Initialize dashboard when loaded
function initializeDashboard() {
    try {
        // Set current date
        const currentDateElement = document.getElementById('current-date');
        if (currentDateElement) {
            currentDateElement.textContent = new Date().toLocaleDateString('en-MY');
        }
        
        // Initial dashboard update
        updateDashboard();
        
        // Set up periodic updates (every 30 seconds)
        setInterval(updateDashboard, 30000);
        
    } catch (error) {
        handleError(error, 'dashboard initialization');
    }
}

// Refresh dashboard manually
function refreshDashboard() {
    try {
        updateDashboard();
        
        // Show a brief success message
        const message = document.createElement('div');
        message.textContent = 'Dashboard refreshed!';
        message.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
        document.body.appendChild(message);
        
        setTimeout(() => {
            document.body.removeChild(message);
        }, 2000);
        
    } catch (error) {
        handleError(error, 'dashboard refresh');
    }
}