var elasticsearch = require('elasticsearch');
var esClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'error'
});

var lat = 40.241493;
var lon =  -75.283783;
var distance = "500m";
console.log("Searching calls around (lat:"+lat+" , lon:"+lon+") for a distance of "+distance);
esClient.search({
    index: 'calls',
    type: 'call',
    body: {
        "query": {
            "bool": {
                "must": {
                    match_all: {}
                },
                "filter": {
                    "geo_distance": {
                        "distance": distance,
                        "location": {
                            "lat": lat,
                            "lon": lon
                        }
                    }
                }
            }
        }
    }
}).then(function (response) {
    console.log("Found : "+response.hits.total+ " calls");
}, function (error) {
    console.log("Error ! :"+error);
});