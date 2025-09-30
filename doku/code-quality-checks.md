# Statische code quality checks für Java und Angular

## Java Formatting rules

[IntelliJ-Google-Codestyle](https://github.com/google/styleguide/blob/gh-pages/intellij-java-google-style.xml) herunterladen und über Settings -> Code Style -> Java importieren

Dann in .idea/codeStyles als Project.xml ablegen

Dann File -> Invalidate Caches und IDEA neu starten

Einmalig spotless:check ausführen. Das fixed die meisten Fehler

Auperdem: einmal alles durchformatieren und alle imports organizen

### checkstyle ausführen und findings fixen

```
mvn clean checkstyle:check
```

### pmd ausführen und findings fixen

```
mvn clean pmd:check
```

### spotbugs azführen und findings fixen

```
mvn clean compile com.github.spotbugs:spotbugs-maven-plugin:check
```

### chore-commit:

```
git add --all
git commit -m "chore(backend): reformat codebase with google-java-format"
```

Und den commit ins blame:

Im project root ein file .git-blame-ignore-revs anlegen und den commit-hash reinschreiben. Dann aktivieren:

```
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

## PMD errors

Mit IntelliJ:

Analyze -> Inspect Code

## einmal baseline-Formatierung

```
# Frontend
(cd frontend/kaeuzchen-workspace && npx prettier --write . && npx eslint . --fix)

# Backend
(cd backend/kaeuzchenlager && mvn spotless:apply)
```

### Commands zum Prüfen

```
npx lint-staged --debug
```

```
mvn spotless:check
```

## CI/CD

```
# Frontend
nx affected -t lint -t test --base=origin/develop

# Backend
mvn -q spotless:check checkstyle:check pmd:check com.github.spotbugs:spotbugs-maven-plugin:check test
```

## Testabdeckung messen

```
npm install -D @vitest/coverage-v8
```

In vite.config.mts limits konfigurieren:

```
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        // Optional: Datei-spezifische Grenzwerte
        each: {
          branches: 70,
          functions: 75,
          lines: 75,
          statements: 75
        }
      }
    }
  }
});
```

oder für strengere coverage-Regeln:

```
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        '**/*.config.*',
        '**/*.d.ts',
        '**/main.ts',
        '**/test/**',
        '**/coverage/**'
      ],
      thresholds: {
        global: {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        },
        // Auto-fail wenn Grenzwerte nicht erreicht werden
        autoUpdate: false,
        // 100: false // Keine 100% Anforderung, aber du kannst es aktivieren
      }
    }
  }
});
```

Zusätzliche vitest-Features:

```
// Beispiel für erweiterte Coverage-Konfiguration
coverage: {
  provider: 'v8',
  enabled: true,
  clean: true,          // Coverage-Verzeichnis vor jedem Run löschen
  cleanOnRerun: true,   // Beim Rerun cleanen
  all: true,            // Auch ungetestete Dateien im Report anzeigen
  skipFull: false,      // Auch 100% gecoverte Dateien anzeigen

  // Watermarks (für HTML Reports)
  watermarks: {
    statements: [80, 95],
    functions: [80, 95],
    branches: [80, 95],
    lines: [80, 95]
  }
}
```

In package.json runner scripts ergänzen:

```
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ci": "vitest run --coverage --bail=1"
  }
}
```
