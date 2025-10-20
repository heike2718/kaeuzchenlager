import { inject, Injectable } from '@angular/core';
import { GefaesstypDaten, GefaesstypError } from '@gefaesstypen/model';
import { ErrorService } from '@core/services';

@Injectable({
  providedIn: 'root',
})
export class GefaesstypenHttpErrorService {
  #errorService = inject(ErrorService);

  public toGefaesstypError(
    error: NonNullable<unknown>,
    userInput: GefaesstypDaten | undefined
  ): GefaesstypError {
    const kaeuzchenError = this.#errorService.toKaeuzchenError(error);

    return {
      message: kaeuzchenError.message,
      serverVersion: null,
      type: kaeuzchenError.type,
      userInput: userInput,
      uuid: null,
    };
  }
}
