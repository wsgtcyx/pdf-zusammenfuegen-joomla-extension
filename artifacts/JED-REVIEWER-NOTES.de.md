# Reviewer Notes fuer das JED-Team

## Kurzueberblick

`PDF Zusammenfuegen von pdfzus` ist eine echte Joomla-Erweiterung mit Frontend-Funktionalitaet. Sie ist **kein** Listing-Wrapper und fuegt standardmaessig **keinen** Developer-Backlink in die Ausgabe einer Joomla-Seite ein.

Die Erweiterung enthaelt:

- eine Komponente `com_pdfzusmerge`
- ein Content-Plugin `plg_content_pdfzusmerge`
- lokale Frontend-Assets fuer PDF-Merge im Browser

## Wichtige Pruefpunkte

### 1. Keine externen PDF-Uploads

Die Merge-Logik laeuft clientseitig im Browser. PDF-Dateien werden nicht an `pdfzus.de` oder andere Fremdserver hochgeladen. Die Erweiterung ist fuer einen lokalen Datenschutz-Workflow gebaut.

### 2. Kein Frontend-Backlink

Es wird kein verpflichtender Link zum Entwickler in die HTML-Ausgabe der Website eingefuegt. Links zu `pdfzus.de` werden nur in den normalen JED-Feldern wie Homepage oder Dokumentation verwendet.

### 3. Kein Remote-Script-Zwang

Die Frontend-Funktion ist fuer lokal gebuendelte Assets ausgelegt. Die Erweiterung benoetigt fuer die Grundfunktion keine extern nachgeladenen Tracking- oder Merge-Dienste.

### 4. Reale Joomla-Funktion

- Die Komponente kann ueber einen Menuepunkt aufgerufen werden.
- Das Plugin kann ueber `{pdfzusmerge}` in Inhalten genutzt werden.
- Die Erweiterung ist fuer Install, Aktivierung und Uninstall ohne Core-Hacks vorgesehen.

## Listing- und Distributionslogik

- **Homepage:** `https://pdfzus.de/`
- **Download:** GitHub Release des eigenstaendigen Repositories
- **Dokumentation:** README im Repository
- **Support:** GitHub Issues
- **Update Feed:** `manifest.xml` fuer das Joomla Update System

## Warum die Homepage auf pdfzus.de zeigt

`pdfzus.de` ist die Produkt- und Herstellerseite. Das JED-Listing nutzt die Homepage-Angabe als normale Projektmetadaten und nicht als erzwungenen Site-Backlink im Frontend. Die Erweiterung selbst bleibt lokal nutzbar und funktionsfaehig.

## Pruefhinweis fuer Installationen

Bitte bevorzugt das Paket `pkg_pdfzusmerge_v0.1.0.zip` fuer den Test. Es installiert sowohl die Komponente als auch das Content-Plugin.
