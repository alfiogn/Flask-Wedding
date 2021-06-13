$(function(){
  $.ajax({
    url: '/makePhotoGallery',
    type: 'POST',
    contentType: "application/json",
    dataType: 'json',
    success: function(response){
      var lista = JSON.parse(response);
      $(lista).each(function(){
        addPhoto(this);
      });
    },
    error: function(error){
      console.log(error);
    },
    complete: function() {
      makePhotoOpening();
      createWall();
    }
  })
})

var temp = "<div class='brick' style='width:{width}px; height:{height}px'><img class='galleryphoto' src='/static/images/photogallery/{imgfilename}' width='100%' loading='lazy'></div>";
var w = 1, h = 1;
var factor = 30;

var counter = 0;

function addPhoto(photo) {
	w = 10.0 + 1.0*Math.random() << 0;
  var imgname   = photo["File"];
  var weff = photo["W"];
  var heff = photo["H"];
  h = w * heff/weff;

  counter += 1;
	htmlcode = temp.replaceAll(/\{width\}/g, w*factor).replaceAll(/\{height\}/g, h*factor)
                 .replaceAll("{imgfilename}", imgname).replaceAll("{index}", counter + 1);
  $("#freewall").append(htmlcode);
}


function makePhotoOpening() {
  const root = document.querySelector("body, html");
  const container = document.querySelector('.free-wall');
  const galleryimages = document.querySelectorAll(".brick");
  const l = galleryimages.length;

  for(var i = 0; i < l; i++) {
    galleryimages[i].addEventListener("click", function(i) {
      var currentBrick = this;
      var currentImg = currentBrick.querySelector("img");
      const parentItem = currentBrick.parentElement, screenItem = document.createElement('div');
      screenItem.id = "gg-screen";
      container.prepend(screenItem);
      if (parentItem.hasAttribute('data-theme')) screenItem.setAttribute("data-theme", "dark");
      var route = currentImg.src;
      root.style.overflow = 'hidden';
      screenItem.innerHTML = '<div class="gg-image"></div><div class="gg-close gg-btn"><i class="fas fa-times"></i></div><div class="gg-next gg-btn"><i class="fas fa-arrow-right"></i></div><div class="gg-prev gg-btn"><i class="fas fa-arrow-left"></i></div>';
      const first = galleryimages[0].querySelector("img").src, last = galleryimages[l-1].querySelector("img").src;
      const imgItem = document.querySelector(".gg-image"), prevBtn = document.querySelector(".gg-prev"), nextBtn = document.querySelector(".gg-next"), close = document.querySelector(".gg-close");
      imgItem.innerHTML = '<img src="' + route + '">';

      if (l > 1) {
        if (route == first) {
          prevBtn.hidden = true;
          var prevBrick = false;
          var nextBrick = currentBrick.nextElementSibling;
          var prevImg = false;
          var nextImg = nextBrick.querySelector("img");
        }
        else if (route == last) {
          nextBtn.hidden = true;
          var nextBrick = false;
          var prevBrick = currentBrick.previousElementSibling;
          var nextImg = false;
          var prevImg = prevBrick.querySelector("img");
        }
        else {
          var prevBrick = currentBrick.previousElementSibling;
          var prevImg = prevBrick.querySelector("img");
          var nextBrick = currentBrick.nextElementSibling;
          var nextImg = nextBrick.querySelector("img");
        }
      }
      else {
        prevBtn.hidden = true;
        nextBtn.hidden = true;
      }

      screenItem.addEventListener("click", function(e) {
        if (e.target == this || e.target == close) hide();
      });

      root.addEventListener("keydown", function(e) {
        if (e.keyCode == 37 || e.keyCode == 38) prev();
        if (e.keyCode == 39 || e.keyCode == 40) next();
        if (e.keyCode == 27 ) hide();
      });

      prevBtn.addEventListener("click", prev);
      nextBtn.addEventListener("click", next);

      function prev() {
        prevBrick = currentBrick.previousElementSibling;
        prevImg = prevBrick.querySelector("img");
        imgItem.innerHTML = '<img src="' + prevImg.src + '">';
        currentBrick = currentBrick.previousElementSibling;
        currentImg = currentBrick.querySelector("img");
        var mainImg = document.querySelector(".gg-image > img").src;
        nextBtn.hidden = false;
        prevBtn.hidden = mainImg === first;
      };

      function next() {
        nextBrick = currentBrick.nextElementSibling;
        nextImg = nextBrick.querySelector("img");
        imgItem.innerHTML = '<img src="' + nextImg.src + '">';
        currentBrick = currentBrick.nextElementSibling;
        currentImg = currentBrick.querySelector("img");
        var mainImg = document.querySelector(".gg-image > img").src;
        nextBtn.hidden = mainImg === last;
        prevBtn.hidden = false;
      };

      function hide() {
        root.style.overflow = 'auto';
        screenItem.remove();
      };
    });
  }

  function gridGallery (options) {
    if (options.selector) selector = document.querySelector(options.selector);
    if (options.darkMode) selector.setAttribute("data-theme", "dark");
    if (options.layout == "horizontal" || options.layout == "square") selector.setAttribute("data-layout", options.layout);
    if (options.gaplength) selector.style.setProperty('--gap-length', options.gaplength + 'px');
    if (options.rowHeight) selector.style.setProperty('--row-height', options.rowHeight + 'px');
    if (options.columnWidth) selector.style.setProperty('--column-width', options.columnWidth + 'px');
  }

};

function createWall() {
  var wall = new Freewall("#freewall");
  wall.reset({
    selector: '.brick',
    animate: true,
    cellW: 150,
    cellH: 'auto',
    onScroll: function() {
      wall.fitWidth();
    },
    onLoad: function() {
      wall.fitWidth();
    },
    onResize: function() {
      wall.fitWidth();
    }
  });


  $(window).on('scroll', function() {
    wall.fitWidth();
  });
}
