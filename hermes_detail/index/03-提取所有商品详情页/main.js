/*

这个脚本的任务：
从 商品详情表里，
提取出每一个 spu 商品，
并去重复，

*/
import {Tool} from "../../class/Tool.js"
import axios from "axios"
import html_parser from "node-html-parser"

//import {Pptr} from "../../../../class/Pptr.js"
import * as fs from "node:fs"

//import {Tasker} from "./Tasker.js"

//===从之前那个提取陈列页层的任务中移植出来的
import * as structure_transformer from "./libs/structure_transformer.js";
import * as spu_structure from "./libs/spu_structure.js";
import * as spu_lib from "./libs/spu_lib.js";
//============================================

let product_item_list = []
let id_code_map = {}

//异常的条目
let error_list = [];
let product_id_map = {}
let global_spu_packer_list = [];
let global_sku_list = [];
let global_spu_list = [];


const php_domain = "http://localhost:4002"


class Tasker
{
	constructor()
	{
		this.spu_list = []
		this.sku_list = []
		this.id_code_map = {}
	}
	
	save()
	{
		Tool.save_obj_to_file("./out/spu.txt" , this.spu_list)
		Tool.save_obj_to_file("./out/sku.txt" , this.sku_list)
		Tool.save_obj_to_file("./out/id_code_map.txt" , this.id_code_map)
	}
	
	/*
	//按行号，提取一条 spu
	async take_one_spu_script_data(rowid)
	{
		const one_record_link = php_domain + "/take_one_detail_spu.php?rowid=" + rowid
		const response = await axios(one_record_link)
		const data = response.data
		return data
	}
	*/
	
	async start()
	{
		//详情页文件所在的目录
		const pages_folder = "../02-慢采详情页汇总/"
		
		//列表页获取的索引文件spu.txt位置
		const spu_index_file = "../../../hermes_menu/index/05-整合spu-sku/out/spu.txt"
		const total_items = this.get_total_item(spu_index_file)
		
		
		//遍历 total_items
		for(let index = 0 , len = total_items.length ; index < len ; ++index )
		{
			console.log("进度" , index , "/" , len)
			const one_item = total_items[index]
			const one_file_name = pages_folder + index + ".txt"
			
			this.parse_one_file(one_file_name , one_item , index)
		}
	}
	
	//读取spu.txt总索引
	get_total_item(spu_index_file)
	{
		const data = Tool.file_to_obj(spu_index_file)
		return data
	}
	
	find_data(script_data)
	{
		const key_value_list = Object.entries(script_data)
		for(let [key , value] of key_value_list)
		{
			if(key.includes("https://bck.hermes.com/product?locale=fr_fr") )
				return value.body
		}
	}
	
