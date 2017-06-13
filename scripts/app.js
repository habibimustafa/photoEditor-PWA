(function() {
  'use strict';

  var imgTo = {};

  imgTo.gray = function(imgData){
    for(var i=0; i < imgData.data.length; i +=4){
      var gr = imgData.data[i] * 0.299 + imgData.data[i+1] * 0.587 + imgData.data[i+2] * 0.114;
      if(gr < 0) gr = 0;
      if(gr > 255) gr = 255;
      imgData.data[i] = gr;
      imgData.data[i+1] = gr;
      imgData.data[i+2] = gr;
    }
    return {imgData, title: "Citra Keabuan"};
  }

  imgTo.bin = function(imgData){
    for(var i=0; i < imgData.data.length; i +=4){
			var gr = (imgData.data[i] + imgData.data[i+1] + imgData.data[i+2]) / 3;
			if(gr <= 128) gr = 0;
			if(gr > 128) gr = 255;
			imgData.data[i] = gr;
			imgData.data[i+1] = gr;
			imgData.data[i+2] = gr;
		}
    return {imgData, title: "Citra Biner"};
  }

  imgTo.inv = function(imgData){
    for(var i=0; i < imgData.data.length; i +=4){
			imgData.data[i] = 255 - imgData.data[i] | 0;
			imgData.data[i+1] = 255 - imgData.data[i+1] | 0;
			imgData.data[i+2] = 255 - imgData.data[i+2] | 0;
		}
    return {imgData, title: "Citra Inversi"};
  }

  imgTo.sepia = function(imgData){
    for(var i=0; i < imgData.data.length; i +=4){
      var red = imgData.data[i];
      var green = imgData.data[i+1];
      var blue = imgData.data[i+2];

      red = (red * 0.393) + (green * 0.769) + (blue * 0.189);
      green = (red * 0.349) + (green * 0.686) + (blue * 0.168);
      blue = (red * 0.272) + (green * 0.534) + (blue * 0.131);

      imgData.data[i] = (red < 255) ? red : 255;
      imgData.data[i+1] = (green < 255) ? green : 255;
      imgData.data[i+2] = (blue < 255) ? blue : 255;
		}
    return {imgData, title: "Citra Sepia"};
  }

  imgTo.solar = function(imgData){
		for(var i=0; i < imgData.data.length; i +=4){
      var red   = imgData.data[i];
      var green = imgData.data[i+1];
      var blue  = imgData.data[i+2];

      imgData.data[i]   = red > 127 ? 255 - red : red;
      imgData.data[i+1] = green > 127 ? 255 - green : green;
      imgData.data[i+2] = blue > 127 ? 255 - blue : blue;
		}
    return {imgData, title: "Citra Solarize"};
  }

  var app = {
    isLoading : true,
    spinner   : document.querySelector('.loader'),
    container : document.querySelector('.main'),
    card      : document.querySelector('.cardTemplate'),
    btnAdd    : document.getElementById('butAdd'),
    btnRefresh: document.getElementById('butRefresh'),
    imgManip  : document.getElementById('imgManipulation'),
    imgTitle  : document.querySelector('.imgtitle span'),
    imgFile   : document.getElementById("imgFile"),
    canvas    : document.getElementById("kanvas"),
		myImg     : new Image()
  };

  app.ctx = app.canvas.getContext("2d");

  app.btnAdd.addEventListener('click', function() {
    app.imgFile.click();
  })

  app.btnRefresh.addEventListener('click', function() {
    app.canvas.setAttribute("width", app.myImg.width);
		app.canvas.setAttribute("height", app.myImg.height);
		app.ctx.drawImage(app.myImg, 0, 0);
		app.imgTitle.textContent = "Citra Asli";
    app.imgManip.selectedIndex = -1;
  })

  app.imgFile.addEventListener('change', function() {
    app.readURL(this);
  })

  app.imgManip.addEventListener('change', function() {
    if(this.value){
      app.ctx.drawImage(app.myImg, 0, 0);
      var conv = imgTo[this.value](app.ctx.getImageData(0, 0, app.canvas.width, app.canvas.height));
      app.ctx.putImageData(conv.imgData, 0, 0);
      app.imgTitle.textContent = conv.title;
    }
    else app.btnRefresh.click();
  })

  app.readURL = function(input){
		if(input.files && input.files[0]){
			var reader =  new FileReader();
			reader.onload = function(e){
				app.myImg.setAttribute("src", e.target.result);
			}
			reader.readAsDataURL(input.files[0]);
		}
	}

  app.myImg.onload = function(){
    app.canvas.setAttribute("width", app.myImg.width);
		app.canvas.setAttribute("height", app.myImg.height);
		app.ctx.drawImage(app.myImg, 0, 0);
		app.imgTitle.textContent = "Citra Asli";
    app.imgManip.selectedIndex = -1;
    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }
  }

  app.init = function() {
    app.myImg.setAttribute('src', 'images/heroteesme.jpg');
  }
  app.init();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
       .register('./service-worker.js')
       .then(function() { console.log('[ServiceWorker] Registered'); });
  }

})();
