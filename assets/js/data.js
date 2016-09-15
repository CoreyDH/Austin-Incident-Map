//
// global variables and functions
//
var apdDataBase;

//
// Function: Read in nad init the apd database
//
  function initDatabase () {
   $.ajax({
        url: "https://data.austintexas.gov/resource/rkrg-9tez.json",
        async: false,
        type: "GET",
        data: {
          // "$limit" : 10,
          "$$app_token" : "jdmsP3hiF9ZYMZMlJTaiBOKly"
        }
    }).done(function(data) {     
      apdDataBase = data;
    }); 
  }

//
// Function: Get data
//
  function getData (incidentList, incidentMax) {   

    var incidentArray = new Array();  // to be returned to caller
 
    apdIndex = apdDataBase.length;
    incidentCounter =0;
    iIndex = 0;


    while(apdIndex > 0) {  // search the apd database starting at the end
      apdIndex--;
      
      iIndex = 0;     
      while (iIndex < incidentList.length) {  // compare the apd record to the list of crimes we are looking for
        if (apdDataBase[apdIndex].crime_type.includes(incidentList[iIndex])) {
          incidentArray[incidentCounter]=new Array();  // GOT A MATCH!  Log this incident to the array to be returned
          incidentArray[incidentCounter].crime_type = apdDataBase[apdIndex].crime_type;
          incidentArray[incidentCounter].address = apdDataBase[apdIndex].address;
          incidentArray[incidentCounter].date = apdDataBase[apdIndex].date;
          incidentCounter++;
          iIndex = incidentList.length;  //break out of this inner while loop because we got a match
          } // end of if
        iIndex++;
        } //end of inner while

        if (incidentCounter == incidentMax) {  //if the return array is full, break out of the outer while
         apdIndex = -1;
        }
      
    } //end of outer while
    return (incidentArray);
  } // end of function


 
