var https = require('https');
var express = require('express');
var app = express();
var attr = require('./attr.js');

const PORT = process.env.PORT || 80;
const TARGET = 'https://neo.hazwell.xyz';

app.use('/hex/attr', attr);

app.get('/hello', function(req, res){
	var ipAddr = req.headers["x-forwarded-for"];
	if (ipAddr){
		var list = ipAddr.split(",");
		ipAddr = list[list.length-1];
	} else {
	    ipAddr = req.connection.remoteAddress;
	}
	res.send("Welcome! Your IP:<br>" + req.ip + "<br>" + ipAddr)
}).get('/login', function(req, res){
	https.get('https://login.live.com', {		
			rejectUnauthorized: false,
			requestCert: true,
			agent: false
		}, (proxyRes) => {
			let data = ''
			proxyRes.on('data', (chunk)=>{data += chunk})
			proxyRes.on('end', ()=>{
				res.writeHead(200, {})
				res.end(data)
			})
		})
}).get('/hex/attr/dd.php', (req, res)=>{
	https.get(TARGET + '/hex/attr/dd.php', {
		rejectUnauthorized:false
	},
	(proxyRes)=>{
		let data = ''
		proxyRes.on('data', (chunk)=>{data += chunk})
		proxyRes.on('end', ()=>{
			res.writeHead(200, {})
			res.end(data)
		})
	})	
}).get('/dd', (req, res) => {
	https.get(TARGET + '/hex/attr/dd.php', {
		rejectUnauthorized:false
	},
	(proxyRes)=>{
		let data = ''
		proxyRes.on('data', (chunk)=>{data += chunk})
		proxyRes.on('end', ()=>{
			res.writeHead(200, {})
			res.end(data)
		})
	})
})
	
		
var server = app.listen(PORT, '0.0.0.0', function() {
	console.log('Listening on port %d', server.address().port);
})
		
