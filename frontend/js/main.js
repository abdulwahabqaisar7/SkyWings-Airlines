
// ========== API CONFIGURATION ==========
const API_BASE_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:3000/api' 
    : '/api';

// Helper function to get auth token
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Update navbar based on login status
function updateNavbar() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    const authNavItem = document.getElementById('authNavItem');
    const navMenu = document.getElementById('navMenu') || document.querySelector('.nav-menu');
    
    if (!navMenu) return;
    
    // Check if this is flight-search page - it has different navigation structure
    const isFlightSearch = window.location.pathname.includes('flight-search');
    
    if (isLoggedIn && userRole === 'user') {
        // User is logged in - update navigation for user portal
        if (isFlightSearch) {
            // For flight-search page, ensure user navigation is shown
            // Remove any guest links
            const homeLink = navMenu.querySelector('a[href="index.html"]:not([onclick*="handleLogout"])');
            if (homeLink) {
                homeLink.parentElement.remove();
            }
            
            const loginLink = navMenu.querySelector('a[href*="login"]');
            if (loginLink) {
                loginLink.parentElement.remove();
            }
            
            // Ensure user menu items exist
            const dashboardLink = navMenu.querySelector('a[href*="user-dashboard"]');
            if (!dashboardLink) {
                const li = document.createElement('li');
                li.innerHTML = '<a href="user-dashboard.html">Dashboard</a>';
                navMenu.insertBefore(li, navMenu.firstChild);
            }
            
            const myBookingsLink = navMenu.querySelector('a[href*="my-bookings"]');
            if (!myBookingsLink) {
                const li = document.createElement('li');
                li.innerHTML = '<a href="my-bookings.html">My Bookings</a>';
                navMenu.appendChild(li);
            }
            
            const checkInLink = navMenu.querySelector('a[href*="check-in"]');
            if (!checkInLink) {
                const li = document.createElement('li');
                li.innerHTML = '<a href="check-in.html">Check-in</a>';
                navMenu.appendChild(li);
            }
            
            const profileLink = navMenu.querySelector('a[href*="user-profile"]');
            if (!profileLink) {
                const li = document.createElement('li');
                li.innerHTML = '<a href="user-profile.html">Profile</a>';
                navMenu.appendChild(li);
            }
            
            // Update logout link
            if (authNavItem) {
                authNavItem.innerHTML = '<a href="index.html" onclick="handleLogout()">Logout</a>';
            } else {
                const logoutLink = navMenu.querySelector('a[onclick*="handleLogout"]');
                if (!logoutLink) {
                    const li = document.createElement('li');
                    li.id = 'authNavItem';
                    li.innerHTML = '<a href="index.html" onclick="handleLogout()">Logout</a>';
                    navMenu.appendChild(li);
                }
            }
        } else {
            // For other pages, use standard update logic
            const loginLink = navMenu.querySelector('a[href*="login"]');
            if (loginLink && !loginLink.onclick) {
                loginLink.parentElement.remove();
            }
            
            const existingDashboard = navMenu.querySelector('a[href*="dashboard"]');
            
            if (authNavItem && !existingDashboard) {
                if (userRole === 'admin') {
                    authNavItem.innerHTML = '<a href="admin-dashboard.html">Dashboard</a>';
                } else {
                    authNavItem.innerHTML = '<a href="user-dashboard.html">Dashboard</a>';
                }
            } else if (authNavItem && existingDashboard) {
                authNavItem.remove();
            } else if (!authNavItem && !existingDashboard) {
                const li = document.createElement('li');
                li.id = 'authNavItem';
                if (userRole === 'admin') {
                    li.innerHTML = '<a href="admin-dashboard.html">Dashboard</a>';
                } else {
                    li.innerHTML = '<a href="user-dashboard.html">Dashboard</a>';
                }
                navMenu.appendChild(li);
            }
            
            const logoutLink = navMenu.querySelector('a[onclick*="handleLogout"]');
            if (!logoutLink) {
                const li = document.createElement('li');
                li.innerHTML = '<a href="index.html" onclick="handleLogout(); return false;">Logout</a>';
                navMenu.appendChild(li);
            }
            
            const signUpLink = navMenu.querySelector('a[href*="register"], a.btn-register');
            if (signUpLink) {
                signUpLink.parentElement.remove();
            }
        }
    } else if (isLoggedIn && userRole === 'admin') {
        // Admin is logged in
        const loginLink = navMenu.querySelector('a[href*="login"]');
        if (loginLink && !loginLink.onclick) {
            loginLink.parentElement.remove();
        }
        
        const existingDashboard = navMenu.querySelector('a[href*="dashboard"]');
        
        if (authNavItem && !existingDashboard) {
            authNavItem.innerHTML = '<a href="admin-dashboard.html">Dashboard</a>';
        } else if (authNavItem && existingDashboard) {
            authNavItem.remove();
        } else if (!authNavItem && !existingDashboard) {
            const li = document.createElement('li');
            li.id = 'authNavItem';
            li.innerHTML = '<a href="admin-dashboard.html">Dashboard</a>';
            navMenu.appendChild(li);
        }
        
        const logoutLink = navMenu.querySelector('a[onclick*="handleLogout"]');
        if (!logoutLink) {
            const li = document.createElement('li');
            li.innerHTML = '<a href="index.html" onclick="handleLogout(); return false;">Logout</a>';
            navMenu.appendChild(li);
        }
    } else {
        // User is not logged in - show login and sign up
        if (isFlightSearch) {
            // For flight-search, show guest navigation
            const dashboardLink = navMenu.querySelector('a[href*="dashboard"]');
            if (dashboardLink) {
                dashboardLink.parentElement.remove();
            }
            
            const myBookingsLink = navMenu.querySelector('a[href*="my-bookings"]');
            if (myBookingsLink) {
                myBookingsLink.parentElement.remove();
            }
            
            const checkInLink = navMenu.querySelector('a[href*="check-in"]');
            if (checkInLink) {
                checkInLink.parentElement.remove();
            }
            
            const profileLink = navMenu.querySelector('a[href*="user-profile"]');
            if (profileLink) {
                profileLink.parentElement.remove();
            }
            
            const logoutLink = navMenu.querySelector('a[onclick*="handleLogout"]');
            if (logoutLink) {
                logoutLink.parentElement.remove();
            }
            
            // Add home link if doesn't exist
            const homeLink = navMenu.querySelector('a[href="index.html"]:not([onclick*="handleLogout"])');
            if (!homeLink) {
                const li = document.createElement('li');
                li.innerHTML = '<a href="index.html">Home</a>';
                navMenu.insertBefore(li, navMenu.firstChild);
            }
            
            // Update auth item
            if (authNavItem) {
                authNavItem.innerHTML = '<a href="login.html" class="btn-login">Login</a>';
            } else {
                const loginExists = navMenu.querySelector('a[href*="login"]');
                if (!loginExists) {
                    const li = document.createElement('li');
                    li.id = 'authNavItem';
                    li.innerHTML = '<a href="login.html" class="btn-login">Login</a>';
                    navMenu.appendChild(li);
                }
            }
        } else {
            // For other pages
            if (authNavItem) {
                authNavItem.innerHTML = '<a href="login.html" class="btn-login">Login</a>';
            } else {
                const loginExists = navMenu.querySelector('a[href*="login"]');
                if (!loginExists) {
                    const li = document.createElement('li');
                    li.id = 'authNavItem';
                    li.innerHTML = '<a href="login.html" class="btn-login">Login</a>';
                    navMenu.appendChild(li);
                }
            }
            
            const signUpExists = navMenu.querySelector('a[href*="register"], a.btn-register');
            if (!signUpExists) {
                const li = document.createElement('li');
                li.innerHTML = '<a href="register.html" class="btn-register">Sign Up</a>';
                navMenu.appendChild(li);
            }
        }
    }
}

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`API Request: ${options.method || 'GET'} ${url}`);
    if (options.body) {
        console.log('Request body:', options.body);
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        console.log(`API Response status: ${response.status} ${response.statusText}`);

        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.error('Non-JSON response:', text);
            throw new Error('Server returned non-JSON response');
        }
        
        console.log('API Response data:', data);
        
        if (!response.ok) {
            // Handle authentication errors - don't clear auth data for check-in or bookings endpoints unless it's a real auth failure
            if (response.status === 401 || response.status === 403) {
                // Check if this is a check-in or bookings endpoint - if so, provide better error message without clearing session
                if (endpoint.includes('/checkin') || endpoint.includes('/bookings')) {
                    const errorMsg = data.message || 'Authentication required';
                    throw new Error(errorMsg);
                }
                // For other endpoints, clear auth data on auth failure only if token is explicitly invalid
                if (data.message && (data.message.includes('invalid token') || data.message.includes('token expired') || data.message.includes('unauthorized'))) {
                    // Don't auto-redirect - let the calling function handle it
                    throw new Error(data.message || 'Your session has expired. Please login again.');
                }
            }
            
            // For check-in endpoints, if the error is "Already checked in", return the data instead of throwing
            // This allows the calling function to handle it gracefully without redirecting to login
            if (endpoint.includes('/checkin') && response.status === 400 && 
                data.message && (data.message.includes('Already checked in') || data.message.includes('already checked in'))) {
                // Return the response data so the calling function can handle "already checked in" case
                return data;
            }
            
            // Handle validation errors
            if (data.errors && Array.isArray(data.errors)) {
                const errorMessages = data.errors.map(err => err.msg || err.message).join(', ');
                throw new Error(errorMessages || data.message || 'Request failed');
            }
            throw new Error(data.message || `Request failed with status ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API request error:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            endpoint: url,
            method: options.method || 'GET'
        });
        if (error.message) {
            throw error;
        }
        throw new Error('Network error. Please check your connection and server status.');
    }
}

// ========== AUTHENTICATION CHECK ==========

/**
 * Check if user is authenticated
 * @param {string} requiredRole - 'user', 'admin', or null for any authenticated user
 * @returns {boolean} - true if authenticated, false otherwise
 */
// Token validation flag to prevent multiple simultaneous checks
let tokenValidationInProgress = false;
let lastTokenValidation = 0;
const TOKEN_VALIDATION_CACHE_TIME = 60000; // 1 minute cache

function checkAuthentication(requiredRole = null) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    const token = getAuthToken();
    
    // Debug logging
    console.log('checkAuthentication called:', { 
        requiredRole, 
        isLoggedIn, 
        userRole, 
        hasToken: !!token 
    });
    
    // Check if logged in and has token
    if (!isLoggedIn || isLoggedIn !== 'true' || !token) {
        console.warn('Authentication check failed: Missing credentials', {
            isLoggedIn,
            hasToken: !!token
        });
        // Only clear if we have inconsistent state (logged in flag but no token)
        if (isLoggedIn === 'true' && !token) {
            console.warn('Inconsistent state: isLoggedIn=true but no token, clearing');
            clearAuthData();
        }
        return false;
    }
    
    // Validate token with server periodically (not on every check to avoid excessive API calls)
    const now = Date.now();
    if (!tokenValidationInProgress && typeof window !== 'undefined' && 
        (now - lastTokenValidation > TOKEN_VALIDATION_CACHE_TIME)) {
        // Set a flag to prevent multiple simultaneous validations
        tokenValidationInProgress = true;
        lastTokenValidation = now;
        
        // Use a promise to handle async validation without blocking
        apiRequest('/auth/check').then(response => {
            if (!response.success || !response.data) {
                // Token is invalid, clear auth data
                clearAuthData();
                tokenValidationInProgress = false;
                return;
            }
            // Update user data if needed
            if (response.data.user) {
                localStorage.setItem('userRole', response.data.user.role || userRole);
                localStorage.setItem('userId', response.data.user.userId || localStorage.getItem('userId'));
                localStorage.setItem('userName', `${response.data.user.firstName || ''} ${response.data.user.lastName || ''}`.trim() || localStorage.getItem('userName'));
            }
            tokenValidationInProgress = false;
        }).catch(error => {
            // Only clear auth data if it's an authentication error (401/403)
            // Network errors or temporary issues shouldn't clear the session during navigation
            const errorMsg = (error.message || '').toLowerCase();
            if (errorMsg.includes('401') || errorMsg.includes('403') || errorMsg.includes('unauthorized') || errorMsg.includes('invalid token') || errorMsg.includes('token expired')) {
                console.error('Token validation failed: Authentication error - clearing session');
                clearAuthData();
            } else {
                console.warn('Token validation failed (non-auth error, keeping session):', error.message);
                // Don't clear auth data on network errors - session persists during navigation
                // This allows users to navigate between pages even if server is temporarily unavailable
            }
            tokenValidationInProgress = false;
        });
    }
    
    // Check role if required
    if (requiredRole && userRole !== requiredRole) {
        console.warn(`Role mismatch: required ${requiredRole}, got ${userRole}`);
        return false;
    }
    
    // Return true if we have valid token and role matches
    // Token validation runs in background and doesn't block this check
    return true;
}

// Helper function to clear all authentication data
function clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('redirectAfterLogin');
    localStorage.removeItem('pendingFlightBooking');
}

/**
 * Require authentication before accessing page
 * Redirects to login if not authenticated
 * @param {string} requiredRole - 'user', 'admin', or null for any authenticated user
 */
function requireAuth(requiredRole = null) {
    const authResult = checkAuthentication(requiredRole);
    
    if (!authResult) {
        console.log('requireAuth: Authentication failed, redirecting to login');
        console.log('Required role:', requiredRole);
        console.log('Current auth state:', {
            token: getAuthToken() ? 'exists' : 'missing',
            role: localStorage.getItem('userRole'),
            isLoggedIn: localStorage.getItem('isLoggedIn')
        });
        
        // Store the current page to redirect back after login
        const currentPage = window.location.pathname.split('/').pop() || window.location.pathname;
        localStorage.setItem('redirectAfterLogin', currentPage);
        
        // Redirect to login
        window.location.href = 'login.html';
        return false;
    }
    
    console.log('requireAuth: Authentication passed');
    return true;
}

// Session management: 
// - Session persists during navigation between pages (tabs/links)
// - Session only clears on explicit logout or when browser/tab is closed
// Note: We removed beforeunload/unload handlers because they fire on navigation too
// Session will persist while user navigates, which is the desired behavior

// Handle window close - logout user when window/tab is actually closed
// Use a flag to track navigation vs actual close
let isNavigating = false;

// Track when user clicks on internal links (navigation within site)
document.addEventListener('click', function(event) {
    const link = event.target.closest('a');
    if (link && link.href && link.href.startsWith(window.location.origin)) {
        isNavigating = true;
        // Reset flag after a short delay to allow navigation
        setTimeout(() => {
            isNavigating = false;
        }, 100);
    }
});

// Track form submissions (like login) as navigation
document.addEventListener('submit', function() {
    isNavigating = true;
    setTimeout(() => {
        isNavigating = false;
    }, 100);
});

// Only clear auth data on actual window/tab close, not navigation
window.addEventListener('beforeunload', function(event) {
    // Don't clear if we're navigating within the site
    if (!isNavigating) {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            // Set a flag that we're closing
            sessionStorage.setItem('windowClosing', 'true');
        }
    }
});

// Clear auth data only if window is actually closing (not navigating)
window.addEventListener('unload', function() {
    const isClosing = sessionStorage.getItem('windowClosing') === 'true';
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // Only clear if we're actually closing (not navigating) and user is logged in
    if (isClosing && isLoggedIn && !isNavigating) {
        clearAuthData();
    }
    
    // Clean up the flag
    sessionStorage.removeItem('windowClosing');
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication for protected pages
    const currentPath = window.location.pathname.toLowerCase();
    const currentFile = currentPath.split('/').pop() || currentPath;
    const currentHref = window.location.href.toLowerCase();
    
    // REMOVED AUTO-LOGIN: No automatic redirect from login/register pages
    // Users must manually log in every time
    // Only clear auth data on login/register page load if there's no token
    // This prevents clearing data right after successful login
    if (currentFile === 'login.html' || currentFile === 'register.html' || 
        currentHref.includes('login.html') || currentHref.includes('register.html')) {
        const token = getAuthToken();
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        // If user has token and is marked as logged in, redirect them (they shouldn't be on login page)
        if (token && isLoggedIn === 'true') {
            const userRole = localStorage.getItem('userRole');
            if (userRole === 'admin') {
                window.location.replace('admin-dashboard.html');
            } else {
                window.location.replace('user-dashboard.html');
            }
            return;
        }
        
        // No token means user hasn't logged in, clear any stale data
        // BUT: Don't clear if user just logged in (token might not be set yet during redirect)
        if (!token && isLoggedIn !== 'true') {
            clearAuthData();
        }
    }
    
    // Admin pages - require admin role
    if (currentFile.includes('admin-') || currentHref.includes('admin-') ||
        currentFile === 'admin-dashboard.html' || currentHref.includes('admin-dashboard') ||
        currentFile === 'admin-management.html' || currentHref.includes('admin-management') ||
        currentFile === 'admin-reports.html' || currentHref.includes('admin-reports')) {
        if (!requireAuth('admin')) {
            return; // Stop execution if not authenticated
        }
    }
    
    // User pages - require user authentication
    if (currentFile.includes('user-') || currentHref.includes('user-') ||
        currentFile === 'my-bookings.html' || currentHref.includes('my-bookings') ||
        currentFile === 'check-in.html' || currentHref.includes('check-in') ||
        currentFile === 'user-dashboard.html' || currentHref.includes('user-dashboard') ||
        currentFile === 'user-profile.html' || currentHref.includes('user-profile') ||
        currentFile === 'flight-search.html' || currentHref.includes('flight-search')) {
        // For flight-search, check if user is logged in, but don't require it (allow guest access)
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userRole = localStorage.getItem('userRole');
        
        if (currentFile === 'flight-search.html' || currentHref.includes('flight-search')) {
            // Allow guest access but update navbar based on auth status
            updateNavbar();
        } else {
            // Other user pages require authentication
            if (!requireAuth('user')) {
                return; // Stop execution if not authenticated
            }
        }
    }
    
    // Toggle advertisement/search sections based on login status (for index.html)
    // NO AUTO-LOGIN: Only check if user is currently logged in, don't auto-login
    if (currentFile === 'index.html' || currentFile === '' || currentHref.includes('index.html') || currentHref.endsWith('/')) {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const token = getAuthToken();
        const airlineAd = document.getElementById('airlineAd');
        const quickSearch = document.getElementById('quickSearch');
        
        // Only show logged-in UI if both flag and token exist (manual login only)
        if (isLoggedIn === 'true' && token) {
            // User is logged in - show search, hide ad
            if (airlineAd) airlineAd.style.display = 'none';
            if (quickSearch) quickSearch.style.display = 'block';
        } else {
            // Guest - show ad, hide search
            if (airlineAd) airlineAd.style.display = 'block';
            if (quickSearch) quickSearch.style.display = 'none';
        }
    }

    // Set minimum date to today for flight dates, max date for DOB
    const dateInputs = document.querySelectorAll('input[type="date"]');//Selects all date elements there and returns a node list
    const datetimeInputs = document.querySelectorAll('input[type="datetime-local"]');//Selects all datetime-local elements
    const today = new Date().toISOString().split('T')[0];//Split date to YYYY-MM-DD
    const maxDate = '2100-12-31'; // Maximum year 2100 (4 digits)
    const maxDob = new Date();
    maxDob.setFullYear(maxDob.getFullYear() - 18);
    const maxDobStr = maxDob.toISOString().split('T')[0];
    const minDob = '1900-01-01'; // Minimum year 1900 (4 digits)
    
    dateInputs.forEach(input => {//Iterate through each date
        if (input.name === 'departure' || input.name === 'return') {//set minimum date to today so no past dates can be selected
            input.setAttribute('min', today);
            input.setAttribute('max', maxDate);
        } else if (input.name === 'dob' || input.name.includes('dob')) {
            input.setAttribute('max', maxDobStr);
            input.setAttribute('min', minDob);
        } else {
            // For other date inputs, set max to prevent years beyond 4 digits
            input.setAttribute('max', maxDate);
        }
        
        // Add calendar synchronization to validate month-specific days
        // Store previous valid date parts to restore if needed
        let previousValidDate = null;
        let lastInputValue = input.value || '';
        
        // Handle input event to preserve day when year or month changes
        input.addEventListener('input', function() {
            const currentValue = this.value;
            
            // If we have a previous valid date and current value is being edited
            if (previousValidDate && currentValue) {
                const parts = currentValue.split('-');
                
                // Need at least year and month parts to validate
                if (parts.length >= 2 && parts[0] && parts[1]) {
                    const newYear = parseInt(parts[0]);
                    const newMonth = parseInt(parts[1]);
                    
                    // Check if year or month changed
                    const yearChanged = !isNaN(newYear) && newYear !== previousValidDate.year;
                    const monthChanged = !isNaN(newMonth) && newMonth >= 1 && newMonth <= 12 && newMonth !== previousValidDate.month;
                    
                    if (yearChanged || monthChanged) {
                        // Use new year and month
                        const year = !isNaN(newYear) && newYear > 0 ? newYear : previousValidDate.year;
                        const month = !isNaN(newMonth) && newMonth >= 1 && newMonth <= 12 ? newMonth : previousValidDate.month;
                        
                        // Preserve day from previous valid date (don't use browser's auto-filled day)
                        let day = previousValidDate.day;
                        
                        // Only use new day if it's explicitly provided and different from previous
                        // This prevents browser from auto-setting to 31 when month changes
                        if (parts.length >= 3 && parts[2]) {
                            const newDay = parseInt(parts[2]);
                            // Only use new day if it's valid and user explicitly typed it
                            // If it's 31 and month changed to a month with fewer days, ignore it
                            if (!isNaN(newDay) && newDay >= 1 && newDay <= 31) {
                                const maxDays = getDaysInMonth(year, month - 1);
                                // Only use the new day if it's valid for the new month
                                if (newDay <= maxDays) {
                                    day = newDay;
                                }
                            }
                        }
                        
                        // Check if day is valid for the new year/month
                        const maxDays = getDaysInMonth(year, month - 1);
                        if (day > maxDays) {
                            // Adjust to max days for that month
                            day = maxDays;
                        }
                        
                        // Update the input value preserving day
                        const correctedDate = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        if (correctedDate !== currentValue) {
                            this.value = correctedDate;
                            previousValidDate = { year: year, month: month, day: day };
                        }
                    }
                }
            }
            
            lastInputValue = currentValue;
        });
        
        input.addEventListener('change', function() {
            const result = validateCalendarDate(this, previousValidDate);
            if (result && result.valid) {
                previousValidDate = result.dateParts;
                lastInputValue = this.value;
            }
        });
        
        // Use 'blur' event to validate when user finishes with the field
        // This preserves month/day when user is editing year manually
        input.addEventListener('blur', function() {
            if (this.value) {
                const result = validateCalendarDate(this, previousValidDate);
                if (result && result.valid) {
                    previousValidDate = result.dateParts;
                    lastInputValue = this.value;
                }
            }
        });
        
        // Store initial value if it exists
        if (input.value) {
            const parts = input.value.split('-');
            if (parts.length === 3) {
                const [y, m, d] = parts.map(Number);
                if (y && m && d && !isNaN(y) && !isNaN(m) && !isNaN(d)) {
                    previousValidDate = { year: y, month: m, day: d };
                    lastInputValue = input.value;
                }
            }
        }
    });
    
    // Set max for datetime-local inputs to prevent years beyond 4 digits
    datetimeInputs.forEach(input => {
        input.setAttribute('max', '2100-12-31T23:59');
        
        // Add calendar synchronization for datetime-local inputs
        // Store previous valid date parts to restore if needed
        let previousValidDateTime = null;
        let lastInputValue = input.value || '';
        
        // Handle input event to preserve day when year or month changes
        input.addEventListener('input', function() {
            const currentValue = this.value;
            
            // If we have a previous valid date and current value is being edited
            if (previousValidDateTime && currentValue) {
                const [datePart, timePart] = currentValue.split('T');
                const time = timePart || '00:00';
                
                if (datePart) {
                    const parts = datePart.split('-');
                    
                    // Need at least year and month parts to validate
                    if (parts.length >= 2 && parts[0] && parts[1]) {
                        const newYear = parseInt(parts[0]);
                        const newMonth = parseInt(parts[1]);
                        
                        // Check if year or month changed
                        const yearChanged = !isNaN(newYear) && newYear !== previousValidDateTime.year;
                        const monthChanged = !isNaN(newMonth) && newMonth >= 1 && newMonth <= 12 && newMonth !== previousValidDateTime.month;
                        
                        if (yearChanged || monthChanged) {
                            // Use new year and month
                            const year = !isNaN(newYear) && newYear > 0 ? newYear : previousValidDateTime.year;
                            const month = !isNaN(newMonth) && newMonth >= 1 && newMonth <= 12 ? newMonth : previousValidDateTime.month;
                            
                            // Preserve day from previous valid date (don't use browser's auto-filled day)
                            let day = previousValidDateTime.day;
                            
                            // Only use new day if it's explicitly provided and valid
                            // This prevents browser from auto-setting to 31 when month changes
                            if (parts.length >= 3 && parts[2]) {
                                const newDay = parseInt(parts[2]);
                                // Only use new day if it's valid and user explicitly typed it
                                // If it's 31 and month changed to a month with fewer days, ignore it
                                if (!isNaN(newDay) && newDay >= 1 && newDay <= 31) {
                                    const maxDays = getDaysInMonth(year, month - 1);
                                    // Only use the new day if it's valid for the new month
                                    if (newDay <= maxDays) {
                                        day = newDay;
                                    }
                                }
                            }
                            
                            // Check if day is valid for the new year/month
                            const maxDays = getDaysInMonth(year, month - 1);
                            if (day > maxDays) {
                                // Adjust to max days for that month
                                day = maxDays;
                            }
                            
                            // Update the input value preserving day
                            const correctedDateTime = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${time}`;
                            if (correctedDateTime !== currentValue) {
                                this.value = correctedDateTime;
                                previousValidDateTime = { year: year, month: month, day: day };
                            }
                        }
                    }
                }
            }
            
            lastInputValue = currentValue;
        });
        
        input.addEventListener('change', function() {
            const result = validateCalendarDateTime(this, previousValidDateTime);
            if (result && result.valid) {
                previousValidDateTime = result.dateParts;
                lastInputValue = this.value;
            }
        });
        
        // Use 'blur' event to validate when user finishes with the field
        // This preserves month/day when user is editing year manually
        input.addEventListener('blur', function() {
            if (this.value) {
                const result = validateCalendarDateTime(this, previousValidDateTime);
                if (result && result.valid) {
                    previousValidDateTime = result.dateParts;
                    lastInputValue = this.value;
                }
            }
        });
        
        // Store initial value if it exists
        if (input.value) {
            const [datePart] = input.value.split('T');
            if (datePart) {
                const parts = datePart.split('-');
                if (parts.length === 3) {
                    const [y, m, d] = parts.map(Number);
                    if (y && m && d && !isNaN(y) && !isNaN(m) && !isNaN(d)) {
                        previousValidDateTime = { year: y, month: m, day: d };
                        lastInputValue = input.value;
                    }
                }
            }
        }
    });

    // Hamburger menu toggle - Enhanced for all screen sizes
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (navMenu.classList.contains('active')) {
                if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
        
        // Close menu on window resize if screen becomes large
        window.addEventListener('resize', function() {
            if (window.innerWidth > 1024) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Load dashboard data if on dashboard page
    if (window.location.pathname.includes('dashboard')) {
        loadDashboardData();
        if (window.location.pathname.includes('user-dashboard')) {
            loadUserDashboardData();
        } else if (window.location.pathname.includes('admin-dashboard')) {
            loadAdminDashboard();
        }
    }
    
    // Update navbar based on login status
    updateNavbar();
    
    // Set user name from localStorage
    const userName = localStorage.getItem('userName');
    
    // Load user profile if on profile page
    if (currentFile === 'user-profile.html' || currentHref.includes('user-profile')) {
        loadUserProfile();
    }
    if (userName) {
        const userNameEl = document.getElementById('userName');
        if (userNameEl) userNameEl.textContent = userName;
    }

    // Check-in page initialization - require authentication
    if (window.location.pathname.includes('check-in')) {
        // Check authentication status directly without strict validation
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const token = getAuthToken();
        const userRole = localStorage.getItem('userRole');
        
        // Only redirect if user is clearly not logged in
        if (!isLoggedIn || !token) {
            // Store redirect destination
            const currentPage = window.location.pathname.split('/').pop() || window.location.pathname;
            const queryString = window.location.search;
            localStorage.setItem('redirectAfterLogin', currentPage + queryString);
            // Redirect to login
            window.location.href = 'login.html';
            return;
        }
        
        // If user has wrong role, still allow but log warning
        if (userRole !== 'user') {
            console.warn('Check-in page accessed by non-user role:', userRole);
        }
        
        // User appears to be authenticated, proceed with check-in page
        // Don't use requireAuth here as it might trigger token validation that fails
        loadBookingForCheckIn();
    }

    // My bookings page - require authentication
    if (window.location.pathname.includes('my-bookings')) {
        if (!requireAuth('user')) {
            return; // Redirected to login
        }
        // Load bookings after a short delay to ensure DOM is ready
        setTimeout(() => {
            filterBookings('all', 'user');
        }, 100);
    }

    if (window.location.pathname.includes('admin-management')) {
        // Load flights immediately since flights tab is visible by default
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            if (typeof loadAdminFlights === 'function') {
                loadAdminFlights(1, '');
            }
        });
    }

    if (window.location.pathname.includes('admin-reports')) {
        // Load overview report by default
        setTimeout(() => {
            console.log('Loading admin reports...');
            loadOverviewReport();
        }, 300);
    }
});

