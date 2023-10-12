
import * as fs from "node:fs";

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
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "max-age=0",
    "if-modified-since": "Thu, 09 Mar 2023 04:03:18 GMT",
    "if-none-match": "W/\"710c3-1o1SufEy6NzbnQwAsB83vk7lhTw\"",
    "sec-ch-device-memory": "8",
    "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
    "sec-ch-ua-arch": "\"x86\"",
    "sec-ch-ua-full-version-list": "\"Chromium\";v=\"110.0.5481.178\", \"Not A(Brand\";v=\"24.0.0.0\", \"Google Chrome\";v=\"110.0.5481.178\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-model": "\"\"",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
	"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    "cookie": "OptanonAlertBoxClosed=2023-03-09T02:04:38.906Z; OptanonConsent=isGpcEnabled=0&datestamp=Thu+Mar+09+2023+12%3A03%3A20+GMT%2B0800+(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)&version=6.20.0&isIABGlobal=false&hosts=&consentId=71ec428a-1613-4f4f-83c1-9368d55cf03e&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&geolocation=%3B&AwaitingReconsent=false; x-xsrf-token=54d11597-4c5e-4524-8edf-6591adbbf5e4; _gcl_au=1.1.972517247.1678327479; _gid=GA1.2.418085843.1678327479; _cs_c=1; _cs_mk=0.40854247438465574_1678333537048; _cs_id=78405acc-b216-aae7-8eab-8cd8099c76f1.1678327484.2.1678333537.1678333490.1.1712491484234; _cs_s=2.0.0.1678335337416; ECOM_SESS=bjkt1gp9l8vp5pgaz05xbki8i9; correlation_id=8f4nsj73l4nqi4e6jrvbqs98lhkkaurwva461qiq7lw4yqx47wc78y7ul9g3psi6; _ga=GA1.1.1019678972.1678327479; _ga_Y862HCHCQ7=GS1.1.1678333536.2.1.1678334600.0.0.0; _gat_UA-64545050-1=1; datadome=1NuUbOyNTHH4VnYb1pr5TqKFz~oVnJfht8ahbZzbGKu3FlFzvd9bTXrQz4qPt0UWkpbm5UDw2--mEPvp5S1yLMSeyAXDVdQXMYwm6ohzTvxxqwONo~KX0wynAWwDqLYt"
  };
  
  
  // "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
  /*
  let cookie_obj = read_cookie_to_data();
  let cookie_text = convert_cookie_data_to_text(cookie_obj);
  headers["cookie"] = cookie_text ;
  */
  /*
    "cookie": "x-xsrf-token=bdfa6401-a431-4dcb-a26a-562250a04cad; datadome=6fZMkfo5f-N3_7lhCIoQZFmfgsRiMdGTSeXn7eO8x1Yv4_VTBNSjQQYqdX~4hDkqG7ADoYShLEyR4PUEv4fD~Nwgsk6_VI3-42t_ORuNDX0x~jTk8o-wpzptCMIUrhFW; ECOM_SESS=uakbd4ro6or3mfnz1l86tcad1d; correlation_id=cnqnsh8od1pdfmfxy7vu94f2ne31hmxlj8qawtswnf2i2xn7egp2fdj5rdadz4ge"
	*/
  
  
  return headers ; 
}





















