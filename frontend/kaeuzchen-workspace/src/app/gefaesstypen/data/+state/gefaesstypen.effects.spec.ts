import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, of, throwError, firstValueFrom, take } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GefaesstypenEffects } from './gefaesstypen.effects';
import { GefaesstypenHttpService } from '../gefaesstypen-http.service';
import { gefaesstypenActions } from './gefaesstypen.actions';
import { Router } from '@angular/router';
import { Gefaesstyp, GefaesstypDaten, GefaesstypError } from '@gefaesstypen/model';
import { GefaesstypenHttpErrorService } from '../gefaesstypen-http-error.service';
import { provideStore } from '@ngrx/store';
import { ErrorType } from '@core/model';
import { firstGefaesstyp } from '@testing';
import { MessageService } from '@shared/components';

describe('GefaesstypenEffects', () => {
    let actions$: ReplaySubject<unknown>;
    let effects: GefaesstypenEffects;

    const httpServiceMock = {
        loadGefaesstypen: vi.fn(),
        insertGefaesstyp: vi.fn(),
        updateGefaesstyp: vi.fn(),
        loadGefaesstypWithId: vi.fn(),
        removeGefaesstyp: vi.fn(),
    };

    const messageServiceMock = {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        clear: vi.fn(),
    };

    const errorServiceMock = { toGefaesstypError: vi.fn() };

    const routerMock = {
        navigateByUrl: vi.fn(),
        navigate: vi.fn().mockResolvedValue(true),
    };

    beforeEach(() => {
        actions$ = new ReplaySubject<unknown>(1);

        TestBed.configureTestingModule({
            providers: [
                provideStore(),
                GefaesstypenEffects,
                provideMockActions(() => actions$),
                { provide: GefaesstypenHttpService, useValue: httpServiceMock },
                { provide: Router, useValue: routerMock },
                { provide: GefaesstypenHttpErrorService, useValue: errorServiceMock },
                { provide: MessageService, useValue: messageServiceMock },
            ],
        });

        effects = TestBed.inject(GefaesstypenEffects);
        vi.resetAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Test addGefaesstyp$', () => {
        it('should call httpService and map to gefaesstypAdded', async () => {
            const daten: GefaesstypDaten = {
                name: 'temp-12345',
                volumen: 2,
                anzahl: 1,
                backgroundColor: '#000000',
                version: null,
            };
            const gefaesstyp: Gefaesstyp = { uuid: 'temp-a-1', daten };
            httpServiceMock.insertGefaesstyp.mockReturnValue(of(gefaesstyp));

            actions$.next(gefaesstypenActions.addGefaesstyp({ gefaesstyp }));

            const emitted = await firstValueFrom(effects.addGefaesstyp$);

            expect(emitted).toEqual(gefaesstypenActions.gefaesstypAdded({ gefaesstyp }));

            expect(httpServiceMock.insertGefaesstyp).toHaveBeenCalledWith(gefaesstyp);
            expect(httpServiceMock.insertGefaesstyp).toBeCalledTimes(1);
        });

        it('should handle error DUPLICATE', async () => {
            const errorType: ErrorType = 'DUPLICATE';

            const error = {
                status: 412,
                error: { level: 'ERROR', message: 'Duplikat' },
            };

            const daten: GefaesstypDaten = {
                name: 'temp-12345',
                volumen: 2,
                anzahl: 1,
                backgroundColor: '#000000',
                version: null,
            };
            const gefaesstypError: GefaesstypError = {
                message: '',
                serverVersion: null,
                type: errorType,
                userInput: daten,
                uuid: null,
            };
            const gefaesstyp: Gefaesstyp = {
                uuid: 'temp-a-1',
                daten: daten,
            };

            httpServiceMock.insertGefaesstyp.mockReturnValue(throwError(() => error));
            errorServiceMock.toGefaesstypError.mockReturnValue(gefaesstypError);

            actions$.next(gefaesstypenActions.addGefaesstyp({ gefaesstyp }));
            const emitted = await firstValueFrom(effects.addGefaesstyp$);

            expect(emitted).toEqual(gefaesstypenActions.gefaesstypenServerError({ error: gefaesstypError }));

            expect(httpServiceMock.insertGefaesstyp).toHaveBeenCalledWith(gefaesstyp);
            expect(httpServiceMock.insertGefaesstyp).toBeCalledTimes(1);

            expect(errorServiceMock.toGefaesstypError).toHaveBeenCalledWith(error, daten);
            expect(errorServiceMock.toGefaesstypError).toHaveBeenCalledTimes(1);
        });
    });

    describe('Test changeGefaesstyp$', () => {
        it('should call httpService and map to gefaesstypChanged', async () => {
            const uuid = '1234';
            const daten: GefaesstypDaten = {
                name: 'temp-12345',
                volumen: 2,
                anzahl: 1,
                backgroundColor: '#000000',
                version: 3,
            };

            const changed: Gefaesstyp = { uuid: uuid, daten };
            httpServiceMock.updateGefaesstyp.mockReturnValue(of(changed));

            actions$.next(gefaesstypenActions.changeGefaesstyp({ uuid, daten }));

            const emitted = await firstValueFrom(effects.changeGefaesstyp$);

            expect(httpServiceMock.insertGefaesstyp).not.toHaveBeenCalled();
            expect(httpServiceMock.updateGefaesstyp).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.updateGefaesstyp).toHaveBeenCalledWith(uuid, daten);

            expect(emitted).toEqual(gefaesstypenActions.gefaesstypChanged({ gefaesstyp: changed }));
        });

        it('should map concurrent update to loadGefaesstypForConflict', async () => {
            const uuid = '1234';

            const serverMessage = 'Der Gefäßtyp wurde in der Zwischenzeit geändert.';

            const daten: GefaesstypDaten = {
                name: 'temp-12345',
                volumen: 2,
                anzahl: 1,
                backgroundColor: '#000000',
                version: 3,
            };

            const errorType: ErrorType = 'CONCURRENT_UPDATE';

            const error = {
                status: 409,
                error: { level: 'ERROR', message: serverMessage },
            };

            const gefaesstypError: GefaesstypError = {
                message: serverMessage,
                serverVersion: null,
                type: errorType,
                userInput: daten,
                uuid: null,
            };

            httpServiceMock.updateGefaesstyp.mockReturnValue(throwError(() => error));
            errorServiceMock.toGefaesstypError.mockReturnValue(gefaesstypError);

            actions$.next(gefaesstypenActions.changeGefaesstyp({ uuid, daten }));

            const emitted = await firstValueFrom(effects.changeGefaesstyp$);
            expect(emitted).toEqual(
                gefaesstypenActions.loadGefaesstypForConflictDialog({ uuid: uuid, userInput: daten })
            );
            expect(httpServiceMock.insertGefaesstyp).not.toHaveBeenCalled();
            expect(httpServiceMock.updateGefaesstyp).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.updateGefaesstyp).toHaveBeenCalledWith(uuid, daten);

            expect(errorServiceMock.toGefaesstypError).toHaveBeenCalledWith(error, daten);
            expect(errorServiceMock.toGefaesstypError).toHaveBeenCalledTimes(1);
        });

        it('should map duplicate to saveError', async () => {
            const uuid = '1234';

            const daten: GefaesstypDaten = {
                name: 'temp-12345',
                volumen: 2,
                anzahl: 1,
                backgroundColor: '#000000',
                version: 3,
            };

            const serverMessage = 'Einen Gefäßtyp mit diesem Volumen/Namen gibt es schon.';

            const errorType: ErrorType = 'DUPLICATE';

            const error = {
                status: 412,
                error: { level: 'ERROR', message: serverMessage },
            };

            const gefaesstypError: GefaesstypError = {
                message: serverMessage,
                serverVersion: null,
                type: errorType,
                userInput: daten,
                uuid: null,
            };

            httpServiceMock.updateGefaesstyp.mockReturnValue(throwError(() => error));
            errorServiceMock.toGefaesstypError.mockReturnValue(gefaesstypError);

            actions$.next(gefaesstypenActions.changeGefaesstyp({ uuid, daten }));

            const emitted = await firstValueFrom(effects.changeGefaesstyp$);

            expect(emitted).toEqual(gefaesstypenActions.gefaesstypenServerError({ error: gefaesstypError }));

            expect(httpServiceMock.insertGefaesstyp).not.toHaveBeenCalled();
            expect(httpServiceMock.updateGefaesstyp).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.updateGefaesstyp).toHaveBeenCalledWith(uuid, daten);

            expect(errorServiceMock.toGefaesstypError).toHaveBeenCalledWith(error, daten);
            expect(errorServiceMock.toGefaesstypError).toHaveBeenCalledTimes(1);
        });
    });

    describe('Test loadGefaesstypForConflictDialog$', () => {
        it('should map loadGefaesstypForConflictDialog to gefaesstypForConflictDialogLoaded', async () => {
            const uuid = '1234';

            const userInput: GefaesstypDaten = {
                name: 'Testgefäß',
                volumen: 2,
                anzahl: 1,
                backgroundColor: '#000000',
                version: 3,
            };

            const serverDaten: GefaesstypDaten = {
                name: 'Miniglas',
                volumen: 2,
                anzahl: 1,
                backgroundColor: '#f30c0cff',
                version: 4,
            };

            const gefaesstypFromServer: Gefaesstyp = {
                uuid: uuid,
                daten: serverDaten,
            };

            httpServiceMock.loadGefaesstypWithId.mockReturnValue(of(gefaesstypFromServer));

            actions$.next(gefaesstypenActions.loadGefaesstypForConflictDialog({ uuid, userInput }));

            const emitted = await firstValueFrom(effects.loadGefaesstypForConflictDialog$);

            expect(httpServiceMock.insertGefaesstyp).not.toHaveBeenCalled();
            expect(httpServiceMock.updateGefaesstyp).not.toHaveBeenCalled();
            expect(httpServiceMock.loadGefaesstypWithId).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.loadGefaesstypWithId).toHaveBeenCalledWith(uuid);

            expect(emitted).toEqual(
                gefaesstypenActions.gefaesstypForConflictDialogLoaded({ gefaesstypFromServer, userInput })
            );
        });

        it('should map loadGefaesstypForConflictDialog to gefaesstypServerError on error', async () => {
            const uuid = '1234';

            const userInput: GefaesstypDaten = {
                name: 'Testgefäß',
                volumen: 2,
                anzahl: 1,
                backgroundColor: '#000000',
                version: 3,
            };

            const serverMessage = 'Konnte nicht mehr finden';

            const errorType: ErrorType = 'NOT_FOUND';

            const error = {
                status: 412,
                error: { level: 'ERROR', message: serverMessage },
            };

            const gefaesstypError: GefaesstypError = {
                message: serverMessage,
                serverVersion: null,
                type: errorType,
                userInput: userInput,
                uuid: null,
            };

            httpServiceMock.loadGefaesstypWithId.mockReturnValue(throwError(() => error));
            errorServiceMock.toGefaesstypError.mockReturnValue(gefaesstypError);

            actions$.next(gefaesstypenActions.loadGefaesstypForConflictDialog({ uuid, userInput }));

            const emitted = await firstValueFrom(effects.loadGefaesstypForConflictDialog$);

            expect(httpServiceMock.insertGefaesstyp).not.toHaveBeenCalled();
            expect(httpServiceMock.updateGefaesstyp).not.toHaveBeenCalled();
            expect(httpServiceMock.loadGefaesstypWithId).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.loadGefaesstypWithId).toHaveBeenCalledWith(uuid);

            expect(emitted).toEqual(gefaesstypenActions.gefaesstypenServerError({ error: gefaesstypError }));

            expect(errorServiceMock.toGefaesstypError).toHaveBeenCalledWith(error, userInput);
            expect(errorServiceMock.toGefaesstypError).toHaveBeenCalledTimes(1);
        });
    });

    describe('Test openGefaesstypEditor$', () => {
        it('should navigate on openGefaesstypEditor and stop dispatch', async () => {
            const sub = effects.openGefaesstypEditor$.subscribe(); // dispatch:false → manuell subscriben

            actions$.next(
                gefaesstypenActions.openGefaesstypEditor({
                    uuid: firstGefaesstyp.uuid,
                })
            );

            await Promise.resolve(); // Microtask-Tick

            expect(routerMock.navigate).toHaveBeenCalledWith(['/gefaesstypen', '1234']);
            expect(routerMock.navigate).toHaveBeenCalledTimes(1);

            sub.unsubscribe();
        });
    });

    describe('Test gefaesstypEditorNavigationFailed$', () => {
        it('should navigate to gefaesstypen on gefaesstypEditorNavigationFailed and stop dispatch', async () => {
            const sub = effects.gefaesstypEditorNavigationFailed$.subscribe(); // dispatch:false → manuell subscriben

            actions$.next(gefaesstypenActions.gefaesstypEditorNavigationFailed());

            await Promise.resolve(); // Microtask-Tick

            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/gefaesstypen');
            expect(routerMock.navigateByUrl).toHaveBeenCalledTimes(1);

            sub.unsubscribe();
        });
    });

    describe('Test removeGefaesstyp$', () => {
        it('maps removeGefaesstyp to gefaesstypRemoved when ok', async () => {
            const uuid = '1234';

            // hier muss man das void aus dem backend so simulieren, sonst completed der mock nicht!
            httpServiceMock.removeGefaesstyp.mockReturnValue(of(void 0));

            actions$.next(gefaesstypenActions.removeGefaesstyp({ uuid }));
            const emitted = await firstValueFrom(effects.removeGefaesstyp$);

            expect(emitted).toEqual(gefaesstypenActions.gefaesstypRemoved({ uuid }));

            expect(httpServiceMock.insertGefaesstyp).not.toHaveBeenCalled();
            expect(httpServiceMock.updateGefaesstyp).not.toHaveBeenCalled();
            expect(httpServiceMock.loadGefaesstypWithId).not.toHaveBeenCalled();
            expect(httpServiceMock.removeGefaesstyp).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.removeGefaesstyp).toHaveBeenCalledWith(uuid);
        });

        it('maps removeGefaesstyp to gefaesstypServerError on error', async () => {
            const uuid = '1234';
            const serverMessage = 'etwas wing schief';

            const errorType: ErrorType = 'SERVER';

            const error = {
                status: 409,
                error: { level: 'ERROR', message: serverMessage },
            };

            const gefaesstypError: GefaesstypError = {
                message: serverMessage,
                serverVersion: null,
                type: errorType,
                userInput: null,
                uuid: null,
            };

            httpServiceMock.removeGefaesstyp.mockReturnValue(throwError(() => error));
            errorServiceMock.toGefaesstypError.mockReturnValue(gefaesstypError);

            // act
            actions$.next(gefaesstypenActions.removeGefaesstyp({ uuid }));

            // assert
            const emitted = await firstValueFrom(effects.removeGefaesstyp$);
            expect(emitted).toEqual(gefaesstypenActions.gefaesstypenServerError({ error: gefaesstypError }));

            expect(httpServiceMock.insertGefaesstyp).not.toHaveBeenCalled();
            expect(httpServiceMock.updateGefaesstyp).not.toHaveBeenCalled();
            expect(httpServiceMock.loadGefaesstypWithId).not.toHaveBeenCalled();
            expect(httpServiceMock.removeGefaesstyp).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.removeGefaesstyp).toHaveBeenCalledWith(uuid);

            expect(errorServiceMock.toGefaesstypError).toHaveBeenCalledWith(error, null);
            expect(errorServiceMock.toGefaesstypError).toHaveBeenCalledTimes(1);
        });
    });

    describe('editGefaesstypCancelled$', () => {
        it('navigates to gefaesstypen when edit cancelled', async () => {
            const navigateTo = '/gefaesstypen';

            vi.spyOn(messageServiceMock, 'info');
            vi.spyOn(messageServiceMock, 'warn');
            vi.spyOn(messageServiceMock, 'error');
            vi.spyOn(messageServiceMock, 'clear');
            vi.spyOn(routerMock, 'navigateByUrl');

            const subscription = effects.editGefaesstypCanceled$.pipe(take(1)).subscribe(() => {
                // assert
                expect(messageServiceMock.info).toHaveBeenCalledTimes(0);
                expect(messageServiceMock.warn).toHaveBeenCalledTimes(0);
                expect(messageServiceMock.error).toHaveBeenCalledTimes(0);
                expect(messageServiceMock.clear).toHaveBeenCalledTimes(0);

                expect(routerMock.navigateByUrl).toHaveBeenCalledOnce();
                expect(routerMock.navigateByUrl).toHaveBeenCalledWith(navigateTo);
            });

            // act
            actions$.next(gefaesstypenActions.editGefaesstypCanceled({ uuid: firstGefaesstyp.uuid }));

            subscription.unsubscribe();
        });
    });

    describe('gefaesstypAdded$', () => {
        it('sets an info-message and navigates to gefaesstypen when added successfully', async () => {
            const navigateTo = '/gefaesstypen';
            const text = 'Gefäßtyp erfolgreich gespeichert';

            vi.spyOn(messageServiceMock, 'info');
            vi.spyOn(messageServiceMock, 'warn');
            vi.spyOn(messageServiceMock, 'error');
            vi.spyOn(messageServiceMock, 'clear');
            vi.spyOn(routerMock, 'navigateByUrl');

            const subscription = effects.gefaesstypAdded$.pipe(take(1)).subscribe(() => {
                // assert
                expect(messageServiceMock.info).toHaveBeenCalledOnce();
                expect(messageServiceMock.info).toHaveBeenCalledWith(text);

                expect(messageServiceMock.warn).toHaveBeenCalledTimes(0);
                expect(messageServiceMock.error).toHaveBeenCalledTimes(0);
                expect(messageServiceMock.clear).toHaveBeenCalledTimes(0);

                expect(routerMock.navigateByUrl).toHaveBeenCalledOnce();
                expect(routerMock.navigateByUrl).toHaveBeenCalledWith(navigateTo);
            });

            // act
            actions$.next(gefaesstypenActions.gefaesstypAdded({ gefaesstyp: firstGefaesstyp }));

            subscription.unsubscribe();
        });
    });

    describe('gefaesstypChanged$', () => {
        it('sets an info-message and navigates to gefaesstypen when changed successfully', async () => {
            const navigateTo = '/gefaesstypen';
            const text = 'Gefäßtyp erfolgreich gespeichert';

            vi.spyOn(messageServiceMock, 'info');
            vi.spyOn(messageServiceMock, 'warn');
            vi.spyOn(messageServiceMock, 'error');
            vi.spyOn(messageServiceMock, 'clear');
            vi.spyOn(routerMock, 'navigateByUrl');

            const subscription = effects.gefaesstypChanged$.pipe(take(1)).subscribe(() => {
                // assert
                expect(messageServiceMock.info).toHaveBeenCalledOnce();
                expect(messageServiceMock.info).toHaveBeenCalledWith(text);

                expect(messageServiceMock.warn).toHaveBeenCalledTimes(0);
                expect(messageServiceMock.error).toHaveBeenCalledTimes(0);
                expect(messageServiceMock.clear).toHaveBeenCalledTimes(0);

                expect(routerMock.navigateByUrl).toHaveBeenCalledOnce();
                expect(routerMock.navigateByUrl).toHaveBeenCalledWith(navigateTo);
            });

            // act
            actions$.next(gefaesstypenActions.gefaesstypChanged({ gefaesstyp: firstGefaesstyp }));

            subscription.unsubscribe();
        });
    });

    describe('gefaesstypRemoved$', () => {
        it('sets an info-message and navigates to gefaesstypen when removed successfully', async () => {
            const navigateTo = '/gefaesstypen';
            const text = 'Gefäßtyp erfolgreich gelöscht';

            vi.spyOn(messageServiceMock, 'info');
            vi.spyOn(messageServiceMock, 'warn');
            vi.spyOn(messageServiceMock, 'error');
            vi.spyOn(messageServiceMock, 'clear');
            vi.spyOn(routerMock, 'navigateByUrl');

            const subscription = effects.gefaesstypRemoved$.pipe(take(1)).subscribe(() => {
                // assert
                expect(messageServiceMock.info).toHaveBeenCalledOnce();
                expect(messageServiceMock.info).toHaveBeenCalledWith(text);

                expect(messageServiceMock.warn).toHaveBeenCalledTimes(0);
                expect(messageServiceMock.error).toHaveBeenCalledTimes(0);
                expect(messageServiceMock.clear).toHaveBeenCalledTimes(0);

                expect(routerMock.navigateByUrl).toHaveBeenCalledOnce();
                expect(routerMock.navigateByUrl).toHaveBeenCalledWith(navigateTo);
            });

            // act
            actions$.next(gefaesstypenActions.gefaesstypRemoved({ uuid: firstGefaesstyp.uuid }));

            subscription.unsubscribe();
        });
    });
});
