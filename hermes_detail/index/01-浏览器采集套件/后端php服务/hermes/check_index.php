<?php
header("Access-Control-Allow-Origin: *");

$want_name = "pages/" . $_GET["check_index"] . ".txt" ;
$result = new stdClass();
$result->is_exists = file_exists($want_name);
echo json_encode($result);
?>