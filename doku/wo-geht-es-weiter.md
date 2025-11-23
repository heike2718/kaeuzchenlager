# Wo geht es weiter?

## nach dem 23.11.2025

```
<mat-form-field appearance="outline">
  <mat-label>Hintergrundfarbe</mat-label>
  <input
    matInput
    type="color"
    [formControl]="form.controls.backgroundColor"
  />
</mat-form-field>
```

```
<mat-form-field appearance="outline">
  <mat-label>Anzahl</mat-label>
  <input
    matInput
    type="number"
    [formControl]="form.controls.anzahl"
    min="0"
    step="1"
  />

  <button
    mat-icon-button
    matSuffix
    type="button"
    (click)="decrementAnzahl()"
    aria-label="Anzahl verringern"
  >
    <mat-icon>remove</mat-icon>
  </button>

  <button
    mat-icon-button
    matSuffix
    type="button"
    (click)="incrementAnzahl()"
    aria-label="Anzahl erhöhen"
  >
    <mat-icon>add</mat-icon>
  </button>
</mat-form-field>
```

```
<!-- Name -->
<mat-form-field appearance="outline">
  <mat-label>Name</mat-label>
  <input
    matInput
    [formControl]="form.controls.name"
    autocomplete="off"
  />
</mat-form-field>

<!-- Volumen -->
<mat-form-field appearance="outline">
  <mat-label>Volumen (ml)</mat-label>
  <input
    matInput
    type="number"
    [formControl]="form.controls.volumen"
    min="0"
    step="1"
  />
</mat-form-field>

<!-- Hintergrundfarbe -->
<mat-form-field appearance="outline">
  <mat-label>Hintergrundfarbe</mat-label>
  <input
    matInput
    type="color"
    [formControl]="form.controls.backgroundColor"
  />
</mat-form-field>

<!-- Anzahl mit +/− -->
<!-- siehe Beispiel oben -->
```

```
incrementAnzahl(): void {
  const current = this.form.controls.anzahl.value ?? 0;
  this.form.controls.anzahl.setValue(current + 1);
}

decrementAnzahl(): void {
  const current = this.form.controls.anzahl.value ?? 0;
  if (current > 0) {
    this.form.controls.anzahl.setValue(current - 1);
  }
}
```

## nach dem 16.11.2025

- gefaesstypenFacade: tests fehlen und Implementierung ist unvollständig. [chat](https://chatgpt.com/g/g-p-67cc1db6eb9481919aad0344d8070af4-angular/c/691978b0-47f0-832c-9165-3606f809ac00)

## nach dem 09.11.2025

- neuen Gefäßtyp anlegen
- vorhandenen Gefäßtyp editieren
- Gefäßtyp löschen
- Anbindung backen noch ohne auth
- auth einbauen
- theme-button in eigene Komponente auslagern (tooltip = aria-label)

## nach dem 05.10.2025

- neue action conflictDetected im reducer verarbeiten (+tests)
- effects: changeGefaesstyp$ catch-Block:

```
changeGefaesstyp
 └─(409)→ loadGefaesstypForConflict({ uuid, userInput })
         └→ gefaesstypForConflictLoaded({ gefaesstyp: server, userInput })
             └→ conflictDetected({ server, userInput })   // optional reine UI/State-Action
                 (UI zeigt Dialog mit 3 Optionen)

```

nebst tests

- selectors definieren (einer muss aus selectedUuid den selectedGefaesstyp ermitteln, z.B.)
- tests für selectors
- Tests für andere actions mit backend-calls
- list-component: Darstellung mit cards und Buttons
- edit-component

## nach dem 21.09.2025

- workspace neu generiert
- prettier und linting konfigurieren
- husky-hooks
- schrittweise wieder die Komponenten aus dem zip generieren
