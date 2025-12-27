import { ErrorType } from '@core/model';

export const DEFAULT_GEFAESSTYP_BG_COLOR = '#ffffff';

export const TEMP_UUID_PREFIX = 'temp-';

// erlaubte Zeichen wie im Backend:
// Buchstaben (A–Z, a–z), Umlaute, ß, Ziffern, Whitespace, Anführungszeichen, _, -, . , : ; ( )
export const NAME_PATTERN = /^[a-zA-ZäöüÄÖÜß0-9\s"'_\-.,:;()]*$/;

export interface GefaesstypDaten {
    readonly name: string;
    readonly volumen: number;
    readonly anzahl: number;
    readonly backgroundColor: string;
    readonly version: number | null;
}

export interface Gefaesstyp {
    readonly uuid: string;
    readonly daten: GefaesstypDaten;
}

export interface GefaesstypError {
    readonly message: string;
    readonly userInput: GefaesstypDaten | null;
    readonly type: ErrorType;
    readonly uuid: string | null; // Nur bei Updates/Deletes
    readonly serverVersion: GefaesstypDaten | null; // Nur bei CONCURRENT_UPDATE
}

export interface GefaesstypConflict {
    readonly serverVersion: Gefaesstyp;
    readonly userInput: GefaesstypDaten;
}

export function createInitialGefaesstyp(): Gefaesstyp {
    return {
        uuid: TEMP_UUID_PREFIX + generateUUID(),
        daten: {
            anzahl: 0,
            backgroundColor: DEFAULT_GEFAESSTYP_BG_COLOR,
            name: '',
            version: null,
            volumen: 0,
        },
    };
}

function generateUUID(): string {
    const c = globalThis.crypto as Crypto | undefined;

    // Best case (secure context)
    if (c?.randomUUID) {
        return c.randomUUID();
    }

    // Good fallback (usually available even on http)
    if (c?.getRandomValues) {
        const bytes = new Uint8Array(16);
        c.getRandomValues(bytes);

        // RFC 4122 UUID v4 bits
        bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
        bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10

        const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
        console.log('use fallback wegen insecure');
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }

    // Last resort: unique-ish (not crypto)
    console.log('use fallback ohne crypto');
    return `id-${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;
}

const deCollator = new Intl.Collator('de', {
    sensitivity: 'variant', // Ä !== A, ß !== ss
    ignorePunctuation: false,
    numeric: true, // 'Typ 2' < 'Typ 10'
});

export function sortGefaesstypenByName(list: Gefaesstyp[]): Gefaesstyp[] {
    return [...list].sort((a, b) => deCollator.compare(a.daten.name, b.daten.name));
}
