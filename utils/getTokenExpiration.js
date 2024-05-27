function getTokenExpiration() {
	return Date.now() + 3600000; // 1 hour from now
}

module.exports = getTokenExpiration;