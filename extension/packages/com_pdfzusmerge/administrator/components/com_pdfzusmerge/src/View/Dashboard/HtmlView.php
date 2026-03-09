<?php

/**
 * @package     Pdfzus.Administrator
 * @subpackage  com_pdfzusmerge
 *
 * @copyright   (C) 2026 pdfzus
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Component\Pdfzusmerge\Administrator\View\Dashboard;

\defined('_JEXEC') or die;

use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Factory;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;

final class HtmlView extends BaseHtmlView
{
    public object $params;

    public function display($tpl = null): void
    {
        $this->params = ComponentHelper::getParams('com_pdfzusmerge');

        Factory::getApplication()->getDocument()->setTitle('PDF Zusammenfuegen von pdfzus');

        parent::display($tpl);
    }
}
