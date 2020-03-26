function spillTromme(evt) {
    const tall = evt.keyCode
    
    const lyd = document.querySelector(`audio[data-key="${tall}"]`)
    
    if(!lyd) { 
        return 
    }
    
    // Spoler tilbake
    lyd.currentTime = 0
    lyd.play()
    
    
    const div = document.querySelector(`div[data-key="${tall}"]`)
    
    div.animate([
        {transform: "scale(2)", backgroundColor: "orange"},
        {transform: "scale(1)", backgroundColor: "transparent"}
    ], 40)
}


document.onkeydown = spillTromme