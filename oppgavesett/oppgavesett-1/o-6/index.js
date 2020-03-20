const forrett = prompt("Hvilken forrett velger du?");
const hovedrett = prompt("Hvilken hovedrett velger du?");
const dessert = prompt("Hvilken dessert velger du?")

document.write(`
<article>
    <h1>Meny</h1>
    <ul>
        <li>Forrett: ${forrett}</li>
        <li>Hovedrett: ${hovedrett}</li>
        <li>Dessert: ${dessert}</li>
    </ul>
</article>
`)


//<ol> sortert, eks. 1. 2.
//<ul> usortert, eks. . . . 