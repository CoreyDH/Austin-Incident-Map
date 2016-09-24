var data = (function($) {

  //
  // global variables and functions
  //
  var apdDataBase;

  var defaults = {
  keyword: null,
  categories: ['violent', 'property', 'accident', 'theft'],
  dateRange : {
    from: "01-01-16",
    to: "12-31-16"
  }
};

  //
  // Function: Read in and init the apd database
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

        callback(findDateRange ());
      }).fail(function() {

        callback(false);
      });
    }
//
// find the first and last dates in the apd data, store them, and return them
//
function findDateRange () {
    var dateRange = new Array ();

    defaults.dateRange.from = apdDataBase [0].date.split ("T")[0];
    defaults.dateRange.to = apdDataBase [apdDataBase.length - 1].date.split ("T")[0];

    defaults.dateRange.from = moment(defaults.dateRange.from, 'YYYY-MM-DD').format('MM/DD/YYYY');
 //   defaults.dateRange.from = "01/01/2016";
    defaults.dateRange.to = moment(defaults.dateRange.to, 'YYYY-MM-DD').format('MM/DD/YYYY');
    return(defaults.dateRange);
  }

//
// getData:  the main routine called by the app
//

 var getData = function(constraints) {

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
    search_list [0] = constraints.keyword.toUpperCase();
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

//
// create a distribution of the incidents by date.  per the algorithm,
// push records to an array to return (returnedArray)
//
  function createDistribution (array, limits) {
    var intervals;
    var returnedArray = new Array ();
    intervals = Math.floor (array.length / limits);

    for (i = 0; i < limits; i++ ) {
      returnedArray.push(array[intervals * i]);
    }
    return(returnedArray);

  }

//
// if the user has chosen a date range, find the first and last records in that date range
//
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

    // midpoint currently points to a record with the from date;
    // index to the first record with the from date
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

    // midpoint currently points to a record with the to date;
    // index to the last record with the to date
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
        property: ["BURGLARY", "BURG", "MISCHIEF"],
        theft: ["THEFT", "ROBBERY"],
        accident: ["CRASH"],
        drugs: ["DRUG", "CONTROLLED", "MARIJUANA"]
      };
    }

    var getCategory = function(keyword) {
        var list = getCategoryList();
        var objectProperties = Object.keys(list);
        var property;
        keyword = keyword.toUpperCase();

        for (i = 0; i < objectProperties.length; i++) {
            property = objectProperties[i];
            if ($.inArray(keyword, list[property]) > -1) {
                console.log(property);
                return property;
            }
        }
        return false;
    };

   return {
      init: initDatabase,
      getData: getData,
      getCategory: getCategory
   };

})(jQuery);
