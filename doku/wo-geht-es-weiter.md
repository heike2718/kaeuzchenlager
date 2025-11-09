# Wo geht es weiter?

## nach dem 09.11.2025

- theme-button in eigene Komponente auslagern (tooltip = aria-label)
- neuen Gefäßtyp anlegen
- vorhandenen Gefäßtyp editieren
- Gefäßtyp löschen
- Anbindung backen noch ohne auth
- auth einbauen

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
