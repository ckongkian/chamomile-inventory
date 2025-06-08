// Utility functions for the Tea Inventory System

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
    }
    
    // Add active class to selected tab
    const targetTab = document.getElementById('tab-' + tabName);
    if (targetTab) {
        targetTab.className = targetTab.className.replace('tab-inactive', 'tab-active');
    }
    
    // Load tab-specific content if needed
    loadTabContent(tabName);
}

// Load specific tab content
function loadTabContent(tabName) {
    switch(tabName) {
        case 'inventory':
            loadInventoryTab();
            break;
        case 'events':
            loadEventsTab();
            break;
        case 'distribution':
            loadDistributionTab();
            break;
        case 'databank':
            loadDatabankTab();
            break;
        case 'settings':
            loadSettingsTab();
            break;
    }
}

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

function isExpiringSoon(expirationDate, warningDays = 2) {
    const daysLeft = getDaysUntilExpiration(expirationDate);
    return daysLeft > 0 && daysLeft <= warningDays;
}

function getExpirationStatus(expirationDate) {
    if (isExpired(expirationDate)) {
        return { 
            status: 'expired', 
            class: 'bg-red-100 text-red-800', 
            text: 'EXPIRED',
            color: 'red'
        };
    } else if (isExpiringSoon(expirationDate, shelfLifeSettings.warningDays)) {
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

// Helper functions for inventory calculations
function getTotalStock(businessModel, productId) {
    if (!inventory[businessModel] || !inventory[businessModel][productId]) return 0;
    const batches = inventory[businessModel][productId].batches || [];
    return batches.reduce((total, batch) => {
        return !isExpired(batch.expirationDate) ? total + batch.quantity : total;
    }, 0);
}

function getEarliestExpiringBatch(businessModel, productId) {
    if (!inventory[businessModel] || !inventory[businessModel][productId]) return null;
    const batches = inventory[businessModel][productId].batches || [];
    const validBatches = batches.filter(batch => !isExpired(batch.expirationDate));
    if (validBatches.length === 0) return null;
    
    return validBatches.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate))[0];
}

function removeExpiredBatches() {
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
}

function addNewBatch(businessModel, productId, quantity) {
    if (!inventory[businessModel] || !inventory[businessModel][productId]) return false;
    
    const today = new Date();
    const expiryDate = new Date(today);
    expiryDate.setDate(today.getDate() + shelfLifeSettings.defaultShelfLife);
    
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
}

function consumeStock(businessModel, productId, quantity) {
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
}

// Recommendation calculation functions
function calculateEventRecommendedQuantity(productId, eventType, eventCategory, days = 3) {
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
    
    if (relevantEvents.length === 0) return Math.round(universalSettings.eventCapacity * days * 0.15); // Default 15% of total capacity
    
    // Calculate based on average percentage and TOTAL EVENT CAPACITY
    const avgPercentage = relevantEvents.reduce((sum, sale) => sum + sale.percentage, 0) / relevantEvents.length;
    
    // Use TOTAL capacity for entire event duration × percentage
    const totalEventCapacity = universalSettings.eventCapacity * days;
    return Math.round((totalEventCapacity * avgPercentage / 100));
}

function calculateRecommendedQuantity(productId, eventType = 'regular', days = 1) {
    const productSales = salesHistory.filter(sale => sale.productId === productId);
    if (productSales.length === 0) return Math.round(universalSettings.eventCapacity * 0.1);
    
    let baseQuantity = 0;
    
    // Use average percentage across all events for regular operations
    const avgPercentage = productSales.reduce((sum, sale) => sum + sale.percentage, 0) / productSales.length;
    baseQuantity = Math.round((universalSettings.eventCapacity * avgPercentage / 100) * days);
    
    return Math.max(1, baseQuantity);
}

// Format number with proper commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Format percentage
function formatPercentage(percentage) {
    return `${percentage.toFixed(1)}%`;
}

