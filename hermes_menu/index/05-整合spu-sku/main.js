
import * as fs from "node:fs";


import * as structure_transformer from "./libs/structure_transformer.js";
import * as spu_structure from "./libs/spu_structure.js";
import * as spu_lib from "./libs/spu_lib.js";

//大致思路
//构建一个特殊格式的cookie
//读写并保存 datadom

//异常的条目
let error_list = [];
let product_id_map = {}
let global_spu_packer_list = [];
let global_sku_list = [];
let global_spu_list = [];

//处理一个商品数据
function parse_one_product_data(one_product , tag, sex)
{
	
	let one_spu_packer = {};
	
	one_spu_packer.id = spu_lib.getProductID(one_product);
	if(!one_spu_packer.id)
	{
		console.log("无货号" , one_product);
		return 0;
	}
	
	//抓过的不再抓了。
	if(product_id_map[one_spu_packer.id])
	{
		return 0;
	}
	
	one_spu_packer.pinPai = spu_lib.getPinPai(one_product);
	one_spu_packer.source = spu_lib.getSource(one_product);
	one_spu_packer.tag2 = tag
	one_spu_packer.sex = sex
	one_spu_packer.product_name = spu_lib.getProductName(one_product);
	if(!one_spu_packer.product_name)
	{
		console.log("无商品名称" , one_product);
		return 0;
	}
	one_spu_packer.link = spu_lib.getPageLink(one_product);
	one_spu_packer.miaoshu = spu_lib.getMiaoShu(one_product);
	one_spu_packer.price = spu_lib.getPrice(one_product);
	if(!one_spu_packer.price)
	{
		console.log("无价格" , one_product);
		return 0;
	}
	one_spu_packer.material = spu_lib.getMaterial(one_product);
	one_spu_packer.color = spu_lib.getColor(one_product);
	one_spu_packer.img_url_array = spu_lib.get_img_url_array(one_product);
	if(!one_spu_packer.img_url_array)
	{
		console.log("无图片" , one_product);
		return 0;
	}
	
	//现在得到了一个 spu packer 的 初始化信息，下面要完善它
	let full_spu_packer = spu_structure.init_one_spu_packer(one_spu_packer);
	
	global_spu_packer_list.push(full_spu_packer);
	
	product_id_map[full_spu_packer.id] = true ;
	
	let one_standard_spu = structure_transformer.format_one_spu_from_spu_packer(full_spu_packer);
	global_spu_list.push(one_standard_spu);
	
	//链式调用
	spu_lib.collect_sku_packer( one_product,full_spu_packer  , global_sku_list);
	
}

//处理一个翻页数据
function parse_one_load_more_item(one_load_more_item , words,sex)
{
	let targetFolder = "../04-下载翻页数据/pages/";
	let want_filename = targetFolder + one_load_more_item.fileName + ".txt";
	let is_exists = fs.existsSync(want_filename)
	if(!is_exists)
	{
		console.log("文件不存在" , one_load_more_item)
		return 0;
	}
	let text = fs.readFileSync(want_filename,"utf8")
	const data = JSON.parse(text)
	console.log("当前正在处理翻页数据", want_filename)
	
	let product_item_list = data.products.items
	for(let each of product_item_list)
	{
		parse_one_product_data(each , words, sex)
	}
	
}

function get_target_data(data)
{
	let key_value_list = Object.entries(data)
	for(let [key , value] of key_value_list)
	{
		if(key.includes("products?category=") )
			return value.body
	}
}

//处理一个入口item
function parse_one_entry_item(one_entry_item)
{
	//先读取首页，获取首页的 商品items
	let targetFolder = "../02-遍历所有的陈列页入口/entry_first_pages/";
	let one_entry_first_page_json_file = targetFolder + one_entry_item.words + ".txt"
	let is_exists = fs.existsSync(one_entry_first_page_json_file)
	if(!is_exists)
	{
		let one_error = 
		{
			tag:one_entry_item.words,
			note: "文件不存在" + one_entry_first_page_json_file
		}
		//error_list.push(one_error)
		console.log(one_error)
		return 0;
	}
	
	//读取第一页数据
	let text = fs.readFileSync(one_entry_first_page_json_file, "utf8");
	console.log("当前文件" , one_entry_first_page_json_file)
	let found = text.match(/\{"envConfig.*"json"\}\}/g)
	found = found[0]
	let data = JSON.parse(found);
	data = get_target_data(data)
	
	let text_backup = JSON.stringify(data , null , "\t")
	fs.writeFileSync(one_entry_first_page_json_file + ".txt", text_backup)
	
	//处理第一页数据
	let product_item_list = data.products.items
	for(let each of product_item_list)
	{
		parse_one_product_data(each , one_entry_item.words, one_entry_item.sex)
	}
	
	//处理后续页
	for(let each of one_entry_item.load_more_items)
	{
		parse_one_load_more_item(each , one_entry_item.words, one_entry_item.sex)
	}
}

//先读取类目入口文件，取得每一个类目入口，
//将某个类目下的所有 item 都整合成 spu 和 sku
function get_tag_entry_items()
{
	let fileName = "../03-计算所有翻页链接/所有catogy-带翻页地址.txt";
	let text = fs.readFileSync(fileName);
	let data = JSON.parse(text);
	return data;
}

async function main()
{
	//先读取
	let entry_items = get_tag_entry_items();
	//处理每一个入口item
	for(let each of entry_items)
	{
		parse_one_entry_item(each)
	}
	
	let text = JSON.stringify(global_spu_packer_list, null,'\t')
	fs.writeFileSync("./out/spu_packer.txt",text)
	
	text = JSON.stringify(global_sku_list, null,'\t')
	fs.writeFileSync("./out/sku.txt",text)
	
	text = JSON.stringify(global_spu_list, null,'\t')
	fs.writeFileSync("./out/spu.txt",text)
	
}
main();

/*

*/