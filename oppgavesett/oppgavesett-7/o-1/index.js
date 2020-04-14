mapboxgl.accessToken = 'pk.eyJ1IjoiYW5uYW1hcmlhYnVrYWxza2EiLCJhIjoiY2s4cG1rbXJsMDZsOTNsbDliYzE0MDZ0ciJ9.nS-rBSr1cFkCTVXAdpYG8A';

const knapper = document.querySelector("#knapper")
const flyknapper = document.querySelector("#flyknapper")

const map = new mapboxgl.Map({
    container: 'kartet',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 10,
    center: [10.730796, 59.912874]
});

const steder = [
    {
        navn: "Heidi",
        tekst: "Bestevenner fra barneskolen",
        lng: "10.760030",
        lat: "59.946535",
        bilde: "https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80",

    },
    {
        navn: "Izabella",
        tekst: "Bestevenner fra videregående skole",
        lng: "10.754844",
        lat: "59.928397",
        bilde: "https://images.unsplash.com/photo-1500522144261-ea64433bbe27?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"
    },
    {
        navn: "Olga",
        tekst: "Beste søstra i verden",
        lng: "10.817885",
        lat: "59.875949",
        bilde: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80"

    },
    {
        navn: "Molly",
        tekst: "Den beste vennine i verden",
        lng: "10.763360",
        lat: "59.948853",
        bilde: "https://images.unsplash.com/photo-1481214110143-ed630356e1bb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"
    }
]


const addMarker = (lokal) => {
    const div = document.createElement("div")
    div.className = "personer"
    div.style = `background-image: url(${lokal.bilde})`
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
