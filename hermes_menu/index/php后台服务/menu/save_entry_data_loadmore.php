<?php
require("mylib/vendor/autoload.php");
use Fengsuo\Library1 as mylib ;

mylib\Cors::add_cors();
$config = mylib\ConfigTool::read("config.php");

$outFolder = $config["js_folder"] . "04-下载翻页数据/pages/" ;

//将post体保存到对应的文件
$name = $outFolder . $_GET["name"] . ".txt" ;

$raw = file_get_contents("php://input");
file_put_contents($name , $raw );
