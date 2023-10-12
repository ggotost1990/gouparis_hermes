<?php
require("mylib/vendor/autoload.php");
use Fengsuo\Library1 as mylib ;

mylib\Cors::add_cors();
$config = mylib\ConfigTool::read("config.php");


//将post体保存到对应的文件
$outFolder = $config["js_folder"] . "02-遍历所有的陈列页入口/entry_first_pages/" ;
$name = $outFolder .  $_GET["name"] . ".txt" ;

$raw = file_get_contents("php://input");
file_put_contents($name , $raw );
