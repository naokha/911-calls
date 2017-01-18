
$(document).ready(function () {
    var map = L.map('map').setView([39.245867, -97.365235], 4);
    var markers = [];
    clearMap = function () {
        for (var i = 0; i < markers.length; i++) {
            map.removeLayer(markers[i]);
        }
    }
    L.tileLayer('http://tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    function displayResult() {
        $("#result").removeClass("invisible");
    }
    getLandsaleCalls = function () {
        clearMap();
        $.ajax({
            url: 'http://localhost:8000/landsaleCalls',
            cache: true,
            timeout: 5000,
            success: function (data) {
                displayResult();
                $("#result").html("Il y a eu " + data.hits.total + " appels autour de Landsale. Quelques uns sont affichés sur la carte");
                for (var i in data.hits.hits) {
                    addMapMarker(data.hits.hits[i]._source.location, data.hits.hits[i]._source.category);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error ' + textStatus + " " + errorThrown);
            }
        });
    }

    getCallsByCategory = function(){
        clearMap();
        $.ajax({
            url: 'http://localhost:8000/callsByCategory',
            cache: true,
            timeout: 5000,
            success: function (data) {
                displayResult();
                $("#result").html("Il y a eu :</br>");
                for(var i in data.aggregations.category.buckets){
                    var categ = data.aggregations.category.buckets[i];
                    $("#result").append(categ.doc_count+" appels dans la catégorie "+categ.key+"</br>");
                }
                for (var i in data.hits.hits) {
                    addMapMarker(data.hits.hits[i]._source.location, data.hits.hits[i]._source.category);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error ' + textStatus + " " + errorThrown);
            }
        });
    }

    getMonthsMaxCalls = function(){
        clearMap();
        $.ajax({
            url: 'http://localhost:8000/monthsMaxCalls',
            cache: true,
            timeout: 5000,
            success: function (data) {
                displayResult();
                $("#result").html("Il y a eu :</br>");
                for(var i in data.aggregations.monthCalls.buckets){
                    var monthCall = data.aggregations.monthCalls.buckets[i];
                    $("#result").append(monthCall.doc_count+" appels au mois "+monthCall.key_as_string+"</br>");
                }
                for (var i in data.hits.hits) {
                    addMapMarker(data.hits.hits[i]._source.location, data.hits.hits[i]._source.category);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error ' + textStatus + " " + errorThrown);
            }
        });
    }

    getCityMaxCalls = function(){
        clearMap();
        $.ajax({
            url: 'http://localhost:8000/cityMaxCalls',
            cache: true,
            timeout: 5000,
            success: function (data) {
                displayResult();
                $("#result").html("Les 3 villes ayant eu le plus d'appels sont :</br>");
                for(var i in data.aggregations.byCause.cityCalls.buckets){
                    var cityCall = data.aggregations.byCause.cityCalls.buckets[i];
                    $("#result").append(cityCall.key+" avec "+cityCall.doc_count+" appels</br>");
                }
                for (var i in data.hits.hits) {
                    addMapMarker(data.hits.hits[i]._source.location, data.hits.hits[i]._source.category);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error ' + textStatus + " " + errorThrown);
            }
        });
    }

    addMapMarker = function (location, category) {
        var coords = [location.lat, location.lon];
        markers.push(L.marker(coords).addTo(map)
            .bindPopup(category)
            .openPopup());
        map.setView(coords, 13);
    }
    
})


