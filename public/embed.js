/**
 * Publisher embed alias — loads the Tadbuy ad widget.
 * @see public/tadbuy.js
 */
(function () {
  var s = document.createElement('script');
  s.src = 'https://tadbuy.giveabit.io/tadbuy.js';
  s.async = true;
  document.head.appendChild(s);
})();