/** 
 * Map opens centered on continental US
 * Default Maps UI disabled
 * Populate map with default array of city markers.
 * Marker displays info window on mouseover, showing city sentiment and trending topic, clicking marker opens side menu for top 5 +/- tweets
 */

var map, heatmap;
var markers = [];
var cities = [];
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

//Adds marker to map, sets location, icon image, animation, info windows
function addMarker(city, timeout){
	window.setTimeout(function(){
		var marker = new google.maps.Marker({
			position: city.coords,
			map:map,
      icon: 'https://png.icons8.com/dotty/40/000000/twitter.png',
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
      openTopTweets(city);
		});

	}, timeout);
}

//Called when form is submitted, clears previous markers, sets heatmap data, adds heatmap layer
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
      name: obj["City"],
      coords:{lat:Number(obj["Lat"]),lng:Number(obj["Lng"])},
			content:'<h2 style="color:#262626;">'+obj["City"]+'</h2><p style="color:#262626;">Mood: '+ stringSentiment
      +'</p><p style="color:#262626">Trending: '+obj["Trend"]+'</p><h4 style="color:#262626;">Click for top 5 tweets!</h4>',
      posTweet1: obj["PTweet1"],
      posTweet2: obj["PTweet2"],
      posTweet3: obj["PTweet3"],
      posTweet4: obj["PTweet4"],
      posTweet5: obj["PTweet5"],
      negTweet1: obj["NTweet1"],
      negTweet2: obj["NTweet2"],
      negTweet3: obj["NTweet3"],
      negTweet4: obj["NTweet4"],
      negTweet5: obj["NTweet5"]
		};

    cities.push(city);

    var latLng = new google.maps.LatLng(Number(obj["Lat"]),Number(obj["Lng"]));
    var weight = intSentiment*12;
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
    radius:35,
    gradient:['rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(0, 63, 255, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 0, 223, 1)',
          'rgba(0, 0, 191, 1)',
          'rgba(0, 0, 159, 1)',
          'rgba(0, 0, 127, 1)',
          'rgba(63, 0, 91, 1)',
          'rgba(127, 0, 63, 1)',
          'rgba(191, 0, 31, 1)',
          'rgba(255, 0, 0, 1)']
  });

}

//Removes markers, called when creating a new map
function clearMarkers(){
  for(var i = 0; i < markers.length; i++){
    markers[i].setMap(null);
  }
  markers = [];
  cities = [];
  heatmapData = [];
}

//Opens side Tweet feed when pin is clicked
function openTopTweets(city){
	document.getElementById("tweetStream").style.width = "450px";
	document.body.style.backgroundColor = "rgba(0,0,0,0.4)";

  //I don't know why this made it work but it did so...
  var element = document.getElementById("cityname");
  element.innerHTML = city.name;

  //document.getElementById("cityname").innerHTML = city.name;

  document.getElementById("posTweet1").innerHTML = city.posTweet1;
  document.getElementById("posTweet2").innerHTML = city.posTweet2;
  document.getElementById("posTweet3").innerHTML = city.posTweet3;
  document.getElementById("posTweet4").innerHTML = city.posTweet4;
  document.getElementById("posTweet5").innerHTML = city.posTweet5;

  document.getElementById("negTweet1").innerHTML = city.negTweet1;
  document.getElementById("negTweet2").innerHTML = city.negTweet2;
  document.getElementById("negTweet3").innerHTML = city.negTweet3;
  document.getElementById("negTweet4").innerHTML = city.negTweet4;
  document.getElementById("negTweet5").innerHTML = city.negTweet5;

}



//Closes side Tweet feed
function closeTopTweets(){
	document.getElementById("tweetStream").style.width = "0";
	document.getElementById("main").style.marginRight = "30px";
	document.body.style.backgroundColor = "white";
}
