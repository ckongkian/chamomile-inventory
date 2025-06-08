// Event planning functionality

// Load events tab content
function loadEventsTab() {
    const eventsContent = `
        <div class="space-y-6">
            <div class="bg-white p-6 rounded-lg border">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <span class="text-blue-600 mr-2">📅</span>
                    Event Planning & Quantity Optimizer
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
                               class="w-full p-2 border rounded-lg" onchange="updateEventRecommendations()" readonly>
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
            </div>
        </div>
    `;
    
    safeUpdateHTML('events-content', eventsContent);
    
    // Initialize event planning
    setTimeout(() => {
        initializeEventProductPreSelection();
        updateEventRecommendations();
    }, 100);
}

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
            // Sort by percentage and get top 3 (or all if less than 3)
            const topProducts = relevantHistory
                .sort((a, b) => b.percentage - a.percentage)
                .slice(0, Math.min(3, relevantHistory.length))
                .map(sale => sale.productId);
            
            eventPlanning.selectedProducts = topProducts;
        } else {
            // Fallback to overall top performers
            eventPlanning.selectedProducts = ['P004', 'P001', 'P005'];
        }
        
    } catch (error) {
        console.error('Error initializing event product pre-selection:', error);
        eventPlanning.selectedProducts = ['P004', 'P001', 'P005']; // Safe fallback
    }
}

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
        
        // Update historical reference
        updateHistoricalReference(eventType, eventCategory);
        
        // Auto-select products based on event type and category
        updateProductSelection(eventType, eventCategory);
        
        // Generate product recommendations with expiration consideration
        generateEventProductDisplay(eventType, eventCategory, eventDays);
        
        // Update event summary
        updateEventSummary(eventType, eventCategory, eventDays);
        
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
            
            historyHtml = `
                <strong>Reference:</strong> ${sampleEvent.period} - ${sampleEvent.days} days<br>
                <strong>Top Performer:</strong> ${topProduct?.name} (${topPerformer.percentage}% of sales)<br>
                <strong>Data Points:</strong> ${relevantHistory.length} similar events in database
            `;
        } else {
            historyHtml = `
                <strong>New event type:</strong> Using average performance data for recommendations<br>
                <strong>Note:</strong> Consider adding sales data after this event for better future predictions
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
            // Auto-select top products for this event type and category (up to 4)
            const topProducts = relevantHistory
                .sort((a, b) => b.percentage - a.percentage)
                .slice(0, Math.min(4, relevantHistory.length))
                .map(sale => sale.productId);
            
            eventPlanning.selectedProducts = topProducts;
        } else {
            // Use fallback selection for new event types
            eventPlanning.selectedProducts = ['P004', 'P001', 'P005'];
        }
        
    } catch (error) {
        console.error('Error updating product selection:', error);
    }
}

// Generate event product display
function generateEventProductDisplay(eventType, eventCategory, eventDays) {
    try {
        const eventHtml = products.map(product => {
            const recommended = calculateEventRecommendedQuantity(product.id, eventType, eventCategory, eventDays);
            const isSelected = eventPlanning.selectedProducts.includes(product.id);
            const earliestBatch = getEarliestExpiringBatch('event', product.id);
            const expirationStatus = earliestBatch ? getExpirationStatus(earliestBatch.expirationDate) : 
                { status: 'expired', class: 'bg-red-100 text-red-800', text: 'No Stock' };
            const isExpired = !earliestBatch || expirationStatus.status === 'expired';
            
            // Check if product will expire during event
            const daysLeft = earliestBatch ? getDaysUntilExpiration(earliestBatch.expirationDate) : 0;
            const willExpireDuringEvent = daysLeft < eventDays && daysLeft > 0;
            
            // Determine selection reason based on historical data
            let selectionReason = '';
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
                } else {
                    selectionReason = '⭐ Pre-selected based on overall performance';
                }
            }
            
            // Calculate daily average
            const dailyAverage = Math.round(recommended / eventDays);
            
            return `
                <div class="border rounded-lg p-4 ${isSelected ? 'border-blue-300 bg-blue-50' : ''} ${isExpired ? 'opacity-60' : ''}">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <input type="checkbox" ${isSelected ? 'checked' : ''} 
                                   onchange="toggleEventProduct('${product.id}')" 
                                   class="w-4 h-4 text-blue-600"
                                   ${isExpired ? 'disabled title="Product expired or no stock - cannot be used"' : ''}>
                            <div class="flex items-center space-x-2">
                                <span class="text-2xl">${product.icon}</span>
                                <div>
                                    <h4 class="font-medium">${product.name}</h4>
                                    <p class="text-sm text-gray-600">${product.description}</p>
                                    <div class="flex items-center space-x-2 mt-1">
                                        <span class="inline-block ${expirationStatus.class} text-xs px-2 py-1 rounded">
                                            ${expirationStatus.text}
                                        </span>
                                        ${willExpireDuringEvent ? '<span class="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">⚠️ Expires during event</span>' : ''}
                                    </div>
                                    ${selectionReason ? `<p class="text-xs text-blue-700 mt-1">${selectionReason}</p>` : ''}
                                </div>
                            </div>
                        </div>
                        
                        <div class="text-right">
                            <p class="text-lg font-semibold ${isExpired ? 'text-gray-400' : 'text-blue-600'}">${isExpired ? 'N/A' : recommended} bottles</p>
                            <p class="text-sm text-gray-600">total for ${eventDays} days</p>
                            <p class="text-xs text-gray-500">${isExpired ? 'No stock available' : dailyAverage} bottles/day</p>
                            ${willExpireDuringEvent && !isExpired ? '<p class="text-xs text-orange-600">⚠️ Use first</p>' : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        safeUpdateHTML('event-products', eventHtml);
        
    } catch (error) {
        console.error('Error generating event product display:', error);
    }
}

