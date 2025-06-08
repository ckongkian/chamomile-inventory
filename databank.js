// Data bank management functionality

// Load databank tab content
function loadDatabankTab() {
    const databankContent = `
        <div class="space-y-6">
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
                        <button onclick="showAddDataForm()" class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
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
            
            <!-- Add New Data Form -->
            <div id="add-data-form" class="bg-white p-6 rounded-lg border hidden">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <span class="text-green-600 mr-2">➕</span>
                    Add New Sales Data
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Event Period</label>
                        <input type="text" id="new-event-period" placeholder="e.g., SULAP Chinese New Year Feb 2025" 
                               class="w-full p-2 border rounded-lg">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Event Type</label>
                        <select id="new-event-type" class="w-full p-2 border rounded-lg">
                            <option value="sulap">SULAP Event</option>
                            <option value="jam">JAM Event</option>
                            <option value="other">Other Event</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Event Category</label>
                        <select id="new-event-category" class="w-full p-2 border rounded-lg">
                            <option value="festival">Festival (Raya, Deepavali, CNY)</option>
                            <option value="national">National Day</option>
                            <option value="regional">Regional Event</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Event Duration (Days)</label>
                        <input type="number" id="new-event-days" value="3" min="1" max="7" 
                               class="w-full p-2 border rounded-lg">
                    </div>
                </div>
                
                <h4 class="font-medium mb-3">Product Sales Data</h4>
                <div class="grid grid-cols-1 gap-3" id="new-product-sales">
                    <!-- Will be populated by JavaScript -->
                </div>
                
                <div class="flex space-x-3 mt-4">
                    <button onclick="saveNewData()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                        Save Data
                    </button>
                    <button onclick="cancelAddData()" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                        Cancel
                    </button>
                </div>
            </div>
            
            <!-- Edit Data Form -->
            <div id="edit-data-form" class="bg-white p-6 rounded-lg border hidden">
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
                
                <div class="flex space-x-3 mt-4">
                    <button onclick="saveEditedData()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                        Update Data
                    </button>
                    <button onclick="cancelEditData()" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                        Cancel
                    </button>
                </div>
            </div>
            
            <!-- Data Summary -->
            <div class="bg-white p-6 rounded-lg border">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <span class="text-orange-600 mr-2">📈</span>
                    Data Summary & Analytics
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                </div>
            </div>
        </div>
    `;
    
    safeUpdateHTML('databank-content', databankContent);
    
    // Initialize data bank
    setTimeout(() => {
        updateDataBank();
    }, 100);
}

// Data Bank functionality
function updateDataBank() {
    try {
        filterDataBank();
        updateDataSummary();
    } catch (error) {
        handleError(error, 'data bank update');
    }
}

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
            
            return `
                <tr class="${filteredIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} table-hover">
                    <td class="border border-gray-300 px-3 py-2">${sale.period}</td>
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
        
        // Event type breakdown
        const sulapEvents = salesHistory.filter(sale => sale.eventType === 'sulap').length;
        const jamEvents = salesHistory.filter(sale => sale.eventType === 'jam').length;
        const breakdown = `${sulapEvents} SULAP, ${jamEvents} JAM events`;
        safeUpdateText('events-breakdown', breakdown);
        
        // Coverage details
        const categories = [...new Set(salesHistory.map(sale => sale.eventCategory))];
        safeUpdateText('coverage-details', `${categories.length} event categories`);
        
    } catch (error) {
        console.error('Error updating data summary:', error);
    }
}

function showAddDataForm() {
    try {
        document.getElementById('add-data-form')?.classList.remove('hidden');
        
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
                           class="w-full p-2 border rounded">
                </div>
                <div class="flex-1">
                    <label class="block text-sm font-medium mb-1">Percentage %</label>
                    <input type="number" id="percentage-${product.id}" value="0" min="0" max="100" step="0.01"
                           class="w-full p-2 border rounded">
                </div>
            </div>
        `).join('');
        
        safeUpdateHTML('new-product-sales', productSalesHtml);
        
    } catch (error) {
        handleError(error, 'show add data form');
    }
}

