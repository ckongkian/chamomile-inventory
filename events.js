// =============================================================================
// OPTIMIZED EVENT PLANNING AND RECOMMENDATIONS (events.js)
// =============================================================================

// Load events tab content
function loadEventsTab() {
    const eventsContent = `
        <div class="space-y-6">
            <div class="bg-white p-6 rounded-lg border">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <span class="text-blue-600 mr-2">📅</span>
                    M1 - Event Planning & Quantity Optimizer
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium mb-2">Event Type</label>
                        <select id="event-type" class="w-full p-2 border rounded-lg" onchange="updateEventRecommendations()">
                            <option value="sulap">SULAP Event</option>
                            <option value="jam">JAM Event</option>
                            <option value="other">Other Event</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Event Category</label>
                        <select id="event-category" class="w-full p-2 border rounded-lg" onchange="updateEventRecommendations()">
                            <option value="festival">Festival (Raya, Deepavali)</option>
                            <option value="national">National Day</option>
                            <option value="regional">Regional Event</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Event Duration</label>
                        <select id="event-days" class="w-full p-2 border rounded-lg" onchange="updateEventRecommendations()">
                            <option value="2">2 Days</option>
                            <option value="3" selected>3 Days</option>
                            <option value="4">4 Days</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Daily Brewing Capacity</label>
                        <input type="number" id="daily-event-capacity" value="110" min="100" max="120" 
                               class="w-full p-2 border rounded-lg" readonly>
                        <p class="text-xs text-gray-500 mt-1">Set in universal settings</p>
                    </div>
                </div>

                <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 class="font-medium text-blue-800 mb-2">📊 Reference Event Performance</h4>
                    <div id="reference-event-info" class="text-sm text-blue-700">
                        <!-- Will be populated by JavaScript -->
                    </div>
                </div>
                
                <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 bg-blue-50 rounded-lg">
                        <h4 class="font-semibold text-blue-900 mb-2">📋 Event Summary</h4>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span>Total bottles needed:</span>
                                <span class="font-bold text-blue-900" id="event-total">0 bottles</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Daily production:</span>
                                <span class="font-bold" id="daily-production">0 bottles/day</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Capacity utilization:</span>
                                <span class="font-bold" id="capacity-utilization">0%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="p-4 bg-green-50 rounded-lg">
                        <h4 class="font-semibold text-green-900 mb-2">💡 Smart Recommendations</h4>
                        <div id="event-recommendations" class="text-sm text-green-700">
                            <!-- Will be populated by JavaScript -->
                        </div>
                    </div>
                </div>

                <div id="event-products" class="grid gap-4">
                    <!-- Will be populated by JavaScript -->
                </div>
                
                <!-- Event Planning Actions -->
                <div class="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h5 class="font-medium text-gray-800 mb-3">⚡ Event Planning Actions</h5>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button onclick="exportEventPlan()" class="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded text-sm interactive-element">
                            📋 Export Event Plan
                        </button>
                        <button onclick="saveEventTemplate()" class="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded text-sm interactive-element">
                            💾 Save as Template
                        </button>
                        <button onclick="loadEventTemplate()" class="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded text-sm interactive-element">
                            📁 Load Template
                        </button>
                        <button onclick="refreshEventRecommendations()" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm interactive-element">
                            🔄 Refresh Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    safeUpdateHTML('events-content', eventsContent);
    
    // Initialize event planning
    setTimeout(() => {
        initializeEventProductPreSelection();
        updateEventRecommendations();
        syncEventPlanningSettings();
    }, 100);
}

// =============================================================================
// REFERENCE EVENT CALCULATION FUNCTIONS (OPTIMIZED)
// =============================================================================

// Calculate event recommended quantity using REFERENCE EVENT percentages (not historical average)
function calculateEventRecommendedQuantity(productId, eventType, eventCategory, days = 3) {
    try {
        // Use current event planning selections as reference
        const referenceEventType = eventPlanning.eventType || eventType;
        const referenceEventCategory = eventPlanning.eventCategory || eventCategory;
        
        // Find the EXACT reference event match first
        const exactReferenceEvents = salesHistory.filter(sale => 
            sale.productId === productId && 
            sale.eventType === referenceEventType && 
            sale.eventCategory === referenceEventCategory
        );
        
        if (exactReferenceEvents.length > 0) {
            // Use the percentage from the reference event (take the first/most recent match)
            const referenceEvent = exactReferenceEvents[0];
            const referencePercentage = referenceEvent.percentage;
            
            // Calculate based on TOTAL EVENT CAPACITY × reference percentage
            const dailyCapacity = universalSettings.eventCapacity;
            const totalEventCapacity = dailyCapacity * days;
            const recommendedQuantity = Math.round((totalEventCapacity * referencePercentage / 100));
            
            // Log for debugging in development
            if (typeof systemState !== 'undefined' && systemState.debugMode) {
                console.log(`Reference Event Calculation for ${productId}:`, {
                    referenceEvent: referenceEvent.period,
                    referencePercentage: referencePercentage,
                    totalEventCapacity: totalEventCapacity,
                    recommendedQuantity: recommendedQuantity,
                    calculation: `${dailyCapacity} × ${days} days × ${referencePercentage}% = ${recommendedQuantity}`
                });
            }
            
            return recommendedQuantity;
        }
        
        // Fallback 1: Broader matching by event type OR category
        const broaderEvents = salesHistory.filter(sale => 
            sale.productId === productId && 
            (sale.eventType === referenceEventType || sale.eventCategory === referenceEventCategory)
        );
        
        if (broaderEvents.length > 0) {
            // Use average of broader matches
            const avgPercentage = broaderEvents.reduce((sum, sale) => sum + sale.percentage, 0) / broaderEvents.length;
            const dailyCapacity = universalSettings.eventCapacity;
            const totalEventCapacity = dailyCapacity * days;
            return Math.round((totalEventCapacity * avgPercentage / 100));
        }
        
        // Final fallback: default 15% of total capacity
        const dailyCapacity = universalSettings.eventCapacity;
        const totalEventCapacity = dailyCapacity * days;
        return Math.round(totalEventCapacity * 0.15);
        
    } catch (error) {
        console.error('Error calculating event recommended quantity:', error);
        return 0;
    }
}

// Get recommendation with detailed explanation based on reference event
function getRecommendationWithExplanation(productId, eventType, planningMode, planningDays) {
    let recommended = 0;
    let explanation = '';
    let basis = '';
    let source = '';
    
    try {
        // Use the reference event from event planning state
        const referenceEventType = eventPlanning.eventType || eventType;
        const referenceEventCategory = eventPlanning.eventCategory || planningMode;
        
        // Find the reference event
        const referenceEvents = salesHistory.filter(sale => 
            sale.productId === productId && 
            sale.eventType === referenceEventType && 
            sale.eventCategory === referenceEventCategory
        );
        
        if (referenceEvents.length > 0) {
            const referenceEvent = referenceEvents[0];
            const referencePercentage = referenceEvent.percentage;
            
            recommended = calculateEventRecommendedQuantity(productId, referenceEventType, referenceEventCategory, planningDays);
            
            explanation = `Based on Reference Event: ${referenceEvent.period}. This product had ${referencePercentage}% of total sales. Formula: ${universalSettings.eventCapacity} × ${planningDays} days × ${referencePercentage}% = ${recommended} bottles`;
            basis = `Reference Event (${planningDays} days)`;
            source = `Reference: ${referenceEvent.period}`;
        } else {
            // Fallback explanation
            recommended = calculateEventRecommendedQuantity(productId, referenceEventType, referenceEventCategory, planningDays);
            explanation = `No matching reference event found. Using default 15% of total capacity. Formula: ${universalSettings.eventCapacity} × ${planningDays} days × 15% = ${recommended} bottles`;
            basis = `Default estimation (${planningDays} days)`;
            source = 'Default calculation';
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

// =============================================================================
// EVENT PRODUCT PRE-SELECTION
// =============================================================================

// Initialize event product pre-selection based on historical data
function initializeEventProductPreSelection() {
    try {
        const eventType = 'sulap';
        const eventCategory = 'festival';
        
        // Get top performers for the default event type and category
        const relevantHistory = salesHistory.filter(sale => 
            sale.eventType === eventType && sale.eventCategory === eventCategory
        );
        
        if (relevantHistory.length > 0) {
            // Calculate average percentage for each product
            const productPerformance = {};
            relevantHistory.forEach(sale => {
                if (!productPerformance[sale.productId]) {
                    productPerformance[sale.productId] = [];
                }
                productPerformance[sale.productId].push(sale.percentage);
            });
            
            // Get average and sort by performance
            const avgPerformances = Object.keys(productPerformance).map(productId => ({
                productId,
                avgPercentage: productPerformance[productId].reduce((sum, p) => sum + p, 0) / productPerformance[productId].length
            }));
            
            avgPerformances.sort((a, b) => b.avgPercentage - a.avgPercentage);
            
            // Select top performers (up to 4)
            const topProducts = avgPerformances.slice(0, Math.min(4, avgPerformances.length)).map(item => item.productId);
            eventPlanning.selectedProducts = [...new Set(topProducts)]; // Remove duplicates
        } else {
            // Fallback to overall top performers
            eventPlanning.selectedProducts = ['P004', 'P001', 'P005'];
        }
        
        // Update planning state
        eventPlanning.eventType = eventType;
        eventPlanning.eventCategory = eventCategory;
        
        debugLog('Event product pre-selection initialized', {
            selectedProducts: eventPlanning.selectedProducts,
            eventType: eventType,
            eventCategory: eventCategory
        });
        
    } catch (error) {
        console.error('Error initializing event product pre-selection:', error);
        eventPlanning.selectedProducts = ['P004', 'P001', 'P005']; // Safe fallback
    }
}

// =============================================================================
// EVENT RECOMMENDATIONS ENGINE
// =============================================================================

// Update event recommendations with proper pre-selection based on reference event data
function updateEventRecommendations() {
    try {
        const eventTypeElement = document.getElementById('event-type');
        const eventDaysElement = document.getElementById('event-days');
        const eventCategoryElement = document.getElementById('event-category');
        const dailyCapacityElement = document.getElementById('daily-event-capacity');

        if (!eventTypeElement || !eventDaysElement || !eventCategoryElement) {
            console.warn('Event form elements not found');
            return;
        }

        const eventType = eventTypeElement.value;
        const eventDays = parseInt(eventDaysElement.value);
        const eventCategory = eventCategoryElement.value;
        
        // Sync with universal settings
        if (dailyCapacityElement) {
            dailyCapacityElement.value = universalSettings.eventCapacity;
        }
        
        // Update event planning state
        eventPlanning.eventType = eventType;
        eventPlanning.eventCategory = eventCategory;
        eventPlanning.eventDays = eventDays;
        eventPlanning.dailyEventCapacity = universalSettings.eventCapacity;
        
        // Update reference event info display
        updateReferenceEventInfo(eventType, eventCategory);
        
        // Auto-select products based on event type and category
        updateProductSelection(eventType, eventCategory);
        
        // Generate product recommendations with calculation breakdown
        generateEventProductDisplay(eventType, eventCategory, eventDays);
        
        // Update event summary
        updateEventSummary(eventType, eventCategory, eventDays);
        
        // Log activity if logging is available
        if (typeof logActivity === 'function') {
            logActivity('Events', `Event recommendations updated for ${eventType} ${eventCategory} (${eventDays} days)`);
        }
        
        debugLog('Event recommendations updated', {
            eventType: eventType,
            eventCategory: eventCategory,
            eventDays: eventDays,
            selectedProducts: eventPlanning.selectedProducts.length
        });
        
    } catch (error) {
        handleError(error, 'event recommendations update');
    }
}

// Update reference event information display
function updateReferenceEventInfo(eventType, eventCategory) {
    try {
        const referenceEventData = salesHistory.filter(sale => 
            sale.eventType === eventType && 
            sale.eventCategory === eventCategory
        );
        
        let infoHtml = '';
        if (referenceEventData.length > 0) {
            // Get unique periods for this event type and category
            const referencePeriods = [...new Set(referenceEventData.map(sale => sale.period))];
            const referencePeriod = referencePeriods[0];
            
            // Find top performer in reference event
            const topPerformer = referenceEventData.reduce((max, sale) => 
                sale.percentage > max.percentage ? sale : max
            );
            const topProduct = products.find(p => p.id === topPerformer.productId);
            
            infoHtml = `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <strong>📊 Reference Event:</strong><br>
                        ${referencePeriod}<br>
                        <span class="text-xs">Using exact percentages from this event</span>
                    </div>
                    <div>
                        <strong>🏆 Top Performer in Reference:</strong><br>
                        ${topProduct?.icon} ${topProduct?.name}<br>
                        <span class="text-xs">${topPerformer.percentage}% of total sales</span>
                    </div>
                    <div>
                        <strong>📈 Calculation Method:</strong><br>
                        Reference Event Percentages<br>
                        <span class="text-xs">Not historical averages</span>
                    </div>
                </div>
            `;
        } else {
            infoHtml = `
                <div class="text-center p-4 bg-orange-50 border border-orange-200 rounded">
                    <strong>🆕 New Event Type:</strong> No reference event found for ${eventType} ${eventCategory}<br>
                    <span class="text-xs mt-2 block">💡 Using default 15% allocation per product for recommendations</span>
                </div>
            `;
        }
        
        safeUpdateHTML('reference-event-info', infoHtml);
        
    } catch (error) {
        console.error('Error updating reference event info:', error);
    }
}

// Update product selection based on event type and category
function updateProductSelection(eventType, eventCategory) {
    try {
        const relevantHistory = salesHistory.filter(sale => 
            sale.eventType === eventType && sale.eventCategory === eventCategory
        );
        
        if (relevantHistory.length > 0) {
            // Calculate product performance for this specific event type and category
            const productPerformance = {};
            relevantHistory.forEach(sale => {
                if (!productPerformance[sale.productId]) {
                    productPerformance[sale.productId] = [];
                }
                productPerformance[sale.productId].push(sale.percentage);
            });
            
            // Calculate average performance and sort
            const avgPerformances = Object.keys(productPerformance).map(productId => ({
                productId,
                avgPercentage: productPerformance[productId].reduce((sum, p) => sum + p, 0) / productPerformance[productId].length,
                dataPoints: productPerformance[productId].length
            }));
            
            avgPerformances.sort((a, b) => b.avgPercentage - a.avgPercentage);
            
            // Auto-select top products for this event type and category (up to 4)
            const topProducts = avgPerformances.slice(0, Math.min(4, avgPerformances.length)).map(item => item.productId);
            eventPlanning.selectedProducts = [...new Set(topProducts)];
        } else {
            // Use fallback selection for new event types
            eventPlanning.selectedProducts = ['P004', 'P001', 'P005'];
        }
        
        debugLog('Product selection updated', {
            eventType: eventType,
            eventCategory: eventCategory,
            selectedProducts: eventPlanning.selectedProducts,
            dataPoints: relevantHistory.length
        });
        
    } catch (error) {
        console.error('Error updating product selection:', error);
    }
}

// =============================================================================
// EVENT PRODUCT DISPLAY
// =============================================================================

// Generate event product display with calculation breakdown using reference events
function generateEventProductDisplay(eventType, eventCategory, eventDays) {
    try {
        const eventHtml = products.map(product => {
            const recommended = calculateEventRecommendedQuantity(product.id, eventType, eventCategory, eventDays);
            const isSelected = eventPlanning.selectedProducts.includes(product.id);
            const earliestBatch = getEarliestExpiringBatch('event', product.id);
            const expirationStatus = earliestBatch ? getExpirationStatus(earliestBatch.expirationDate) : 
                { status: 'expired', class: 'bg-red-100 text-red-800', text: 'No Stock' };
            
            // Check if product will expire during event
            const daysLeft = earliestBatch ? getDaysUntilExpiration(earliestBatch.expirationDate) : 0;
            const willExpireDuringEvent = daysLeft < eventDays && daysLeft > 0;
            
            // Determine selection reason and calculation breakdown based on REFERENCE EVENT
            let selectionReason = '';
            let calculationBreakdown = '';
            
            if (isSelected) {
                const referenceEvents = salesHistory.filter(sale => 
                    sale.productId === product.id && 
                    sale.eventType === eventType && 
                    sale.eventCategory === eventCategory
                );
                
                if (referenceEvents.length > 0) {
                    const referenceEvent = referenceEvents[0];
                    const referencePercentage = referenceEvent.percentage;
                    selectionReason = `📊 Reference Event: ${referencePercentage.toFixed(1)}% in ${referenceEvent.period}`;
                    calculationBreakdown = `${universalSettings.eventCapacity} × ${eventDays} days × ${referencePercentage.toFixed(1)}% = ${recommended} bottles`;
                } else {
                    selectionReason = '⭐ Pre-selected (no reference event data)';
                    calculationBreakdown = `${universalSettings.eventCapacity} × ${eventDays} days × 15% (default) = ${recommended} bottles`;
                }
            } else {
                // Calculate for non-selected products too
                const referenceEvents = salesHistory.filter(sale => 
                    sale.productId === product.id && 
                    sale.eventType === eventType && 
                    sale.eventCategory === eventCategory
                );
                
                if (referenceEvents.length > 0) {
                    const referencePercentage = referenceEvents[0].percentage;
                    calculationBreakdown = `${universalSettings.eventCapacity} × ${eventDays} days × ${referencePercentage.toFixed(1)}% = ${recommended} bottles`;
                } else {
                    calculationBreakdown = `${universalSettings.eventCapacity} × ${eventDays} days × 15% (default) = ${recommended} bottles`;
                }
            }
            
            // Calculate daily average
            const dailyAverage = Math.round(recommended / eventDays);
            
            return `
                <div class="border rounded-lg p-4 ${isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200'} card-hover transition-all duration-200">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <input type="checkbox" ${isSelected ? 'checked' : ''} 
                                   onchange="toggleEventProduct('${product.id}')" 
                                   class="w-4 h-4 text-blue-600">
                            <div class="flex items-center space-x-2">
                                <span class="text-2xl">${product.icon}</span>
                                <div>
                                    <h4 class="font-medium">${product.name}</h4>
                                    <p class="text-sm text-gray-600">${product.description}</p>
                                    <div class="flex items-center space-x-2 mt-1">
                                        <span class="badge ${expirationStatus.color === 'red' ? 'badge-red' : expirationStatus.color === 'yellow' ? 'badge-yellow' : 'badge-green'} text-xs">
                                            ${expirationStatus.text}
                                        </span>
                                        ${willExpireDuringEvent ? '<span class="badge badge-yellow text-xs">⚠️ Expires during event</span>' : ''}
                                    </div>
                                    ${selectionReason ? `<p class="text-xs text-blue-700 mt-1">${selectionReason}</p>` : ''}
                                </div>
                            </div>
                        </div>
                        
                        <div class="text-right">
                            <p class="text-lg font-semibold text-blue-600">${recommended} bottles</p>
                            <p class="text-sm text-gray-600">total for ${eventDays} days</p>
                            <p class="text-xs text-gray-500">${dailyAverage} bottles/day</p>
                            ${willExpireDuringEvent ? '<p class="text-xs text-orange-600">⚠️ Use first</p>' : ''}
                            <div class="calculation-breakdown mt-1">
                                ${calculationBreakdown}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        safeUpdateHTML('event-products', eventHtml);
        
        debugLog('Event product display generated with reference event calculations', {
            eventType: eventType,
            eventCategory: eventCategory,
            eventDays: eventDays,
            products: products.length
        });
        
    } catch (error) {
        console.error('Error generating event product display:', error);
        handleError(error, 'event product display generation');
    }
}

