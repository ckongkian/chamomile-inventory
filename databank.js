// Data bank management functionality - FIXED VERSION

// FIXED: Removed all auto-refresh mechanisms - Issue #3
// Load databank tab content
function loadDatabankTab() {
    const databankContent = `
        <div class="space-y-6">
            <!-- Data Summary & Analytics (Moved to top) -->
            <div class="bg-white p-6 rounded-lg border">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <span class="text-orange-600 mr-2">📈</span>
                    Data Summary & Analytics
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 class="font-medium text-blue-800 mb-2">Total Events Recorded</h4>
                        <p class="text-2xl font-bold text-blue-900" id="total-events-count">0</p>
                        <p class="text-sm text-blue-700" id="events-breakdown">Across multiple years</p>
                    </div>
                    
                    <div class="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 class="font-medium text-green-800 mb-2">Top Performing Product</h4>
                        <p class="text-lg font-bold text-green-900" id="top-product-name">Sun-Kissed Peach</p>
                        <p class="text-sm text-green-700" id="top-product-percentage">Avg 30.2%</p>
                    </div>
                    
                    <div class="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 class="font-medium text-purple-800 mb-2">Data Coverage</h4>
                        <p class="text-lg font-bold text-purple-900" id="data-coverage">2024-2025</p>
                        <p class="text-sm text-purple-700" id="coverage-details">Multiple events & seasons</p>
                    </div>
                    
                    <div class="p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <h4 class="font-medium text-orange-800 mb-2">Data Quality</h4>
                        <p class="text-lg font-bold text-orange-900" id="data-quality-score">98%</p>
                        <p class="text-sm text-orange-700" id="data-quality-details">Complete records</p>
                    </div>
                </div>

                <!-- Advanced Analytics -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h5 class="font-medium text-gray-800 mb-3">📊 Event Type Performance</h5>
                        <div id="event-type-analytics" class="space-y-2">
                            <!-- Will be populated by JavaScript -->
                        </div>
                    </div>
                    
                    <div>
                        <h5 class="font-medium text-gray-800 mb-3">🎯 Product Performance Insights</h5>
                        <div class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-2">
                            <p class="text-sm text-yellow-800">
                                <strong>📚 How to Read These Insights:</strong><br>
                                • <strong>Average %:</strong> How much of total event sales this product typically gets<br>
                                • <strong>Consistency:</strong> How reliable this performance is (higher = more predictable)<br>
                                • <strong>Events:</strong> Number of events this data is based on<br>
                                💡 <strong>Quick Rule:</strong> High average + High consistency = Reliable top performer
                            </p>
                        </div>
                        <div id="product-performance-insights" class="space-y-2">
                            <!-- Will be populated by JavaScript -->
                        </div>
                    </div>
                </div>

                <!-- Seasonal Analysis -->
                <div class="mt-6">
                    <h5 class="font-medium text-gray-800 mb-3">📅 Seasonal & Category Analysis</h5>
                    <div id="seasonal-analysis" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Will be populated by JavaScript -->
                    </div>
                </div>
            </div>

            <!-- Data Bank Overview -->
            <div class="bg-white p-6 rounded-lg border">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <span class="text-purple-600 mr-2">📊</span>
                    Historical Sales Data Bank
                </h3>
                
                <div class="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p class="text-sm text-purple-800">
                        <strong>Purpose:</strong> This data bank contains all historical sales data used for quantity recommendations and event planning. 
                        You can view existing data and add new sales records to improve future recommendations.
                        <strong>Important:</strong> Each event period must total exactly 100% across all products.
                    </p>
                </div>
                
                <!-- Filter Controls -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Filter by Event Type</label>
                        <select id="filter-event-type" class="w-full p-2 border rounded-lg" onchange="filterDataBank()">
                            <option value="">All Event Types</option>
                            <option value="sulap">SULAP Events</option>
                            <option value="jam">JAM Events</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Filter by Category</label>
                        <select id="filter-event-category" class="w-full p-2 border rounded-lg" onchange="filterDataBank()">
                            <option value="">All Categories</option>
                            <option value="festival">Festival Events</option>
                            <option value="national">National Day</option>
                            <option value="regional">Regional Events</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Filter by Product</label>
                        <select id="filter-product" class="w-full p-2 border rounded-lg" onchange="filterDataBank()">
                            <option value="">All Products</option>
                            <option value="P001">Lavender Lullaby</option>
                            <option value="P002">Gentle Chamomile</option>
                            <option value="P003">Lychee Rosette</option>
                            <option value="P004">Sun-Kissed Peach</option>
                            <option value="P005">Moonlit Jasmine</option>
                            <option value="P006">Blushing Berry</option>
                        </select>
                    </div>
                    
                    <div class="flex items-end">
                        <button onclick="showAddDataModal()" class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                            Add New Data
                        </button>
                    </div>
                </div>
                
                <!-- Data Table -->
                <div class="overflow-x-auto table-container">
                    <table class="w-full text-sm border-collapse border border-gray-300">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="border border-gray-300 px-3 py-2 text-left">
                                    <button onclick="sortDataBank('period')" class="flex items-center hover:text-blue-600">
                                        Event Period <span class="ml-1">↕️</span>
                                    </button>
                                </th>
                                <th class="border border-gray-300 px-3 py-2 text-left">
                                    <button onclick="sortDataBank('eventType')" class="flex items-center hover:text-blue-600">
                                        Event Type <span class="ml-1">↕️</span>
                                    </button>
                                </th>
                                <th class="border border-gray-300 px-3 py-2 text-left">
                                    <button onclick="sortDataBank('eventCategory')" class="flex items-center hover:text-blue-600">
                                        Category <span class="ml-1">↕️</span>
                                    </button>
                                </th>
                                <th class="border border-gray-300 px-3 py-2 text-left">
                                    <button onclick="sortDataBank('productId')" class="flex items-center hover:text-blue-600">
                                        Product <span class="ml-1">↕️</span>
                                    </button>
                                </th>
                                <th class="border border-gray-300 px-3 py-2 text-center">
                                    <button onclick="sortDataBank('sales')" class="flex items-center justify-center hover:text-blue-600">
                                        Sales <span class="ml-1">↕️</span>
                                    </button>
                                </th>
                                <th class="border border-gray-300 px-3 py-2 text-center">
                                    <button onclick="sortDataBank('days')" class="flex items-center justify-center hover:text-blue-600">
                                        Days <span class="ml-1">↕️</span>
                                    </button>
                                </th>
                                <th class="border border-gray-300 px-3 py-2 text-center">Daily Avg</th>
                                <th class="border border-gray-300 px-3 py-2 text-center">
                                    <button onclick="sortDataBank('percentage')" class="flex items-center justify-center hover:text-blue-600">
                                        Percentage <span class="ml-1">↕️</span>
                                    </button>
                                </th>
                                <th class="border border-gray-300 px-3 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="databank-table">
                            <!-- Will be populated by JavaScript -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Add New Data Modal -->
        <div id="add-data-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
                    <div class="p-6">
                        <h3 class="text-lg font-semibold mb-4 flex items-center">
                            <span class="text-green-600 mr-2">➕</span>
                            Add New Sales Data (Must Total 100%)
                        </h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">Event Period *</label>
                                <input type="text" id="new-event-period" placeholder="e.g., SULAP Chinese New Year Feb 2025" 
                                       class="w-full p-2 border rounded-lg">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium mb-2">Event Type *</label>
                                <select id="new-event-type" class="w-full p-2 border rounded-lg">
                                    <option value="sulap">SULAP Event</option>
                                    <option value="jam">JAM Event</option>
                                    <option value="other">Other Event</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium mb-2">Event Category *</label>
                                <select id="new-event-category" class="w-full p-2 border rounded-lg">
                                    <option value="festival">Festival (Raya, Deepavali, CNY)</option>
                                    <option value="national">National Day</option>
                                    <option value="regional">Regional Event</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium mb-2">Event Duration (Days) *</label>
                                <input type="number" id="new-event-days" value="3" min="1" max="7" 
                                       class="w-full p-2 border rounded-lg">
                            </div>
                        </div>
                        
                        <h4 class="font-medium mb-3">Product Sales Data (Must Total 100%)</h4>
                        
                        <!-- Percentage Total Display -->
                        <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div class="flex justify-between items-center">
                                <span class="font-medium">Total Percentage:</span>
                                <span class="text-xl font-bold" id="total-percentage-display">0%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div id="percentage-progress" class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                            </div>
                            <p class="text-xs text-blue-600 mt-1">Must equal exactly 100% to save</p>
                        </div>
                        
                        <div class="grid grid-cols-1 gap-3" id="new-product-sales">
                            <!-- Will be populated by JavaScript -->
                        </div>
                        
                        <div class="flex space-x-3 mt-6">
                            <button onclick="saveNewData()" id="save-new-data-btn" disabled 
                                    class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed">
                                Save Data
                            </button>
                            <button onclick="closeAddDataModal()" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Data Modal -->
        <div id="edit-data-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                    <div class="p-6">
                        <h3 class="text-lg font-semibold mb-4 flex items-center">
                            <span class="text-blue-600 mr-2">✏️</span>
                            Edit Sales Data
                        </h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">Event Period</label>
                                <input type="text" id="edit-event-period" 
                                       class="w-full p-2 border rounded-lg">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium mb-2">Event Type</label>
                                <select id="edit-event-type" class="w-full p-2 border rounded-lg">
                                    <option value="sulap">SULAP Event</option>
                                    <option value="jam">JAM Event</option>
                                    <option value="other">Other Event</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium mb-2">Event Category</label>
                                <select id="edit-event-category" class="w-full p-2 border rounded-lg">
                                    <option value="festival">Festival (Raya, Deepavali, CNY)</option>
                                    <option value="national">National Day</option>
                                    <option value="regional">Regional Event</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium mb-2">Event Duration (Days)</label>
                                <input type="number" id="edit-event-days" min="1" max="7" 
                                       class="w-full p-2 border rounded-lg">
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">Product</label>
                                <select id="edit-product-id" class="w-full p-2 border rounded-lg" disabled>
                                    <option value="P001">💜 Lavender Lullaby</option>
                                    <option value="P002">🌼 Gentle Chamomile</option>
                                    <option value="P003">🌹 Lychee Rosette</option>
                                    <option value="P004">🍑 Sun-Kissed Peach</option>
                                    <option value="P005">🌙 Moonlit Jasmine</option>
                                    <option value="P006">🫐 Blushing Berry</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium mb-2">Sales Quantity</label>
                                <input type="number" id="edit-sales" min="0" 
                                       class="w-full p-2 border rounded-lg">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium mb-2">Percentage %</label>
                                <input type="number" id="edit-percentage" min="0" max="100" step="0.01"
                                       class="w-full p-2 border rounded-lg">
                            </div>
                        </div>
                        
                        <!-- Event Total Validation Display -->
                        <div id="edit-event-validation" class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div class="text-sm text-yellow-700">
                                <strong>Event Total Check:</strong> <span id="edit-event-total-info">Loading...</span>
                            </div>
                        </div>
                        
                        <div class="flex space-x-3 mt-4">
                            <button onclick="saveEditedData()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                                Update Data
                            </button>
                            <button onclick="closeEditDataModal()" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    safeUpdateHTML('databank-content', databankContent);
    
    // Initialize data bank
    setTimeout(() => {
        updateDataBank();
        updateAdvancedAnalytics();
    }, 100);
}

// FIXED: Data Bank functionality without auto-refresh
function updateDataBank() {
    try {
        // REMOVED: No auto-refresh calls - only manual updates
        filterDataBank();
        updateDataSummary();
        updateAdvancedAnalytics();
    } catch (error) {
        handleError(error, 'data bank update');
    }
}

// FIXED: Filter function without auto-refresh
function filterDataBank() {
    try {
        const filterEventType = document.getElementById('filter-event-type')?.value || '';
        const filterEventCategory = document.getElementById('filter-event-category')?.value || '';
        const filterProduct = document.getElementById('filter-product')?.value || '';

        let filteredData = salesHistory.filter(sale => {
            return (!filterEventType || sale.eventType === filterEventType) &&
                   (!filterEventCategory || sale.eventCategory === filterEventCategory) &&
                   (!filterProduct || sale.productId === filterProduct);
        });

        const tableHtml = filteredData.map((sale, filteredIndex) => {
            const product = products.find(p => p.id === sale.productId);
            const dailyAvg = (sale.sales / sale.days).toFixed(1);
            const originalIndex = salesHistory.indexOf(sale);
            
            // Check event total percentage
            const eventData = salesHistory.filter(s => s.period === sale.period);
            const eventTotal = eventData.reduce((sum, s) => sum + s.percentage, 0);
            const isEventComplete = Math.abs(eventTotal - 100) < 0.1;
            
            return `
                <tr class="${filteredIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} table-hover ${!isEventComplete ? 'bg-yellow-50' : ''}">
                    <td class="border border-gray-300 px-3 py-2">
                        ${sale.period}
                        ${!isEventComplete ? '<br><span class="text-xs text-yellow-600">⚠️ Event total: ' + eventTotal.toFixed(1) + '%</span>' : ''}
                    </td>
                    <td class="border border-gray-300 px-3 py-2">
                        <span class="inline-block px-2 py-1 rounded text-xs ${
                            sale.eventType === 'sulap' ? 'bg-blue-100 text-blue-800' : 
                            sale.eventType === 'jam' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }">${sale.eventType.toUpperCase()}</span>
                    </td>
                    <td class="border border-gray-300 px-3 py-2">
                        <span class="inline-block px-2 py-1 rounded text-xs ${
                            sale.eventCategory === 'festival' ? 'bg-purple-100 text-purple-800' :
                            sale.eventCategory === 'national' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                        }">${sale.eventCategory}</span>
                    </td>
                    <td class="border border-gray-300 px-3 py-2">
                        <div class="flex items-center space-x-2">
                            <span>${product?.icon}</span>
                            <span class="font-medium">${product?.name}</span>
                        </div>
                    </td>
                    <td class="border border-gray-300 px-3 py-2 text-center font-semibold">${sale.sales}</td>
                    <td class="border border-gray-300 px-3 py-2 text-center">${sale.days}</td>
                    <td class="border border-gray-300 px-3 py-2 text-center">${dailyAvg}</td>
                    <td class="border border-gray-300 px-3 py-2 text-center">
                        <span class="font-semibold ${sale.percentage > 25 ? 'text-green-600' : sale.percentage > 15 ? 'text-blue-600' : 'text-gray-600'}">
                            ${sale.percentage}%
                        </span>
                    </td>
                    <td class="border border-gray-300 px-3 py-2 text-center">
                        <div class="flex space-x-1 justify-center">
                            <button onclick="editDataEntry(${originalIndex})" class="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded bg-blue-50">Edit</button>
                            <button onclick="deleteDataEntry(${originalIndex})" class="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded bg-red-50">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        safeUpdateHTML('databank-table', tableHtml);
        
    } catch (error) {
        console.error('Error filtering data bank:', error);
    }
}

