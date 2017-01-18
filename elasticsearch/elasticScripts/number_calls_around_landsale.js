module.exports = {
    getNumberCallsAroundLandsale: function () {
        var elasticsearch = require('elasticsearch');
        var esClient = new elasticsearch.Client({
            host: 'localhost:9200',
            log: 'error'
        });
        var lat = 40.241493;
        var lon = -75.283783;
        var distance = "500m";
        return esClient.search({
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
        });
    }
}
