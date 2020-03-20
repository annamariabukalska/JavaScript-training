const bilde = prompt("Hvilke bildet velger du?");
const width = prompt("Hvor stor bilde vil du ha?");
const title = prompt("Hvilke titelen velger du?");


document.write(`
<article>
    
    <h1>${title}</h1>
    <img src="${bilde}" alt=${title} style="width:${width}px";>

    </article>
`)



