
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', {
    scope: '/'
  })
    .then(
      registration => {
    console.log("Service Worker registration completed ...");
}
)
}

(function() {
  'use strict';

  $('#button').click(function(){
    var message = $('#message').val();
    // Generate qrcode.
    if (message !== undefined) {
      $('#display').html('');
      new QRCode(document.getElementById("display"), message);
      var qrcode = $('#display').html();
      localStorage.setItem("message", qrcode);
    }
  });
})();
