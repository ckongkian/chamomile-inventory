// Product definitions
const products = [
    { id: 'P001', name: 'Lavender Lullaby', description: 'Lavender & Chamomile', icon: '💜' },
    { id: 'P002', name: 'Gentle Chamomile', description: 'Chamomile', icon: '🌼' },
    { id: 'P003', name: 'Lychee Rosette', description: 'Lychee & Rose', icon: '🌹' },
    { id: 'P004', name: 'Sun-Kissed Peach', description: 'Peach & Orange Peel & Rosehips', icon: '🍑' },
    { id: 'P005', name: 'Moonlit Jasmine', description: 'Jasmine Green Tea', icon: '🌙' },
    { id: 'P006', name: 'Blushing Berry', description: 'Raspberry, Hibiscus & Rosehips', icon: '🫐' }
];

// Enhanced sales history data structure - COMPLETE DATASET
let salesHistory = [
    // SULAP event, 4-6 Apr 2025 (Raya) - 3 days
    { productId: 'P001', period: 'SULAP Raya Apr 2025', sales: 34, days: 3, percentage: 12.83, eventType: 'sulap', eventCategory: 'festival' },
    { productId: 'P005', period: 'SULAP Raya Apr 2025', sales: 40, days: 3, percentage: 15.09, eventType: 'sulap', eventCategory: 'festival' },
    { productId: 'P002', period: 'SULAP Raya Apr 2025', sales: 29, days: 3, percentage: 10.94, eventType: 'sulap', eventCategory: 'festival' },
    { productId: 'P004', period: 'SULAP Raya Apr 2025', sales: 96, days: 3, percentage: 36.23, eventType: 'sulap', eventCategory: 'festival' },
    { productId: 'P003', period: 'SULAP Raya Apr 2025', sales: 36, days: 3, percentage: 13.58, eventType: 'sulap', eventCategory: 'festival' },
    { productId: 'P006', period: 'SULAP Raya Apr 2025', sales: 30, days: 3, percentage: 11.32, eventType: 'sulap', eventCategory: 'festival' },
    
    // SULAP event, 13-15 Sep 2024 (Malaysia Day) - 3 days
    { productId: 'P001', period: 'SULAP Malaysia Day Sep 2024', sales: 38, days: 3, percentage: 14.84, eventType: 'sulap', eventCategory: 'national' },
    { productId: 'P005', period: 'SULAP Malaysia Day Sep 2024', sales: 42, days: 3, percentage: 16.41, eventType: 'sulap', eventCategory: 'national' },
    { productId: 'P002', period: 'SULAP Malaysia Day Sep 2024', sales: 43, days: 3, percentage: 16.80, eventType: 'sulap', eventCategory: 'national' },
    { productId: 'P004', period: 'SULAP Malaysia Day Sep 2024', sales: 79, days: 3, percentage: 30.86, eventType: 'sulap', eventCategory: 'national' },
    { productId: 'P003', period: 'SULAP Malaysia Day Sep 2024', sales: 54, days: 3, percentage: 21.09, eventType: 'sulap', eventCategory: 'national' },
    
    // JAM event, 5-6 Oct 2024 (Sabah Governor's Birthday) - 2 days
    { productId: 'P001', period: 'JAM Sabah Governor Oct 2024', sales: 31, days: 2, percentage: 16.23, eventType: 'jam', eventCategory: 'regional' },
    { productId: 'P005', period: 'JAM Sabah Governor Oct 2024', sales: 38, days: 2, percentage: 19.90, eventType: 'jam', eventCategory: 'regional' },
    { productId: 'P002', period: 'JAM Sabah Governor Oct 2024', sales: 34, days: 2, percentage: 17.80, eventType: 'jam', eventCategory: 'regional' },
    { productId: 'P004', period: 'JAM Sabah Governor Oct 2024', sales: 49, days: 2, percentage: 25.65, eventType: 'jam', eventCategory: 'regional' },
    { productId: 'P003', period: 'JAM Sabah Governor Oct 2024', sales: 39, days: 2, percentage: 20.42, eventType: 'jam', eventCategory: 'regional' },
    
    // SULAP event, 31 Oct - 3 Nov 2024 (Deepavali) - 4 days
    { productId: 'P001', period: 'SULAP Deepavali Nov 2024', sales: 40, days: 4, percentage: 10.99, eventType: 'sulap', eventCategory: 'festival' },
    { productId: 'P005', period: 'SULAP Deepavali Nov 2024', sales: 62, days: 4, percentage: 17.03, eventType: 'sulap', eventCategory: 'festival' },
    { productId: 'P002', period: 'SULAP Deepavali Nov 2024', sales: 55, days: 4, percentage: 15.11, eventType: 'sulap', eventCategory: 'festival' },
    { productId: 'P004', period: 'SULAP Deepavali Nov 2024', sales: 140, days: 4, percentage: 38.46, eventType: 'sulap', eventCategory: 'festival' },
    { productId: 'P003', period: 'SULAP Deepavali Nov 2024', sales: 67, days: 4, percentage: 18.41, eventType: 'sulap', eventCategory: 'festival' },
    
    // SULAP event, 24-26 Jan 2025 (Chinese New Year) - 3 days
    { productId: 'P001', period: 'SULAP CNY Jan 2025', sales: 38, days: 3, percentage: 13.62, eventType: 'sulap', eventCategory: 'festival' },
    { productId: 'P005', period: 'SULAP CNY Jan 2025', sales: 43, days: 3, percentage: 15.41, eventType: 'sulap', eventCategory: 'festival' },
    { productId: 'P002', period: 'SULAP CNY Jan 2025', sales: 31, days: 3, percentage: 11.11, eventType: 'sulap', eventCategory: 'festival' },
    { productId: 'P004', period: 'SULAP CNY Jan 2025', sales: 110, days: 3, percentage: 39.43, eventType: 'sulap', eventCategory: 'festival' },
    { productId: 'P003', period: 'SULAP CNY Jan 2025', sales: 30, days: 3, percentage: 10.75, eventType: 'sulap', eventCategory: 'festival' },
    { productId: 'P006', period: 'SULAP CNY Jan 2025', sales: 27, days: 3, percentage: 9.68, eventType: 'sulap', eventCategory: 'festival' },
];

