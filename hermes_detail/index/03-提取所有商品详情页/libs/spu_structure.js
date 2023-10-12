

//设计一个 可以派生出 sku 的 ， spu 类型：
//
export function init_one_spu_packer(opt)
{
	let one_spu_packer = {
		id: opt.id,						//原厂货号
		pinPai : opt.pinPai,		//品牌
		source: opt.source || opt.pinPai ,
		//如果是综合网站，则传入平台名。
		//如果是非综合网站，则不用管这个字段
		tag2: opt.tag2,				//类目 用于排序
		sex: opt.sex,					//性别
		product_name: opt.product_name	,		//商品名称
		link: opt.link,					//商品链接
		miaoshu: opt.miaoshu,	//商品描述
		
		price: opt.price,				//价格
		material: opt.material || "" ,//材质
		color: opt.color || "颜色如图" ,			//颜色
		img_url_array : opt.img_url_array ,//图片数组
		
		//----------------------------------------------------------
		
		time: new Date()	,		//生成时间
		price_type:"EUR",
		pic_list: opt.img_url_array.join("|") ,
		display_pic: opt.img_url_array[0],	//首图
		tag1: ""
	};
	return one_spu_packer;
}


export function init_one_sku(size_text , online_stock = "0",
offline_stock = "" , sku_code = "")
{
	let one_sku = {};
	
	one_sku.size_text = size_text;					//尺码文本					
	one_sku.online_stock = online_stock ;	//官网库存
	
	//可选项
	one_sku.offline_stock = offline_stock;	//就是实体店名称用|符号分割
	one_sku.sku_code = sku_code;
	
	one_sku.time = new Date()			//生成时间
	one_sku.price_type = "EUR"
	
	return one_sku;
}


//============================================================================
















