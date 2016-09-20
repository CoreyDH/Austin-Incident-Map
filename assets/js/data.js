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


  // build a array containing search keywords

  if (constraints.keyword) {  // put a single keyword into the array
    search_list [0] = constraints.keyword;
  }
  else {  // concatenate crime category keywords into the array
    for (i=0; i<constraints.categories.length; i++) {
      category = constraints.categories [ i ];   
      search_list = search_list.concat(getCrimeTypes(category));
    }
  }

  // set the search constraints
  //   - if date range: pull all matching records in that date range.
  //   - if not date range: pull a limited number of records
  // the search starts at the last record in the array, the most recent incident.


  // default: not a date range; set search bounds to the index of 
  // record 0 in the database and the last record in the database
  dateRangeFlag = false;
  startPoint = apdDataBase.length - 1;
  endPoint = 0;
  recordsLimit = apdDataBase.limit;

  // on if: this is a date range search; call setSearchBounds to set  
  // the search bounds to the index of the first record in the from date
  // and the last record in the to date
  if (constraints.hasOwnProperty('dateRange')) {
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

    // if it is a date range search and more records are returned than the
    // user requested, then create an array with a even distribution of records
    // by incident date
    if (dateRangeFlag && incidentArray.length > constraints.limit) {
      incidentArray = createDistribution(incidentArray, constraints.limit);
    } 
    return incidentArray;

  } // function


  function createDistribution (array, limits) {
    var intervals;
    var returnedArray = new Array ();
  
    intervals = Math.floor (array.length / limits);

    for (i = 0; i < limits; i++ ) {
      returnedArray.push(array[intervals * i]);
    }

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

  // Categories search with date ranges
      var mySearchResults = getData({
        categories: ['violent', 'property'],
        dateRange: {
          from: '07-14-2016',
          to: '07-17-2016'
         },
          limit: 12
        }); 
      console.log (" ");
      console.log (" ");
      console.log ("violent/property, 7/14 to 7/17, 12 records");
      for (i=0;i<mySearchResults.length;i++){
      	  console.log (mySearchResults[i]);
      }
        debugger;


      // Categories search with date range of one day
      var mySearchResults = getData({
        categories: ['violent', 'property'],
        dateRange: {
          from: '06-14-2016',
          to: '06-14-2016'
         },
          limit: 8
        }); 
      console.log (" ");
      console.log (" ");
      console.log ("violent/property, 6/14 to 6/14, 8 records");
      for (i=0;i<mySearchResults.length;i++){
      	  console.log (mySearchResults[i]);
      }
        debugger;
        
        
   // Keyword search with date ranges
      var mySearchResults = getData({
        keyword: 'PIGEON',
        dateRange: {
          from: '02-6-2016',
          to: '08-1-2016'
         },
          limit: 20
        }); 
      console.log (" ");
      console.log (" ");
      console.log ("PIGEON keyword, 2/6 to 8/1, 20 records");
      for (i=0;i<mySearchResults.length;i++){
      	  console.log (mySearchResults[i]);
      }
        debugger;  
        
        
    // Keyword search with date ranges, requesting 5 of a lot of records
      var mySearchResults = getData({
        keyword: 'ASSAULT',
        dateRange: {
          from: '07-1-2016',
          to: '08-1-2016'
         },
          limit: 5
        }); 
      console.log (" ");
      console.log (" ");
      console.log ("ASSAULT keyword, 2/6 to 8/1, requesting 5 of a lot of records");
      for (i=0;i<mySearchResults.length;i++){
      	  console.log (mySearchResults[i]);
      }
        debugger;      
        
        

   // Categories search, no date range
      var mySearchResults = getData({
        categories: ['drugs', 'accident'],
          limit: 40
        }); 
 
      console.log ( " ");
      console.log (" " );
      console.log ("drugs/accident, no date range, 40 records");
      for (i=0;i<mySearchResults.length;i++){
      	  console.log (mySearchResults[i]);
      }
        debugger;     
        
    });

  });
})(jQuery);
