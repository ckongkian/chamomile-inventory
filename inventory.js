// =============================================================================
// INVENTORY MANAGEMENT AND BATCH TRACKING
// =============================================================================

// Load inventory tab content
function loadInventoryTab() {
    const inventoryContent = `
        <div class="space-y-6">
            <!-- Business Model Selector -->
            <div class="bg-white p-4 rounded-lg border border-gray-200">
                <h2 class="text-xl font-bold text-gray-900 mb-4">📦 Inventory Management</h2>
                <div class="flex space-x-2">
                    <button onclick="selectBusinessModel('event')" id="btn-event-model" 
                            class="px-6 py-3 rounded-lg font-medium transition-colors business-model-active">
                        📅 M1 - Event Planning Business
                    </button>
                    <button onclick="selectBusinessModel('distribution')" id="btn-distribution-model" 
                            class="px-6 py-3 rounded-lg font-medium transition-colors business-model-inactive">
                        🚚 M2 - Distribution Business
                    </button>
                </div>
                <div class="mt-3 text-sm text-gray-600">
                    <span id="business-model-description">Managing inventory for M1 - Event Planning with all 6 tea products available.</span>
                </div>
            </div>

            <!-- Historical Performance Reference - ONLY for M1 Event Planning -->
            <div id="historical-performance-reference" class="bg-white p-6 rounded-lg border" style="display: block;">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <span class="text-purple-600 mr-2">📊</span>
                    Historical Performance Reference (Linked to M1 - Event Planning Page)
                </h3>
                
                <div class="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-4">
                    <p class="text-sm text-purple-800">
                        <strong>📋 Reference Source:</strong> This reference uses the same selections from M1 - Event Planning page for consistent inventory planning.
                        The quantities below are recommended based on your selected reference event data and current universal settings.
                        <strong>Note:</strong> This section only appears for M1 - Event Planning business model.
                    </p>
                </div>
                
                <div id="historical-reference-content">
                    <!-- Will be populated by JavaScript -->
                </div>
            </div>

            <!-- M1 - Event Planning Business Section -->
            <div id="event-inventory-section" class="business-model-section">
                <div class="bg-white p-6 rounded-lg border">
                    <h3 class="text-lg font-semibold mb-4 flex items-center">
                        <span class="text-blue-600 mr-2">📅</span>
                        M1 - Event Planning Inventory (All Products)
                    </h3>
                    
                    <div id="event-inventory-list" class="grid gap-4">
                        <!-- Will be populated by JavaScript -->
                    </div>
                    
                    <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div class="flex justify-between items-center">
                            <span class="font-medium">Total Event Brewing (Current Plan):</span>
                            <span class="text-xl font-bold"><span id="event-brewing-total">0</span> bottles</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div id="event-brewing-progress" class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                        </div>
                        <p class="text-xs text-gray-600 mt-1">Based on universal capacity setting</p>
                    </div>
                </div>
                
                <!-- Batch Management for Event Planning -->
                ${generateBatchManagementSection('event')}
            </div>

            <!-- M2 - Distribution Business Section -->
            <div id="distribution-inventory-section" class="business-model-section hidden">
                <div class="bg-white p-6 rounded-lg border">
                    <h3 class="text-lg font-semibold mb-4 flex items-center">
                        <span class="text-green-600 mr-2">🚚</span>
                        M2 - Distribution Inventory (Sun-Kissed Peach Only)
                    </h3>
                    
                    <div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p class="text-sm text-green-800">
                            <strong>📋 M2 - Distribution Focus:</strong> This business model focuses exclusively on Sun-Kissed Peach (V-POT) 
                            for daily distribution operations. Historical performance reference is not applicable for distribution business.
                        </p>
                    </div>
                    
                    <div id="distribution-inventory-detail" class="border rounded-lg p-4">
                        <!-- Will be populated by JavaScript -->
                    </div>
                    
                    <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div class="flex justify-between items-center">
                            <span class="font-medium">Distribution Brewing Today:</span>
                            <span class="text-xl font-bold"><span id="distribution-brewing-total">0</span> / <span id="distribution-capacity-display-2">100</span> bottles</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div id="distribution-brewing-progress" class="bg-green-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                        </div>
                        <p class="text-xs text-gray-600 mt-1">Based on universal capacity setting</p>
                    </div>
                </div>
                
                <!-- Batch Management for Distribution -->
                ${generateBatchManagementSection('distribution')}
            </div>
        </div>
    `;
    
    safeUpdateHTML('inventory-content', inventoryContent);
    
    // Initialize inventory display
    setTimeout(() => {
        selectBusinessModel(currentBusinessModel);
        updateInventoryDisplay();
        updateHistoricalPerformanceReference();
    }, 100);
}

