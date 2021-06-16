var copyLinks = document.querySelectorAll('.copy-link')

//Loop through all elements and attaching event listener
copyLinks.forEach(el => {
  el.addEventListener('click', copyText)
  el.addEventListener('touchstart', copyText)
})

// function for selecting the text of an element based on the event.target (supporting IE)
function selectText() {
    var element = event.target
    var range;
    if (document.selection) {
        // IE
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        range = document.createRange();
        range.selectNode(element);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
}

// function for copying selected text in clipboard
function copyText() {
  selectText();
  //$('body').append('<div id="alert">testo copiato</div>');
  //$('#alert').fadeOut('slow');
  document.execCommand("copy");
}