// ========== AUTHENTICATION ==========

// Demo Credentials:
// Admin: admin@skywings.com / admin123
// User: user@skywings.com / user123

async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email')?.trim();
    const password = formData.get('password');
    
    // Clear previous errors
    clearFormErrors(form);
    
    // Validation
    let hasErrors = false;
    
    if (!email) {
        showFieldError(form, 'email', 'Email is required');
        hasErrors = true;
    } else if (!isValidEmail(email)) {
        showFieldError(form, 'email', 'Please enter a valid email address');
        hasErrors = true;
    }
    
    if (!password) {
        showFieldError(form, 'password', 'Password is required');
        hasErrors = true;
    } else if (password.length < 6) {
        showFieldError(form, 'password', 'Password must be at least 6 characters');
        hasErrors = true;
    }
    
    if (hasErrors) {
        return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';
    
    try {
        console.log('Attempting login for:', email);
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        console.log('Login API response:', response);

        // Validate response structure
        if (!response) {
            throw new Error('No response from server');
        }

        if (!response.success) {
            throw new Error(response.message || 'Login failed');
        }

        if (!response.data) {
            throw new Error('Invalid response data from server');
        }

        if (!response.data.user) {
            throw new Error('User data not found in response');
        }

        if (!response.data.token) {
            throw new Error('Authentication token not received');
        }

        // Store authentication data
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userRole', response.data.user.role);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', response.data.user.userId);
        localStorage.setItem('userName', `${response.data.user.firstName} ${response.data.user.lastName}`);
        
        console.log('Auth data stored, redirecting...');
        console.log('User role:', response.data.user.role);
        
        // Get redirect destination if exists
        const redirectTo = localStorage.getItem('redirectAfterLogin');
        localStorage.removeItem('redirectAfterLogin');
        
        // Determine redirect URL based on role
        let redirectUrl;
        if (response.data.user.role === 'admin') {
            redirectUrl = (redirectTo && redirectTo.includes('admin')) ? redirectTo : 'admin-dashboard.html';
        } else {
            redirectUrl = (redirectTo && !redirectTo.includes('admin')) ? redirectTo : 'user-dashboard.html';
        }
        
        console.log('Redirecting to:', redirectUrl);
        
        // Set flag to prevent clearing auth data during redirect
        isRedirecting = true;
        isNavigating = true; // Mark as navigation to prevent logout on redirect
        
        // Force immediate redirect (use replace to prevent back button issues)
        // Redirect immediately - localStorage is synchronous so data is already saved
        window.location.replace(redirectUrl);
        
    } catch (error) {
        console.error('Login error details:', error);
        let errorMessage = 'Login failed. Please check your credentials.';
        
        // Extract error message from various error formats
        if (error.message) {
            errorMessage = error.message;
        }
        
        // Check if it's a validation error with array
        if (error.errors && Array.isArray(error.errors)) {
            errorMessage = error.errors.map(e => e.msg || e.message).join(', ');
        }
        
        // Show error to user
        alert('Login Error: ' + errorMessage); // Show alert for debugging
        showFormError(form, errorMessage);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const firstName = formData.get('firstName')?.trim();
    const lastName = formData.get('lastName')?.trim();
    const email = formData.get('email')?.trim();
    const phone = formData.get('phone')?.trim();
    const dob = formData.get('dob');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const terms = formData.get('terms');
    
    // Clear previous errors
    clearFormErrors(form);
    
    // Validation
    let hasErrors = false;
    
    if (!firstName || firstName.length < 2) {
        showFieldError(form, 'firstName', 'First name must be at least 2 characters');
        hasErrors = true;
    } else if (!/^[a-zA-Z\s'-]+$/.test(firstName)) {
        showFieldError(form, 'firstName', 'First name can only contain letters, spaces, hyphens, and apostrophes');
        hasErrors = true;
    }
    
    if (!lastName || lastName.length < 2) {
        showFieldError(form, 'lastName', 'Last name must be at least 2 characters');
        hasErrors = true;
    } else if (!/^[a-zA-Z\s'-]+$/.test(lastName)) {
        showFieldError(form, 'lastName', 'Last name can only contain letters, spaces, hyphens, and apostrophes');
        hasErrors = true;
    }
    
    if (!email) {
        showFieldError(form, 'email', 'Email is required');
        hasErrors = true;
    } else if (!isValidEmail(email)) {
        showFieldError(form, 'email', 'Please enter a valid email address');
        hasErrors = true;
    }
    
    if (!phone) {
        showFieldError(form, 'phone', 'Phone number is required');
        hasErrors = true;
    } else if (!isValidPhone(phone)) {
        showFieldError(form, 'phone', 'Please enter a valid phone number');
        hasErrors = true;
    }
    
    if (!dob) {
        showFieldError(form, 'dob', 'Date of birth is required');
        hasErrors = true;
    } else if (!isValidDateOfBirth(dob)) {
        showFieldError(form, 'dob', 'Please enter a valid date of birth (must be at least 18 years old and not in the future)');
        hasErrors = true;
    }
    
    if (!password) {
        showFieldError(form, 'password', 'Password is required');
        hasErrors = true;
    } else if (password.length < 6) {
        showFieldError(form, 'password', 'Password must be at least 6 characters long');
        hasErrors = true;
    } else {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        
        if (!hasUpperCase || !hasLowerCase || !hasNumber) {
            showFieldError(form, 'password', 'Password must contain at least one uppercase letter, one lowercase letter, and one number');
            hasErrors = true;
        }
    }
    
    if (!confirmPassword) {
        showFieldError(form, 'confirmPassword', 'Please confirm your password');
        hasErrors = true;
    } else if (password !== confirmPassword) {
        showFieldError(form, 'confirmPassword', 'Passwords do not match');
        hasErrors = true;
    }
    
    if (!terms) {
        showFieldError(form, 'terms', 'You must agree to the Terms & Conditions');
        hasErrors = true;
    }
    
    if (hasErrors) {
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
    
    try {
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
                phone: phone || null,
                dob: dob || null,
                address: null
            })
        });

        if (response.success) {
            // Only auto-login if token is explicitly provided in response
            if (response.data && response.data.token && response.data.userId) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('userRole', 'user');
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('userName', `${firstName} ${lastName}`);
                
                // Update navbar
                updateNavbar();
                
                // Redirect to dashboard immediately
                window.location.href = 'user-dashboard.html';
            } else {
                // No auto-login - redirect to login page
                alert('Registration successful! Please login to continue.');
                window.location.href = 'login.html';
            }
        } else {
            throw new Error(response.message || 'Registration failed');
        }
    } catch (error) {
        let errorMessage = 'Registration failed. Please try again.';
        if (error.message) {
            errorMessage = error.message;
        }
        if (error.response && error.response.message) {
            errorMessage = error.response.message;
        }
        if (error.response && error.response.errors && error.response.errors.length > 0) {
            error.response.errors.forEach(err => {
                showFieldError(form, err.param || 'general', err.msg || errorMessage);
            });
        } else {
            showFormError(form, errorMessage);
        }
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Helper functions for validation and error display
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,20}$/;
    return phoneRegex.test(phone);
}

// Get maximum days in a month (handles leap years)
function getDaysInMonth(year, month) {
    // month is 0-indexed (0 = January, 11 = December)
    return new Date(year, month + 1, 0).getDate();
}

// Validate calendar date to ensure month-specific day limits
// Returns object with validation result and date parts for restoration if needed
function validateCalendarDate(dateInput, previousValidDate = null) {
    if (!dateInput.value) {
        // If value is cleared but we have previous valid date, restore it
        if (previousValidDate) {
            const restoredDate = `${String(previousValidDate.year).padStart(4, '0')}-${String(previousValidDate.month).padStart(2, '0')}-${String(previousValidDate.day).padStart(2, '0')}`;
            dateInput.value = restoredDate;
            return { valid: true, dateParts: previousValidDate };
        }
        return null;
    }
    
    const dateValue = dateInput.value.trim(); // Format: YYYY-MM-DD
    
    // If date is incomplete, try to restore from previous valid date
    if (!dateValue || dateValue.length < 10) {
        if (previousValidDate) {
            // Try to parse what we have and merge with previous
            const parts = dateValue.split('-');
            let year = previousValidDate.year;
            let month = previousValidDate.month;
            let day = previousValidDate.day;
            
            if (parts.length >= 1 && parts[0]) {
                const y = parseInt(parts[0]);
                if (!isNaN(y) && y > 0) year = y;
            }
            if (parts.length >= 2 && parts[1]) {
                const m = parseInt(parts[1]);
                if (!isNaN(m) && m >= 1 && m <= 12) month = m;
            }
            if (parts.length >= 3 && parts[2]) {
                const d = parseInt(parts[2]);
                if (!isNaN(d) && d >= 1 && d <= 31) day = d;
            }
            
            const restoredDate = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dateInput.value = restoredDate;
            return { valid: true, dateParts: { year, month, day } };
        }
        return null; // Incomplete date, don't validate yet
    }
    
    const parts = dateValue.split('-');
    if (parts.length !== 3) {
        // Invalid format, try to restore from previous
        if (previousValidDate) {
            const restoredDate = `${String(previousValidDate.year).padStart(4, '0')}-${String(previousValidDate.month).padStart(2, '0')}-${String(previousValidDate.day).padStart(2, '0')}`;
            dateInput.value = restoredDate;
            return { valid: true, dateParts: previousValidDate };
        }
        return null; // Invalid format, don't validate
    }
    
    let year = parseInt(parts[0]);
    let month = parseInt(parts[1]);
    let day = parseInt(parts[2]);
    
    // If any part is invalid, try to use previous valid values
    if (isNaN(year) || year <= 0) {
        if (previousValidDate) year = previousValidDate.year;
        else return null;
    }
    if (isNaN(month) || month < 1 || month > 12) {
        if (previousValidDate) month = previousValidDate.month;
        else return null;
    }
    if (isNaN(day) || day < 1 || day > 31) {
        if (previousValidDate) day = previousValidDate.day;
        else return null;
    }
    
    // Check year doesn't exceed 4 digits (2100 max)
    if (year > 2100) {
        year = 2100;
    }
    
    // Get maximum days for the selected month/year
    const maxDays = getDaysInMonth(year, month - 1); // month is 1-indexed in input
    
    // Only adjust day if it exceeds maximum days for the month
    // Preserve the day if it's valid, even if year changed
    if (day > maxDays) {
        // Only adjust if day is truly invalid (e.g., Feb 30 or Feb 29 in non-leap year)
        const dateObj = new Date(year, month - 1, day);
        if (dateObj.getFullYear() !== year || dateObj.getMonth() !== month - 1 || dateObj.getDate() !== day) {
            // Date is invalid, adjust to max days
            day = maxDays;
            
            // Show a subtle notification only if we had to adjust
            const formGroup = dateInput.closest('.form-group');
            if (formGroup) {
                let notice = formGroup.querySelector('.date-notice');
                if (!notice) {
                    notice = document.createElement('small');
                    notice.className = 'date-notice';
                    notice.style.cssText = 'color: #f59e0b; font-size: 0.85rem; margin-top: 0.25rem; display: block;';
                    dateInput.parentNode.appendChild(notice);
                }
                const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                                  'July', 'August', 'September', 'October', 'November', 'December'];
                notice.textContent = `Adjusted to ${maxDays} days (maximum for ${monthNames[month - 1]} ${year})`;
                
                // Clear notice after 3 seconds
                setTimeout(() => {
                    if (notice) notice.textContent = '';
                }, 3000);
            }
        }
    }
    
    // Set the corrected date
    const correctedDate = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    dateInput.value = correctedDate;
    
    return { valid: true, dateParts: { year, month, day } };
}

