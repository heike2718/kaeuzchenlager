# technisches Konzept für Käuzchen

## Datenbank

```
-- charset pruefen
SHOW VARIABLES LIKE 'character_set_server';
SHOW VARIABLES LIKE 'collation_server';
```

```
-- Skript zur Erstellung der Datenbank 'kaeuzchen' für MariaDB
-- Ausführung: mysql -u root -p < create_kaeuzchen_database.sql

-- Datenbank erstellen (falls nicht vorhanden)
CREATE DATABASE IF NOT EXISTS kaeuzchen;

-- oder mit charset und collate, wenn dies nicht das default ist
CREATE DATABASE IF NOT EXISTS kaeuzchen
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

--

-- Dedizierten Datenbank-Benutzer erstellen
CREATE USER IF NOT EXISTS 'kaeuzchen'@'localhost' IDENTIFIED BY 'hwinkel';
CREATE USER IF NOT EXISTS 'kaeuzchen'@'%' IDENTIFIED BY 'hwinkel';

-- Berechtigungen für den Benutzer setzen
GRANT ALL PRIVILEGES ON kaeuzchen.* TO 'kaeuzchen'@'localhost';
GRANT ALL PRIVILEGES ON kaeuzchen.* TO 'kaeuzchen'@'%';

-- Berechtigungen aktivieren
FLUSH PRIVILEGES;

-- Zur Sicherheit ausgeben, welche Berechtigungen vergeben wurden
SHOW GRANTS FOR 'kaeuzchen'@'localhost';
```

Tabellen werden mit flyway durch starten der Quarkus-Anwendung angelegt.

## frontend

### Gefäßtypen – Action-/Flow-Übersicht

(Action, Actiontyp, Auslöser, Listeners, Komponenten, Bemerkungen)

| Action                            | Actiontyp | Auslöser (dispatch)                                                                                 | Listeners                                  | Komponenten                                                                             | Bemerkungen                                                           |
| --------------------------------- | --------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| loadGefaesstypen                  | Command   | GefaesstypenFacade.ensureGefaesstypenLoadedAndSelect(uuid) \| GefaesstypenFacade.loadGefaesstypen() | loadGefaesstypen$ (effect), reducer        | GefaesstypenListComponent (Aufruf Facade), \| EditGefaesstypComponent (Observables)     | nur ausgelöst, wenn noch kein Load läuft und noch nichts geladen ist. |
| gefaesstypenLoaded                | Event     | loadGefaesstypen$ (effect)                                                                          | reducer, GefaesstypenFacade (subscription) | GefaesstypenListComponent(Observables)                                                  | -                                                                     |
| selectGefaesstypByUuid            | Command   | GefaesstypSelectionService                                                                          | reducer                                    | GefaesstypOverviewComponent (emits onEdit) \| GefaesstypenListComponent (Aufruf Facade) | ändert nur den state im reducer, um state und effects zu entkoppeln   |
| neuerGefaesstypInitialized        | Event     | GefaesstypenFacade.initNewGefaesstyp()                                                              | reducer                                    | 🔧                                                                                      | 🔧                                                                    |
| openGefaesstypEditor              | Command   | GefaesstypenFacade.initNewGefaesstyp() \| GefaesstypenFacade.startEditGefaesstyp() **pending!** 🔧  | openGefaesstypEditor$ (effect)             | GefaesstypenListComponent (Aufruf Facade - add-button)                                  | 🔧                                                                    |
| gefaesstypEditorNavigationFailed  | Event     | 🔧                                                                                                  | 🔧                                         | 🔧                                                                                      | 🔧                                                                    |
| editGefaesstypCanceled            | Event     | 🔧                                                                                                  | 🔧                                         | 🔧                                                                                      | 🔧                                                                    |
| addGefaesstyp                     | Command   | 🔧                                                                                                  | 🔧                                         | 🔧                                                                                      | 🔧                                                                    |
| gefaesstypAdded                   | Event     | 🔧                                                                                                  | 🔧                                         | 🔧                                                                                      | 🔧                                                                    |
| changeGefaesstyp                  | Command   | 🔧                                                                                                  | 🔧                                         | 🔧                                                                                      | 🔧                                                                    |
| gefaesstypChanged                 | Event     | 🔧                                                                                                  | 🔧                                         | 🔧                                                                                      | 🔧                                                                    |
| conflictDetected                  | Event     | 🔧                                                                                                  | 🔧                                         | 🔧                                                                                      | 🔧                                                                    |
| loadGefaesstypForConflictDialog   | Command   | 🔧                                                                                                  | loadGefaesstypForConflictDialog$ (effect ) | 🔧                                                                                      | 🔧                                                                    |
| gefaesstypForConflictDialogLoaded | Event     | loadGefaesstypForConflictDialog$ (effect)                                                           | reducer 🔧                                 | 🔧 EditGefaesstypComponent (Observable)                                                 | 🔧 muss Dialog öffnen                                                 |
| removeGefaesstyp                  | Command   | 🔧                                                                                                  | 🔧                                         | 🔧                                                                                      | 🔧                                                                    |
| gefaesstypRemoved                 | Event     | 🔧                                                                                                  | 🔧                                         | 🔧                                                                                      | 🔧                                                                    |
| gefaesstypenServerError           | Event     | loadGefaesstypen$ (effect) \| loadGefaesstypForConflictDialog$ (effect)                             | 🔧 **reducer - fehlt noch**                | 🔧 **MessageComponent - fehlt noch**                                                    | Lücke in Implementierung                                              |
| resetGefaesstypenState            | Command   | 🔧                                                                                                  | 🔧                                         | 🔧                                                                                      | 🔧                                                                    |

### reducer-Tests

#### loadGefaesstypen

🔧 Tests fehlen

expect: `loading: true`, `loaded: false`, `error: null`, `conflict: null`, `selectedUuid: null`

#### gefaesstypenLoaded

- sets the gefaesstypen and the loaded property when initialState
- resets selectedUuid and error when not initialState
- sets loaded when not initialState and response empty

expect `loading: false`, `loaded: true`, `error: null`, `conflict: null`, `selectedUuid: null`

#### selectGefaesstypByUuid

- sets the selectedUuid and resets error and conflict when not initialState and uuid known

expect `error: null`, `conflict: null`, `selectedUuid: null` (🔧)

#### neuerGefaesstypInitialized

- should add to gefaesstypen, sort but not setSelectedUuid

expect `selectedUuid: null`, `gefaesstypen: mit template`

#### gefaesstypForConflictDialogLoaded

- should add the conflict

#### gefaesstypEditorNavigationFailed

🔧 Implementierung und Tests fehlen

expect: selectedUuid null

### effects-Tests

Die effects heißen wie die actions, auf die sie lauschen, mit Suffix $

#### loadGefaesstypen

🔧 Tests fehlen

#### loadGefaesstypForConflictDialog

- should map loadGefaesstypForConflictDialog to gefaesstypForConflictDialogLoaded
- should map loadGefaesstypForConflictDialog to gefaesstypServerError on error

#### gefaesstypEditorNavigationFailed (tests complete)

- should navigate to gefaesstypen on gefaesstypEditorNavigationFailed and stop dispatch
