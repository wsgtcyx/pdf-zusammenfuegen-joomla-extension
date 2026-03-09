<?php

/**
 * @package     Pdfzus.Site
 * @subpackage  com_pdfzusmerge
 *
 * @copyright   (C) 2026 pdfzus
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Uri\Uri;

$document = $this->getDocument();
$baseUri = Uri::root(true);
$params = $this->params;
$config = [
    'mode' => 'standalone',
    'title' => (string) $params->get('tool_title', 'PDF Zusammenfuegen von pdfzus'),
    'subtitle' => (string) $params->get('tool_subtitle', 'Mehrere PDF-Dateien lokal sortieren, Bereiche waehlen und ohne Upload zu einer einzigen Datei verbinden.'),
    'downloadFileName' => (string) $params->get('download_file_name', 'pdfzus-merge'),
    'showPrivacyNote' => (bool) $params->get('show_privacy_note', 1),
];
$configJson = json_encode($config, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT);

$document->addStyleSheet($baseUri . '/media/com_pdfzusmerge/app.css');
$document->addCustomTag('<script type="module" src="' . htmlspecialchars($baseUri . '/media/com_pdfzusmerge/app.js', ENT_QUOTES, 'UTF-8') . '"></script>');
?>
<div
  data-pdfzusmerge-app
  data-config="<?php echo htmlspecialchars((string) $configJson, ENT_QUOTES, 'UTF-8'); ?>"
></div>
