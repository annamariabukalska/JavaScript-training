const box = document.querySelector("#box");

function move(){

    // Input
    const inputX = document.querySelector("#inputX");
    const inputY = document.querySelector("#inputY");
    const inputWidth = document.querySelector("#inputWidth");
    const inputHeight = document.querySelector("#inputHeight");
    const inputCorner = document.querySelector("#inputCorner");

    // Faktiske verdier
    const x = inputX.value;
    const y = inputY.value;
    const width = inputWidth.value;
    const height = inputHeight.value;
    const corner = inputCorner.value;


    
    // X og Y
    box.style.left =`${x}px`;
    box.style.top = `${y}px`;

    // Bredde og høyde
    box.style.width =`${width}px`;
    box.style.height = `${height}px`;
    // Avrundede hjørner 🐝
    box.style.borderRadius = `${corner}px`

}