// Toggle event product selection (works regardless of stock)
function toggleEventProduct(productId) {
    try {
        const index = eventPlanning.selectedProducts.indexOf(productId);
        if (index > -1) {
            eventPlanning.selectedProducts.splice(index, 1);
        } else {
            eventPlanning.selectedProducts.push(productId);
        }
        
        // Re-generate display to update visual state
        const eventType = document.getElementById('event-type')?.value || 'sulap';
        const eventCategory = document.getElementById('event-category')?.value || 'festival';
        const eventDays = parseInt(document.getElementById('event-days')?.value) || 3;
        
        generateEventProductDisplay(eventType, eventCategory, eventDays);
        updateEventSummary(eventType, eventCategory, eventDays);
        
        // Log the product toggle
        if (typeof logActivity === 'function') {
            const product = products.find(p => p.id === productId);
            const action = eventPlanning.selectedProducts.includes(productId) ? 'selected' : 'deselected';
            logActivity('Events', `Product ${product?.name} ${action} for event planning`);
        }
        
        debugLog('Event product toggled', {
            productId: productId,
            isSelected: eventPlanning.selectedProducts.includes(productId),
            totalSelected: eventPlanning.selectedProducts.length
        });
        
    } catch (error) {
        handleError(error, 'event product toggle');
    }
}

