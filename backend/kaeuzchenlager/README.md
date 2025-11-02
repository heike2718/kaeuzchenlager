# kaeuzchenlager

## FAQ

### Probleme mit maven-mixins in der IntelliJ-Community-Edition

*Problem:* JUnit-Tests können nicht mehr mit dem integierten Testrunner ausgeführt werden.

*Lösung:* Im maven-unittest-mixin die surefire-Konfiguration um Folgendes erweitern:

```xml
<configuration>
  <!-- Wichtig für IntelliJ Integration -->
  <useSystemClassLoader>false</useSystemClassLoader>
  <useManifestOnlyJar>false</useManifestOnlyJar>
  <argLine>-Dfile.encoding=UTF-8</argLine>
</configuration>
```
