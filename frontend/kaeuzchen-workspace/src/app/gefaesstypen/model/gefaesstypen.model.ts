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
    return globalThis.crypto?.randomUUID?.() ?? 'tmp';
}

const deCollator = new Intl.Collator('de', {
    sensitivity: 'variant', // Ä !== A, ß !== ss
    ignorePunctuation: false,
    numeric: true, // 'Typ 2' < 'Typ 10'
});

export function sortGefaesstypenByName(list: Gefaesstyp[]): Gefaesstyp[] {
    return [...list].sort((a, b) => deCollator.compare(a.daten.name, b.daten.name));
}
