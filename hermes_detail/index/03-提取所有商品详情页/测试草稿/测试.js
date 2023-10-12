import * as fs from "node:fs"

function main()
{
	const text = fs.readFileSync("测试.txt" , "utf8")
	const data = JSON.parse(text)
	
}
main()