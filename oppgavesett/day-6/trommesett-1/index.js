

function spillTromme(evt) {
    const tall = evt.keyCode
    const div = document.querySelector(`div[data-key="${tall}"]`)
    
    div.style.transform = "scale(2)"
}


document.onkeydown = spillTromme