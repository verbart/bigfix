import $ from 'jquery';
import 'slick-carousel';

$('.toggleButton').click(function () {
  $($(this).data('target')).toggleClass('isOpen');
});

$('.testimonials__slider').slick();
