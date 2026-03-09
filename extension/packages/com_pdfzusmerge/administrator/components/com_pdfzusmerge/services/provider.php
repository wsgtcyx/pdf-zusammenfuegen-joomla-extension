<?php

/**
 * @package     Pdfzus.Administrator
 * @subpackage  com_pdfzusmerge
 *
 * @copyright   (C) 2026 pdfzus
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Dispatcher\ComponentDispatcherFactoryInterface;
use Joomla\CMS\Extension\ComponentInterface;
use Joomla\CMS\Extension\Service\Provider\ComponentDispatcherFactory;
use Joomla\CMS\Extension\Service\Provider\MVCFactory;
use Joomla\CMS\MVC\Factory\MVCFactoryInterface;
use Joomla\Component\Pdfzusmerge\Administrator\Extension\PdfzusmergeComponent;
use Joomla\DI\Container;
use Joomla\DI\ServiceProviderInterface;

return new class () implements ServiceProviderInterface {
    public function register(Container $container): void
    {
        $componentNamespace = '\\Joomla\\Component\\Pdfzusmerge';

        $container->registerServiceProvider(new MVCFactory($componentNamespace));
        $container->registerServiceProvider(new ComponentDispatcherFactory($componentNamespace));
        $container->set(ComponentInterface::class, function (Container $container) {
            $component = new PdfzusmergeComponent($container->get(ComponentDispatcherFactoryInterface::class));
            $component->setMVCFactory($container->get(MVCFactoryInterface::class));

            return $component;
        });
    }
};
