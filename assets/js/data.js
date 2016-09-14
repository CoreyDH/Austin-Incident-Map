//
// Function: Read in nad init the apd database
//
  function initDatabase (apdDataArray) {
   $.ajax({
        url: "https://data.austintexas.gov/resource/rkrg-9tez.json",
        async: false,
        type: "GET",
        data: {
          // "$limit" : 10,
          "$$app_token" : "jdmsP3hiF9ZYMZMlJTaiBOKly"
        }
    }).done(function(data) {  

      i=0;
      j=0;
      this.apdDataArray = apdDataArray;
      
    for(var i=0; i < 1000; i++) {
        this.apdDataArray[j].crime_type = data[i].crime_type;
        this.apdDataArray[j].address = data[i].address;
        this.apdDataArray[j].date = data[i].date;
       j++
      }
     });
  }

//
// Function: Get data
//
  function getData (apdData, incidentArray, incidentCount, crime_type) {    
    this.incidentArray = incidentArray;
    this.apdDataArray = apdDataArray;

    i=0;
    j=0;
    for(var i=this.apdDataArray.length-1; i > this.apdDataArray.length - incidentCount; i--) {
        this.incidentArray[j].crime_type = this.apdDataArray[i].crime_type;
        this.incidentArray[j].address = this.apdDataArray[i].address;
        this.incidentArray[j].date = this.apdDataArray[i].date;
       j++
      } 
  }

//
// **** App begins here
//

// Initialize two arrays
  var incidentArray = new Array();
  var iMax = 20;

  var apdDataArray = new Array();
  var fMax = 1000;

  for (i=0; i<fMax; i++) {
        apdDataArray[i]=new Array();
        apdDataArray[i].address = "empty address";
        apdDataArray[i].crime_type = "empty crime";
        apdDataArray[i].date = "empty date";
        }

  for (i=0; i<fMax; i++) {
        incidentArray[i]=new Array();
        incidentArray[i].address = "empty address";
        incidentArray[i].crime_type = "empty crime";
        incidentArray[i].date = "empty date";
        }      

// Test the functions
  initDatabase( apdDataArray);
  debugger;

  getData (apdDataArray, incidentArray, iMax);
  debugger;