// Safe DOM element retrieval
function safeGetElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id '${id}' not found`);
    }
    return element;
}

// Safe text content update
function safeUpdateText(id, text) {
    const element = safeGetElement(id);
    if (element) {
        element.textContent = text;
    }
}

// Safe HTML content update
function safeUpdateHTML(id, html) {
    const element = safeGetElement(id);
    if (element) {
        element.innerHTML = html;
    }
}

// Export CSV functionality
function exportToCSV(dataType) {
    let csvContent = '';
    let filename = '';
    
    try {
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
        alert('Error exporting data. Please try again.');
    }
}

// Generate different types of CSV content
function generateInventoryCSV() {
    let csvContent = 'Business Model,Product ID,Product Name,Description,Total Stock,Current Brewing,Batches Count,Earliest Expiry,Low Stock Alert\n';
    
    // Event Planning Inventory
    products.forEach(product => {
        const stock = getTotalStock('event', product.id);
        const brewing = inventory.event[product.id]?.brewing || 0;
        const batches = inventory.event[product.id]?.batches || [];
        const earliestBatch = getEarliestExpiringBatch('event', product.id);
        const earliestExpiry = earliestBatch ? earliestBatch.expirationDate : 'N/A';
        csvContent += `Event Planning,${product.id},${product.name},"${product.description}",${stock},${brewing},${batches.length},${earliestExpiry},${stock < 30 ? 'YES' : 'NO'}\n`;
    });
    
    // Distribution Inventory (Sun-Kissed Peach only)
    const distStock = getTotalStock('distribution', 'P004');
    const distBrewing = inventory.distribution['P004']?.brewing || 0;
    const distBatches = inventory.distribution['P004']?.batches || [];
    const distEarliestBatch = getEarliestExpiringBatch('distribution', 'P004');
    const distEarliestExpiry = distEarliestBatch ? distEarliestBatch.expirationDate : 'N/A';
    const distProduct = products.find(p => p.id === 'P004');
    csvContent += `Distribution,P004,${distProduct.name},"${distProduct.description}",${distStock},${distBrewing},${distBatches.length},${distEarliestExpiry},${distStock < 30 ? 'YES' : 'NO'}\n`;
    
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
        
        // Event Planning rows
        products.forEach(product => {
            const recommended = calculateRecommendedQuantity(product.id, 'regular', 1);
            csvContent += `${dateStr},Event Planning,${product.id},${product.name},${recommended},,,"regular",\n`;
        });
        
        // Distribution row (Sun-Kissed Peach only)
        const distProduct = products.find(p => p.id === 'P004');
        csvContent += `${dateStr},Distribution,P004,${distProduct.name},${universalSettings.distributionTarget},,,"daily_distribution",\n`;
    }
    return csvContent;
}

function generateDistributionTrackingCSV() {
    let csvContent = 'Date,Product ID,Product Name,Stock Morning,Produced Today,Local Business,Direct Sales,Total Distributed,Stock Evening,Target Met,Channel Split\n';
    const distributionProduct = products.find(p => p.id === 'P004');
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        csvContent += `${dateStr},P004,${distributionProduct.name},,,,,,,"${distributionChannels.localBusiness}% Local | ${distributionChannels.directSales}% Direct"\n`;
    }
    return csvContent;
}

// Download CSV file
function downloadCSV(csvContent, filename) {
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
    }
}

// Error handling wrapper
function handleError(error, operation = 'operation') {
    console.error(`Error during ${operation}:`, error);
    
    // Display user-friendly error message
    const errorMessages = {
        'network': 'Network error. Please check your connection.',
        'data': 'Data error. Please refresh the page.',
        'calculation': 'Calculation error. Please verify your inputs.',
        'general': 'An unexpected error occurred. Please try again.'
    };
    
    const errorType = error.type || 'general';
    const message = errorMessages[errorType] || errorMessages.general;
    
    // You could replace this with a nicer toast notification
    alert(`${message}\n\nTechnical details: ${error.message || error}`);
}

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