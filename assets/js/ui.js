(function($) {
  $(function() {

    // $(".nano").nanoScroller();

    $('.menu-title, .navbar-toggle').on('click', function(event) {

      $('.menu-wrapper').toggleClass('closed');

    });

    $('.menu-title').on('click', function(event) {

      $('.menu-wrapper').toggleClass('closed');
      $('#map').toggleClass('active');

    });

    $('#category-filters > li').on('click', function(event) {
      $(this).toggleClass('selected');
      $(this).find('input[type="checkbox"]').attr('checked');
      var checkbox = $(this).find('input[type="checkbox"]');

      if(!$(event.target).is('input')) {
        checkbox.prop('checked', !checkbox.prop('checked'));
      }

    });

    var dateFormat = "mm/dd/yy",
      from = $( "#date-from" )
        .datepicker({
          defaultDate: "+1w",
          changeMonth: true,
          numberOfMonths: 1,
          maxDate: 0
        })
        .on( "change", function() {
          to.datepicker( "option", "minDate", getDate( this ) );
        }),
      to = $( "#date-to" ).datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
        maxDate: 0
      })
      .on( "change", function() {
        from.datepicker( "option", "maxDate", getDate( this ) );
      });

    function getDate( element ) {
      var date;
      try {
        date = $.datepicker.parseDate( dateFormat, element.value );
      } catch( error ) {
        date = null;
      }

      return date;
    }

  });
})(jQuery);
