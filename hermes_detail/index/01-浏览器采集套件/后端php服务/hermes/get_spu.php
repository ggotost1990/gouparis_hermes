<?php
header("Access-Control-Allow-Origin: *");

$text = file_get_contents("spu.txt");
echo $text;

?>