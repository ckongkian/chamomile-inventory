// =============================================================================
// EVENT PLANNING AND RECOMMENDATIONS
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
                    <h4 class="font-medium text-blue-800 mb-2">📊 Historical Performance Reference</h4>
                    <div id="historical-reference" class="text-sm text-blue-700">
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

// Update event recommendations with proper pre-selection based on historical data
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
        
        // Update historical reference
        updateHistoricalReference(eventType, eventCategory);
        
        // Auto-select products based on event type and category
        updateProductSelection(eventType, eventCategory);
        
        // Generate product recommendations with calculation breakdown
        generateEventProductDisplay(eventType, eventCategory, eventDays);
        
        // Update event summary
        updateEventSummary(eventType, eventCategory, eventDays);
        
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

// Update historical reference section
function updateHistoricalReference(eventType, eventCategory) {
    try {
        const relevantHistory = salesHistory.filter(sale => 
            sale.eventType === eventType && sale.eventCategory === eventCategory
        );
        
        let historyHtml = '';
        if (relevantHistory.length > 0) {
            const sampleEvent = relevantHistory[0];
            const topPerformer = relevantHistory.reduce((max, sale) => 
                sale.percentage > max.percentage ? sale : max
            );
            
            const topProduct = products.find(p => p.id === topPerformer.productId);
            const uniqueEvents = [...new Set(relevantHistory.map(sale => sale.period))];
            
            historyHtml = `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <strong>📊 Reference Event:</strong><br>
                        ${sampleEvent.period}<br>
                        <span class="text-xs">${sampleEvent.days} days duration</span>
                    </div>
                    <div>
                        <strong>🏆 Top Performer:</strong><br>
                        ${topProduct?.icon} ${topProduct?.name}<br>
                        <span class="text-xs">${topPerformer.percentage}% of total sales</span>
                    </div>
                    <div>
                        <strong>📈 Data Points:</strong><br>
                        ${uniqueEvents.length} similar events<br>
                        <span class="text-xs">${relevantHistory.length} product records</span>
                    </div>
                </div>
            `;
        } else {
            historyHtml = `
                <div class="text-center p-4 bg-orange-50 border border-orange-200 rounded">
                    <strong>🆕 New Event Type:</strong> Using average performance data for recommendations<br>
                    <span class="text-xs mt-2 block">💡 Consider adding sales data after this event for better future predictions</span>
                </div>
            `;
        }
        
        safeUpdateHTML('historical-reference', historyHtml);
        
    } catch (error) {
        console.error('Error updating historical reference:', error);
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

// Generate event product display with calculation breakdown
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
            
            // Determine selection reason based on historical data
            let selectionReason = '';
            let calculationBreakdown = '';
            
            if (isSelected) {
                const relevantHistory = salesHistory.filter(sale => 
                    sale.productId === product.id && 
                    sale.eventType === eventType && 
                    sale.eventCategory === eventCategory
                );
                
                if (relevantHistory.length > 0) {
                    const productData = relevantHistory[0];
                    const avgPercentage = relevantHistory.reduce((sum, sale) => sum + sale.percentage, 0) / relevantHistory.length;
                    selectionReason = `📊 Historical: ${avgPercentage.toFixed(1)}% avg (${relevantHistory.length} events)`;
                    calculationBreakdown = `${universalSettings.eventCapacity} × ${eventDays} days × ${avgPercentage.toFixed(1)}% = ${recommended} bottles`;
                } else {
                    selectionReason = '⭐ Pre-selected based on overall performance';
                    calculationBreakdown = `${universalSettings.eventCapacity} × ${eventDays} days × 15% (default) = ${recommended} bottles`;
                }
            } else {
                // Calculate for non-selected products too
                const relevantHistory = salesHistory.filter(sale => 
                    sale.productId === product.id && 
                    sale.eventType === eventType && 
                    sale.eventCategory === eventCategory
                );
                
                if (relevantHistory.length > 0) {
                    const avgPercentage = relevantHistory.reduce((sum, sale) => sum + sale.percentage, 0) / relevantHistory.length;
                    calculationBreakdown = `${universalSettings.eventCapacity} × ${eventDays} days × ${avgPercentage.toFixed(1)}% = ${recommended} bottles`;
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
        
        debugLog('Event product display generated', {
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

// Toggle event product selection (Now works regardless of stock)
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

// Update event summary
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
        
        // Calculate total ONLY from selected valid products
        const totalBottles = validSelectedProducts.reduce((sum, id) => 
            sum + calculateEventRecommendedQuantity(id, eventType, eventCategory, eventDays), 0);
        
        const dailyProduction = Math.round(totalEventCapacity / eventDays);
        const capacityUtilization = Math.round((totalEventCapacity / (universalSettings.eventCapacity * eventDays)) * 100);
        
        safeUpdateText('event-total', `${totalEventCapacity} bottles`);
        safeUpdateText('daily-production', `${dailyProduction} bottles/day`);
        safeUpdateText('capacity-utilization', `${capacityUtilization}%`);
        
        // Generate smart recommendations
        generateSmartRecommendations(validSelectedProducts, eventDays, totalEventCapacity);
        
        debugLog('Event summary updated', {
            totalEventCapacity: totalEventCapacity,
            selectedProducts: validSelectedProducts.length,
            capacityUtilization: capacityUtilization
        });
        
    } catch (error) {
        console.error('Error updating event summary:', error);
        handleError(error, 'event summary update');
    }
}

// Generate smart recommendations
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
        
        // Top performer recommendation
        if (validSelectedProducts.includes('P004')) {
            recommendations.push('🍑 Sun-Kissed Peach included - historically your top performer!');
        } else if (!expiredSelected.includes('P004')) {
            recommendations.push('💡 Consider adding Sun-Kissed Peach - it\'s typically your best seller.');
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
        
        // Stock availability check
        const lowStockProducts = validSelectedProducts.filter(id => getTotalStock('event', id) < 20);
        if (lowStockProducts.length > 0) {
            const lowStockNames = lowStockProducts.map(id => products.find(p => p.id === id)?.name).join(', ');
            recommendations.push(`📦 Low current stock for: ${lowStockNames}. Plan additional brewing.`);
        }
        
        // Performance insights
        const selectedProductsData = validSelectedProducts.map(id => {
            const product = products.find(p => p.id === id);
            const productSales = salesHistory.filter(sale => sale.productId === id);
            const avgPercentage = productSales.length > 0 ? 
                productSales.reduce((sum, sale) => sum + sale.percentage, 0) / productSales.length : 0;
            return { id, name: product?.name, avgPercentage };
        }).sort((a, b) => b.avgPercentage - a.avgPercentage);
        
        if (selectedProductsData.length > 0) {
            const topPerformer = selectedProductsData[0];
            recommendations.push(`📊 Expected top performer: ${topPerformer.name} (${topPerformer.avgPercentage.toFixed(1)}% historical avg)`);
        }
        
        safeUpdateHTML('event-recommendations', recommendations.join('<br>'));
        
    } catch (error) {
        console.error('Error generating smart recommendations:', error);
    }
}

// =============================================================================
// EVENT PLANNING ACTIONS
// =============================================================================

// Export event planning data
function exportEventPlan() {
    try {
        const eventType = document.getElementById('event-type')?.value || 'sulap';
        const eventCategory = document.getElementById('event-category')?.value || 'festival';
        const eventDays = parseInt(document.getElementById('event-days')?.value) || 3;
        const currentDate = getCurrentDate();
        
        let csvContent = 'M1 - Event Planning Export\n';
        csvContent += `Date Generated,${currentDate.display}\n`;
        csvContent += `Event Type,${eventType.toUpperCase()}\n`;
        csvContent += `Event Category,${eventCategory}\n`;
        csvContent += `Event Duration,${eventDays} days\n`;
        csvContent += `Daily Capacity,${universalSettings.eventCapacity} bottles\n`;
        csvContent += `Total Capacity,${universalSettings.eventCapacity * eventDays} bottles\n\n`;
        
        csvContent += 'Product Analysis\n';
        csvContent += 'Product ID,Product Name,Icon,Selected,Recommended Quantity,Daily Average,Current Stock,Stock Status,Calculation Breakdown\n';
        
        products.forEach(product => {
            const isSelected = eventPlanning.selectedProducts.includes(product.id);
            const recommended = calculateEventRecommendedQuantity(product.id, eventType, eventCategory, eventDays);
            const dailyAvg = Math.round(recommended / eventDays);
            const currentStock = getTotalStock('event', product.id);
            const earliestBatch = getEarliestExpiringBatch('event', product.id);
            const stockStatus = earliestBatch ? getExpirationStatus(earliestBatch.expirationDate).text : 'No Stock';
            
            // Get calculation breakdown
            const relevantHistory = salesHistory.filter(sale => 
                sale.productId === product.id && 
                sale.eventType === eventType && 
                sale.eventCategory === eventCategory
            );
            
            const avgPercentage = relevantHistory.length > 0 ? 
                relevantHistory.reduce((sum, sale) => sum + sale.percentage, 0) / relevantHistory.length : 15;
            
            const calculationBreakdown = `${universalSettings.eventCapacity} × ${eventDays} days × ${avgPercentage.toFixed(1)}% = ${recommended}`;
            
            csvContent += `${product.id},${product.name},${product.icon},${isSelected ? 'Yes' : 'No'},${recommended},${dailyAvg},${currentStock},"${stockStatus}","${calculationBreakdown}"\n`;
        });
        
        // Add selected products summary
        csvContent += '\nSelected Products Summary\n';
        csvContent += 'Product Name,Icon,Recommended Quantity,Percentage of Event,Historical Data Points\n';
        
        const selectedProducts = eventPlanning.selectedProducts.map(id => products.find(p => p.id === id)).filter(Boolean);
        selectedProducts.forEach(product => {
            const recommended = calculateEventRecommendedQuantity(product.id, eventType, eventCategory, eventDays);
            const totalEventCapacity = universalSettings.eventCapacity * eventDays;
            const percentage = ((recommended / totalEventCapacity) * 100).toFixed(1);
            
            const relevantHistory = salesHistory.filter(sale => 
                sale.productId === product.id && 
                sale.eventType === eventType && 
                sale.eventCategory === eventCategory
            );
            
            csvContent += `${product.name},${product.icon},${recommended},${percentage}%,${relevantHistory.length} events\n`;
        });
        
        const totalSelected = eventPlanning.selectedProducts.reduce((sum, id) => 
            sum + calculateEventRecommendedQuantity(id, eventType, eventCategory, eventDays), 0);
        csvContent += `\nTotal Selected Quantity,${totalSelected} bottles\n`;
        csvContent += `Capacity Utilization,${Math.round((totalSelected / (universalSettings.eventCapacity * eventDays)) * 100)}%\n`;
        
        // Add recommendations
        csvContent += '\nRecommendations\n';
        const recommendations = document.getElementById('event-recommendations')?.textContent || '';
        if (recommendations) {
            csvContent += `"${recommendations.replace(/🚨|⚠️|💡|✅|🍑|📈|⚡|🛡️|📦|📊/g, '').replace(/<br>/g, '; ')}"\n`;
        }
        
        downloadCSV(csvContent, `event_plan_${eventType}_${eventCategory}_${currentDate.iso}.csv`);
        
        showNotification('Event plan exported successfully!', 'success');
        
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
                createdDate: getCurrentDate().iso
            };
            
            // In a real application, this would be saved to a backend or local storage
            // For now, we'll create a downloadable template file
            const templateContent = JSON.stringify(template, null, 2);
            const blob = new Blob([templateContent], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${templateName.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
            link.click();
            URL.revokeObjectURL(url);
            
            showNotification(`Template "${templateName}" saved successfully!`, 'success');
            
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
// EVENT ANALYTICS AND INSIGHTS
// =============================================================================

// Generate event planning insights
function generateEventPlanningInsights() {
    try {
        const insights = [];
        const eventType = document.getElementById('event-type')?.value || 'sulap';
        const eventCategory = document.getElementById('event-category')?.value || 'festival';
        const eventDays = parseInt(document.getElementById('event-days')?.value) || 3;
        
        // Historical performance analysis
        const relevantHistory = salesHistory.filter(sale => 
            sale.eventType === eventType && sale.eventCategory === eventCategory
        );
        
        if (relevantHistory.length > 0) {
            const avgTotalSales = relevantHistory.reduce((sum, sale) => sum + sale.sales, 0) / relevantHistory.length;
            const avgDailySales = avgTotalSales / eventDays;
            
            insights.push({
                type: 'info',
                title: 'Historical Performance',
                message: `Similar events averaged ${avgTotalSales.toFixed(0)} bottles total (${avgDailySales.toFixed(0)}/day)`,
                confidence: 'high'
            });
        }
        
        // Stock readiness analysis
        const selectedProducts = eventPlanning.selectedProducts;
        const lowStockProducts = selectedProducts.filter(id => getTotalStock('event', id) < 20);
        
        if (lowStockProducts.length > 0) {
            insights.push({
                type: 'warning',
                title: 'Stock Readiness',
                message: `${lowStockProducts.length} selected products have low stock. Consider brewing before event.`,
                confidence: 'high'
            });
        }
        
        // Capacity optimization
        const totalRecommended = selectedProducts.reduce((sum, id) => 
            sum + calculateEventRecommendedQuantity(id, eventType, eventCategory, eventDays), 0);
        const totalCapacity = universalSettings.eventCapacity * eventDays;
        const utilization = (totalRecommended / totalCapacity) * 100;
        
        if (utilization < 60) {
            insights.push({
                type: 'opportunity',
                title: 'Capacity Optimization',
                message: `Only ${utilization.toFixed(0)}% capacity utilized. Consider adding more products or extending duration.`,
                confidence: 'medium'
            });
        } else if (utilization > 100) {
            insights.push({
                type: 'critical',
                title: 'Over Capacity',
                message: `${utilization.toFixed(0)}% capacity planned. Reduce selection or increase daily capacity.`,
                confidence: 'high'
            });
        }
        
        return insights;
        
    } catch (error) {
        console.error('Error generating event planning insights:', error);
        return [];
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

// Cleanup event planning resources
function cleanupEventPlanning() {
    try {
        // Remove event listeners
        // Clear temporary data
        // Save current state if needed
        
        debugLog('Event planning cleaned up');
        
    } catch (error) {
        console.error('Error cleaning up event planning:', error);
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
        updateHistoricalReference,
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
        generateEventPlanningInsights,
        initializeEventPlanning,
        setupEventPlanningEventListeners,
        cleanupEventPlanning
    };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Don't auto-initialize here, will be called when tab is loaded
    });
}