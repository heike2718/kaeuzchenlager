// user.store.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest'; // Import von Vitest
import { HttpTestingController } from '@angular/common/http/testing';
// Importe Ihrer Anwendung
import { GefaesstypenStore } from './gefaesstypen.store';

// Ihre Mock-Daten
const mockUsers = [
    { id: 1, name: 'Test User 1', email: 'test1@example.com' },
    { id: 2, name: 'Test User 2', email: 'test2@example.com' }
];

describe('GefaesstypenStore', () => {

    const setup = () => {
    const moviesService = {
      load: jest.fn((studio: string) =>
        of([
          studio === 'Warner Bros'
            ? { id: 1, name: 'Harry Potter' }
            : { id: 2, name: 'Jurassic Park' }
        ]).pipe(delay(100))
      ),
    };



    it('loads gefaesstypen successfully', async () => {
        TestBed.configureTestingModule({
            providers: [GefaesstypenStore, provideHttpClient(), provideHttpClientTesting()],
        });

        const store = TestBed.inject(GefaesstypenStore);

        // 1. Trigger die Aktion, die wir testen wollen
        store.loadGefaesstypen();

        // 2. Erwarte, dass ein HTTP-GET-Request an die korrekte URL gestellt wurde
        const req = httpTestingController.expectOne('/api/gerfaesstypen');
        expect(req.request.method).toBe('GET');

        // 3. Simuliere, dass der Server eine erfolgreiche Antwort mit mockUsers schickt
        req.flush(mockUsers);

        // 4. Warte einen "Tick", damit der asynchrone Code im Store ausgeführt werden kann
        // In Vitest/Jest kann man oft einfach `await Promise.resolve()` nutzen.
        await Promise.resolve();

        // 5. Überprüfe, ob der State des Stores korrekt aktualisiert wurde
        expect(store.gefaesstypen()).toEqual(mockUsers);
        expect(store.isLoading()).toBe(false); // Stell sicher, dass Loading wieder false ist
    });
});