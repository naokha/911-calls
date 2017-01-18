var elasticsearch = require('elasticsearch');
var csv = require('csv-parser');
var fs = require('fs');

var esClient = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'error'
});


function createCallIndex() {
	console.log("Creating index ...");
	return esClient.indices.create({
		index: 'calls'
	});
}

function createMapping() {
	console.log("Creating mapping ...");
	var mapping = {
		properties: {
			"location": { "type": "geo_point" },
			"desc": { "type": "string" },
			"zip": { "type": "string" },
			"type": { "type": "string","fielddata": true},
			"category": { "type": "string"},
			"timeStamp": { "type": "string" },
			"monthYear": {"type": "string"},
			"address": { "type": "string" },
			"city": { "type": "string" }
		}
	};
	return esClient.indices.putMapping({ index: "calls", type: "call", body: mapping });
}

createCallIndex().then(function (response) {
	console.log(response);
	createMapping().then(function (response) {
		console.log(response);
		insertCalls();
	}, function(error){
		console.log("Error ! :"+error);
	});
}, function(error){
	console.log("Error ! :"+error);
});

function insertCalls() {
	console.log("Inserting calls ...");
	// array of 911 calls to push
	var calls = [];
	// parse csv
	fs.createReadStream('../911.csv')
		.pipe(csv())
		.on('data', data => {
			// where the call will go
			calls.push(
				{ "index": { "_index": "calls", "_type": "call" } }
			);
			var date = new Date(data.timeStamp);
			// add new call object
			calls.push(
				{
					"location": {
						lat: data.lat,
						lon: data.lng
					},
					"desc": data.desc,
					"zip": data.zip,
					"type": data.title.substr(0, data.title.indexOf(":")).trim(),
					"category": data.title.substr(data.title.indexOf(":") + 1).trim(),
					"timeStamp": data.timeStamp,
					"address": data.addr,
					"city": data.twp,
					"monthYear": ("0" + (date.getMonth() + 1)).slice(-2)+'/'+date.getFullYear()
				}
			);
		})
		.on('end', () => {
			// bulk insert the calls we've prepared
			esClient.bulk({ index: "calls", type: "call", body: calls })
				.then(response => {
					console.log(response);
				}, function(error){
					console.log("Error ! :"+error);
				})
		});
}

