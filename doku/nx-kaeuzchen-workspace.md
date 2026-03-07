# Käuzchen-Workspace für die Angular-App

```
npx create-nx-workspace@latest kaeuzchen-workspace --preset=angular
```

## Initialisierung bei vorhandenem code

Siehe [code-quality-checks](./code-quality-checks.md)

## Verzeichnisstruktur und Generierung der Komponenten

src/app/
├── core/ # Globale Services, Interceptors, Guards
│ ├── services/
│ ├── interceptors/
│ └── guards/
├── shared/ # Wiederverwendbare Komponenten (nicht feature-spezifisch)
│ ├── components/
│ │ ├── loading-indicator/
│ │ ├── message/
│ │ └── ui/ # Basis-UI-Komponenten
│ └── pipes/
├── layout/ # Layout-Komponenten (statt shell)
│ ├── toolbar/
│ ├── sidenav/
│ └── footer/
├── home/
├── gefaesstypen/
└── auth/

### Schematics

```
npx nx generate @nx/angular:component home --standalone --project kaeuzchen-workspace --style scss --dry-run
```

# Layout Komponenten

npx nx generate @nx/angular:component layout/toolbar --standalone --project=kaeuzchen-workspace
nx generate @nx/angular:component layout/sidenav --standalone --project=kaeuzchen-workspace

# NGRX Root Store (Auth)

nx generate @nx/angular:ngrx auth --module=app.config.ts --root --project=kaeuzchen-workspace

# NGRX Feature Store (Gefäßtypen)

nx generate @nx/angular:ngrx gefaesstypen --module=src/app/features/gefaesstypen/gefaesstypen.routes.ts --project=kaeuzchen-workspace
