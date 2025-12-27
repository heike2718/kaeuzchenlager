import { KLConfiguration } from '@config';

export const firstGefaesstyp = {
    uuid: '1234',
    daten: {
        anzahl: 4,
        backgroundColor: '#ff0066',
        name: 'Erster Gefäßtyp',
        volumen: 5,
        version: 2,
    },
};

export const secondGefaesstyp = {
    uuid: '9876',
    daten: {
        anzahl: 3,
        backgroundColor: '#ccffcc',
        name: 'Zweiter Gefäßtyp',
        volumen: 20,
        version: 0,
    },
};

export const thirdGefaesstyp = {
    uuid: '6373',
    daten: {
        anzahl: 10,
        backgroundColor: '#aac5f8ff',
        name: 'Dritter Gefäßtyp',
        volumen: 50,
        version: 0,
    },
};

export const neuerGefaesstyp = {
    uuid: 'temp-69641021',
    daten: {
        anzahl: 0,
        backgroundColor: '#ffffff',
        name: '',
        volumen: 0,
        version: 0,
    },
};

export const mockConfig: KLConfiguration = {
    production: false,
    version: '1.2.0',
    environment: 'test',
    apiUrl: 'http://test-api.example.com',
};
