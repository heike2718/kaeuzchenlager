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
