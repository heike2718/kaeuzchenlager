# Käuzchen-Workspace für die Angular-App

```
npx create-nx-workspace@latest kaeuzchen-workspace --preset=angular
```

## git-hooks

(im project root)

```
mkdir git-hooks
```

Standardmäßig schaut git-hooks unter .git/hooks. Das biegen wir um:

```
git config core.hooksPath git-hooks
```

### pre-commit-hook anlegen:

```
touch git-hooks/pre-commit
chmod +x git-hooks/pre-commit
```

## husky

```
npm install -D husky

# .husky anlegen
npx --yes husky init

# pre-commit Hook erstellen
cat > .husky/pre-commit <<'SH'
#!/usr/bin/env sh
set -e
npx nx format:check
SH
chmod +x .husky/pre-commit

# prepare-Script setzen (damit Git-Hooks aktiv sind)
npm pkg set scripts.prepare="husky"
```

## Initialisierung bei vorhandenem code

Siehe [code-quality-checks](./code-quality-checks.md)
