
function initMap() {
	var myLatLng={lat: 30.29001, lng: -97.666};
	var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<div id="bodyContent">'+
      'Info for marker.</p>'
      '</div>'+
      '</div>';
    var contentString2 = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<div id="bodyContent">'+
      'Info for marker1.</p>'
      '</div>'+
      '</div>'; 
    var geocode= new google.maps.Geocoder();
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    var infowindow2 = new google.maps.InfoWindow({
        content: contentString2
    });
	var map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: 30.29, lng: -97.666667},
    	zoom: 11,
    	mapTypeControl: false,
    	streetViewControl: false,
  	});
	var marker= new google.maps.Marker({
          position: myLatLng,
          map: map,
          title: 'Hello World!'
        });

    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
    geocodeAddress(geocode,map);
    function geocodeAddress(geocoder, resultsMap) {
    var address = '7630 Wood Hollow, Austin, TX';
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        resultsMap.setCenter(results[0].geometry.location);
        var marker2 = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        });
        marker2.addListener('click', function(){
        	infowindow2.open(map, marker2);
        })
      	};
      });
    }

}