function updateDataSummary() {
    try {
        const totalEvents = [...new Set(salesHistory.map(sale => sale.period))].length;
        
        // Calculate top performing product
        const productPerformance = {};
        products.forEach(product => {
            const productSales = salesHistory.filter(sale => sale.productId === product.id);
            if (productSales.length > 0) {
                const avgPercentage = productSales.reduce((sum, sale) => sum + sale.percentage, 0) / productSales.length;
                productPerformance[product.id] = { product, avgPercentage, dataPoints: productSales.length };
            }
        });
        
        const topProduct = Object.values(productPerformance)
            .sort((a, b) => b.avgPercentage - a.avgPercentage)[0];

        // Update summary displays
        safeUpdateText('total-events-count', totalEvents);
        
        if (topProduct) {
            safeUpdateText('top-product-name', topProduct.product.name);
            safeUpdateText('top-product-percentage', `Avg ${topProduct.avgPercentage.toFixed(1)}%`);
        }
        
        // Calculate data coverage
        const years = [...new Set(salesHistory.map(sale => {
            const year = sale.period.match(/\d{4}/);
            return year ? year[0] : '2025';
        }))].sort();
        
        const coverage = years.length > 1 ? `${years[0]}-${years[years.length - 1]}` : years[0] || '2025';
        safeUpdateText('data-coverage', coverage);
        
        // Data quality assessment
        const incompleteEvents = getIncompleteEvents();
        const qualityScore = Math.round(((totalEvents - incompleteEvents.length) / totalEvents) * 100);
        safeUpdateText('data-quality-score', `${qualityScore}%`);
        safeUpdateText('data-quality-details', incompleteEvents.length > 0 ? `${incompleteEvents.length} incomplete` : 'Complete records');
        
        // Event type breakdown
        const sulapEvents = [...new Set(salesHistory.filter(sale => sale.eventType === 'sulap').map(s => s.period))].length;
        const jamEvents = [...new Set(salesHistory.filter(sale => sale.eventType === 'jam').map(s => s.period))].length;
        const breakdown = `${sulapEvents} SULAP, ${jamEvents} JAM events`;
        safeUpdateText('events-breakdown', breakdown);
        
        // Coverage details
        const categories = [...new Set(salesHistory.map(sale => sale.eventCategory))];
        safeUpdateText('coverage-details', `${categories.length} event categories`);
        
    } catch (error) {
        console.error('Error updating data summary:', error);
    }
}

