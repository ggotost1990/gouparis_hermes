import * as fs from "node:fs"


export class Tool
{
	
	static file_to_obj(filename , default_value = null)
	{
		const text = this.file_to_txt(filename)
		if(!text)
			return default_value
		let data
		try
		{
			data = JSON.parse(text)
		}
		catch(err)
		{
			console.log(err)
			return null
		}
		return data
	}
	
	static save_obj_to_file(filename , data)
	{
		const text = JSON.stringify(data, null , "\t")
		this.save_text_to_file(filename , text)
	}
	
	static file_to_txt(filename)
	{
		if(!fs.existsSync(filename))
			return null
		const text = fs.readFileSync(filename , "utf8")
		return text
	}
	
	static save_text_to_file(filename , text)
	{
		fs.writeFileSync(filename , text)
	}
}
