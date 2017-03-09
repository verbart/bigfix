import $ from 'jquery';

$('.toggleButton').click(function () {
  $($(this).data('target')).toggleClass('isOpen');
});
