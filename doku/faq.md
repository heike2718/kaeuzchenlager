# FAQ

## Ein beseitigter linting error wird weiterhin moniert

_Lösung:_ alle cacheverzeichnisse löschen

```
rm -rf .eslintcache
rm -rf .nx/cache
rm -rf node_modules/.cache
```

Wenn es beim commit passiert, also pre-commit, dann hat man möglicherweise vergessen, die Korrektur zu adden, so dass das staged file noch fehlerhaft ist.
