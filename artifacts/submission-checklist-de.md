# Einreichungs-Checkliste fuer GitHub und JED

## Vor dem Release

- [ ] `pnpm install`
- [ ] `pnpm build:release`
- [ ] Release-Dateien in `artifacts/release/` vorhanden
- [ ] `manifest.xml` im Projektwurzelverzeichnis vorhanden
- [ ] Source-ZIP in `artifacts/source/` erzeugt
- [ ] Screenshots in `artifacts/screenshots/` vorhanden

## GitHub uebernehmen

Diese Punkte muessen manuell mit Login erledigt werden:

- [ ] GitHub-Repository fuer `joomla-extension-pdf-zusammenfuegen` anlegen oder bestaetigen
- [ ] Lokalen Stand in das Release-Repository pushen
- [ ] Release `v0.1.0` erstellen
- [ ] Diese Dateien am Release anhaengen:
  - `com_pdfzusmerge_v0.1.0.zip`
  - `plg_content_pdfzusmerge_v0.1.0.zip`
  - `pkg_pdfzusmerge_v0.1.0.zip`
  - Source-ZIP
- [ ] `manifest.xml` ueber eine stabile Raw-URL veroeffentlichen
- [ ] Download- und Support-Links pruefen

## JED uebernehmen

Diese Punkte muessen manuell mit JED-Konto erledigt werden:

- [ ] Im Joomla Extensions Directory anmelden
- [ ] Neues Listing fuer `PDF Zusammenfuegen von pdfzus` anlegen
- [ ] Homepage auf `https://pdfzus.de/` setzen
- [ ] Download-Link auf GitHub Release oder direkte Paket-URL setzen
- [ ] Dokumentations-Link auf Repository-README setzen
- [ ] Support-Link auf GitHub Issues setzen
- [ ] Text aus `artifacts/JED-LISTING.de.md` uebernehmen
- [ ] Reviewer-Hinweise aus `artifacts/JED-REVIEWER-NOTES.de.md` einreichen
- [ ] Paketdatei hochladen
- [ ] Screenshots und Logo hochladen
- [ ] Listing zur manuellen Pruefung absenden

## Nach der Einreichung

- [ ] Bestaetigungsmail oder Status im JED dokumentieren
- [ ] Falls Rueckfragen vom JED-Team kommen, Antworten und ggf. neues Paket erzeugen
- [ ] Bei Freigabe Release-URL und Listing-URL in Projektunterlagen nachtragen
