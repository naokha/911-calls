var elasticsearch = require('elasticsearch');
var esClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'error'
});

var monthsNumber = 3;
console.log("Searching the " + monthsNumber + " months which got most calls ...");
esClient.search({
    index: 'calls',
    type: 'call',
    body: {
        aggs: {
            "monthCalls": {
                "terms": {
                    "field": "monthYear",
                    "size": monthsNumber,
                    "order": { "_count": "desc" }
                }
            }
        }
    }
}).then(function (response) {
    console.log(response.aggregations.monthCalls.buckets);
}, function (error) {
    console.log("Error ! :" + error);
});