import * as lib from "./lib.js";
import axios from "axios";
import * as fs from "node:fs";
//大致思路
//构建一个特殊格式的cookie
//读写并保存 datadom

function get_axios_config(link,headers)
{
	let opt = 
	{
		/*
		proxy:{
			protocol: 'http',
			host: '127.0.0.1',
			port: 8888,
		},
		*/
		url: link,
		method : "get" ,
		responseType: "text",
		headers: headers
	};
	return opt;
}

async function request(link)
{
	
	let headers = lib.get_headers_browser();
	let opt = get_axios_config(link , headers);
	let response = await axios(opt);
	console.log("响应码" , response.status);
	return response.data ;
	
}

async function main()
{
	let want_delay = 1 * 1000 ;
	let fileName = "./所有catogy.txt";
	let text = fs.readFileSync(fileName , "utf8");
	let item_list = JSON.parse(text);
	
	for(let index = 0 , len = item_list.length ; index < len ; ++index )
	{
		let one_item = item_list[index];
		console.log("爱马仕陈列首页 进度" , index + 1 , "/", len);
		
		let want_out_file = `./entry_first_pages/${one_item.words}.txt`;
		if(fs.existsSync(want_out_file))
			continue;
		
		//测试
		console.log("当前" , one_item.words);
		//one_item.words = "PRECOLLECTIONPE";
		
		let want_link = `https://bck.hermes.com/products?locale=fr_fr&category=${one_item.words}&sort=relevance`;
		
		//https://bck.hermes.com/products?locale=fr_fr&category=MENHIGHTECH&sort=relevance
		//请求第一页 用上面这个
		
		console.log(want_link);
		
		let response_text = await request(want_link);
		if(!response_text)
		{
			console.log("请求失败，请更新token");
			return 0;
		}
		else
		{
			fs.writeFileSync(want_out_file, response_text);
		}
		
		
		console.log("等待延迟中" , want_delay);
		await lib.delay(want_delay);
	}
	
}
main();

/*
3.10-11
loewe,redline,cl 新品
更新爱马仕采集规则
*/