// Advanced Analytics Functions
function updateAdvancedAnalytics() {
    try {
        updateEventTypeAnalytics();
        updateProductPerformanceInsights();
        updateSeasonalAnalysis();
    } catch (error) {
        console.error('Error updating advanced analytics:', error);
    }
}

function updateEventTypeAnalytics() {
    try {
        const eventTypes = ['sulap', 'jam'];
        const analyticsHtml = eventTypes.map(type => {
            const typeEvents = [...new Set(salesHistory.filter(sale => sale.eventType === type).map(s => s.period))];
            const avgSales = salesHistory.filter(sale => sale.eventType === type)
                .reduce((sum, sale) => sum + sale.sales, 0) / typeEvents.length || 0;
            
            return `
                <div class="p-3 rounded-lg ${type === 'sulap' ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'}">
                    <div class="flex justify-between">
                        <span class="font-medium">${type.toUpperCase()} Events</span>
                        <span class="text-sm font-semibold">${typeEvents.length} events</span>
                    </div>
                    <div class="text-xs text-gray-600 mt-1">Avg ${avgSales.toFixed(0)} bottles/event</div>
                </div>
            `;
        }).join('');
        
        safeUpdateHTML('event-type-analytics', analyticsHtml);
        
    } catch (error) {
        console.error('Error updating event type analytics:', error);
    }
}

