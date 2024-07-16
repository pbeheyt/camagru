const fs = require('fs');
const path = require('path');

function loadEnv(filePath) {
    const fullPath = path.resolve(filePath);

    if (!fs.existsSync(fullPath)) {
        throw new Error(`${fullPath} file does not exist`);
    }

    const lines = fs.readFileSync(fullPath, 'utf-8')
        .split('\n')
        .filter(Boolean); // Removes empty lines

    lines.forEach(line => {
        // Ignore comments
        if (line.startsWith('#')) {
            return;
        }

        const [key, value] = line.split('=');

        // Remove surrounding whitespace and quotes
        const cleanKey = key.trim();
        let cleanValue = value.trim();

        if (cleanValue.startsWith('"') && cleanValue.endsWith('"')) {
            cleanValue = cleanValue.slice(1, -1);
        }

        // Set the environment variable
        process.env[cleanKey] = cleanValue;
    });
}

module.exports = loadEnv;
