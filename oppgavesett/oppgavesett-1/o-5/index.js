const navn = prompt("Hva heter du?");
const beskrivelse = prompt("Din beskrivelse");

document.write(`
<div>
    <h1>Hei ${navn}, du er en${beskrivelse}</h1>
</div>
`)