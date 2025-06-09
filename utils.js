// =============================================================================
// UTILITY FUNCTIONS AND HELPERS
// =============================================================================

// Tab Management
function showTab(tabName) {
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
        // Ensure content is visible and not blank
        if (!targetContent.innerHTML.trim()) {
            loadTabContent(tabName);
        }
    }
    
    // Add active class to selected tab
    const targetTab = document.getElementById('tab-' + tabName);
    if (targetTab) {
        targetTab.className = targetTab.className.replace('tab-inactive', 'tab-active');
    }
    
    // Load tab-specific content if needed
    setTimeout(() => {
        loadTabContent(tabName);
    }, 50);
    
    // Update system state
    if (typeof systemState !== 'undefined') {
        systemState.currentTab = tabName;
    }
}

// Load specific tab content
function loadTabContent(tabName) {
    try {
        switch(tabName) {
            case 'dashboard':
                if (typeof updateDashboard === 'function') {
                    updateDashboard();
                }
                break;
            case 'inventory':
                if (typeof loadInventoryTab === 'function') {
                    loadInventoryTab();
                }
                break;
            case 'events':
                if (typeof loadEventsTab === 'function') {
                    loadEventsTab();
                }
                break;
            case 'distribution':
                if (typeof loadDistributionTab === 'function') {
                    loadDistributionTab();
                }
                break;
            case 'databank':
                if (typeof loadDatabankTab === 'function') {
                    loadDatabankTab();
                }
                break;
            case 'settings':
                if (typeof loadSettingsTab === 'function') {
                    loadSettingsTab();
                }
                break;
        }
    } catch (error) {
        console.error(`Error loading tab content for ${tabName}:`, error);
        handleError(error, `loading ${tabName} tab`);
    }
}

// Dashboard model selection
function selectDashboardModel(model) {
    try {
        currentDashboardModel = model;
        
        // Update button states
        const m1Btn = document.getElementById('btn-dashboard-m1');
        const m2Btn = document.getElementById('btn-dashboard-m2');
        
        if (m1Btn && m2Btn) {
            m1Btn.className = model === 'm1' ? 
                'px-6 py-3 rounded-lg font-medium transition-colors business-model-active' : 
                'px-6 py-3 rounded-lg font-medium transition-colors business-model-inactive';
            
            m2Btn.className = model === 'm2' ? 
                'px-6 py-3 rounded-lg font-medium transition-colors business-model-active' : 
                'px-6 py-3 rounded-lg font-medium transition-colors business-model-inactive';
        }
        
        // Update description
        const description = model === 'm1' ? 
            'Viewing M1 - Event Planning business dashboard with all 6 tea products for SULAP/JAM events.' :
            'Viewing M2 - Distribution business dashboard focused on Sun-Kissed Peach daily operations.';
        safeUpdateText('dashboard-model-description', description);
        
        // Show/hide sections
        const m1Section = document.getElementById('m1-dashboard-section');
        const m2Section = document.getElementById('m2-dashboard-section');
        
        if (m1Section) m1Section.classList.toggle('hidden', model !== 'm1');
        if (m2Section) m2Section.classList.toggle('hidden', model !== 'm2');
        
        // Update dashboard data
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
    } catch (error) {
        handleError(error, 'dashboard model selection');
    }
}

// =============================================================================
// DATE AND TIME UTILITIES
// =============================================================================

