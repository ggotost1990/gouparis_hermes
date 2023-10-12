
let prefix = "http://localhost/hermes/menu/"

//获取下一个 入口item
async function get_next_entry()
{
	const link = prefix + "get_next_entry_loadmore.php"
	const response = await fetch(link)
	const text = await response.text()
	if(!text)
		return null
	return JSON.parse(text)
}

//请求一个入口并获取数据
async function fetch_one_entry(one_entry)
{
	const opt = 
	{
		referrer: "",
		credentials: "include"
	}
	const response = await fetch(one_entry.link , opt)
	return response
}

//保存网页数据到后台
async function save_page_data(string_html , string_name)
{
	const link = prefix + "save_entry_data_loadmore.php?name=" + string_name
	const opt = 
	{
		method : "POST" ,
		body : string_html
	}
	const response = await fetch(link , opt)
}


function delay(ms)
{
	return new Promise(
		function(resolve)
		{
			setTimeout(resolve, ms)
		}
	)
}



async function main()
{
	let count = 0
	while(true)
	{
		/*
		count++
		if(count > 2)
			break
		*/
		
		await delay(5000)
		
		let next_entry = await get_next_entry()
		if(!next_entry)
		{
			console.log("完毕")
			return 0
		}
		
		console.log("拿到入口数据" , next_entry)
		
		
		let response
		try
		{
			response = await fetch_one_entry(next_entry)
		}
		catch(err)
		{
			console.log("被封")
			return 0
		}
		
		if(response.status === 403)
		{
			console.log("被封2")
			return 0
		}
		let html_data = await response.text()
		
		//保存
		await save_page_data(html_data , next_entry.fileName)
	}
}
main();