// FIXED: Enhanced Product Performance Insights with clearer explanations - Issue #5
function updateProductPerformanceInsights() {
    try {
        const productStats = products.map(product => {
            const productSales = salesHistory.filter(sale => sale.productId === product.id);
            const avgPercentage = productSales.length > 0 ? 
                productSales.reduce((sum, sale) => sum + sale.percentage, 0) / productSales.length : 0;
            const consistency = calculateConsistency(productSales.map(s => s.percentage));
            
            return { product, avgPercentage, consistency, dataPoints: productSales.length };
        }).sort((a, b) => b.avgPercentage - a.avgPercentage);
        
        const insightsHtml = productStats.slice(0, 3).map((stat, index) => {
            const rank = index + 1;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';
            
            // FIXED: More intuitive performance descriptions
            let performanceLevel = '';
            let performanceColor = '';
            
            if (stat.avgPercentage >= 30) {
                performanceLevel = 'Star Performer';
                performanceColor = 'text-green-600';
            } else if (stat.avgPercentage >= 20) {
                performanceLevel = 'Strong Seller';
                performanceColor = 'text-blue-600';
            } else if (stat.avgPercentage >= 15) {
                performanceLevel = 'Good Choice';
                performanceColor = 'text-orange-600';
            } else {
                performanceLevel = 'Specialty Item';
                performanceColor = 'text-gray-600';
            }
            
            let consistencyLevel = '';
            if (stat.consistency >= 80) {
                consistencyLevel = 'Very Reliable';
            } else if (stat.consistency >= 60) {
                consistencyLevel = 'Fairly Reliable';
            } else {
                consistencyLevel = 'Variable';
            }
            
            return `
                <div class="p-3 rounded-lg border ${
                    rank === 1 ? 'bg-yellow-50 border-yellow-200' :
                    rank === 2 ? 'bg-gray-50 border-gray-200' : 
                    'bg-orange-50 border-orange-200'
                }">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center space-x-2">
                            <span>${medal}</span>
                            <span class="font-medium">${stat.product.icon} ${stat.product.name}</span>
                        </div>
                        <span class="text-sm font-semibold">${stat.avgPercentage.toFixed(1)}%</span>
                    </div>
                    <div class="text-xs space-y-1">
                        <div class="flex justify-between">
                            <span>Performance:</span>
                            <span class="font-medium ${performanceColor}">${performanceLevel}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Reliability:</span>
                            <span class="font-medium">${consistencyLevel} (${stat.consistency}%)</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Based on:</span>
                            <span class="font-medium">${stat.dataPoints} events</span>
                        </div>
                    </div>
                    <div class="mt-2 p-2 bg-white rounded text-xs">
                        <strong>💡 What this means:</strong> 
                        ${stat.avgPercentage >= 25 ? 'Top choice for events - consistently popular' :
                          stat.avgPercentage >= 20 ? 'Solid performer - good for variety' :
                          stat.avgPercentage >= 15 ? 'Dependable option - appeals to many' :
                          'Special appeal - unique taste profile'}
                    </div>
                </div>
            `;
        }).join('');
        
        safeUpdateHTML('product-performance-insights', insightsHtml);
        
    } catch (error) {
        console.error('Error updating product performance insights:', error);
    }
}

