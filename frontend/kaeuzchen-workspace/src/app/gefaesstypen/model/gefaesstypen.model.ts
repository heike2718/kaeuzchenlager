export const TEMP_UUID_PREFIX = 'temp-';

export type ErrorType = 'VALIDATION' | 'CONCURRENT_UPDATE' | 'NOT_FOUND' | 'DUPLICATE';

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

export function createInitialGefaesstyp(): Gefaesstyp {
  return {
    uuid: TEMP_UUID_PREFIX + (globalThis.crypto?.randomUUID?.() ?? 'tmp'),
    daten: {
      anzahl: 0,
      backgroundColor: '#ffffff',
      name: '',
      version: null,
      volumen: 0,
    },
  };
}

export function sortGefaesstypenByName(gefaesstypen: Gefaesstyp[]): Gefaesstyp[] {
  return [...gefaesstypen].sort((a, b) => a.daten.name.localeCompare(b.daten.name, 'de'));
}