// Generate batch management section
function generateBatchManagementSection(businessModel) {
    const title = businessModel === 'event' ? 'M1 - Event Planning' : 'M2 - Distribution';
    const color = businessModel === 'event' ? 'blue' : 'green';
    const tableId = businessModel === 'event' ? 'event-batch-table' : 'distribution-batch-table';
    const statusPrefix = businessModel === 'event' ? 'event' : 'dist';
    
    return `
        <div class="bg-white p-6 rounded-lg border">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
                <span class="text-purple-600 mr-2">🗓️</span>
                ${title} - Batch Brewing Management & Safety
            </h3>
            
            <!-- How to Use Guide -->
            <div class="mb-6 p-4 bg-${color}-50 border border-${color}-200 rounded-lg">
                <h4 class="font-medium text-${color}-800 mb-2">📚 How to Use ${title} Inventory</h4>
                <div class="text-sm text-${color}-700 space-y-2">
                    <div><strong>1. Stock Adjustment (±1):</strong> Use <span class="bg-green-100 px-1 rounded">+</span> or <span class="bg-red-100 px-1 rounded">−</span> buttons for corrections only.</div>
                    <div><strong>2. ${businessModel === 'event' ? 'Event' : 'Daily'} Brewing (±5):</strong> Use <span class="bg-blue-100 px-1 rounded">+5</span> for production planning.</div>
                    <div><strong>3. Complete Brewing:</strong> Click "Complete All Brewing" to convert to actual batches.</div>
                    <div><strong>4. ${businessModel === 'event' ? 'Event Usage' : 'Distribution'}:</strong> Use "Use" button in batch table for consumption.</div>
                    ${businessModel === 'distribution' ? '<div><strong>5. Focus:</strong> Only Sun-Kissed Peach (V-POT) for distribution business.</div>' : ''}
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 class="font-medium text-purple-800 mb-2">📅 Safety Settings</h4>
                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="text-sm">Shelf Life:</span>
                            <span class="font-semibold text-purple-700" id="${statusPrefix}-shelf-life-display">7 days</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm">Warning:</span>
                            <span class="font-semibold text-orange-700">2 days before expiry</span>
                        </div>
                        <div class="text-xs text-purple-600 mt-2">
                            <strong>Batch ID Format:</strong> ${businessModel === 'event' ? 'E001_001' : 'D004_001'}<br>
                            ${businessModel === 'event' ? 'E = Event, 001 = Product Code, 001 = Batch Number' : 'D = Distribution, 004 = V-POT, 001 = Batch Number'}
                        </div>
                    </div>
                </div>
                
                <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 class="font-medium text-yellow-800 mb-2">⚠️ ${title} Batch Status</h4>
                    <div class="space-y-1 text-sm">
                        <div>Expired Batches: <span id="${statusPrefix}-expired-batches" class="font-semibold text-red-600">0</span></div>
                        <div>Expiring Soon: <span id="${statusPrefix}-expiring-batches" class="font-semibold text-orange-600">0</span></div>
                        <div>Good Condition: <span id="${statusPrefix}-good-batches" class="font-semibold text-green-600">0</span></div>
                    </div>
                </div>
                
                <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 class="font-medium text-green-800 mb-2">🛡️ ${title} Guidelines</h4>
                    <div class="space-y-1 text-xs text-green-700">
                        ${businessModel === 'event' ? 
                            '<div>• Check expiration dates daily</div><div>• Use FIFO (First In, First Out)</div><div>• Mark expired products immediately</div><div>• Store in cool, dry conditions</div>' : 
                            '<div>• Daily production planning</div><div>• Target: <span id="dist-target-guide">100</span> bottles/day</div><div>• FIFO for distributions</div><div>• Monitor expiration daily</div>'
                        }
                    </div>
                </div>
            </div>
            
            <!-- Quick Actions Panel -->
            <div class="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 class="font-medium text-gray-800 mb-2">⚡ Quick Actions</h4>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <button onclick="removeAllExpiredBatches('${businessModel}')" class="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded">
                        🗑️ Remove All Expired
                    </button>
                    <button onclick="showExpiringBatches('${businessModel}')" class="text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-2 rounded">
                        ⚠️ Show Expiring Soon
                    </button>
                    <button onclick="completeBrewing('${businessModel}')" class="text-xs bg-${color}-100 hover:bg-${color}-200 text-${color}-700 px-3 py-2 rounded">
                        ✅ Complete All Brewing
                    </button>
                </div>
            </div>
            
            <!-- Batch Details Table -->
            <div class="overflow-x-auto">
                <table class="w-full text-sm border-collapse border border-gray-300">
                    <thead>
                        <tr class="bg-${color}-50">
                            <th class="border border-gray-300 px-3 py-2 text-left">Product</th>
                            <th class="border border-gray-300 px-3 py-2 text-center">Batch ID</th>
                            <th class="border border-gray-300 px-3 py-2 text-center">Quantity</th>
                            <th class="border border-gray-300 px-3 py-2 text-center">Production Date</th>
                            <th class="border border-gray-300 px-3 py-2 text-center">Expiration Date</th>
                            <th class="border border-gray-300 px-3 py-2 text-center">Status</th>
                            <th class="border border-gray-300 px-3 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="${tableId}">
                        <!-- Will be populated by JavaScript -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// =============================================================================
// BUSINESS MODEL SELECTION
// =============================================================================

// Business Model Selection for Inventory
function selectBusinessModel(model) {
    try {
        currentBusinessModel = model;
        
        // Update button states
        const eventBtn = document.getElementById('btn-event-model');
        const distBtn = document.getElementById('btn-distribution-model');
        
        if (eventBtn && distBtn) {
            eventBtn.className = model === 'event' ? 
                'px-6 py-3 rounded-lg font-medium transition-colors business-model-active' : 
                'px-6 py-3 rounded-lg font-medium transition-colors business-model-inactive';
            
            distBtn.className = model === 'distribution' ? 
                'px-6 py-3 rounded-lg font-medium transition-colors business-model-active' : 
                'px-6 py-3 rounded-lg font-medium transition-colors business-model-inactive';
        }
        
        // Update description
        const description = model === 'event' ? 
            'Managing inventory for M1 - Event Planning with all 6 tea products available.' :
            'Managing daily distribution inventory for M2 - Distribution (Sun-Kissed Peach only).';
        safeUpdateText('business-model-description', description);
        
        // CRITICAL: Control Historical Performance Reference visibility
        const historicalSection = document.getElementById('historical-performance-reference');
        if (historicalSection) {
            if (model === 'event') {
                // Show for M1 - Event Planning
                historicalSection.style.display = 'block';
                historicalSection.style.opacity = '1';
                historicalSection.style.transition = 'opacity 0.3s ease-in-out';
                
                // Update the reference content for event planning
                setTimeout(() => {
                    updateHistoricalPerformanceReference();
                }, 100);
            } else {
                // Hide for M2 - Distribution
                historicalSection.style.opacity = '0';
                historicalSection.style.transition = 'opacity 0.3s ease-in-out';
                setTimeout(() => {
                    historicalSection.style.display = 'none';
                }, 300);
            }
        }
        
        // Show/hide sections
        const eventSection = document.getElementById('event-inventory-section');
        const distSection = document.getElementById('distribution-inventory-section');
        
        if (eventSection) eventSection.classList.toggle('hidden', model !== 'event');
        if (distSection) distSection.classList.toggle('hidden', model !== 'distribution');
        
        // Update target guide for distribution
        if (model === 'distribution') {
            safeUpdateText('dist-target-guide', universalSettings.distributionTarget);
        }
        
        // Refresh inventory display
        updateInventoryDisplay();
        
        // Log the business model change
        if (typeof logActivity === 'function') {
            logActivity('Inventory', `Business model switched to ${model === 'event' ? 'M1 - Event Planning' : 'M2 - Distribution'}`);
        }
        
        debugLog('Business model selected with visibility control', { 
            model: model, 
            historicalReferenceVisible: model === 'event' 
        });
        
    } catch (error) {
        handleError(error, 'business model selection');
    }
}

// =============================================================================
// HISTORICAL PERFORMANCE REFERENCE
// =============================================================================

// Update Historical Performance Reference (New Function)
function updateHistoricalPerformanceReference() {
    try {
        // CRITICAL: Only update and show for M1 - Event Planning Business
        const historicalSection = document.getElementById('historical-performance-reference');
        
        if (currentBusinessModel !== 'event') {
            // Ensure it's hidden for M2 - Distribution
            if (historicalSection) {
                historicalSection.style.display = 'none';
            }
            console.log('Historical Performance Reference hidden for M2 - Distribution business');
            return;
        }
        
        // Show and update for M1 - Event Planning
        if (historicalSection) {
            historicalSection.style.display = 'block';
        }
        
        // Get current event planning selections (linked to Event Planning page)
        const eventType = eventPlanning.eventType || 'sulap';
        const eventCategory = eventPlanning.eventCategory || 'festival';
        const eventDays = universalSettings.eventDefaultDuration;
        const dailyCapacity = universalSettings.eventCapacity;
        
        // Find the reference event for detailed display
        const referenceEventData = salesHistory.filter(sale => 
            sale.eventType === eventType && 
            sale.eventCategory === eventCategory
        );
        
        // Get unique periods for this event type and category
        const referencePeriods = [...new Set(referenceEventData.map(sale => sale.period))];
        const referencePeriod = referencePeriods.length > 0 ? referencePeriods[0] : 'No reference event found';
        
        const referenceHtml = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 class="font-medium text-blue-800">Current Reference Event</h5>
                    <div class="text-sm text-blue-700 space-y-1">
                        <div>Type: ${eventType.toUpperCase()}</div>
                        <div>Category: ${eventCategory}</div>
                        <div>Duration: ${eventDays} days</div>
                        <div>Daily Capacity: ${dailyCapacity} bottles</div>
                    </div>
                </div>
                
                <div class="p-3 bg-green-50 rounded-lg border border-green-200">
                    <h5 class="font-medium text-green-800">Total Event Capacity</h5>
                    <div class="text-lg font-bold text-green-900">${dailyCapacity * eventDays} bottles</div>
                    <div class="text-sm text-green-700">For ${eventDays}-day event</div>
                </div>
                
                <div class="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <h5 class="font-medium text-purple-800">Reference Source</h5>
                    <div class="text-sm text-purple-700">
                        <div>Event: ${referencePeriod}</div>
                        <div>✅ M1 - Event Planning Only</div>
                    </div>
                </div>
            </div>
            
            <div class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h6 class="font-medium text-yellow-800 mb-2">📋 Reference Event Methodology</h6>
                <div class="text-sm text-yellow-700">
                    <strong>Purpose:</strong> Quantities below use the exact percentage from reference event "${referencePeriod}" 
                    for precise planning. This section appears only for M1 - Event Planning business model.
                    <strong>Formula:</strong> Daily Capacity × Event Days × Reference Event Percentage = Recommended Quantity
                </div>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full text-sm border-collapse border border-gray-300">
                    <thead>
                        <tr class="bg-purple-50">
                            <th class="border border-gray-300 px-3 py-2 text-left">Product</th>
                            <th class="border border-gray-300 px-3 py-2 text-center">Reference Event %</th>
                            <th class="border border-gray-300 px-3 py-2 text-center">Recommended Qty</th>
                            <th class="border border-gray-300 px-3 py-2 text-center">Calculation Breakdown</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(product => {
                            const recommended = calculateEventRecommendedQuantity(product.id, eventType, eventCategory, eventDays);
                            const referenceEvents = salesHistory.filter(sale => 
                                sale.productId === product.id && 
                                sale.eventType === eventType && 
                                sale.eventCategory === eventCategory
                            );
                            const referencePercentage = referenceEvents.length > 0 ? 
                                referenceEvents[0].percentage : 15; // Default if no reference
                            
                            const calculationBreakdown = `${dailyCapacity} × ${eventDays} days × ${referencePercentage.toFixed(1)}% = ${recommended}`;
                            
                            return `
                                <tr>
                                    <td class="border border-gray-300 px-3 py-2">
                                        <div class="flex items-center space-x-2">
                                            <span>${product.icon}</span>
                                            <span class="font-medium">${product.name}</span>
                                        </div>
                                    </td>
                                    <td class="border border-gray-300 px-3 py-2 text-center font-semibold ${referenceEvents.length > 0 ? 'text-blue-600' : 'text-gray-500'}">${referencePercentage.toFixed(1)}%</td>
                                    <td class="border border-gray-300 px-3 py-2 text-center font-semibold text-blue-600">${recommended} bottles</td>
                                    <td class="border border-gray-300 px-3 py-2 text-center">
                                        <div class="calculation-breakdown">${calculationBreakdown}</div>
                                        ${referenceEvents.length === 0 ? '<div class="text-xs text-gray-500">(Default - no reference event)</div>' : ''}
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        safeUpdateHTML('historical-reference-content', referenceHtml);
        
        debugLog('Historical performance reference updated for M1 - Event Planning', {
            eventType: eventType,
            eventCategory: eventCategory,
            eventDays: eventDays,
            dailyCapacity: dailyCapacity,
            referencePeriod: referencePeriod,
            visible: true
        });
        
    } catch (error) {
        console.error('Error updating historical performance reference:', error);
        handleError(error, 'historical performance reference update');
    }
}

