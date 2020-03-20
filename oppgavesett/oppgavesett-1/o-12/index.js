const fornavn = prompt("Hva heter du?");
const etternavn = prompt("Hva er ditt etternavn?");
const stilling = prompt("Hva er din stilling?");
const bilde = prompt("Har du bilde?");

document.write(`
<article>
        <h1>${fornavn} ${etternavn}</h1>
        <p><b>Stilling: </b>${stilling}</p>
        <img src="${bilde}" style="width: 300px;">

    </article>
`)

