/*


*/


import * as structure_transformer from "./structure_transformer.js";
import * as spu_structure from "./spu_structure.js";


export function getProductID(one_product)
{
	//如果是非腰带类 直接返回货号
	if(!one_product.sku.includes("U_BELT_"))
		return one_product.sku;
	//是腰带，则需要单独处理下
	let list = one_product.sku.split("-")
	let id2 = list.pop()
	let id1 = list.pop()
	let text = id1 + "|" + id2
	return text
}

export function getPinPai(one_product)
{
	return 'Hermes';
}

export function getSource(one_product )
{
	return "Hermes";
}

export function getTag2(one_product )
{
	return one_spu_info.tag
}

export function getSex(one_product )
{
	return one_spu_info.sex;
}

export function getProductName(one_product)
{
	return one_product.title
}

export function getPageLink(one_product)
{
	return "https://www.hermes.com/fr/fr" + one_product.url
}

export function getMiaoShu(one_product)
{
	return "";
}

export function getPrice(one_product)
{
	return one_product.price
}

export function getMaterial(one_product)
{
	return "";
}

export function getColor(one_product)
{
	let color = one_product.avgColor
	if(!color)
		return "颜色如图"
	color = color
	.replace("sans coloris","颜色如图")
	.replace("multicolore","多色")
	return color
}

function convert_small_to_big(small,slug)
{
	let fixed = small.replace(/\?.*/g,"")
	//console.log(fixed)
	let list = fixed.split('/')
	//console.log(list)
	let last = list.pop()
	//console.log(list)
	last = last.replace("_worn_","-worn-")
	.replace(/_/g,"-")
	last = slug + "--" + last + "-0-0-1600-1600-q99_g.jpg"
	//list[list.length - 1] = last
	list.push(last)
	let big = list.join('/')
	return big
}

function convert_small_to_big_for_belt(small,slug)
{
	
	let leatherstrap = small.match(/leatherstrap=.*?&/g)
	if(!leatherstrap)
	{
		const fix_small = small.includes("https") ? small : ("https:" + small)
		return fix_small
	}
	
	leatherstrap = leatherstrap[0]
	.replace("&","")
	.replace("leatherstrap=","")
	//081102UAAB_composite_2
	
	let buckle = small.match(/buckle=.*?&/g)[0]
	.replace("&","")
	.replace("buckle=","")
	//081676CK05_front_1
	
	let last = small.replace(/\?.*/g,"").split("/").pop()
	
	let big = `https://assets.hermes.com/is/image/hermesproduct/${slug}--${last}-${leatherstrap}-${buckle}-0-0-1600-1600-q50_g.jpg`;
	return big
}

/*
//小图
//assets.hermes.com/is/image/hermesproduct/beltkit-32?$leatherstrap=081102UAAB_composite_2&$buckle=081676CK05_front_1&extend=307,307,307,307&align=0,0

//slug
boucle-de-ceinture-cordage-sangle-h-32mm

//大图
https://assets.hermes.com/is/image/hermesproduct/boucle-de-ceinture-cordage-sangle-h-32mm--beltkit-32-081102UAAB_composite_2-081676CK05_front_1-0-0-1600-1600-q50_g.jpg
*/

export function get_img_url_array(one_product)
{
	let want_pic_list = [] ;
	let is_belt = one_product.sku.includes("U_BELT_")
	
	for(let each of one_product.assets)
	{
		let one_small_link = "https:" + each.url
		let one_slug = one_product.slug
		let one_big
		if(!is_belt)
		{
			console.log("非腰带" , one_product.sku)
			one_big = convert_small_to_big(one_small_link,one_slug)
		}
		else
		{
			console.log("是腰带" , one_product.sku)
			one_big = convert_small_to_big_for_belt(one_small_link,one_slug)
		}
			
		
		want_pic_list.push(one_big)
	}
	
	return want_pic_list;
	//大图
	//https://assets.hermes.com/is/image/hermesproduct/bracelet-tournis-tresse--077300FI89-worn-1-0-0-1600-1600-q99_g.jpg
	
	//小图
	//https://assets.hermes.com/is/image/hermesproduct/077300FI89_worn_1?a=a&size=3000,3000&extend=0,0,0,0&align=0,0
}




