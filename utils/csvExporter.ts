import { ScoutingData } from '../types';
import { compressScoutingData } from './qrHelper';

/**
 * CSV Export Utility
 * Generates CSV from vault data and sends to PC endpoint
 */

// Default endpoint - can be configured via environment or UI
const DEFAULT_ENDPOINT = 'http://10.228.6.228:8080/upload';

/**
 * Generates CSV string from vault data
 * Uses the same compression format as QR codes
 * @param vault Array of scouting data
 * @returns CSV formatted string
 */
export const generateCSV = (vault: ScoutingData[]): string => {
    // CSV Header matching the compression format
    const headers = [
        'timestamp',
        'team_num',
        'match_num',
        'match_type',
        'alliance',
        'scouter',
        'start_zone',
        'auto_active',
        'auto_hang',
        'auto_pts',
        'auto_comm',
        'tele_pts',
        'tele_comm',
        'tele_hang',
        'adv_role',
        'adv_broke',
        'adv_fixed',
        'adv_chasis',
        'adv_intake',
        'adv_shooter',
        'adv_climber',
        'adv_hoppercapacity',
        'adv_trench',
        'adv_comments'
    ];

    // Convert each vault item to compressed format
    const rows = vault.map(item => {
        const compressed = compressScoutingData(item);
        // Escape fields that might contain commas or quotes
        return compressed.map(field => {
            if (field === null || field === undefined) return '';
            const str = String(field);
            // If field contains comma, quote, or newline, wrap in quotes and escape quotes
            if (/[",\n\r]/.test(str)) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        }).join(',');
    });

    // Combine header and rows
    return [headers.join(','), ...rows].join('\n');
};

/**
 * Sends CSV data to PC endpoint via HTTP POST
 * @param csvContent CSV string to send
 * @param endpoint Optional custom endpoint (defaults to DEFAULT_ENDPOINT)
 * @returns Promise resolving to success status and message
 */
export const pushCSVToPC = async (
    csvContent: string,
    endpoint: string = DEFAULT_ENDPOINT
): Promise<{ success: boolean; message: string }> => {
    console.log('[CSV Export] Attempting POST to:', endpoint);

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/csv',
            },
            body: csvContent,
        });

        console.log('[CSV Export] POST completed. Status:', response.status, 'OK:', response.ok);

        if (response.ok) {
            return {
                success: true,
                message: 'CSV successfully pushed to PC'
            };
        } else {
            return {
                success: false,
                message: `Server responded with status ${response.status}`
            };
        }
    } catch (error) {
        console.error('[CSV Export] Fetch error:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Network error occurred'
        };
    }
};

/**
 * Gets the current configured endpoint
 * Can be extended to read from localStorage or environment
 */
export const getEndpoint = (): string => {
    // Future: Read from localStorage or environment variable
    // For now, return default
    return DEFAULT_ENDPOINT;
};

/**
 * Sets a custom endpoint
 * Can be extended to persist to localStorage
 */
export const setEndpoint = (endpoint: string): void => {
    // Future: Save to localStorage
    // For now, this is a placeholder
    console.log('Endpoint set to:', endpoint);
};
