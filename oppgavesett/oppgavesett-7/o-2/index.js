mapboxgl.accessToken = 'pk.eyJ1IjoiYW5uYW1hcmlhYnVrYWxza2EiLCJhIjoiY2s4cG1rbXJsMDZsOTNsbDliYzE0MDZ0ciJ9.nS-rBSr1cFkCTVXAdpYG8A';

const knapper = document.querySelector("#knapper")


const map = new mapboxgl.Map({
    container: 'kartet',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 11,
    center: [10.742320, 59.909624]
});




const addMarker = (lokal) => {
    const div = document.createElement("div")
    div.className = "mal"
    div.style = `background-image: url(${lokal.bilde}`
    
    const marker = new mapboxgl.Marker(div)
    const minPopup = new mapboxgl.Popup()
    minPopup.setHTML(`
        <h1>${lokal.navn}</h1>
        <p>${lokal.tekst}</p>
    `)


    marker.setLngLat([lokal.lng, lokal.lat])
    marker.setPopup(minPopup)

    marker.addTo(map)
}

const addMarkers = () => {
    for(const lokal of steder){
        addMarker(lokal)
    }
}

const changeMode = (evt) => {
    const knapp = evt.target
    const mode = knapp.dataset.mode

    map.setStyle(mode)
}

knapper.onclick = changeMode
map.on("load", addMarkers)