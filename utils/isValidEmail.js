function isValidEmail(email) {
    // Basic validation: check if email contains '@' and '.'
    return email.includes('@') && email.includes('.');
}

module.exports = isValidEmail;
