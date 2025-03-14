$(document).ready(function() {
  // Add smooth scrolling to section links (both in-page and from main navigation)
  $('.section-navigation a, a[href^="/#"]').on('click', function(e) {
    e.preventDefault();
    
    var targetId = this.getAttribute('href').replace('/', '');
    var target = $(targetId);
    
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
        
        // Also update the main navigation active status
        var mainNavLink = $('nav.greedy-nav a[href="/#' + $(this).attr('id') + '"]');
        $('nav.greedy-nav a').removeClass('active');
        mainNavLink.addClass('active');
      } else {
        currLink.removeClass('active');
      }
    });
  });
  
  // Initial check for active section
  $(window).trigger('scroll');
});
