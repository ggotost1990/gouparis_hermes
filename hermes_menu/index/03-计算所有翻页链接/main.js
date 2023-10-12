
import * as fs from "node:fs";

let global_load_more_item = [];

function get_target_data(data)
{
	let key_value_list = Object.entries(data)
	for(let [key , value] of key_value_list)
	{
		if(key.includes("products?category=") )
			return value.body
	}
}

function parse_one_entry_item(one_entry_item, targetFolder)
{
	console.log(one_entry_item.words)
	let want_file = targetFolder + one_entry_item.words + ".txt";
	let text = fs.readFileSync(want_file , "utf8");
	
	let found = text.match(/\{"envConfig.*"json"\}\}/g)
	//console.log()
	found = found[0]
	
	let data = JSON.parse(found);
	data = get_target_data(data)
	
	
	
	let total_count = data.total ;
	let batch_count = Math.ceil( total_count / 40 ) ; //计算一共有几批
	
	let load_more_items = [];
	for(let index = 1 ; index < batch_count ; ++index )
	{
		let offset_int = index * 40 ;
		let tag = one_entry_item.words ;
		let one_link = `https://bck.hermes.com/products?locale=fr_fr&category=${tag}&sort=relevance&offset=${offset_int}&pagesize=40`;
		
		let one_load_more_item = 
		{
			link: one_link ,
			fileName: `${tag}-${index}.txt`
		}
		
		load_more_items.push(one_load_more_item);
		//往全局的线性数组里也保存一个
		global_load_more_item.push(one_load_more_item);
	}
	one_entry_item.load_more_items = load_more_items ;
}

async function main()
{
	let fileName = "../02-遍历所有的陈列页入口/所有catogy.txt";
	let text = fs.readFileSync(fileName , "utf8");
	let item_list = JSON.parse(text);
	
	let targetFolder = "../02-遍历所有的陈列页入口/entry_first_pages/";
	
	for(let each of item_list)
	{
		parse_one_entry_item(each,targetFolder);
	}
	
	text = JSON.stringify(item_list,null,"\t");
	fs.writeFileSync("./所有catogy-带翻页地址.txt", text);
	
	text = JSON.stringify(global_load_more_item,null,"\t");
	//fs.writeFileSync("./翻页地址数组.txt", text);
	fs.writeFileSync("./entry_list_loadmore.txt" , text)
}
main();
