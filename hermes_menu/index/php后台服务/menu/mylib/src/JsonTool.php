<?php
namespace Fengsuo\Library1;

class JsonTool
{
	static function obj_to_json($data)
	{
		return json_encode($data,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
	}
	
	static function json_to_obj($text)
	{
		return json_decode($text);
	}
}