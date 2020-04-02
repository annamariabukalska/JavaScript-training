const flute = document.querySelector("#flute");
const trumpet = document.querySelector("#trumpet");
const horn = document.querySelector("#horn");

function playSound(name){

    allStop();

    if(name === "flute"){
        flute.play();
    }
    if(name === "trumpet"){
        trumpet.play();
    }
    if(name === "horn"){
        horn.play();
    }

}

function allStop(){
    flute.pause();
    trumpet.pause();
    horn.pause();
}


/*
function spillLydFluet() {
    flute.play();
}

function spillLydTrumpet(){
    trumpet.play();
}

function spillLydHorn(){
    horn.play();
}
*/
