<?php
namespace Fengsuo\Library1;

/*
这个工具类，用来读取和保存 config.php 类型的数据
*/

class ConfigTool
{
	
	static function read($filename)
	{
		if(!file_exists($filename))
			return null;
		$config_data = require($filename);
		return $config_data;
	}
	
	static function save($filename , $data)
	{
		$text = var_export($data , true);
		$text2 = "<?php return {$text} ;";
		file_put_contents($filename , $text2);
	}
}
