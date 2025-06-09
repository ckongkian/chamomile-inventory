// Authentication and logging system

// Authentication state
let authState = {
    isAuthenticated: false,
    username: null,
    loginTime: null,
    sessionTimeout: 24 * 60 * 60 * 1000 // 24 hours
};

// Activity log
let activityLog = [];

// Initialize authentication
function initializeAuth() {
    // Check if user is already logged in (session persistence)
    const savedSession = sessionStorage.getItem('tea_inventory_session');
    if (savedSession) {
        try {
            const session = JSON.parse(savedSession);
            const now = Date.now();
            
            // Check if session is still valid
            if (session.loginTime && (now - session.loginTime) < authState.sessionTimeout) {
                authState.isAuthenticated = true;
                authState.username = session.username;
                authState.loginTime = session.loginTime;
                
                logActivity('Authentication', 'Session restored from storage');
                return true;
            } else {
                // Session expired
                sessionStorage.removeItem('tea_inventory_session');
                logActivity('Authentication', 'Session expired');
            }
        } catch (error) {
            console.error('Error parsing saved session:', error);
            sessionStorage.removeItem('tea_inventory_session');
        }
    }
    
    // Show login screen if not authenticated
    if (!authState.isAuthenticated) {
        showLoginScreen();
        return false;
    }
    
    return true;
}

// Show login screen
function showLoginScreen() {
    const loginHTML = `
        <div id="login-overlay" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
                <div class="text-center mb-6">
                    <div class="text-4xl mb-2">🍃</div>
                    <h2 class="text-2xl font-bold text-gray-900">Chamomile Oatmilk Tea</h2>
                    <p class="text-gray-600">Inventory Management System</p>
                </div>
                
                <form id="login-form" onsubmit="handleLogin(event)" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input type="text" id="login-username" value="chamomile-inventory" readonly
                               class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                        <p class="text-xs text-gray-500 mt-1">System username (fixed)</p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input type="password" id="login-password" placeholder="No password required - just press Enter"
                               class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <p class="text-xs text-gray-500 mt-1">Leave empty and press Enter to login</p>
                    </div>
                    
                    <button type="submit" id="login-button" 
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                        🔓 Login to System
                    </button>
                    
                    <div class="text-center">
                        <button type="button" onclick="showSystemInfo()" 
                                class="text-sm text-gray-500 hover:text-gray-700 underline">
                            System Information
                        </button>
                    </div>
                </form>
                
                <div id="login-error" class="hidden mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p class="text-sm text-red-600"></p>
                </div>
            </div>
        </div>
    `;
    
    // Insert login screen
    document.body.insertAdjacentHTML('afterbegin', loginHTML);
    
    // Focus on password field
    setTimeout(() => {
        const passwordField = document.getElementById('login-password');
        if (passwordField) {
            passwordField.focus();
        }
    }, 100);
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    // Validate username
    if (username !== 'chamomile-inventory') {
        showLoginError('Invalid username. Must be "chamomile-inventory"');
        return;
    }
    
    // No password required - any password (including empty) is accepted
    authenticateUser(username);
}

// Authenticate user
function authenticateUser(username) {
    try {
        authState.isAuthenticated = true;
        authState.username = username;
        authState.loginTime = Date.now();
        
        // Save session
        const sessionData = {
            username: username,
            loginTime: authState.loginTime
        };
        sessionStorage.setItem('tea_inventory_session', JSON.stringify(sessionData));
        
        // Log successful login
        logActivity('Authentication', `User "${username}" logged in successfully`);
        
        // Remove login screen
        const loginOverlay = document.getElementById('login-overlay');
        if (loginOverlay) {
            loginOverlay.style.opacity = '0';
            loginOverlay.style.transition = 'opacity 0.3s ease-out';
            setTimeout(() => {
                if (loginOverlay.parentNode) {
                    loginOverlay.remove();
                }
            }, 300);
        }
        
        // Show success notification
        setTimeout(() => {
            showNotification(`Welcome, ${username}! System ready.`, 'success', 3000);
        }, 500);
        
        // Initialize the main application
        if (typeof initializeApp === 'function') {
            setTimeout(() => {
                initializeApp();
            }, 1000);
        }
        
    } catch (error) {
        console.error('Authentication error:', error);
        showLoginError('Authentication failed. Please try again.');
    }
}