// =============================================================================
// EVENT SUMMARY AND INSIGHTS
// =============================================================================

// Update event summary with reference event calculations
function updateEventSummary(eventType = null, eventCategory = null, eventDays = null) {
    try {
        // Get current values if not provided
        if (!eventType) eventType = document.getElementById('event-type')?.value || 'sulap';
        if (!eventCategory) eventCategory = document.getElementById('event-category')?.value || 'festival';
        if (!eventDays) eventDays = parseInt(document.getElementById('event-days')?.value) || 3;
        
        // Total bottles needed = Event Duration × Daily Brewing Capacity
        const totalEventCapacity = universalSettings.eventCapacity * eventDays;
        
        // Filter out expired products from calculations and use ONLY selected products
        const validSelectedProducts = eventPlanning.selectedProducts.filter(id => {
            const earliestBatch = getEarliestExpiringBatch('event', id);
            return earliestBatch && !isExpired(earliestBatch.expirationDate);
        });
        
        // Calculate total ONLY from selected valid products using reference event data
        const totalBottles = validSelectedProducts.reduce((sum, id) => 
            sum + calculateEventRecommendedQuantity(id, eventType, eventCategory, eventDays), 0);
        
        const dailyProduction = Math.round(totalEventCapacity / eventDays);
        const capacityUtilization = Math.round((totalEventCapacity / (universalSettings.eventCapacity * eventDays)) * 100);
        
        safeUpdateText('event-total', `${totalEventCapacity} bottles`);
        safeUpdateText('daily-production', `${dailyProduction} bottles/day`);
        safeUpdateText('capacity-utilization', `${capacityUtilization}%`);
        
        // Generate smart recommendations
        generateSmartRecommendations(validSelectedProducts, eventDays, totalEventCapacity);
        
        debugLog('Event summary updated with reference event calculations', {
            totalEventCapacity: totalEventCapacity,
            selectedProducts: validSelectedProducts.length,
            capacityUtilization: capacityUtilization
        });
        
    } catch (error) {
        console.error('Error updating event summary:', error);
        handleError(error, 'event summary update');
    }
}