// Helper functions for expiration management
function getDaysUntilExpiration(expirationDate) {
    const today = new Date();
    const expiry = new Date(expirationDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function isExpired(expirationDate) {
    return getDaysUntilExpiration(expirationDate) <= 0;
}

function isExpiringSoon(expirationDate, warningDays = null) {
    const warningThreshold = warningDays || (typeof shelfLifeSettings !== 'undefined' ? shelfLifeSettings.warningDays : 2);
    const daysLeft = getDaysUntilExpiration(expirationDate);
    return daysLeft > 0 && daysLeft <= warningThreshold;
}

function getExpirationStatus(expirationDate) {
    if (isExpired(expirationDate)) {
        return { 
            status: 'expired', 
            class: 'bg-red-100 text-red-800', 
            text: 'EXPIRED',
            color: 'red'
        };
    } else if (isExpiringSoon(expirationDate)) {
        return { 
            status: 'warning', 
            class: 'bg-orange-100 text-orange-800', 
            text: `${getDaysUntilExpiration(expirationDate)} days left`,
            color: 'orange'
        };
    } else {
        return { 
            status: 'good', 
            class: 'bg-green-100 text-green-800', 
            text: `${getDaysUntilExpiration(expirationDate)} days left`,
            color: 'green'
        };
    }
}

// Format date for display
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-MY', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

// Format date for input fields
function formatDateForInput(dateString) {
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    } catch (error) {
        console.error('Error formatting date for input:', error);
        return dateString;
    }
}

// Get current date in various formats
function getCurrentDate() {
    const now = new Date();
    return {
        iso: now.toISOString().split('T')[0],
        display: now.toLocaleDateString('en-MY', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        short: now.toLocaleDateString('en-MY'),
        timestamp: now.getTime()
    };
}

// =============================================================================
// INVENTORY CALCULATION UTILITIES
// =============================================================================

// Helper functions for inventory calculations
function getTotalStock(businessModel, productId) {
    try {
        if (!inventory[businessModel] || !inventory[businessModel][productId]) return 0;
        const batches = inventory[businessModel][productId].batches || [];
        return batches.reduce((total, batch) => {
            return !isExpired(batch.expirationDate) ? total + batch.quantity : total;
        }, 0);
    } catch (error) {
        console.error('Error calculating total stock:', error);
        return 0;
    }
}

function getEarliestExpiringBatch(businessModel, productId) {
    try {
        if (!inventory[businessModel] || !inventory[businessModel][productId]) return null;
        const batches = inventory[businessModel][productId].batches || [];
        const validBatches = batches.filter(batch => !isExpired(batch.expirationDate));
        if (validBatches.length === 0) return null;
        
        return validBatches.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate))[0];
    } catch (error) {
        console.error('Error finding earliest expiring batch:', error);
        return null;
    }
}

function removeExpiredBatches() {
    try {
        // Remove expired batches from event inventory
        Object.keys(inventory.event).forEach(productId => {
            if (inventory.event[productId] && inventory.event[productId].batches) {
                inventory.event[productId].batches = inventory.event[productId].batches.filter(batch => {
                    return !isExpired(batch.expirationDate);
                });
            }
        });

        // Remove expired batches from distribution inventory
        Object.keys(inventory.distribution).forEach(productId => {
            if (inventory.distribution[productId] && inventory.distribution[productId].batches) {
                inventory.distribution[productId].batches = inventory.distribution[productId].batches.filter(batch => {
                    return !isExpired(batch.expirationDate);
                });
            }
        });
    } catch (error) {
        console.error('Error removing expired batches:', error);
    }
}

function addNewBatch(businessModel, productId, quantity) {
    try {
        if (!inventory[businessModel] || !inventory[businessModel][productId]) return false;
        
        const today = new Date();
        const expiryDate = new Date(today);
        const shelfLife = typeof shelfLifeSettings !== 'undefined' ? shelfLifeSettings.defaultShelfLife : 7;
        expiryDate.setDate(today.getDate() + shelfLife);
        
        const batchId = `${businessModel === 'event' ? 'E' : 'D'}${productId.slice(-3)}_${String(batchCounter[businessModel][productId]).padStart(3, '0')}`;
        batchCounter[businessModel][productId]++;
        
        const newBatch = {
            id: batchId,
            quantity: quantity,
            productionDate: today.toISOString().split('T')[0],
            expirationDate: expiryDate.toISOString().split('T')[0]
        };
        
        inventory[businessModel][productId].batches.push(newBatch);
        return true;
    } catch (error) {
        console.error('Error adding new batch:', error);
        return false;
    }
}

function consumeStock(businessModel, productId, quantity) {
    try {
        if (!inventory[businessModel] || !inventory[businessModel][productId]) return false;
        
        const batches = inventory[businessModel][productId].batches;
        // Sort by expiration date (FIFO)
        batches.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));
        
        let remainingToConsume = quantity;
        for (let i = 0; i < batches.length && remainingToConsume > 0; i++) {
            if (isExpired(batches[i].expirationDate)) continue;
            
            const available = batches[i].quantity;
            const consumed = Math.min(available, remainingToConsume);
            
            batches[i].quantity -= consumed;
            remainingToConsume -= consumed;
            
            // Remove batch if quantity reaches 0
            if (batches[i].quantity === 0) {
                batches.splice(i, 1);
                i--; // Adjust index after removal
            }
        }
        
        return remainingToConsume === 0;
    } catch (error) {
        console.error('Error consuming stock:', error);
        return false;
    }
}

