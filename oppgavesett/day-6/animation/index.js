const firkant = document.querySelector("#firkant")

const keyframes = [
    { transform: "scale(1)", backgroundColor: "peachpuff" },
    { transform: "scale(4)", backgroundColor: "purple" }
]

const settings = {
    duration: 1000,
    iterations: Infinity
}

firkant.animate(keyframes, settings)