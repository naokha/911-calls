var elasticsearch = require('elasticsearch');
var csv = require('csv-parser');
var fs = require('fs');

var esClient = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'error'
});

// first create mapping to specify geo point mainly
var mapping = {
	call: {
		properties: {
			location: { "type": "geo_point" },
			desc: { "type": "string" },
			zip: { "type": "string" },
			type: { "type": "string" },
			category: { "type": "string" },
			timeStamp: { "type": "string" },
			address: { "type": "string" },
			city: { "type": "string" }
		}
	}
};
esClient.indices.putMapping({ index: "calls", type: "call", body: mapping });

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
		// add new call object
		calls.push(
			{
				location: {
					lat: data.lat,
					lon: data.lng
				},
				desc: data.desc,
				zip: data.zip,
				type: data.title.substr(0, data.title.indexOf(":")).trim(),
				category: data.title.substr(data.title.indexOf(":") + 1).trim(),
				timeStamp: data.timeStamp,
				address: data.addr,
				city: data.twp
			}
		);
	})
	.on('end', () => {
		// bulk insert the calls we've prepared
		esClient.bulk({ body: calls })
			.then(response => {
				console.log(response);
			}
			)
	});
