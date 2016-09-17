(function($) {
  $(function() {
  //
  // global variables and functions
  //
  var apdDataBase;

  //
  // Function: Read in nad init the apd database
  //
    function initDatabase(callback) {
     $.ajax({
          url: "https://data.austintexas.gov/resource/rkrg-9tez.json",
          type: "GET",
          data: {
            "$$app_token" : "jdmsP3hiF9ZYMZMlJTaiBOKly"
          }
      }).done(function(data) {
        apdDataBase = data;
        console.log('Success! Receive '+data.length+' records!');

        callback(true);
      }).fail(function() {

        callback(false);
      });
    }

  //
  // Function: Get data
  //
    function getDataByCategory (category, limit) {

      var incidentArray = [];  // to be returned to caller
      var dbLength = apdDataBase.length;
      limit = limit || dbLength;

      var crimes = getCrimeTypes(category);
      console.log(limit);

      if(crimes) {

        for(var i = dbLength-1; i > 0; i--) {

          if(crimes.indexOf(apdDataBase[i].crime_type) !== -1) {
            incidentArray.push(apdDataBase[i]);

            if(incidentArray.length === limit) {
              break;
            }
          }
        }

        return incidentArray;

      } else {

        return false;

      }
    }

  function getDataByKeyword (keyword, limit) {

      var incidentArray = [];  // to be returned to caller
      var dbLength = apdDataBase.length;
      limit = limit || dbLength;

      console.log(limit);

      for(var i = dbLength-1; i > 0; i--) {

        if(apdDataBase[i].crime_type.indexOf(keyword) !== -1) {
          incidentArray.push(apdDataBase[i]);

          if(incidentArray.length === limit) {
                break;
             }  
          }
        }
          return incidentArray;
      }
  



    function getCrimeTypes(category) {

      var list = getCategoryList();
      if(list.hasOwnProperty(category)) {
        return list[category];
      } else {
        return false;
      }

    }

    function getCategoryList() {

      return {
        violent: ["ASSAULT", "ASLT", "FORCED SODOMY", "KIDNAPPING", "RAPE", "MANSLAUGHTER", "MURDER"],
        property: ["BURGLARY", "BURG", "ROBBERY"],
        theft: ["THEFT"],
        accident: ["CRASH"],
        drugs: ["DRUG", "CONTROLLED", "MARIJUANA"]
      };
    }

    initDatabase(function(flag) {
      console.log(flag);
      var mySearchResults = getDataByKeyword ("KIDNAPPING", 3); // search for first 20 violent crimes
    });

  });
})(jQuery);
