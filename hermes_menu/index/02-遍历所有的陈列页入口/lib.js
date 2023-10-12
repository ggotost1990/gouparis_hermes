
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
	let cookie_file = "../cookie.txt";
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
	let cookie_data = read_cookie_to_data();
	
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
  
  //headers["x-xsrf-token"] = "7952a397-5499-4936-9e7c-4f44294adba8";
  
  headers["Connection"] = "keep-alive";
  headers["Origin"] = "https://www.hermes.com";
  headers["Accept-Encoding"] = "gzip, deflate, br";
  //headers["authority"] = "bck.hermes.com";
  
  headers["cookie"] = "";
  
  headers["cookie"] += `correlation_id=${cookie_data.correlation_id};`
  headers["cookie"] += `datadome=${cookie_data.datadome};`
  headers["cookie"] += `ECOM_SESS=${cookie_data.ECOM_SESS};`
  headers["cookie"] += `x-xsrf-token=${cookie_data["x-xsrf-token"]};`
  
  //headers["cookie"] += "datadome=70vYcuJJFEl~qflFhYqRgkQX_zgq-xy9D2GpEYqeTSz-0DyQ9pJ6r2pzAIkhn39qIn8JXHKx1iT_1UqTBm3gV9BoTawPNtPZS9WB6pTxEaZZOQiR18iKep-1Y0tUC9yh;";
  
  return headers ; 
}


















