var elasticsearch = require('elasticsearch');
var esClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'error'
});

var citiesNumber = 3;
var cause = "overdose";
console.log("Searching the " + citiesNumber + " cities which got most calls for " + cause + "...");
esClient.search({
    index: 'calls',
    type: 'call',
    body: {
        "aggs": {
            "byCause": {
                "filter": {
                    "term": {
                        "category": cause
                    }
                },
                aggs: {
                    "cityCalls": {
                        "terms": {
                            "field": "city",
                            "size": citiesNumber,
                            "order": { "_count": "desc" }
                        }
                    }
                }
            }
        }
    }
}).then(function (response) {
    console.log(response.aggregations.byCause.cityCalls.buckets);
}, function (error) {
    console.log("Error ! :" + error);
});