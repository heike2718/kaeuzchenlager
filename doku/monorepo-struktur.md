# Finale Struktur des Nx-Monorepos

## Überblick

Das Repository ist als Nx-Monorepo mit klar getrennter Verantwortlichkeit strukturiert.

Ziele der Struktur:

- Entwicklungslogik bleibt in den jeweiligen Projekten.
- Build- und Deployment-Logik ist zentral orchestriert.
- Der Repository-Root dient ausschließlich als Entwickler-Einstiegspunkt (Alias-Schicht).
- Keine doppelte Implementierung von Build-Logik.
- Keine verschachtelten `npm run → nx → npm run`-Ketten.

---

## Projektstruktur und Verantwortlichkeiten

### 1️⃣ Frontend-Projekt

**Pfad:** `frontend/kaeuzchen-workspace`  
**Nx-Projektname:** `kaeuzchen-workspace`

Enthält ausschließlich entwicklungsbezogene Targets.

Beispiele:

- `serve`
- `build`
  - Konfigurationen: `development`, `qs`, `production`
- `lint`
- `test`
- `extract-i18n`
- ggf. weitere Angular-/Nx-Standardtargets

#### Prinzip

- Keine Deployment-Logik
- Kein Kopieren ins Backend
- Kein Entfernen von `dist`
- Keine Umgebungsdateien
- Keine Release-spezifischen Parameter

Das Frontend kennt nur:

> „Ich kann mich selbst entwickeln, testen und bauen.“

---

### 2️⃣ Backend-Projekt

**Pfad:** `backend/kaeuzchenlager`  
**Nx-Projektname:** `kaeuzchenlager-api`

Enthält nur entwicklungsrelevante Targets.

Beispiele:

- `dev`
- `debug`
- `test`
- `dev-build` (lokales Package ohne Release-Kontext)

#### Prinzip

- Kein `clean`
- Kein Security-Scan
- Kein Frontend-Kopieren
- Kein Deployment
- Keine NVD-Parameter
- Keine envFile-Verarbeitung

Das Backend kennt nur:

> „Ich kann lokal gestartet, getestet und gebaut werden.“

---

### 3️⃣ Orchestrator-Projekt

**Pfad:** `orchestrator`

Enthält alles, was die **Anwendung als Ganzes** betrifft.

Beispiele:

- `build-frontend`
- `copy-frontend-into-backend`
- `package-backend`
- `deploy`

Hier liegen:

- `rm -rf dist`
- Profil-Weiterleitung (`params: "forward"`)
- Maven `clean package`
- NVD-Parameter
- `envFile`
- Output-Definitionen
- Build-Reihenfolge (`dependsOn`)

#### Prinzip

Der Orchestrator kennt:

> „Wie wird die komplette Anwendung gebaut und deployt?“

Er ist die einzige Stelle mit:

- Pipeline-Logik
- Release-Parametern
- Umgebungsabhängigkeit
- Packaging-Strategie

Frontend und Backend bleiben davon unberührt.

---

### 4️⃣ Root-Projekt (`kaeuzchenlager`)

Dient ausschließlich als Alias-Hub für Entwickler.

Beispiele:

- `fe-serve`
- `fe-build`
- `be-dev`
- `be-test`
- `deploy`

Diese Targets delegieren lediglich an andere Projekte.

#### Prinzip

- Keine fachliche Logik
- Keine Build-Implementierung
- Keine Deployment-Details
- Nur Komfort

Der Root ist die UX-Schicht.

---

## Architekturprinzipien

### 1. Klare Trennung von Verantwortung

| Ebene        | Verantwortung                    |
| ------------ | -------------------------------- |
| Frontend     | UI-Entwicklung                   |
| Backend      | API-Entwicklung                  |
| Orchestrator | Packaging & Deployment           |
| Root         | Developer-Einstiegspunkt (Alias) |

---

### 2. Keine Doppelimplementierung

- Keine npm-Script-Kaskaden
- Keine Nx-ruft-npm-ruft-Nx-Konstrukte
- Keine mehrfach definierte Build-Logik
- Jede Logik existiert genau an einer Stelle

---

### 3. Profilsteuerung ausschließlich im Orchestrator

Frontend kennt Konfigurationen (`development`, `qs`, `production`).

Orchestrator entscheidet:

- Welche Konfiguration wird verwendet?
- Wann wird gebaut?
- In welcher Reihenfolge?
- Mit welchen Parametern?

---

### 4. Entwicklung ist nicht gleich Release

Dev-Targets:

- Schnell
- Lokal
- Ohne Clean
- Ohne Security-Scan
- Ohne envFile

Release-Targets:

- Clean
- NVD
- Umgebungsvariablen
- Frontend-Kopieren
- Vollständiges Packaging

Diese Trennung verhindert Vermischung von Verantwortlichkeiten.

---

## Mentales Modell

Frontend sagt:

> „Ich starte, teste, linte und baue mich.“

Backend sagt:

> „Ich starte und teste mich.“

Orchestrator sagt:

> „Ich baue die Anwendung.“

Root sagt:

> „Hier sind bequeme Einstiegspunkte.“

---

## Ergebnis

Die Struktur ist:

- klar getrennt
- konsistent
- wartbar
- ohne zyklische Verantwortlichkeiten
- ohne Alias-Spaghetti
- ohne implizite Seiteneffekte

Architektonisch ist dieses Setup stabil und langfristig skalierbar.
