import crypto from 'crypto';
/**
 * Generates a hash from a given string and truncates it to a specified length.
 * @param {string} data - The string data to hash.
 * @param {string} [algorithm='sha256'] - The hashing algorithm to use (default is 'sha256').
 * @param {number} [length=30] - The length of the resulting hash (default is 30).
 * @returns {string} - The generated hash in hexadecimal format, truncated to the specified length.
 */
export function generateHash(data: string, algorithm = 'sha256', length = 30): string {

    const hash = crypto.createHash(algorithm).update(data).digest('hex');
    return hash.substring(0, length);
}
