# Docker-Schnellstart

Dieses Verzeichnis stellt eine lokale Joomla-5-Testumgebung fuer die Smoke-Tests bereit.

## Start

```bash
pnpm smoke:compose:up
```

Danach ist Joomla unter `http://127.0.0.1:8087` erreichbar.

## Stoppen

```bash
pnpm smoke:compose:down
```

## Testziel

- Web-Installer abschliessen
- Paket `pkg_pdfzusmerge_v0.1.0.zip` hochladen
- Backend-Dashboard der Komponente pruefen
- Frontend-Werkzeug ueber Menueeintrag pruefen
- `{pdfzusmerge}` in einem Beitrag pruefen
