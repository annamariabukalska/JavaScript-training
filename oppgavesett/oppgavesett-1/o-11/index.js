const prisutenmoms = prompt("Pris uten moms: ");
const moms = 1.25;

prismedmoms = (prisutenmoms * moms);

document.write(`
<div>
        <h1><b>Pris uten moms ${prisutenmoms}</b></h1>
        <p><b>Moms ${moms}</b></p>
        <p><b>Pris med moms ${prismedmoms}</b></p>
        

    </div>
`);

