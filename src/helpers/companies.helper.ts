/**
 * Encodes a given string to Base64 format.
 * @param {string} data - The string to be encoded.
 * @returns {string} The Base64-encoded version of the input string.
 */
const toBase64 = (data: string): string => {
    return Buffer.from(data).toString('base64');
  };
  
  // Example usage of the toBase64 method
  const webUserPass = '9bf091TR5d5b';
  const encodedWebUserPass = toBase64(webUserPass);
  
  // Then, you can use encodedWebUserPass in your headers
 export const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'webUserName': 'IedehPardazanKarAfarin',
    'webUserPass': encodedWebUserPass, // Use the encoded password here
    'AuthUser': 'Iedeh_Pardazan_KarAfarin',
    'AuthenticationX365': '592af739f9fa47839feca8bf9d753e55B7A7F6E827D646B7ABE3ACC2F44F5C69',
  };
