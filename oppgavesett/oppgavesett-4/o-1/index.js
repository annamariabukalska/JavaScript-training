const listMovies = document.querySelector("#listMovies");

const inpNyFilm = document.querySelector("#inpNyFilm");

const btn = document.querySelector("#btn");

let allMovies = ["About time", "Legally blonde", "Eat, prey and love", "Aladdin", "Tom and Jerry"];


console.log(allMovies[2], "Før oppdatering");

allMovies.push("Side om side")  // Legger inn en film på slutten av arrayet
//allMovies = [...varer, "Loff"] // Legger inn en film på slutten av arrayet


allMovies.unshift("James Bond") // Legger inn i starten av arrayet
//allMovies = ["Sjokomelk", ...varer]  // Legger inn i starten av arrayet

// allMovies = [] // Nuller ut arrayet mitt
console.log(`Filmen på plass nummer 3 i arrayet er ${allMovies[2]}`)
console.log(allMovies[2], "Etter oppdatering");

// allMovies.splice(3,"Spartacus");

function viewMovies(){

    listMovies.innerHTML = "";

    for(const movie of allMovies) {
        listMovies.innerHTML += `<li>${movie}</li>`;

    }
}

function addMovie() {
    allMovies = [...allMovies, inpNyFilm.value];
    viewMovies();
    inpNyFilm.value = "";

}

viewMovies();

btn.onclick = addMovie;