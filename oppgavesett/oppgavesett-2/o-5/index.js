
const favoritter = document.querySelector("#favoritter");

favoritter.innerHTML += "<li>Fiskeboller</li>";

const favoritt1 = prompt("Hvilken favorittrett har du?");
const favoritt2 = prompt("Hvilken andre favorittretten har du?");
const favoritt3 = prompt("Hvilken tredje favorittretten har du?")

favoritter.innerHTML += `<li>${favoritt1}</li>`;
favoritter.innerHTML += `<li>${favoritt2}</li>`;
favoritter.innerHTML += `<li>${favoritt3}</li>`;