// =============================================================================
// RECOMMENDATION CALCULATION UTILITIES
// =============================================================================

// Recommendation calculation functions
function calculateEventRecommendedQuantity(productId, eventType, eventCategory, days = 3) {
    try {
        // Find matching historical data
        const matchingEvents = salesHistory.filter(sale => 
            sale.productId === productId && 
            sale.eventType === eventType && 
            sale.eventCategory === eventCategory
        );
        
        // If no exact match, find by event type
        let relevantEvents = matchingEvents.length > 0 ? matchingEvents : 
                            salesHistory.filter(sale => sale.productId === productId && sale.eventType === eventType);
        
        // If still no match, use event category
        if (relevantEvents.length === 0) {
            relevantEvents = salesHistory.filter(sale => sale.productId === productId && sale.eventCategory === eventCategory);
        }
        
        if (relevantEvents.length === 0) {
            const capacity = typeof universalSettings !== 'undefined' ? universalSettings.eventCapacity : 110;
            return Math.round(capacity * days * 0.15); // Default 15% of total capacity
        }
        
        // Calculate based on average percentage and TOTAL EVENT CAPACITY
        const avgPercentage = relevantEvents.reduce((sum, sale) => sum + sale.percentage, 0) / relevantEvents.length;
        
        // Use TOTAL capacity for entire event duration × percentage
        const capacity = typeof universalSettings !== 'undefined' ? universalSettings.eventCapacity : 110;
        const totalEventCapacity = capacity * days;
        return Math.round((totalEventCapacity * avgPercentage / 100));
    } catch (error) {
        console.error('Error calculating event recommended quantity:', error);
        return 0;
    }
}

function calculateRecommendedQuantity(productId, eventType = 'regular', days = 1) {
    try {
        const productSales = salesHistory.filter(sale => sale.productId === productId);
        const capacity = typeof universalSettings !== 'undefined' ? universalSettings.eventCapacity : 110;
        
        if (productSales.length === 0) return Math.round(capacity * 0.1);
        
        let baseQuantity = 0;
        
        // Use average percentage across all events for regular operations
        const avgPercentage = productSales.reduce((sum, sale) => sum + sale.percentage, 0) / productSales.length;
        baseQuantity = Math.round((capacity * avgPercentage / 100) * days);
        
        return Math.max(1, baseQuantity);
    } catch (error) {
        console.error('Error calculating recommended quantity:', error);
        return 0;
    }
}

// =============================================================================
// FORMATTING UTILITIES
// =============================================================================

// Format number with proper commas
function formatNumber(num) {
    try {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } catch (error) {
        console.error('Error formatting number:', error);
        return num;
    }
}

// Format percentage
function formatPercentage(percentage) {
    try {
        return `${percentage.toFixed(1)}%`;
    } catch (error) {
        console.error('Error formatting percentage:', error);
        return `${percentage}%`;
    }
}

// Format currency (Malaysian Ringgit)
function formatCurrency(amount) {
    try {
        return new Intl.NumberFormat('en-MY', {
            style: 'currency',
            currency: 'MYR'
        }).format(amount);
    } catch (error) {
        console.error('Error formatting currency:', error);
        return `RM ${amount}`;
    }
}

// =============================================================================
// DOM MANIPULATION UTILITIES
// =============================================================================

