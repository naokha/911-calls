var elasticsearch = require('elasticsearch');
var esClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'error'
});

console.log("Searching calls by category ...");
esClient.search({
    index: 'calls',
    type: 'call',
    body: {
        aggs: {
            "category": {
                "terms": {
                    "field": "type"
                }
            }
        }
    }


}).then(function (response) {
    console.log(response.aggregations.category.buckets);
}, function (error) {
    console.log("Error ! :" + error);
});