// =============================================================================
// INVENTORY DISPLAY FUNCTIONS
// =============================================================================

// Enhanced inventory display with batch tracking
function updateInventoryDisplay() {
    try {
        // Remove expired batches first
        removeExpiredBatches();
        
        if (currentBusinessModel === 'event') {
            updateEventInventoryDisplay();
        } else {
            updateDistributionInventoryDisplay();
        }
        
        // Update batch tables
        updateBatchTables();
        
        // Update brewing progress bars
        updateBrewingProgress();
        
        debugLog('Inventory display updated', { businessModel: currentBusinessModel });
        
    } catch (error) {
        handleError(error, 'inventory display update');
    }
}

// Update Event Inventory Display with recommendation explanations
function updateEventInventoryDisplay() {
    try {
        const eventInventoryHtml = products.map(product => {
            const stock = getTotalStock('event', product.id);
            const brewing = inventory.event[product.id]?.brewing || 0;
            const earliestBatch = getEarliestExpiringBatch('event', product.id);
            const expirationStatus = earliestBatch ? getExpirationStatus(earliestBatch.expirationDate) : 
                { status: 'expired', class: 'bg-red-100 text-red-800', text: 'No Stock' };
            
            // Get recommendation with detailed explanation
            const planningMode = 'festival'; // Default from historical reference
            const eventType = 'sulap'; // Default from historical reference
            const planningDays = universalSettings.eventDefaultDuration;
            
            const recommendationData = getRecommendationWithExplanation(product.id, eventType, planningMode, planningDays);
            
            return `
                <div class="border rounded-lg p-4 hover:shadow-md transition-shadow card-hover">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                                ${product.icon}
                            </div>
                            <div>
                                <h4 class="font-medium">${product.name}</h4>
                                <p class="text-sm text-gray-600">${product.description}</p>
                                <div class="flex items-center space-x-2 mt-1">
                                    <span class="badge ${expirationStatus.color === 'red' ? 'badge-red' : expirationStatus.color === 'yellow' ? 'badge-yellow' : 'badge-green'} text-xs">
                                        ${expirationStatus.text}
                                    </span>
                                    ${expirationStatus.status === 'expired' ? '<span class="badge badge-red text-xs">⚠️ DO NOT SELL</span>' : ''}
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex items-center space-x-4">
                            <!-- Stock Management -->
                            <div class="text-center">
                                <p class="text-sm text-gray-600">Event Stock</p>
                                <div class="flex items-center space-x-1">
                                    <button onclick="updateStockLevel('event', '${product.id}', -1)" 
                                            class="w-6 h-6 rounded bg-red-100 hover:bg-red-200 text-red-600 text-xs flex items-center justify-center interactive-element"
                                            ${stock <= 0 ? 'disabled' : ''}>−</button>
                                    <p class="text-lg font-semibold min-w-[40px] ${stock < 30 ? 'text-red-600' : 'text-gray-900'}">${stock}</p>
                                    <button onclick="updateStockLevel('event', '${product.id}', 1)" 
                                            class="w-6 h-6 rounded bg-green-100 hover:bg-green-200 text-green-600 text-xs flex items-center justify-center interactive-element">+</button>
                                </div>
                                <p class="text-xs text-gray-500">±1 bottle</p>
                            </div>
                            
                            <!-- Brewing Controls -->
                            <div class="flex items-center space-x-2">
                                <button onclick="updateEventBrewing('${product.id}', -5)" 
                                        class="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center interactive-element"
                                        ${brewing <= 0 ? 'disabled' : ''}>
                                    <span class="text-red-600 text-sm">-5</span>
                                </button>
                                
                                <div class="text-center min-w-[60px]">
                                    <p class="text-sm text-gray-600">Event Brewing</p>
                                    <p class="text-lg font-semibold ${brewing > 0 ? 'text-blue-600' : 'text-gray-900'}">${brewing}</p>
                                </div>
                                
                                <button onclick="updateEventBrewing('${product.id}', 5)" 
                                        class="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center interactive-element"
                                        ${expirationStatus.status === 'expired' ? 'disabled title="Cannot brew expired products"' : ''}>
                                    <span class="text-blue-600 text-sm">+5</span>
                                </button>
                            </div>
                            
                            <!-- Recommendation with Explanation -->
                            <div class="text-center">
                                <p class="text-sm text-gray-600">Recommended</p>
                                <p class="text-lg font-semibold text-blue-600" title="${recommendationData.explanation}">${recommendationData.quantity}</p>
                                <p class="text-xs text-gray-500">${recommendationData.basis}</p>
                                <div class="text-xs text-blue-600 mt-1">
                                    📊 ${recommendationData.source}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        safeUpdateHTML('event-inventory-list', eventInventoryHtml);
        
        debugLog('Event inventory display updated', {
            products: products.length,
            totalStock: products.reduce((sum, p) => sum + getTotalStock('event', p.id), 0)
        });
        
    } catch (error) {
        console.error('Error updating event inventory display:', error);
        handleError(error, 'event inventory display update');
    }
}

// Get recommendation with detailed explanation
function getRecommendationWithExplanation(productId, eventType, planningMode, planningDays) {
    let recommended = 0;
    let explanation = '';
    let basis = '';
    let source = '';
    
    try {
        if (planningMode === 'festival' || planningMode === 'national' || planningMode === 'regional') {
            recommended = calculateEventRecommendedQuantity(productId, eventType, planningMode, planningDays);
            
            // Find historical data for explanation
            const matchingEvents = salesHistory.filter(sale => 
                sale.productId === productId && 
                sale.eventType === eventType && 
                sale.eventCategory === planningMode
            );
            
            if (matchingEvents.length > 0) {
                const avgPercentage = matchingEvents.reduce((sum, sale) => sum + sale.percentage, 0) / matchingEvents.length;
                const sampleEvent = matchingEvents[0];
                
                explanation = `Based on ${matchingEvents.length} similar event(s). Average ${avgPercentage.toFixed(1)}% of total sales. Formula: ${universalSettings.eventCapacity} × ${planningDays} days × ${avgPercentage.toFixed(1)}% = ${recommended} bottles`;
                basis = `${planningMode} event (${planningDays} days)`;
                source = `Historical: ${sampleEvent.period}`;
            } else {
                explanation = `No exact historical match found. Using default 15% of total capacity. Formula: ${universalSettings.eventCapacity} × ${planningDays} days × 15% = ${recommended} bottles`;
                basis = `${planningMode} event (estimated)`;
                source = 'Default calculation';
            }
        } else {
            recommended = calculateRecommendedQuantity(productId, 'regular', planningDays);
            const productSales = salesHistory.filter(sale => sale.productId === productId);
            
            if (productSales.length > 0) {
                const avgPercentage = productSales.reduce((sum, sale) => sum + sale.percentage, 0) / productSales.length;
                explanation = `Based on all historical events. Average ${avgPercentage.toFixed(1)}% across ${productSales.length} events. Formula: ${universalSettings.eventCapacity} × ${avgPercentage.toFixed(1)}% × ${planningDays} day(s) = ${recommended} bottles`;
                source = `${productSales.length} events avg`;
            } else {
                explanation = `No historical data available. Using 10% default. Formula: ${universalSettings.eventCapacity} × 10% × ${planningDays} day(s) = ${recommended} bottles`;
                source = 'Default (no data)';
            }
            basis = `Regular operations (${planningDays} days)`;
        }
    } catch (error) {
        console.error('Error getting recommendation explanation:', error);
        recommended = 0;
        explanation = 'Error calculating recommendation';
        basis = 'Error';
        source = 'Error';
    }
    
    return {
        quantity: recommended,
        explanation: explanation,
        basis: basis,
        source: source
    };
}

// Update Distribution Inventory Display
function updateDistributionInventoryDisplay() {
    try {
        const distStock = getTotalStock('distribution', 'P004');
        const distBrewing = inventory.distribution['P004']?.brewing || 0;
        const distProduct = products.find(p => p.id === 'P004');
        const distEarliestBatch = getEarliestExpiringBatch('distribution', 'P004');
        const distExpirationStatus = distEarliestBatch ? getExpirationStatus(distEarliestBatch.expirationDate) : 
            { status: 'expired', class: 'bg-red-100 text-red-800', text: 'No Stock' };
        
        const distributionHtml = `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="w-16 h-16 rounded-lg bg-orange-100 flex items-center justify-center text-3xl">
                        ${distProduct.icon}
                    </div>
                    <div>
                        <h4 class="font-medium text-lg">${distProduct.name}</h4>
                        <p class="text-sm text-gray-600">${distProduct.description}</p>
                        <div class="flex items-center space-x-2 mt-1">
                            <span class="badge badge-green text-xs">
                                M2 - Distribution Business Only
                            </span>
                            <span class="badge ${distExpirationStatus.color === 'red' ? 'badge-red' : distExpirationStatus.color === 'yellow' ? 'badge-yellow' : 'badge-green'} text-xs">
                                ${distExpirationStatus.text}
                            </span>
                        </div>
                        ${distExpirationStatus.status === 'expired' ? '<p class="text-red-600 text-xs mt-1">⚠️ DO NOT DISTRIBUTE</p>' : ''}
                    </div>
                </div>
                
                <div class="flex items-center space-x-6">
                    <!-- Stock Management -->
                    <div class="text-center">
                        <p class="text-sm text-gray-600">Distribution Stock</p>
                        <div class="flex items-center space-x-1">
                            <button onclick="updateStockLevel('distribution', 'P004', -1)" 
                                    class="w-8 h-8 rounded bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center interactive-element"
                                    ${distStock <= 0 ? 'disabled' : ''}>−</button>
                            <p class="text-2xl font-semibold min-w-[50px] ${distStock < 30 ? 'text-red-600' : 'text-gray-900'}">${distStock}</p>
                            <button onclick="updateStockLevel('distribution', 'P004', 1)" 
                                    class="w-8 h-8 rounded bg-green-100 hover:bg-green-200 text-green-600 flex items-center justify-center interactive-element">+</button>
                        </div>
                        <p class="text-xs text-gray-500">±1 bottle</p>
                    </div>
                    
                    <!-- Brewing Controls -->
                    <div class="flex items-center space-x-3">
                        <button onclick="updateDistributionBrewing(-5)" 
                                class="w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center interactive-element"
                                ${distBrewing <= 0 ? 'disabled' : ''}>
                            <span class="text-red-600 text-sm">-5</span>
                        </button>
                        
                        <div class="text-center min-w-[80px]">
                            <p class="text-sm text-gray-600">Distribution Brewing</p>
                            <p class="text-2xl font-semibold ${distBrewing > 0 ? 'text-blue-600' : 'text-gray-900'}">${distBrewing}</p>
                        </div>
                        
                        <button onclick="updateDistributionBrewing(5)" 
                                class="w-10 h-10 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center interactive-element"
                                ${(distBrewing >= universalSettings.distributionCapacity || distExpirationStatus.status === 'expired') ? 'disabled' : ''}>
                            <span class="text-green-600 text-sm">+5</span>
                        </button>
                    </div>
                    
                    <div class="text-center">
                        <p class="text-sm text-gray-600">Daily Target</p>
                        <p class="text-2xl font-semibold text-green-600">${universalSettings.distributionTarget}</p>
                        <p class="text-xs text-gray-500">Based on universal settings</p>
                    </div>
                </div>
            </div>
        `;
        
        safeUpdateHTML('distribution-inventory-detail', distributionHtml);
        
        debugLog('Distribution inventory display updated', {
            stock: distStock,
            brewing: distBrewing,
            target: universalSettings.distributionTarget
        });
        
    } catch (error) {
        console.error('Error updating distribution inventory display:', error);
        handleError(error, 'distribution inventory display update');
    }
}

// =============================================================================
// STOCK LEVEL MANAGEMENT
// =============================================================================

// Enhanced stock level update with batch tracking
function updateStockLevel(businessModel, productId, change) {
    try {
        if (!inventory[businessModel] || !inventory[businessModel][productId]) {
            console.error('Invalid business model or product ID:', businessModel, productId);
            return;
        }
        
        if (change > 0) {
            // Adding stock - this is for correction purposes only, adjust the latest batch
            const batches = inventory[businessModel][productId].batches;
            if (batches.length > 0) {
                // Add to the most recent batch (correction)
                batches[batches.length - 1].quantity += change;
            } else {
                // If no batches exist, create one for correction purposes
                addNewBatch(businessModel, productId, change);
            }
        } else if (change < 0) {
            // Consuming stock using FIFO
            const consumed = consumeStock(businessModel, productId, Math.abs(change));
            if (!consumed) {
                showNotification('Not enough stock available to consume!', 'error');
                return;
            }
        }
        
        // Update all displays
        updateInventoryDisplay();
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
        
        if (businessModel === 'distribution' && typeof updateDistribution === 'function') {
            updateDistribution();
        }
        
        showNotification(`Stock ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change)} bottle${Math.abs(change) > 1 ? 's' : ''}`, 'success', 1500);
        
        debugLog('Stock level updated', {
            businessModel: businessModel,
            productId: productId,
            change: change
        });
        
    } catch (error) {
        handleError(error, 'stock level update');
    }
}

// Update event brewing quantities (Updated for ±5 precision - for correction purposes only)
function updateEventBrewing(productId, change) {
    try {
        const current = inventory.event[productId]?.brewing || 0;
        const newValue = Math.max(0, Math.min(universalSettings.eventCapacity, current + change));
        
        // This is only for brewing adjustments/corrections, not creating batches
        inventory.event[productId].brewing = newValue;
        
        updateInventoryDisplay();
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
        
        showNotification(`Event brewing ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change)} bottles`, 'info', 1500);
        
        debugLog('Event brewing updated', {
            productId: productId,
            change: change,
            newValue: newValue
        });
        
    } catch (error) {
        handleError(error, 'event brewing update');
    }
}

// Distribution brewing functions (separate from events) - Updated for ±5 precision
function updateDistributionBrewing(change) {
    try {
        const current = inventory.distribution['P004']?.brewing || 0;
        const newValue = Math.max(0, Math.min(universalSettings.distributionCapacity, current + change));
        inventory.distribution['P004'].brewing = newValue;
        
        updateInventoryDisplay();
        
        if (typeof updateDistribution === 'function') {
            updateDistribution();
        }
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
        
        showNotification(`Distribution brewing ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change)} bottles`, 'info', 1500);
        
        debugLog('Distribution brewing updated', {
            change: change,
            newValue: newValue
        });
        
    } catch (error) {
        handleError(error, 'distribution brewing update');
    }
}

// =============================================================================
// BREWING PROGRESS TRACKING
// =============================================================================

// Update brewing progress bars
function updateBrewingProgress() {
    try {
        if (currentBusinessModel === 'event') {
            // Update event brewing totals
            const totalEventBrewing = Object.values(inventory.event).reduce((sum, item) => sum + (item.brewing || 0), 0);
            safeUpdateText('event-brewing-total', totalEventBrewing);
            
            const eventProgressElement = document.getElementById('event-brewing-progress');
            if (eventProgressElement) {
                const eventUtilization = Math.min(100, (totalEventBrewing / universalSettings.eventCapacity) * 100);
                eventProgressElement.style.width = `${eventUtilization}%`;
                eventProgressElement.className = `progress-fill transition-all duration-300 ${
                    eventUtilization > 90 ? 'progress-fill-red' :
                    eventUtilization > 70 ? 'progress-fill-yellow' :
                    'progress-fill-blue'
                }`;
            }
        } else {
            // Update distribution brewing progress
            const distBrewing = inventory.distribution['P004']?.brewing || 0;
            safeUpdateText('distribution-brewing-total', distBrewing);
            safeUpdateText('distribution-capacity-display-2', universalSettings.distributionCapacity);
            
            const distProgressElement = document.getElementById('distribution-brewing-progress');
            if (distProgressElement) {
                const distUtilization = (distBrewing / universalSettings.distributionCapacity) * 100;
                distProgressElement.style.width = `${distUtilization}%`;
                distProgressElement.className = `progress-fill transition-all duration-300 ${
                    distUtilization > 90 ? 'progress-fill-red' :
                    distUtilization > 70 ? 'progress-fill-yellow' :
                    'progress-fill-green'
                }`;
            }
        }
        
    } catch (error) {
        console.error('Error updating brewing progress:', error);
    }
}

// =============================================================================
// BATCH TABLE MANAGEMENT
// =============================================================================

// Update batch tables for both business models
function updateBatchTables() {
    try {
        if (currentBusinessModel === 'event') {
            updateEventBatchTable();
        } else {
            updateDistributionBatchTable();
        }
        updateBatchExpirationSummary();
        
    } catch (error) {
        console.error('Error updating batch tables:', error);
        handleError(error, 'batch tables update');
    }
}

// Update Event Batch Table
function updateEventBatchTable() {
    try {
        const tableHtml = products.map(product => {
            const batches = inventory.event[product.id]?.batches || [];
            return batches.map(batch => {
                const expirationStatus = getExpirationStatus(batch.expirationDate);
                const daysLeft = getDaysUntilExpiration(batch.expirationDate);
                
                return `
                    <tr class="${expirationStatus.status === 'expired' ? 'bg-red-50' : expirationStatus.status === 'warning' ? 'bg-orange-50' : ''} transition-colors duration-200">
                        <td class="border border-gray-300 px-3 py-2">
                            <div class="flex items-center space-x-2">
                                <span>${product.icon}</span>
                                <span class="font-medium">${product.name}</span>
                            </div>
                        </td>
                        <td class="border border-gray-300 px-3 py-2 text-center font-mono text-sm">${batch.id}</td>
                        <td class="border border-gray-300 px-3 py-2 text-center font-semibold ${batch.quantity < 10 ? 'text-red-600' : 'text-gray-900'}">${batch.quantity}</td>
                        <td class="border border-gray-300 px-3 py-2 text-center">${formatDate(batch.productionDate)}</td>
                        <td class="border border-gray-300 px-3 py-2 text-center">${formatDate(batch.expirationDate)}</td>
                        <td class="border border-gray-300 px-3 py-2 text-center">
                            <span class="badge ${expirationStatus.color === 'red' ? 'badge-red' : expirationStatus.color === 'yellow' ? 'badge-yellow' : 'badge-green'} text-xs">
                                ${expirationStatus.text}
                            </span>
                        </td>
                        <td class="border border-gray-300 px-3 py-2 text-center">
                            <div class="flex space-x-1 justify-center">
                                ${expirationStatus.status === 'expired' ? 
                                    `<button onclick="removeBatch('event', '${product.id}', '${batch.id}')" class="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded bg-red-100 interactive-element">Remove</button>` :
                                    `<button onclick="consumeBatch('event', '${product.id}', '${batch.id}')" class="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded bg-blue-100 interactive-element">Use</button>`
                                }
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }).join('');
        
        const tableElement = document.getElementById('event-batch-table');
        if (tableElement) {
            tableElement.innerHTML = tableHtml || '<tr><td colspan="7" class="border border-gray-300 px-3 py-2 text-center text-gray-500">No batches available</td></tr>';
        }
        
        debugLog('Event batch table updated');
        
    } catch (error) {
        console.error('Error updating event batch table:', error);
        handleError(error, 'event batch table update');
    }
}

