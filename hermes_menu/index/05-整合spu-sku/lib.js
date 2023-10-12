
import * as fs from "node:fs";

export function delay(millsec)
{
	function body(solve,reject)
	{
		setTimeout(solve,millsec);
	}
	return new Promise(body);
}

function read_cookie_to_data()
{
	let cookie_file = "cookie.txt";
	let text = fs.readFileSync(cookie_file,"utf8");
	if(!text)
		return null;
	let data = JSON.parse(text);
	return data;
}



function convert_cookie_data_to_text(data)
{
	if(!data)
		return "";
	let list = [];
	let key_value_list = Object.entries(data);
	for(let [key,value] of key_value_list)
	{
		let one_line = `${key}=${value}`;
		list.push(one_line);
	}
	let text = list.join(';');
	return text;
}



export function get_headers_browser()
{
	let headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9",
    "sec-ch-ua": "\"Google Chrome\";v=\"111\", \"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"111\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "x-hermes-locale": "fr_fr",
	"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
	"Referer": "https://www.hermes.com/"
  };
  
//   headers["x-xsrf-token"] = "7f49e47a-0fe0-4f9d-98e9-850eacff04a3";
  
  headers["Connection"] = "keep-alive";
  headers["Origin"] = "https://www.hermes.com";
  headers["Accept-Encoding"] = "gzip, deflate, br";
  //headers["authority"] = "bck.hermes.com";
  
  headers["cookie"] = "";
  
  headers["cookie"] += "ECOM_SESS=	zvhic1fmym9sbffq53v1o838c5;";
  headers["cookie"] += "correlation_id=46br5bst2ids9dw3kvho0kvoco4yet3ir3akr2k26smk9movf80qowm3u506u15c;";
  headers["cookie"] += "x-xsrf-token=7bd92164-0d5d-42e3-9974-9659ec7c285d;";
  
  headers["cookie"] += "datadome=4S~rVNL_Fp8gQuLd0xW_qkkj8mz_5P1EbK_UMa~vmCEPRIQQNTFOEUBRufbD-n9l_Hq1LNaYv17QCcqI-KKsibgcW3n8PASp3pGWebgwgZBXI_zaPhHNg2XKf7~Z_NvM;";
  
  return headers ; 
}

/*
经饶师傅测试，只用更新：
x-xsrf-token 和 
datadome
两个cookie值，其他的全不用管，连错的都能用。

*/
















