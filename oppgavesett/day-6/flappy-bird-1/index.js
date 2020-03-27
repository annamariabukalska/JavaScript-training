const main = document.querySelector("main")
const playBtn = document.querySelector("#playBtn")
const fugl = document.querySelector("#fugl")

let fart = 0.5
let g = 0.05
let yPos = 20

function fall() {
    
    fart = fart + g
    yPos = yPos + fart 
    
    fugl.style.top = yPos + "px"
}

function flaks() {
    fart = -4;
}

setInterval(fall, 10)

playBtn.onclick = () => {
    main.classList.toggle("pause")
    
    if(playBtn.innerText === "▶️") {
       playBtn.innerText = "⏸️" 
    } else {
        playBtn.innerText = "️️▶️"
    }
}

main.onclick = flaks
