<?php

/**
 * @package     Pdfzus.Administrator
 * @subpackage  com_pdfzusmerge
 *
 * @copyright   (C) 2026 pdfzus
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Component\Pdfzusmerge\Administrator\Extension;

\defined('_JEXEC') or die;

use Joomla\CMS\Extension\BootableExtensionInterface;
use Joomla\CMS\Extension\MVCComponent;
use Psr\Container\ContainerInterface;

final class PdfzusmergeComponent extends MVCComponent implements BootableExtensionInterface
{
    public function boot(ContainerInterface $container): void
    {
    }
}
