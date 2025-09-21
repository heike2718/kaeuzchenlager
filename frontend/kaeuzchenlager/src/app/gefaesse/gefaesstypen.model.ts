export interface GefaesstypDaten {
    readonly name : string;
    readonly volumen: number;
    readonly anzahl: number;
    readonly farbe: string;
};


export interface Gefaesstyp {
    readonly uuid: string;
    readonly daten: GefaesstypDaten;    
}