// Enhanced inventory structure with batch tracking
let inventory = {
    // M1 - Event Planning Inventory (for SULAP/JAM events) with batch tracking
    event: {
        'P001': { 
            batches: [
                { id: 'E001_001', quantity: 1, productionDate: '2025-06-05', expirationDate: '2025-06-12' }
            ],
            brewing: 0 
        },
        'P002': { 
            batches: [
                { id: 'E002_001', quantity: 2, productionDate: '2025-06-04', expirationDate: '2025-06-11' }
            ],
            brewing: 0 
        },
        'P003': { 
            batches: [
                { id: 'E003_001', quantity: 3, productionDate: '2025-06-05', expirationDate: '2025-06-12' }
            ],
            brewing: 0 
        },
        'P004': { 
            batches: [
                { id: 'E004_001', quantity: 4, productionDate: '2025-06-05', expirationDate: '2025-06-12' }
            ],
            brewing: 0 
        },
        'P005': { 
            batches: [
                { id: 'E005_001', quantity: 5, productionDate: '2025-06-05', expirationDate: '2025-06-12' }
            ],
            brewing: 0 
        },
        'P006': { 
            batches: [
                { id: 'E006_001', quantity: 6, productionDate: '2025-06-03', expirationDate: '2025-06-10' }
            ],
            brewing: 0 
        }
    },
    // M2 - Distribution Inventory (Sun-Kissed Peach only for daily business) with batch tracking
    distribution: {
        'P004': { 
            batches: [
                { id: 'D004_001', quantity: 3, productionDate: '2025-06-05', expirationDate: '2025-06-12' }
            ],
            brewing: 0 
        }
    }
};

// Universal settings
let universalSettings = {
    eventCapacity: 100,
    distributionCapacity: 100,
    distributionTarget: 100,
    eventDefaultDuration: 3
};

// Shelf life settings
let shelfLifeSettings = {
    defaultShelfLife: 7,
    warningDays: 2,
    autoExpireCheck: true,
    batchTracking: true
};

// Distribution channels
let distributionChannels = {
    localBusiness: 100, // % allocation
    directSales: 0    // % allocation
};

// Event planning state
let eventPlanning = {
    eventType: 'sulap',
    eventDays: 3,
    dailyEventCapacity: 100,
    selectedProducts: [] // Will be populated based on historical data
};

// Batch counter for generating unique batch IDs
let batchCounter = {
    event: { P001: 2, P002: 2, P003: 2, P004: 2, P005: 2, P006: 2 },
    distribution: { P004: 2 }
};

// Business model state for inventory management
let currentBusinessModel = 'event'; // Default to M1 - Event Planning
let currentDashboardModel = 'm1'; // Default to M1 - Event Planning

// Sort direction state for data bank
let sortDirection = {};

// Edit data state
let editingDataIndex = -1;

// System state tracking
let systemState = {
    isInitialized: false,
    currentTab: 'dashboard',
    lastUpdated: null,
    autoSaveEnabled: true,
    debugMode: false
};

// Performance metrics
let performanceMetrics = {
    loadTime: 0,
    lastRefresh: null,
    updateCount: 0,
    errorCount: 0
};

// Notification system state
let notificationSystem = {
    queue: [],
    maxNotifications: 5,
    defaultDuration: 3000
};

