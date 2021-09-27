var https = require('https');
var express = require('express');
var router = express.Router();
var bodyParser =require('body-parser');

const TARGET = 'https://neo.hazwell.xyz';

router.use(bodyParser.raw({
	inflate: true,
	limit: '20mb',
	type: "application/*"
}))

router.use((req, res, next) => {
	var upperMethod = req.method.toUpperCase();
	var hasBody = (upperMethod === "POST" || upperMethod === "PUT");
	
	var reqHeaders = req.headers;
	var ipAddr = reqHeaders["x-forwarded-for"];
	if (ipAddr){
		var list = ipAddr.split(",");
		ipAddr = list[list.length-1];
	} else {
	    ipAddr = req.connection.remoteAddress;
	}
	
	reqHeaders["x-forwarded-for"] = ipAddr;
	var reqToTarget = https.request(TARGET + req.originalUrl, {
			method: req.method,
			rejectUnauthorized:false,
			headers: reqHeaders
		},(proxyRes)=>{
			let targetResponsed = false;
			let responseBuffer = Buffer.alloc(1024);
			let bufferedLength = 0;
			proxyRes.on('data', (chunk)=>{
				if(!targetResponsed)
				{
					res.status(proxyRes.statusCode);
					targetResponsed = true;
					for(var header in proxyRes.headers)
					{
						res.set(header, proxyRes.headers[header]);
					}
				}
				res.write(chunk);
			})
			proxyRes.on('end', ()=>{
				res.end();
			})
		}
	);
	
	reqToTarget.on('error', (e)=>{console.error(e)});

	console.log(`${req.method}, ${TARGET+req.originalUrl} (from ${ipAddr})`);
	
	if(hasBody && req.body)
	{
		//console.log(typeof req.body);
		if(typeof req.body === 'string' || req.body instanceof Buffer)
		{
			console.log(`request body length: ${req.body.length}`);
			reqToTarget.write(req.body);
		}
	}

	reqToTarget.end();
	//console.log(JSON.stringify(req.headers));
	//res.status(200).send(ipAddr).end()
});



module.exports = router;


