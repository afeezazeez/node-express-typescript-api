import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid'; // Install UUID library with npm install uuid

/**
 * Generates a hash from a given string and truncates it to a specified length.
 * @param {string} data - The string data to hash.
 * @param {string} [algorithm='sha256'] - The hashing algorithm to use (default is 'sha256').
 * @param {number} [length=60] - The length of the resulting hash (default is 60).
 * @returns {string} - The generated hash in hexadecimal format, truncated to the specified length.
 */
export function generateHash(data: string, algorithm = 'sha256', length = 60): string {
    const salt = uuidv4();
    const hash = crypto.createHash(algorithm).update(data + salt).digest('hex');
    return hash.substring(0, length);
}