// Show login error
function showLoginError(message) {
    const errorDiv = document.getElementById('login-error');
    if (errorDiv) {
        errorDiv.querySelector('p').textContent = message;
        errorDiv.classList.remove('hidden');
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 5000);
    }
}

// Show system info
function showSystemInfo() {
    alert(`🍃 Chamomile Oatmilk Tea Inventory System v2.0

📍 Location: Kota Kinabalu, Malaysia
🏢 Business Models: M1 (Events) & M2 (Distribution)
🔐 Authentication: Username-based (no password required)
📱 Responsive: Full mobile support
💾 Data: Client-side storage with backup options

Features:
• Advanced batch tracking with 7-day shelf life
• Smart quantity recommendations with historical data
• Dual business model management (Events & Distribution)
• Real-time alerts and expiration monitoring
• Google Sheets integration for analytics
• Complete audit trail and activity logging

Build: ${new Date().toISOString().split('T')[0]}
Browser: ${navigator.userAgent.split(' ')[0]}`);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout? Any unsaved changes will be lost.')) {
        try {
            // Log logout activity
            logActivity('Authentication', `User "${authState.username}" logged out`);
            
            // Clear authentication state
            authState.isAuthenticated = false;
            authState.username = null;
            authState.loginTime = null;
            
            // Clear session storage
            sessionStorage.removeItem('tea_inventory_session');
            
            // Show logout notification
            showNotification('Successfully logged out', 'info', 2000);
            
            // Reload page to show login screen
            setTimeout(() => {
                location.reload();
            }, 2000);
            
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
}

// Check if user is authenticated
function isAuthenticated() {
    return authState.isAuthenticated;
}

// Get current user
function getCurrentUser() {
    return authState.username;
}

// Activity logging functions
function logActivity(category, description, details = null) {
    try {
        const logEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            category: category,
            description: description,
            details: details,
            user: authState.username || 'System',
            sessionId: authState.loginTime || 0
        };
        
        activityLog.unshift(logEntry); // Add to beginning of array
        
        // Keep only last 1000 entries to prevent memory issues
        if (activityLog.length > 1000) {
            activityLog = activityLog.slice(0, 1000);
        }
        
        // Debug log for development
        if (typeof systemState !== 'undefined' && systemState.debugMode) {
            console.log(`[LOG] ${category}: ${description}`, details);
        }
        
    } catch (error) {
        console.error('Error logging activity:', error);
    }
}

