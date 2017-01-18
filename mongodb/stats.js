var mongodb = require('mongodb');
var csv = require('csv-parser');
var fs = require('fs');

var MongoClient = mongodb.MongoClient;
var mongoUrl = 'mongodb://localhost:27017/911-calls';
var getCallsPerCat = function (db, callback) {
    db.collection("calls").aggregate([
        { $match: {} },
        {
            $group: {
                _id: '$cat',
                count: {
                    $sum: 1
                }
            }
        }

    ]).toArray(function (err, docs) {
        callback(docs);
    });
}
var get3MonthsWithMoreCalls = function (db, callback) {
    db.collection("calls").aggregate([
        {
            $match: {}
        },
        {
            $group: {
                _id: '$monthAndYear',
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                count: -1
            }
        },
    ]).limit(3).toArray(function (err, docs) {
        callback(docs)
    });
}
var getTop3CitiesWithMoreOverdoseCalls = function (db, callback) {
    db.collection("calls").aggregate([{
        $match: { type: { $regex: ".*OVERDOSE.*" } }
    },
    {
        $group: {
            _id: '$city',
            total: { $sum: 1 }
        }
    },
    {
        $sort: {
            total: -1
        }
    },
    ]).limit(3).toArray(function (err, docs3) {
        callback(docs3)
    });
}
var getCitiesAround500m = function (db, callback) {
    db.collection("calls").createIndex({ location: "2dsphere" })
    db.collection("calls").find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [
                        -75.283783,
                        40.241493
                    ]
                },
                $maxDistance: 500
            }
        }
    }).count().then(function(res){
            callback(res);
    });
}
MongoClient.connect(mongoUrl, (err, db) => {
    getCallsPerCat(db, result1 => {
        console.log(`Compter le nombre d'appels par catégorie`);
        console.log(result1);
        get3MonthsWithMoreCalls(db, result2 => {
            console.log("Trouver les 3 mois ayant comptabilisés le plus d'appels");
            console.log(result2);
            getTop3CitiesWithMoreOverdoseCalls(db, result3 => {
                console.log("Trouver le top 3 des villes avec le plus d'appels pour overdose");
                console.log(result3);
                getCitiesAround500m(db, result4 => {
                    console.log("Compter le nombre d'appels autour de Lansdale dans un rayon de 500 mètres");
                    console.log(result4);
                    db.close();
                });
            });
        })
    });
});

