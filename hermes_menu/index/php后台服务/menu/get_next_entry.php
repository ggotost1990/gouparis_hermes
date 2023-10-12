<?php
require("mylib/vendor/autoload.php");
use Fengsuo\Library1 as mylib ;

mylib\Cors::add_cors();

$config = mylib\ConfigTool::read("config.php");

//先读取 入口点 清单

$name = $config["js_folder"] . "02-遍历所有的陈列页入口/所有catogy.txt" ;
$outFolder = $config["js_folder"] . "02-遍历所有的陈列页入口/entry_first_pages/" ;

$content = file_get_contents($name);
$entry_list = mylib\JsonTool::json_to_obj($content);

//遍历检查是否存在
foreach($entry_list as $value)
{
	$want_file_name = $outFolder . $value->words . ".txt" ;
	if(file_exists($want_file_name))
		continue;
	
	$text = mylib\JsonTool::obj_to_json($value);
	die($text);
}