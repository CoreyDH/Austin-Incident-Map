//function to display map
function plotDataByKeyword(keyword, limit){
	var arrayToPlot=getDataByKeyword(keyword, limit);
	plotMarkers(arrayToPlot);
}
function plotDataByCategory(category, limit){
	var arrayToPlot=getDataByCategory(category, limit);
	plotMarkers(arrayToPlot);
};
function initMap() {
    var geocode= new google.maps.Geocoder();
   	var minZoomLevel = 10;
   	var map = new google.maps.Map(document.getElementById('map'), {
    	center: new google.maps.LatLng(30.29,  -97.666667),
    	zoom: 11,
    	mapTypeControl: false,
    	streetViewControl: false,
  	});
  	var strictBounds = new google.maps.LatLngBounds(
     new google.maps.LatLng(28.70, -127.50), 
     new google.maps.LatLng(48.85, -55.90)
   );

  	 google.maps.event.addListener(map, 'dragend', function() {
     if (strictBounds.contains(map.getCenter())) return;

     // We're out of bounds - Move the map back within the bounds
     var c = map.getCenter(),
         x = c.lng(),
         y = c.lat(),
         maxX = strictBounds.getNorthEast().lng(),
         maxY = strictBounds.getNorthEast().lat(),
         minX = strictBounds.getSouthWest().lng(),
         minY = strictBounds.getSouthWest().lat();

     if (x < minX) x = minX;
     if (x > maxX) x = maxX;
     if (y < minY) y = minY;
     if (y > maxY) y = maxY;

     map.setCenter(new google.maps.LatLng(y, x));
   });

  	google.maps.event.addListener(map, 'zoom_changed', function() {
     if (map.getZoom()<minZoomLevel){ 
     	map.setZoom(11);
     }
   });
};

function createMarkers(geocoder, resultsMap, incidentAddress, incidentWindow, markerImage){
		var address = incidentAddress;
		var image;
		if (markerImage=="Assault"){
			image="assets/images/robbery.png";
		} else if (markerImage=="Identity Crime"){
			image="assets/images/pirates.png";
		} else if(markerImage=="Thief"){
			image="assets/images/theft.png";
		} else if (markerImage=="Car Accident"){
			image="assets/images/caraccident.png";
		} else if(markerImage=="Drug Crime"){
			image="assets/images/.png";
		}
		geocoder.geocode({'address': address}, function(results, status) {
		if (status === 'OK') {
        	resultsMap.setCenter(results[0].geometry.location);
        	var marker= new google.maps.Marker({
          	map: resultsMap,
          	icon: image,
          	position: results[0].geometry.location
        	});
        marker.addListener('click', function(){
        	incidentWindow.open(map, marker);
        })
      	};
      });
	//to erase markers use marker.setMap(null);
}

function convertTime(time){
		var hours='', minutes='', displayTime='', military='';
		if(time.length==3){
			hours=0+time.charAt(0).toString();
			minutes=time.substring(1,3).toString();
			military=hours+minutes;
			console.log(military);
		} else if(time.length==4){
			hours=time.substring(0,2).toString();
			minutes=time.substring(2,4).toString();
			military=hours+minutes;
		} else if(time.length==2){
			hours='00';
			minutes=time.substring(0,2).toString();
			military=hours+minutes;
		}
		hours24 = parseInt(military.substring(0, 2),10);
    var hour = ((hours24 + 11) % 12) + 1;
    var amPm = hours24 > 11 ? 'pm' : 'am';
    var minutes = military.substring(2);
    displayTime=hour+':'+minutes + amPm;
		return displayTime
}
function plotMarkers(arrayToPlot){

	var incidentWindow = new google.maps.InfoWindow({
        content: contentString
    });
	for(i=0; i<object.incidents.length; i++){
  		key=object.incidents;
  		var time = convertTime(key[i].time);
  		var contentString = '<div id="content">'+
      	'<div id="bodyContent">'+'<p><b>Incident: </b>'+key[i].crime_type+'</p>'+
      	'<p><b>Address: </b>'+key[i].address+'</p>'+'<p><b>Date: </b>'+key[i].date+'</p>'+
      	'<p><b>Report Number: </b>'+key[i].incident_report_number+'</p>'+'<p><b>Time: </b>'+time+'</p>'+
      	'</div>'+'</div>';
      	var incidentWindow = new google.maps.InfoWindow({
        content: contentString
    	});
    	createMarkers(geocode, map, key[i].address, incidentWindow, key[i].crime_type);
	}
};