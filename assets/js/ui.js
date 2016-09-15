(function($) {
  $(function() {

    $('.menu-title').on('click', function(event) {

      $('.menu-wrapper').toggleClass('active');
      $('#map').toggleClass('active');

    });

  });
})(jQuery);
