<?php
require("mylib/vendor/autoload.php");
use Fengsuo\Library1 as mylib ;

mylib\Cors::add_cors();
$config = mylib\ConfigTool::read("config.php");
//先读取 入口点 清单

$name = $config["js_folder"] . "03-计算所有翻页链接/entry_list_loadmore.txt";
$content = file_get_contents($name);
$entry_list = mylib\JsonTool::json_to_obj($content);

$outFolder = $config["js_folder"] . "04-下载翻页数据/pages/" ;

//遍历检查是否存在
foreach($entry_list as $value)
{
	$want_file_name = $outFolder . $value->fileName . ".txt" ;
	if(file_exists($want_file_name))
		continue;
	
	$text = mylib\JsonTool::obj_to_json($value);
	die($text);
}