	//用正则表达式获取页面json数据，
	//而不再用 textContent 获取页面数据，防止自动转义
	get_page_json_data(html_text)
	{
		let found = html_text.match(/\{"envConfig".*"json"\}\}/g)
		if(!found)
			return null
		found = found[0]
		return found
	}
	
	parse_one_file(filename , item , index)
	{
		console.log("当前文件" , filename)
		const html_text = Tool.file_to_txt(filename)
		if(!html_text)
			return
		
		const doc = html_parser.parse(html_text)
		//const ss_json = 'script[id="apollo-state"]'
		const ss_json = '#hermes-state'
		const script_element = doc.querySelector(ss_json)
		if(!script_element)
		{
			console.log("没有json数据元素" , index)
			return 0
		}
		
		//const script_content = script_element.textContent
		const script_content = this.get_page_json_data(html_text)
		
		if(!script_content)
		{
			console.log("检查这个文件" , index)
			return 0
		}
		
		//const fixed_content = script_content.replace(/&q;/g , "\"")
		
		//把当前正在处理的文件写入到当前位置以便检查
		//fs.writeFileSync("now_json_data.txt", script_content)
		
		const fixed_content = script_content
		const script_data = JSON.parse(fixed_content)
		
		//console.log("json读取正常")
		
		const body_data = this.find_data(script_data)
		if(!body_data)
		{
			console.log("异常script_data" , index)
			return 0
		}
		
		const json_file = "./out/" + index + ".txt"
		//Tool.save_text_to_file(json_file , fixed_content)
		
		
		const is_belt = body_data.sku.includes("U_BELT_")
		if(is_belt)
			this.parse_one_belt_product(body_data , item)
		else
			this.parse_one_normal_product(body_data , item , index )
		
	}
	
	//处理一条腰带类数据
	parse_one_belt_product(body_data , item , index)
	{
		const id_code = body_data.secondId
		
		if(!id_code)
		{
			console.log("无secondId 请检查" , index)
			return 0
		}
		
		if(this.id_code_map[id_code])
			return 0
		
		//检查有无 samepleAttri
		if(!body_data.beltkitAttributes)
		{
			console.log("无 beltkitAttributes , 请检查" , index)
			return 0
		}
		
		let one_spu_packer = {}
		
		one_spu_packer.id = spu_lib.getProductID_belt(body_data)
		one_spu_packer.pinPai = "hermes"	//spu_lib.getPinPai(one_product);
		one_spu_packer.source = "hermes"	//spu_lib.getSource(one_product);
		one_spu_packer.tag2 = item.tag2
		one_spu_packer.sex = item.sex
		one_spu_packer.product_name = spu_lib.getProductName(body_data);
		one_spu_packer.link = item.page
		one_spu_packer.miaoshu = spu_lib.getMiaoShu_belt(body_data);
		one_spu_packer.price = spu_lib.getPrice(body_data);
		one_spu_packer.material = spu_lib.getMaterial(body_data);
		one_spu_packer.color = spu_lib.getColor_belt(body_data);
		one_spu_packer.img_url_array = spu_lib.get_img_url_array(body_data);
		//现在得到了一个 spu packer 的 初始化信息，下面要完善它
		let full_spu_packer = spu_structure.init_one_spu_packer(one_spu_packer)
		let one_standard_spu = structure_transformer.format_one_spu_from_spu_packer(full_spu_packer)
		
		//one_standard_spu.mfPartNumber = body_data.secondId
		
		this.spu_list.push(one_standard_spu);
		
		//下面开始收集尺码
		
		//const prefix = one_standard_spu.beltkitAttributes.skuSet
		
		//这里开始循环构建 sku
		let has_multi_size = body_data.variants && body_data.variants.sizes
		if(!has_multi_size)
		{
			//当均码处理
			const size_text = "均码"
			const size_stock = body_data.stock.ecom ? "1" : "0"
			let one_sku_packer = spu_structure.init_one_sku(size_text, size_stock)
			let one_standard_sku = structure_transformer.format_one_sku_from_spu_packer(full_spu_packer , one_sku_packer)
			
			one_standard_sku.code = one_spu_packer.id
			
			this.sku_list.push(one_standard_sku)
		}
		else
		{
			//当多尺码处理，循环
			for(let each of has_multi_size)
			{
				const size_text = each.size.replace("TU" , "均码")
				const size_stock = each.stock.ecom ? "1" : "0"
				let one_sku_packer = spu_structure.init_one_sku(size_text, size_stock)
				let one_standard_sku = structure_transformer.format_one_sku_from_spu_packer(full_spu_packer , one_sku_packer)
				
				one_standard_sku.code = each.sku.replace(/U_BELT_.*?-/g , "").replace("-","|")
				
				this.sku_list.push(one_standard_sku)
			}
		}
		
		this.id_code_map[id_code] = true
	}
	
	//处理一条非腰带类的常规数据
	parse_one_normal_product(body_data , item , index)
	{
		const id_code = body_data.secondId
		
		if(!id_code)
		{
			console.log("无secondId 请检查" , index)
			return 0
		}
		
		if(this.id_code_map[id_code])
			return 0
		
		//检查有无 samepleAttri
		if(!body_data.simpleAttributes)
		{
			console.log("无simpleAttributes , 请检查" , index)
			return 0
		}
		
		let one_spu_packer = {}
		
		one_spu_packer.id = spu_lib.getProductID(body_data)
		one_spu_packer.pinPai = "hermes"	//spu_lib.getPinPai(one_product);
		one_spu_packer.source = "hermes"	//spu_lib.getSource(one_product);
		one_spu_packer.tag2 = item.tag2
		one_spu_packer.sex = item.sex
		one_spu_packer.product_name = spu_lib.getProductName(body_data);
		one_spu_packer.link = item.page
		one_spu_packer.miaoshu = spu_lib.getMiaoShu(body_data);
		one_spu_packer.price = spu_lib.getPrice(body_data);
		one_spu_packer.material = spu_lib.getMaterial(body_data);
		one_spu_packer.color = spu_lib.getColor(body_data);
		one_spu_packer.img_url_array = spu_lib.get_img_url_array(body_data);
		//现在得到了一个 spu packer 的 初始化信息，下面要完善它
		let full_spu_packer = spu_structure.init_one_spu_packer(one_spu_packer)
		let one_standard_spu = structure_transformer.format_one_spu_from_spu_packer(full_spu_packer)
		
		//one_standard_spu.mfPartNumber = body_data.secondId
		
		this.spu_list.push(one_standard_spu);
		
		//下面开始收集尺码
		
		//这里开始循环构建 sku
		let has_multi_size = body_data.variants && body_data.variants.sizes
		if(!has_multi_size)
		{
			//当均码处理
			const size_text = "均码"
			const size_stock = body_data.stock.ecom ? "1" : "0"
			let one_sku_packer = spu_structure.init_one_sku(size_text, size_stock)
			let one_standard_sku = structure_transformer.format_one_sku_from_spu_packer(full_spu_packer , one_sku_packer)
			
			one_standard_sku.code = one_spu_packer.id
			
			this.sku_list.push(one_standard_sku)
		}
		else
		{
			//当多尺码处理，循环
			for(let each of has_multi_size)
			{
				const size_text = each.size.replace("TU" , "均码")
				const size_stock = each.stock.ecom ? "1" : "0"
				let one_sku_packer = spu_structure.init_one_sku(size_text, size_stock)
				let one_standard_sku = structure_transformer.format_one_sku_from_spu_packer(full_spu_packer , one_sku_packer)
				
				one_standard_sku.code = each.sku
				
				this.sku_list.push(one_standard_sku)
			}
		}
		
		this.id_code_map[id_code] = true
	}
	
}

async function main()
{
	const tasker = new Tasker()
	await tasker.start()
	tasker.save()
}
main()














