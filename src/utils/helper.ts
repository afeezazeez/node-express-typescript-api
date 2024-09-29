import { Request } from 'express';
import {PaginationOptions} from "../interfaces/request/pagination";
import configService from "./config/config.service";
import {PaginationMeta} from "../interfaces/request/pagination";
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export const extractPaginationAndSorting = (req: Request): PaginationOptions => {
    const page = Number(req.query.page) || 1;
    const sortDirection = (req.query.sortDirection as 'ASC' | 'DESC') || 'DESC';
    const limit = Number(req.query.perPage || configService.get("DEFAULT_PAGINATION"));

    return {
        page,
        order: sortDirection,
        limit
    };
};


export function generatePaginationMeta(count: number, page: number, limit: number): PaginationMeta {
    const totalPages = Math.ceil(count / limit);

    return {
        current_page: page,
        next_page: page < totalPages ? page + 1 : null,
        previous_page: page > 1 ? page - 1 : null,
        per_page: limit,
        total: count,
        last_page: totalPages,
    };
}

export const generateOrderReference = (): string => {
    const timestamp = Date.now().toString();
    const randomNum = Math.floor(Math.random() * 10000); // Random number between 0-9999
    return `ORD-${timestamp}-${randomNum}`; // Combine them for uniqueness
};

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