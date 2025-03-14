$(document).ready(function() {
  // Add smooth scrolling to section links
  $('.section-navigation a').on('click', function(e) {
    e.preventDefault();
    
    var target = $(this.getAttribute('href'));
    
    if (target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top - 70
      }, 500);
    }
  });
  
  // Highlight active section in nav
  $(window).on('scroll', function() {
    var scrollPos = $(window).scrollTop();
    
    $('.section').each(function() {
      var currLink = $('.section-navigation a[href="#' + $(this).attr('id') + '"]');
      var refElement = $(this);
      
      if (refElement.position().top - 100 <= scrollPos && 
          refElement.position().top + refElement.height() > scrollPos) {
        $('.section-navigation a').removeClass('active');
        currLink.addClass('active');
      } else {
        currLink.removeClass('active');
      }
    });
  });
  
  // Initial check for active section
  $(window).trigger('scroll');
});