function updateSeasonalAnalysis() {
    try {
        const seasonalData = {
            festival: salesHistory.filter(sale => sale.eventCategory === 'festival'),
            national: salesHistory.filter(sale => sale.eventCategory === 'national'),
            regional: salesHistory.filter(sale => sale.eventCategory === 'regional')
        };
        
        const analysisHtml = Object.entries(seasonalData).map(([category, sales]) => {
            const events = [...new Set(sales.map(s => s.period))].length;
            const avgPerformance = sales.length > 0 ? 
                sales.reduce((sum, sale) => sum + sale.sales, 0) / events : 0;
            
            const colorClass = category === 'festival' ? 'purple' : 
                              category === 'national' ? 'red' : 'orange';
            
            return `
                <div class="p-3 bg-${colorClass}-50 border border-${colorClass}-200 rounded-lg">
                    <h6 class="font-medium text-${colorClass}-800 capitalize">${category} Events</h6>
                    <div class="text-lg font-bold text-${colorClass}-900">${events}</div>
                    <div class="text-xs text-${colorClass}-700">Avg ${avgPerformance.toFixed(0)} bottles/event</div>
                </div>
            `;
        }).join('');
        
        safeUpdateHTML('seasonal-analysis', analysisHtml);
        
    } catch (error) {
        console.error('Error updating seasonal analysis:', error);
    }
}

