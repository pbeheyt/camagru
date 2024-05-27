/**
 * Function to validate email address based on RFC 5322 standard.
 * @param {string} email The email address to validate.
 * @returns {boolean} True if the email address is valid, otherwise false.
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

exports.isValidEmail = isValidEmail;
