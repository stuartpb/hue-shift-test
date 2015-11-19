var elSourceImage = document.getElementById('source');
var elShiftInput = document.getElementById('shift');
var elPickerInput = document.getElementById('picker');

var elOutputCanvas = document.getElementById('output');
var elChannelCanvas = document.createElement('canvas');

var imageWidth, imageHeight;

var ctxComposite = elOutputCanvas.getContext('2d');
var ctxChannel = elChannelCanvas.getContext('2d');

function mixChannel(inColor, outHue) {
  ctxChannel.globalCompositeOperation = 'copy';
  ctxChannel.drawImage(elSourceImage,0,0);
  ctxChannel.globalCompositeOperation = 'darken';
  ctxChannel.fillStyle = inColor;
  ctxChannel.fillRect(0,0,imageWidth,imageHeight);
  ctxChannel.globalCompositeOperation = 'hue';
  ctxChannel.fillStyle = 'hsl(' + outHue + ',100%,50%)';
  ctxChannel.fillRect(0,0,imageWidth,imageHeight);
  ctxComposite.drawImage(elChannelCanvas,0,0);
}

function updateCanvasSizes() {
  imageHeight = elSourceImage.height;
  imageWidth = elSourceImage.width;
  return [ elOutputCanvas,
    elChannelCanvas ].forEach(function(canvas){
      canvas.width = imageWidth;
      canvas.height = imageHeight;
  });
}

var hueShift = 0;

elShiftInput.addEventListener("input", function () {
  hueShift = parseInt(elShiftInput.value, 10);
  updateShiftedHue();
});

function updateShiftedHue() {
  ctxComposite.clearRect(0,0,imageWidth,imageHeight);
  ctxComposite.globalCompositeOperation = 'lighten';
  mixChannel('#f00', hueShift);
  mixChannel('#0f0', hueShift + 60);
  mixChannel('#00f', hueShift + 120);
  ctxComposite.globalCompositeOperation = 'destination-in';
  ctxComposite.drawImage(elSourceImage, 0, 0);
}

function setNewImageSource() {
  return elSourceImage.src = elPickerInput.value;
}

elPickerInput.addEventListener("input", setNewImageSource);

function updateImage() {
  updateCanvasSizes();
  updateShiftedHue();
}

elSourceImage.addEventListener('load', updateImage);

if (elSourceImage.complete) updateImage();