function cancelAddData() {
    try {
        document.getElementById('add-data-form')?.classList.add('hidden');
    } catch (error) {
        console.error('Error canceling add data:', error);
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

        let hasData = false;
        products.forEach(product => {
            const salesElement = document.getElementById(`sales-${product.id}`);
            const percentageElement = document.getElementById(`percentage-${product.id}`);
            
            if (salesElement && percentageElement) {
                const sales = parseInt(salesElement.value) || 0;
                const percentage = parseFloat(percentageElement.value) || 0;

                if (sales > 0 && percentage > 0) {
                    salesHistory.push({
                        productId: product.id,
                        period: period,
                        sales: sales,
                        days: days,
                        percentage: percentage,
                        eventType: eventType,
                        eventCategory: eventCategory
                    });
                    hasData = true;
                }
            }
        });

        if (!hasData) {
            alert('Please enter sales data for at least one product');
            return;
        }

        cancelAddData();
        updateDataBank();
        
        // Update other components that depend on sales history
        if (typeof updateEventRecommendations === 'function') {
            updateEventRecommendations();
        }
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
        
        alert('New sales data added successfully!');
        
    } catch (error) {
        handleError(error, 'save new data');
    }
}

function deleteDataEntry(index) {
    if (confirm('Are you sure you want to delete this data entry?')) {
        try {
            salesHistory.splice(index, 1);
            updateDataBank();
            
            // Update dependent components
            if (typeof updateEventRecommendations === 'function') {
                updateEventRecommendations();
            }
            if (typeof updateDashboard === 'function') {
                updateDashboard();
            }
            
        } catch (error) {
            handleError(error, 'delete data entry');
        }
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
        
        filterDataBank(); // Refresh the display
        
    } catch (error) {
        handleError(error, 'data bank sorting');
    }
}

// Edit data functionality
function editDataEntry(index) {
    try {
        editingDataIndex = index;
        const sale = salesHistory[index];
        
        // Populate edit form
        const editForm = document.getElementById('edit-data-form');
        if (editForm) {
            safeUpdateValue('edit-event-period', sale.period);
            safeUpdateValue('edit-event-type', sale.eventType);
            safeUpdateValue('edit-event-category', sale.eventCategory);
            safeUpdateValue('edit-event-days', sale.days);
            safeUpdateValue('edit-product-id', sale.productId);
            safeUpdateValue('edit-sales', sale.sales);
            safeUpdateValue('edit-percentage', sale.percentage);
            
            // Show edit form
            editForm.classList.remove('hidden');
        }
        
    } catch (error) {
        handleError(error, 'edit data entry');
    }
}

function cancelEditData() {
    try {
        document.getElementById('edit-data-form')?.classList.add('hidden');
        editingDataIndex = -1;
    } catch (error) {
        console.error('Error canceling edit data:', error);
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
        
        cancelEditData();
        updateDataBank();
        
        // Update dependent components
        if (typeof updateEventRecommendations === 'function') {
            updateEventRecommendations();
        }
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
        
        alert('Sales data updated successfully!');
        
    } catch (error) {
        handleError(error, 'save edited data');
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
    } catch (error) {
        handleError(error, 'data bank export');
    }
}

// Data validation
function validateSalesData(period, eventType, eventCategory, days, productSales) {
    const errors = [];
    
    if (!period || period.trim().length < 5) {
        errors.push('Event period must be at least 5 characters long');
    }
    
    if (!eventType) {
        errors.push('Event type is required');
    }
    
    if (!eventCategory) {
        errors.push('Event category is required');
    }
    
    if (days < 1 || days > 7) {
        errors.push('Event duration must be between 1 and 7 days');
    }
    
    const totalPercentage = productSales.reduce((sum, product) => sum + product.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.1) {
        errors.push(`Total percentage should equal 100% (current: ${totalPercentage.toFixed(1)}%)`);
    }
    
    const totalSales = productSales.reduce((sum, product) => sum + product.sales, 0);
    if (totalSales === 0) {
        errors.push('At least one product must have sales data');
    }
    
    return errors;
}

// Bulk data import functionality
function importBulkData() {
    try {
        const csvInput = prompt(`
Paste CSV data with format:
Period,EventType,EventCategory,Days,ProductID,Sales,Percentage

Example:
SULAP Test Event,sulap,festival,3,P004,50,30.5
        `);
        
        if (!csvInput) return;
        
        const lines = csvInput.trim().split('\n');
        let imported = 0;
        
        lines.forEach(line => {
            const [period, eventType, eventCategory, days, productId, sales, percentage] = line.split(',');
            
            if (period && eventType && eventCategory && days && productId && sales && percentage) {
                salesHistory.push({
                    period: period.trim(),
                    eventType: eventType.trim(),
                    eventCategory: eventCategory.trim(),
                    days: parseInt(days),
                    productId: productId.trim(),
                    sales: parseInt(sales),
                    percentage: parseFloat(percentage)
                });
                imported++;
            }
        });
        
        if (imported > 0) {
            updateDataBank();
            alert(`Successfully imported ${imported} records`);
        } else {
            alert('No valid records found in the CSV data');
        }
        
    } catch (error) {
        handleError(error, 'bulk data import');
    }
}