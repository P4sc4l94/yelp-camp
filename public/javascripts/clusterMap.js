mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'clusterMap',
style: 'mapbox://styles/mapbox/dark-v10',
center: [-103.59179687498357, 40.66995747013945],
zoom: 3
});

map.addControl(new mapboxgl.NavigationControl());
 
map.on('load', function () {
// Add a new source from our GeoJSON data and
// set the 'cluster' option to true. GL-JS will
// add the point_count property to your source data.
map.addSource('campgrounds', {
type: 'geojson',
// Point to GeoJSON data. This example visualizes all M1.0+ campgrounds
// from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
data: campgrounds,
cluster: true,
clusterMaxZoom: 14, // Max zoom to cluster points on
clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
});

//setup for how the clusters look on the map
map.addLayer({
id: 'clusters',
type: 'circle',
source: 'campgrounds',
filter: ['has', 'point_count'],
paint: {
// Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
// with three steps to implement three types of circles:
//   * Blue, 20px circles when point count is less than 100
//   * Yellow, 30px circles when point count is between 100 and 750
//   * Pink, 40px circles when point count is greater than or equal to 750
'circle-color': [
'step',
['get', 'point_count'],
'#51bbd6', //color for steps <= 10
10, //step 
'#f1f075', //color for steps >10 && <= 30
30,
'#f28cb1' //color for steps > 30
],
'circle-radius': [
'step',
['get', 'point_count'],
15, //px width for steps <= 10
10, //step
20, //px width for steps > 10 && <= 30
30, //step
25 //px width for steps > 30
]
}
});

//text on the cluster
map.addLayer({
id: 'cluster-count',
type: 'symbol',
source: 'campgrounds',
filter: ['has', 'point_count'],
layout: {
'text-field': '{point_count_abbreviated}',
'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
'text-size': 12
}
});

//tiny unclustered points
map.addLayer({
id: 'unclustered-point',
type: 'circle',
source: 'campgrounds',
filter: ['!', ['has', 'point_count']],
paint: {
'circle-color': '#11b4da',
'circle-radius': 4,
'circle-stroke-width': 1,
'circle-stroke-color': '#fff'
}
});
 
// inspect a cluster on click
map.on('click', 'clusters', function (e) {
  //console.log('POINT CLICKED')
const features = map.queryRenderedFeatures(e.point, {
layers: ['clusters']
});
const clusterId = features[0].properties.cluster_id;
map.getSource('campgrounds').getClusterExpansionZoom(
clusterId,
function (err, zoom) {
if (err) return;
 
map.easeTo({
center: features[0].geometry.coordinates,
zoom: zoom
});
}
);
});
 
// When a click event occurs on a feature in
// the unclustered-point layer, open a popup at
// the location of the feature, with
// description HTML from its properties.
map.on('click', 'unclustered-point', function (e) {
  //console.log('UNCLUSTERED POINT CLICKED')
  const { popUpMarkup } = e.features[0].properties;
  const coordinates = e.features[0].geometry.coordinates.slice();

 
// Ensure that if the map is zoomed out such that
// multiple copies of the feature are visible, the
// popup appears over the copy being pointed to.
while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}
 
new mapboxgl.Popup()
.setLngLat(coordinates)
.setHTML(popUpMarkup)
.addTo(map);
});
 
  map.on('mouseenter', 'clusters', function () {
    //console.log('MOUSING OVER A CLUSTER')
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'clusters', function () {
    map.getCanvas().style.cursor = '';
  });
});
