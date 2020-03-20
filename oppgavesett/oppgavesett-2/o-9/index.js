 // Input
// Overskrift
const inputInfo1 = document.querySelector("#inputInfo1");

// URL til bilde
const inputInfo2 = document.querySelector("#inputInfo2");

function add(){

    // Faktiske verdier
    const overskrift = inputInfo1.value; // Verdi fra overskrift
    const bildeUrl = inputInfo2.value; // Verdi fra URL til bilde

    // Dette er vår list med artikler (div id="nyhetsartikler")
    const nyhetsartikler = document.querySelector("#nyhetsartikler");

    // Her legger vi til en ny artikkel i nyhetsartikler
    nyhetsartikler.innerHTML += `<div>
    <p>${overskrift}</p>
    <img src=${bildeUrl}/>
    </div>`;

    //inputInfo1.value = "";
    //inputInfo2.value = "";

}


