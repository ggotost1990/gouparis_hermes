
//https://www.hermes.com/sites/all/themes/custom/hermes/img/favicon/favicon-48x48.png

class Tasker
{
	constructor()
	{
		//对应php后台服务所在的目录
		const prefix = "http://localhost/hermes/"
		this.php_link1 = prefix + "get_spu.php"
		this.php_link2 = prefix + "check_index.php"
		this.php_link3 = prefix + "need_save.php"
		this.tip_url = prefix + "tip.mp3"
		
		this.start_index = 0		//起始序号
		this.stop_index				//结束序号，不填就是一直到末尾
	}
	
	async init()
	{
		const total_list = await this.get_total_list()
		
		console.log("当前读取到" , total_list.length , "条链接")
		
		let end_len = this.stop_index ? this.stop_index : total_list.length
		
		for(let index = this.start_index , len = end_len ; index < len ; ++index )
		{
			const one_spu = total_list[index]
			const should_fetch = await this.check_should_fetch(index)
			if(!should_fetch)
				continue
			
			const time_start = Date.now()
			const done = await this.fetch_one(index , one_spu)
			const time_end = Date.now()
			
			const time_end_date = new Date(time_end)
			const time_string = time_end_date.toLocaleString()
			
			const delta_time = ~~( (time_end - time_start)/1000 )
			
			if(!done)
			{
				console.log("未成功，跳出")
				break
			}
			console.log("进度" , index , "/" , len , "成功" , "耗时" , delta_time , "秒" , "时间" , time_string )
		}
	}
	
	async get_total_list()
	{
		const response = await fetch(this.php_link1)
		const data = await response.json()
		return data
	}
	
	async check_should_fetch(index)
	{
		const response = await fetch(this.php_link2 + "?check_index=" + index)
		const result = await response.json()
		return result.is_exists ? false : true
	}
	
	//按照一个地址请求，将响应发给php保存为文本
	async fetch_one(index , spu)
	{
		const want_link = spu.page
		let response = await fetch(want_link)
		if(response.status === 403)
		{
			this.beep()
			return
		}
			//return
		
		const text = await response.text()
		
		const opt = 
		{
			method: "POST" ,
			body: text
		}
		
		response = await fetch(this.php_link3 + "?need_save=" + index , opt)
		return response.ok
	}

	beep()
	{
		let snd = new Audio(this.tip_url);  
    	snd.play();
	}
	
}


async function main()
{
	const tasker = new Tasker()
	await tasker.init()
}
main()









