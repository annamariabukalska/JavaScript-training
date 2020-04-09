mapboxgl.accessToken = 'pk.eyJ1IjoiYW5uYW1hcmlhYnVrYWxza2EiLCJhIjoiY2s4cG1rbXJsMDZsOTNsbDliYzE0MDZ0ciJ9.nS-rBSr1cFkCTVXAdpYG8A';
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

map.on("load", addMarkers)