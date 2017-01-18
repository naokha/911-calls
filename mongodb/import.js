var mongodb = require('mongodb');
var csv = require('csv-parser');
var fs = require('fs');

var MongoClient = mongodb.MongoClient;
var mongoUrl = 'mongodb://localhost:27017/911-calls';

var insertCalls = function (db, callback) {
    var collection = db.collection('calls');
    collection.remove();
    var calls = [];
    fs.createReadStream('../911.csv')
        .pipe(csv())
        .on('data', data => {
            var date = new Date(data.timeStamp);
            var monthAndYear = ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
            var call = {
                location: {
                    type: "Point",
                    coordinates: [parseFloat(data.lng), parseFloat(data.lat)]
                },
                city: data.desc.split(';')[1].trim(),
                cat: data.title.split(':')[0].trim(),
                type: data.title.split(':')[1].trim(),
                monthAndYear: monthAndYear,
            }; // TODO créer l'objet call à partir de la ligne
            calls.push(call);
        })
        .on('end', () => {
            collection.insertMany(calls, (err, result) => {
                callback(result)
            });
        });
}

MongoClient.connect(mongoUrl, (err, db) => {
    insertCalls(db, result => {
        console.log(`${result.insertedCount} calls inserted`);
        db.close();
    });
});