// Safe DOM element retrieval
function safeGetElement(id) {
    try {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id '${id}' not found`);
        }
        return element;
    } catch (error) {
        console.error(`Error getting element with id '${id}':`, error);
        return null;
    }
}

// Safe text content update
function safeUpdateText(id, text) {
    try {
        const element = safeGetElement(id);
        if (element) {
            element.textContent = text;
        }
    } catch (error) {
        console.error(`Error updating text for element '${id}':`, error);
    }
}

// Safe HTML content update
function safeUpdateHTML(id, html) {
    try {
        const element = safeGetElement(id);
        if (element) {
            element.innerHTML = html;
        }
    } catch (error) {
        console.error(`Error updating HTML for element '${id}':`, error);
    }
}

// Safe value update
function safeUpdateValue(id, value) {
    try {
        const element = document.getElementById(id);
        if (element) {
            element.value = value;
        }
    } catch (error) {
        console.error(`Error updating value for element '${id}':`, error);
    }
}

// =============================================================================
// CSV EXPORT UTILITIES
// =============================================================================

// Export CSV functionality
function exportToCSV(dataType) {
    try {
        let csvContent = '';
        let filename = '';
        
        switch (dataType) {
            case 'inventory':
                csvContent = generateInventoryCSV();
                filename = 'tea_inventory_batch_tracking.csv';
                break;
                
            case 'sales_history':
                csvContent = generateSalesHistoryCSV();
                filename = 'tea_sales_history_malaysian_events.csv';
                break;
                
            case 'forecasting_template':
                csvContent = generateForecastingCSV();
                filename = 'tea_forecasting_universal_settings.csv';
                break;
                
            case 'distribution_tracking':
                csvContent = generateDistributionTrackingCSV();
                filename = 'tea_distribution_tracking.csv';
                break;
                
            default:
                throw new Error('Invalid data type for export');
        }
        
        // Create and download the file
        downloadCSV(csvContent, filename);
        
    } catch (error) {
        console.error('Error exporting CSV:', error);
        showNotification('Error exporting data. Please try again.', 'error');
    }
}

// Generate different types of CSV content
function generateInventoryCSV() {
    let csvContent = 'Business Model,Product ID,Product Name,Description,Total Stock,Current Brewing,Batches Count,Earliest Expiry,Low Stock Alert\n';
    
    // M1 - Event Planning Inventory
    products.forEach(product => {
        const stock = getTotalStock('event', product.id);
        const brewing = inventory.event[product.id]?.brewing || 0;
        const batches = inventory.event[product.id]?.batches || [];
        const earliestBatch = getEarliestExpiringBatch('event', product.id);
        const earliestExpiry = earliestBatch ? earliestBatch.expirationDate : 'N/A';
        csvContent += `M1 - Event Planning,${product.id},${product.name},"${product.description}",${stock},${brewing},${batches.length},${earliestExpiry},${stock < 30 ? 'YES' : 'NO'}\n`;
    });
    
    // M2 - Distribution Inventory (Sun-Kissed Peach only)
    const distStock = getTotalStock('distribution', 'P004');
    const distBrewing = inventory.distribution['P004']?.brewing || 0;
    const distBatches = inventory.distribution['P004']?.batches || [];
    const distEarliestBatch = getEarliestExpiringBatch('distribution', 'P004');
    const distEarliestExpiry = distEarliestBatch ? distEarliestBatch.expirationDate : 'N/A';
    const distProduct = products.find(p => p.id === 'P004');
    csvContent += `M2 - Distribution,P004,${distProduct.name},"${distProduct.description}",${distStock},${distBrewing},${distBatches.length},${distEarliestExpiry},${distStock < 30 ? 'YES' : 'NO'}\n`;
    
    return csvContent;
}

function generateSalesHistoryCSV() {
    let csvContent = 'Product ID,Product Name,Event Period,Event Type,Event Category,Sales Quantity,Days,Daily Average,Percentage of Total\n';
    salesHistory.forEach(sale => {
        const product = products.find(p => p.id === sale.productId);
        const dailyAvg = (sale.sales / sale.days).toFixed(1);
        csvContent += `${sale.productId},${product?.name || 'Unknown'},${sale.period},${sale.eventType},${sale.eventCategory},${sale.sales},${sale.days},${dailyAvg},${sale.percentage}%\n`;
    });
    return csvContent;
}

function generateForecastingCSV() {
    let csvContent = 'Date,Business Model,Product ID,Product Name,Planned Production,Actual Production,Variance,Event Type,Notes\n';
    const today = new Date();
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        // M1 - Event Planning rows
        products.forEach(product => {
            const recommended = calculateRecommendedQuantity(product.id, 'regular', 1);
            csvContent += `${dateStr},M1 - Event Planning,${product.id},${product.name},${recommended},,,"regular",\n`;
        });
        
        // M2 - Distribution row (Sun-Kissed Peach only)
        const distProduct = products.find(p => p.id === 'P004');
        const target = typeof universalSettings !== 'undefined' ? universalSettings.distributionTarget : 100;
        csvContent += `${dateStr},M2 - Distribution,P004,${distProduct.name},${target},,,"daily_distribution",\n`;
    }
    return csvContent;
}

function generateDistributionTrackingCSV() {
    let csvContent = 'Date,Product ID,Product Name,Stock Morning,Produced Today,Local Business,Direct Sales,Total Distributed,Stock Evening,Target Met,Channel Split\n';
    const distributionProduct = products.find(p => p.id === 'P004');
    const localPercent = typeof distributionChannels !== 'undefined' ? distributionChannels.localBusiness : 60;
    const directPercent = typeof distributionChannels !== 'undefined' ? distributionChannels.directSales : 40;
    
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        csvContent += `${dateStr},P004,${distributionProduct.name},,,,,,,"${localPercent}% Local | ${directPercent}% Direct"\n`;
    }
    return csvContent;
}

// Download CSV file
function downloadCSV(csvContent, filename) {
    try {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showNotification(`${filename} downloaded successfully!`, 'success');
        }
    } catch (error) {
        console.error('Error downloading CSV:', error);
        showNotification('Error downloading file. Please try again.', 'error');
    }
}

// =============================================================================
// ERROR HANDLING AND NOTIFICATIONS
// =============================================================================

// Error handling wrapper
function handleError(error, operation = 'operation') {
    console.error(`Error during ${operation}:`, error);
    
    // Update performance metrics
    if (typeof performanceMetrics !== 'undefined') {
        performanceMetrics.errorCount++;
    }
    
    // Display user-friendly error message
    const errorMessages = {
        'network': 'Network error. Please check your connection.',
        'data': 'Data error. Please refresh the page.',
        'calculation': 'Calculation error. Please verify your inputs.',
        'general': 'An unexpected error occurred. Please try again.'
    };
    
    const errorType = error.type || 'general';
    const message = errorMessages[errorType] || errorMessages.general;
    
    showNotification(`${message}\n\nOperation: ${operation}`, 'error');
}

// Notification system
function showNotification(message, type = 'info', duration = 3000) {
    try {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Auto-remove after duration
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, duration);
        
        // Add to notification queue
        if (typeof notificationSystem !== 'undefined') {
            notificationSystem.queue.push({
                message,
                type,
                timestamp: Date.now()
            });
            
            // Keep only recent notifications
            if (notificationSystem.queue.length > notificationSystem.maxNotifications) {
                notificationSystem.queue.shift();
            }
        }
        
    } catch (error) {
        console.error('Error showing notification:', error);
        // Fallback to alert
        alert(message);
    }
}

// =============================================================================
// PERFORMANCE AND DEBUGGING UTILITIES
// =============================================================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance measurement
function measurePerformance(operation, func) {
    const startTime = performance.now();
    const result = func();
    const endTime = performance.now();
    
    console.log(`${operation} took ${(endTime - startTime).toFixed(2)} milliseconds`);
    
    // Update performance metrics
    if (typeof performanceMetrics !== 'undefined') {
        performanceMetrics.updateCount++;
        performanceMetrics.lastRefresh = Date.now();
    }
    
    return result;
}

// Debug helper
function debugLog(message, data = null) {
    if (typeof systemState !== 'undefined' && systemState.debugMode) {
        console.log(`[DEBUG] ${message}`, data);
    }
}

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

// Input validation
function validateNumber(value, min = null, max = null) {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    if (min !== null && num < min) return false;
    if (max !== null && num > max) return false;
    return true;
}

function validatePercentage(value) {
    return validateNumber(value, 0, 100);
}

function validateDate(dateString) {
    try {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    } catch (error) {
        return false;
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// =============================================================================
// LOCAL STORAGE UTILITIES (for future use)
// =============================================================================

// Local storage helpers (commented out as they're not supported in the current environment)
/*
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
}

function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
}
*/

// =============================================================================
// EXPORT FOR MODULE COMPATIBILITY
// =============================================================================

// Export utilities for use in other modules
if (typeof window !== 'undefined') {
    window.TeaInventoryUtils = {
        showTab,
        loadTabContent,
        selectDashboardModel,
        getDaysUntilExpiration,
        isExpired,
        isExpiringSoon,
        getExpirationStatus,
        formatDate,
        formatDateForInput,
        getCurrentDate,
        getTotalStock,
        getEarliestExpiringBatch,
        removeExpiredBatches,
        addNewBatch,
        consumeStock,
        calculateEventRecommendedQuantity,
        calculateRecommendedQuantity,
        formatNumber,
        formatPercentage,
        formatCurrency,
        safeGetElement,
        safeUpdateText,
        safeUpdateHTML,
        safeUpdateValue,
        exportToCSV,
        downloadCSV,
        handleError,
        showNotification,
        debounce,
        throttle,
        measurePerformance,
        debugLog,
        validateNumber,
        validatePercentage,
        validateDate,
        validateEmail
    };
}