// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()

//function checkAndSendRSVP() {
//  $('#submitRSVP').addEventListener("click", sendRsvp);
//  if ('ontouchstart' in window) {
//      menu.addEventListener("touchstart", function() {
//          var touchHndl = function() {
//              //call the clickHandler actually
//              sendRsvp();
//              //remove the touchend haldler after perform
//              this.removeEventListener(touchHndl)
//          }
//          //attach a handler for touch end when you are in touchstart event
//          this.addEventListener(touchHndl);
//      });
//  }
//}


//$('#submitRSVP').on('click touchstart', function (event){
//})

// Fetch all the forms we want to apply custom Bootstrap validation styles to
function sendRsvp() {
  var form = document.querySelectorAll('#formRSVP')[0]; //.needs-validation')

  if ( form.checkValidity() ) {

    event.preventDefault();
    var name = $('#Name').val();
    var email = $('#Email').val();
    var phone = $('#Phone').val();
    var address = $('#Address').val();
    var adults = $('#Adults').val();
    var kids = $('#Kids').val();
    var babies = $('#Babies').val();
    var notes = $('#Notes').val();

    $.ajax({
        type: "POST",
        url: "/rsvp_email",
        data: {name:name, email:email, phone:phone,
          address:address, adults:adults,
          kids:kids, babies:babies, notes:notes},
        success: function(res){
            console.log(res);
            window.location = '/thanks';
        },
        error: function(xhr, status, error) {
          var err = "(" + xhr.responseText + ")";
          console.log(err.Message);
          console.log('xhr: ');
          console.log(xhr);
          console.log('status: ' + status);
          console.log('error: ' + error);
        }
    });

    //window.location = '/thanks';

  }
};