//链式调用，收集 sku packer array
//三个参数分别是 spu摘要，spu packer , doc对象
export function collect_sku_packer(data , one_spu_packer , global_sku_array)
{
	/*现在的采集法，爱马仕所有商品都只有单个尺码*/
	let online_stock = data.stock.ecom ? "1" : "0"
	let sku_text = data.size
	sku_text = sku_text && sku_text.replace("SANS_TAILLE","均码")
	let one_sku_packer = spu_structure.init_one_sku(sku_text, online_stock);
	let one_standard_sku = structure_transformer.format_one_sku_from_spu_packer(one_spu_packer , one_sku_packer);
	global_sku_array.push(one_standard_sku);
	
	
	/*
	//判断是多码还是均码
	let ss = 'button[data-action="linkProductSize"]';
	let element = doc.querySelector(ss);
	
	//如果找不到，则说明是均码
	if(!element)
	{
		//这里是均码
		let online_stock = get_official_stock_for_no_size(doc);
		let sku_text = "均码";
		
		let sku_pid_element = doc.querySelector('div[data-pid]');
		let sku_offline_code = sku_pid_element.getAttribute("data-pid");
		
		let one_sku_packer = spu_structure.init_one_sku(sku_text, online_stock);
		let one_standard_sku = structure_transformer.format_one_sku_from_spu_packer(one_spu_packer , one_sku_packer);
		//追加一些实体店需要的标志
		one_standard_sku.sku_offline_code = sku_offline_code ;
		
		global_sku_array.push(one_standard_sku);
		
		return 0;
	}
	
	// 到这里开始 是多码
	//=================================
	let size_div = doc.querySelector('div#sizeselector');
	if(!size_div)
	{
		console.log("多尺码div没找到" , spu.id);
		return 0 ;
	}
	
	//下面会用到的一个 color id
	let color_id = get_color_id(doc);
	
	let buttons = size_div.querySelectorAll('button');
	//遍历每一个尺码
	for(let each of buttons)
	{
		//用于查询的sizename
		let size_name = each.getAttribute("data-attr-value");
		//用于显示的sizename
		let display_size_name = each.textContent.trim();
		//let note = await lib.get_real_stock_for_size(spu.id , size_name  ,doc) ; 
		let note = "" ; 
		let official_stock = check_has_official_stock(each);
		
		let sku_pid_element = doc.querySelector('div[data-pid]');
		let sku_offline_code = sku_pid_element.getAttribute("data-pid");
		
		let one_sku_packer = spu_structure.init_one_sku(display_size_name, official_stock);
		let one_standard_sku = structure_transformer.format_one_sku_from_spu_packer(one_spu_packer , one_sku_packer);
		//追加一些实体店需要的标志
		
		//注意，BV的 非均码 ，doc 页面上没有 尺码的 offline code
		//需要进入链接查询，所以还需要一道工序
		
		//非均码，需要在这里添加这些参数，后面会用到
		one_standard_sku.color_id = color_id ; 
		one_standard_sku.query_size_name = each.getAttribute("data-attr-value");
		
		//通过这个链接，查询一个sku的 offline code
		let skuid_qeury_link = `https://www.bottegaveneta.com/on/demandware.store/Sites-BV-R-WEUR-Site/fr_MC/Product-Variation?dwvar_${one_standard_sku.id}_color=${one_standard_sku.color_id}&dwvar_${one_standard_sku.id}_size=${one_standard_sku.query_size_name}&pid=${one_standard_sku.id}&quantity=undefined&isColor=null`;
		let query_link_md5 = warlock.batchlib.string_to_md5(skuid_qeury_link);
		
		one_standard_sku.skuid_qeury_link = skuid_qeury_link ;
		one_standard_sku.query_link_md5 = query_link_md5 ;
		
		//one_standard_sku.sku_offline_code = sku_offline_code ;
		global_sku_array.push(one_standard_sku);
		
	}
	*/
}






























