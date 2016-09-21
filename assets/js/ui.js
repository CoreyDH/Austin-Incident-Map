(function($, data) {
  $(function() {

    var ui = {
      initUI: function() {
        this.loadDatepicker();
        this.loadAnimations();
      },
      initListeners: function() {

        $('#reset').on('click', function() {
          $('.selected').removeClass('selected').find('input[type="checkbox"]').prop('checked', false);
        });

        $('.search').on('click', function() {

          var searchObj = search.createObject($(this).attr('data-search'));

          console.log(searchObj);
          if(typeof searchObj === 'object') {
            console.log(data.getData(searchObj));
          }


        });

        var search = {
          createObject: function(type) {

            this.limit = this.getLimit();
            this.date = this.getDate();

            if(type === 'category') {
              this.categories = this.getCategories();
            }

            if(type === 'keyword') {
              this.keyword = this.getKeyword();
            }

            return this.validate();

          },
          validate: function() {

            var obj = {};
            var errors = [];

            if(this.date) {
              obj.date = this.date;
            } else {
              errors.push('Please enter a date range.');
            }

            if(this.categories) {
              obj.categories = this.categories;
            }

            if(this.keyword) {
              obj.keyword = this.keyword;
            }

            if(!$.isEmptyObject(obj)) {
              obj.limit = this.limit;

              if(obj.keyword || obj.categories) {
                return obj;
              } else {
                errors.push('Please search by category or keyword.');
              }
            }

            return errors;

          },
          getLimit: function() {
            return parseInt($('#limit').val());
          },
          getDate: function() {
            var fromDate = $('#date-from').val().trim() || false;
            var toDate = $('#date-to').val().trim() || false;

            if(fromDate && toDate) {
              return {
                from: fromDate,
                to: toDate
              };
            } else {
              return false;
            }

          },
          getCategories: function() {
            var categories = [];

            $('.selected').each(function() {
              categories.push($(this).find('input[type="checkbox"]').val());
            });

            return categories.length > 0 ? categories : false;
          },
          getKeyword: function() {
            return $('#keyword').val().trim() || false;
          }
        };

      },
      loadDatepicker: function() {
        var dateFormat = "yy-mm-dd",
          from = $("#date-from")
            .datepicker({
              defaultDate: "+1w",
              changeMonth: true,
              numberOfMonths: 1,
              maxDate: 0
            })
            .on( "change", function() {
              to.datepicker("option", "minDate", getDate(this));
            }),
          to = $("#date-to").datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,
            maxDate: 0
          })
          .on( "change", function() {
            from.datepicker( "option", "maxDate", getDate(this));
          });

        function getDate(element) {
          var date;
          try {
            date = $.datepicker.parseDate(dateFormat, element.value);
          } catch( error ) {
            date = null;
          }

          return date;
        }
      },
    loadAnimations: function() {

      // Menu slide
      $('.navbar-toggle').on('click', function(event) {
        $('.menu-wrapper').toggleClass('open');
      });

      // Checkbox
      $('#category-filters > li').on('click', function(event) {

        $this = $(this);
        $this.toggleClass('selected');
        $this.find('input[type="checkbox"]').attr('checked');

        if(!$(event.target).is('input')) {
          var $checkbox = $this.find('input[type="checkbox"]');
          $checkbox.prop('checked', !$checkbox.prop('checked'));
        }

      });

      // Collapse Icons
      $('.collapse')
        .on('show.bs.collapse', function () {
           $(this).parent().find('.glyphicon').removeClass('glyphicon-plus').addClass('glyphicon-minus');
        })
        .on('hide.bs.collapse', function () {
           $(this).parent().find('.glyphicon').removeClass('glyphicon-minus').addClass('glyphicon-plus');
        });
    }
  };


  data.init(function(flag) {
    console.log(flag);
    if(flag) {

           var mySearchResults = data.getData({
             categories: ['violent', 'property'],
             dateRange: {
               from: '07-14-2016',
               to: '07-17-2016'
              },
               limit: 12
             });
           console.log(mySearchResults);

      ui.initListeners();
    }
  });

  ui.initUI();



  });
})(jQuery, data);
