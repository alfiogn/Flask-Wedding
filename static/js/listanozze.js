$(function(){
  $.ajax({
    url: '/makeListaNozze',
    type: 'POST',
    contentType: "application/json",
    dataType: 'json',
    success: function(response){
      var lista = JSON.parse(response);
      $(lista).each(function(){
        addGift(this);
      });
    },
    error: function(error){
      console.log(error);
    },
    complete: function() {
      makeGiftWindow();
      createWall();
    }
  })
})

var elements = `
<div class='gift-cell' style='width:{width}px; height: {height}px; background-image: url(/static/images/listanozze/{imgfilename})'>
  <div class='gift-window'>
    <div class='container-fluid gift-content'>
      <span class='gift-close'>&times;</span>
      <p class='gift-text'><strong>{Nome oggetto}</strong></p>
      <p class='gift-text'>{Descrizione}</p>
      <p class='gift-text'>{Costo}€</p>
        <br>
      <div class="text-left">
      <p>Se vuoi contribuire a questo regalo puoi fare un bonifico a:</p>
      <p><strong>Intestatario:</strong><br> Benedetta Rossi
         <br><strong>Causale:</strong><br> regalo di nozze Giorgio e Benni - LaTuaFirma
         <br><strong>IBAN:</strong> <br><a class="dark-link copy-link">IT61M0538737381000042042522</a></p>
      </div>
      <a class="dark-link" target="_blank" href="#">Fatto?</a>
      <form id="send-giftmsg"><div class="form-group">
        <textarea class="form-control" id="Message" placeholder="Lasciaci un messaggio. Non dimenticare nome del regalo e firma." rows="3"></textarea>
      </div></form>
      <div class="position-relative">
        <button class='btn body-btn msg-btn' onclick="sendGiftMessage()" ontouchstart="$(this).trigger('click')">Invia il messaggio! <i class="fas fa-paper-plane"></i></button>
      </div>
    </div>
  </div>
  <button class='btn body-btn gift-btn' ontouchstart="$(this).trigger('click')"><i class="fa fa-gift" aria-hidden="true"></i> Regala!</button>
</div>
`;

var hfactor = 2.5, wfactor = 1.5;
var w = 250, h = 250;
var counter = 0;

function addGift(regalo) {
  var imgname   = regalo["File"];
  var giftname  = regalo["Nome"];
  var giftdescr = regalo["Descrizione"];
  var giftcost  = regalo["Costo"];
  counter += 1;
  htmlcode = elements.replace(/\{height\}/g, h).replace(/\{windoheight\}/g, h*hfactor).replace(/\{width\}/g, w)
                     .replace(/\{windowidth\}/g, w*wfactor).replaceAll("{imgfilename}", imgname)
                     .replaceAll("{Nome oggetto}", giftname).replaceAll("{Descrizione}", giftdescr)
                     .replaceAll("{Costo}", giftcost).replaceAll("{index}", counter);
  $("#freewall").append(htmlcode);
};


function makeGiftWindow() {
  var listgifts = document.querySelectorAll(".gift-cell");
  var modalName = "gift-window";
  var btnName = "gift-btn";
  var closeName = "gift-close";
  var innerbtnName = "msg-btn";

  limitItem = listgifts.length;
  console.log("number of gifts", limitItem);
  for (var i = 0; i < limitItem; ++i) {
    var n = (i+1).toString();
    
    // Get the modal
    var modal = document.getElementsByClassName(modalName)[i]; //.concat(n));

    // Get the button that opens the modal
    var btn = document.getElementsByClassName(btnName)[i];//.concat(n));
    var innerbtn = document.getElementsByClassName(innerbtnName)[i];//.concat(n));

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName(closeName)[i];

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
      modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
      if (event.target == innerbtn) {
        modal.style.display = "none";
        // smoothly scroll
        var el = document.getElementById("thanks");
        $('html, body').animate({
          scrollTop: (el.offsetTop - 98)
        }, 1000, "easeInOutExpo");
      }
    }
  }
};

function createWall() {
  var wall = new Freewall("#freewall");
  wall.reset({
    selector: '.gift-cell',
    animate: true,
    cellW: w,
    cellH: h,
    onResize: function() {
      wall.refresh();
    },
    onScroll: function() {
      wall.fitWidth();
    },
    onLoad: function() {
      wall.refresh();
    }
  });
  wall.fitWidth();

  $(window).on('scroll', function() {
    wall.fitWidth();
  });
};


function sendGiftMessage() {
  var button = event.target;
  var form = button.parentElement.parentElement;
  var textbox = form.querySelector('#Message');
  $.ajax({
    type: "POST",
    url: "/send_message",
    data: {text:textbox.value},
    success: function(res){
        console.log(res);
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
};

