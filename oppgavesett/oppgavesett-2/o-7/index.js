const tekst = document.querySelector("#tekst");

function update(){

    // Input
    const inputSize = document.querySelector("#inputSize");
    const inputFont = document.querySelector("#inputFont");
    const inputColor = document.querySelector("#inputColor");
    const inputBackground = document.querySelector("#inputBackground");

    // Faktiske verdier
    const size = inputSize.value;
    const font = inputFont.value;
    const color = inputColor.value;
    const colorBackground = inputBackground.value;

    // Set CSS styling
    tekst.style.fontSize = size;
    tekst.style.fontFamily = font;
    tekst.style.color = color;
    tekst.style.background = colorBackground;

}


