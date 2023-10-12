<?php
header("Access-Control-Allow-Origin: *");

$want_name = "pages/" . $_GET["need_save"] . ".txt" ;
$body = file_get_contents('php://input');
file_put_contents($want_name , $body);

?>