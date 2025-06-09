// =============================================================================
// PERFORMANCE OPTIMIZATIONS AND CODE IMPROVEMENTS
// =============================================================================

// 1. MEMORY MANAGEMENT OPTIMIZATIONS
// =============================================================================

// Optimized data structures with memory-efficient patterns
const DataOptimizer = {
    // Cache frequently accessed data
    cache: {
        productLookup: null,
        salesLookup: null,
        lastCacheUpdate: 0,
        cacheTimeout: 300000 // 5 minutes
    },
    
    // Initialize cached lookups for O(1) access
    initializeCache() {
        const now = Date.now();
        if (this.cache.productLookup && (now - this.cache.lastCacheUpdate) < this.cache.cacheTimeout) {
            return; // Cache still valid
        }
        
        // Create product lookup map
        this.cache.productLookup = new Map();
        products.forEach(product => {
            this.cache.productLookup.set(product.id, product);
        });
        
        // Create sales lookup by product and event type
        this.cache.salesLookup = new Map();
        salesHistory.forEach(sale => {
            const key = `${sale.productId}_${sale.eventType}_${sale.eventCategory}`;
            if (!this.cache.salesLookup.has(key)) {
                this.cache.salesLookup.set(key, []);
            }
            this.cache.salesLookup.get(key).push(sale);
        });
        
        this.cache.lastCacheUpdate = now;
        console.log('🚀 Data cache initialized for optimal performance');
    },
    
    // Fast product lookup
    getProduct(productId) {
        this.initializeCache();
        return this.cache.productLookup.get(productId);
    },
    
    // Fast sales data lookup
    getSalesData(productId, eventType, eventCategory) {
        this.initializeCache();
        const key = `${productId}_${eventType}_${eventCategory}`;
        return this.cache.salesLookup.get(key) || [];
    },
    
    // Clear cache when data changes
    invalidateCache() {
        this.cache.productLookup = null;
        this.cache.salesLookup = null;
        this.cache.lastCacheUpdate = 0;
    }
};

// 2. DOM MANIPULATION OPTIMIZATIONS
// =============================================================================

// Optimized DOM updates with batching and virtual DOM concepts
const DOMOptimizer = {
    pendingUpdates: new Map(),
    updateTimeout: null,
    
    // Batch DOM updates to reduce reflows
    batchUpdate(elementId, updateFunction, data) {
        this.pendingUpdates.set(elementId, { updateFunction, data });
        
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }
        
        this.updateTimeout = setTimeout(() => {
            this.flushUpdates();
        }, 16); // ~60fps
    },
    
    // Execute all pending updates in one batch
    flushUpdates() {
        const fragment = document.createDocumentFragment();
        const elements = new Map();
        
        for (const [elementId, update] of this.pendingUpdates) {
            const element = document.getElementById(elementId);
            if (element) {
                elements.set(elementId, element);
                update.updateFunction(element, update.data);
            }
        }
        
        this.pendingUpdates.clear();
        this.updateTimeout = null;
    },
    
    // Optimized table updates using DocumentFragment
    updateTableOptimized(tableId, rowsData, rowRenderer) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const tbody = table.querySelector('tbody') || table;
        const fragment = document.createDocumentFragment();
        
        // Clear existing rows efficiently
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        
        // Create rows in memory first
        rowsData.forEach(data => {
            const row = document.createElement('tr');
            row.innerHTML = rowRenderer(data);
            fragment.appendChild(row);
        });
        
        // Single DOM update
        tbody.appendChild(fragment);
    }
};

// 3. CALCULATION OPTIMIZATIONS
// =============================================================================

// Optimized calculation engine with memoization
const CalculationOptimizer = {
    memoCache: new Map(),
    maxCacheSize: 1000,
    
    // Memoized calculation wrapper
    memoize(fn, keyGenerator) {
        return (...args) => {
            const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
            
            if (this.memoCache.has(key)) {
                return this.memoCache.get(key);
            }
            
            const result = fn(...args);
            
            // Prevent cache overflow
            if (this.memoCache.size >= this.maxCacheSize) {
                const firstKey = this.memoCache.keys().next().value;
                this.memoCache.delete(firstKey);
            }
            
            this.memoCache.set(key, result);
            return result;
        };
    },
    
    // Clear calculation cache
    clearCache() {
        this.memoCache.clear();
    }
};

