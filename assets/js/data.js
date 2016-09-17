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
            "$$app_token" : "jdmsP3hiF9ZYMZMlJTaiBOKly", "$order" : "date"
          }
      }).done(function(data) {
        apdDataBase = data;

        var i;
        for (i = 95500; i >= 0; i = i - 100) {
          console.log ( "i = ", i, "date = ", apdDataBase [i].date);
        }

        debugger;

        console.log('Success! Receive '+data.length+' records!');

        callback(true);
      }).fail(function() {

        callback(false);
      });
    }


{
  keyword: 'test',
  categories: ['violent', 'theft'],
  dateRange: {
    from: '09/14/2016',
    to: '09/17/2016'
  },
  limit: 10
}

function getData(constraints) {

  // merge defaults with constraints
  



}
  //
  // Function: Get data
  //
    function getDataByCategory (constraints, limit) {

      var incidentArray = [];  // to be returned to caller
      var dbLength = apdDataBase.length;
      limit = limit || dbLength;
      var crimes = [];

      for(var n = 0; n < constraints.categories.length; n++) {
        crimes.push(getCrimeTypes[constraints.categories[n]]);
      }
      console.log(limit);
    
      if(crimes) {

        for(var i = dbLength-1; i > 0; i--) {
          var j = 0;
          while (j < crimes.length) {

            if(apdDataBase[i].crime_type.includes (crimes[j])) {           
               incidentArray.push(apdDataBase[i]);
               j = crimes.length;
            } //if
            else {
              j++;
            } //else
          } // while


          if(incidentArray.length === limit) {
            break;
            }
          } // for
        
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

        if(apdDataBase[i].crime_type.includes(keyword)) {
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
      
      var mySearchResults = getDataByCategory ("drugs", 20); // search for first 20 crimes

      var i;
      console.log ("category search");
      for (i=0; i<mySearchResults.length;i++)
        console.log (mySearchResults[i]);

      var mySearchResults2 = getDataByKeyword ("PIGEON", 20); // search for type
      console.log ( "keyword search");
      for (i=0; i<mySearchResults2.length;i++)
        console.log (mySearchResults2[i]);


      debugger;
    });

  });
})(jQuery);
