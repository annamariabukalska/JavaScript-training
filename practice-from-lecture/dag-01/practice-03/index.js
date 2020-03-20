//const navn = "Børre";
const navn = prompt("Hva heter du");
const padding = prompt("Hvor mye padding");


document.write(`
<div style="padding: 30px;">
    <h1>Hei ${navn}</h1>
    <p>Kjære ${navn}. Du har vunnet en iPhone</p>
</div>
`);

const tall1 = prompt("Gi meg et tall");

// Datatypene vi har sett på er String og Number
// Alt som kommer som input 