<?php
require_once '../config.php';
require_once '../vendor/doctrine/common/lib/Doctrine/Common/ClassLoader.php';

$classLoader = new \Doctrine\Common\ClassLoader('Doctrine\ORM', realpath(__DIR__ . '/../vendor/doctrine/orm/lib'));
$classLoader->register();
$classLoader = new \Doctrine\Common\ClassLoader('Doctrine\DBAL', realpath(__DIR__ . '/../vendor/doctrine/dbal/lib'));
$classLoader->register();
$classLoader = new \Doctrine\Common\ClassLoader('Doctrine\Common', realpath(__DIR__ . '/../vendor/doctrine/common/lib'));
$classLoader->register();
$classLoader = new \Doctrine\Common\ClassLoader('Symfony', realpath(__DIR__ . '/../vendor/symfony/console'));
$classLoader->register();
$classLoader = new \Doctrine\Common\ClassLoader('Entities', __DIR__.'/../entity');
$classLoader->register();
$classLoader = new \Doctrine\Common\ClassLoader('Proxies', __DIR__.'/../proxy');
$classLoader->register();

$config = new \Doctrine\ORM\Configuration();
$config->setMetadataCacheImpl(new \Doctrine\Common\Cache\ArrayCache);
$driverImpl = $config->newDefaultAnnotationDriver(array(__DIR__.'/../entity'));
$config->setMetadataDriverImpl($driverImpl);

$config->setProxyDir(__DIR__ .'/../proxy');
$config->setProxyNamespace('Proxies');

$connectionOptions = array(
    'driver' => 'pdo_mysql',
    'host' => DB_HOST,
    'dbname' => DB_DB,
    'user' => DB_USER,
    'password' => DB_PASS,
);

$em = \Doctrine\ORM\EntityManager::create($connectionOptions, $config);

$helpers = array(
    'db' => new \Doctrine\DBAL\Tools\Console\Helper\ConnectionHelper($em->getConnection()),
    'em' => new \Doctrine\ORM\Tools\Console\Helper\EntityManagerHelper($em)
);