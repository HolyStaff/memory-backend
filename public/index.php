<?php

error_reporting(E_ALL ^ ~E_DEPRECATED);
ini_set('display_errors', '0');

use App\Kernel;

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

return function (array $context) {
    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};
