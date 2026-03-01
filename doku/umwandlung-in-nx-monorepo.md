# Umwandlung in ein nx-monorepo

## Initialisierung

```
npx nx@latest init
```

nichts auswählen, danach minimal setup wählen

Dann

```sh
npm install
```

## Kleinere Aufräumarbeiten

- Verzeichnis git-hooks umbenennen in .git-hooks und das git-maven-plugin anpassen (git-hooks-path)
- .vscode nach oben ins monorepo-root-Verzeichnis gezogen
- .gitignore im monorepo-root, dann alle anderen .gitignores in Unterverzeichnissen löschen
- .nvmrc mit 22 ins root

## VSCode für Java einrichten

### .vscode/settings.json:

```json
"files.exclude": {
    "**/.git": true,
    "**/.svn": true,
    "**/.hg": true,
    "**/CVS": true,
    "**/.DS_Store": true,
    "**/Thumbs.db": true,
    "**/target": true,
    "**/node_modules": true
  },
  "hide-files.files": [],
  "exportall.config.relExclusion": [],

  /* --- Terminal Profile für dein Monorepo --- */
  "terminal.integrated.profiles.linux": {
    "Raetselbaukasten-Backend": {
      "path": "/bin/bash",
      "cwd": "${workspaceFolder}/backend/kaeuzchenlager",
      "icon": "server",
      "color": "terminal.ansiBlue"
    },
    "RBK-Frontend": {
      "path": "/bin/bash",
      "cwd": "${workspaceFolder}/frontend/kaeuzchen-workspace",
      "icon": "globe",
      "color": "terminal.ansiMagenta"
    }
  },
  "terminal.integrated.defaultProfile.linux": "bash",

  /* --- Java Minimalismus (kein automatischer Build-Stress) --- */
  "java.configuration.updateBuildConfiguration": "interactive",
  "java.autobuild.enabled": false,
  "java.import.maven.enabled": true
```

### .vscode/launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "java",
      "name": "Attach to Quarkus (5005)",
      "request": "attach",
      "hostName": "localhost",
      "port": 5005
    }
  ]
}
```

## Verzeichnisse in nx-projects umwandeln

### backend

eine projekt.json- Datei nach backend/kaeuzchenlager

### frontend

eine project.json- Datei nach frontend

alles, was unter frontend/kaeuzchenlager-workpspace/package.json als scripts lag, kam weg und wurde als nx-targets in das
frontend-wrapper-project, also nach

frontend/project.json

gepackt.

### .nxignore

Symptom:

```shell
> build:local
> npm run check-node && npx nx run orchestrator:package-backend


> check-node
> node -e "if(!process.version.startsWith('v22.')){console.error('\n❌ Node 22 required. Current:',process.version,'\n');process.exit(1)}"


> nx run orchestrator:build-frontend

> npm run build:local


> @kaeuzchen-workspace/source@1.0.0 build:local
> nx build --base-href=/kaeuzchenlager/ --deploy-url=/kaeuzchenlager/


 NX   Failed to process project graph.

The projects in the following directories have no name provided:
  - .angular/cache/20.2.2/kaeuzchen-workspace/vite/deps
```

Daher file .nxignore im frontend/kaeuzchen-workspace mit Inhalt

```gitignore
# Angular/Vite Cache – darf Nx nie als Projekt sehen
.angular/**
**/.angular/**
```

Dann cache leeren

```
rm -rf frontend/kaeuzchen-workspace/.angular
npx nx reset
```

## tasks orchestrieren

- Verzeichnis .secrets anlegen und ins .gitignore aufnehmen
- Verzeichnis orchestrator parallel zu frontend
- File project.json

Dort gibt es verschiedene Tasks zum Bauen.

## Alias- wrapper-project im monorepo-root

dort werden "alias"-targets definiert, indem die targets in den einzelnen projects aufgerufen werden.

## package.json - scripts

Tippaliase für die CLI. Sie rufen targets aus ./project.json auf.

## Finales Architekturbild

[Monorepo-Struktur](./monorepo-struktur.md)

## nx-Befehle

```shell
npx nx show projects
```
