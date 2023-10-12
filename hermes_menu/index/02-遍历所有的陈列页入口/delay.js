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
	await delay(2000)
	console.log(123)
}
main()