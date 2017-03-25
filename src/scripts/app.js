const $ = window.$ = window.jQuery = require('jquery');
import 'slick-carousel';
import 'simplelightbox';
import 'remodal';

$('.toggleButton').click(function () {
  $($(this).data('target')).toggleClass('isOpen');
});

$('.testimonials__slider').slick();

$('.simplelightbox a').simpleLightbox();

VK.init({
  apiId: 5941738,
  onlyWidgets: true
});

VK.Widgets.Comments('vk_comments', {
  limit: 10,
  attach: '*'
});

$('.callbackForm').submit(function (e) {
  e.preventDefault();

  const form = $(this);

  $.ajax({
    type: 'POST',
    url: './contact.php',
    data: form.serialize()
  })
    .done(function () {
      setTimeout(function() {
        form.trigger('reset');
      }, 1000);
    });
});

$('.checkStatusForm').submit(function (e) {
  e.preventDefault();

  const form = $(this);
  const phone = $(this.elements.phone).val();
  const modal = $('[data-remodal-id=status]').remodal();

  // modal.open();

  $.ajax({
    type: 'GET',
    url: 'https://api.remonline.ru/order/',
    data: {
      token: '07856a52e0a4a8000b2b2061c8739df8f7265947',
      'client_phones[]': phone
    }
  })
    .done(function (response) {
      console.log(response);
    });
});