// Toggle event product selection
function toggleEventProduct(productId) {
    try {
        const index = eventPlanning.selectedProducts.indexOf(productId);
        if (index > -1) {
            eventPlanning.selectedProducts.splice(index, 1);
        } else {
            eventPlanning.selectedProducts.push(productId);
        }
        updateEventSummary();
        
    } catch (error) {
        handleError(error, 'event product toggle');
    }
}

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
        
    } catch (error) {
        console.error('Error updating event summary:', error);
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
        
        safeUpdateHTML('event-recommendations', recommendations.join('<br>'));
        
    } catch (error) {
        console.error('Error generating smart recommendations:', error);
    }
}

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
        
        // Refresh recommendations with new settings
        updateEventRecommendations();
        
    } catch (error) {
        console.error('Error syncing event planning settings:', error);
    }
}

// Export event planning data
function exportEventPlan() {
    try {
        const eventType = document.getElementById('event-type')?.value || 'sulap';
        const eventCategory = document.getElementById('event-category')?.value || 'festival';
        const eventDays = parseInt(document.getElementById('event-days')?.value) || 3;
        const today = new Date().toISOString().split('T')[0];
        
        let csvContent = 'Event Planning Export\n';
        csvContent += `Date Generated,${today}\n`;
        csvContent += `Event Type,${eventType.toUpperCase()}\n`;
        csvContent += `Event Category,${eventCategory}\n`;
        csvContent += `Event Duration,${eventDays} days\n`;
        csvContent += `Daily Capacity,${universalSettings.eventCapacity} bottles\n`;
        csvContent += `Total Capacity,${universalSettings.eventCapacity * eventDays} bottles\n\n`;
        
        csvContent += 'Product ID,Product Name,Selected,Recommended Quantity,Daily Average,Current Stock,Stock Status\n';
        
        products.forEach(product => {
            const isSelected = eventPlanning.selectedProducts.includes(product.id);
            const recommended = calculateEventRecommendedQuantity(product.id, eventType, eventCategory, eventDays);
            const dailyAvg = Math.round(recommended / eventDays);
            const currentStock = getTotalStock('event', product.id);
            const earliestBatch = getEarliestExpiringBatch('event', product.id);
            const stockStatus = earliestBatch ? getExpirationStatus(earliestBatch.expirationDate).text : 'No Stock';
            
            csvContent += `${product.id},${product.name},${isSelected ? 'Yes' : 'No'},${recommended},${dailyAvg},${currentStock},"${stockStatus}"\n`;
        });
        
        // Add selected products summary
        csvContent += '\nSelected Products Summary\n';
        const selectedProducts = eventPlanning.selectedProducts.map(id => products.find(p => p.id === id));
        selectedProducts.forEach(product => {
            if (product) {
                const recommended = calculateEventRecommendedQuantity(product.id, eventType, eventCategory, eventDays);
                csvContent += `${product.name},${recommended} bottles\n`;
            }
        });
        
        const totalSelected = eventPlanning.selectedProducts.reduce((sum, id) => 
            sum + calculateEventRecommendedQuantity(id, eventType, eventCategory, eventDays), 0);
        csvContent += `Total Selected,${totalSelected} bottles\n`;
        
        downloadCSV(csvContent, `event_plan_${eventType}_${eventCategory}_${today}.csv`);
        
    } catch (error) {
        handleError(error, 'event plan export');
    }
}

// Initialize event planning when events tab is loaded
function initializeEventPlanning() {
    try {
        // Sync with universal settings
        syncEventPlanningSettings();
        
        // Initialize product pre-selection
        initializeEventProductPreSelection();
        
        // Update all recommendations
        updateEventRecommendations();
        
    } catch (error) {
        handleError(error, 'event planning initialization');
    }
}