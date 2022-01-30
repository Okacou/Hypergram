const fileInput = document.getElementById('file-input');
const canvas = document.getElementById('canvas');
const brightnessSlider = document.getElementById('brightness');
const contrastSlider = document.getElementById('contrast');
const transparentSlider = document.getElementById('transparent');
const saveButton = document.getElementById('save-button');
let ctx = canvas.getContext("2d");
let image = new Image();

fileInput.addEventListener('change', function(ev) {
    if(ev.target.files) {
        let file = ev.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (e) {
            image.src = e.target.result;
            image.onload = function(ev) {
                console.log("Loading the image.")
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
            }
        }
    }
});

brightnessSlider.addEventListener("change", function(){
    changedPixelValues();
})
contrastSlider.addEventListener("change", function(){
    changedPixelValues();
})
transparentSlider.addEventListener("change", function(){
    changedPixelValues();
})

function changedPixelValues() {
    let brightness = parseInt(brightnessSlider.value);
    let contrast = parseInt(contrastSlider.value);
    let transparent = parseFloat(transparentSlider.value);

    ctx.drawImage(image, 0, 0);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imageData.data;
    let factor = 259 * (255 + contrast) / (255 * (259 - contrast));
    for (let i = 3; i < pixels.length; i += 4) {
        for (let j = 1; j < 4; j++) {
            pixels[i-j] = truncate(factor * (pixels[i-j] - 128) + 128 + brightness);
        }

        pixels[i] *= transparent;
    }

    imageData.data = pixels;

    ctx.putImageData(imageData, 0, 0);

    console.log("brightnessSlider.value =" + brightnessSlider.value);
    console.log("contrastSlider.value =" + contrastSlider.value);
    console.log("transparentSlider.value =" + transparentSlider.value);
}

function truncate(value) {
    if(value < 0) {
        return 0;
    }else if(value > 255){
        return 255;
    }else{
        return value;
    }
}

saveButton.addEventListener("click", function(){
    let image = canvas.toDataURL();
    let tmpLink = document.createElement("a");
    tmpLink.download = "result.png";
    tmpLink.href = image;

    document.body.appendChild( tmpLink );
    tmpLink.click();
    document.body.removeChild( tmpLink );
});