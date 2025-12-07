import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GefaesstypenHttpService } from '../gefaesstypen-http.service';
import { gefaesstypenActions } from './gefaesstypen.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { GefaesstypenHttpErrorService } from '../gefaesstypen-http-error.service';
import { Router } from '@angular/router';
import { MessageService } from '@shared/components';

@Injectable({
    providedIn: 'root',
})
export class GefaesstypenEffects {
    #actions$ = inject(Actions);
    #httpService = inject(GefaesstypenHttpService);
    #errorService = inject(GefaesstypenHttpErrorService);
    #router = inject(Router);
    #messageService = inject(MessageService);

    loadGefaesstypen$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(gefaesstypenActions.loadGefaesstypen),
            switchMap(() =>
                this.#httpService.loadGefaesstypen().pipe(
                    map(gefaesstypen => gefaesstypenActions.gefaesstypenLoaded({ gefaesstypen })),
                    catchError(error =>
                        of(
                            gefaesstypenActions.gefaesstypenServerError({
                                error: this.#errorService.toGefaesstypError(error, null),
                            })
                        )
                    )
                )
            )
        )
    );

    openGefaesstypEditor$ = createEffect(
        () =>
            this.#actions$.pipe(
                ofType(gefaesstypenActions.openGefaesstypEditor),
                tap(({ uuid }) => this.#router.navigate(['/gefaesstypen', uuid]))
            ),
        { dispatch: false }
    );

    gefaesstypEditorNavigationFailed$ = createEffect(
        () =>
            this.#actions$.pipe(
                ofType(gefaesstypenActions.gefaesstypEditorNavigationFailed),
                tap(() => this.#router.navigateByUrl('/gefaesstypen'))
            ),
        { dispatch: false }
    );

    addGefaesstyp$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(gefaesstypenActions.addGefaesstyp),
            switchMap(({ gefaesstyp }) =>
                this.#httpService.insertGefaesstyp(gefaesstyp).pipe(
                    map(gefaesstyp =>
                        gefaesstypenActions.gefaesstypAdded({
                            gefaesstyp: gefaesstyp,
                        })
                    ),
                    catchError(error =>
                        of(
                            gefaesstypenActions.gefaesstypenServerError({
                                error: this.#errorService.toGefaesstypError(error, gefaesstyp.daten),
                            })
                        )
                    )
                )
            )
        )
    );

    gefaesstypAdded$ = createEffect(
        () =>
            this.#actions$.pipe(
                ofType(gefaesstypenActions.gefaesstypAdded),
                tap(() => {
                    this.#router.navigateByUrl('/gefaesstypen');
                    this.#messageService.info('Gefäßtyp erfolgreich gespeichert');
                })
            ),
        { dispatch: false }
    );

    gefaesstypenServerError$ = createEffect(
        () =>
            this.#actions$.pipe(
                ofType(gefaesstypenActions.gefaesstypenServerError),
                tap(() => {
                    console.log('jetzt Fehler- oder Warnmeldung an noch nicht vorhandenen MessageService');
                })
            ),
        { dispatch: false }
    );

    changeGefaesstyp$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(gefaesstypenActions.changeGefaesstyp),
            switchMap(({ uuid: uuid, daten: daten }) =>
                this.#httpService.updateGefaesstyp(uuid, daten).pipe(
                    map(gefaesstyp =>
                        gefaesstypenActions.gefaesstypChanged({
                            gefaesstyp: gefaesstyp,
                        })
                    ),
                    catchError(error => {
                        const mappedError = this.#errorService.toGefaesstypError(error, daten);
                        return mappedError.type === 'CONCURRENT_UPDATE'
                            ? of(
                                  gefaesstypenActions.loadGefaesstypForConflictDialog({
                                      uuid: uuid,
                                      userInput: daten,
                                  })
                              )
                            : of(gefaesstypenActions.gefaesstypenServerError({ error: mappedError }));
                    })
                )
            )
        )
    );

    gefaesstypChanged$ = createEffect(
        () =>
            this.#actions$.pipe(
                ofType(gefaesstypenActions.gefaesstypChanged),
                tap(() => {
                    this.#router.navigateByUrl('/gefaesstypen');
                    this.#messageService.info('Gefäßtyp erfolgreich gespeichert');
                })
            ),
        { dispatch: false }
    );

    loadGefaesstypForConflictDialog$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(gefaesstypenActions.loadGefaesstypForConflictDialog),
            switchMap(({ uuid: uuid, userInput: userInput }) =>
                this.#httpService.loadGefaesstypWithId(uuid).pipe(
                    map(gefaesstypFromServer =>
                        gefaesstypenActions.gefaesstypForConflictDialogLoaded({
                            gefaesstypFromServer: gefaesstypFromServer,
                            userInput: userInput,
                        })
                    ),
                    catchError(error =>
                        of(
                            gefaesstypenActions.gefaesstypenServerError({
                                error: this.#errorService.toGefaesstypError(error, userInput),
                            })
                        )
                    )
                )
            )
        )
    );

    removeGefaesstyp$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(gefaesstypenActions.removeGefaesstyp),
            switchMap(({ uuid }) =>
                this.#httpService.removeGefaesstyp(uuid).pipe(
                    map(() =>
                        gefaesstypenActions.gefaesstypRemoved({
                            uuid,
                        })
                    ),
                    catchError(error =>
                        of(
                            gefaesstypenActions.gefaesstypenServerError({
                                error: this.#errorService.toGefaesstypError(error, null),
                            })
                        )
                    )
                )
            )
        )
    );

    gefaesstypRemoved$ = createEffect(
        () =>
            this.#actions$.pipe(
                ofType(gefaesstypenActions.gefaesstypChanged),
                tap(() => {
                    this.#router.navigateByUrl('/gefaesstypen');
                    this.#messageService.info('Gefäßtyp erfolgreich gelöscht');
                })
            ),
        { dispatch: false }
    );
}
