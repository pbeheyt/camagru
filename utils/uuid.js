const crypto = require('crypto');

function generateUUID() {
  const randomBytes = crypto.randomBytes(16);

  // Set the version to 0100
  randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40;
  // Set the variant to 10xx
  randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80;

  const uuid = randomBytes.toString('hex').match(/.{1,4}/g).join('-');
  return uuid;
}

module.exports = generateUUID;