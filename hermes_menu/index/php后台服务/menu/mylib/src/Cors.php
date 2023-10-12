<?php
namespace Fengsuo\Library1;

class Cors
{
	static function add_cors()
	{
		header("Access-Control-Allow-Origin: *");
	}
}