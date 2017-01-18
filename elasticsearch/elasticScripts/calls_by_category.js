module.exports = {
    getCallsByCategory: function () {
        var elasticsearch = require('elasticsearch');
        var esClient = new elasticsearch.Client({
            host: 'localhost:9200',
            log: 'error'
        });

        console.log("Searching calls by category ...");
        return esClient.search({
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
        });
    }
}