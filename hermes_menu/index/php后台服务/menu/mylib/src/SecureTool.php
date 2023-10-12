<?php
namespace Fengsuo\Library1;
class SecureTool
{
	const string_list = "0123456789abcdefABCDEF";
	
	//生成随机字符
	static function generate_key_string($want_length)
	{
		$want_array = [];
		$max_len = strlen(self::string_list);
		$max_index = $max_len - 1 ;
		
		for($index = 0 ; $index < $want_length ; ++$index )
		{
			$one_index = random_int(0 , $max_index) ;
			$one_char = self::string_list[$one_index];
			$want_array[] = $one_char ;
		}
		
		$want_string = implode('', $want_array);
		return $want_string;
	}
	
	//生成一个字符串，是由指定字符组成的
	//也就是生成一个密码字符字典
	function get_char_dict()
	{
		$list = [] ;
		
		//添加 0 - 9 的数字字符
		for($index = 48 ; $index <= 57 ; ++$index)
		{
			$one_char = chr($index);
			$list[] = $one_char ;
		}
		
		//添加大写字母
		for($index = 65 ; $index <= 90 ; ++$index)
		{
			$one_char = chr($index);
			$list[] = $one_char ;
		}
		
		//添加小写字母
		for($index = 97 ; $index <= 122 ; ++$index)
		{
			$one_char = chr($index);
			$list[] = $one_char ;
		}
		
		$want_string = implode('', $list);
		return $want_string ;
	}
}
