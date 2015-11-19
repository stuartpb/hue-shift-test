var elSourceImage = document.getElementById('source');
var elShiftInput = document.getElementById('shift');
var elPickerInput = document.getElementById('picker');

var elOutputCanvas = document.getElementById('output');
var elHueShiftCanvas = elOutputCanvas.cloneNode();
var elRedDiffCanvas = elOutputCanvas.cloneNode();

var imageWidth, imageHeight;

var ctxOutput = elOutputCanvas.getContext('2d');
var ctxRedDiff = elRedDiffCanvas.getContext('2d');
var ctxHueShift = elHueShiftCanvas.getContext('2d');

function imageComposite(ctx,image,compositing,mixin) {
  ctx.globalCompositeOperation = 'copy';
  ctx.drawImage(image,0,0);
  ctx.globalCompositeOperation = compositing;
  if (typeof mixin == 'string') {
    ctx.fillStyle = mixin;
    ctx.fillRect(0,0,imageWidth,imageHeight);
  } else {
    ctx.drawImage(mixin,0,0);
  }
}

function updateCanvasSizes() {
  imageHeight = elSourceImage.height;
  imageWidth = elSourceImage.width;
  return [ elOutputCanvas,
    elHueShiftCanvas,
    elRedDiffCanvas ].forEach(function(canvas){
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
  imageComposite(ctxHueShift,elSourceImage,'difference',
    'hsl('+(hueShift+180)+',100%,50%)');
  ctxHueShift.drawImage(elRedDiffCanvas, 0, 0);
  ctxHueShift.drawImage(elSourceImage, 0, 0);
  imageComposite(ctxOutput, elSourceImage, 'hue', elHueShiftCanvas);
}

function setNewImageSource() {
  return elSourceImage.src = elPickerInput.value;
}

elPickerInput.addEventListener("input", setNewImageSource);

function updateImage() {
  updateCanvasSizes();
  imageComposite(ctxRedDiff,elSourceImage,'difference','#f00');
  updateShiftedHue();
}

elSourceImage.addEventListener('load', updateImage);

if (elSourceImage.complete) updateImage();