// Optimized stock calculation
const optimizedGetTotalStock = CalculationOptimizer.memoize(
    (businessModel, productId) => {
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
    },
    (businessModel, productId) => `stock_${businessModel}_${productId}`
);

// Optimized recommendation calculation
const optimizedCalculateEventRecommendedQuantity = CalculationOptimizer.memoize(
    (productId, eventType, eventCategory, days) => {
        try {
            const salesData = DataOptimizer.getSalesData(productId, eventType, eventCategory);
            
            if (salesData.length > 0) {
                const referenceEvent = salesData[0];
                const referencePercentage = referenceEvent.percentage;
                const dailyCapacity = universalSettings.eventCapacity;
                const totalEventCapacity = dailyCapacity * days;
                return Math.round((totalEventCapacity * referencePercentage / 100));
            }
            
            // Fallback calculation
            const dailyCapacity = universalSettings.eventCapacity;
            const totalEventCapacity = dailyCapacity * days;
            return Math.round(totalEventCapacity * 0.15);
            
        } catch (error) {
            console.error('Error in optimized calculation:', error);
            return 0;
        }
    },
    (productId, eventType, eventCategory, days) => `rec_${productId}_${eventType}_${eventCategory}_${days}`
);

// 4. EVENT HANDLING OPTIMIZATIONS
// =============================================================================

// Optimized event handling with proper cleanup
const EventOptimizer = {
    listeners: new WeakMap(),
    
    // Add event listener with automatic cleanup
    addListener(element, event, handler, options = {}) {
        if (!this.listeners.has(element)) {
            this.listeners.set(element, new Map());
        }
        
        const elementListeners = this.listeners.get(element);
        
        // Remove existing listener if it exists
        if (elementListeners.has(event)) {
            const oldHandler = elementListeners.get(event);
            element.removeEventListener(event, oldHandler, options);
        }
        
        // Add new listener
        element.addEventListener(event, handler, options);
        elementListeners.set(event, handler);
    },
    
    // Remove all listeners for an element
    removeAllListeners(element) {
        if (this.listeners.has(element)) {
            const elementListeners = this.listeners.get(element);
            for (const [event, handler] of elementListeners) {
                element.removeEventListener(event, handler);
            }
            this.listeners.delete(element);
        }
    },
    
    // Delegated event handling for dynamic content
    setupDelegation() {
        document.addEventListener('click', (e) => {
            // Handle interactive elements efficiently
            if (e.target.classList.contains('interactive-element')) {
                e.target.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    e.target.style.transform = '';
                }, 100);
            }
        });
    }
};

// 5. ASYNC OPERATIONS OPTIMIZATION
// =============================================================================

// Optimized async handling with proper queuing
const AsyncOptimizer = {
    taskQueue: [],
    isProcessing: false,
    maxConcurrent: 3,
    
    // Queue async tasks to prevent overwhelming the browser
    queueTask(task, priority = 0) {
        this.taskQueue.push({ task, priority });
        this.taskQueue.sort((a, b) => b.priority - a.priority);
        this.processQueue();
    },
    
    async processQueue() {
        if (this.isProcessing || this.taskQueue.length === 0) return;
        
        this.isProcessing = true;
        const batch = this.taskQueue.splice(0, this.maxConcurrent);
        
        try {
            await Promise.all(batch.map(item => item.task()));
        } catch (error) {
            console.error('Error processing async queue:', error);
        }
        
        this.isProcessing = false;
        
        // Process remaining tasks
        if (this.taskQueue.length > 0) {
            setTimeout(() => this.processQueue(), 10);
        }
    }
};

// 6. RENDERING OPTIMIZATIONS
// =============================================================================

