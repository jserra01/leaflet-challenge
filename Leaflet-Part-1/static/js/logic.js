// Store API endpoint as queryUrl
let queryUrl = ("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson");

// Get Data
d3.json(queryUrl).then(function (data) {
    //console.log(data.features);
    createMap(data.features);
});

// Create Map
function createMap(earthquakes) {

    //console.log("Dict", earthquakes);

    // Create base layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    let circleMarkers = [];

    // Loop through data to create markers
    for (let i=0;i<earthquakes.length;i++) {

        //Create colors
        let color = "";
        if (earthquakes[i].geometry.coordinates[2] >= 90) {
            color = "#ff6347";
        }
        else if (earthquakes[i].geometry.coordinates[2] >= 70) {
            color = "#ff8c47";
        }
        else if (earthquakes[i].geometry.coordinates[2] >= 50) {
            color = "#f0d447";
        }
        else if (earthquakes[i].geometry.coordinates[2] >= 30) {
            color = "#a3e32c";
        }
        else if (earthquakes[i].geometry.coordinates[2] >= 10) {
            color = "#80b919";
        }
        else {
            color = "#638f13";
        }

        circleMarkers.push(
            L.circle([earthquakes[i].geometry.coordinates[1], earthquakes[i].geometry.coordinates[0]], {
                stroke: true,
                fillOpacity: 0.8,
                color: "black",
                fillColor: color,
                weight: 1.5,
                radius: earthquakes[i].properties.mag * 25000
            }).bindPopup(`<h3>${earthquakes[i].properties.place}</h3><hr><p>${new Date(earthquakes[i].properties.time)}</p><hr><p>Magnitude: ${earthquakes[i].properties.mag}</p>
            <hr><p>Depth: ${earthquakes[i].geometry.coordinates[2]}</p>`)
        );

    }

    //console.log("marker", circleMarkers);

    //Add markers to layer group
    let markers = L.layerGroup(circleMarkers);

    // Create overlay object
    let overlayMaps = {
        "Earthquakes": markers
    };

    // Create map
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, markers]
    });

    // Create a layer control.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

}