// Validate datetime-local input
// Returns object with validation result and date parts for restoration if needed
function validateCalendarDateTime(dateTimeInput, previousValidDateTime = null) {
    if (!dateTimeInput.value) {
        // If value is cleared but we have previous valid date, restore it
        if (previousValidDateTime) {
            const timePart = dateTimeInput.value.includes('T') ? dateTimeInput.value.split('T')[1] : '00:00';
            const restoredDateTime = `${String(previousValidDateTime.year).padStart(4, '0')}-${String(previousValidDateTime.month).padStart(2, '0')}-${String(previousValidDateTime.day).padStart(2, '0')}T${timePart}`;
            dateTimeInput.value = restoredDateTime;
            return { valid: true, dateParts: previousValidDateTime };
        }
        return null;
    }
    
    const dateTimeValue = dateTimeInput.value.trim(); // Format: YYYY-MM-DDTHH:mm
    
    // If datetime is incomplete, try to restore from previous valid date
    if (!dateTimeValue || dateTimeValue.length < 16) {
        if (previousValidDateTime) {
            const [datePart, timePart] = dateTimeValue.split('T');
            const time = timePart || '00:00';
            
            // Try to parse what we have and merge with previous
            let year = previousValidDateTime.year;
            let month = previousValidDateTime.month;
            let day = previousValidDateTime.day;
            
            if (datePart) {
                const parts = datePart.split('-');
                if (parts.length >= 1 && parts[0]) {
                    const y = parseInt(parts[0]);
                    if (!isNaN(y) && y > 0) year = y;
                }
                if (parts.length >= 2 && parts[1]) {
                    const m = parseInt(parts[1]);
                    if (!isNaN(m) && m >= 1 && m <= 12) month = m;
                }
                if (parts.length >= 3 && parts[2]) {
                    const d = parseInt(parts[2]);
                    if (!isNaN(d) && d >= 1 && d <= 31) day = d;
                }
            }
            
            const restoredDateTime = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${time}`;
            dateTimeInput.value = restoredDateTime;
            return { valid: true, dateParts: { year, month, day } };
        }
        return null; // Incomplete datetime, don't validate yet
    }
    
    const [datePart, timePart] = dateTimeValue.split('T');
    
    if (!datePart || datePart.length < 10) {
        // Invalid date part, try to restore from previous
        if (previousValidDateTime) {
            const time = timePart || '00:00';
            const restoredDateTime = `${String(previousValidDateTime.year).padStart(4, '0')}-${String(previousValidDateTime.month).padStart(2, '0')}-${String(previousValidDateTime.day).padStart(2, '0')}T${time}`;
            dateTimeInput.value = restoredDateTime;
            return { valid: true, dateParts: previousValidDateTime };
        }
        return null;
    }
    
    const parts = datePart.split('-');
    if (parts.length !== 3) {
        // Invalid format, try to restore from previous
        if (previousValidDateTime) {
            const time = timePart || '00:00';
            const restoredDateTime = `${String(previousValidDateTime.year).padStart(4, '0')}-${String(previousValidDateTime.month).padStart(2, '0')}-${String(previousValidDateTime.day).padStart(2, '0')}T${time}`;
            dateTimeInput.value = restoredDateTime;
            return { valid: true, dateParts: previousValidDateTime };
        }
        return null; // Invalid format, don't validate
    }
    
    let year = parseInt(parts[0]);
    let month = parseInt(parts[1]);
    let day = parseInt(parts[2]);
    
    // If any part is invalid, try to use previous valid values
    if (isNaN(year) || year <= 0) {
        if (previousValidDateTime) year = previousValidDateTime.year;
        else return null;
    }
    if (isNaN(month) || month < 1 || month > 12) {
        if (previousValidDateTime) month = previousValidDateTime.month;
        else return null;
    }
    if (isNaN(day) || day < 1 || day > 31) {
        if (previousValidDateTime) day = previousValidDateTime.day;
        else return null;
    }
    
    // Check year doesn't exceed 4 digits (2100 max)
    if (year > 2100) {
        year = 2100;
    }
    
    // Get maximum days for the selected month/year
    const maxDays = getDaysInMonth(year, month - 1);
    
    // Only adjust day if it exceeds maximum days for the month
    // Preserve the day if it's valid, even if year changed
    if (day > maxDays) {
        // Only adjust if day is truly invalid (e.g., Feb 30 or Feb 29 in non-leap year)
        const dateObj = new Date(year, month - 1, day);
        if (dateObj.getFullYear() !== year || dateObj.getMonth() !== month - 1 || dateObj.getDate() !== day) {
            // Date is invalid, adjust to max days
            day = maxDays;
        }
    }
    
    // Set the corrected datetime
    const time = timePart || '00:00';
    const correctedDate = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const correctedDateTime = `${correctedDate}T${time}`;
    dateTimeInput.value = correctedDateTime;
    
    return { valid: true, dateParts: { year, month, day } };
}

function isValidDateOfBirth(dob) {
    if (!dob) return false;
    
    const birthDate = new Date(dob);
    const today = new Date();
    
    // Validate date is actually valid (handles month-specific day limits)
    const [year, month, day] = dob.split('-').map(Number);
    if (year && month && day) {
        const maxDays = getDaysInMonth(year, month - 1);
        if (day > maxDays) {
            return false; // Invalid date (e.g., June 31st)
        }
    }
    
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Check if date is in the future
    if (birthDate > today) {
        return false;
    }
    
    // Check if age is reasonable (between 18 and 120)
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
    return actualAge >= 18 && actualAge <= 120;
}

function showFieldError(form, fieldName, message) {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.style.borderColor = 'var(--danger)';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        
        // Remove existing error message
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = 'color: var(--danger); font-size: 0.85rem; margin-top: 0.25rem;';
        errorDiv.textContent = message;
        field.parentElement.appendChild(errorDiv);
        
        // Focus on field
        field.focus();
    }
}

function showFormError(form, message) {
    // Remove existing form error
    const existingError = form.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add form error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.style.cssText = 'background: rgba(239, 68, 68, 0.1); border: 1px solid var(--danger); color: var(--danger); padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.9rem;';
    errorDiv.textContent = message;
    form.insertBefore(errorDiv, form.firstChild);
}

function clearFormErrors(form) {
    // Clear field errors
    form.querySelectorAll('.field-error').forEach(el => el.remove());
    form.querySelectorAll('input, select, textarea').forEach(field => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    });
    
    // Clear form error
    const formError = form.querySelector('.form-error');
    if (formError) {
        formError.remove();
    }
}

// Password match checker
function checkPasswordMatch(input) {
    const password = document.querySelector('[name="password"]').value;
    const confirmPassword = input.value;
    const matchDiv = document.getElementById('passwordMatch');
    
    if (!matchDiv) return;
    
    if (confirmPassword.length === 0) {
        matchDiv.textContent = '';
        matchDiv.style.color = '';
        return;
    }
    
    if (password === confirmPassword) {
        matchDiv.textContent = '✓ Passwords match';
        matchDiv.style.color = 'var(--success)';
        input.style.borderColor = 'rgba(22, 163, 74, 0.5)';
    } else {
        matchDiv.textContent = '✗ Passwords do not match';
        matchDiv.style.color = 'var(--danger)';
        input.style.borderColor = 'rgba(239, 68, 68, 0.5)';
    }
}

// Password strength checker
function checkPasswordStrength(input) {
    const password = input.value;
    const strengthDiv = document.getElementById('passwordStrength');
    const strengthBar = document.getElementById('passwordStrengthBar');
    const strengthText = document.getElementById('passwordStrengthText');
    
    if (!strengthDiv || !strengthBar || !strengthText) return;
    
    if (password.length === 0) {
        strengthDiv.style.display = 'none';
        return;
    }
    
    strengthDiv.style.display = 'block';
    
    let strength = 0;
    let feedback = [];
    
    if (password.length >= 6) strength += 25;
    else feedback.push('At least 6 characters');
    
    if (/[a-z]/.test(password)) strength += 25;
    else feedback.push('lowercase letter');
    
    if (/[A-Z]/.test(password)) strength += 25;
    else feedback.push('uppercase letter');
    
    if (/[0-9]/.test(password)) strength += 25;
    else feedback.push('number');
    
    strengthBar.style.width = strength + '%';
    
    if (strength <= 25) {
        strengthBar.style.background = 'var(--danger)';
        strengthText.textContent = 'Weak password';
        strengthText.style.color = 'var(--danger)';
    } else if (strength <= 50) {
        strengthBar.style.background = '#f59e0b';
        strengthText.textContent = 'Fair password';
        strengthText.style.color = '#f59e0b';
    } else if (strength <= 75) {
        strengthBar.style.background = '#3b82f6';
        strengthText.textContent = 'Good password';
        strengthText.style.color = '#3b82f6';
    } else {
        strengthBar.style.background = 'var(--success)';
        strengthText.textContent = 'Strong password';
        strengthText.style.color = 'var(--success)';
    }
    
    if (feedback.length > 0 && strength < 100) {
        strengthText.textContent += ' - Needs: ' + feedback.join(', ');
    }
}

async function handleLogout() {
    // Prevent multiple simultaneous logout attempts
    if (tokenValidationInProgress) {
        return;
    }
    
    try {
        // Try to logout on server (don't wait if it fails)
        apiRequest('/auth/logout', { method: 'POST' }).catch(err => {
            console.error('Server logout error (ignored):', err);
        });
    } catch (error) {
        console.error('Logout error:', error);
    }
    
    // Always clear local authentication data
    clearAuthData();
    
    // Update navbar immediately
    updateNavbar();
    
    // Show logout message
    alert('Logged out successfully!');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// ========== FLIGHT SEARCH ==========

function handleQuickSearch(event) {
    event.preventDefault();//Prevent default behaviour which is submitting the form and reload
    window.location.href = 'flight-search.html';
}

async function handleFlightSearch(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const from = formData.get('from');
    const to = formData.get('to');
    const departure = formData.get('departure');
    const passengers = formData.get('passengers') || 1;
    const flightClass = formData.get('class') || 'economy';
    
    const resultsDiv = document.getElementById('searchResults');
    const flightsList = document.getElementById('flightsList');
    
    if (resultsDiv) resultsDiv.style.display = 'block';
    if (flightsList) flightsList.innerHTML = '<p>Searching flights...</p>';
    
    try {
        const params = new URLSearchParams({
            from: from || '',
            to: to || '',
            departure: departure || '',
            passengers: passengers,
            class: flightClass
        });
        
        const response = await apiRequest(`/flights/search?${params}`);
        
        if (response.success && response.data.flights) {
            if (flightsList) {
                if (response.data.flights.length === 0) {
                    flightsList.innerHTML = '<p class="no-results">No flights found. Please try different search criteria.</p>';
                } else {
                    flightsList.innerHTML = generateFlightResults(response.data.flights);
                }
            }
        }
    } catch (error) {
        if (flightsList) {
            flightsList.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        }
    }
}

function generateFlightResults(flights) {
    // Get search form values for class and passengers
    const searchForm = document.querySelector('.search-form.detailed');
    const flightClass = searchForm ? (searchForm.querySelector('[name="class"]')?.value || 'economy') : 'economy';
    const numPassengers = searchForm ? (parseInt(searchForm.querySelector('[name="passengers"]')?.value) || 1) : 1;
    
    return flights.map(flight => {
        const departure = new Date(flight.departure_datetime);
        const arrival = new Date(flight.arrival_datetime);
        const duration = Math.round((arrival - departure) / (1000 * 60));
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        
        // Calculate price based on class
        let price = flight.total_price || flight.price || flight.base_price;
        if (flightClass === 'business' && flight.business_price) {
            price = flight.business_price;
        } else if (flightClass === 'first' && flight.first_class_price) {
            price = flight.first_class_price;
        }
        
        return `
            <div class="flight-card">
                <div class="flight-info">
                    <h3>Flight ${flight.flight_number}</h3>
                    <p><strong>${flight.from_city}</strong> → <strong>${flight.to_city}</strong></p>
                    <p>${departure.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${arrival.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    <p>Duration: ${hours}h ${minutes}m | ${flight.available_seats} seats available</p>
                    <p style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">Class: ${flightClass.charAt(0).toUpperCase() + flightClass.slice(1)} | Passengers: ${numPassengers}</p>
                </div>
                <div class="flight-price">
                    <h3>$${parseFloat(price).toFixed(2)}</h3>
                    <p style="font-size: 0.85rem; color: rgba(255,255,255,0.7); margin-bottom: 0.5rem;">Total: $${(parseFloat(price) * numPassengers).toFixed(2)}</p>
                    <button class="btn btn-primary" onclick="bookFlight(${flight.flight_id}, ${price}, '${flightClass}', ${numPassengers})">Book Now</button>
                </div>
            </div>
        `;
    }).join('');
}

// Global variables for booking
let currentBookingFlight = null;
let currentBookingClass = 'economy';
let currentBookingPassengers = 1;

function bookFlight(flightId, price, flightClass = 'economy', numPassengers = 1) {
    if (!checkAuthentication('user')) {
        localStorage.setItem('pendingFlightBooking', flightId);
        localStorage.setItem('redirectAfterLogin', 'flight-search.html');
        alert('Please login to book a flight');
        window.location.href = 'login.html';
        return;
    }
    
    // Get flight details
    apiRequest(`/flights/${flightId}`).then(response => {
        if (response.success && response.data.flight) {
            currentBookingFlight = response.data.flight;
            currentBookingClass = flightClass;
            currentBookingPassengers = numPassengers;
            showBookingModal(flightId, price, flightClass, numPassengers);
        } else {
            alert('Failed to load flight details. Please try again.');
        }
    }).catch(error => {
        console.error('Error loading flight:', error);
        alert('Failed to load flight details. Please try again.');
    });
}

function showBookingModal(flightId, price, flightClass, numPassengers) {
    const modal = document.getElementById('bookingModal');
    const modalTitle = document.getElementById('bookingModalTitle');
    const passengerForms = document.getElementById('passengerForms');
    const bookingForm = document.getElementById('bookingForm');
    
    if (!modal) {
        alert('Booking form not available. Please refresh the page.');
        return;
    }
    
    // Set hidden fields
    document.getElementById('bookingFlightId').value = flightId;
    document.getElementById('bookingFlightClass').value = flightClass;
    document.getElementById('bookingNumPassengers').value = numPassengers;
    
    // Set modal title with flight info
    if (currentBookingFlight) {
        modalTitle.textContent = `Book Flight ${currentBookingFlight.flight_number || flightId}`;
    }
    
    // Generate passenger forms
    passengerForms.innerHTML = '';
    for (let i = 1; i <= numPassengers; i++) {
        const passengerDiv = document.createElement('div');
        passengerDiv.className = 'passenger-form-section';
        passengerDiv.style.cssText = 'margin-bottom: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);';
        passengerDiv.innerHTML = `
            <h3 style="margin-bottom: 1rem; color: rgba(255,255,255,0.9);">Passenger ${i}</h3>
            <div class="form-row">
                <div class="form-group">
                    <label>First Name *</label>
                    <input type="text" name="passenger_${i}_firstName" required placeholder="First name">
                </div>
                <div class="form-group">
                    <label>Last Name *</label>
                    <input type="text" name="passenger_${i}_lastName" required placeholder="Last name">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Date of Birth</label>
                    <input type="date" name="passenger_${i}_dob" max="${new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}" min="1900-01-01" maxlength="10" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}">
                </div>
                <div class="form-group">
                    <label>Passport Number</label>
                    <input type="text" name="passenger_${i}_passport" placeholder="Optional">
                </div>
            </div>
            <div class="form-group">
                <label>Nationality</label>
                <input type="text" name="passenger_${i}_nationality" placeholder="Optional">
            </div>
        `;
        passengerForms.appendChild(passengerDiv);
    }
    
    // Show flight summary
    const summaryDiv = document.createElement('div');
    summaryDiv.style.cssText = 'margin-bottom: 1.5rem; padding: 1rem; background: rgba(45, 212, 191, 0.1); border-radius: 8px; border: 1px solid rgba(45, 212, 191, 0.3);';
    if (currentBookingFlight) {
        const dep = new Date(currentBookingFlight.departure_datetime);
        const arr = new Date(currentBookingFlight.arrival_datetime);
        summaryDiv.innerHTML = `
            <h4 style="margin-bottom: 0.5rem; color: var(--accent);">Flight Summary</h4>
            <p><strong>Route:</strong> ${currentBookingFlight.from_city || 'N/A'} → ${currentBookingFlight.to_city || 'N/A'}</p>
            <p><strong>Departure:</strong> ${dep.toLocaleString()}</p>
            <p><strong>Arrival:</strong> ${arr.toLocaleString()}</p>
            <p><strong>Class:</strong> ${flightClass.charAt(0).toUpperCase() + flightClass.slice(1)}</p>
            <p><strong>Passengers:</strong> ${numPassengers}</p>
            <p><strong>Total Price:</strong> $${(parseFloat(price) * numPassengers).toFixed(2)}</p>
        `;
    }
    passengerForms.insertBefore(summaryDiv, passengerForms.firstChild);
    
    modal.style.display = 'flex';
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'none';
        const form = document.getElementById('bookingForm');
        if (form) form.reset();
        currentBookingFlight = null;
    }
}

async function handleBookingSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const flightId = parseInt(formData.get('flightId'));
    const flightClass = formData.get('class') || 'economy';
    const numPassengers = parseInt(formData.get('numPassengers')) || 1;
    
    // Collect passenger data
    const passengers = [];
    for (let i = 1; i <= numPassengers; i++) {
        const firstName = formData.get(`passenger_${i}_firstName`);
        const lastName = formData.get(`passenger_${i}_lastName`);
        
        if (!firstName || !lastName) {
            alert(`Please fill in all required fields for Passenger ${i}`);
            return;
        }
        
        passengers.push({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            date_of_birth: formData.get(`passenger_${i}_dob`) || null,
            passport_number: formData.get(`passenger_${i}_passport`)?.trim() || null,
            nationality: formData.get(`passenger_${i}_nationality`)?.trim() || null
        });
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    
    try {
        const response = await apiRequest('/bookings/create', {
            method: 'POST',
            body: JSON.stringify({
                flight_id: flightId,
                passengers: passengers,
                class: flightClass
            })
        });
        
        if (response.success) {
            alert('Booking confirmed successfully! Your booking reference is: ' + (response.data.booking?.booking_reference || 'N/A'));
            closeBookingModal();
            
            // Redirect to bookings page
            if (window.location.pathname.includes('flight-search')) {
                window.location.href = 'my-bookings.html';
            } else {
                // Reload bookings if on bookings page
                if (window.location.pathname.includes('my-bookings')) {
                    filterBookings('all', 'user');
                }
            }
        } else {
            throw new Error(response.message || 'Failed to create booking');
        }
    } catch (error) {
        console.error('Booking error:', error);
        alert('Failed to create booking: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// ========== DASHBOARD ==========

async function loadDashboardData() {
    const userRole = localStorage.getItem('userRole');
    
    try {
        if (userRole === 'admin') {
            // Load admin stats
            const response = await apiRequest('/admin/stats');
            if (response.success && response.data) {
                const stats = response.data;
                updateElement('totalUsers', stats.totalUsers);
                updateElement('totalFlights', stats.totalFlights);
                updateElement('totalBookings', stats.totalBookings);
                updateElement('totalRevenue', `$${stats.totalRevenue.toLocaleString()}`);
            }
        } else {
            // Load user bookings stats
            const response = await apiRequest('/bookings/list');
            if (response.success && response.data) {
                const bookings = response.data.bookings || [];
                const confirmed = bookings.filter(b => b.status === 'confirmed').length;
                const completed = bookings.filter(b => b.status === 'completed').length;
                const totalSpent = bookings
                    .filter(b => b.status === 'confirmed' || b.status === 'completed')
                    .reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0);
                
                updateElement('totalBookings', bookings.length);
                updateElement('upcomingFlights', confirmed);
                updateElement('completedTrips', completed);
                updateElement('totalSpent', `$${totalSpent.toLocaleString()}`);
            }
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        const span = element.querySelector('span');
        if (span) {
            span.textContent = value;
        } else {
            element.textContent = value;
        }
    }
}

async function loadUserDashboardData() {
    try {
        // Load all bookings for better synchronization
        const bookingsResponse = await apiRequest('/bookings/list');
        if (bookingsResponse.success && bookingsResponse.data.bookings) {
            const allBookings = bookingsResponse.data.bookings || [];
            
            // Sort by departure date (upcoming first)
            const sortedBookings = [...allBookings].sort((a, b) => {
                const dateA = new Date(a.departure_datetime);
                const dateB = new Date(b.departure_datetime);
                return dateA - dateB;
            });
            
            // Filter upcoming flights (confirmed and future departure)
            const upcomingFlights = sortedBookings
                .filter(b => {
                    const depDate = new Date(b.departure_datetime);
                    return b.status === 'confirmed' && depDate > new Date();
                })
                .slice(0, 3);
            
            const upcomingList = document.getElementById('upcomingFlightsList');
            if (upcomingList) {
                if (upcomingFlights.length === 0) {
                    upcomingList.innerHTML = '<div class="empty-state"><p>No upcoming flights. <a href="flight-search.html">Book a flight now!</a></p></div>';
                } else {
                    upcomingList.innerHTML = upcomingFlights.map(booking => {
                        const dep = new Date(booking.departure_datetime);
                        return `
                            <div class="flight-card">
                                <div class="flight-info">
                                    <h3>${booking.flight_number || 'N/A'}</h3>
                                    <p>${booking.from_city || 'N/A'} → ${booking.to_city || 'N/A'}</p>
                                    <p>${dep.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} at ${dep.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <div class="flight-actions">
                                    <a href="my-bookings.html" class="btn btn-sm">View Details</a>
                                </div>
                            </div>
                        `;
                    }).join('');
                }
            }
            
            // Load recent bookings (sorted by booking date, most recent first)
            const recentBookings = [...allBookings]
                .sort((a, b) => {
                    const dateA = new Date(a.booking_date);
                    const dateB = new Date(b.booking_date);
                    return dateB - dateA;
                })
                .slice(0, 5);
            
            const recentTable = document.getElementById('recentBookingsTable');
            if (recentTable) {
                if (recentBookings.length === 0) {
                    recentTable.innerHTML = '<tr><td colspan="5" class="empty-state">No recent bookings</td></tr>';
                } else {
                    recentTable.innerHTML = recentBookings.map(booking => {
                        const date = new Date(booking.booking_date);
                        return `
                            <tr>
                                <td>${booking.booking_reference || 'N/A'}</td>
                                <td>${booking.flight_number || 'N/A'}</td>
                                <td>${date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                <td><span class="status-badge status-${String(booking.status || 'pending').toLowerCase()}" style="display: inline-flex !important; align-items: center !important; justify-content: center !important; visibility: visible !important; opacity: 1 !important; min-width: 90px; text-align: center !important; line-height: 1 !important; margin: 0 auto !important;">${String(booking.status || 'pending').charAt(0).toUpperCase() + String(booking.status || 'pending').slice(1)}</span></td>
                                <td><a href="my-bookings.html" class="btn btn-sm">View</a></td>
                            </tr>
                        `;
                    }).join('');
                }
            }
        }
    } catch (error) {
        console.error('Error loading user dashboard data:', error);
        const upcomingList = document.getElementById('upcomingFlightsList');
        const recentTable = document.getElementById('recentBookingsTable');
        if (upcomingList) {
            upcomingList.innerHTML = '<div class="empty-state"><p>Failed to load upcoming flights</p></div>';
        }
        if (recentTable) {
            recentTable.innerHTML = '<tr><td colspan="5" class="empty-state">Failed to load recent bookings</td></tr>';
        }
    }
}

// Chart instances
let revenueChart = null;
let bookingChart = null;

async function loadAdminDashboard() {
    try {
        // Load stats and charts in parallel
        await Promise.all([
            loadAdminStats(),
            loadReportCharts()
        ]);
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
    }
}

async function loadAdminStats() {
    try {
        const response = await apiRequest('/admin/stats');
        if (response.success && response.data) {
            const stats = response.data;
            updateElement('totalUsers', stats.totalUsers);
            updateElement('totalFlights', stats.totalFlights);
            updateElement('totalBookings', stats.totalBookings);
            // totalRevenue already has $ sign in HTML, so just update the number
            const revenueElement = document.getElementById('totalRevenue');
            if (revenueElement) {
                revenueElement.textContent = stats.totalRevenue.toLocaleString();
            }
        }
    } catch (error) {
        console.error('Error loading admin stats:', error);
    }
}

async function loadReportCharts() {
    try {
        const [revenueResponse, bookingsResponse] = await Promise.all([
            apiRequest('/reports/revenue'),
            apiRequest('/reports/bookings')
        ]);

        if (revenueResponse.success && revenueResponse.data.revenueTrend) {
            renderRevenueChart(revenueResponse.data.revenueTrend);
        }

        if (bookingsResponse.success && bookingsResponse.data.bookingTrend) {
            renderBookingChart(bookingsResponse.data.bookingTrend);
        }
    } catch (error) {
        console.error('Error loading report charts:', error);
    }
}

function renderRevenueChart(revenueTrend) {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (revenueChart) {
        revenueChart.destroy();
    }

    const labels = revenueTrend.map(item => {
        const date = new Date(item.month + '-01');
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    const data = revenueTrend.map(item => parseFloat(item.revenue || 0));

    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue ($)',
                data: data,
                borderColor: 'rgb(45, 212, 191)',
                backgroundColor: 'rgba(45, 212, 191, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: 'rgba(255, 255, 255, 0.9)'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

function renderBookingChart(bookingTrend) {
    const ctx = document.getElementById('bookingChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (bookingChart) {
        bookingChart.destroy();
    }

    const labels = bookingTrend.map(item => {
        const date = new Date(item.month + '-01');
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    const data = bookingTrend.map(item => parseInt(item.count || 0));

    bookingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Bookings',
                data: data,
                backgroundColor: 'rgba(11, 99, 197, 0.8)',
                borderColor: 'rgb(11, 99, 197)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: 'rgba(255, 255, 255, 0.9)'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        stepSize: 1
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}


// ========== BOOKINGS ==========

// Function to synchronize booking statuses based on flight dates
async function synchronizeBookingStatuses(bookings) {
    const now = new Date();
    const updatesNeeded = [];
    
    for (const booking of bookings) {
        if (!booking.departure_datetime || !booking.arrival_datetime) continue;
        
        const dep = new Date(booking.departure_datetime);
        const arr = new Date(booking.arrival_datetime);
        
        // Only process confirmed bookings
        if (booking.status !== 'confirmed') continue;
        
        // Check if flight has arrived
        if (arr < now) {
            // Check if passenger has seat assigned (indicating check-in)
            const hasSeats = booking.passengers && Array.isArray(booking.passengers) && booking.passengers.some(p => p.seat_number && p.seat_number.trim() !== '');
            const newStatus = hasSeats ? 'completed' : 'missed';
            
            if (newStatus !== booking.status) {
                updatesNeeded.push({ bookingId: booking.booking_id, newStatus });
            }
        }
    }
    
    // Update statuses if needed (in background, don't block UI)
    if (updatesNeeded.length > 0) {
        // Update all in parallel
        await Promise.all(updatesNeeded.map(async ({ bookingId, newStatus }) => {
            try {
                await apiRequest(`/bookings/${bookingId}/update-status`, {
                    method: 'POST',
                    body: JSON.stringify({ status: newStatus })
                });
            } catch (error) {
                console.warn('Failed to update booking status:', error);
            }
        }));
    }
}

async function filterBookings(arg1, arg2) {
    let evt = null;
    let status = 'all';
    let context = 'auto';

    if (arg1 && typeof arg1.preventDefault === 'function') {
        evt = arg1;
        status = arg2 || 'all';
        context = 'user';
    } else {
        status = arg1 || 'all';
        context = arg2 || 'auto';
    }

    if (evt) {
        evt.preventDefault();
    }

    const bookingsList = document.getElementById('bookingsList');
    if ((context === 'user' || context === 'auto') && bookingsList) {
        // Show loading state
        bookingsList.innerHTML = '<div class="empty-state"><p>Loading bookings...</p></div>';
        
        // Update tab buttons immediately for better UX
        const tabsContainer = evt && evt.currentTarget
            ? evt.currentTarget.closest('.filter-tabs')
            : bookingsList.previousElementSibling && bookingsList.previousElementSibling.classList.contains('filter-tabs')
                ? bookingsList.previousElementSibling
                : document.querySelector('.filter-tabs');

        if (tabsContainer) {
            tabsContainer.querySelectorAll('.tab-btn[data-filter]').forEach(btn => {
                const shouldActivate = evt
                    ? btn === evt.currentTarget
                    : btn.dataset.filter === status;
                btn.classList.toggle('active', shouldActivate);
            });
        }

        // Load user bookings
        try {
            // Always fetch all bookings first, then filter client-side for better synchronization
            const response = await apiRequest('/bookings/list');
            
            if (response.success && response.data.bookings) {
                let filteredBookings = response.data.bookings || [];
                
                // Synchronize booking statuses based on flight dates
                await synchronizeBookingStatuses(filteredBookings);
                
                // Reload bookings after synchronization to get updated statuses
                const updatedResponse = await apiRequest('/bookings/list');
                if (updatedResponse.success && updatedResponse.data.bookings) {
                    filteredBookings = updatedResponse.data.bookings || [];
                }
                
                // Filter by status
                if (status === 'upcoming') {
                    filteredBookings = filteredBookings.filter(b => {
                        const depDate = new Date(b.departure_datetime);
                        return b.status === 'confirmed' && depDate > new Date();
                    });
                } else if (status === 'completed') {
                    filteredBookings = filteredBookings.filter(b => b.status === 'completed' || b.status === 'missed');
                } else if (status === 'cancelled') {
                    filteredBookings = filteredBookings.filter(b => b.status === 'cancelled');
                }
                // 'all' shows all bookings, no filter needed
                
                // Sort by booking date (most recent first)
                filteredBookings.sort((a, b) => {
                    const dateA = new Date(a.booking_date);
                    const dateB = new Date(b.booking_date);
                    return dateB - dateA;
                });
                
                if (filteredBookings.length === 0) {
                    bookingsList.innerHTML = '<div class="empty-state"><p>No bookings found</p><p><a href="flight-search.html">Find your next flight</a></p></div>';
                } else {
                    // Use document fragment for smoother rendering
                    const fragment = document.createDocumentFragment();
                    const tempDiv = document.createElement('div');
                    
                filteredBookings.forEach(booking => {
                    // Ensure status exists
                    if (!booking.status) {
                        console.warn('Booking missing status:', booking);
                        booking.status = 'pending';
                    }
                    
                    const dep = new Date(booking.departure_datetime);
                    const arr = new Date(booking.arrival_datetime);
                    const bookingDate = new Date(booking.booking_date);
                    const now = new Date();
                    
                    // Check if flight has passed
                    const flightHasPassed = dep < now;
                    const flightHasArrived = arr < now;
                    
                    // Determine if check-in should be available (flight hasn't departed and status is confirmed)
                    const canCheckIn = booking.status === 'confirmed' && !flightHasPassed;
                    
                    // Determine if cancel should be available (flight hasn't departed and not cancelled/completed)
                    const canCancel = booking.status !== 'cancelled' && booking.status !== 'completed' && !flightHasPassed;
                    
                    // Update status display if flight has passed but status hasn't been updated
                    let displayStatus = booking.status;
                    if (flightHasArrived && booking.status === 'confirmed') {
                        // Check if checked in - if yes, mark as completed, otherwise missed
                        const hasSeats = booking.passengers && booking.passengers.some(p => p.seat_number && p.seat_number.trim() !== '');
                        displayStatus = hasSeats ? 'completed' : 'missed';
                    }
                    
                    const bookingCard = document.createElement('div');
                    bookingCard.className = 'booking-card';
                    bookingCard.setAttribute('data-status', String(displayStatus || 'pending').toLowerCase());
                        bookingCard.innerHTML = `
                            <div class="booking-header">
                                <div class="booking-id">
                                    <h3>Booking #${booking.booking_reference || 'N/A'}</h3>
                                    <span class="status-badge status-${String(displayStatus || 'pending').toLowerCase()}" style="display: inline-flex !important; align-items: center !important; justify-content: center !important; visibility: visible !important; opacity: 1 !important; min-width: 90px; text-align: center !important; line-height: 1 !important; margin: 0 !important;">${String(displayStatus || 'pending').charAt(0).toUpperCase() + String(displayStatus || 'pending').slice(1)}</span>
                                </div>
                                <div class="booking-date">
                                    <p>Booked on: ${bookingDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                    <p style="margin-top: 0.5rem; font-weight: 600; color: rgba(255,255,255,0.9);">Departure: ${dep.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} at ${dep.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                                    ${flightHasPassed ? `<p style="margin-top: 0.25rem; color: rgba(239, 68, 68, 0.9); font-size: 0.9rem;">Flight has departed</p>` : ''}
                                </div>
                            </div>
                            <div class="booking-details">
                                <div class="flight-info">
                                    <div class="flight-route">
                                        <div class="route-item">
                                            <h4>${booking.from_city || 'N/A'} (${booking.from_code || 'N/A'})</h4>
                                            <p>${booking.from_name || 'N/A'}</p>
                                            <span class="time">${dep.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${dep.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div class="route-arrow">→</div>
                                        <div class="route-item">
                                            <h4>${booking.to_city || 'N/A'} (${booking.to_code || 'N/A'})</h4>
                                            <p>${booking.to_name || 'N/A'}</p>
                                            <span class="time">${arr.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${arr.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                    <div class="flight-meta">
                                        <span>Flight: ${booking.flight_number || 'N/A'}</span>
                                        <span>Class: ${(booking.class || 'economy').charAt(0).toUpperCase() + (booking.class || 'economy').slice(1)}</span>
                                        <span>Passengers: ${booking.number_of_passengers || 0}</span>
                                        <span>Amount: $${parseFloat(booking.total_amount || 0).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div class="booking-actions">
                                    <button class="btn btn-primary" onclick="viewBookingDetails(${booking.booking_id})">View Details</button>
                                    ${canCheckIn ? `<button class="btn btn-secondary" onclick="checkIn(${booking.booking_id})">Check-in</button>` : ''}
                                    ${canCancel ? `<button class="btn btn-danger" onclick="cancelBooking(${booking.booking_id})">Cancel</button>` : ''}
                                </div>
                            </div>
                        `;
                        fragment.appendChild(bookingCard);
                    });
                    
                    bookingsList.innerHTML = '';
                    bookingsList.appendChild(fragment);
                }
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error loading bookings:', error);
            bookingsList.innerHTML = `<div class="empty-state"><p style="color: red;">Failed to load bookings: ${error.message}</p><p><a href="javascript:location.reload()">Refresh page</a></p></div>`;
        }

        return;
    }

    const adminTableBody = document.querySelector('#bookingsTab .admin-table tbody');
    if ((context === 'admin' || context === 'auto') && adminTableBody) {
        // Admin bookings are loaded by loadAdminBookings()
        let visibleRows = 0;
        adminTableBody.querySelectorAll('tr[data-status]').forEach(row => {
            const rowStatus = row.dataset.status || 'all';
            const showRow = status === 'all' || rowStatus === status;
            row.style.display = showRow ? 'table-row' : 'none';
            if (showRow) {
                visibleRows++;
            }
        });

        const emptyRow = adminTableBody.querySelector('[data-empty-row]');
        if (emptyRow) {
            emptyRow.style.display = visibleRows ? 'none' : 'table-row';
        }
    }
}

async function viewBooking(bookingId) {
    try {
        const response = await apiRequest(`/bookings/${bookingId}`);
        if (response.success && response.data.booking) {
            const booking = response.data.booking;
            const dep = new Date(booking.departure_datetime);
            const arr = new Date(booking.arrival_datetime);
            alert(`Booking Details:\n\nReference: ${booking.booking_reference}\nFlight: ${booking.flight_number}\nRoute: ${booking.from_city} → ${booking.to_city}\nDeparture: ${dep.toLocaleString()}\nArrival: ${arr.toLocaleString()}\nClass: ${booking.class}\nPassengers: ${booking.number_of_passengers}\nAmount: $${parseFloat(booking.total_amount).toFixed(2)}\nStatus: ${booking.status}`);
        }
    } catch (error) {
        alert('Failed to load booking details');
    }
}

async function checkIn(bookingId) {
    // Verify user is logged in before proceeding
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const token = getAuthToken();
    const userRole = localStorage.getItem('userRole');
    
    if (!isLoggedIn || !token || userRole !== 'user') {
        alert('Please login to check in.');
        localStorage.setItem('redirectAfterLogin', `check-in.html?booking=${bookingId}`);
        window.location.href = 'login.html';
        return;
    }
    
    // First check if flight has passed and if already checked in
    try {
        const response = await apiRequest(`/bookings/${bookingId}`);
        if (response.success && response.data.booking) {
            const booking = response.data.booking;
            const dep = new Date(booking.departure_datetime);
            const now = new Date();
            
            if (dep < now) {
                alert('This flight has already departed. Check-in is no longer available.');
                // Reload bookings to update status
                if (window.location.pathname.includes('my-bookings')) {
                    const activeTab = document.querySelector('.filter-tabs .tab-btn.active');
                    const currentFilter = activeTab ? activeTab.dataset.filter || 'all' : 'all';
                    await filterBookings(currentFilter, 'user');
                }
                return;
            }
            
            // Check if already checked in by checking if passengers have seat numbers
            const hasSeats = booking.passengers && Array.isArray(booking.passengers) && 
                            booking.passengers.some(p => p.seat_number && p.seat_number.trim() !== '');
            
            // Also check if there's a check-in record
            let alreadyCheckedIn = false;
            try {
                const checkInResponse = await apiRequest('/checkin/search', {
                    method: 'POST',
                    body: JSON.stringify({
                        booking_reference: booking.booking_reference,
                        last_name: booking.passengers && booking.passengers.length > 0 
                            ? booking.passengers[0].last_name 
                            : ''
                    })
                });
                
                if (!checkInResponse.success && checkInResponse.message && 
                    (checkInResponse.message.includes('Already checked in') || 
                     checkInResponse.message.includes('already checked in'))) {
                    alreadyCheckedIn = true;
                } else if (checkInResponse.success && checkInResponse.data && 
                          checkInResponse.data.alreadyCheckedIn) {
                    alreadyCheckedIn = true;
                }
            } catch (checkInError) {
                // If check-in search fails, check seat numbers as fallback
                if (hasSeats) {
                    alreadyCheckedIn = true;
                }
            }
            
            if (alreadyCheckedIn || hasSeats) {
                alert('You have already checked in for this flight. Please check your bookings page for your boarding pass.');
                // Stay on my-bookings page - just reload the bookings list
                if (window.location.pathname.includes('my-bookings')) {
                    const activeTab = document.querySelector('.filter-tabs .tab-btn.active');
                    const currentFilter = activeTab ? activeTab.dataset.filter || 'all' : 'all';
                    await filterBookings(currentFilter, 'user');
                } else {
                    // If not on my-bookings page, redirect there
                    window.location.href = 'my-bookings.html';
                }
                return;
            }
            
            // Mark as navigation to prevent logout on redirect
            isNavigating = true;
            
            // Proceed with check-in
            window.location.href = `check-in.html?booking=${bookingId}`;
        } else {
            alert('Failed to load booking details. Please try again.');
        }
    } catch (error) {
        console.error('Error checking booking:', error);
        
        // Check if it's an authentication error
        const errorMsg = error.message || '';
        if (errorMsg.includes('401') || errorMsg.includes('403') || errorMsg.includes('unauthorized') || errorMsg.includes('Authentication required')) {
            // Verify if user is still logged in
            const stillLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const stillHasToken = getAuthToken();
            
            if (!stillLoggedIn || !stillHasToken) {
                alert('Your session has expired. Please login again.');
                localStorage.setItem('redirectAfterLogin', `check-in.html?booking=${bookingId}`);
                window.location.href = 'login.html';
                return;
            } else {
                // User is logged in but got auth error - might be server issue
                alert('Authentication error. Please try refreshing the page or login again if the problem persists.');
                return;
            }
        }
        
        alert('Failed to verify booking. Please try again.');
    }
}

async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await apiRequest(`/bookings/${bookingId}/cancel`, {
            method: 'POST'
        });
        
        if (response.success) {
            alert('Booking cancelled successfully');
            // Reload bookings with current filter
            if (window.location.pathname.includes('my-bookings')) {
                const activeTab = document.querySelector('.filter-tabs .tab-btn.active');
                const currentFilter = activeTab ? activeTab.dataset.filter || 'all' : 'all';
                await filterBookings(currentFilter, 'user');
            }
        } else {
            throw new Error(response.message || 'Failed to cancel booking');
        }
    } catch (error) {
        console.error('Cancel booking error:', error);
        alert(error.message || 'Failed to cancel booking. Please try again.');
    }
}

// ========== CHECK-IN ==========

// Global variables for check-in
let currentBooking = null;
let selectedSeats = [];
let maxSeatsAllowed = 0;

async function handleCheckInSearch(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const bookingRef = formData.get('bookingRef').trim().toUpperCase();
    const lastName = formData.get('lastName').trim();

    if (!bookingRef || !lastName) {
        alert('Please enter both booking reference and last name.');
        return;
    }

    try {
        const response = await apiRequest('/checkin/search', {
            method: 'POST',
            body: JSON.stringify({
                booking_reference: bookingRef,
                last_name: lastName
            })
        });

        // Check if response indicates already checked in
        if (!response.success) {
            if (response.message && (response.message.includes('Already checked in') || response.message.includes('already checked in'))) {
                // Verify user is still authenticated
                const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                const token = getAuthToken();
                
                if (!isLoggedIn || !token) {
                    alert('Your session has expired. Please login again.');
                    window.location.href = 'login.html';
                    return;
                }
                
                // Stay on check-in page - just show message and reset form
                alert('You have already checked in for this flight. Please check your bookings page for your boarding pass.');
                // Reset the form
                const form = event.target;
                if (form) {
                    form.reset();
                }
                return;
            }
            let errorMsg = response.message || 'Booking not found.';
            if (response.errors && response.errors.length > 0) {
                errorMsg += '\n' + response.errors.map(e => e.msg).join('\n');
            }
            alert(errorMsg + '\n\nPlease check:\n- Booking reference is correct\n- Last name matches one of the passengers\n- Booking status is confirmed');
            return;
        }
        
        if (response.success && response.data) {
            // Check if already checked in flag is set
            if (response.data.alreadyCheckedIn) {
                // Verify user is still authenticated
                const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                const token = getAuthToken();
                
                if (!isLoggedIn || !token) {
                    alert('Your session has expired. Please login again.');
                    window.location.href = 'login.html';
                    return;
                }
                
                // Stay on check-in page - just show message and reset form
                alert('You have already checked in for this flight. Please check your bookings page for your boarding pass.');
                // Reset the form
                const form = event.target;
                if (form) {
                    form.reset();
                }
                return;
            }
            
            if (response.data.booking) {
                currentBooking = response.data.booking;
                
                // Check if passengers already have seat numbers (indicating check-in completed)
                const hasSeats = currentBooking.passengers && currentBooking.passengers.some(p => p.seat_number && p.seat_number.trim() !== '');
                if (hasSeats) {
                    // Verify user is still authenticated
                    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                    const token = getAuthToken();
                    
                    if (!isLoggedIn || !token) {
                        alert('Your session has expired. Please login again.');
                        window.location.href = 'login.html';
                        return;
                    }
                    
                    // Stay on check-in page - just show message and reset form
                    alert('You have already checked in for this flight. Seats are already assigned.');
                    // Reset the form
                    const form = event.target;
                    if (form) {
                        form.reset();
                    }
                    return;
                }
                
                maxSeatsAllowed = currentBooking.number_of_passengers || (currentBooking.passengers ? currentBooking.passengers.length : 1);
                
                // Show seat selection
                document.getElementById('seatSelection').style.display = 'block';
                document.querySelector('.checkin-form-card').style.display = 'none';
                
                // Initialize seat map with actual data
                await initializeSeatMap();
            } else {
                throw new Error('Booking data not found in response');
            }
        }
    } catch (error) {
        let errorMsg = 'Failed to find booking.';
        if (error.message) {
            errorMsg = error.message;
        }
        
        // Check if error message indicates already checked in
        if (errorMsg.includes('Already checked in') || errorMsg.includes('already checked in')) {
            // Verify user is still authenticated
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const token = getAuthToken();
            
            if (!isLoggedIn || !token) {
                alert('Your session has expired. Please login again.');
                window.location.href = 'login.html';
                return;
            }
            
            // Stay on check-in page - just show message and reset form
            alert('You have already checked in for this flight. Please check your bookings page.');
            // Reset the form if available
            const form = document.querySelector('form[onsubmit*="handleCheckInSearch"]');
            if (form) {
                form.reset();
            }
            return;
        }
        
        // Check if it's an authentication error - don't redirect, just show message
        if (errorMsg.includes('401') || errorMsg.includes('403') || errorMsg.includes('unauthorized') || errorMsg.includes('Authentication required')) {
            // Verify user is still logged in
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const token = getAuthToken();
            
            if (!isLoggedIn || !token) {
                alert('Your session has expired. Please login again.');
                window.location.href = 'login.html';
                return;
            } else {
                // User is logged in but API returned auth error - might be a server issue
                alert('Authentication error. Please try refreshing the page or login again if the problem persists.');
                return;
            }
        }
        
        if (error.response && error.response.message) {
            errorMsg = error.response.message;
        }
        alert(errorMsg + '\n\nPlease check:\n- Booking reference is correct\n- Last name matches one of the passengers\n- Booking status is confirmed\n- Check-in window is open (24 hours before departure)');
    }
}

// Load booking directly if booking ID is in URL
async function loadBookingForCheckIn() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('booking');
    
    if (bookingId) {
        try {
            // Get booking details
            const bookingResponse = await apiRequest(`/bookings/${bookingId}`);
            if (bookingResponse.success && bookingResponse.data.booking) {
                const booking = bookingResponse.data.booking;
                
                // Check if booking can be checked in
                if (booking.status !== 'confirmed') {
                    alert(`This booking cannot be checked in. Status: ${booking.status}`);
                    return;
                }
                
                // Check if already checked in by checking if passengers have seat numbers
                const hasSeats = booking.passengers && booking.passengers.some(p => p.seat_number && p.seat_number.trim() !== '');
                if (hasSeats) {
                    // Verify user is still authenticated before redirecting
                    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                    const token = getAuthToken();
                    
                    if (!isLoggedIn || !token) {
                        alert('Your session has expired. Please login again.');
                        window.location.href = 'login.html';
                        return;
                    }
                    
                    alert('You have already checked in for this flight. Seats are already assigned.');
                    // Use setTimeout to ensure alert is fully dismissed before redirect
                    setTimeout(() => {
                        window.location.href = 'my-bookings.html';
                    }, 100);
                    return;
                }
                
                // Try to proceed with check-in
                try {
                    const checkInResponse = await apiRequest('/checkin/search', {
                        method: 'POST',
                        body: JSON.stringify({
                            booking_reference: booking.booking_reference,
                            last_name: booking.passengers && booking.passengers.length > 0 
                                ? booking.passengers[0].last_name 
                                : ''
                        })
                    });
                    
                    // Check if response indicates already checked in
                    if (!checkInResponse.success) {
                        if (checkInResponse.message && (checkInResponse.message.includes('Already checked in') || checkInResponse.message.includes('already checked in'))) {
                            // Verify user is still authenticated before redirecting
                            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                            const token = getAuthToken();
                            
                            if (!isLoggedIn || !token) {
                                alert('Your session has expired. Please login again.');
                                window.location.href = 'login.html';
                                return;
                            }
                            
                            alert('You have already checked in for this flight.');
                            // Use setTimeout to ensure alert is fully dismissed before redirect
                            setTimeout(() => {
                                window.location.href = 'my-bookings.html';
                            }, 100);
                            return;
                        }
                        throw new Error(checkInResponse.message || 'Check-in search failed');
                    }
                    
                    if (checkInResponse.success && checkInResponse.data) {
                        if (checkInResponse.data.alreadyCheckedIn) {
                            // Verify user is still authenticated before redirecting
                            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                            const token = getAuthToken();
                            
                            if (!isLoggedIn || !token) {
                                alert('Your session has expired. Please login again.');
                                window.location.href = 'login.html';
                                return;
                            }
                            
                            alert('You have already checked in for this flight.');
                            // Use setTimeout to ensure alert is fully dismissed before redirect
                            setTimeout(() => {
                                window.location.href = 'my-bookings.html';
                            }, 100);
                            return;
                        }
                        
                        if (checkInResponse.data.booking) {
                            currentBooking = checkInResponse.data.booking;
                            maxSeatsAllowed = currentBooking.number_of_passengers || currentBooking.passengers.length;
                            
                            // Hide form and show seat selection
                            document.getElementById('seatSelection').style.display = 'block';
                            const formCard = document.querySelector('.checkin-form-card');
                            if (formCard) formCard.style.display = 'none';
                            
                            // Initialize seat map
                            await initializeSeatMap();
                        }
                    }
                } catch (err) {
                    // If error indicates already checked in, handle it
                    if (err.message && (err.message.includes('Already checked in') || err.message.includes('already checked in'))) {
                        // Verify user is still authenticated before redirecting
                        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                        const token = getAuthToken();
                        
                        if (!isLoggedIn || !token) {
                            alert('Your session has expired. Please login again.');
                            window.location.href = 'login.html';
                            return;
                        }
                        
                        alert('You have already checked in for this flight.');
                        // Use setTimeout to ensure alert is fully dismissed before redirect
                        setTimeout(() => {
                            window.location.href = 'my-bookings.html';
                        }, 100);
                        return;
                    }
                    
                    // If check-in search fails, try to use booking data directly (only if no seats assigned)
                    if (!hasSeats) {
                        currentBooking = booking;
                        maxSeatsAllowed = booking.number_of_passengers || (booking.passengers ? booking.passengers.length : 1);
                        
                        document.getElementById('seatSelection').style.display = 'block';
                        const formCard = document.querySelector('.checkin-form-card');
                        if (formCard) formCard.style.display = 'none';
                        
                        await initializeSeatMap();
                    }
                }
            }
        } catch (error) {
            console.error('Error loading booking:', error);
            alert('Failed to load booking. Please use the form to search for your booking.');
        }
    }
}

async function initializeSeatMap() {
    const seatMap = document.getElementById('seatMap');
    if (!seatMap || !currentBooking) return;
    
    selectedSeats = [];

    // Get aircraft capacity and occupied seats
    try {
        const flightResponse = await apiRequest(`/flights/${currentBooking.flight_id}`);
        const flight = flightResponse.data?.flight || {};
        const capacity = flight.capacity || flight.available_seats + (flight.booked_seats || 0) || 30;
        const rows = Math.ceil(capacity / 6);
        
        // Get occupied seats from booking passengers
        const occupiedSeats = new Set();
        if (currentBooking.passengers) {
            currentBooking.passengers.forEach(p => {
                if (p.seat_number) {
                    occupiedSeats.add(p.seat_number.toUpperCase());
                }
            });
        }

        // Note: We only mark seats occupied if they're already assigned to this booking's passengers
        // The backend will validate seat availability when confirming check-in

        // Remove existing seat info if any
        const existingInfo = document.querySelector('.seat-info');
        if (existingInfo) existingInfo.remove();

        let html = '';
        for (let row = 1; row <= rows; row++) {
            html += '<div class="seat-row">';
            for (let seat = 1; seat <= 6; seat++) {
                const seatId = `${row}${String.fromCharCode(64 + seat)}`;
                const isOccupied = occupiedSeats.has(seatId);
                html += `<span class="seat ${isOccupied ? 'occupied' : 'available'}" 
                         onclick="selectSeat(this)" data-seat="${seatId}"
                         title="${seatId}"></span>`;
            }
            html += '</div>';
        }
        seatMap.innerHTML = html;
        
        // Show max seats message
        const seatInfo = document.createElement('div');
        seatInfo.className = 'seat-info';
        seatInfo.style.cssText = 'text-align: center; margin: 1rem 0; color: white; font-weight: 600;';
        seatInfo.innerHTML = `Select up to ${maxSeatsAllowed} seat(s) for ${maxSeatsAllowed} passenger(s)`;
        seatMap.parentNode.insertBefore(seatInfo, seatMap.nextSibling);
    } catch (error) {
        console.error('Error initializing seat map:', error);
        alert('Failed to load seat map. Please try again.');
    }
}

function selectSeat(element) {
    if (element.classList.contains('occupied')) {
        alert('This seat is already occupied');
        return;
    }

    const seatId = element.dataset.seat;

    if (element.classList.contains('selected')) {
        // Deselect seat
        element.classList.remove('selected');
        element.classList.add('available');
        selectedSeats = selectedSeats.filter(seat => seat !== seatId);
    } else {
        // Check if max seats reached
        if (selectedSeats.length >= maxSeatsAllowed) {
            alert(`You can only select ${maxSeatsAllowed} seat(s) for ${maxSeatsAllowed} passenger(s).`);
            return;
        }
        
        // Select seat
        element.classList.remove('available');
        element.classList.add('selected');
        if (!selectedSeats.includes(seatId)) {
            selectedSeats.push(seatId);
        }
    }
    
    // Update seat count display
    updateSeatCount();
}

function updateSeatCount() {
    const seatInfo = document.querySelector('.seat-info');
    if (seatInfo) {
        seatInfo.innerHTML = `Selected: ${selectedSeats.length} / ${maxSeatsAllowed} seat(s)`;
    }
}

async function confirmSeats() {
    if (selectedSeats.length === 0) {
        alert('Please select at least one seat');
        return;
    }
    
    if (selectedSeats.length !== maxSeatsAllowed) {
        alert(`Please select exactly ${maxSeatsAllowed} seat(s) for ${maxSeatsAllowed} passenger(s).`);
        return;
    }
    
    try {
        const response = await apiRequest('/checkin/confirm', {
            method: 'POST',
            body: JSON.stringify({
                booking_id: currentBooking.booking_id,
                seat_numbers: selectedSeats
            })
        });

        if (response.success) {
            // Update booking with check-in data
            currentBooking.gate_number = response.data.gate_number || 'TBA';
            currentBooking.boarding_time = response.data.boarding_time;
            currentBooking.seats = selectedSeats;
            
            document.getElementById('seatSelection').style.display = 'none';
            document.getElementById('checkinSuccess').style.display = 'block';
            generateBoardingPass();
        } else {
            // Check if already checked in
            if (response.message && (response.message.includes('Already checked in') || response.message.includes('already checked in'))) {
                // Verify user is still authenticated before redirecting
                const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                const token = getAuthToken();
                
                if (!isLoggedIn || !token) {
                    alert('Your session has expired. Please login again.');
                    window.location.href = 'login.html';
                    return;
                }
                
                alert('You have already checked in for this flight. Please check your bookings page for your boarding pass.');
                // Use setTimeout to ensure alert is fully dismissed before redirect
                setTimeout(() => {
                    window.location.href = 'my-bookings.html';
                }, 100);
                return;
            }
            alert(response.message || 'Failed to confirm check-in. Please try again.');
        }
    } catch (error) {
        let errorMsg = error.message || 'Failed to confirm check-in. Please try again.';
        
        // Check if error message indicates already checked in - don't redirect to login
        if (errorMsg.includes('Already checked in') || errorMsg.includes('already checked in')) {
            // Verify user is still authenticated before redirecting
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const token = getAuthToken();
            
            if (!isLoggedIn || !token) {
                alert('Your session has expired. Please login again.');
                window.location.href = 'login.html';
                return;
            }
            
            alert('You have already checked in for this flight. Please check your bookings page for your boarding pass.');
            // Use setTimeout to ensure alert is fully dismissed before redirect
            setTimeout(() => {
                window.location.href = 'my-bookings.html';
            }, 100);
            return;
        }
        
        // Don't redirect to login for other errors - just show the error message
        alert(errorMsg);
    }
}

function resetSeats() {
    selectedSeats = [];
    initializeSeatMap();
}

function generateBoardingPass() {
    const boardingPass = document.getElementById('boardingPass');
    if (!currentBooking) return;
    
    const dep = new Date(currentBooking.departure_datetime);
    const arr = new Date(currentBooking.arrival_datetime);
    const boarding = currentBooking.boarding_time ? new Date(currentBooking.boarding_time) : new Date(dep.getTime() - 30 * 60 * 1000);
    
    boardingPass.innerHTML = `
        <h3>✈️ SkyWings Airlines</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1.5rem;">
            <div>
                <p><strong>Flight Number:</strong> ${currentBooking.flight_number}</p>
                <p><strong>From:</strong> ${currentBooking.from_city} (${currentBooking.from_code})</p>
                <p><strong>To:</strong> ${currentBooking.to_city} (${currentBooking.to_code})</p>
            </div>
            <div>
                <p><strong>Departure:</strong> ${dep.toLocaleString()}</p>
                <p><strong>Arrival:</strong> ${arr.toLocaleString()}</p>
                <p><strong>Boarding Time:</strong> ${boarding.toLocaleString()}</p>
            </div>
        </div>
        <div style="margin-top: 1.5rem;">
            <p><strong>Booking Reference:</strong> ${currentBooking.booking_reference}</p>
            <p><strong>Seats:</strong> ${selectedSeats.join(', ')}</p>
            <p><strong>Gate:</strong> ${currentBooking.gate_number || 'TBA'}</p>
            <p><strong>Class:</strong> ${currentBooking.class || 'Economy'}</p>
        </div>
        ${currentBooking.passengers ? `
        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.2);">
            <p><strong>Passengers:</strong></p>
            ${currentBooking.passengers.map(p => `<p>• ${p.first_name} ${p.last_name}</p>`).join('')}
        </div>
        ` : ''}
    `;
}

function downloadBoardingPass() {
    if (!currentBooking) {
        alert('No boarding pass data available');
        return;
    }
    
    // Check if jsPDF is available, if not load it
    if (typeof window.jsPDF === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => generatePDF();
        document.head.appendChild(script);
    } else {
        generatePDF();
    }
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const dep = new Date(currentBooking.departure_datetime);
    const arr = new Date(currentBooking.arrival_datetime);
    const boarding = currentBooking.boarding_time ? new Date(currentBooking.boarding_time) : new Date(dep.getTime() - 30 * 60 * 1000);
    
    // Add airline logo/text
    doc.setFontSize(20);
    doc.setTextColor(11, 99, 197);
    doc.text('✈️ SkyWings Airlines', 105, 20, { align: 'center' });
    
    // Add boarding pass title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('BOARDING PASS', 105, 35, { align: 'center' });
    
    // Flight details
    doc.setFontSize(12);
    doc.text(`Flight: ${currentBooking.flight_number}`, 20, 50);
    doc.text(`Booking Ref: ${currentBooking.booking_reference}`, 20, 58);
    
    // Route
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`${currentBooking.from_code}`, 20, 70);
    doc.text('→', 50, 70);
    doc.text(`${currentBooking.to_code}`, 70, 70);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`${currentBooking.from_city}`, 20, 78);
    doc.text(`${currentBooking.to_city}`, 70, 78);
    
    // Dates and times
    doc.setFontSize(10);
    doc.text(`Departure: ${dep.toLocaleString()}`, 20, 90);
    doc.text(`Arrival: ${arr.toLocaleString()}`, 20, 98);
    doc.text(`Boarding: ${boarding.toLocaleString()}`, 20, 106);
    
    // Seat and gate
    doc.text(`Seats: ${selectedSeats.join(', ')}`, 120, 90);
    doc.text(`Gate: ${currentBooking.gate_number || 'TBA'}`, 120, 98);
    doc.text(`Class: ${currentBooking.class || 'Economy'}`, 120, 106);
    
    // Passengers
    if (currentBooking.passengers && currentBooking.passengers.length > 0) {
        doc.text('Passengers:', 20, 120);
        currentBooking.passengers.forEach((p, i) => {
            doc.text(`${i + 1}. ${p.first_name} ${p.last_name}`, 25, 128 + (i * 8));
        });
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Thank you for choosing SkyWings Airlines!', 105, 280, { align: 'center' });
    
    // Save PDF
    doc.save(`BoardingPass_${currentBooking.booking_reference}.pdf`);
}

// ========== PROFILE ==========

let userProfileData = null;

// Load user profile on page load
async function loadUserProfile() {
    if (!window.location.pathname.includes('user-profile')) return;
    
    try {
        const response = await apiRequest('/users/profile');
        if (response.success && response.data.user) {
            userProfileData = response.data.user;
            populateProfileForm(userProfileData);
            updateProfileAvatar(userProfileData);
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

function populateProfileForm(user) {
    const form = document.querySelector('#personal form');
    if (!form) return;
    
    if (form.querySelector('[name="firstName"]')) form.querySelector('[name="firstName"]').value = user.firstName || '';
    if (form.querySelector('[name="lastName"]')) form.querySelector('[name="lastName"]').value = user.lastName || '';
    if (form.querySelector('[name="email"]')) form.querySelector('[name="email"]').value = user.email || '';
    if (form.querySelector('[name="phone"]')) form.querySelector('[name="phone"]').value = user.phone || '';
    if (form.querySelector('[name="dob"]')) form.querySelector('[name="dob"]').value = user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '';
    if (form.querySelector('[name="address"]')) form.querySelector('[name="address"]').value = user.address || '';
}

function updateProfileAvatar(user) {
    const avatarCircle = document.querySelector('.avatar-circle');
    const nameElement = document.querySelector('.profile-avatar h3');
    const emailElement = document.querySelector('.profile-avatar p');
    
    if (avatarCircle) {
        const initials = (user.firstName?.[0] || '') + (user.lastName?.[0] || '');
        avatarCircle.textContent = initials || 'U';
    }
    if (nameElement) {
        nameElement.textContent = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
    }
    if (emailElement) {
        emailElement.textContent = user.email || '';
    }
}

function showProfileSection(event, section) {
    if (event) {
        event.preventDefault();
    }

    const targetSection = document.getElementById(section);
    if (!targetSection) return;

    const navContainer = targetSection.closest('.profile-container');
    const navLinks = navContainer ? navContainer.querySelectorAll('.profile-nav .nav-link') : document.querySelectorAll('.profile-nav .nav-link');

    document.querySelectorAll('.profile-section').forEach(sec => {
        sec.classList.remove('active');
    });
    navLinks.forEach(link => link.classList.remove('active'));

    targetSection.classList.add('active');

    const trigger = event && event.currentTarget ? event.currentTarget : Array.from(navLinks).find(link => link.getAttribute('href') === `#${section}`);
    if (trigger) {
        trigger.classList.add('active');
    }
    
    // Load section-specific data
    if (section === 'bookings') {
        loadBookingHistory();
    } else if (section === 'passengers') {
        loadSavedPassengers();
    } else if (section === 'preferences') {
        loadPreferences();
    }
}

async function handleProfileUpdate(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const updateData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        dateOfBirth: formData.get('dob'),
        address: formData.get('address')
    };
    
    try {
        const response = await apiRequest('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(updateData)
        });
        
        if (response.success) {
            alert('Profile updated successfully!');
            // Reload profile data
            await loadUserProfile();
            // Update localStorage
            localStorage.setItem('userName', `${updateData.firstName} ${updateData.lastName}`);
        } else {
            alert(response.message || 'Failed to update profile');
        }
    } catch (error) {
        alert(error.message || 'Failed to update profile');
    }
}

async function handlePasswordChange(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');
    
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    try {
        const response = await apiRequest('/users/password', {
            method: 'PUT',
            body: JSON.stringify({
                currentPassword,
                newPassword,
                confirmPassword
            })
        });
        
        if (response.success) {
            alert('Password changed successfully!');
            event.target.reset();
        } else {
            alert(response.message || 'Failed to change password');
        }
    } catch (error) {
        alert(error.message || 'Failed to change password');
    }
}

async function loadBookingHistory() {
    const historyList = document.querySelector('#bookings .history-list');
    if (!historyList) return;
    
    try {
        const response = await apiRequest('/bookings/list');
        if (response.success && response.data.bookings) {
            const bookings = response.data.bookings.slice(0, 10); // Show last 10
            
            if (bookings.length === 0) {
                historyList.innerHTML = '<div class="empty-state"><p>No booking history</p></div>';
            } else {
                historyList.innerHTML = bookings.map(booking => {
                    const dep = new Date(booking.departure_datetime);
                    return `
                        <div class="history-item">
                            <div class="history-info">
                                <h4>${booking.from_city} → ${booking.to_city}</h4>
                                <p>${dep.toLocaleDateString()} - ${booking.flight_number}</p>
                                <p>Booking: ${booking.booking_reference}</p>
                            </div>
                            <div class="history-status">
                                <span class="status-badge status-${booking.status}">${booking.status}</span>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
    } catch (error) {
        console.error('Error loading booking history:', error);
        historyList.innerHTML = '<div class="empty-state"><p>Failed to load booking history</p></div>';
    }
}

async function loadSavedPassengers() {
    const passengersList = document.getElementById('passengersList');
    if (!passengersList) return;
    
    try {
        const response = await apiRequest('/users/passengers');
        if (response.success && response.data.passengers) {
            const passengers = response.data.passengers;
            
            if (passengers.length === 0) {
                passengersList.innerHTML = '<div class="empty-state"><p>No saved passengers</p></div>';
            } else {
                passengersList.innerHTML = passengers.map(p => {
                    const dob = p.date_of_birth ? new Date(p.date_of_birth).toLocaleDateString() : 'N/A';
                    return `
                        <div class="history-item">
                            <div class="history-info">
                                <h4>${p.first_name} ${p.last_name}</h4>
                                <p>DOB: ${dob}</p>
                                ${p.passport_number ? `<p>Passport: ${p.passport_number}</p>` : ''}
                                ${p.nationality ? `<p>Nationality: ${p.nationality}</p>` : ''}
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
    } catch (error) {
        console.error('Error loading passengers:', error);
        passengersList.innerHTML = '<div class="empty-state"><p>Failed to load saved passengers</p></div>';
    }
}

function loadPreferences() {
    // Load preferences from localStorage or API
    const preferredSeat = localStorage.getItem('preferredSeat') || 'window';
    const mealPreference = localStorage.getItem('mealPreference') || 'non-vegetarian';
    const newsletter = localStorage.getItem('newsletter') === 'true';
    
    const form = document.querySelector('#preferences form');
    if (form) {
        if (form.querySelector('[name="preferredSeat"]')) {
            form.querySelector('[name="preferredSeat"]').value = preferredSeat;
        }
        if (form.querySelector('[name="mealPreference"]')) {
            form.querySelector('[name="mealPreference"]').value = mealPreference;
        }
        if (form.querySelector('[name="newsletter"]')) {
            form.querySelector('[name="newsletter"]').checked = newsletter;
        }
        
        // Add submit handler
        form.onsubmit = handlePreferencesSave;
    }
}

function handlePreferencesSave(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    localStorage.setItem('preferredSeat', formData.get('preferredSeat'));
    localStorage.setItem('mealPreference', formData.get('mealPreference'));
    localStorage.setItem('newsletter', formData.get('newsletter') ? 'true' : 'false');
    
    alert('Preferences saved successfully!');
}

function showAddPassengerForm() {
    const firstName = prompt('Enter first name:');
    if (!firstName) return;
    
    const lastName = prompt('Enter last name:');
    if (!lastName) return;
    
    const dob = prompt('Enter date of birth (YYYY-MM-DD):');
    const passport = prompt('Enter passport number (optional):');
    const nationality = prompt('Enter nationality (optional):');
    
    addPassenger({
        firstName,
        lastName,
        dateOfBirth: dob || null,
        passportNumber: passport || null,
        nationality: nationality || null
    });
}

async function addPassenger(passengerData) {
    try {
        const response = await apiRequest('/users/passengers', {
            method: 'POST',
            body: JSON.stringify(passengerData)
        });
        
        if (response.success) {
            alert('Passenger added successfully!');
            loadSavedPassengers();
        } else {
            alert(response.message || 'Failed to add passenger');
        }
    } catch (error) {
        alert(error.message || 'Failed to add passenger');
    }
}

// ========== ADMIN FUNCTIONS ==========

function showAddFlightModal() {
    const form = document.querySelector('#flightModal form');
    form.reset();
    delete form.dataset.flightId;
    document.getElementById('modalTitle').textContent = 'Add New Flight';
    document.getElementById('flightModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('flightModal').style.display = 'none';
}

async function handleFlightSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const form = event.target;
    const flightId = form.dataset.flightId;
    
    const flightNumber = formData.get('flightNumber');
    const from = formData.get('from');
    const to = formData.get('to');
    const departure = formData.get('departure');
    const arrival = formData.get('arrival');
    const basePrice = formData.get('basePrice');
    const businessPrice = formData.get('businessPrice');
    const firstClassPrice = formData.get('firstClassPrice');
    const aircraftId = formData.get('aircraftId');
    const status = formData.get('status') || 'scheduled';
    
    // Validate required fields
    if (!flightNumber || !from || !to || !departure || !basePrice || !aircraftId) {
        alert('Please fill in all required fields: Flight Number, From, To, Departure, Base Price, and Aircraft');
        return;
    }
    
    // Convert datetime-local to MySQL datetime format (YYYY-MM-DD HH:mm:ss)
    let departureDateTime = null;
    if (departure) {
        // datetime-local format: "YYYY-MM-DDTHH:mm"
        // MySQL format: "YYYY-MM-DD HH:mm:ss"
        if (departure.includes('T')) {
            departureDateTime = departure.replace('T', ' ') + ':00';
        } else {
            // If it's already in correct format or needs conversion
            const depDate = new Date(departure);
            if (!isNaN(depDate.getTime())) {
                const year = depDate.getFullYear();
                const month = String(depDate.getMonth() + 1).padStart(2, '0');
                const day = String(depDate.getDate()).padStart(2, '0');
                const hours = String(depDate.getHours()).padStart(2, '0');
                const minutes = String(depDate.getMinutes()).padStart(2, '0');
                departureDateTime = `${year}-${month}-${day} ${hours}:${minutes}:00`;
            } else {
                alert('Invalid departure date format');
                return;
            }
        }
    }
    
    // Calculate arrival if not provided (add 6 hours to departure)
    let arrivalDateTime = null;
    if (!arrival && departure) {
        const depDate = new Date(departure);
        depDate.setHours(depDate.getHours() + 6);
        const year = depDate.getFullYear();
        const month = String(depDate.getMonth() + 1).padStart(2, '0');
        const day = String(depDate.getDate()).padStart(2, '0');
        const hours = String(depDate.getHours()).padStart(2, '0');
        const minutes = String(depDate.getMinutes()).padStart(2, '0');
        arrivalDateTime = `${year}-${month}-${day} ${hours}:${minutes}:00`;
    } else if (arrival) {
        // datetime-local format: "YYYY-MM-DDTHH:mm"
        // MySQL format: "YYYY-MM-DD HH:mm:ss"
        if (arrival.includes('T')) {
            arrivalDateTime = arrival.replace('T', ' ') + ':00';
        } else {
            const arrDate = new Date(arrival);
            if (!isNaN(arrDate.getTime())) {
                const year = arrDate.getFullYear();
                const month = String(arrDate.getMonth() + 1).padStart(2, '0');
                const day = String(arrDate.getDate()).padStart(2, '0');
                const hours = String(arrDate.getHours()).padStart(2, '0');
                const minutes = String(arrDate.getMinutes()).padStart(2, '0');
                arrivalDateTime = `${year}-${month}-${day} ${hours}:${minutes}:00`;
            } else {
                alert('Invalid arrival date format');
                return;
            }
        }
    }
    
    console.log('Flight submission data:', {
        flightNumber,
        aircraftId,
        from,
        to,
        departure: departureDateTime,
        arrival: arrivalDateTime,
        basePrice,
        businessPrice,
        firstClassPrice,
        status
    });
    
    try {
        let response;
        if (flightId) {
            // Update existing flight
            response = await apiRequest(`/admin/flights/${flightId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    flight_number: flightNumber,
                    aircraft_id: parseInt(aircraftId) || 1,
                    from_airport_code: from,
                    to_airport_code: to,
                    departure_datetime: departureDateTime,
                    arrival_datetime: arrivalDateTime,
                    base_price: parseFloat(basePrice) || 299.99,
                    business_price: businessPrice ? parseFloat(businessPrice) : null,
                    first_class_price: firstClassPrice ? parseFloat(firstClassPrice) : null,
                    status: status
                })
            });
        } else {
            // Create new flight
            const flightData = {
                flight_number: flightNumber,
                aircraft_id: parseInt(aircraftId) || 1,
                from_airport_code: from,
                to_airport_code: to,
                departure_datetime: departureDateTime,
                arrival_datetime: arrivalDateTime,
                base_price: parseFloat(basePrice) || 299.99,
                business_price: businessPrice ? parseFloat(businessPrice) : null,
                first_class_price: firstClassPrice ? parseFloat(firstClassPrice) : null,
                status: status
            };
            
            console.log('Sending flight data:', flightData);
            
            response = await apiRequest('/admin/flights', {
                method: 'POST',
                body: JSON.stringify(flightData)
            });
        }
        
        if (response && response.success) {
            alert(flightId ? 'Flight updated successfully!' : 'Flight added successfully!');
            closeModal();
            form.reset();
            delete form.dataset.flightId;
            // Reload flights immediately
            await loadAdminFlights();
        } else {
            throw new Error(response?.message || 'Failed to save flight');
        }
    } catch (error) {
        alert(error.message || 'Failed to save flight');
    }
}

async function editFlight(flightId) {
    try {
        const response = await apiRequest(`/flights/${flightId}`);
        if (response.success && response.data.flight) {
            const flight = response.data.flight;
            const form = document.querySelector('#flightModal form');
            form.dataset.flightId = flightId;
            
            form.querySelector('[name="flightNumber"]').value = flight.flight_number;
            form.querySelector('[name="from"]').value = flight.from_airport_code;
            form.querySelector('[name="to"]').value = flight.to_airport_code;
            form.querySelector('[name="departure"]').value = new Date(flight.departure_datetime).toISOString().slice(0, 16);
            form.querySelector('[name="arrival"]').value = new Date(flight.arrival_datetime).toISOString().slice(0, 16);
            form.querySelector('[name="basePrice"]').value = flight.base_price;
            form.querySelector('[name="businessPrice"]').value = flight.business_price;
            form.querySelector('[name="firstClassPrice"]').value = flight.first_class_price;
            form.querySelector('[name="aircraftId"]').value = flight.aircraft_id;
            form.querySelector('[name="status"]').value = flight.status;
            
            document.getElementById('modalTitle').textContent = 'Edit Flight';
            document.getElementById('flightModal').style.display = 'flex';
        }
    } catch (error) {
        alert('Failed to load flight details');
    }
}

async function deleteFlight(flightId) {
    if (!confirm(`Are you sure you want to delete flight ${flightId}? This action cannot be undone.`)) {
        return;
    }
    
    try {
        console.log('Deleting flight:', flightId);
        const response = await apiRequest(`/admin/flights/${flightId}`, {
            method: 'DELETE'
        });
        
        console.log('Delete response:', response);
        
        if (response && response.success) {
            alert('Flight deleted successfully!');
            // Force reload flights immediately with current page
            await loadAdminFlights(adminFlightsState?.currentPage || 1, '');
        } else {
            throw new Error(response?.message || 'Failed to delete flight');
        }
    } catch (error) {
        console.error('Delete flight error:', error);
        alert(error.message || 'Failed to delete flight. Check console for details.');
    }
}

// Admin flights state
let adminFlightsState = {
    currentPage: 1,
    totalPages: 1,
    allFlights: [],
    filteredFlights: []
};

async function loadAdminFlights(page = 1, searchQuery = '') {
    const tbody = document.querySelector('#flightsTab .admin-table tbody');
    if (!tbody) return;
    
    // Show loading state
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Loading flights...</td></tr>';
    
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: '50'
        });
        
        if (searchQuery) {
            params.append('search', searchQuery);
        }
        
        const response = await apiRequest(`/admin/flights?${params}`);
        
        if (!response || !response.success || !response.data) {
            throw new Error(response?.message || 'Failed to load flights');
        }
        
        const flights = response.data.flights || [];
        const pagination = response.data.pagination || { page: 1, totalPages: 1, total: 0 };
        
        // Update state
        adminFlightsState.currentPage = pagination.page;
        adminFlightsState.totalPages = pagination.totalPages;
        adminFlightsState.allFlights = flights;
        adminFlightsState.filteredFlights = flights;
        
        // Render flights efficiently using document fragment
        if (flights.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No flights found. Click "Add Flight" to create one!</td></tr>';
            updatePaginationControls();
            return;
        }
        
        // Use document fragment for better performance
        const fragment = document.createDocumentFragment();
        const tempDiv = document.createElement('div');
        
        flights.forEach(flight => {
            const dep = new Date(flight.departure_datetime);
            const arr = new Date(flight.arrival_datetime);
            const fromCity = flight.from_city || flight.from_name || flight.from_airport_code || 'N/A';
            const toCity = flight.to_city || flight.to_name || flight.to_airport_code || 'N/A';
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${flight.flight_id}</td>
                <td><strong>${flight.flight_number}</strong><br>${fromCity} → ${toCity}</td>
                <td>${dep.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                <td>${arr.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                <td><span class="status-badge status-${flight.status}">${flight.status}</span></td>
                <td>
                    <button class="btn btn-sm" onclick="editFlight(${flight.flight_id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteFlight(${flight.flight_id})">Delete</button>
                </td>
            `;
            fragment.appendChild(tr);
        });
        
        tbody.innerHTML = '';
        tbody.appendChild(fragment);
        
        // Update pagination controls
        updatePaginationControls();
        
    } catch (error) {
        console.error('Error loading flights:', error);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red; padding: 20px;">
            <strong>Error loading flights:</strong><br>
            ${error.message}
        </td></tr>`;
    }
}

function updatePaginationControls() {
    let paginationContainer = document.getElementById('flightsPagination');
    
    if (!paginationContainer) {
        // Create pagination container if it doesn't exist
        const toolbar = document.querySelector('#flightsTab .admin-toolbar');
        if (toolbar) {
            paginationContainer = document.createElement('div');
            paginationContainer.id = 'flightsPagination';
            paginationContainer.className = 'pagination-controls';
            toolbar.appendChild(paginationContainer);
        }
    }
    
    if (paginationContainer && adminFlightsState.totalPages > 1) {
        let paginationHTML = '<div style="display: flex; gap: 10px; align-items: center; margin-top: 10px;">';
        paginationHTML += `<span>Page ${adminFlightsState.currentPage} of ${adminFlightsState.totalPages}</span>`;
        
        if (adminFlightsState.currentPage > 1) {
            paginationHTML += `<button class="btn btn-sm" onclick="loadAdminFlights(${adminFlightsState.currentPage - 1})">Previous</button>`;
        }
        
        if (adminFlightsState.currentPage < adminFlightsState.totalPages) {
            paginationHTML += `<button class="btn btn-sm" onclick="loadAdminFlights(${adminFlightsState.currentPage + 1})">Next</button>`;
        }
        
        paginationHTML += '</div>';
        paginationContainer.innerHTML = paginationHTML;
    } else if (paginationContainer) {
        paginationContainer.innerHTML = '';
    }
}

async function loadAdminBookings() {
    const tbody = document.querySelector('#bookingsTab .admin-table tbody');
    if (!tbody) return;
    
    // Show loading state
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Loading bookings...</td></tr>';
    
    try {
        const response = await apiRequest('/admin/bookings');
        if (response.success && response.data.bookings) {
            const bookings = response.data.bookings || [];
            
            if (bookings.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No bookings found</td></tr>';
            } else {
                // Use document fragment for smoother rendering
                const fragment = document.createDocumentFragment();
                
                bookings.forEach(booking => {
                    const date = new Date(booking.booking_date);
                    const status = booking.status || 'pending';
                    const canCancel = status !== 'cancelled' && status !== 'completed';
                    const tr = document.createElement('tr');
                    tr.setAttribute('data-status', status);
                    tr.innerHTML = `
                        <td data-label="Booking ID">${booking.booking_reference || 'N/A'}</td>
                        <td data-label="User">${(booking.user_first_name || '')} ${(booking.user_last_name || '')}</td>
                        <td data-label="Flight">${booking.flight_number || 'N/A'}</td>
                        <td data-label="Date">${date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                        <td data-label="Amount">$${parseFloat(booking.total_amount || 0).toFixed(2)}</td>
                        <td data-label="Status"><span class="status-badge status-${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
                        <td data-label="Actions">
                            <button class="btn btn-sm" onclick="viewBookingDetails(${booking.booking_id})">View</button>
                            ${canCancel ? `<button class="btn btn-sm btn-danger" onclick="adminCancelBooking(${booking.booking_id})">Cancel</button>` : ''}
                        </td>
                    `;
                    fragment.appendChild(tr);
                });
                
                // Clear and append in one operation for smoother rendering
                tbody.innerHTML = '';
                tbody.appendChild(fragment);
            }
        } else {
            throw new Error('Failed to load bookings');
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: red; padding: 20px;">Error loading bookings: ${error.message}</td></tr>`;
    }
}

async function loadAdminUsers() {
    const tbody = document.querySelector('#usersTab .admin-table tbody');
    if (!tbody) return;
    
    // Show loading state
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Loading users...</td></tr>';
    
    try {
        const response = await apiRequest('/admin/users');
        
        if (response.success && response.data && response.data.users) {
            const users = response.data.users || [];
            
            if (users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No users found</td></tr>';
            } else {
                // Use document fragment for smoother rendering
                const fragment = document.createDocumentFragment();
                
                users.forEach(user => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${user.user_id || 'N/A'}</td>
                        <td>${(user.first_name || '')} ${(user.last_name || '')}</td>
                        <td>${user.email || 'N/A'}</td>
                        <td>${user.phone || 'N/A'}</td>
                        <td><span class="status-badge status-${user.role || 'user'}">${(user.role || 'user').charAt(0).toUpperCase() + (user.role || 'user').slice(1)}</span></td>
                        <td><span class="status-badge status-${user.status || 'active'}">${(user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1)}</span></td>
                        <td>
                            <button class="btn btn-sm" onclick="viewUser(${user.user_id})">View</button>
                            <button class="btn btn-sm" onclick="editUserStatus(${user.user_id}, '${user.status || 'active'}')">Status</button>
                        </td>
                    `;
                    fragment.appendChild(tr);
                });
                
                tbody.innerHTML = '';
                tbody.appendChild(fragment);
            }
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: red; padding: 20px;">Error loading users: ${error.message}</td></tr>`;
    }
}

// Debounce function for search
let searchFlightsTimeout;
function searchFlights(query) {
    // Clear previous timeout
    clearTimeout(searchFlightsTimeout);
    
    // Debounce: wait 300ms after user stops typing
    searchFlightsTimeout = setTimeout(() => {
        if (query.trim() === '') {
            // If search is empty, reload first page
            loadAdminFlights(1, '');
        } else {
            // Search on server side
            loadAdminFlights(1, query.trim());
        }
    }, 300);
}

function searchBookings(query) {
    const tbody = document.querySelector('#bookingsTab .admin-table tbody');
    if (!tbody) return;
    
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
    });
}

function searchUsers(query) {
    const tbody = document.querySelector('#usersTab .admin-table tbody');
    if (!tbody) return;
    
    const rows = tbody.querySelectorAll('tr');
    if (rows.length === 0) return;
    
    const queryLower = query.toLowerCase().trim();
    
    rows.forEach(row => {
        // Skip empty/loading rows
        if (row.hasAttribute('data-empty-row') || row.textContent.includes('Loading') || row.textContent.includes('Error')) {
            return;
        }
        
        const text = row.textContent.toLowerCase();
        row.style.display = queryLower === '' || text.includes(queryLower) ? '' : 'none';
    });
}

async function viewBookingDetails(bookingId) {
    try {
        console.log('Loading booking details for ID:', bookingId);
        
        // Check if we're in admin context (admin-management page)
        const isAdminContext = window.location.pathname.includes('admin-management');
        const endpoint = isAdminContext ? `/admin/bookings/${bookingId}` : `/bookings/${bookingId}`;
        
        console.log('Using endpoint:', endpoint);
        const response = await apiRequest(endpoint);
        console.log('Booking details response:', response);
        
        if (response.success && response.data && response.data.booking) {
            const booking = response.data.booking;
            const dep = new Date(booking.departure_datetime);
            const arr = new Date(booking.arrival_datetime);
            
            // Build details message
            let details = `Booking Details:\n\n`;
            details += `Reference: ${booking.booking_reference}\n`;
            details += `Flight: ${booking.flight_number}\n`;
            details += `Route: ${booking.from_city || booking.from_name} → ${booking.to_city || booking.to_name}\n`;
            details += `Departure: ${dep.toLocaleString()}\n`;
            details += `Arrival: ${arr.toLocaleString()}\n`;
            details += `Class: ${booking.class}\n`;
            details += `Passengers: ${booking.number_of_passengers}\n`;
            details += `Amount: $${parseFloat(booking.total_amount).toFixed(2)}\n`;
            details += `Status: ${booking.status}\n`;
            details += `Payment Status: ${booking.payment_status || 'N/A'}\n`;
            
            // Add user info if in admin context
            if (isAdminContext && booking.user_first_name) {
                details += `\nUser: ${booking.user_first_name} ${booking.user_last_name}\n`;
                details += `Email: ${booking.user_email || 'N/A'}\n`;
            }
            
            // Add passengers if available
            if (booking.passengers && booking.passengers.length > 0) {
                details += `\nPassengers:\n`;
                booking.passengers.forEach((p, idx) => {
                    details += `  ${idx + 1}. ${p.first_name} ${p.last_name}`;
                    if (p.seat_number) details += ` (Seat: ${p.seat_number})`;
                    details += `\n`;
                });
            }
            
            alert(details);
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Error loading booking details:', error);
        alert('Failed to load booking details: ' + (error.message || 'Unknown error'));
    }
}

async function adminCancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await apiRequest(`/bookings/${bookingId}/cancel`, {
            method: 'POST'
        });

        if (response.success) {
            alert('Booking cancelled successfully');
            loadAdminBookings();
        } else {
            throw new Error(response.message || 'Failed to cancel booking');
        }
    } catch (error) {
        console.error('Admin cancel booking error:', error);
        alert(error.message || 'Failed to cancel booking. Please try again.');
    }
}

async function viewUser(userId) {
    try {
        // Get user details from the users list (already loaded)
        const response = await apiRequest('/admin/users');
        if (response.success && response.data.users) {
            const user = response.data.users.find(u => u.user_id === userId);
            if (user) {
                const createdDate = user.created_at ? new Date(user.created_at) : new Date();
                let details = `User Details:\n\n`;
                details += `ID: ${user.user_id}\n`;
                details += `Name: ${user.first_name} ${user.last_name}\n`;
                details += `Email: ${user.email}\n`;
                details += `Phone: ${user.phone || 'N/A'}\n`;
                details += `Date of Birth: ${user.date_of_birth || 'N/A'}\n`;
                details += `Address: ${user.address || 'N/A'}\n`;
                details += `Role: ${user.role}\n`;
                details += `Status: ${user.status || 'active'}\n`;
                details += `Created: ${createdDate.toLocaleDateString()}\n`;
                alert(details);
            } else {
                alert('User not found');
            }
        }
    } catch (error) {
        console.error('Error viewing user:', error);
        alert('Failed to load user details');
    }
}

async function editUserStatus(userId, currentStatus) {
    const statuses = ['active', 'inactive', 'suspended'];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    const newStatus = statuses[nextIndex];
    
    if (!confirm(`Change user ${userId} status from ${currentStatus} to ${newStatus}?`)) {
        return;
    }
    
    try {
        const response = await apiRequest(`/admin/users/${userId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.success) {
            alert('User status updated successfully!');
            loadAdminUsers();
        } else {
            throw new Error(response.message || 'Failed to update status');
        }
    } catch (error) {
        console.error('Error updating user status:', error);
        alert('Failed to update user status: ' + error.message);
    }
}

// ========== AIRCRAFT MANAGEMENT ==========

async function loadAdminAircraft() {
    const tbody = document.querySelector('#aircraftTab .admin-table tbody');
    if (!tbody) return;
    
    // Show loading state
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Loading aircraft...</td></tr>';
    
    try {
        const response = await apiRequest('/admin/aircraft');
        
        if (response.success && response.data && response.data.aircraft) {
            const aircraft = response.data.aircraft || [];
            
            if (aircraft.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No aircraft found. Click "Add Aircraft" to create one!</td></tr>';
            } else {
                // Use document fragment for smoother rendering
                const fragment = document.createDocumentFragment();
                
                aircraft.forEach(ac => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${ac.aircraft_id || 'N/A'}</td>
                        <td><strong>${ac.model || 'N/A'}</strong></td>
                        <td><code>${ac.registration || 'N/A'}</code></td>
                        <td>${ac.capacity || 0} <span style="color: rgba(255, 255, 255, 0.7); font-size: 0.9em;">seats</span></td>
                        <td><span class="status-badge status-${ac.status || 'active'}">${(ac.status || 'active').charAt(0).toUpperCase() + (ac.status || 'active').slice(1)}</span></td>
                        <td>
                            <button class="btn btn-sm" onclick="editAircraft(${ac.aircraft_id})" title="Edit aircraft">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteAircraft(${ac.aircraft_id})" title="Delete aircraft">Delete</button>
                        </td>
                    `;
                    fragment.appendChild(tr);
                });
                
                tbody.innerHTML = '';
                tbody.appendChild(fragment);
            }
        } else {
            throw new Error('Failed to load aircraft');
        }
    } catch (error) {
        console.error('Error loading aircraft:', error);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red; padding: 20px;">Error loading aircraft: ${error.message}</td></tr>`;
    }
}

function showAddAircraftModal() {
    const modal = document.getElementById('aircraftModal');
    if (modal) {
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            delete form.dataset.aircraftId;
        }
        document.getElementById('aircraftModalTitle').textContent = 'Add New Aircraft';
        modal.style.display = 'flex';
    }
}

function closeAircraftModal() {
    const modal = document.getElementById('aircraftModal');
    if (modal) {
        modal.style.display = 'none';
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            delete form.dataset.aircraftId;
        }
    }
}

async function handleAircraftSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const aircraftId = form.dataset.aircraftId;
    
    const model = formData.get('model');
    const registration = formData.get('registration').toUpperCase();
    const capacity = formData.get('capacity');
    const status = formData.get('status');
    
    try {
        let response;
        if (aircraftId) {
            // Update existing aircraft
            response = await apiRequest(`/admin/aircraft/${aircraftId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    model,
                    registration,
                    capacity: parseInt(capacity),
                    status
                })
            });
        } else {
            // Create new aircraft
            response = await apiRequest('/admin/aircraft', {
                method: 'POST',
                body: JSON.stringify({
                    model,
                    registration,
                    capacity: parseInt(capacity),
                    status
                })
            });
        }
        
        if (response.success) {
            alert(aircraftId ? 'Aircraft updated successfully!' : 'Aircraft added successfully!');
            closeAircraftModal();
            loadAdminAircraft();
        } else {
            throw new Error(response.message || 'Failed to save aircraft');
        }
    } catch (error) {
        alert(error.message || 'Failed to save aircraft');
    }
}

async function editAircraft(aircraftId) {
    try {
        const response = await apiRequest('/admin/aircraft');
        if (response.success && response.data.aircraft) {
            const aircraft = response.data.aircraft.find(a => a.aircraft_id === aircraftId);
            if (aircraft) {
                const modal = document.getElementById('aircraftModal');
                const form = modal.querySelector('form');
                
                form.dataset.aircraftId = aircraftId;
                form.querySelector('[name="model"]').value = aircraft.model;
                form.querySelector('[name="registration"]').value = aircraft.registration;
                form.querySelector('[name="capacity"]').value = aircraft.capacity;
                form.querySelector('[name="status"]').value = aircraft.status;
                
                document.getElementById('aircraftModalTitle').textContent = 'Edit Aircraft';
                modal.style.display = 'flex';
            } else {
                throw new Error('Aircraft not found');
            }
        }
    } catch (error) {
        alert('Failed to load aircraft details: ' + error.message);
    }
}

async function deleteAircraft(aircraftId) {
    if (!confirm(`Are you sure you want to delete aircraft ${aircraftId}? This action cannot be undone.`)) {
        return;
    }
    
    try {
        const response = await apiRequest(`/admin/aircraft/${aircraftId}`, {
            method: 'DELETE'
        });
        
        if (response.success) {
            alert('Aircraft deleted successfully!');
            loadAdminAircraft();
        } else {
            throw new Error(response.message || 'Failed to delete aircraft');
        }
    } catch (error) {
        alert('Failed to delete aircraft: ' + error.message);
    }
}

async function exportReport(type) {
    try {
        let endpoint = '';
        let filename = '';
        
        switch(type) {
            case 'overview':
                endpoint = '/reports/overview';
                filename = 'overview-report';
                break;
            case 'revenue':
                endpoint = '/reports/revenue';
                filename = 'revenue-report';
                break;
            case 'bookings':
                endpoint = '/reports/bookings';
                filename = 'bookings-report';
                break;
            case 'routes':
                endpoint = '/reports/routes';
                filename = 'routes-report';
                break;
            case 'performance':
                endpoint = '/reports/performance';
                filename = 'performance-report';
                break;
            default:
                alert('Invalid report type');
                return;
        }
        
        const response = await apiRequest(endpoint);
        
        if (response.success && response.data) {
            // Convert data to CSV format with clear structure
            let csv = '';
            const data = response.data;
            const timestamp = new Date().toLocaleString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            switch(type) {
                case 'overview':
                    csv = `SKYWINGS AIRLINES - OVERVIEW REPORT\n`;
                    csv += `=====================================\n`;
                    csv += `Generated: ${timestamp}\n`;
                    csv += `Report Type: Overview Statistics\n\n`;
                    
                    csv += `REVENUE SUMMARY\n`;
                    csv += `---------------\n`;
                    const totalRev = data.revenue?.total || data.totalRevenue || 0;
                    const monthlyRev = data.revenue?.monthly || data.monthlyRevenue || 0;
                    csv += `Total Revenue (All Time),$${totalRev.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
                    csv += `Monthly Revenue (Current Month),$${monthlyRev.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n`;
                    
                    csv += `BOOKING SUMMARY\n`;
                    csv += `---------------\n`;
                    const totalBk = data.bookings?.total || data.totalBookings || 0;
                    const monthlyBk = data.bookings?.monthly || data.monthlyBookings || 0;
                    csv += `Total Bookings (All Time),${totalBk.toLocaleString()}\n`;
                    csv += `Monthly Bookings (Current Month),${monthlyBk.toLocaleString()}\n\n`;
                    
                    csv += `PERFORMANCE METRICS\n`;
                    csv += `-------------------\n`;
                    csv += `On-Time Rate,${data.performance?.onTimeRate || data.onTimeRate || 0}%\n`;
                    csv += `Occupancy Rate,${data.performance?.occupancyRate || 0}%\n`;
                    csv += `Customer Satisfaction,${data.performance?.customerSatisfaction || 0}/5\n\n`;
                    
                    if (data.popularRoutes && data.popularRoutes.length > 0) {
                        csv += `POPULAR ROUTES (Top ${data.popularRoutes.length})\n`;
                        csv += `-----------------------------------\n`;
                        csv += `Rank,Route,Number of Bookings\n`;
                        data.popularRoutes.forEach((route, index) => {
                            csv += `${index + 1},${route.route},${route.booking_count}\n`;
                        });
                    }
                    break;
                    
                case 'revenue':
                    csv = `SKYWINGS AIRLINES - REVENUE REPORT\n`;
                    csv += `==================================\n`;
                    csv += `Generated: ${timestamp}\n`;
                    csv += `Report Type: Revenue Analysis\n\n`;
                    
                    csv += `REVENUE SUMMARY\n`;
                    csv += `---------------\n`;
                    csv += `Total Revenue (All Time),$${(data.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
                    csv += `Monthly Revenue (Current Month),$${(data.monthlyRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
                    csv += `Growth Rate,${data.growth || 0}%\n\n`;
                    
                    if (data.revenueByRoute && data.revenueByRoute.length > 0) {
                        csv += `REVENUE BY ROUTE\n`;
                        csv += `----------------\n`;
                        csv += `Rank,Route,Revenue (USD)\n`;
                        data.revenueByRoute.forEach((route, index) => {
                            csv += `${index + 1},${route.route},$${parseFloat(route.revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
                        });
                    }
                    break;
                    
                case 'bookings':
                    csv = `SKYWINGS AIRLINES - BOOKINGS REPORT\n`;
                    csv += `===================================\n`;
                    csv += `Generated: ${timestamp}\n`;
                    csv += `Report Type: Booking Analysis\n\n`;
                    
                    csv += `BOOKING SUMMARY\n`;
                    csv += `---------------\n`;
                    csv += `Total Bookings (All Time),${(data.totalBookings || 0).toLocaleString()}\n`;
                    csv += `Monthly Bookings (Current Month),${(data.monthlyBookings || 0).toLocaleString()}\n`;
                    csv += `Growth Rate,${data.growth || 0}%\n\n`;
                    
                    if (data.bookingStatus && data.bookingStatus.length > 0) {
                        csv += `BOOKING STATUS BREAKDOWN\n`;
                        csv += `------------------------\n`;
                        csv += `Status,Count,Percentage\n`;
                        const total = data.totalBookings || 0;
                        data.bookingStatus.forEach(status => {
                            const percentage = total > 0 ? ((status.count / total) * 100).toFixed(2) : 0;
                            csv += `${status.status.charAt(0).toUpperCase() + status.status.slice(1)},${status.count},${percentage}%\n`;
                        });
                    }
                    break;
                    
                case 'routes':
                    csv = `SKYWINGS AIRLINES - ROUTES REPORT\n`;
                    csv += `=================================\n`;
                    csv += `Generated: ${timestamp}\n`;
                    csv += `Report Type: Route Analysis\n\n`;
                    
                    if (data.popularRoutes && data.popularRoutes.length > 0) {
                        csv += `POPULAR ROUTES\n`;
                        csv += `--------------\n`;
                        csv += `Rank,Route,Number of Bookings,Total Revenue (USD)\n`;
                        data.popularRoutes.forEach((route, index) => {
                            csv += `${index + 1},${route.route},${route.booking_count || 0},$${parseFloat(route.revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
                        });
                    } else {
                        csv += `No route data available.\n`;
                    }
                    break;
                    
                case 'performance':
                    csv = `SKYWINGS AIRLINES - PERFORMANCE REPORT\n`;
                    csv += `======================================\n`;
                    csv += `Generated: ${timestamp}\n`;
                    csv += `Report Type: Performance Metrics\n\n`;
                    
                    csv += `PERFORMANCE METRICS\n`;
                    csv += `-------------------\n`;
                    csv += `On-Time Rate,${data.onTimeRate || 0}%\n`;
                    csv += `Occupancy Rate,${data.occupancyRate || 0}%\n`;
                    csv += `Customer Satisfaction,${data.customerSatisfaction || 0}/5\n`;
                    csv += `Average Flight Efficiency,${data.flightEfficiency || 'N/A'}\n`;
                    break;
            }
            
            // Create and download CSV file
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            alert(`${type.charAt(0).toUpperCase() + type.slice(1)} report exported successfully!`);
        } else {
            throw new Error('Failed to fetch report data');
        }
    } catch (error) {
        console.error('Export error:', error);
        alert('Failed to export report: ' + error.message);
    }
}

// ========== CHART RENDERING FUNCTIONS ==========

function renderBarChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Chart container not found:', containerId);
        return;
    }
    
    if (!data || data.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: rgba(255,255,255,0.6); padding: 2rem;">No data available</div>';
        return;
    }
    
    const maxValue = Math.max(...data.map(d => d.max || d.value || 0));
    if (maxValue === 0) {
        container.innerHTML = '<div style="text-align: center; color: rgba(255,255,255,0.6); padding: 2rem;">No data available</div>';
        return;
    }
    
    container.innerHTML = data.map((item, index) => {
        const value = item.value || 0;
        const height = maxValue > 0 ? Math.max((value / maxValue) * 100, 5) : 5; // Minimum 5% height
        const displayValue = typeof value === 'number' ? value.toLocaleString() : value;
        return `
            <div class="chart-bar" style="height: ${height}%;" 
                 data-value="${item.label}: ${displayValue}" 
                 title="${item.label}: ${displayValue}">
            </div>
        `;
    }).join('');
}

function renderLineChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Chart container not found:', containerId);
        return;
    }
    
    if (!data || data.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: rgba(255,255,255,0.6); padding: 2rem;">No data available</div>';
        return;
    }
    
    const maxValue = Math.max(...data.map(d => d.value || 0));
    if (maxValue === 0) {
        container.innerHTML = '<div style="text-align: center; color: rgba(255,255,255,0.6); padding: 2rem;">No data available</div>';
        return;
    }
    
    const points = data.map((item, index) => {
        const x = data.length > 1 ? (index / (data.length - 1)) * 100 : 50;
        const y = 100 - ((item.value || 0) / maxValue) * 100;
        return { x, y, value: item.value || 0, label: item.month || item.label || `Point ${index + 1}` };
    });
    
    // Create SVG path for line
    let pathD = `M ${points[0].x}% ${points[0].y}%`;
    for (let i = 1; i < points.length; i++) {
        pathD += ` L ${points[i].x}% ${points[i].y}%`;
    }
    
    container.innerHTML = `
        <svg class="chart-line-svg" viewBox="0 0 100 100" preserveAspectRatio="none" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
            <path d="${pathD}" class="chart-line-path" fill="none"/>
        </svg>
        <div class="chart-line-points">
            ${points.map((point, index) => `
                <div class="chart-line-point" style="left: ${point.x}%; bottom: ${point.y}%;" 
                     title="${point.label}: ${point.value.toLocaleString()}">
                </div>
            `).join('')}
        </div>
    `;
}

// ========== REPORT LOADING FUNCTIONS ==========

async function loadOverviewReport() {
    try {
        console.log('Loading overview report...');
        const response = await apiRequest('/reports/overview');
        console.log('Overview response:', response);
        
        if (response.success && response.data) {
            const data = response.data;
            
            // Update revenue summary and chart
            const revenueSummary = document.getElementById('overviewRevenueSummary');
            if (revenueSummary) {
                const totalRev = data.revenue?.total || data.totalRevenue || 0;
                const monthlyRev = data.revenue?.monthly || data.monthlyRevenue || 0;
                revenueSummary.innerHTML = `
                    <p>Total Revenue: $${totalRev.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p>This Month: $${monthlyRev.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                `;
                
                // Render revenue chart
                const maxRevenue = Math.max(totalRev, monthlyRev, 1);
                renderBarChart('revenueBars', [
                    { label: 'Total', value: totalRev, max: maxRevenue },
                    { label: 'Month', value: monthlyRev, max: maxRevenue }
                ]);
            }

            // Update bookings summary and chart
            const bookingSummary = document.getElementById('overviewBookingSummary');
            if (bookingSummary) {
                const totalBk = data.bookings?.total || data.totalBookings || 0;
                const monthlyBk = data.bookings?.monthly || data.monthlyBookings || 0;
                bookingSummary.innerHTML = `
                    <p>Total Bookings: ${totalBk.toLocaleString()}</p>
                    <p>This Month: ${monthlyBk.toLocaleString()}</p>
                `;
                
                // Render booking chart
                const maxBookings = Math.max(totalBk, monthlyBk, 1);
                renderBarChart('bookingBars', [
                    { label: 'Total', value: totalBk, max: maxBookings },
                    { label: 'Month', value: monthlyBk, max: maxBookings }
                ]);
            }

            // Update popular routes
            const routesList = document.querySelector('#overviewTab .report-card:nth-child(3) .routes-list');
            if (routesList) {
                if (data.popularRoutes && data.popularRoutes.length > 0) {
                    routesList.innerHTML = data.popularRoutes.map(route => `
                        <div class="route-item">
                            <span>${route.route}</span>
                            <span class="route-count">${route.booking_count} bookings</span>
                        </div>
                    `).join('');
                } else {
                    routesList.innerHTML = '<div class="route-item"><span>No routes data available</span></div>';
                }
            }

            // Update performance
            const performanceList = document.querySelector('#overviewTab .report-card:nth-child(4) .performance-list');
            if (performanceList && data.performance) {
                performanceList.innerHTML = `
                    <div class="performance-item">
                        <span>On-Time Rate</span>
                        <span class="performance-value">${data.performance.onTimeRate}%</span>
                    </div>
                    <div class="performance-item">
                        <span>Occupancy Rate</span>
                        <span class="performance-value">${data.performance.occupancyRate}%</span>
                    </div>
                    <div class="performance-item">
                        <span>Customer Satisfaction</span>
                        <span class="performance-value">${data.performance.customerSatisfaction}/5</span>
                    </div>
                `;
            }
        } else {
            console.error('Invalid response:', response);
        }
    } catch (error) {
        console.error('Error loading overview report:', error);
        const revenueSummary = document.querySelector('#overviewTab .report-card:nth-child(1) .report-summary');
        if (revenueSummary) {
            revenueSummary.innerHTML = '<p style="color: red;">Error loading data</p>';
        }
    }
}

async function loadRevenueReport() {
    try {
        console.log('Loading revenue report...');
        const response = await apiRequest('/reports/revenue');
        console.log('Revenue response:', response);
        
        if (response.success && response.data) {
            const data = response.data;
            
            // Update total revenue
            const totalRevenueEl = document.querySelector('#revenueTab .report-card:nth-child(1) .report-summary p');
            if (totalRevenueEl) {
                totalRevenueEl.textContent = `$${data.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }

            // Update monthly revenue
            const monthlyRevenueEl = document.querySelector('#revenueTab .report-card:nth-child(2) .report-summary p');
            if (monthlyRevenueEl) {
                monthlyRevenueEl.textContent = `$${data.monthlyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }

            // Update revenue by route
            const routesList = document.querySelector('#revenueTab .report-card:nth-child(3) .routes-list');
            if (routesList) {
                if (data.revenueByRoute && data.revenueByRoute.length > 0) {
                    routesList.innerHTML = data.revenueByRoute.map(route => `
                        <div class="route-item">
                            <span>${route.route}</span>
                            <span class="route-count">$${parseFloat(route.revenue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    `).join('');
                } else {
                    routesList.innerHTML = '<div class="route-item"><span>No revenue data available</span></div>';
                }
            }

            // Update growth and render trend chart
            const growthEl = document.getElementById('revenueTrendSummary');
            if (growthEl) {
                const sign = data.growth >= 0 ? '+' : '';
                growthEl.innerHTML = `<p>Growth: ${sign}${data.growth || 0}% this month</p>`;
            }
            
            // Render revenue trend line chart (simulated 6 months)
            renderLineChart('revenueTrendLine', [
                { month: 'Jan', value: data.monthlyRevenue * 0.8 },
                { month: 'Feb', value: data.monthlyRevenue * 0.85 },
                { month: 'Mar', value: data.monthlyRevenue * 0.9 },
                { month: 'Apr', value: data.monthlyRevenue * 0.95 },
                { month: 'May', value: data.monthlyRevenue * 1.0 },
                { month: 'Jun', value: data.monthlyRevenue * 1.05 }
            ]);
        }
    } catch (error) {
        console.error('Error loading revenue report:', error);
    }
}

async function loadBookingsReport() {
    try {
        console.log('Loading bookings report...');
        const response = await apiRequest('/reports/bookings');
        console.log('Bookings response:', response);
        
        if (response.success && response.data) {
            const data = response.data;
            
            // Update total bookings
            const totalBookingsEl = document.querySelector('#bookingsReportTab .report-card:nth-child(1) .report-summary p');
            if (totalBookingsEl) {
                totalBookingsEl.textContent = data.totalBookings.toLocaleString();
            }

            // Update monthly bookings
            const monthlyBookingsEl = document.querySelector('#bookingsReportTab .report-card:nth-child(2) .report-summary p');
            if (monthlyBookingsEl) {
                monthlyBookingsEl.textContent = data.monthlyBookings.toLocaleString();
            }

            // Update booking status
            const statusList = document.querySelector('#bookingsReportTab .report-card:nth-child(3) .performance-list');
            if (statusList && data.bookingStatus) {
                const total = data.totalBookings;
                if (data.bookingStatus.length > 0) {
                    statusList.innerHTML = data.bookingStatus.map(status => {
                        const percentage = total > 0 ? ((status.count / total) * 100).toFixed(0) : 0;
                        return `
                            <div class="performance-item">
                                <span>${status.status.charAt(0).toUpperCase() + status.status.slice(1)}</span>
                                <span class="performance-value">${status.count} (${percentage}%)</span>
                            </div>
                        `;
                    }).join('');
                } else {
                    statusList.innerHTML = '<div class="performance-item"><span>No status data available</span></div>';
                }
            }

            // Update growth and render trend chart
            const growthEl = document.getElementById('bookingTrendSummary');
            if (growthEl) {
                const sign = data.growth >= 0 ? '+' : '';
                growthEl.innerHTML = `<p>Growth: ${sign}${data.growth || 0}% this month</p>`;
            }
            
            // Render booking trend line chart (simulated 6 months)
            renderLineChart('bookingTrendLine', [
                { month: 'Jan', value: data.monthlyBookings * 0.8 },
                { month: 'Feb', value: data.monthlyBookings * 0.85 },
                { month: 'Mar', value: data.monthlyBookings * 0.9 },
                { month: 'Apr', value: data.monthlyBookings * 0.95 },
                { month: 'May', value: data.monthlyBookings * 1.0 },
                { month: 'Jun', value: data.monthlyBookings * 1.05 }
            ]);
        }
    } catch (error) {
        console.error('Error loading bookings report:', error);
    }
}

async function loadRoutesReport() {
    try {
        console.log('Loading routes report...');
        const response = await apiRequest('/reports/routes');
        console.log('Routes response:', response);
        
        if (response.success && response.data) {
            const data = response.data;
            
            // Update popular routes
            const popularRoutesList = document.querySelector('#routesTab .report-card:nth-child(1) .routes-list');
            if (popularRoutesList) {
                if (data.popularRoutes && data.popularRoutes.length > 0) {
                    popularRoutesList.innerHTML = data.popularRoutes.map(route => `
                        <div class="route-item">
                            <span>${route.route}</span>
                            <span class="route-count">${route.booking_count} bookings</span>
                        </div>
                    `).join('');
                } else {
                    popularRoutesList.innerHTML = '<div class="route-item"><span>No routes data available</span></div>';
                }
            }

            // Update route performance
            const performanceList = document.querySelector('#routesTab .report-card:nth-child(2) .performance-list');
            if (performanceList) {
                if (data.routePerformance && data.routePerformance.length > 0) {
                    performanceList.innerHTML = data.routePerformance.map(route => `
                        <div class="performance-item">
                            <span>${route.route}</span>
                            <span class="performance-value">Avg: $${parseFloat(route.avg_price).toFixed(2)}</span>
                        </div>
                    `).join('');
                } else {
                    performanceList.innerHTML = '<div class="performance-item"><span>No performance data available</span></div>';
                }
            }

            // Update route revenue
            const revenueList = document.querySelector('#routesTab .report-card:nth-child(3) .routes-list');
            if (revenueList) {
                if (data.routeRevenue && data.routeRevenue.length > 0) {
                    revenueList.innerHTML = data.routeRevenue.map(route => `
                        <div class="route-item">
                            <span>${route.route}</span>
                            <span class="route-count">$${parseFloat(route.revenue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    `).join('');
                } else {
                    revenueList.innerHTML = '<div class="route-item"><span>No revenue data available</span></div>';
                }
            }
        }
    } catch (error) {
        console.error('Error loading routes report:', error);
    }
}

async function loadPerformanceReport() {
    try {
        console.log('Loading performance report...');
        const response = await apiRequest('/reports/performance');
        console.log('Performance response:', response);
        
        if (response.success && response.data) {
            const data = response.data;
            
            // Update on-time performance
            const onTimeEl = document.querySelector('#performanceTab .report-card:nth-child(1) .report-summary p');
            if (onTimeEl) {
                onTimeEl.textContent = `${data.onTimePerformance.rate}%`;
            }
            const onTimeList = document.querySelector('#performanceTab .report-card:nth-child(1) .performance-list');
            if (onTimeList) {
                onTimeList.innerHTML = `
                    <div class="performance-item">
                        <span>On-Time</span>
                        <span class="performance-value">${data.onTimePerformance.onTime} flights</span>
                    </div>
                    <div class="performance-item">
                        <span>Delayed</span>
                        <span class="performance-value">${data.onTimePerformance.delayed} flights</span>
                    </div>
                `;
            }

            // Update occupancy rate
            const occupancyEl = document.querySelector('#performanceTab .report-card:nth-child(2) .report-summary p');
            if (occupancyEl) {
                occupancyEl.textContent = `${data.occupancy.rate}%`;
            }
            const occupancyList = document.querySelector('#performanceTab .report-card:nth-child(2) .performance-list');
            if (occupancyList) {
                occupancyList.innerHTML = `
                    <div class="performance-item">
                        <span>Booked Seats</span>
                        <span class="performance-value">${data.occupancy.booked.toLocaleString()}</span>
                    </div>
                    <div class="performance-item">
                        <span>Total Seats</span>
                        <span class="performance-value">${data.occupancy.total.toLocaleString()}</span>
                    </div>
                `;
            }

            // Update customer satisfaction
            const satisfactionEl = document.querySelector('#performanceTab .report-card:nth-child(3) .report-summary p');
            if (satisfactionEl) {
                satisfactionEl.textContent = `${data.customerSatisfaction.average}/5`;
            }
            const satisfactionList = document.querySelector('#performanceTab .report-card:nth-child(3) .performance-list');
            if (satisfactionList) {
                const total = data.customerSatisfaction.breakdown.fiveStars + 
                             data.customerSatisfaction.breakdown.fourStars + 
                             data.customerSatisfaction.breakdown.threeStars;
                satisfactionList.innerHTML = `
                    <div class="performance-item">
                        <span>5 Stars</span>
                        <span class="performance-value">${data.customerSatisfaction.breakdown.fiveStars} (${total > 0 ? Math.round((data.customerSatisfaction.breakdown.fiveStars / total) * 100) : 0}%)</span>
                    </div>
                    <div class="performance-item">
                        <span>4 Stars</span>
                        <span class="performance-value">${data.customerSatisfaction.breakdown.fourStars} (${total > 0 ? Math.round((data.customerSatisfaction.breakdown.fourStars / total) * 100) : 0}%)</span>
                    </div>
                    <div class="performance-item">
                        <span>3 Stars</span>
                        <span class="performance-value">${data.customerSatisfaction.breakdown.threeStars} (${total > 0 ? Math.round((data.customerSatisfaction.breakdown.threeStars / total) * 100) : 0}%)</span>
                    </div>
                `;
            }

            // Update efficiency
            const efficiencyList = document.querySelector('#performanceTab .report-card:nth-child(4) .performance-list');
            if (efficiencyList) {
                efficiencyList.innerHTML = `
                    <div class="performance-item">
                        <span>Average Flight Time</span>
                        <span class="performance-value">${data.efficiency.avgFlightTime}</span>
                    </div>
                    <div class="performance-item">
                        <span>Fuel Efficiency</span>
                        <span class="performance-value">${data.efficiency.fuelEfficiency}%</span>
                    </div>
                    <div class="performance-item">
                        <span>Maintenance Score</span>
                        <span class="performance-value">${data.efficiency.maintenanceScore}%</span>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error loading performance report:', error);
    }
}

// ========== TAB FUNCTIONS ==========

function showTab(event, tabName) {
    if (event) {
        event.preventDefault();
    }

    const tabId = `${tabName}Tab`;
    const tabs = ['searchTab', 'statusTab'];

    tabs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = id === tabId ? 'block' : 'none';
        }
    });

    const tabsContainer = event && event.currentTarget ? event.currentTarget.closest('.filter-tabs') : document.querySelector('.filter-tabs');
    const tabButtons = tabsContainer ? tabsContainer.querySelectorAll('.tab-btn') : document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    } else {
        const fallback = Array.from(tabButtons).find(btn => btn.textContent.toLowerCase().includes(tabName));
        if (fallback) fallback.classList.add('active');
    }

    // Load data for the selected tab
    if (tabName === 'overview') {
        loadOverviewReport();
    } else if (tabName === 'revenue') {
        loadRevenueReport();
    } else if (tabName === 'bookings') {
        loadBookingsReport();
    } else if (tabName === 'routes') {
        loadRoutesReport();
    } else if (tabName === 'performance') {
        loadPerformanceReport();
    }
}

function showAdminTab(event, tabName) {
    if (event) {
        event.preventDefault();
    }

    const tabId = `${tabName}Tab`;
    const adminTabs = ['flightsTab', 'bookingsTab', 'usersTab', 'aircraftTab'];

    adminTabs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = id === tabId ? 'block' : 'none';
        }
    });

    const tabsContainer = event && event.currentTarget ? event.currentTarget.closest('.filter-tabs') : document.querySelector('.filter-tabs');
    const tabButtons = tabsContainer ? tabsContainer.querySelectorAll('.tab-btn') : document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    } else {
        const fallback = Array.from(tabButtons).find(btn => btn.textContent.toLowerCase().includes(tabName));
        if (fallback) fallback.classList.add('active');
    }
    
    // Load data when tab is shown (with pagination support)
    if (tabName === 'flights') {
        loadAdminFlights(1, ''); // Load first page, no search
    } else if (tabName === 'bookings') {
        loadAdminBookings();
    } else if (tabName === 'users') {
        loadAdminUsers();
    } else if (tabName === 'aircraft') {
        loadAdminAircraft();
    }
}

function showReportTab(event, tabName) {
    if (event) {
        event.preventDefault();
    }

    // Map tab names to their actual IDs
    const tabIdMap = {
        'overview': 'overviewTab',
        'revenue': 'revenueTab',
        'bookings': 'bookingsReportTab',
        'routes': 'routesTab',
        'performance': 'performanceTab'
    };

    const tabId = tabIdMap[tabName] || `${tabName}Tab`;
    const reportTabs = ['overviewTab', 'revenueTab', 'bookingsReportTab', 'routesTab', 'performanceTab'];

    reportTabs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = id === tabId ? 'block' : 'none';
        }
    });

    const tabsContainer = event && event.currentTarget ? event.currentTarget.closest('.filter-tabs') : document.querySelector('.filter-tabs');
    const tabButtons = tabsContainer ? tabsContainer.querySelectorAll('.tab-btn') : document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    } else {
        const fallback = Array.from(tabButtons).find(btn => btn.textContent.toLowerCase().includes(tabName));
        if (fallback) fallback.classList.add('active');
    }

    // Load data for the selected tab
    if (tabName === 'overview') {
        loadOverviewReport();
    } else if (tabName === 'revenue') {
        loadRevenueReport();
    } else if (tabName === 'bookings') {
        loadBookingsReport();
    } else if (tabName === 'routes') {
        loadRoutesReport();
    } else if (tabName === 'performance') {
        loadPerformanceReport();
    }
}

// ========== FLIGHT STATUS ==========

async function handleStatusSearch(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const flightNumber = formData.get('flightNumber').trim().toUpperCase();
    
    const statusResult = document.getElementById('statusResult');
    if (!statusResult) return;
    
    // Show loading state
    statusResult.style.display = 'block';
    statusResult.innerHTML = '<div class="status-card"><p>Searching flight status...</p></div>';
    
    try {
        const response = await apiRequest(`/flights/status/${flightNumber}`);
        
        if (response.success && response.data.flight) {
            const flight = response.data.flight;
            const departure = new Date(flight.departure_datetime);
            const arrival = new Date(flight.arrival_datetime);
            
            // Determine status badge
            let statusBadge = '';
            let statusClass = '';
            const now = new Date();
            
            if (flight.status === 'cancelled') {
                statusBadge = 'Cancelled';
                statusClass = 'badge-danger';
            } else if (flight.status === 'completed') {
                statusBadge = 'Completed';
                statusClass = 'badge-secondary';
            } else if (flight.status === 'boarding') {
                statusBadge = 'Boarding';
                statusClass = 'badge-warning';
            } else if (departure < now) {
                statusBadge = 'Departed';
                statusClass = 'badge-info';
            } else {
                statusBadge = 'On Time';
                statusClass = 'badge-success';
            }
            
            // Format dates
            const departureDate = departure.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            const departureTime = departure.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            const arrivalDate = arrival.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            const arrivalTime = arrival.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            statusResult.innerHTML = `
                <div class="status-card">
                    <div class="status-header">
                        <h2>Flight ${flight.flight_number}</h2>
                        <span class="badge ${statusClass}">${statusBadge}</span>
                    </div>
                    <div class="status-details">
                        <div class="status-item">
                            <div class="status-label">Route</div>
                            <div class="status-value">${flight.from_city} (${flight.from_airport_code || 'N/A'}) → ${flight.to_city} (${flight.to_airport_code || 'N/A'})</div>
                        </div>
                        <div class="status-item">
                            <div class="status-label">Scheduled Departure</div>
                            <div class="status-value">${departureDate} ${departureTime}</div>
                        </div>
                        <div class="status-item">
                            <div class="status-label">Scheduled Arrival</div>
                            <div class="status-value">${arrivalDate} ${arrivalTime}</div>
                        </div>
                        ${flight.gate ? `
                        <div class="status-item">
                            <div class="status-label">Gate</div>
                            <div class="status-value">${flight.gate}</div>
                        </div>
                        ` : ''}
                        ${flight.aircraft_model ? `
                        <div class="status-item">
                            <div class="status-label">Aircraft</div>
                            <div class="status-value">${flight.aircraft_model}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        } else {
            statusResult.innerHTML = `
                <div class="status-card">
                    <div class="status-header">
                        <h2>Flight Not Found</h2>
                    </div>
                    <div class="status-details">
                        <p class="error">No flight found with flight number: ${flightNumber}</p>
                        <p>Please check the flight number and try again.</p>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Flight status search error:', error);
        statusResult.innerHTML = `
            <div class="status-card">
                <div class="status-header">
                    <h2>Error</h2>
                </div>
                <div class="status-details">
                    <p class="error">Failed to fetch flight status: ${error.message}</p>
                    <p>Please try again later.</p>
                </div>
            </div>
        `;
    }
}

// ========== CONTACT ==========

function handleContactSubmit(event) {
    event.preventDefault();
    alert('Thank you! We will contact you soon.');
    event.target.reset();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('flightModal');
    if (event.target === modal) {
        closeModal();
    }
}

