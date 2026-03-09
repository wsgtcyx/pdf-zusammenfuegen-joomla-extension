<?php

/**
 * @package     Pdfzus.Plugin
 * @subpackage  Content.pdfzusmerge
 *
 * @copyright   (C) 2026 pdfzus
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Extension\PluginInterface;
use Joomla\CMS\Factory;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\DI\Container;
use Joomla\DI\ServiceProviderInterface;
use Joomla\Event\DispatcherInterface;
use Joomla\Plugin\Content\Pdfzusmerge\Extension\Pdfzusmerge;

return new class () implements ServiceProviderInterface {
    public function register(Container $container): void
    {
        $container->set(
            PluginInterface::class,
            function (Container $container) {
                $dispatcher = $container->get(DispatcherInterface::class);

                return new Pdfzusmerge(
                    $dispatcher,
                    (array) PluginHelper::getPlugin('content', 'pdfzusmerge'),
                    Factory::getApplication()
                );
            }
        );
    }
};
