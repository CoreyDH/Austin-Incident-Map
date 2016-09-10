
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 30.29, lng: -97.666667},
    zoom: 11,
    mapTypeControl: false,
    streetViewControl: false,
  });
}