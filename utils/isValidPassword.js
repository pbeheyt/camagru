/**
 * Function to validate password based on certain criteria.
 * @param {string} password The password to validate.
 * @returns {boolean} True if the password meets the criteria, otherwise false.
 */
function isValidPassword(password) {
    // Password must be at least 8 characters long
    if (password.length < 8) {
        return false;
    }
    // Password must contain at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        return false;
    }
    // Password must contain at least one lowercase letter
    if (!/[a-z]/.test(password)) {
        return false;
    }
    // Password must contain at least one digit
    if (!/\d/.test(password)) {
        return false;
    }
    // Password must contain at least one special character
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?/~~\-]/.test(password)) {
        return false;
    }
    return true;
}

module.exports = isValidPassword;
