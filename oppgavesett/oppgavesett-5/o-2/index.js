const inpBelop = document.querySelector("#inpBelop")

let total = 500;

function settPenger(){
    
    if (inpBelop.value.length === 0) {
        info.innerText = "Feil";
        return;
    }
    let belop = inpBelop.value;

    if (belop > total){
        info.innerText = "Du har ikke dekning";
    } else {
        total = total-belop;
        info.innerText = `Du har ${total},- på konto. Du tok ut ${belop},-`;
        inpBelop.value = "";

    }

}