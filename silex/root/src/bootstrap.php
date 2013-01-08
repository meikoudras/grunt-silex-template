<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bridge\Doctrine\Form\DoctrineOrmExtension;

$app = new Silex\Application();
/* Configuration */
$app['debug'] = DEBUG;
$app['template_dir'] = __DIR__ . '/../templates';
$app['cache_dir'] = __DIR__ . '/../cache';
$app['html_dir'] = __DIR__ . '/deploy';
$app['main_url'] = MAIN_URL;
$app['view_url'] = MAIN_URL.'view/';
$app['extension'] = '';
$app['include_dirs'] = array('css', 'img', 'js');

/* Services */
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => array($app['template_dir']),
    'twig.options' => array(
        'cache' => $app['cache_dir'],
        'debug' => $app['debug']),
    ));

$app->register(new Silex\Provider\UrlGeneratorServiceProvider());

$app->register(new Silex\Provider\SessionServiceProvider());

$app->register(new Silex\Provider\ValidatorServiceProvider());

$app->register(new Silex\Provider\FormServiceProvider());

$app->register(new Silex\Provider\TranslationServiceProvider(), array(
    'locale_fallback' => DEFAULT_LOCALE,
    ));

$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
    'db.options' => array(
        'driver' => 'pdo_mysql',
        'host' => DB_HOST,
        'dbname' => DB_DB,
        'user' => DB_USER,
        'password' => DB_PASS,
        ),
    ));

/* register monolog */
$app->register(new Silex\Provider\MonologServiceProvider(), array(
    'monolog.logfile' => __DIR__.'/../development.log',
    'monolog.name' => 'elekter',
    ));


/* register orm provider */
$app->register(new Nutwerk\Provider\DoctrineORMServiceProvider(), array(
    'db.orm.class_path' => __DIR__ . '/../vendor/doctrine/orm/lib',
    'db.orm.proxies_dir' => __DIR__ . '/../proxy',
    'db.orm.proxies_namespace' => 'DoctrineProxy',
    'db.orm.cache' => $app['debug'] || !function_exists('apc_store') ? new \Doctrine\Common\Cache\ArrayCache() : new \Doctrine\Common\Cache\ApcCache(),
    'db.orm.auto_generate_proxies' => true,
    'db.orm.entities' => array(array(
            'type' => 'annotation', // entity definition 
            'path' => __DIR__ . '/../entity', // path to your entity classes
            'namespace' => 'Mk\Entity', // your classes namespace
            )),
    ));

$app['form.extensions'] = $app->share($app->extend('form.extensions', function ($extensions) use($app) {
    $managerRegistry = new ManagerRegistry(null, array(), array('db.orm.em'), null, null, '\Doctrine\ORM\Proxy\Proxy');
    $managerRegistry->setContainer($app);
    $extensions[] = new DoctrineOrmExtension($managerRegistry);

    return $extensions;
}));