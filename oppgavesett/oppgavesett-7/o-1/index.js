mapboxgl.accessToken = 'pk.eyJ1IjoiYW5uYW1hcmlhYnVrYWxza2EiLCJhIjoiY2s4cG1rbXJsMDZsOTNsbDliYzE0MDZ0ciJ9.nS-rBSr1cFkCTVXAdpYG8A';

const knapper = document.querySelector("#knapper")
const flyknapper = document.querySelector("#flyknapper")

const map = new mapboxgl.Map({
    container: 'kartet',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 15,
    center: [10.701317, 59.927157]
});

const steder = [
    {
        navn: "Sirkusteltet Frognerparken",
        tekst: "Teater",
        lng: 10.700877, 
        lat: 59.928318,
    },
    {
        navn: "Vigelandsparken",
        tekst: "Skulpturmuseum",
        lng: 10.701371, 
        lat: 59.927168,
    }
]


const addMarker = (lokal) => {
    const div = document.createElement("div")
    div.className = "frognerparkenmarker"
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

const flyTil = (evt) => {
    const knapp = evt.target
    const lng = knapp.dataset.lng
    const lat = knapp.dataset.lat 

    map.flyTo({
        center: [lng, lat],
        zoom: 18
    })
}

map.on("load", addMarkers)

knapper.onclick = changeMode
flyknapper.onclick = flyTil
