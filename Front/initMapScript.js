/* Map opens centered on continental US
Default Maps UI disabled
Populate map with default array of city markers.
Marker displays info window on mouseover, showing city sentiment and trending topic, clicking marker opens side menu for top 5 +/- tweets
*/

var map, heatmap;
var markers = [];
var heatmapData = [];

//Initialize default blank map, called when page is loaded
function initMap() {
	//Fancy custom map style
  var mapStyle = [
  {"elementType": "geometry","stylers": [{"color": "#f5f5f5"}]},{"elementType": "labels.icon","stylers": [{"visibility": "off"}]},{"elementType":
  "labels.text.fill","stylers": [{"color": "#616161"}]},{"elementType": "labels.text.stroke","stylers": [{"color": "#f5f5f5"}]},{"featureType": "administrative.land_parcel","stylers": [{"visibility": "off"}]},{
  "featureType": "administrative.land_parcel","elementType": "labels.text.fill",
  "stylers": [{"color": "#bdbdbd"}]},{"featureType":
  "administrative.neighborhood","stylers": [{"visibility": "off"}]},{
  "featureType": "poi","elementType": "geometry","stylers": [{"color": "#eeeeee"
  }]},{"featureType": "poi","elementType": "labels.text","stylers": [{
  "visibility": "off"}]},{"featureType": "poi","elementType":"labels.text.fill",
  "stylers": [{"color": "#757575"}]},{"featureType": "poi.park","elementType": "geometry","stylers": [{"color": "#e5e5e5"}]},{"featureType": "poi.park",
  "elementType": "labels.text.fill","stylers": [{"color": "#9e9e9e"}]},{
  "featureType": "road","stylers": [{"visibility": "off"}]},{"featureType": "road","elementType": "geometry","stylers": [{"color": "#ffffff"}]},
  {"featureType": "road","elementType": "labels","stylers": [{"visibility": "off"}]},{"featureType": "road.arterial","elementType": "labels.text.fill",
  "stylers": [{"color": "#757575"}]},{"featureType": "road.highway",
  "elementType": "geometry","stylers": [{"color": "#dadada"}]},{
  "featureType": "road.highway","elementType": "labels.text.fill","stylers": [
  {"color": "#616161"}]},{"featureType": "road.local","elementType": "labels.text.fill","stylers": [{"color": "#9e9e9e"}]},{"featureType": "transit.line","elementType": "geometry","stylers": [{"color": "#e5e5e5"}]},
  {"featureType": "transit.station","elementType": "geometry","stylers": [{
  "color": "#eeeeee"}]},{"featureType": "water","elementType": "geometry",
  "stylers": [{"color": "#c9c9c9"}]},{"featureType": "water","elementType": "labels.text","stylers": [{"visibility": "off"}]},{"featureType": "water",
  "elementType": "labels.text.fill","stylers": [{"color": "#9e9e9e"}]}
  ];

	//Map display options
  var mapSettings = {
    zoom: 5,
    center: {lat:39.8283, lng:-98.5795},
    disableDefaultUI:true,
    zoomControl: false,
    scrollwheel: false,
    styles: mapStyle
  };


	map = new google.maps.Map(
		document.getElementById('map'), mapSettings);


}

function addMarker(city, timeout){
	window.setTimeout(function(){
		var marker = new google.maps.Marker({
			position: city.coords,
			map:map,
			icon:{path:'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
				fillColor:'silver',
				fillOpacity: 1,
				scale: 0.5
			},
			animation:google.maps.Animation.DROP
		});

    markers.push(marker);

		var infoWindow = new google.maps.InfoWindow({
			content:city.content
		});

		marker.addListener('mouseover', function(){
			infoWindow.open(map, marker);
		});

		marker.addListener('mouseout', function(){
			infoWindow.close();
		});

		marker.addListener('click', function(){
			openTopTweets();
		})

	}, timeout);
}


function updateMap(data) {

  clearMarkers();

  //Parses JSON string after submit button is pressed
  data = JSON.parse(data);
	console.log(data);

	//Using parsed data to populate heatmap array and add markers
	for (var i = 0; i < data.length; i++) {
		obj = data[i];

    //Translating numerical sentiment score to words
    var intSentiment = 1 + Number(obj["Sentiment"]);
    var stringSentiment = "";

    if(intSentiment <= 0.286){
        stringSentiment = "Very negative";
      }

      else if(intSentiment > 0.286 && intSentiment <= 0.572){
        stringSentiment = "Mostly negative";
      }

      else if(intSentiment > 0.572 && intSentiment <= 0.858){
        stringSentiment = "Slightly negative";
      }

      else if(intSentiment > 0.858 && intSentiment <= 1.144){
        stringSentiment = "Neutral";
      }

      else if(intSentiment > 1.144 && intSentiment <= 1.43){
        stringSentiment = "Slightly positive";
      }

      else if(intSentiment > 1.43 && intSentiment <= 1.716){
        stringSentiment = "Mostly positive";
      }

      else{
        stringSentiment = "Very positive";
      }

		city = {
			coords:{lat:Number(obj["Lat"]),lng:Number(obj["Lng"])},
			content:'<h2>'+obj["City"]+'</h2><p>Mood: '+ stringSentiment
      +'</p><p>Trending: '+obj["Trend"]+'</p><h4>Click for top 5 tweets!</h4>'
		}

    var latLng = new google.maps.LatLng(Number(obj["Lat"]),Number(obj["Lng"]));
    var weight = intSentiment*7;
    var weightedLoc = {
			location: latLng,
			weight:weight
		};

    heatmapData.push(weightedLoc);

    addMarker(city,i*80);
	}

	//Adds heatmap layer to map, sets options
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
    map: map,
    opacity: 0.8,
    radius: 40
  });
}

//Removes markers, called when creating a new map
function clearMarkers(){
  for(var i = 0; i < markers.length; i++){
    markers[i].setMap(null);
  }

  heatmap.setMap(null);
  markers = [];

}

//Opens side Tweet feed when pin is clicked
function openTopTweets(){
	document.getElementById("tweetStream").style.width = "375px";
	document.getElementById("main").style.marginRight = "375px";
	document.body.style.backgroundColor = "#052f38";
}

//Closes side Tweet feed
function closeTopTweets(){
	document.getElementById("tweetStream").style.width = "0";
	document.getElementById("main").style.marginRight = "30px";
	document.body.style.backgroundColor = "white";
}