// Generate smart recommendations with reference event insights
function generateSmartRecommendations(validSelectedProducts, eventDays, totalEventCapacity) {
    try {
        let recommendations = [];
        
        // Check for expired products in selection
        const expiredSelected = eventPlanning.selectedProducts.filter(id => {
            const earliestBatch = getEarliestExpiringBatch('event', id);
            return !earliestBatch || isExpired(earliestBatch.expirationDate);
        });
        
        if (expiredSelected.length > 0) {
            const expiredNames = expiredSelected.map(id => products.find(p => p.id === id)?.name).join(', ');
            recommendations.push(`🚨 ${expiredSelected.length} expired/unavailable products selected (${expiredNames}) - remove immediately!`);
        }
        
        // Check for products expiring during event
        const expiringDuringEvent = validSelectedProducts.filter(id => {
            const earliestBatch = getEarliestExpiringBatch('event', id);
            if (!earliestBatch) return false;
            const daysLeft = getDaysUntilExpiration(earliestBatch.expirationDate);
            return daysLeft < eventDays;
        });
        
        if (expiringDuringEvent.length > 0) {
            const expiringNames = expiringDuringEvent.map(id => products.find(p => p.id === id)?.name).join(', ');
            recommendations.push(`⚠️ ${expiringDuringEvent.length} products will expire during event (${expiringNames}) - use first!`);
        }
        
        // Capacity recommendations
        const capacityUtilization = Math.round((totalEventCapacity / (universalSettings.eventCapacity * eventDays)) * 100);
        if (capacityUtilization > 100) {
            recommendations.push('⚠️ Over capacity! Reduce selection or increase daily capacity in settings.');
        } else if (capacityUtilization < 70) {
            recommendations.push('💡 Under-utilizing capacity. Consider adding more products or extending event duration.');
        } else {
            recommendations.push('✅ Good capacity utilization for your event duration.');
        }
        
        // Reference event insights
        const eventType = eventPlanning.eventType;
        const eventCategory = eventPlanning.eventCategory;
        const hasReferenceData = salesHistory.some(sale => 
            sale.eventType === eventType && sale.eventCategory === eventCategory
        );
        
        if (hasReferenceData) {
            recommendations.push('📊 Using reference event data for accurate recommendations.');
        } else {
            recommendations.push('🆕 New event type - using default allocations. Consider adding actual data after event.');
        }
        
        // Top performer recommendation
        if (validSelectedProducts.includes('P004')) {
            recommendations.push('🍑 Sun-Kissed Peach included - typically top performer!');
        } else if (!expiredSelected.includes('P004')) {
            recommendations.push('💡 Consider adding Sun-Kissed Peach - typically the best seller.');
        }
        
        // Product diversity recommendation
        if (validSelectedProducts.length < 3) {
            recommendations.push('📈 Consider adding more product variety to appeal to different customer preferences.');
        } else if (validSelectedProducts.length > 5) {
            recommendations.push('⚡ Large product selection - ensure adequate promotion for all items.');
        }
        
        // Food safety reminder
        if (validSelectedProducts.length > 0) {
            recommendations.push('🛡️ Safety reminder: All products have 7-day shelf life. Plan production accordingly.');
        }
        
        safeUpdateHTML('event-recommendations', recommendations.join('<br>'));
        
    } catch (error) {
        console.error('Error generating smart recommendations:', error);
    }
}

