# FAQ

## Ein beseitigter linting error wird weiterhin moniert

_Lösung:_ alle cacheverzeichnisse löschen

```
rm -rf .eslintcache
rm -rf .nx/cache
rm -rf node_modules/.cache
```

Wenn es beim commit passiert, also pre-commit, dann hat man möglicherweise vergessen, die Korrektur zu adden, so dass das staged file noch fehlerhaft ist.

## quarkus cli

[quarkus cli-tooling](https://quarkus.io/guides/cli-tooling)

Linux:

```
curl -Ls https://sh.jbang.dev | bash -s - trust add https://repo1.maven.org/maven2/io/quarkus/quarkus-cli/
curl -Ls https://sh.jbang.dev | bash -s - app install --fresh --force quarkus@quarkusio
```

Windows (mit Powershell)

```
iex "& { $(iwr https://ps.jbang.dev) } trust add https://repo1.maven.org/maven2/io/quarkus/quarkus-cli/"
iex "& { $(iwr https://ps.jbang.dev) } app install --fresh --force quarkus@quarkusio"
```
