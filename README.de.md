# PDF Zusammenfuegen von pdfzus

`PDF Zusammenfuegen von pdfzus` ist eine Joomla-Erweiterung fuer einen klaren, pruefbaren Anwendungsfall: Mehrere PDF-Dateien direkt auf der Website lokal im Browser zusammenfuehren, ohne Upload an Fremdserver, ohne Wasserzeichen und ohne Pflichtkonto.

Die Erweiterung ist fuer ein JED-Listing vorbereitet und wird als echtes Frontend-Werkzeug ausgeliefert, nicht als blosser Weiterleitungs-Wrapper. Sie enthaelt:

- eine Joomla-Komponente `com_pdfzusmerge` fuer den direkten Aufruf per Menuepunkt
- ein Content-Plugin `plg_content_pdfzusmerge` fuer die Einbettung per `{pdfzusmerge}`
- lokale Frontend-Assets fuer Upload, Sortierung, Seitenbereichsauswahl und Download
- Build-Skripte fuer Release-ZIP, Update-Manifest und JED-Artefakte
- eine Docker-Testumgebung fuer Joomla-Smoke-Tests

## Produktversprechen

- **100 % lokale Verarbeitung im Browser:** PDF-Dateien werden nicht an pdfzus.de oder andere Server hochgeladen.
- **DSGVO-konformer Workflow:** Die Merge-Logik laeuft clientseitig mit lokal gebuendelten Assets.
- **Keine Wasserzeichen:** Das erzeugte Dokument bleibt sauber und professionell.
- **Joomla-taugliche Einbindung:** Als eigenstaendige Komponente oder direkt in Artikeln per Plugin-Tag.
- **JED-konforme Distribution:** Homepage, Download, Dokumentation und Update-Feed sind getrennt und sauber dokumentiert.

## Funktionen

- Mehrere PDFs im Frontend auswaehlen oder per Drag-and-Drop ablegen
- Reihenfolge der Dateien direkt in der Oberflaeche aendern
- Optionale Seitenbereiche pro Datei definieren
- Zusammengefuehrtes PDF lokal herunterladen
- Hinweistext fuer Datenschutz und lokale Verarbeitung
- Einbettung in Joomla-Inhalte ueber `{pdfzusmerge}`

## Projektstruktur

- `src/`: Frontend-Quellcode fuer die lokale Merge-Oberflaeche
- `extension/`: Joomla-Erweiterungsquellen fuer Komponente, Plugin und Paket
- `build/`: Build-, Packaging- und Manifest-Skripte
- `docker/`: Joomla- und MariaDB-Testumgebung
- `artifacts/`: JED-Listing, Reviewer Notes, Changelog, Screenshots und Release-Artefakte

## Lokale Entwicklung

```bash
pnpm install
pnpm build:release
```

Der Release-Build erzeugt unter `artifacts/release/` die Joomla-Pakete und im Projektwurzelverzeichnis das Update-Manifest fuer Joomla.

## Docker-Smoke-Test

```bash
pnpm test:smoke
```

Der Smoke-Test ist fuer eine lokale Joomla-Instanz in Docker ausgelegt. Ziel ist kein theoretischer Build-Nachweis, sondern ein echter Installations- und Frontend-Check.

## Geplante Release-Dateien

- `artifacts/release/com_pdfzusmerge_v0.1.0.zip`
- `artifacts/release/plg_content_pdfzusmerge_v0.1.0.zip`
- `artifacts/release/pkg_pdfzusmerge_v0.1.0.zip`
- `manifest.xml`
- `artifacts/source/joomla-extension-pdf-zusammenfuegen-source.zip`

## JED-Positionierung

- **Name:** PDF Zusammenfuegen von pdfzus
- **Homepage:** [https://pdfzus.de/](https://pdfzus.de/)
- **Download:** GitHub Release des eigenstaendigen Repositories
- **Dokumentation:** README dieses Repositories
- **Support:** GitHub Issues des Repositories

Die Erweiterung fuegt standardmaessig **keinen** Developer-Backlink im Frontend aus. Der Verweis auf `pdfzus.de` wird ausschliesslich ueber normale JED-Felder wie Homepage, Dokumentation und Download gepflegt.

## Was nach lokalem Build noch uebernommen werden muss

Diese Schritte benoetigen einen menschlichen Login und sind bewusst nicht automatisiert:

1. GitHub-Repository erstellen oder bestaetigen
2. Code pushen
3. Release `v0.1.0` anlegen und ZIP-Artefakte hochladen
4. `manifest.xml` ueber GitHub Raw oder eine stabile URL veroeffentlichen
5. Joomla Extensions Directory Konto oeffnen
6. Listing anlegen, Felder aus `artifacts/JED-LISTING.de.md` uebernehmen
7. Reviewer-Hinweise und Release-Paket hochladen
8. Listing zur manuellen Pruefung einreichen

## Lizenz

Die Joomla-Erweiterung ist fuer eine Distribution unter `GPL-2.0-or-later` vorbereitet. Das ist fuer ein JED-Listing relevant und wird in Manifesten und PHP-Dateien entsprechend hinterlegt.