// Update Distribution Batch Table
function updateDistributionBatchTable() {
    try {
        const product = products.find(p => p.id === 'P004');
        const batches = inventory.distribution['P004']?.batches || [];
        
        const tableHtml = batches.map(batch => {
            const expirationStatus = getExpirationStatus(batch.expirationDate);
            const daysLeft = getDaysUntilExpiration(batch.expirationDate);
            
            return `
                <tr class="${expirationStatus.status === 'expired' ? 'bg-red-50' : expirationStatus.status === 'warning' ? 'bg-orange-50' : ''} transition-colors duration-200">
                    <td class="border border-gray-300 px-3 py-2">
                        <div class="flex items-center space-x-2">
                            <span>${product.icon}</span>
                            <div>
                                <span class="font-medium">${product.name}</span>
                                <div class="text-xs text-green-600">M2 - Distribution</div>
                            </div>
                        </div>
                    </td>
                    <td class="border border-gray-300 px-3 py-2 text-center font-mono text-sm">${batch.id}</td>
                    <td class="border border-gray-300 px-3 py-2 text-center font-semibold ${batch.quantity < 10 ? 'text-red-600' : 'text-gray-900'}">${batch.quantity}</td>
                    <td class="border border-gray-300 px-3 py-2 text-center">${formatDate(batch.productionDate)}</td>
                    <td class="border border-gray-300 px-3 py-2 text-center">${formatDate(batch.expirationDate)}</td>
                    <td class="border border-gray-300 px-3 py-2 text-center">
                        <span class="badge ${expirationStatus.color === 'red' ? 'badge-red' : expirationStatus.color === 'yellow' ? 'badge-yellow' : 'badge-green'} text-xs">
                            ${expirationStatus.text}
                        </span>
                    </td>
                    <td class="border border-gray-300 px-3 py-2 text-center">
                        <div class="flex space-x-1 justify-center">
                            ${expirationStatus.status === 'expired' ? 
                                `<button onclick="removeBatch('distribution', 'P004', '${batch.id}')" class="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded bg-red-100 interactive-element">Remove</button>` :
                                `<button onclick="consumeBatch('distribution', 'P004', '${batch.id}')" class="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded bg-blue-100 interactive-element">Use</button>`
                            }
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        
        const tableElement = document.getElementById('distribution-batch-table');
        if (tableElement) {
            tableElement.innerHTML = tableHtml || '<tr><td colspan="7" class="border border-gray-300 px-3 py-2 text-center text-gray-500">No batches available</td></tr>';
        }
        
        debugLog('Distribution batch table updated');
        
    } catch (error) {
        console.error('Error updating distribution batch table:', error);
        handleError(error, 'distribution batch table update');
    }
}

// =============================================================================
// BATCH MANAGEMENT ACTIONS
// =============================================================================

// Batch management functions
function removeBatch(businessModel, productId, batchId) {
    if (confirm('Are you sure you want to remove this batch?')) {
        try {
            const batches = inventory[businessModel][productId].batches;
            const index = batches.findIndex(batch => batch.id === batchId);
            if (index > -1) {
                const removedBatch = batches.splice(index, 1)[0];
                updateInventoryDisplay();
                if (typeof updateDashboard === 'function') {
                    updateDashboard();
                }
                
                showNotification(`Batch ${batchId} removed (${removedBatch.quantity} bottles)`, 'success');
                
                debugLog('Batch removed', {
                    businessModel: businessModel,
                    productId: productId,
                    batchId: batchId,
                    quantity: removedBatch.quantity
                });
            }
        } catch (error) {
            handleError(error, 'batch removal');
        }
    }
}

function consumeBatch(businessModel, productId, batchId) {
    const quantity = prompt('How many bottles to consume from this batch?');
    if (quantity && parseInt(quantity) > 0) {
        try {
            const batches = inventory[businessModel][productId].batches;
            const batch = batches.find(b => b.id === batchId);
            if (batch) {
                const consumeAmount = parseInt(quantity);
                const consumed = Math.min(consumeAmount, batch.quantity);
                batch.quantity -= consumed;
                
                if (batch.quantity <= 0) {
                    const index = batches.indexOf(batch);
                    batches.splice(index, 1);
                }
                
                updateInventoryDisplay();
                if (typeof updateDashboard === 'function') {
                    updateDashboard();
                }
                
                showNotification(`Consumed ${consumed} bottles from batch ${batchId}`, 'success');
                
                debugLog('Batch consumed', {
                    businessModel: businessModel,
                    productId: productId,
                    batchId: batchId,
                    consumed: consumed,
                    remaining: batch.quantity
                });
            }
        } catch (error) {
            handleError(error, 'batch consumption');
        }
    }
}

// Enhanced batch expiration summary
function updateBatchExpirationSummary() {
    try {
        let eventExpired = 0, eventExpiringSoon = 0, eventGood = 0;
        let distExpired = 0, distExpiringSoon = 0, distGood = 0;

        // Check event planning batches
        products.forEach(product => {
            const batches = inventory.event[product.id]?.batches || [];
            batches.forEach(batch => {
                if (isExpired(batch.expirationDate)) {
                    eventExpired++;
                } else if (isExpiringSoon(batch.expirationDate, shelfLifeSettings.warningDays)) {
                    eventExpiringSoon++;
                } else {
                    eventGood++;
                }
            });
        });

        // Check distribution batches
        const distBatches = inventory.distribution['P004']?.batches || [];
        distBatches.forEach(batch => {
            if (isExpired(batch.expirationDate)) {
                distExpired++;
            } else if (isExpiringSoon(batch.expirationDate, shelfLifeSettings.warningDays)) {
                distExpiringSoon++;
            } else {
                distGood++;
            }
        });

        // Update event batch status
        safeUpdateText('event-expired-batches', eventExpired);
        safeUpdateText('event-expiring-batches', eventExpiringSoon);
        safeUpdateText('event-good-batches', eventGood);

        // Update distribution batch status
        safeUpdateText('dist-expired-batches', distExpired);
        safeUpdateText('dist-expiring-batches', distExpiringSoon);
        safeUpdateText('dist-good-batches', distGood);

        // Update shelf life displays
        safeUpdateText('event-shelf-life-display', `${shelfLifeSettings.defaultShelfLife} days`);
        safeUpdateText('dist-shelf-life-display', `${shelfLifeSettings.defaultShelfLife} days`);
        
        debugLog('Batch expiration summary updated', {
            event: { expired: eventExpired, expiring: eventExpiringSoon, good: eventGood },
            distribution: { expired: distExpired, expiring: distExpiringSoon, good: distGood }
        });
        
    } catch (error) {
        console.error('Error updating batch expiration summary:', error);
    }
}

// Enhanced batch management functions
function removeAllExpiredBatches(businessModel) {
    try {
        let removedCount = 0;
        
        if (businessModel === 'event') {
            products.forEach(product => {
                const batches = inventory.event[product.id]?.batches || [];
                const initialLength = batches.length;
                inventory.event[product.id].batches = batches.filter(batch => !isExpired(batch.expirationDate));
                removedCount += initialLength - inventory.event[product.id].batches.length;
            });
        } else {
            const batches = inventory.distribution['P004']?.batches || [];
            const initialLength = batches.length;
            inventory.distribution['P004'].batches = batches.filter(batch => !isExpired(batch.expirationDate));
            removedCount += initialLength - inventory.distribution['P004'].batches.length;
        }
        
        if (removedCount > 0) {
            showNotification(`Removed ${removedCount} expired batch${removedCount > 1 ? 'es' : ''}`, 'success');
            updateInventoryDisplay();
            if (typeof updateDashboard === 'function') {
                updateDashboard();
            }
            
            debugLog('Expired batches removed', {
                businessModel: businessModel,
                count: removedCount
            });
        } else {
            showNotification('No expired batches found', 'info');
        }
        
    } catch (error) {
        handleError(error, 'expired batch removal');
    }
}

function showExpiringBatches(businessModel) {
    try {
        let expiringBatches = [];
        
        if (businessModel === 'event') {
            products.forEach(product => {
                const batches = inventory.event[product.id]?.batches || [];
                batches.forEach(batch => {
                    if (isExpiringSoon(batch.expirationDate)) {
                        expiringBatches.push(`${product.name}: Batch ${batch.id} (${getDaysUntilExpiration(batch.expirationDate)} days left)`);
                    }
                });
            });
        } else {
            const batches = inventory.distribution['P004']?.batches || [];
            const product = products.find(p => p.id === 'P004');
            batches.forEach(batch => {
                if (isExpiringSoon(batch.expirationDate)) {
                    expiringBatches.push(`${product.name}: Batch ${batch.id} (${getDaysUntilExpiration(batch.expirationDate)} days left)`);
                }
            });
        }
        
        if (expiringBatches.length > 0) {
            alert('Batches expiring soon:\n\n' + expiringBatches.join('\n'));
        } else {
            showNotification('No batches expiring soon', 'info');
        }
        
    } catch (error) {
        handleError(error, 'expiring batches check');
    }
}

function completeBrewing(businessModel) {
    try {
        let completedCount = 0;
        let totalBottles = 0;
        
        if (businessModel === 'event') {
            products.forEach(product => {
                const brewing = inventory.event[product.id]?.brewing || 0;
                if (brewing > 0) {
                    addNewBatch('event', product.id, brewing);
                    inventory.event[product.id].brewing = 0;
                    completedCount++;
                    totalBottles += brewing;
                }
            });
        } else {
            const brewing = inventory.distribution['P004']?.brewing || 0;
            if (brewing > 0) {
                addNewBatch('distribution', 'P004', brewing);
                inventory.distribution['P004'].brewing = 0;
                completedCount++;
                totalBottles += brewing;
            }
        }
        
        if (completedCount > 0) {
            showNotification(`Completed brewing for ${completedCount} product${completedCount > 1 ? 's' : ''}. ${totalBottles} bottles added to inventory.`, 'success');
            updateInventoryDisplay();
            if (typeof updateDashboard === 'function') {
                updateDashboard();
            }
            
            debugLog('Brewing completed', {
                businessModel: businessModel,
                products: completedCount,
                bottles: totalBottles
            });
        } else {
            showNotification('No brewing in progress to complete', 'info');
        }
        
    } catch (error) {
        handleError(error, 'brewing completion');
    }
}

// =============================================================================
// INVENTORY ANALYTICS
// =============================================================================

// Generate inventory insights
function generateInventoryInsights() {
    try {
        const insights = [];
        
        if (currentBusinessModel === 'event') {
            // M1 - Event Planning insights
            const lowStockProducts = products.filter(p => getTotalStock('event', p.id) < 20);
            const expiringBatches = [];
            
            products.forEach(product => {
                const batches = inventory.event[product.id]?.batches || [];
                batches.forEach(batch => {
                    if (isExpiringSoon(batch.expirationDate)) {
                        expiringBatches.push({ product: product.name, batch: batch.id });
                    }
                });
            });
            
            if (lowStockProducts.length > 0) {
                insights.push({
                    type: 'warning',
                    message: `${lowStockProducts.length} products have critically low stock (below 20 bottles)`,
                    products: lowStockProducts.map(p => p.name)
                });
            }
            
            if (expiringBatches.length > 0) {
                insights.push({
                    type: 'urgent',
                    message: `${expiringBatches.length} batches expiring soon`,
                    batches: expiringBatches
                });
            }
            
        } else {
            // M2 - Distribution insights
            const distStock = getTotalStock('distribution', 'P004');
            const target = universalSettings.distributionTarget;
            
            if (distStock < target * 0.5) {
                insights.push({
                    type: 'critical',
                    message: `Distribution stock critically low: ${distStock} bottles (below 50% of daily target)`
                });
            }
        }
        
        return insights;
        
    } catch (error) {
        console.error('Error generating inventory insights:', error);
        return [];
    }
}

// Export inventory report
function exportInventoryReport() {
    try {
        const currentDate = getCurrentDate();
        let csvContent = `Inventory Report - ${currentBusinessModel === 'event' ? 'M1 - Event Planning' : 'M2 - Distribution'}\n`;
        csvContent += `Generated: ${currentDate.display}\n\n`;
        
        if (currentBusinessModel === 'event') {
            csvContent += `M1 - Event Planning Inventory\n`;
            csvContent += `Product,Current Stock,Brewing,Total Available,Batches,Earliest Expiry,Status\n`;
            
            products.forEach(product => {
                const stock = getTotalStock('event', product.id);
                const brewing = inventory.event[product.id]?.brewing || 0;
                const available = stock + brewing;
                const batches = inventory.event[product.id]?.batches || [];
                const earliestBatch = getEarliestExpiringBatch('event', product.id);
                const status = earliestBatch ? getExpirationStatus(earliestBatch.expirationDate).text : 'No Stock';
                
                csvContent += `${product.name},${stock},${brewing},${available},${batches.length},"${earliestBatch ? earliestBatch.expirationDate : 'N/A'}","${status}"\n`;
            });
            
        } else {
            const distStock = getTotalStock('distribution', 'P004');
            const distBrewing = inventory.distribution['P004']?.brewing || 0;
            const distAvailable = distStock + distBrewing;
            const distBatches = inventory.distribution['P004']?.batches || [];
            const distEarliestBatch = getEarliestExpiringBatch('distribution', 'P004');
            const distStatus = distEarliestBatch ? getExpirationStatus(distEarliestBatch.expirationDate).text : 'No Stock';
            
            csvContent += `M2 - Distribution Inventory\n`;
            csvContent += `Product,Current Stock,Brewing,Total Available,Batches,Earliest Expiry,Status,Daily Target\n`;
            csvContent += `Sun-Kissed Peach,${distStock},${distBrewing},${distAvailable},${distBatches.length},"${distEarliestBatch ? distEarliestBatch.expirationDate : 'N/A'}","${distStatus}",${universalSettings.distributionTarget}\n`;
        }
        
        // Add batch details
        csvContent += `\nBatch Details\n`;
        csvContent += `Batch ID,Product,Quantity,Production Date,Expiration Date,Days Left,Status\n`;
        
        if (currentBusinessModel === 'event') {
            products.forEach(product => {
                const batches = inventory.event[product.id]?.batches || [];
                batches.forEach(batch => {
                    const daysLeft = getDaysUntilExpiration(batch.expirationDate);
                    const status = getExpirationStatus(batch.expirationDate).text;
                    csvContent += `${batch.id},${product.name},${batch.quantity},${batch.productionDate},${batch.expirationDate},${daysLeft},"${status}"\n`;
                });
            });
        } else {
            const batches = inventory.distribution['P004']?.batches || [];
            batches.forEach(batch => {
                const daysLeft = getDaysUntilExpiration(batch.expirationDate);
                const status = getExpirationStatus(batch.expirationDate).text;
                csvContent += `${batch.id},Sun-Kissed Peach,${batch.quantity},${batch.productionDate},${batch.expirationDate},${daysLeft},"${status}"\n`;
            });
        }
        
        downloadCSV(csvContent, `inventory_report_${currentBusinessModel}_${currentDate.iso}.csv`);
        
    } catch (error) {
        handleError(error, 'inventory report export');
    }
}

// =============================================================================
// INVENTORY SYNC AND INTEGRATION
// =============================================================================

// Sync inventory with other modules
function syncInventorySettings() {
    try {
        // Update target guides for distribution
        if (currentBusinessModel === 'distribution') {
            safeUpdateText('dist-target-guide', universalSettings.distributionTarget);
        }
        
        // Update historical performance reference
        updateHistoricalPerformanceReference();
        
        // Update brewing progress
        updateBrewingProgress();
        
        debugLog('Inventory settings synced');
        
    } catch (error) {
        console.error('Error syncing inventory settings:', error);
    }
}

// Update inventory recommendations based on planning selector (removed in new design)
function updateInventoryRecommendations() {
    try {
        // Legacy function - now handled by historical performance reference
        updateHistoricalPerformanceReference();
        updateInventoryDisplay();
        updateBatchExpirationSummary();
        
    } catch (error) {
        handleError(error, 'inventory recommendations update');
    }
}

// Validate inventory data integrity
function validateInventoryIntegrity() {
    try {
        const issues = [];
        
        // Check for negative quantities
        Object.keys(inventory).forEach(businessModel => {
            Object.keys(inventory[businessModel]).forEach(productId => {
                const batches = inventory[businessModel][productId].batches || [];
                batches.forEach(batch => {
                    if (batch.quantity < 0) {
                        issues.push(`Negative quantity in ${businessModel} ${productId} batch ${batch.id}`);
                    }
                });
                
                const brewing = inventory[businessModel][productId].brewing || 0;
                if (brewing < 0) {
                    issues.push(`Negative brewing quantity in ${businessModel} ${productId}`);
                }
            });
        });
        
        // Check for invalid dates
        Object.keys(inventory).forEach(businessModel => {
            Object.keys(inventory[businessModel]).forEach(productId => {
                const batches = inventory[businessModel][productId].batches || [];
                batches.forEach(batch => {
                    if (!validateDate(batch.productionDate) || !validateDate(batch.expirationDate)) {
                        issues.push(`Invalid dates in ${businessModel} ${productId} batch ${batch.id}`);
                    }
                });
            });
        });
        
        return {
            isValid: issues.length === 0,
            issues: issues
        };
        
    } catch (error) {
        console.error('Error validating inventory integrity:', error);
        return { isValid: false, issues: ['Validation error'] };
    }
}

// =============================================================================
// INITIALIZATION AND CLEANUP
// =============================================================================

// Initialize inventory management
function initializeInventoryManagement() {
    try {
        // Validate data integrity
        const integrity = validateInventoryIntegrity();
        if (!integrity.isValid) {
            console.warn('Inventory integrity issues:', integrity.issues);
        }
        
        // Set initial state
        currentBusinessModel = 'event';
        
        // Load inventory tab if it hasn't been loaded
        const inventoryContent = document.getElementById('inventory-content');
        if (inventoryContent && !inventoryContent.innerHTML.trim()) {
            loadInventoryTab();
        }
        
        debugLog('Inventory management initialized');
        
    } catch (error) {
        handleError(error, 'inventory management initialization');
    }
}

// Cleanup inventory resources
function cleanupInventoryManagement() {
    try {
        // Clear any intervals or timeouts
        // Reset temporary states
        // Validate final data state
        
        debugLog('Inventory management cleaned up');
        
    } catch (error) {
        console.error('Error cleaning up inventory management:', error);
    }
}

// =============================================================================
// EXPORT FOR EXTERNAL USE
// =============================================================================

// Export inventory functions for external use
if (typeof window !== 'undefined') {
    window.InventoryFunctions = {
        loadInventoryTab,
        selectBusinessModel,
        updateInventoryDisplay,
        updateEventInventoryDisplay,
        updateDistributionInventoryDisplay,
        updateHistoricalPerformanceReference,
        updateStockLevel,
        updateEventBrewing,
        updateDistributionBrewing,
        updateBatchTables,
        updateEventBatchTable,
        updateDistributionBatchTable,
        removeBatch,
        consumeBatch,
        updateBatchExpirationSummary,
        removeAllExpiredBatches,
        showExpiringBatches,
        completeBrewing,
        generateInventoryInsights,
        exportInventoryReport,
        syncInventorySettings,
        validateInventoryIntegrity,
        initializeInventoryManagement,
        cleanupInventoryManagement
    };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeInventoryManagement();
    });
}