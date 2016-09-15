//function to display map

function initMap() {
	object={
		incidents: [
		{crime_type: 'Assault',
		address: '7630 Wood Hollow',
		date: 'September 13 2016',
		incident_report_number: '3635567807867856',
		time: '142',
		},
		{crime_type: 'Identity Crime',
		address: '2525 West Anderson',
		date: 'September 9 2016',
		incident_report_number: '65786708908',
		time: '1004',
		},
		{crime_type: 'Thief',
		address: '108 Denson Dr ',
		date: 'September 6 2016',
		incident_report_number: '675698089858',
		time: '20',
		},
		],
	}
    var geocode= new google.maps.Geocoder();
   	var incidentWindow = new google.maps.InfoWindow({
        content: contentString
    });
   	var map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: 30.29, lng: -97.666667},
    	zoom: 11,
    	mapTypeControl: false,
    	streetViewControl: false,
  	});

  	for(i=0; i<object.incidents.length; i++){
  		key=object.incidents;
  		var time = convertTime(key[i].time);
  		var contentString = '<div id="content">'+
      	'<div id="siteNotice">'+
      	'</div>'+
      	'<div id="bodyContent">'+
      	'<p><b>Incident: </b>'+key[i].crime_type+'</p>'+
      	'<p><b>Address: </b>'+key[i].address+'</p>'+
      	'<p><b>Date: </b>'+key[i].date+'</p>'+
      	'<p><b>Report Number: </b>'+key[i].incident_report_number+'</p>'+
      	'<p><b>Time: </b>'+time+'</p>'+
      	'</div>'+
      	'</div>';
      	var incidentWindow = new google.maps.InfoWindow({
        content: contentString
    	});
    	createMarkers(geocode, map, key[i].address, incidentWindow);
	}	
};

function createMarkers(geocoder, resultsMap, incidentAddress, incidentWindow){
		var address = incidentAddress;
		geocoder.geocode({'address': address}, function(results, status) {
		if (status === 'OK') {
        	resultsMap.setCenter(results[0].geometry.location);
        	var marker= new google.maps.Marker({
          	map: resultsMap,
          	position: results[0].geometry.location
        	});
        marker.addListener('click', function(){
        	incidentWindow.open(map, marker);
        })
      	};
      });
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
 	
