mapboxgl.accessToken = 'pk.eyJ1Ijoic2thaXNlcmljcHJiIiwiYSI6ImNpa2U3cGN1dDAwMnl1cm0yMW94bWNxbDEifQ.pEG_X7fqCAowSN8Xr6rX8g';

var bound = new mapboxgl.LngLatBounds(
    new mapboxgl.LngLat(-81.457, 36.945),
	new mapboxgl.LngLat(-72.49, 41.17)
);
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/skaisericprb/citvqu6qb002p2jo1ig5hnvtk',
	center: [-77.975, 39.077],
	maxBounds: bound,
	zoom: 7.45,
	attributionControl: {
		position: 'bottom-right'
	},
	minZoom: [7.0],
});

var subwatershed_template_string = "<% if (watershed.HUC_NAME) { %><p><strong> <%= watershed.HUC_NAME%> </strong></p><% } %>";
var subwatershed_template = _.template(subwatershed_template_string, {variable: 'watershed'});

map.on('load', function() {
	
  map.addSource('subwatershed', {
	type: 'vector',
	url: 'mapbox://skaisericprb.702zi5l0'
  });
  map.addLayer({
	id: 'subwatershed',
	type: 'line',
	source: 'subwatershed',
	'source-layer': 'huc8',
	paint: {
		'line-color': '#877b59',
		'line-width': 1
	}
  });
  
  map.addLayer({
	  id: 'hover-fill',
	  type: 'fill',
	  source: 'subwatershed',
	  'source-layer': 'huc8',
	  paint: {
		  'fill-color': '#FFF',
		  'fill-opacity': 0
	  }
  });
  
  map.addLayer({
	  id: 'hover',
	  type: 'line',
	  source: 'subwatershed',
	  'source-layer': 'huc8',
	  filter: ['==', 'HUC_NAME', ''],
	  paint: {
		  'line-color': '#000000',
		  'line-width': 1.5
	  }
  });
});

map.on("mousemove", function(e) {
	var features = map.queryRenderedFeatures(e.point, { layers: ["hover-fill"] });
	if (features.length) {
		map.setFilter("hover", ["==", "HUC_NAME", features[0].properties.HUC_NAME]);
	} else {
		map.setFilter("hover", ["==", "HUC_NAME", ""]);
	}
});

map.on('click', function(e) {
	var features = map.queryRenderedFeatures(e.point, {
		layers: ['hover-fill']
	});
	  
	if (!features.length) {
		return;
	}
	  
	var feature = features[0];
    var ttip = new mapboxgl.Popup()	  
      .setLngLat(map.unproject(e.point))
      .setHTML(subwatershed_template(features[0].properties))
	  .addTo(map);	  
});


var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');
map.addControl(new MapboxGeocoder({
	accessToken: mapboxgl.accessToken,
	position: 'top-right'
	}));


