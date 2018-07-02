/* Map opens centered on continental US
Default Maps UI disabled
Populate map with default array of city markers.
Marker displays city sentiment analysis score on mouseover, clicking marker opens side menu for top 5 tweets
Needs to be addressed still: mouseover info window for cities near edge of map, eg Seattle, shifts map off-center. Add re-centering function.
*/

//Initialize default map, called when page is loaded

var map;

function initMap() {
	map = new google.maps.Map(
		document.getElementById('map'), {
			zoom: 3,
			center: {lat:39.8283, lng:-98.5795},
			disableDefaultUI:true,
			zoomControl: false,
			scrollwheel: false
		});

	// Populate map with array of default markers
	var defaultCities = [
		{
			coords:{lat:40.7128,lng:-74.0060},
			content:'<h3>New York City</h3><p>Sentiment score here </p><p>Trending:</p><h4>Click for top 5 tweets</h4>',
			/*city: "new york",
	sentiment: int,
	trend: "asdf"*/
		},
		{
			coords:{lat:34.0522,lng:-118.2437},
			content:'<h2>Los Angeles</h2><p>Sentiment score here </p><p>Trending:</p><h3>Click for top 5 tweets</h3>'
		},
		{
			coords:{lat:33.7490,lng:-84.3880},
			content:'<h2>Atlanta</h2><p>Sentiment score here </p><p>Trending:</p><h3>Click for top 5 tweets</h3>'
		},
		{
			coords:{lat:36.1627,lng:-86.7816},
			content:'<h2>Nashville</h2><p>Sentiment score here </p><p>Trending:</p><h3>Click for top 5 tweets</h3>'
		},
		{
			coords:{lat:39.7392,lng:-104.9903},
			content:'<h2>Denver</h2><p>Sentiment score here </p><p>Trending:</p><h3>Click for top 5 tweets</h3>'
		},
		{
			coords:{lat:36.1699,lng:-115.1398},
			content:'<h2>Las Vegas</h2><p>Sentiment score here </p><p>Trending:</p><h3>Click for top 5 tweets</h3>'

		},
		{
			coords:{lat:29.7604,lng:-95.3698},
			content:'<h2>Houston</h2><p>Sentiment score here </p><p>Trending:</p><h3>Click for top 5 tweets</h3>'
		},
		{
			coords:{lat:47.6062,lng:-122.3321},
			content:'<h2>Seattle</h2><p>Sentiment score here </p><p>Trending:</p><h3>Click for top 5 tweets</h3>'
		},
		{
			coords:{lat:41.8781,lng:-87.6298},
			content:'<h2>Chicago</h2><p>Sentiment score here </p><p>Trending:</p><h3>Click for top 5 tweets</h3>'
		},
		{
			coords:{lat:42.3601,lng:-71.0589},
			content:'<h2>Boston</h2><p>Sentiment score here </p><p>Trending:</p><h3>Click for top 5 tweets</h3>'
		},
	];

	//Could add condition for if (logged in), push custom city markers to marker array

	//Drops markers on map sequentially

}
function addMarker(props, timeout){
	window.setTimeout(function(){
		var marker = new google.maps.Marker({
			position: props.coords,
			map:map,
			icon:{path:'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
				fillColor:'#efe447',
				fillOpacity: 1,
				scale: 0.7
			},
			animation:google.maps.Animation.DROP
		});

		var infoWindow = new google.maps.InfoWindow({
			content:props.content
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
	data = JSON.parse(data)
	console.log(data)
	cities = []
	for (var i = 0; i < data.length; i++) {
		obj = data[i]
		city = {
			coords:{lat:Number(obj["Lat"]),Number(lng:obj["Lng"])},
			content:'<h2>'+obj["City"]+'</h2><p>Mood: '+obj["Sentiment"]+'</p><p>Trending: '+obj["Trend"]+'</p><h3>Click for top 5 tweets</h3>'
		}
		addMarker(city,i*200);
	}
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