// =============================================================================
// EVENT PLANNING ACTIONS
// =============================================================================

// Export event planning data with reference event information
function exportEventPlan() {
    try {
        const eventType = document.getElementById('event-type')?.value || 'sulap';
        const eventCategory = document.getElementById('event-category')?.value || 'festival';
        const eventDays = parseInt(document.getElementById('event-days')?.value) || 3;
        const currentDate = getCurrentDate();
        
        let csvContent = 'M1 - Event Planning Export (Reference Event Method)\n';
        csvContent += `Date Generated,${currentDate.display}\n`;
        csvContent += `Event Type,${eventType.toUpperCase()}\n`;
        csvContent += `Event Category,${eventCategory}\n`;
        csvContent += `Event Duration,${eventDays} days\n`;
        csvContent += `Daily Capacity,${universalSettings.eventCapacity} bottles\n`;
        csvContent += `Total Capacity,${universalSettings.eventCapacity * eventDays} bottles\n`;
        csvContent += `Calculation Method,Reference Event Percentages (not historical averages)\n\n`;
        
        // Find reference event for documentation
        const referenceEventData = salesHistory.filter(sale => 
            sale.eventType === eventType && 
            sale.eventCategory === eventCategory
        );
        const referencePeriods = [...new Set(referenceEventData.map(sale => sale.period))];
        const referencePeriod = referencePeriods.length > 0 ? referencePeriods[0] : 'No reference event';
        
        csvContent += `Reference Event,${referencePeriod}\n\n`;
        
        csvContent += 'Product Analysis\n';
        csvContent += 'Product ID,Product Name,Icon,Selected,Reference Event %,Recommended Quantity,Daily Average,Current Stock,Stock Status,Calculation Breakdown\n';
        
        products.forEach(product => {
            const isSelected = eventPlanning.selectedProducts.includes(product.id);
            const recommended = calculateEventRecommendedQuantity(product.id, eventType, eventCategory, eventDays);
            const dailyAvg = Math.round(recommended / eventDays);
            const currentStock = getTotalStock('event', product.id);
            const earliestBatch = getEarliestExpiringBatch('event', product.id);
            const stockStatus = earliestBatch ? getExpirationStatus(earliestBatch.expirationDate).text : 'No Stock';
            
            // Get reference event percentage
            const referenceEvents = salesHistory.filter(sale => 
                sale.productId === product.id && 
                sale.eventType === eventType && 
                sale.eventCategory === eventCategory
            );
            const referencePercentage = referenceEvents.length > 0 ? 
                referenceEvents[0].percentage : 15;
            
            const calculationBreakdown = `${universalSettings.eventCapacity} × ${eventDays} days × ${referencePercentage.toFixed(1)}% = ${recommended}`;
            
            csvContent += `${product.id},${product.name},${product.icon},${isSelected ? 'Yes' : 'No'},${referencePercentage.toFixed(1)}%,${recommended},${dailyAvg},${currentStock},"${stockStatus}","${calculationBreakdown}"\n`;
        });
        
        // Add selected products summary
        csvContent += '\nSelected Products Summary\n';
        csvContent += 'Product Name,Icon,Reference Event %,Recommended Quantity,Percentage of Event\n';
        
        const selectedProducts = eventPlanning.selectedProducts.map(id => products.find(p => p.id === id)).filter(Boolean);
        selectedProducts.forEach(product => {
            const recommended = calculateEventRecommendedQuantity(product.id, eventType, eventCategory, eventDays);
            const totalEventCapacity = universalSettings.eventCapacity * eventDays;
            const percentage = ((recommended / totalEventCapacity) * 100).toFixed(1);
            
            const referenceEvents = salesHistory.filter(sale => 
                sale.productId === product.id && 
                sale.eventType === eventType && 
                sale.eventCategory === eventCategory
            );
            const referencePercentage = referenceEvents.length > 0 ? 
                referenceEvents[0].percentage.toFixed(1) : '15.0';
            
            csvContent += `${product.name},${product.icon},${referencePercentage}%,${recommended},${percentage}%\n`;
        });
        
        const totalSelected = eventPlanning.selectedProducts.reduce((sum, id) => 
            sum + calculateEventRecommendedQuantity(id, eventType, eventCategory, eventDays), 0);
        csvContent += `\nTotal Selected Quantity,${totalSelected} bottles\n`;
        csvContent += `Capacity Utilization,${Math.round((totalSelected / (universalSettings.eventCapacity * eventDays)) * 100)}%\n`;
        
        downloadCSV(csvContent, `event_plan_${eventType}_${eventCategory}_${currentDate.iso}.csv`);
        
        showNotification('Event plan exported successfully!', 'success');
        
        // Log the export activity
        if (typeof logActivity === 'function') {
            logActivity('Events', `Event plan exported for ${eventType} ${eventCategory} (${eventDays} days)`);
        }
        
        debugLog('Event plan exported', {
            eventType: eventType,
            eventCategory: eventCategory,
            eventDays: eventDays,
            selectedProducts: eventPlanning.selectedProducts.length
        });
        
    } catch (error) {
        handleError(error, 'event plan export');
    }
}

