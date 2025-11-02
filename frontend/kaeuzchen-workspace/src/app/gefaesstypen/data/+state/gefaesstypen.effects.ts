import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GefaesstypenHttpService } from '../gefaesstypen-http.service';
import { gefaesstypenActions } from './gefaesstypen.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { GefaesstypenHttpErrorService } from '../gefaesstypen-http-error.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GefaesstypenEffects {
  #actions$ = inject(Actions);
  #httpService = inject(GefaesstypenHttpService);
  #errorService = inject(GefaesstypenHttpErrorService);
  #router = inject(Router);

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

  addGefaesstyp$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(gefaesstypenActions.addGefaesstyp),
      switchMap(({ daten }) =>
        this.#httpService.insertGefaesstyp(daten).pipe(
          map(gefaesstyp =>
            gefaesstypenActions.gefaesstypAdded({
              gefaesstyp: gefaesstyp,
            })
          ),
          catchError(error =>
            of(
              gefaesstypenActions.gefaesstypenServerError({
                error: this.#errorService.toGefaesstypError(error, daten),
              })
            )
          )
        )
      )
    )
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

  gefaesstypSeleced$ = createEffect(
    () =>
      this.#actions$.pipe(
        ofType(gefaesstypenActions.gefaesstypSelected),
        tap(action => {
          this.#router.navigateByUrl(action.navigateTo);
        })
      ),
    { dispatch: false }
  );

  removeGefaesstyp$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(gefaesstypenActions.removeGefaesstyp),
      switchMap(({ uuid, navigateTo }) =>
        this.#httpService.removeGefaesstyp(uuid).pipe(
          map(() =>
            gefaesstypenActions.gefaesstypRemoved({
              uuid,
              navigateTo,
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
}
