# KaeuzchenWorkspace

## Lokale Entwicklung mit CORS

Um den Redirect zum IAM lokal nicht mit CORS zu blocken, definiert man eine proxy-Konfiguration:

[proxy.conf.json](./proxy.conf.json)

in der die URL mit PORT des IAM definiert wird.

Diese wird in run-Konfiguration npm start eingebunden:

```json
"start": "nx serve --proxy-config=proxy.conf.json",
```