// Virtual scrolling for large datasets
const VirtualScrollOptimizer = {
    setup(containerId, items, renderItem, itemHeight = 50) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const visibleHeight = container.clientHeight;
        const visibleItems = Math.ceil(visibleHeight / itemHeight) + 2; // Buffer
        let scrollTop = 0;
        
        const updateView = debounce(() => {
            const startIndex = Math.floor(scrollTop / itemHeight);
            const endIndex = Math.min(startIndex + visibleItems, items.length);
            
            const fragment = document.createDocumentFragment();
            
            // Add spacer for items above viewport
            if (startIndex > 0) {
                const spacer = document.createElement('div');
                spacer.style.height = `${startIndex * itemHeight}px`;
                fragment.appendChild(spacer);
            }
            
            // Render visible items
            for (let i = startIndex; i < endIndex; i++) {
                const element = renderItem(items[i], i);
                fragment.appendChild(element);
            }
            
            // Add spacer for items below viewport
            if (endIndex < items.length) {
                const spacer = document.createElement('div');
                spacer.style.height = `${(items.length - endIndex) * itemHeight}px`;
                fragment.appendChild(spacer);
            }
            
            container.innerHTML = '';
            container.appendChild(fragment);
        }, 16);
        
        container.addEventListener('scroll', (e) => {
            scrollTop = e.target.scrollTop;
            updateView();
        });
        
        updateView(); // Initial render
    }
};

// 7. PERFORMANCE MONITORING
// =============================================================================

// Performance monitoring and optimization suggestions
const PerformanceMonitor = {
    metrics: {
        renderTimes: [],
        updateTimes: [],
        memoryUsage: [],
        domNodes: []
    },
    
    startTiming(operation) {
        return {
            operation,
            startTime: performance.now(),
            startMemory: this.getMemoryUsage()
        };
    },
    
    endTiming(timer) {
        const endTime = performance.now();
        const duration = endTime - timer.startTime;
        const endMemory = this.getMemoryUsage();
        
        this.metrics.renderTimes.push(duration);
        
        // Keep only last 100 measurements
        if (this.metrics.renderTimes.length > 100) {
            this.metrics.renderTimes.shift();
        }
        
        return {
            operation: timer.operation,
            duration,
            memoryDelta: endMemory - timer.startMemory
        };
    },
    
    getMemoryUsage() {
        if ('memory' in performance) {
            return performance.memory.usedJSHeapSize;
        }
        return 0;
    },
    
    getAverageRenderTime() {
        if (this.metrics.renderTimes.length === 0) return 0;
        return this.metrics.renderTimes.reduce((a, b) => a + b) / this.metrics.renderTimes.length;
    },
    
    generateOptimizationReport() {
        const avgRenderTime = this.getAverageRenderTime();
        const domNodeCount = document.querySelectorAll('*').length;
        const suggestions = [];
        
        if (avgRenderTime > 50) {
            suggestions.push('⚠️ Slow rendering detected. Consider virtual scrolling for large lists.');
        }
        
        if (domNodeCount > 5000) {
            suggestions.push('⚠️ High DOM node count. Consider lazy loading content.');
        }
        
        if (this.metrics.renderTimes.some(time => time > 100)) {
            suggestions.push('⚠️ Frame drops detected. Optimize heavy calculations.');
        }
        
        return {
            avgRenderTime: avgRenderTime.toFixed(2),
            domNodeCount,
            memoryUsage: this.getMemoryUsage(),
            suggestions
        };
    }
};

// 8. IMPLEMENTATION HELPERS
// =============================================================================

// Apply optimizations to existing functions
function applyOptimizations() {
    try {
        // Initialize optimizers
        DataOptimizer.initializeCache();
        EventOptimizer.setupDelegation();
        
        // Replace heavy functions with optimized versions
        window.getTotalStock = optimizedGetTotalStock;
        window.calculateEventRecommendedQuantity = optimizedCalculateEventRecommendedQuantity;
        
        // Set up performance monitoring
        const originalUpdateDashboard = window.updateDashboard;
        if (originalUpdateDashboard) {
            window.updateDashboard = function() {
                const timer = PerformanceMonitor.startTiming('dashboard_update');
                const result = originalUpdateDashboard.apply(this, arguments);
                const metrics = PerformanceMonitor.endTiming(timer);
                
                if (metrics.duration > 50) {
                    console.warn(`Slow dashboard update: ${metrics.duration.toFixed(2)}ms`);
                }
                
                return result;
            };
        }
        
        // Optimize inventory display updates
        const originalUpdateInventoryDisplay = window.updateInventoryDisplay;
        if (originalUpdateInventoryDisplay) {
            window.updateInventoryDisplay = debounce(originalUpdateInventoryDisplay, 100);
        }
        
        // Clear caches when data changes
        const originalLogActivity = window.logActivity || logActivity;
        window.logActivity = function(category, description, details) {
            if (category === 'Inventory' || category === 'Events') {
                DataOptimizer.invalidateCache();
                CalculationOptimizer.clearCache();
            }
            return originalLogActivity.apply(this, arguments);
        };
        
        console.log('🚀 Performance optimizations applied successfully');
        
    } catch (error) {
        console.error('Error applying optimizations:', error);
    }
}

