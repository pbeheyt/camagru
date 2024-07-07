function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

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

function isValidBase64(base64) {
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*?(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    return base64Regex.test(base64);
}

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidBase64,
};
