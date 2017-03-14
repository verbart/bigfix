const $ = window.$ = window.jQuery = require('jquery');
import 'slick-carousel';
import 'simplelightbox';
import 'remodal';

$('.toggleButton').click(function () {
  $($(this).data('target')).toggleClass('isOpen');
});

$('.testimonials__slider').slick();

$('.simplelightbox a').simpleLightbox();
