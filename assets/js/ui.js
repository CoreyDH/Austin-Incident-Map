(function($) {
  $(function() {

    $('.menu-title').on('click', function(event) {

      $('.menu-wrapper').toggleClass('closed');
      $('#map').toggleClass('active');

    });

  });
})(jQuery);
