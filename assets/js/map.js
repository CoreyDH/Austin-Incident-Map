//global variables
var markers=[];
var geocode;
var map;
var mapArray={
plotDataByKeyword: function(keyword, limit){
  var arrayToPlot=getDataByKeyword(keyword, limit);
  map.plotMarkers(arrayToPlot);
},

plotDataByCategory: function(category, limit){
  var arrayToPlot=getDataByCategory(category, limit);
  plotMarkers(arrayToPlot);
},

selectIcon: function(category){
  var icon;
  if (category=="violent"){
    icon="assets/images/robbery.png";
  } else if (category=="property"){
    icon="assets/images/house.png";
  } else if(category=="thieft"){
    icon="assets/images/theft.png";
  } else if (category=="accident"){
    icon="assets/images/caraccident.png";
  } else if(category=="drug"){
    icon="assets/images/marijuana.png";
  }
    return icon;
  },

convertTime: function(time){
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
},

createContentString: function(incident, time){
  var info= '<div id="content">'+'<div id="bodyContent">'+'<p><b>Incident: </b>'+incident.crime_type+'</p>'+'<p><b>Address: </b>'+incident.address+'</p>'+'<p><b>Date: </b>'+incident.date+'</p>'+
  '<p><b>Report Number: </b>'+incident.incident_report_number+'</p>'+'<p><b>Time: </b>'+time+'</p>'+'</div>'+'</div>';
  return info
  }
};

//This function will display the map
function initMap() {
  //variable to create the google maps geocoder to be use to change from an address to a lng and lat. 
  geocode= new google.maps.Geocoder();

  //variable for the min zoom level to use on google maps
  var minZoomLevel = 10;

  //variable to create google maps
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(30.31,  -97.75),
    zoom: 11,
    mapTypeControl: false,
    streetViewControl: false,
  });

  //variable to create the strict bonds for Austin map
  var strictBounds = new google.maps.LatLngBounds(new google.maps.LatLng(30.134806, -97.793265), new google.maps.LatLng(30.512948, -97.752066));

  //listener for dragend to limit the view are of the map
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

  //listener to limit the zoom on the map
  google.maps.event.addListener(map, 'zoom_changed', function() {
    if (map.getZoom()<minZoomLevel){ 
    map.setZoom(11);
    }
  });
  var marker= new google.maps.Marker({
    map: map,
    position: {lat: 30.29001, lng: -97.666},
    });
  markers.push(marker);
  console.log(markers);

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
};

function clearMarkers() {
  setMapOnAll(null);
};

function deleteMarkers(){
  clearMarkers();
  markers=[];
};
  
};

function createMarkers(geocoder, resultsMap, incidentAddress, incidentWindow, category){
  var address = incidentAddress+", Austin, TX";
  var image=mapArray.selectIcon(category);
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
          markers.push(marker);
          };
        });
};

function plotMarkers(arrayToPlot){
  var incidentWindow = new google.maps.InfoWindow({
        content: contentString
    });
    console.log(arrayToPlot.incidents.length);
    console.log(object.incidents.length);
    for(i=0; i<arrayToPlot.incidents.length; i++){
      console.log(i);
      key=arrayToPlot.incidents;
      console.log(key);
      console.log(key[i].time)
      var time = mapArray.convertTime(key[i].time);
      var contentString=mapArray.createContentString(key[i], time);
      var incidentWindow = new google.maps.InfoWindow({
        content: contentString
      });
      console.log(contentString);
      createMarkers(geocode, map, key[i].address, incidentWindow, key[i].crime_type);
    }
  };