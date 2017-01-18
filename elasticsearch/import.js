var elasticsearch = require('elasticsearch');
var csv = require('csv-parser');
var fs = require('fs');

var esClient = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'error'
});
var creates = [];
fs.createReadStream('../911.csv')
	.pipe(csv())
	.on('data', data => {
		creates.push(
			{ "index": { "_index": "calls", "_type": "call" } }
		);
		creates.push(
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
		esClient.bulk({ body: creates })
			.then(response => {
				console.log(response);
			}
			)
	});