function calculateConsistency(percentages) {
    if (percentages.length < 2) return 100;
    
    const mean = percentages.reduce((sum, p) => sum + p, 0) / percentages.length;
    const variance = percentages.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / percentages.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Lower standard deviation = higher consistency
    const consistency = Math.max(0, 100 - (standardDeviation * 5));
    return Math.round(consistency);
}

function getIncompleteEvents() {
    const eventTotals = {};
    
    salesHistory.forEach(sale => {
        if (!eventTotals[sale.period]) {
            eventTotals[sale.period] = 0;
        }
        eventTotals[sale.period] += sale.percentage;
    });
    
    return Object.entries(eventTotals)
        .filter(([period, total]) => Math.abs(total - 100) > 0.1)
        .map(([period, total]) => ({ period, total }));
}

// Modal Management Functions
function showAddDataModal() {
    try {
        document.getElementById('add-data-modal')?.classList.remove('hidden');
        
        // Generate product sales input fields
        const productSalesHtml = products.map(product => `
            <div class="flex items-center space-x-4 p-3 border rounded-lg">
                <div class="flex items-center space-x-2 w-1/3">
                    <span class="text-xl">${product.icon}</span>
                    <span class="font-medium">${product.name}</span>
                </div>
                <div class="flex-1">
                    <label class="block text-sm font-medium mb-1">Sales Quantity</label>
                    <input type="number" id="sales-${product.id}" value="0" min="0" 
                           class="w-full p-2 border rounded" onchange="updatePercentageTotal()">
                </div>
                <div class="flex-1">
                    <label class="block text-sm font-medium mb-1">Percentage %</label>
                    <input type="number" id="percentage-${product.id}" value="0" min="0" max="100" step="0.01"
                           class="w-full p-2 border rounded percentage-input" onchange="updatePercentageTotal()">
                </div>
            </div>
        `).join('');
        
        safeUpdateHTML('new-product-sales', productSalesHtml);
        updatePercentageTotal();
        
    } catch (error) {
        handleError(error, 'show add data modal');
    }
}

function closeAddDataModal() {
    try {
        document.getElementById('add-data-modal')?.classList.add('hidden');
    } catch (error) {
        console.error('Error closing add data modal:', error);
    }
}

function updatePercentageTotal() {
    try {
        let total = 0;
        products.forEach(product => {
            const percentageElement = document.getElementById(`percentage-${product.id}`);
            if (percentageElement) {
                total += parseFloat(percentageElement.value) || 0;
            }
        });
        
        const displayElement = document.getElementById('total-percentage-display');
        const progressElement = document.getElementById('percentage-progress');
        const saveButton = document.getElementById('save-new-data-btn');
        
        if (displayElement) {
            displayElement.textContent = `${total.toFixed(1)}%`;
            displayElement.className = total === 100 ? 'text-xl font-bold text-green-600' : 
                                     total > 100 ? 'text-xl font-bold text-red-600' : 
                                     'text-xl font-bold text-orange-600';
        }
        
        if (progressElement) {
            const width = Math.min(100, total);
            progressElement.style.width = `${width}%`;
            progressElement.className = total === 100 ? 'bg-green-600 h-2 rounded-full transition-all duration-300' :
                                       total > 100 ? 'bg-red-600 h-2 rounded-full transition-all duration-300' :
                                       'bg-blue-600 h-2 rounded-full transition-all duration-300';
        }
        
        if (saveButton) {
            const isValid = Math.abs(total - 100) < 0.01;
            saveButton.disabled = !isValid;
            saveButton.textContent = isValid ? 'Save Data' : `Total must be 100% (currently ${total.toFixed(1)}%)`;
        }
        
    } catch (error) {
        console.error('Error updating percentage total:', error);
    }
}

