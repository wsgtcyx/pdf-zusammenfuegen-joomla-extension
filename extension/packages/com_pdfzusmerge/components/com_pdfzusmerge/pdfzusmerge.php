<?php

/**
 * @package     Pdfzus.Site
 * @subpackage  com_pdfzusmerge
 *
 * @copyright   (C) 2026 pdfzus
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Factory;

$app = Factory::getApplication();
$bootedComponent = $app->bootComponent('com_pdfzusmerge');
$controller = $bootedComponent->getMVCFactory()->createController('Display', 'Site', ['default_view' => 'tool']);
$controller->execute($app->input->get('task'));
$controller->redirect();
