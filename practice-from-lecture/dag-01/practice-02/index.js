//ikke bruk var
//var etternavn = "Olsen";
//var OMKRETS = 200;

// Dette er en konstant
//const navn = "Anna";
//navn = "Per";  //dette er ikke lov, det går ikke å endre på navn i const

// Dette er en variabl
let poeng = 0;

// Endre poeng
poeng = 100;  // Poeng skal bli 100

//Hvordan kan jeg får 50 poeng?
poeng = poeng + 50;
// Dette har en kortform
poeng += 50;  //øke med 50

poeng ++; //øke med 1

console.log(poeng);

let navn = "Sverre";
//navn = navn + "Olsen";

navn += "Olsen"; // en annen variant enn navn = navn + "Olsen";

console.log(navn);

const hunden = prompt("Hva heter hunden din?");

document.write("Hunden din heter ");
document.write(hunden);