// Load activity log tab content
function loadActivityLog() {
    if (!isAuthenticated()) {
        showNotification('Please login to view activity logs', 'warning');
        return;
    }
    
    const logContent = `
        <div class="space-y-6">
            <!-- Log Header -->
            <div class="bg-white p-6 rounded-lg border">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <span class="text-indigo-600 mr-2">📋</span>
                    System Activity Log
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div class="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                        <h4 class="font-medium text-indigo-800 mb-2">Total Entries</h4>
                        <p class="text-2xl font-bold text-indigo-900" id="log-total-count">${activityLog.length}</p>
                        <p class="text-sm text-indigo-700">Since system start</p>
                    </div>
                    
                    <div class="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 class="font-medium text-green-800 mb-2">Current User</h4>
                        <p class="text-lg font-bold text-green-900">${authState.username}</p>
                        <p class="text-sm text-green-700">Logged in: ${new Date(authState.loginTime).toLocaleTimeString()}</p>
                    </div>
                    
                    <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 class="font-medium text-blue-800 mb-2">Session Duration</h4>
                        <p class="text-lg font-bold text-blue-900" id="session-duration">--</p>
                        <p class="text-sm text-blue-700">Active session time</p>
                    </div>
                    
                    <div class="p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <h4 class="font-medium text-orange-800 mb-2">Last Activity</h4>
                        <p class="text-sm font-bold text-orange-900" id="last-activity-time">--</p>
                        <p class="text-sm text-orange-700" id="last-activity-desc">--</p>
                    </div>
                </div>
                
                <!-- Filter Controls -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Filter by Category</label>
                        <select id="log-filter-category" class="w-full p-2 border rounded-lg" onchange="filterActivityLog()">
                            <option value="">All Categories</option>
                            <option value="Authentication">Authentication</option>
                            <option value="Inventory">Inventory</option>
                            <option value="Events">Events</option>
                            <option value="Distribution">Distribution</option>
                            <option value="Settings">Settings</option>
                            <option value="Backup">Backup</option>
                            <option value="System">System</option>
                            <option value="Batch Counters">Batch Counters</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Time Range</label>
                        <select id="log-filter-time" class="w-full p-2 border rounded-lg" onchange="filterActivityLog()">
                            <option value="">All Time</option>
                            <option value="last-hour">Last Hour</option>
                            <option value="last-24h">Last 24 Hours</option>
                            <option value="last-week">Last Week</option>
                            <option value="current-session">Current Session</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Search</label>
                        <input type="text" id="log-search" placeholder="Search descriptions..." 
                               class="w-full p-2 border rounded-lg" onkeyup="filterActivityLog()">
                    </div>
                    
                    <div class="flex items-end space-x-2">
                        <button onclick="exportActivityLog()" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                            📥 Export Log
                        </button>
                        <button onclick="clearActivityLog()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">
                            🗑️ Clear
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Log Table -->
            <div class="bg-white p-6 rounded-lg border">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm border-collapse border border-gray-300">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="border border-gray-300 px-3 py-2 text-left">Timestamp</th>
                                <th class="border border-gray-300 px-3 py-2 text-left">Category</th>
                                <th class="border border-gray-300 px-3 py-2 text-left">Description</th>
                                <th class="border border-gray-300 px-3 py-2 text-left">User</th>
                                <th class="border border-gray-300 px-3 py-2 text-left">Details</th>
                            </tr>
                        </thead>
                        <tbody id="activity-log-table">
                            <!-- Will be populated by JavaScript -->
                        </tbody>
                    </table>
                </div>
                
                <div id="log-pagination" class="mt-4 flex justify-between items-center">
                    <div class="text-sm text-gray-600">
                        Showing <span id="log-showing-count">0</span> entries
                    </div>
                    <div class="space-x-2">
                        <button onclick="loadMoreLogEntries()" id="load-more-btn" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">
                            Load More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Create log tab if it doesn't exist
    const logTab = document.getElementById('tab-log');
    if (!logTab) {
        // Add log tab to navigation
        const nav = document.querySelector('nav');
        if (nav) {
            const logTabButton = document.createElement('button');
            logTabButton.onclick = () => showTab('log');
            logTabButton.id = 'tab-log';
            logTabButton.className = 'flex items-center px-3 py-2 border-b-2 font-medium text-sm tab-inactive';
            logTabButton.innerHTML = `
                <span class="icon">📋</span>
                <span class="ml-2">Activity Log</span>
            `;
            nav.appendChild(logTabButton);
            
            // Create log content div
            const mainContainer = document.querySelector('.max-w-7xl');
            if (mainContainer) {
                const logContentDiv = document.createElement('div');
                logContentDiv.id = 'log-content';
                logContentDiv.className = 'tab-content hidden';
                mainContainer.appendChild(logContentDiv);
            }
        }
    }
    
    // Update log content
    safeUpdateHTML('log-content', logContent);
    
    // Initialize log display
    setTimeout(() => {
        updateLogStats();
        filterActivityLog();
    }, 100);
}

// Update log statistics
function updateLogStats() {
    try {
        // Update session duration
        if (authState.loginTime) {
            const duration = Math.round((Date.now() - authState.loginTime) / 1000 / 60); // minutes
            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;
            const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
            safeUpdateText('session-duration', durationText);
        }
        
        // Update last activity
        if (activityLog.length > 0) {
            const lastActivity = activityLog[0];
            const lastTime = new Date(lastActivity.timestamp).toLocaleTimeString();
            safeUpdateText('last-activity-time', lastTime);
            safeUpdateText('last-activity-desc', lastActivity.description.substring(0, 30) + '...');
        }
        
    } catch (error) {
        console.error('Error updating log stats:', error);
    }
}

// Filter activity log
let currentLogPage = 1;
const logEntriesPerPage = 50;

function filterActivityLog() {
    try {
        const categoryFilter = document.getElementById('log-filter-category')?.value || '';
        const timeFilter = document.getElementById('log-filter-time')?.value || '';
        const searchFilter = document.getElementById('log-search')?.value.toLowerCase() || '';
        
        let filteredLog = activityLog.filter(entry => {
            // Category filter
            if (categoryFilter && entry.category !== categoryFilter) return false;
            
            // Time filter
            if (timeFilter) {
                const entryTime = new Date(entry.timestamp).getTime();
                const now = Date.now();
                
                switch (timeFilter) {
                    case 'last-hour':
                        if (now - entryTime > 60 * 60 * 1000) return false;
                        break;
                    case 'last-24h':
                        if (now - entryTime > 24 * 60 * 60 * 1000) return false;
                        break;
                    case 'last-week':
                        if (now - entryTime > 7 * 24 * 60 * 60 * 1000) return false;
                        break;
                    case 'current-session':
                        if (entry.sessionId !== authState.loginTime) return false;
                        break;
                }
            }
            
            // Search filter
            if (searchFilter && !entry.description.toLowerCase().includes(searchFilter)) return false;
            
            return true;
        });
        
        // Reset pagination
        currentLogPage = 1;
        
        // Display filtered results
        displayLogEntries(filteredLog);
        
    } catch (error) {
        console.error('Error filtering activity log:', error);
    }
}

// Display log entries
function displayLogEntries(logEntries) {
    try {
        const startIndex = 0;
        const endIndex = Math.min(currentLogPage * logEntriesPerPage, logEntries.length);
        const displayEntries = logEntries.slice(startIndex, endIndex);
        
        const tableHtml = displayEntries.map(entry => {
            const categoryColors = {
                'Authentication': 'bg-green-100 text-green-800',
                'Inventory': 'bg-blue-100 text-blue-800',
                'Events': 'bg-purple-100 text-purple-800',
                'Distribution': 'bg-orange-100 text-orange-800',
                'Settings': 'bg-gray-100 text-gray-800',
                'Backup': 'bg-indigo-100 text-indigo-800',
                'System': 'bg-red-100 text-red-800',
                'Batch Counters': 'bg-yellow-100 text-yellow-800'
            };
            
            const categoryClass = categoryColors[entry.category] || 'bg-gray-100 text-gray-800';
            const timestamp = new Date(entry.timestamp).toLocaleString();
            
            return `
                <tr class="hover:bg-gray-50">
                    <td class="border border-gray-300 px-3 py-2 text-xs font-mono">${timestamp}</td>
                    <td class="border border-gray-300 px-3 py-2">
                        <span class="inline-block px-2 py-1 rounded text-xs font-medium ${categoryClass}">
                            ${entry.category}
                        </span>
                    </td>
                    <td class="border border-gray-300 px-3 py-2">${entry.description}</td>
                    <td class="border border-gray-300 px-3 py-2 text-center font-medium">${entry.user}</td>
                    <td class="border border-gray-300 px-3 py-2 text-xs text-gray-600">
                        ${entry.details ? JSON.stringify(entry.details).substring(0, 50) + '...' : '--'}
                    </td>
                </tr>
            `;
        }).join('');
        
        safeUpdateHTML('activity-log-table', tableHtml || '<tr><td colspan="5" class="border border-gray-300 px-3 py-2 text-center text-gray-500">No log entries found</td></tr>');
        
        // Update pagination info
        safeUpdateText('log-showing-count', `${displayEntries.length} of ${logEntries.length}`);
        
        // Update load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            if (endIndex >= logEntries.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'block';
                loadMoreBtn.onclick = () => {
                    currentLogPage++;
                    displayLogEntries(logEntries);
                };
            }
        }
        
    } catch (error) {
        console.error('Error displaying log entries:', error);
    }
}

// Export activity log
function exportActivityLog() {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        let csvContent = `Activity Log Export - Chamomile Oatmilk Tea Inventory System\n`;
        csvContent += `Generated: ${new Date().toLocaleString()}\n`;
        csvContent += `User: ${authState.username}\n`;
        csvContent += `Total Entries: ${activityLog.length}\n\n`;
        
        csvContent += `Timestamp,Category,Description,User,Session ID,Details\n`;
        
        activityLog.forEach(entry => {
            const timestamp = new Date(entry.timestamp).toLocaleString();
            const details = entry.details ? JSON.stringify(entry.details).replace(/"/g, '""') : '';
            csvContent += `"${timestamp}","${entry.category}","${entry.description}","${entry.user}","${entry.sessionId}","${details}"\n`;
        });
        
        downloadCSV(csvContent, `activity_log_${currentDate}.csv`);
        showNotification('Activity log exported successfully!', 'success');
        logActivity('System', 'Activity log exported');
        
    } catch (error) {
        handleError(error, 'activity log export');
    }
}

// Clear activity log
function clearActivityLog() {
    if (confirm('Are you sure you want to clear all activity log entries? This action cannot be undone.')) {
        try {
            const clearedCount = activityLog.length;
            activityLog.length = 0;
            
            logActivity('System', `Activity log cleared (${clearedCount} entries removed)`);
            
            filterActivityLog(); // Refresh display
            updateLogStats();
            
            showNotification(`Cleared ${clearedCount} log entries`, 'success');
            
        } catch (error) {
            handleError(error, 'activity log clear');
        }
    }
}

// Add logout button to header (call this after DOM is loaded)
function addLogoutButton() {
    try {
        const header = document.querySelector('.max-w-7xl .flex.justify-between');
        if (header && isAuthenticated()) {
            const rightDiv = header.querySelector('div:last-child');
            if (rightDiv) {
                const logoutButton = document.createElement('button');
                logoutButton.onclick = logout;
                logoutButton.className = 'ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors';
                logoutButton.innerHTML = '🔒 Logout';
                rightDiv.appendChild(logoutButton);
            }
        }
    } catch (error) {
        console.error('Error adding logout button:', error);
    }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize auth before main app
    if (!initializeAuth()) {
        return; // Stop if not authenticated
    }
    
    // Add logout button and log tab after successful authentication
    setTimeout(() => {
        addLogoutButton();
        loadActivityLog();
    }, 1000);
});

// Override main.js initialization to require authentication
const originalInitializeApp = window.initializeApp;
window.initializeApp = function() {
    if (!isAuthenticated()) {
        console.warn('Attempted to initialize app without authentication');
        return;
    }
    
    logActivity('System', 'Application initialized');
    
    if (originalInitializeApp) {
        originalInitializeApp();
    }
};

// Log system startup
logActivity('System', 'Tea Inventory System started', {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    screenResolution: `${screen.width}x${screen.height}`,
    language: navigator.language
});

// Export authentication functions
window.AuthSystem = {
    initializeAuth,
    isAuthenticated,
    getCurrentUser,
    logout,
    logActivity,
    loadActivityLog,
    showSystemInfo
};