function saveNewData() {
    try {
        const period = document.getElementById('new-event-period')?.value;
        const eventType = document.getElementById('new-event-type')?.value;
        const eventCategory = document.getElementById('new-event-category')?.value;
        const days = parseInt(document.getElementById('new-event-days')?.value);

        if (!period) {
            alert('Please enter an event period');
            return;
        }

        // Validate percentage total
        let total = 0;
        const newSalesData = [];
        
        products.forEach(product => {
            const salesElement = document.getElementById(`sales-${product.id}`);
            const percentageElement = document.getElementById(`percentage-${product.id}`);
            
            if (salesElement && percentageElement) {
                const sales = parseInt(salesElement.value) || 0;
                const percentage = parseFloat(percentageElement.value) || 0;
                
                total += percentage;
                
                if (sales > 0 && percentage > 0) {
                    newSalesData.push({
                        productId: product.id,
                        period: period,
                        sales: sales,
                        days: days,
                        percentage: percentage,
                        eventType: eventType,
                        eventCategory: eventCategory
                    });
                }
            }
        });

        // Strict validation for 100%
        if (Math.abs(total - 100) > 0.01) {
            alert(`Total percentage must equal exactly 100%. Current total: ${total.toFixed(2)}%`);
            return;
        }

        if (newSalesData.length === 0) {
            alert('Please enter sales data for at least one product');
            return;
        }

        // Add all data
        newSalesData.forEach(data => salesHistory.push(data));

        closeAddDataModal();
        
        // FIXED: Manual update only - no auto-refresh
        updateDataBank();
        
        // Update other components that depend on sales history
        if (typeof updateEventRecommendations === 'function') {
            updateEventRecommendations();
        }
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
        
        showNotification(`New sales data added successfully! Added ${newSalesData.length} product records for ${period}`, 'success');
        
    } catch (error) {
        handleError(error, 'save new data');
    }
}

function deleteDataEntry(index) {
    if (confirm('Are you sure you want to delete this data entry? This will affect event recommendations.')) {
        try {
            const deletedSale = salesHistory[index];
            salesHistory.splice(index, 1);
            
            // FIXED: Manual update only
            updateDataBank();
            
            // Update dependent components
            if (typeof updateEventRecommendations === 'function') {
                updateEventRecommendations();
            }
            if (typeof updateDashboard === 'function') {
                updateDashboard();
            }
            
            showNotification(`Deleted: ${deletedSale.period} - ${products.find(p => p.id === deletedSale.productId)?.name}`, 'success');
            
        } catch (error) {
            handleError(error, 'delete data entry');
        }
    }
}

// Edit data functionality with event validation
function editDataEntry(index) {
    try {
        editingDataIndex = index;
        const sale = salesHistory[index];
        
        // Populate edit form
        const editModal = document.getElementById('edit-data-modal');
        if (editModal) {
            safeUpdateValue('edit-event-period', sale.period);
            safeUpdateValue('edit-event-type', sale.eventType);
            safeUpdateValue('edit-event-category', sale.eventCategory);
            safeUpdateValue('edit-event-days', sale.days);
            safeUpdateValue('edit-product-id', sale.productId);
            safeUpdateValue('edit-sales', sale.sales);
            safeUpdateValue('edit-percentage', sale.percentage);
            
            // Update event validation info
            updateEditEventValidation(sale.period, index);
            
            // Show edit modal
            editModal.classList.remove('hidden');
        }
        
    } catch (error) {
        handleError(error, 'edit data entry');
    }
}

function updateEditEventValidation(eventPeriod, excludeIndex) {
    try {
        const eventData = salesHistory.filter((sale, index) => 
            sale.period === eventPeriod && index !== excludeIndex
        );
        
        const currentTotal = eventData.reduce((sum, sale) => sum + sale.percentage, 0);
        const currentPercentage = parseFloat(document.getElementById('edit-percentage')?.value) || 0;
        const newTotal = currentTotal + currentPercentage;
        
        const validationElement = document.getElementById('edit-event-total-info');
        if (validationElement) {
            if (Math.abs(newTotal - 100) < 0.01) {
                validationElement.innerHTML = `✅ Event total will be exactly 100% (${newTotal.toFixed(1)}%)`;
                validationElement.parentElement.className = 'mb-4 p-3 bg-green-50 border border-green-200 rounded-lg';
            } else {
                validationElement.innerHTML = `⚠️ Event total will be ${newTotal.toFixed(1)}% (should be 100%)`;
                validationElement.parentElement.className = 'mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg';
            }
        }
        
    } catch (error) {
        console.error('Error updating edit event validation:', error);
    }
}