// 9. OPTIMIZATION RECOMMENDATIONS
// =============================================================================

const OptimizationRecommendations = {
    // Code structure improvements
    codeStructure: [
        "✅ Implement modular architecture with clear separation of concerns",
        "✅ Use consistent error handling patterns across all modules",
        "✅ Apply standardized logging and monitoring throughout the system",
        "✅ Implement proper memory management with cache invalidation",
        "⚠️ Consider using TypeScript for better type safety and IDE support",
        "⚠️ Implement unit tests for critical business logic functions",
        "⚠️ Add proper JSDoc documentation for all public functions"
    ],
    
    // Performance improvements
    performance: [
        "✅ Implement memoization for expensive calculations",
        "✅ Use debouncing for frequent UI updates",
        "✅ Batch DOM updates to reduce reflows and repaints",
        "✅ Cache frequently accessed data structures",
        "⚠️ Consider using Web Workers for heavy calculations",
        "⚠️ Implement lazy loading for large datasets",
        "⚠️ Use virtual scrolling for tables with many rows",
        "⚠️ Optimize image loading with proper sizing and formats"
    ],
    
    // Security enhancements
    security: [
        "✅ Implement authentication system with session management",
        "✅ Add activity logging for audit trails",
        "⚠️ Implement data validation for all user inputs",
        "⚠️ Add CSRF protection for sensitive operations",
        "⚠️ Implement proper data sanitization",
        "⚠️ Add rate limiting for API calls",
        "⚠️ Use HTTPS in production environments"
    ],
    
    // User experience improvements
    userExperience: [
        "✅ Implement responsive design for mobile devices",
        "✅ Add loading states and progress indicators",
        "✅ Provide clear error messages and recovery options",
        "✅ Implement keyboard shortcuts for power users",
        "⚠️ Add offline support with service workers",
        "⚠️ Implement undo/redo functionality",
        "⚠️ Add drag-and-drop interfaces where appropriate",
        "⚠️ Implement voice recognition for accessibility"
    ],
    
    // Data management improvements
    dataManagement: [
        "✅ Implement proper backup and restore functionality",
        "✅ Add data validation and integrity checks",
        "✅ Use structured data formats with versioning",
        "⚠️ Implement data compression for large exports",
        "⚠️ Add automatic data synchronization",
        "⚠️ Implement data archiving for old records",
        "⚠️ Add data analytics and reporting features"
    ]
};

// 10. INITIALIZATION
// =============================================================================

// Initialize optimizations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Apply optimizations after a short delay to ensure all modules are loaded
    setTimeout(() => {
        applyOptimizations();
        
        // Log optimization status
        if (typeof logActivity === 'function') {
            logActivity('System', 'Performance optimizations initialized');
        }
        
        // Show performance report in debug mode
        if (typeof systemState !== 'undefined' && systemState.debugMode) {
            setTimeout(() => {
                const report = PerformanceMonitor.generateOptimizationReport();
                console.log('📊 Performance Report:', report);
            }, 5000);
        }
    }, 2000);
});

// Export optimization utilities
window.PerformanceOptimizer = {
    DataOptimizer,
    DOMOptimizer,
    CalculationOptimizer,
    EventOptimizer,
    AsyncOptimizer,
    VirtualScrollOptimizer,
    PerformanceMonitor,
    OptimizationRecommendations,
    applyOptimizations
};