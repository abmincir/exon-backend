/**
 * Encodes a given string to Base64 format.
 * @param {string} data - The string to be encoded.
 * @returns {string} The Base64-encoded version of the input string.
 */
const toBase64 = (data: string): string => {
  return Buffer.from(data).toString('base64');
};

// Example usage of the toBase64 method
const webUserPass = 'your_password_here';
const encodedWebUserPass = toBase64(webUserPass);

// Then, you can use encodedWebUserPass in your headers
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'webUserName': 'your_webUserName_value',
  'webUserPass': encodedWebUserPass, // Use the encoded password here
  'AuthUser': 'your_AuthUser_value',
  'AuthenticationX365': 'your_AuthenticationX365_value',
};