// Export configuration for module compatibility
if (typeof window !== 'undefined') {
    // Browser environment
    window.TeaInventoryData = {
        products,
        salesHistory,
        inventory,
        universalSettings,
        shelfLifeSettings,
        distributionChannels,
        eventPlanning,
        batchCounter,
        currentBusinessModel,
        currentDashboardModel,
        sortDirection,
        editingDataIndex,
        systemState,
        performanceMetrics,
        notificationSystem
    };
} else if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        products,
        salesHistory,
        inventory,
        universalSettings,
        shelfLifeSettings,
        distributionChannels,
        eventPlanning,
        batchCounter,
        currentBusinessModel,
        currentDashboardModel,
        sortDirection,
        editingDataIndex,
        systemState,
        performanceMetrics,
        notificationSystem
    };
}

// Data validation functions
function validateProductData() {
    const requiredFields = ['id', 'name', 'description', 'icon'];
    return products.every(product => 
        requiredFields.every(field => product.hasOwnProperty(field) && product[field])
    );
}

function validateSalesHistoryData() {
    const requiredFields = ['productId', 'period', 'sales', 'days', 'percentage', 'eventType', 'eventCategory'];
    return salesHistory.every(sale => 
        requiredFields.every(field => sale.hasOwnProperty(field) && sale[field] !== null && sale[field] !== undefined)
    );
}

function validateInventoryData() {
    const businessModels = ['event', 'distribution'];
    return businessModels.every(model => {
        if (!inventory[model]) return false;
        return Object.keys(inventory[model]).every(productId => {
            const item = inventory[model][productId];
            return item.hasOwnProperty('batches') && 
                   item.hasOwnProperty('brewing') && 
                   Array.isArray(item.batches);
        });
    });
}

function validateBatchData() {
    const businessModels = ['event', 'distribution'];
    return businessModels.every(model => {
        return Object.values(inventory[model]).every(item => {
            return item.batches.every(batch => {
                const requiredFields = ['id', 'quantity', 'productionDate', 'expirationDate'];
                return requiredFields.every(field => 
                    batch.hasOwnProperty(field) && batch[field] !== null && batch[field] !== undefined
                );
            });
        });
    });
}

// Data integrity checker
function checkDataIntegrity() {
    const checks = {
        products: validateProductData(),
        salesHistory: validateSalesHistoryData(),
        inventory: validateInventoryData(),
        batches: validateBatchData()
    };
    
    const allValid = Object.values(checks).every(check => check);
    
    if (!allValid) {
        console.warn('Data integrity issues detected:', checks);
    }
    
    return {
        isValid: allValid,
        details: checks
    };
}

// Data summary generator
function generateDataSummary() {
    return {
        products: {
            total: products.length,
            available: products.filter(p => inventory.event[p.id]?.batches?.length > 0).length
        },
        salesHistory: {
            total: salesHistory.length,
            events: [...new Set(salesHistory.map(sale => sale.period))].length,
            dateRange: {
                earliest: salesHistory.reduce((earliest, sale) => {
                    const saleYear = sale.period.match(/\d{4}/)?.[0];
                    return !earliest || (saleYear && saleYear < earliest) ? saleYear : earliest;
                }, null),
                latest: salesHistory.reduce((latest, sale) => {
                    const saleYear = sale.period.match(/\d{4}/)?.[0];
                    return !latest || (saleYear && saleYear > latest) ? saleYear : latest;
                }, null)
            }
        },
        inventory: {
            eventBatches: Object.values(inventory.event).reduce((sum, item) => sum + (item.batches?.length || 0), 0),
            distributionBatches: Object.values(inventory.distribution).reduce((sum, item) => sum + (item.batches?.length || 0), 0),
            totalStock: Object.values(inventory.event).reduce((sum, item) => 
                sum + (item.batches?.reduce((batchSum, batch) => batchSum + batch.quantity, 0) || 0), 0
            ) + Object.values(inventory.distribution).reduce((sum, item) => 
                sum + (item.batches?.reduce((batchSum, batch) => batchSum + batch.quantity, 0) || 0), 0
            )
        },
        settings: {
            eventCapacity: universalSettings.eventCapacity,
            distributionCapacity: universalSettings.distributionCapacity,
            distributionTarget: universalSettings.distributionTarget,
            defaultDuration: universalSettings.eventDefaultDuration
        }
    };
}

// Initialize data validation on load
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        const integrity = checkDataIntegrity();
        if (integrity.isValid) {
            console.log('✅ Data integrity check passed');
        } else {
            console.error('❌ Data integrity check failed:', integrity.details);
        }
        
        // Store data summary for debugging
        window.TeaInventoryDataSummary = generateDataSummary();
    });
}