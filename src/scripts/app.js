const $ = window.$ = window.jQuery = require('jquery');
import 'slick-carousel';
import 'simplelightbox';

$('.toggleButton').click(function () {
  $($(this).data('target')).toggleClass('isOpen');
});

$('.testimonials__slider').slick();

$('.simplelightbox a').simpleLightbox();
