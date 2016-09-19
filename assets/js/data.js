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

        console.log('Success! Receive '+data.length+' records!');

        callback(true);
      }).fail(function() {

        callback(false);
      });
    }


// {
  // keyword: 'test',
  // categories: ['violent', 'theft'],
  // dateRange: {
  //   from: '09/14/2016',
  //   to: '09/17/2016'
  // },
  // limit: 10
// }

// assault on from range to range = 3000 / 100 = 30

// for loop over 3000 records  every 30th return to array, send that data

// 3000 / 100 = 30


// 2734 / 250 = Math.floor()

var defaults = {
  keyword: null,
  categories: ['violent', 'property', 'accident', 'theft'],
  dateRange : {
    to: "12-31-16",
    from: "01-010-16" 
  }
};

function getData(constraints) {

  var incidentArray = [];  // to be returned to caller
  var search_list = new Array ();
  var dbLength = apdDataBase.length;
  var dateRangeFlag;
  var startPoint;
  var endPoint;
  var recordsLimit;
  var bounds;
      
  var limit = constraints.limit || dbLength;
  var actionable_constraints = $.extend( defaults, constraints );


  // build a search list array

  if (constraints.keyword) {  // put the keyword into the search list array
    search_list [0] = constraints.keyword;
  }
  else {  // concatenate crime categories into the search list array
    for (i=0; i<constraints.categories.length; i++) {
      category = constraints.categories [ i ];   
      search_list = search_list.concat(getCrimeTypes(category));
    }
  }

  // set the search constraints
  //   - if the search contraints are a date range, pull all matching records in that date range.
  //   - if not a date range, pull a limited number of records
  // the search starts at the last record in the array, the most recent incident.


  // set parameters to not a date range
  dateRangeFlag = false;
  startPoint = apdDataBase.length - 1;
  endPoint = 0;
  recordsLimit = apdDataBase.limit;

  // set parameters to date range
  if (constraints.dateRange.from) {
      bounds = setSearchBounds(constraints.dateRange); 
      dateRangeFlag = true;
      startPoint = bounds.startPoint;
      endPoint = bounds.endPoint;
      recordsLimit = apdDataBase.length;
  }
    
  for(var i = startPoint; i >= endPoint; i--) {
      var j = 0;
      while (j < search_list.length) {
        if(apdDataBase[i].crime_type.includes (search_list[j])) {           
          incidentArray.push(apdDataBase[i]);
          j = search_list.length; 
        }         
        else {
          j++;
        } //else
      } // while

      if(incidentArray.length === limit && !dateRangeFlag) {
        break;
      }
    } // for

    
        
    if (dateRangeFlag && incidentArray.length > constraints.limit) {
      debugger;
      incidentArray = createAssortment(incidentArray, constraints.limit);
    }
    return incidentArray;

  } // function


  function createAssortment (array, limits) {
    var intervals;
    var remainder;
    var returnedArray = new Array ();
  

    intervals = Math.floor (array.length / limits);
    remainder = array.length % limits;

    for (i = 0; i < limits; i++ ) {
      returnedArray.push(array[intervals * i]);
    }

    debugger;

    while (remainder) {
      i--;
      returnedArray.push(array[i]);
      remainder--;
    }

    debugger;

    return(returnedArray);

  }


  function setSearchBounds (constraint) {

    var topIndex = apdDataBase.length - 1;
    var bottomIndex = 0;
    var midPoint;
    var midPointDate;
    var midPointMoment;
    var currentIndex;
    var currentIndexDate;
    var currentIndexMoment;
    var temp;

    boundsRecords = {startPoint: 0, endPoint: 1};

    var fromMoment = moment (constraint.from).unix();
    var toMoment = moment (constraint.to).unix();


  
    
    // from date range

    // do a binary search to narrow within 100 records
    while ( (topIndex - bottomIndex) > 100) {  
      midPoint = Math.round(bottomIndex + (topIndex - bottomIndex) / 2);
      temp = (apdDataBase [midPoint].date).split ("T");
      midPointDate = temp [ 0 ];
      midPointMoment = moment (midPointDate).unix();
      
      if (fromMoment == midPointMoment) {
        break;
      }     
      if (fromMoment < midPointMoment ) {
        topIndex = midPoint; 
      }
      else {
        bottomIndex = midPoint;    
      }
    } 

    counter = 0;
    if (midPointMoment > fromMoment) {
      counter = (-1);
    } else if (midPointMoment < fromMoment) {
      counter = (+1);
    }

    while ( fromMoment != midPointMoment) {
      midPoint += counter;
      temp = (apdDataBase [midPoint].date).split ("T");
      midPointDate = temp [ 0 ];
      midPointMoment = moment (midPointDate).unix();
    }

    // narrow down the first record in the from date range  

    while (fromMoment == midPointMoment) {
      temp = (apdDataBase [midPoint].date).split ("T");
      midPointDate = temp [ 0 ];

      console.log ( midPointDate = temp [ 0 ], " ", midPoint);
      midPointMoment = moment (midPointDate).unix();
      midPoint--;
    }
      midPoint = midPoint + 2;

      boundsRecords.endPoint = midPoint;
   



    // to date range

    // do a binary search to narrow within 100 records
    while ( (topIndex - bottomIndex) > 100) {  
      midPoint = Math.round(bottomIndex + (topIndex - bottomIndex) / 2);
      temp = (apdDataBase [midPoint].date).split ("T");
      midPointDate = temp [ 0 ];
      midPointMoment = moment (midPointDate).unix();
      
      if (toMoment == midPointMoment) {
        break;
      }     
      if (toMoment < midPointMoment ) {
        topIndex = midPoint; 
      }
      else {
        bottomIndex = midPoint;    
      }
    } 

    counter = 0;
    if (midPointMoment > toMoment) {
      counter = (-1);
    } else if (midPointMoment < toMoment) {
      counter = (+1);
    }

    while ( toMoment != midPointMoment) {
      midPoint += counter;
      temp = (apdDataBase [midPoint].date).split ("T");
      midPointDate = temp [ 0 ];
      midPointMoment = moment (midPointDate).unix();
    }

    // narrow down the last record in the from date range  

    while (toMoment == midPointMoment) {
      temp = (apdDataBase [midPoint].date).split ("T");
      midPointDate = temp [ 0 ];

      console.log ( midPointDate = temp [ 0 ], " ", midPoint);
      midPointMoment = moment (midPointDate).unix();
      midPoint++;
    }
      midPoint = midPoint - 2;

      boundsRecords.startPoint = midPoint;

      return (boundsRecords);

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

  //
  //  TEST CASES
  //

      // test categories search with date ranges

      var mySearchResults = getData({
        categories: ['violent', 'property'],
        dateRange: {
          from: '07-14-2016',
          to: '07-17-2016'
         },
          limit: 10
        }); 
     

        debugger;


      // test keyword search

      mySearchResults = getData({
        keyword: ['DROP'],
        dateRange: {
          from: '06-14-2016',
          to: '06-17-2016'
         },
          limit: 50
        }); 

      
 //     var mySearchResults = getDataByCategory ("drugs", 20); // search for first 20 crimes

 //     var i;
 //     console.log ("category search");
 //     for (i=0; i<mySearchResults.length;i++)
 //       console.log (mySearchResults[i]);

 //     var mySearchResults2 = getDataByKeyword ("PIGEON", 20); // search for type
 //       console.log (mySearchResults2[i]);
 //
 //     debugger;
    });

  });
})(jQuery);
