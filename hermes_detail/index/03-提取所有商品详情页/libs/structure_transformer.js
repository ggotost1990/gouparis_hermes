//这个模块提供的功能是把 我们之前自定义的 spu 和 sku 结构体，
//转换成 够巴黎 需要的格式


//从一个 spu_packer 结构，生成一个够巴黎需要的标准spu结构
export function format_one_spu_from_spu_packer(one_spu_packer)
{
	let spu = {} ; 
	
	spu.id = one_spu_packer.id ;
	spu.pinPai = one_spu_packer.pinPai ; 
	spu.tag1 = "" ;
	spu.tag2 = one_spu_packer.tag2 ; 
	spu.sex = one_spu_packer.sex ; 
	spu.name = one_spu_packer.product_name ; 
	spu.time = one_spu_packer.time ;
	spu.page = one_spu_packer.link ; 
	spu.miaoshu = one_spu_packer.miaoshu ; 
	spu.source = one_spu_packer.source ;
	spu.price = one_spu_packer.price ; 
	spu.price_type = one_spu_packer.price_type ; 
	spu.cai_zhi = one_spu_packer.material ; 
	spu.pic_list = one_spu_packer.pic_list ; 
	spu.display_pic = one_spu_packer.display_pic ; 
	spu.color = one_spu_packer.color ; 
	
	return spu ; 
}

//从 spu packer 和 一个 sku pakcer 构建一个 sku
export function format_one_sku_from_spu_packer(one_spu_packer , one_sku_item)
{
	let sku = new Object() ; 
	
	sku.id = one_spu_packer.id ; 
	sku.pinPai = one_spu_packer.pinPai ;	
	sku.color = one_spu_packer.color ; 		// sku 独有
	sku.price = one_spu_packer.price ; 
	sku.price_type = one_spu_packer.price_type ;
	sku.where_from = one_spu_packer.source ;
	sku.time = one_spu_packer.time ;
	sku.page = one_spu_packer.link ; 
	sku.code = one_sku_item.sku_code ; 		// sku 独有
	sku.status = "" ;
	sku.guan_wang_ku_cun = one_sku_item.online_stock ; 	// sku 独有
	sku.shi_ti_ku_cun = "" ; 										
	sku.note = one_sku_item.offline_stock ; 												// sku 独有	,这个就是实体库存信息
	sku.chi_ma = one_sku_item.size_text ;												// sku 独有
	
	return sku ; 
}