// Save event template
function saveEventTemplate() {
    try {
        const eventType = document.getElementById('event-type')?.value || 'sulap';
        const eventCategory = document.getElementById('event-category')?.value || 'festival';
        const eventDays = parseInt(document.getElementById('event-days')?.value) || 3;
        
        const templateName = prompt(`Save event template as:\n\nSuggested: ${eventType.toUpperCase()} ${eventCategory} ${eventDays}D Template`);
        
        if (templateName) {
            const template = {
                name: templateName,
                eventType: eventType,
                eventCategory: eventCategory,
                eventDays: eventDays,
                selectedProducts: [...eventPlanning.selectedProducts],
                capacity: universalSettings.eventCapacity,
                createdDate: getCurrentDate().iso,
                calculationMethod: 'reference_event'
            };
            
            // Create downloadable template file
            const templateContent = JSON.stringify(template, null, 2);
            const blob = new Blob([templateContent], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${templateName.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
            link.click();
            URL.revokeObjectURL(url);
            
            showNotification(`Template "${templateName}" saved successfully!`, 'success');
            
            // Log the template save
            if (typeof logActivity === 'function') {
                logActivity('Events', `Event template "${templateName}" saved`);
            }
            
            debugLog('Event template saved', template);
        }
        
    } catch (error) {
        handleError(error, 'event template save');
    }
}

// Load event template
function loadEventTemplate() {
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
                        const template = JSON.parse(e.target.result);
                        
                        // Validate template structure
                        if (!template.eventType || !template.eventCategory || !template.selectedProducts) {
                            throw new Error('Invalid template format');
                        }
                        
                        // Apply template
                        safeUpdateValue('event-type', template.eventType);
                        safeUpdateValue('event-category', template.eventCategory);
                        safeUpdateValue('event-days', template.eventDays || 3);
                        
                        eventPlanning.selectedProducts = [...template.selectedProducts];
                        
                        // Update display
                        updateEventRecommendations();
                        
                        showNotification(`Template "${template.name}" loaded successfully!`, 'success');
                        
                        // Log the template load
                        if (typeof logActivity === 'function') {
                            logActivity('Events', `Event template "${template.name}" loaded`);
                        }
                        
                        debugLog('Event template loaded', template);
                        
                    } catch (error) {
                        showNotification('Error loading template: Invalid file format', 'error');
                        console.error('Template load error:', error);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
        
    } catch (error) {
        handleError(error, 'event template load');
    }
}

// Refresh event recommendations
function refreshEventRecommendations() {
    try {
        measurePerformance('Event Recommendations Refresh', () => {
            updateEventRecommendations();
        });
        
        showNotification('Event recommendations refreshed!', 'success', 1500);
        
        // Log the refresh activity
        if (typeof logActivity === 'function') {
            logActivity('Events', 'Event recommendations manually refreshed');
        }
        
    } catch (error) {
        handleError(error, 'event recommendations refresh');
    }
}

// =============================================================================
// EVENT PLANNING SETTINGS SYNC
// =============================================================================

// Sync event planning with universal settings
function syncEventPlanningSettings() {
    try {
        // Update daily event capacity to match universal settings
        const dailyCapacityElement = document.getElementById('daily-event-capacity');
        if (dailyCapacityElement) {
            dailyCapacityElement.value = universalSettings.eventCapacity;
        }
        
        // Update event days to match default duration
        const eventDaysElement = document.getElementById('event-days');
        if (eventDaysElement) {
            eventDaysElement.value = universalSettings.eventDefaultDuration;
        }
        
        // Update event planning state
        eventPlanning.dailyEventCapacity = universalSettings.eventCapacity;
        eventPlanning.eventDays = universalSettings.eventDefaultDuration;
        
        // Refresh recommendations with new settings
        updateEventRecommendations();
        
        debugLog('Event planning settings synced', {
            eventCapacity: universalSettings.eventCapacity,
            eventDefaultDuration: universalSettings.eventDefaultDuration
        });
        
    } catch (error) {
        console.error('Error syncing event planning settings:', error);
    }
}

// =============================================================================
// INITIALIZATION AND SETUP
// =============================================================================

// Initialize event planning when events tab is loaded
function initializeEventPlanning() {
    try {
        // Sync with universal settings
        syncEventPlanningSettings();
        
        // Initialize product pre-selection
        initializeEventProductPreSelection();
        
        // Update all recommendations
        updateEventRecommendations();
        
        // Set up event listeners for real-time updates
        setupEventPlanningEventListeners();
        
        debugLog('Event planning initialized');
        
    } catch (error) {
        handleError(error, 'event planning initialization');
    }
}

// Setup event listeners for real-time updates
function setupEventPlanningEventListeners() {
    try {
        // Listen for changes in event form fields
        const eventTypeElement = document.getElementById('event-type');
        const eventCategoryElement = document.getElementById('event-category');
        const eventDaysElement = document.getElementById('event-days');
        
        if (eventTypeElement) {
            eventTypeElement.addEventListener('change', debounce(updateEventRecommendations, 300));
        }
        
        if (eventCategoryElement) {
            eventCategoryElement.addEventListener('change', debounce(updateEventRecommendations, 300));
        }
        
        if (eventDaysElement) {
            eventDaysElement.addEventListener('change', debounce(updateEventRecommendations, 300));
        }
        
    } catch (error) {
        console.error('Error setting up event planning event listeners:', error);
    }
}

// =============================================================================
// EXPORT FOR EXTERNAL USE
// =============================================================================

// Export event planning functions for external use
if (typeof window !== 'undefined') {
    window.EventPlanningFunctions = {
        loadEventsTab,
        initializeEventProductPreSelection,
        updateEventRecommendations,
        updateReferenceEventInfo,
        updateProductSelection,
        generateEventProductDisplay,
        toggleEventProduct,
        updateEventSummary,
        generateSmartRecommendations,
        exportEventPlan,
        saveEventTemplate,
        loadEventTemplate,
        refreshEventRecommendations,
        syncEventPlanningSettings,
        initializeEventPlanning,
        setupEventPlanningEventListeners,
        calculateEventRecommendedQuantity,
        getRecommendationWithExplanation
    };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize event planning if events tab is loaded
        if (document.getElementById('events-content')) {
            initializeEventPlanning();
        }
    });
}