function closeEditDataModal() {
    try {
        document.getElementById('edit-data-modal')?.classList.add('hidden');
        editingDataIndex = -1;
    } catch (error) {
        console.error('Error closing edit data modal:', error);
    }
}

function saveEditedData() {
    try {
        if (editingDataIndex === -1) return;
        
        const period = document.getElementById('edit-event-period')?.value;
        const eventType = document.getElementById('edit-event-type')?.value;
        const eventCategory = document.getElementById('edit-event-category')?.value;
        const days = parseInt(document.getElementById('edit-event-days')?.value);
        const sales = parseInt(document.getElementById('edit-sales')?.value);
        const percentage = parseFloat(document.getElementById('edit-percentage')?.value);
        
        if (!period || sales <= 0 || percentage <= 0) {
            alert('Please fill in all required fields with valid values');
            return;
        }
        
        // Validate event total
        const eventData = salesHistory.filter((sale, index) => 
            sale.period === period && index !== editingDataIndex
        );
        const eventTotal = eventData.reduce((sum, sale) => sum + sale.percentage, 0) + percentage;
        
        if (Math.abs(eventTotal - 100) > 0.01) {
            const shouldContinue = confirm(
                `Warning: This change will make the event total ${eventTotal.toFixed(1)}% instead of 100%.\n\n` +
                `This may affect the accuracy of recommendations. Continue anyway?`
            );
            if (!shouldContinue) return;
        }
        
        // Update the data
        salesHistory[editingDataIndex] = {
            ...salesHistory[editingDataIndex],
            period: period,
            eventType: eventType,
            eventCategory: eventCategory,
            days: days,
            sales: sales,
            percentage: percentage
        };
        
        closeEditDataModal();
        
        // FIXED: Manual update only
        updateDataBank();
        
        // Update dependent components
        if (typeof updateEventRecommendations === 'function') {
            updateEventRecommendations();
        }
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
        
        showNotification('Sales data updated successfully!', 'success');
        
    } catch (error) {
        handleError(error, 'save edited data');
    }
}

// Sorting functionality for databank
function sortDataBank(column) {
    try {
        // Toggle sort direction
        sortDirection[column] = sortDirection[column] === 'asc' ? 'desc' : 'asc';
        
        salesHistory.sort((a, b) => {
            let valueA, valueB;
            
            switch(column) {
                case 'period':
                    valueA = a.period;
                    valueB = b.period;
                    break;
                case 'eventType':
                    valueA = a.eventType;
                    valueB = b.eventType;
                    break;
                case 'eventCategory':
                    valueA = a.eventCategory;
                    valueB = b.eventCategory;
                    break;
                case 'productId':
                    valueA = products.find(p => p.id === a.productId)?.name || '';
                    valueB = products.find(p => p.id === b.productId)?.name || '';
                    break;
                case 'sales':
                    valueA = a.sales;
                    valueB = b.sales;
                    break;
                case 'days':
                    valueA = a.days;
                    valueB = b.days;
                    break;
                case 'percentage':
                    valueA = a.percentage;
                    valueB = b.percentage;
                    break;
                default:
                    return 0;
            }
            
            if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }
            
            if (sortDirection[column] === 'asc') {
                return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
            } else {
                return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
            }
        });
        
        // FIXED: Manual refresh only
        filterDataBank();
        
    } catch (error) {
        handleError(error, 'data bank sorting');
    }
}

// Helper function to safely update form values
function safeUpdateValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.value = value;
    }
}

// Export data bank functionality
function exportDataBank() {
    try {
        const csvContent = generateSalesHistoryCSV();
        const today = new Date().toISOString().split('T')[0];
        downloadCSV(csvContent, `sales_data_bank_${today}.csv`);
        showNotification('Data bank exported successfully!', 'success');
    } catch (error) {
        handleError(error, 'data bank export');
    }
}

// Add event listeners for percentage validation in edit modal
document.addEventListener('change', (e) => {
    if (e.target.id === 'edit-percentage' && editingDataIndex >= 0) {
        const sale = salesHistory[editingDataIndex];
        updateEditEventValidation(sale.period, editingDataIndex);
    }
});