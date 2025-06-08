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
    
    // JAM event, 24-25 Aug 2024 (National Day) - 2 days
    { productId: 'P001', period: 'JAM National Day Aug 2024', sales: 28, days: 2, percentage: 15.22, eventType: 'jam', eventCategory: 'national' },
    { productId: 'P005', period: 'JAM National Day Aug 2024', sales: 35, days: 2, percentage: 19.02, eventType: 'jam', eventCategory: 'national' },
    { productId: 'P002', period: 'JAM National Day Aug 2024', sales: 32, days: 2, percentage: 17.39, eventType: 'jam', eventCategory: 'national' },
    { productId: 'P004', period: 'JAM National Day Aug 2024', sales: 52, days: 2, percentage: 28.26, eventType: 'jam', eventCategory: 'national' },
    { productId: 'P003', period: 'JAM National Day Aug 2024', sales: 37, days: 2, percentage: 20.11, eventType: 'jam', eventCategory: 'national' },
    
    // SULAP event, 10-12 May 2024 (Hari Raya Puasa) - 3 days
    { productId: 'P001', period: 'SULAP Hari Raya May 2024', sales: 41, days: 3, percentage: 13.55, eventType: 'sulap', eventCategory: 'festival' },
    { productId: 'P005', period: 'SULAP Hari Raya May 2024', sales: 48, days: 3, percentage: 15.84, eventType: 'sulap', eventCategory: 'festival' },
    { productId: 'P002', period: 'SULAP Hari Raya May 2024', sales: 33, days: 3, percentage: 10.89, eventType: 'sulap', eventCategory: 'festival' },
    { productId: 'P004', period: 'SULAP Hari Raya May 2024', sales: 112, days: 3, percentage: 36.96, eventType: 'sulap', eventCategory: 'festival' },
    { productId: 'P003', period: 'SULAP Hari Raya May 2024', sales: 42, days: 3, percentage: 13.86, eventType: 'sulap', eventCategory: 'festival' },
    { productId: 'P006', period: 'SULAP Hari Raya May 2024', sales: 27, days: 3, percentage: 8.91, eventType: 'sulap', eventCategory: 'festival' },
    
    // JAM event, 1-2 Jun 2024 (Gawai Dayak) - 2 days
    { productId: 'P001', period: 'JAM Gawai Dayak Jun 2024', sales: 29, days: 2, percentage: 16.85, eventType: 'jam', eventCategory: 'regional' },
    { productId: 'P005', period: 'JAM Gawai Dayak Jun 2024', sales: 33, days: 2, percentage: 19.19, eventType: 'jam', eventCategory: 'regional' },
    { productId: 'P002', period: 'JAM Gawai Dayak Jun 2024', sales: 30, days: 2, percentage: 17.44, eventType: 'jam', eventCategory: 'regional' },
    { productId: 'P004', period: 'JAM Gawai Dayak Jun 2024', sales: 44, days: 2, percentage: 25.58, eventType: 'jam', eventCategory: 'regional' },
    { productId: 'P003', period: 'JAM Gawai Dayak Jun 2024', sales: 36, days: 2, percentage: 20.93, eventType: 'jam', eventCategory: 'regional' }
];

// Enhanced inventory structure with batch tracking
let inventory = {
    // Event Planning Inventory (for SULAP/JAM events) with batch tracking
    event: {
        'P001': { 
            batches: [
                { id: 'E001_001', quantity: 21, productionDate: '2025-06-05', expirationDate: '2025-06-12' }
            ],
            brewing: 0 
        },
        'P002': { 
            batches: [
                { id: 'E002_001', quantity: 10, productionDate: '2025-06-04', expirationDate: '2025-06-11' }
            ],
            brewing: 0 
        },
        'P003': { 
            batches: [
                { id: 'E003_001', quantity: 21, productionDate: '2025-06-05', expirationDate: '2025-06-12' }
            ],
            brewing: 0 
        },
        'P004': { 
            batches: [
                { id: 'E004_001', quantity: 25, productionDate: '2025-06-05', expirationDate: '2025-06-12' }
            ],
            brewing: 0 
        },
        'P005': { 
            batches: [
                { id: 'E005_001', quantity: 21, productionDate: '2025-06-05', expirationDate: '2025-06-12' }
            ],
            brewing: 0 
        },
        'P006': { 
            batches: [
                { id: 'E006_001', quantity: 32, productionDate: '2025-06-03', expirationDate: '2025-06-10' }
            ],
            brewing: 0 
        }
    },
    // Distribution Inventory (Sun-Kissed Peach only for daily business) with batch tracking
    distribution: {
        'P004': { 
            batches: [
                { id: 'D004_001', quantity: 42, productionDate: '2025-06-05', expirationDate: '2025-06-12' }
            ],
            brewing: 0 
        }
    }
};

// Universal settings
let universalSettings = {
    eventCapacity: 110,
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
    localBusiness: 60, // % allocation
    directSales: 40    // % allocation
};

// Event planning state
let eventPlanning = {
    eventType: 'sulap',
    eventDays: 3,
    dailyEventCapacity: 110,
    selectedProducts: [] // Will be populated based on historical data
};

// Batch counter for generating unique batch IDs
let batchCounter = {
    event: { P001: 2, P002: 2, P003: 2, P004: 2, P005: 2, P006: 2 },
    distribution: { P004: 2 }
};

// Business model state for inventory management
let currentBusinessModel = 'event'; // Default to event planning

// Sort direction state for data bank
let sortDirection = {};

// Edit data state
let editingDataIndex = -1;

// Export all data for use in other modules
if (typeof window !== 'undefined') {
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
        sortDirection,
        editingDataIndex
    };
}