/* Map opens centered on continental US
Default Maps UI disabled
Populate map with default array of city markers.
Marker displays info window on mouseover, showing city sentiment and trending topic, clicking marker opens side menu for top 5 +/- tweets
*/

//Initialize default map, called when page is loaded
function initMap() {

  //Fancy custom map style
  var mapStyle = [
    {"elementType": "geometry", "stylers": [{"color": "#f5f5f5"}]},
    {"elementType": "labels.icon", "stylers": [{"visibility": "off"}]},
    {"elementType": "labels.text.fill", "stylers": [{"color": "#616161"}]},
    {"elementType": "labels.text.stroke","stylers": [{"color": "#f5f5f5"}]},
    {"featureType": "administrative.land_parcel", "stylers": [{"visibility": "off"}]},
    {"featureType": "administrative.land_parcel", "elementType":"labels.text.fill", "stylers": [{"color": "#bdbdbd"}]},
    {"featureType": "administrative.neighborhood","stylers": [{"visibility": "off"}]},
    {"featureType": "poi", "elementType": "geometry","stylers": [{"color": "#eeeeee"}]},
    {"featureType": "poi","elementType": "labels.text","stylers": [{"visibility": "off"}]},
    {"featureType": "poi", "elementType": "labels.text.fill","stylers":[{"color": "#757575"}]},
    {"featureType": "poi.park","elementType": "geometry","stylers": [{"color": "#e5e5e5"}]},
    {"featureType": "poi.park","elementType": "labels.text.fill","stylers": [{
     "color": "#9e9e9e"}]},
    {"featureType": "road","stylers": [{"visibility": "off"}]},
    {"featureType": "road", "elementType": "geometry","stylers": [{"color": "#ffffff"}]},
    {"featureType": "road","elementType": "labels","stylers": [{"visibility":"off"
    }]},
    {"featureType": "road.arterial","elementType": "labels.text.fill","stylers": [
    {"color": "#757575"}]},
    {"featureType": "road.highway","elementType": "geometry","stylers": [{"color": "#dadada"}]},
    {"featureType": "road.highway","elementType": "labels.text.fill","stylers": [{"color": "#616161"}]},
    {"featureType": "road.local","elementType": "labels.text.fill","stylers": [
    {"color": "#9e9e9e"}]},
    {"featureType": "transit.line","elementType": "geometry","stylers": [{ "color": "#e5e5e5"}]},
    {"featureType": "transit.station","elementType": "geometry","stylers": [{
    "color": "#eeeeee"}]},
    {"featureType": "water","elementType": "geometry","stylers": [{"color": "#c9c9c9"}]},
    {"featureType": "water","elementType": "labels.text","stylers": [{"visibility": "off"}]},
    {"featureType": "water","elementType": "labels.text.fill","stylers": [{
    "color": "#9e9e9e"}]}
  ];

  //Map display options
  var mapSettings = {
    zoom: 4,
    center: {lat:39.8283, lng:-98.5795},
    disableDefaultUI:true,
    zoomControl: false,
    scrollwheel: false
  };

  var styledMap = new google.maps.StyledMapType(styles,{name:"StyledMap"});
  var map = new google.maps.Map(
    document.getElementById('map'), mapSettings);

  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeID('map_style');

  //Getting data to populate map with pins, heatmap
  var heatmapData = [];
  var arrayCities = [];

  //?????????????????????? x1000
  var jObj = JSON.parse(jString);

  //After parsing JSON string, creates arrayCities and heatmapData array
  //heatmapData array must be composed of Google Maps weightedLocation objects
  for (i in jObj[0].cities){
    arrayCities[i] = jObj[0].cities[i];

    var heatLat = arrayCities[i].Lat;
    var heatLng = arrayCities[i].Lng;
    var heatWeight = 1 + arrayCities[i].Sentiment; //ensuring all weights are positive, not sure if necessary. Google not helpful
    var weightedLocObj = {
      location: new google.maps.LatLng(heatLat, heatLng),
      weight: heatWeight;
    };

    heatmapData.push(weightedLocObj);
  }

  //Shuffle city array to randomize pins dropped on default map, probably totes unnecessary
  //code/algorithm from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/25984542
  for(var i = arrayCities.length - 1; i > 0; i--){
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arrayCities[i];
    arrayCities[i] = arrayCities[j];
    arrayCities[j] = temp;
  }

  //Adds random 10 markers
  for(var i = 0; i < 10; i++){
    addMarker(arrayCities[i], i*300);
  }

  //Adds heatmap layer to map, sets options
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
    map: map,
    gradient:['#ea1e73', '#d03b9e', '#bc49af', '#a556bd', '#6c6acc', '#4871cd', '#0b76ca'],
    radius: '6px',
    opacity: 0.8
  });

  //Drops markers on map sequentially, adds listeners to markers, formats info window content
  function addMarker(city, timeout){
    window.setTimeout(function(){
      //Defines marker position, icon, and animation
      var marker = new google.maps.Marker({
        position: {lat:city.Lat,lng:city.Lng},
        map:map,
        icon:{path:'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
        fillColor:'#ffcc00',
        fillOpacity: 1,
        scale: 0.7
        },
        animation:google.maps.Animation.DROP
      });

      //Translating numerical sentiment score to string to display in info window
      var intSentiment = 1 + city.Sentiment; //making positive to simplify math
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

      //Defining, formatting info window content
      var infoWindow = new google.maps.InfoWindow({
        content:'<div id="iw-container">' +
          '<div class="iw-title">' + city.Name + '</div>' +
          '<div class="iw-content">' + '<div class="iw-subTitle">Trending:</div>' +
          '<p>' + city.Trend + '</p>' +
          '<div class="iw-subTitle">Average Tweet Sentiment:</div>'+
          '<p>' + stringSentiment + '</p><br>' + '<div class="iw-subTitle">Click for Top 5 Tweets!</div>' + '</div></div>';
      });

      //Adds listener to marker to open info window on mouseover
      marker.addListener('mouseover', function(){
        infoWindow.open(map, marker);
      });

      //Adds listener to marker to close info window on mouseout
      marker.addListener('mouseout', function(){
        infoWindow.close();
      });

      //Adds listener to marker to open side menu on click
      marker.addListener('click', function(){
        openTopTweets();
      })

    }, timeout);
  }
}

  //Opens side Tweet feed when pin is clicked
  //TO DO: display tweets! 
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
