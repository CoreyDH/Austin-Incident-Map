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
  endPoint = apdDataBase.length - 1;
  startPoint = 0;
  recordsLimit = apdDataBase.limit;

  // on if: this is a date range search; call setSearchBounds to set  
  // the search bounds to the index of the first record in the from date
  // and the last record in the to date
  if (constraints.hasOwnProperty('dateRange')) {
      bounds = setSearchBounds(constraints.dateRange); 
      dateRangeFlag = true;
      startPoint = bounds.fromPoint;
      endPoint = bounds.toPoint;
      recordsLimit = apdDataBase.length;
  }
    
  for(var i = endPoint; i >= startPoint; i--) {
      var j = 0;
      while (j < search_list.length) {
        if(apdDataBase[i].crime_type.includes (search_list[j])) {           
          incidentArray.push(apdDataBase[i]);
          j = search_list.length; 
        }         
        else {
          j++;
        } //else
      } //while

      if(incidentArray.length === limit && !dateRangeFlag) {
        break;
      }
    } //for

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

    var topIndex;
    var bottomIndex;
    var midPoint;
    var midPointDate;
    var midPointMoment;
    var currentIndex;
    var currentIndexDate;
    var currentIndexMoment;
    var temp;

    boundsRecords = {fromPoint: 0, toPoint: 1};

    var fromMoment = moment (constraint.from).unix();
    var toMoment = moment (constraint.to).unix();

    // from date range
    // do a binary search to locate a record with the from date
    topIndex = apdDataBase.length - 1;
    bottomIndex = 0;
    midPointMoment = 0;
    while (fromMoment != midPointMoment) {
      midPoint = Math.round(bottomIndex + (topIndex - bottomIndex) / 2);
      temp = (apdDataBase [midPoint].date).split ("T");
      midPointDate = temp [ 0 ];
      midPointMoment = moment (midPointDate).unix();
         
      if (fromMoment < midPointMoment ) {
        topIndex = midPoint; 
      }
      else {
        bottomIndex = midPoint;    
      }
    } 

    // index down to the first record with the from date
    while ( fromMoment == midPointMoment) {
      midPoint--;
      temp = (apdDataBase [midPoint].date).split ("T");
      midPointDate = temp [ 0 ];
      midPointMoment = moment (midPointDate).unix();
    }
    midPoint++;   
    boundsRecords.fromPoint = midPoint;
   
    // to date range
    // do a binary search to locate a record with the to date
    topIndex = apdDataBase.length - 1;
    bottomIndex = midPoint;  // start with the fromPoint
    midPointMoment = 0;
    while (toMoment != midPointMoment) {
      midPoint = Math.round(bottomIndex + (topIndex - bottomIndex) / 2);
      temp = (apdDataBase [midPoint].date).split ("T");
      midPointDate = temp [ 0 ];
      midPointMoment = moment (midPointDate).unix();
         
      if (toMoment < midPointMoment ) {
        topIndex = midPoint; 
      }
      else {
        bottomIndex = midPoint;    
      }
    } 

 // index up to the last record with the to date
    while ( toMoment == midPointMoment) {
      midPoint++;
      temp = (apdDataBase [midPoint].date).split ("T");
      midPointDate = temp [ 0 ];
      midPointMoment = moment (midPointDate).unix();
    }
    midPoint--;
    boundsRecords.toPoint = midPoint;

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
      console.log ("ASSAULT keyword, 7/1 to 8/1, requesting 5 of a lot of records");
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
