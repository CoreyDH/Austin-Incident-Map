(function($) {
  $(function() {

    $('.menu-title').on('click', function(event) {

      $('.menu-wrapper').toggleClass('closed');
      $('#map').toggleClass('active');

    });

    $('#category-filters > li').on('click', function(event) {
      $(this).toggleClass('selected');
      $(this).find('input[type="checkbox"]').attr('checked');
    });

  });
})(jQuery);
