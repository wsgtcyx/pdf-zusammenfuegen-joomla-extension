<?php

/**
 * @package     Pdfzus.Plugin
 * @subpackage  Content.pdfzusmerge
 *
 * @copyright   (C) 2026 pdfzus
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Plugin\Content\Pdfzusmerge\Extension;

\defined('_JEXEC') or die;

use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Document\HtmlDocument;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Uri\Uri;
use Joomla\Event\DispatcherInterface;

final class Pdfzusmerge extends CMSPlugin
{
    protected $autoloadLanguage = true;

    public function __construct(DispatcherInterface $dispatcher, array $config, CMSApplicationInterface $application)
    {
        parent::__construct($dispatcher, $config);
        $this->setApplication($application);
    }

    public function onContentPrepare($context, &$article, &$params, $page = 0): void
    {
        if (!isset($article->text) || strpos((string) $article->text, '{pdfzusmerge}') === false) {
            return;
        }

        $document = $this->getApplication()->getDocument();

        if (!$document instanceof HtmlDocument) {
            return;
        }

        $componentParams = ComponentHelper::getParams('com_pdfzusmerge');
        $config = [
            'mode' => 'embed',
            'title' => (string) $componentParams->get('tool_title', 'PDF Zusammenfuegen von pdfzus'),
            'subtitle' => 'Direkt im Artikel lokal zusammenfuegen. Keine Datei verlaesst den Browser.',
            'downloadFileName' => (string) $componentParams->get('download_file_name', 'pdfzus-merge'),
            'showPrivacyNote' => (bool) $componentParams->get('show_privacy_note', 1),
        ];
        $configJson = json_encode($config, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT);
        $baseUri = Uri::root(true);

        static $assetsLoaded = false;

        if (!$assetsLoaded) {
            $document->addStyleSheet($baseUri . '/media/com_pdfzusmerge/app.css');
            $document->addCustomTag('<script type="module" src="' . htmlspecialchars($baseUri . '/media/com_pdfzusmerge/app.js', ENT_QUOTES, 'UTF-8') . '"></script>');
            $assetsLoaded = true;
        }

        $replacement = '<div data-pdfzusmerge-app data-config="' . htmlspecialchars((string) $configJson, ENT_QUOTES, 'UTF-8') . '"></div>';
        $article->text = str_replace('{pdfzusmerge}', $replacement, (string) $article->text);
    }
}
