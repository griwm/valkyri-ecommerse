// Mock database for users
const users = [];

// Helper function to hash password (this is a simple implementation - use proper hashing in production)
function hashPassword(password) {
    return btoa(password); // This is NOT secure, use bcrypt or similar in production
}

// Helper function to validate email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Helper function to show error message
function showError(element, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Remove any existing error messages
    const existingError = element.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    element.parentElement.appendChild(errorDiv);
    element.style.borderColor = 'var(--error)';
}

// Helper function to clear error message
function clearError(element) {
    const errorDiv = element.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    element.style.borderColor = '';
}

// Toggle between login and register forms
function toggleForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (formType === 'register') {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    } else {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    
    // Clear previous errors
    clearError(email);
    clearError(password);
    
    // Validate email
    if (!isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        return false;
    }
    
    // Find user
    const user = users.find(u => u.email === email.value);
    
    if (!user || user.password !== hashPassword(password.value)) {
        showError(password, 'Invalid email or password');
        return false;
    }
    
    // Login successful
    showDashboard(user);
    return false;
}

// Handle register form submission
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName');
    const email = document.getElementById('registerEmail');
    const password = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    
    // Clear previous errors
    clearError(name);
    clearError(email);
    clearError(password);
    clearError(confirmPassword);
    
    // Validate name
    if (name.value.length < 2) {
        showError(name, 'Name must be at least 2 characters long');
        return false;
    }
    
    // Validate email
    if (!isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        return false;
    }
    
    // Check if email already exists
    if (users.some(u => u.email === email.value)) {
        showError(email, 'Email already registered');
        return false;
    }
    
    // Validate password
    if (password.value.length < 6) {
        showError(password, 'Password must be at least 6 characters long');
        return false;
    }
    
    // Validate password confirmation
    if (password.value !== confirmPassword.value) {
        showError(confirmPassword, 'Passwords do not match');
        return false;
    }
    
    // Create new user
    const newUser = {
        name: name.value,
        email: email.value,
        password: hashPassword(password.value)
    };
    
    users.push(newUser);
    
    // Show success message and redirect to login
    alert('Registration successful! Please login.');
    toggleForm('login');
    
    return false;
}

// Show dashboard
function showDashboard(user) {
    document.querySelector('.container').style.display = 'none';
    const dashboard = document.getElementById('dashboard');
    dashboard.classList.remove('hidden');
    
    // Update user name
    document.getElementById('userName').textContent = user.name;
}

// Handle logout
function handleLogout() {
    document.querySelector('.container').style.display = 'block';
    document.getElementById('dashboard').classList.add('hidden');
    
    // Clear form fields
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}