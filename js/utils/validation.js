/**
 * Form Validation Utilities
 * Handles real-time form validation for checkout process
 */

/**
 * Validate phone number format
 */
function validatePhone(phone) {
    const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
    return phoneRegex.test(phone);
}

/**
 * Validate credit card number (16 digits)
 */
function validateCreditCard(cardNumber) {
    const cardRegex = /^[0-9]{16}$/;
    return cardRegex.test(cardNumber.replace(/\s/g, ''));
}

/**
 * Validate CVV (3-4 digits)
 */
function validateCVV(cvv) {
    const cvvRegex = /^[0-9]{3,4}$/;
    return cvvRegex.test(cvv);
}

/**
 * Validate expiry date format and validity
 */
function validateExpiryDate(expiryDate) {
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(expiryDate)) return false;
    
    const [month, year] = expiryDate.split('/');
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    if (parseInt(year) < currentYear) return false;
    if (parseInt(year) === currentYear && parseInt(month) < currentMonth) return false;
    
    return true;
}

/**
 * Validate individual form field
 */
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (!errorElement) return true;
    
    let isValid = true;
    let errorMessage = '';
    
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    if (isValid && fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    if (isValid && fieldName === 'phone' && value) {
        if (!validatePhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    if (isValid && fieldName === 'cardNumber' && value) {
        if (!validateCreditCard(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid 16-digit card number';
        }
    }
    
    if (isValid && fieldName === 'cvv' && value) {
        if (!validateCVV(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid CVV (3-4 digits)';
        }
    }
    
    if (isValid && fieldName === 'expiryDate' && value) {
        if (!validateExpiryDate(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid expiry date (MM/YY)';
        }
    }
    
    if (isValid) {
        field.classList.remove('error');
        errorElement.textContent = '';
    } else {
        field.classList.add('error');
        errorElement.textContent = errorMessage;
    }
    
    return isValid;
}

/**
 * Clear field error state
 */
function clearFieldError(e) {
    const field = e.target;
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (errorElement) {
        field.classList.remove('error');
        errorElement.textContent = '';
    }
}

/**
 * Validate entire form
 */
function validateForm() {
    const formInputs = checkoutForm.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    formInputs.forEach(input => {
        const event = new Event('blur');
        input.dispatchEvent(event);
        
        if (input.classList.contains('error')) {
            isValid = false;
        }
    });
    
    return isValid;
}