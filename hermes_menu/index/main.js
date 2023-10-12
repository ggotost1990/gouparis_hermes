import * as lib from "./lib.js";
import axios from "axios";
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

async function request()
{
	let headers = lib.get_headers_browser();
	let link = "https://www.hermes.com/fr/fr/product/mocassins-destin-H212116ZvR0360/";
	let opt = get_axios_config(link , headers);
	let response = await axios(opt);
	console.log(response.headers);
	console.log(response.data);
}

async function main()
{
	await request();
}
main();