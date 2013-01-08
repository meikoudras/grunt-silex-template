<?php 
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

require_once __DIR__ . '/../src/bootstrap.php';

/* ROUTES */ 
$app->match('/hello/{name}', function(Request $req, $name) use($app){
    return "Hello $name";
})->bind('home');

/* RUN APPLICATION */
$app->run();