const inpPassord1 = document.querySelector("#inpPassord1")
const inpPassord2 = document.querySelector("#inpPassord2")
const info = document.querySelector("#info")

function checkPassword(){
    
    if (inpPassord1.value.length === 0 && inpPassord2.value.length === 0) {
        info.innerText = "Fyll inn to like passord";
        return;
    }
    

    if(inpPassord1.value === inpPassord2.value) {
        info.innerText = "✅ Passordene er like"
    } else if (inpPassord1.value !== inpPassord2.value) {
        info.innerText = "Ulike"
    } else {
        info.innterText = "Fyll inn to like passord"
    }
}

checkPassword();