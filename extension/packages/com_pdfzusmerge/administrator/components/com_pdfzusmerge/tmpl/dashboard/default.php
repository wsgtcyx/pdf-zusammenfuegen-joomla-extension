<?php

/**
 * @package     Pdfzus.Administrator
 * @subpackage  com_pdfzusmerge
 *
 * @copyright   (C) 2026 pdfzus
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

\defined('_JEXEC') or die;

$params = $this->params;
?>
<div class="container-fluid">
  <div class="row">
    <div class="col-lg-8">
      <div class="card mb-4">
        <div class="card-body">
          <h1 class="h3">PDF Zusammenfuegen von pdfzus</h1>
          <p class="mb-3">
            Diese Komponente stellt ein echtes Frontend-Werkzeug fuer lokales PDF-Zusammenfuegen bereit.
            Dateien bleiben im Browser des Besuchers. Es findet kein Upload auf externe Server statt.
          </p>
          <ul class="mb-0">
            <li>Frontend-Komponente fuer Menueeintraege und direkte Seitenaufrufe</li>
            <li>Content-Plugin fuer den Shortcode <code>{pdfzusmerge}</code></li>
            <li>Keine Frontend-Backlinks, keine Telemetrie, keine Wasserzeichen</li>
          </ul>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <h2 class="h4">Aktive Konfiguration</h2>
          <dl class="row mb-0">
            <dt class="col-sm-4">Titel</dt>
            <dd class="col-sm-8"><?php echo htmlspecialchars((string) $params->get('tool_title', 'PDF Zusammenfuegen von pdfzus'), ENT_QUOTES, 'UTF-8'); ?></dd>
            <dt class="col-sm-4">Download-Dateiname</dt>
            <dd class="col-sm-8"><?php echo htmlspecialchars((string) $params->get('download_file_name', 'pdfzus-merge'), ENT_QUOTES, 'UTF-8'); ?></dd>
            <dt class="col-sm-4">Datenschutz-Hinweis</dt>
            <dd class="col-sm-8"><?php echo $params->get('show_privacy_note', 1) ? 'Aktiv' : 'Deaktiviert'; ?></dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="col-lg-4">
      <div class="card">
        <div class="card-body">
          <h2 class="h4">Einbindung</h2>
          <p>Fuer eine komplette Seite legen Sie einen Menueeintrag auf <code>index.php?option=com_pdfzusmerge&amp;view=tool</code> an.</p>
          <p class="mb-0">Fuer Artikel nutzen Sie den Shortcode <code>{pdfzusmerge}</code>.</p>
        </div>
      </div>
    </div>
  </div>
</div>
